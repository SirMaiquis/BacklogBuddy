import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/App";
import { useToast } from "@/components/ui/use-toast";

export default function SteamCallback() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    let timeoutId: number;

    const handleCallback = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL;

        const response = await fetch(
          `${API_URL}/profile/steam/auth${location.search}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${user?.access_token}`,
            },
          },
        );

        if (!response.ok)
          throw new Error("Failed to complete Steam authentication");

        toast({
          title: "Success",
          description: "Steam account connected successfully!",
        });

        timeoutId = setTimeout(() => {
          navigate("/settings");
        }, 5000);
      } catch (error) {
        console.error("Steam callback error:", error);
        toast({
          title: "Error",
          description: "Failed to connect Steam account. Please try again.",
          variant: "destructive",
        });
        timeoutId = setTimeout(() => {
          navigate("/settings");
        }, 5000);
      }
    };

    handleCallback();

    return () => clearTimeout(timeoutId);
  }, [location.search, user, navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">
          Connecting Steam Account
        </h2>
        <p className="text-muted-foreground">
          Please wait while we complete the connection...
        </p>
      </div>
    </div>
  );
}
