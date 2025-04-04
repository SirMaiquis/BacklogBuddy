import { useState, useEffect } from "react";
import { useAuth } from "@/App";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Gamepad2,
  ArrowLeft,
  Save,
  User,
  Link2,
  ExternalLink,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/Header";
import { BacklogBuddyProfileApiClient } from "@/lib/api-client/backlog-buddy-api/profile/backlog-buddy-api.profile.client";
import { BacklogBuddyGamesApiClient } from "@/lib/api-client/backlog-buddy-api/games/backlog-buddy-api.games.client";

interface GamingAccount {
  platform: string;
  username: string;
  isConnected: boolean;
  logo: string;
  color: string;
  disabled?: boolean;
}

export default function Settings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [accounts, setAccounts] = useState<GamingAccount[]>([
    {
      platform: "Steam",
      username: "",
      isConnected: false,
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Steam_icon_logo.svg/512px-Steam_icon_logo.svg.png",
      color: "bg-[#171a21]",
    },
    {
      platform: "PlayStation Network (Coming Soon)",
      username: "",
      isConnected: false,
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/PlayStation_logo.svg/2560px-PlayStation_logo.svg.png",
      color: "bg-[#0070d1]",
      disabled: true,
    },
    {
      platform: "Xbox Live (Coming Soon)",
      username: "",
      isConnected: false,
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Xbox_one_logo.svg/1024px-Xbox_one_logo.svg.png",
      color: "bg-[#107c10]",
      disabled: true,
    },
    {
      platform: "Nintendo (Coming Soon)",
      username: "",
      isConnected: false,
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Nintendo.svg/1024px-Nintendo.svg.png",
      color: "bg-[#e60012]",
      disabled: true,
    },
  ]);
  const backlogBuddyApiClient = new BacklogBuddyProfileApiClient();
  const backlogBuddyGamesApiClient = new BacklogBuddyGamesApiClient();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await backlogBuddyApiClient.getProfile();

        setFullName(response.name);

        setAccounts(
          accounts.map((account) => {
            if (account.platform === "Steam" && response.steam_id) {
              return {
                ...account,
                isConnected: true,
                username: response.steam_id,
              };
            }
            return account;
          }),
        );
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    };

    if (user?.access_token) {
      loadProfile();
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await backlogBuddyApiClient.updateProfile({
        name: fullName,
        preferred_theme: "dark", // We'll keep this static for now as theme is handled separately
      });
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectAccount = async (platform: string) => {
    if (platform === "Steam") {
      try {
        const response = await backlogBuddyApiClient.initLink("steam");
        if (!response.url) {
          throw new Error("Failed to initiate Steam auth");
        }

        window.location.href = response.url;
      } catch (error) {
        console.error("Steam auth error:", error);
        toast({
          title: "Error",
          description: "Failed to connect Steam account. Please try again.",
          variant: "destructive",
        });
      }
      return;
    }

    toast({
      title: "Coming Soon",
      description: `${platform} integration will be available soon!`,
    });
  };

  const [isImporting, setIsImporting] = useState(false);

  const handleImportGames = async (platform: string) => {
    if (platform === "Steam") {
      const confirmed = window.confirm(
        "Are you sure you want to import your Steam games? This will add all your Steam games to your Backlog Buddy collection.",
      );
      if (!confirmed) return;

      try {
        setIsImporting(true);
        toast({
          title: "Import Started",
          description:
            "We're importing your Steam games. This process runs in the background and may take up to 10 minutes. You can continue using the app normally.",
        });

        await backlogBuddyGamesApiClient.importGames("steam");
      } catch (error) {
        console.error("Steam import error:", error);
        toast({
          title: "Error",
          description: "Failed to start game import. Please try again.",
          variant: "destructive",
        });
      }
      return;
    }

    toast({
      title: "Coming Soon",
      description: `${platform} integration will be available soon!`,
    });
  };

  const handleDisconnectAccount = async (platform: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to disconnect your ${platform} account? This will remove access to your ${platform.toLowerCase()} games library.`,
    );
    if (!confirmed) return;

    if (platform === "Steam") {
      try {
        const response = await backlogBuddyApiClient.unlink("steam");
        if (!response.success) {
          throw new Error("Failed to disconnect Steam account");
        }

        if (!response.success)
          throw new Error("Failed to disconnect Steam account");

        setAccounts(
          accounts.map((account) =>
            account.platform === platform
              ? { ...account, isConnected: false, username: "" }
              : account,
          ),
        );

        toast({
          title: "Account disconnected",
          description: "Your Steam account has been unlinked.",
        });
      } catch (error) {
        console.error("Steam disconnect error:", error);
        toast({
          title: "Error",
          description: "Failed to disconnect Steam account. Please try again.",
          variant: "destructive",
        });
      }
      return;
    }

    toast({
      title: "Coming Soon",
      description: `${platform} integration will be available soon!`,
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto p-6 max-w-3xl">
          <div className="space-y-6">
            <div className="h-10 w-24 bg-muted rounded animate-pulse" />
            <div className="h-8 w-48 bg-muted rounded animate-pulse" />
            <div className="space-y-4">
              <div className="h-[200px] bg-muted rounded animate-pulse" />
              <div className="h-[300px] bg-muted rounded animate-pulse" />
              <div className="h-[200px] bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto p-6 max-w-3xl">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Settings
          </h1>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>
                  Manage your personal information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-col md:flex-row gap-6 mb-6">
                    <div className="flex flex-col items-center gap-3">
                      <Avatar className="h-24 w-24">
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
                          alt={user?.email || ""}
                        />
                        <AvatarFallback>
                          <User className="h-12 w-12" />
                        </AvatarFallback>
                      </Avatar>
                      <p className="text-sm text-muted-foreground">
                        Avatar based on your email
                      </p>
                    </div>

                    <div className="flex-1 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          value={user?.email || ""}
                          disabled
                          className="bg-muted/50"
                        />
                        <p className="text-xs text-muted-foreground">
                          Your email cannot be changed
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Enter your full name"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        "Saving..."
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" /> Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link2 className="h-5 w-5" /> Connected Accounts
                </CardTitle>
                <CardDescription>
                  Link your gaming accounts to automatically import your games
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {accounts.map((account) => (
                    <div
                      key={account.platform}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-md flex items-center justify-center ${account.color} p-1.5`}
                        >
                          <img
                            src={account.logo}
                            alt={account.platform}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">{account.platform}</h3>
                          {account.isConnected ? (
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className="text-xs bg-green-500/10 text-green-600 border-green-200"
                              >
                                Connected
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {account.username}
                              </span>
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              Not connected
                            </p>
                          )}
                        </div>
                      </div>
                      {account.isConnected ? (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleImportGames(account.platform)}
                            disabled={isImporting}
                          >
                            {isImporting ? "Importing..." : "Import Games"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleDisconnectAccount(account.platform)
                            }
                          >
                            Disconnect
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          className={`${account.color} text-white dark:text-white`}
                          onClick={() => handleConnectAccount(account.platform)}
                          disabled={account.disabled}
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          {account.disabled ? "Soon" : "Connect"}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between text-sm text-muted-foreground border-t pt-6">
                <p>Connecting accounts allows automatic game library syncing</p>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>Customize your experience</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Theme</h3>
                      <p className="text-sm text-muted-foreground">
                        Choose between light and dark mode
                      </p>
                    </div>
                    <ThemeToggle />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Default Dashboard View</h3>
                      <p className="text-sm text-muted-foreground">
                        Choose which tab to show by default
                      </p>
                    </div>
                    <select className="p-2 rounded-md border border-input bg-background">
                      <option value="all">All Games</option>
                      <option value="backlog">Backlog</option>
                      <option value="playing">Playing</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between text-sm text-muted-foreground">
                <p>Preferences are saved automatically</p>
              </CardFooter>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
