import { useState } from "react";
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

interface GamingAccount {
  platform: string;
  username: string;
  isConnected: boolean;
  logo: string;
  color: string;
}

export default function Settings() {
  const { user, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [fullName, setFullName] = useState(
    user?.user_metadata?.full_name || "",
  );
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
      platform: "PlayStation Network",
      username: "",
      isConnected: false,
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/PlayStation_logo.svg/2560px-PlayStation_logo.svg.png",
      color: "bg-[#0070d1]",
    },
    {
      platform: "Xbox Live",
      username: "",
      isConnected: false,
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Xbox_one_logo.svg/1024px-Xbox_one_logo.svg.png",
      color: "bg-[#107c10]",
    },
    {
      platform: "Nintendo",
      username: "",
      isConnected: false,
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Nintendo.svg/1024px-Nintendo.svg.png",
      color: "bg-[#e60012]",
    },
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateUserProfile({ full_name: fullName });
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

  const handleConnectAccount = (platform: string) => {
    // In a real app, this would redirect to the platform's OAuth flow
    // For demo purposes, we'll just simulate a connection
    toast({
      title: "Connecting account",
      description: `Redirecting to ${platform} for authentication...`,
    });

    // Simulate successful connection after a delay
    setTimeout(() => {
      setAccounts(
        accounts.map((account) =>
          account.platform === platform
            ? {
                ...account,
                isConnected: true,
                username: `${user?.email?.split("@")[0] || "user"}#${Math.floor(Math.random() * 10000)}`,
              }
            : account,
        ),
      );

      toast({
        title: "Account connected",
        description: `Your ${platform} account has been successfully linked.`,
      });
    }, 1500);
  };

  const handleDisconnectAccount = (platform: string) => {
    setAccounts(
      accounts.map((account) =>
        account.platform === platform
          ? { ...account, isConnected: false, username: "" }
          : account,
      ),
    );

    toast({
      title: "Account disconnected",
      description: `Your ${platform} account has been unlinked.`,
    });
  };

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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleDisconnectAccount(account.platform)
                          }
                        >
                          Disconnect
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className={account.color}
                          onClick={() => handleConnectAccount(account.platform)}
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Connect
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
