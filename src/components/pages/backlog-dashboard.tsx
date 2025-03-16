import { useState, useEffect } from "react";
import { GameTabs } from "@/components/games/GameTabs";
import { GameStats } from "@/components/games/GameStats";
import { Header } from "@/components/layout/Header";
import { WelcomeMessage } from "@/components/dashboard/WelcomeMessage";
import { useAuth } from "@/App";
import { Game } from "@/types/game";
import { fetchGames } from "@/lib/api";

export default function BacklogDashboard() {
  const { user } = useAuth();
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);

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
      <Header />
      <div className="container mx-auto p-6 pt-24 space-y-8">
        {!isLoading && games.length === 0 && showWelcome && (
          <div className="animate-in slide-in-from-top duration-500">
            <WelcomeMessage onDismiss={() => setShowWelcome(false)} />
          </div>
        )}
        <GameStats games={games} />
        <GameTabs />
      </div>
    </div>
  );
}
