import { useState, useEffect } from "react";
import { GameTabs } from "@/components/games/GameTabs";
import { GameStats } from "@/components/games/GameStats";
import TopNavigation from "@/components/dashboard/layout/TopNavigation";
import { useAuth } from "@/App";
import { Game } from "@/types/game";
import { fetchGames } from "@/lib/api";

export default function BacklogDashboard() {
  const { user } = useAuth();
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <TopNavigation />
      <div className="container mx-auto p-6 pt-24 space-y-8">
        <GameStats games={games} />
        <GameTabs />
      </div>
    </div>
  );
}
