import {
  Suspense,
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { Navigate, Route, Routes, useRoutes } from "react-router-dom";
import routes from "tempo-routes";
import LoginForm from "./components/auth/LoginForm";
import SignUpForm from "./components/auth/SignUpForm";
import ResetPasswordForm from "./components/auth/ResetPasswordForm";
import Success from "./components/pages/success";
import SteamCallback from "./components/pages/steam-callback";
import Home from "./components/pages/home";
import BacklogDashboard from "./components/pages/backlog-dashboard";
import GameDetailPage from "./components/pages/game-detail-page";
import Settings from "./components/pages/settings";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { BacklogBuddyAuthApiClient } from "./lib/api-client/backlog-buddy-api/auth/backlog-buddy-api.auth.client";

type AuthContextType = {
  user: any | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
});

const backlogBuddyAuthApiClient = new BacklogBuddyAuthApiClient();
const refreshTokenExpirationTime = import.meta.env.VITE_REFRESH_TOKEN_EXPIRATION_TIME;

function useAuth() {
  return useContext(AuthContext);
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const runPeriodicTask = async () => {
      console.log("🔁 Running periodic task every 30 minutes");
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const refreshResponse = await backlogBuddyAuthApiClient.refreshSession();
          if (refreshResponse?.session) {
            const userData = {
              ...refreshResponse.user,
              access_token: refreshResponse.session.access_token,
              refresh_token: refreshResponse.session.refresh_token,
            };
            localStorage.setItem("user", JSON.stringify(userData));
            setUser(userData);
          }
        } catch (error) {
          console.error("Failed to parse user from localStorage", error);
          localStorage.removeItem("user");
        }
      }
      setLoading(false);
    };

    const interval = setInterval(runPeriodicTask, refreshTokenExpirationTime);

    return () => clearInterval(interval);
  }, []);

  async function signOut() {
    try {
      const response = await backlogBuddyAuthApiClient.signOut({
        authorizationToken: user.session.access_token,
      });

      if (!response?.success) {
        throw new Error("Failed to sign out");
      }

      localStorage.removeItem("user");
      setUser(null);
    } catch (error) {
      console.error("Sign out error:", error);
      localStorage.removeItem("user");
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const tempoRoutes =
    import.meta.env.VITE_TEMPO === "true" ? useRoutes(routes) : null;

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/reset-password" element={<ResetPasswordForm />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <BacklogDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/games/:id"
          element={
            <PrivateRoute>
              <GameDetailPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
        />
        <Route path="/success" element={<Success />} />
        <Route path="/auth/steam" element={<SteamCallback />} />
      </Routes>
      {tempoRoutes}
    </>
  );
}

function App() {

  return (
    <ThemeProvider defaultTheme="dark">
      <AuthProvider>
        <Suspense fallback={<p>Loading...</p>}>
          <AppRoutes />
        </Suspense>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}

export { useAuth };
export default App;
