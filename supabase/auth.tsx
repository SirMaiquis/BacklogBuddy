import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import { BacklogBuddyApiClient } from "@/lib/api-client/backlog-buddy-api/backlog-buddy-api.client";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (data: { [key: string]: any }) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state (signed in, signed out, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    if (error) throw error;
  };

  const signIn = async (email: string, password: string) => {
    const backlogBuddyApiClient = new BacklogBuddyApiClient();
    const response = await backlogBuddyApiClient.signIn({
      email,
      password,
    });

    if (!response?.user?.id) {
      throw new Error("Failed to sign in");
    }
    const userData = {
      ...response.user,
      access_token: response.session.access_token,
    };
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    return userData;
  };

  const signOut = async () => {
    const backlogBuddyApiClient = new BacklogBuddyApiClient();
    const response = await backlogBuddyApiClient.signOut({
      authorizationToken: user?.access_token,
    });

    if (!response?.success) {
      throw new Error("Failed to sign out");
    }

    setUser(null);
    localStorage.removeItem("user");
  };

  const updateUserProfile = async (data: { [key: string]: any }) => {
    const { error } = await supabase.auth.updateUser({
      data,
    });
    if (error) throw error;
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signIn, signUp, signOut, updateUserProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
