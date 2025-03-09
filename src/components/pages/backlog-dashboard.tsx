import { useState, useEffect } from "react";
import { GameTabs } from "../games/GameTabs";
import { GameStats } from "../games/GameStats";
import { fetchGames } from "@/lib/api";
import { Game } from "@/types/game";
import { Gamepad2, User, LogOut, Search, Home, Settings } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "../../../supabase/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

export default function BacklogDashboard() {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadGames = async () => {
      setIsLoading(true);
      try {
        const data = await fetchGames();
        setGames(data);
      } catch (error) {
        console.error("Failed to load games:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadGames();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <Gamepad2 className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Backlog Buddy
              </span>
            </Link>
          </div>

          <div className="hidden md:flex md:flex-1 md:items-center md:justify-center px-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search your games..."
                className="w-full pl-8 bg-background border-muted"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="hidden sm:flex"
              title="Home"
            >
              <Home className="h-5 w-5" />
            </Button>
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
                      alt={user?.email || ""}
                    />
                    <AvatarFallback>
                      {user?.email?.[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6 space-y-8 pt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                Your Gaming Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Track, organize, and conquer your gaming collection
              </p>
            </div>
            <div className="md:hidden relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search your games..."
                className="w-full pl-8 bg-background border-muted"
              />
            </div>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-muted rounded-xl"></div>
            <div className="h-64 bg-muted rounded-xl"></div>
          </div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-8"
            >
              <GameStats games={games} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <GameTabs />
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
