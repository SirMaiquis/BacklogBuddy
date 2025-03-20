import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Game } from "@/types/game";
import {
  Clock,
  Trophy,
  Star,
  ListTodo,
  PlayCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateGame } from "@/lib/api";
import { GameResponse } from "@/lib/api-client/backlog-buddy-api/types/games/responses/games.response";

interface GameCardProps {
  game: GameResponse;
  onClick?: () => void;
  onUpdate?: (updatedGame: GameResponse) => void;
}

export function GameCard({ game, onClick, onUpdate }: GameCardProps) {
  const handleStatusChange = async (status: GameResponse["status"]) => {
    if (!onUpdate) return;
    const updated = await updateGame(game.id, { status });
    onUpdate(updated);
  };

  const handleFavoriteToggle = async () => {
    if (!onUpdate) return;
    const updated = await updateGame(game.id, { favorite: !game.favorite });
    onUpdate(updated);
  };
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
      className={`overflow-hidden hover:shadow-lg transition-all h-full flex flex-col border-t-4 ${statusColors[game.status]} transform hover:-translate-y-1`}
    >
      <div className="group relative aspect-[3/4] w-full overflow-hidden bg-muted/30">
        <div className="absolute top-2 right-2 flex gap-2 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                {game.status === "backlog" && <ListTodo className="h-4 w-4" />}
                {game.status === "playing" && (
                  <PlayCircle className="h-4 w-4" />
                )}
                {game.status === "completed" && (
                  <CheckCircle2 className="h-4 w-4" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusChange("backlog");
                }}
              >
                <ListTodo className="h-4 w-4 mr-2" /> Move to Backlog
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusChange("playing");
                }}
              >
                <PlayCircle className="h-4 w-4 mr-2" /> Start Playing
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusChange("completed");
                }}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" /> Mark as Completed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="secondary"
            size="sm"
            className={`opacity-0 group-hover:opacity-100 transition-opacity ${game.favorite ? "bg-yellow-100 hover:bg-yellow-200" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              handleFavoriteToggle();
            }}
          >
            <Star
              className={`h-4 w-4 ${game.favorite ? "fill-yellow-400 text-yellow-400" : ""}`}
            />
          </Button>
        </div>
        <div onClick={onClick} className="cursor-pointer">
          <img
            src={game.cover_art || defaultCoverArt}
            alt={game.title}
            className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
          />
        </div>
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
        {game.favorite && (
          <div className="absolute top-2 left-2">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 drop-shadow-md" />
          </div>
        )}
      </div>
      <CardContent className="p-4 flex-grow">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1 hover:line-clamp-none transition-all">
          {game.title}
        </h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {true && (
            <Badge variant="outline" className="text-xs">
              Platform
            </Badge>
          )}
          {true && (
            <Badge variant="secondary" className="text-xs">
              Genre
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
