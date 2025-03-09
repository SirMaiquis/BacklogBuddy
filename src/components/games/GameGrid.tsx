import { useState, useEffect } from "react";
import { GameCard } from "./GameCard";
import { EmptyState } from "@/components/ui/empty-state";
import { Game } from "@/types/game";
import { Gamepad2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface GameGridProps {
  games: Game[];
  isLoading?: boolean;
  emptyStateAction?: () => void;
}

export function GameGrid({
  games,
  isLoading = false,
  emptyStateAction,
}: GameGridProps) {
  const navigate = useNavigate();
  const [displayGames, setDisplayGames] = useState<Game[]>([]);

  useEffect(() => {
    setDisplayGames(games);
  }, [games]);

  const handleGameClick = (gameId: string) => {
    navigate(`/games/${gameId}`);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-100 animate-pulse rounded-lg h-[300px]"
          ></div>
        ))}
      </div>
    );
  }

  if (displayGames.length === 0) {
    return (
      <EmptyState
        icon={<Gamepad2 size={48} />}
        title="No games found"
        description="Add your first game to start building your collection."
        actionLabel="Add Game"
        onAction={emptyStateAction}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {displayGames.map((game) => (
        <GameCard
          key={game.id}
          game={game}
          onClick={() => handleGameClick(game.id)}
        />
      ))}
    </div>
  );
}
