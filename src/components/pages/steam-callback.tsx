import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/App";
import { useToast } from "@/components/ui/use-toast";
import { BacklogBuddyProfileApiClient } from "@/lib/api-client/backlog-buddy-api/profile/backlog-buddy-api.profile.client";

export default function SteamCallback() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const backlogBuddyProfileApiClient = new BacklogBuddyProfileApiClient();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleCallback = async () => {
      try {
        const response = await backlogBuddyProfileApiClient.confirmLinking("steam", location.search);
        if (!response.success) {
          throw new Error("Failed to complete Steam authentication");
        }

        timeoutId = setTimeout(() => {
          toast({
            title: "Success",
            description: "Steam account connected successfully!",
          });
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
  }, [location.search]);

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
