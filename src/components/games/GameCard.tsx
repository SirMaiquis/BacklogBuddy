import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Game } from "@/types/game";
import { Clock, Trophy } from "lucide-react";

interface GameCardProps {
  game: Game;
  onClick?: () => void;
}

export function GameCard({ game, onClick }: GameCardProps) {
  const defaultCoverArt =
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&q=80";

  // Status colors
  const statusColors = {
    backlog: "border-slate-500",
    playing: "border-blue-500",
    completed: "border-green-500",
  };

  return (
    <Card
      className={`overflow-hidden hover:shadow-lg transition-all cursor-pointer h-full flex flex-col border-t-4 ${statusColors[game.status]} transform hover:-translate-y-1`}
      onClick={onClick}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted/30">
        <img
          src={game.cover_art || defaultCoverArt}
          alt={game.title}
          className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2">
          <Badge
            className={`
              ${game.status === "backlog" ? "bg-slate-500 text-white" : ""}
              ${game.status === "playing" ? "bg-blue-500 text-white" : ""}
              ${game.status === "completed" ? "bg-green-500 text-white" : ""}
              shadow-md
            `}
          >
            {game.status === "backlog" ? "Backlog" : ""}
            {game.status === "playing" ? "Playing" : ""}
            {game.status === "completed" ? "Completed" : ""}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4 flex-grow">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1 hover:line-clamp-none transition-all">
          {game.title}
        </h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {game.platform && (
            <Badge variant="outline" className="text-xs">
              {game.platform}
            </Badge>
          )}
          {game.genre && (
            <Badge variant="secondary" className="text-xs">
              {game.genre}
            </Badge>
          )}
        </div>
        {game.completion_percentage !== undefined && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Trophy className="h-3 w-3" /> Completion
              </span>
              <span>{game.completion_percentage}%</span>
            </div>
            <Progress
              value={game.completion_percentage}
              className="h-1.5"
              indicatorClassName={
                game.status === "completed" ? "bg-green-500" : ""
              }
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="px-4 py-3 border-t bg-muted/20">
        <div className="w-full flex justify-between items-center">
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {game.playtime ? `${game.playtime} hours` : "Not played yet"}
          </div>
          {game.achievements_earned !== undefined &&
            game.achievements_total !== undefined && (
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Trophy className="h-3 w-3" />
                {game.achievements_earned}/{game.achievements_total}
              </div>
            )}
        </div>
      </CardFooter>
    </Card>
  );
}
