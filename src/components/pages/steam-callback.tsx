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
    const handleCallback = async () => {
      try {
        const response = await fetch(
          `https://3wn67830-3000.use2.devtunnels.ms/profile/steam/auth${location.search}`,
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

        navigate("/settings");
      } catch (error) {
        console.error("Steam callback error:", error);
        toast({
          title: "Error",
          description: "Failed to connect Steam account. Please try again.",
          variant: "destructive",
        });
        navigate("/settings");
      }
    };

    handleCallback();
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
