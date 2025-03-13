import React, { createContext, useContext, useState } from "react";

type AuthContextType = {
  user: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (data: { [key: string]: any }) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  updateUserProfile: async () => {},
});

export function MockAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);

  const mockSignIn = async () => {
    setUser({
      email: "user@example.com",
      user_metadata: { full_name: "Test User" },
    });
  };

  const mockSignOut = async () => {
    setUser(null);
  };

  const mockSignUp = async () => {
    setUser({
      email: "newuser@example.com",
      user_metadata: { full_name: "New User" },
    });
  };

  const mockUpdateUserProfile = async () => {
    // Mock implementation
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading: false,
        signIn: mockSignIn,
        signUp: mockSignUp,
        signOut: mockSignOut,
        updateUserProfile: mockUpdateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
