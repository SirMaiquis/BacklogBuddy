import { useState, useEffect } from "react";
import { fetchExternalGames } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Star } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { CustomScrollArea } from "@/components/ui/custom-scroll-area";
import { GameSearchResponse } from "@/lib/api-client/backlog-buddy-api/games/types/responses/game-search.response";
import { BacklogBuddyGamesApiClient } from "@/lib/api-client/backlog-buddy-api/games/backlog-buddy-api.games.client";
interface GameSelectorProps {
  onSelect: (game: any) => void;
  onCancel: () => void;
}

export function GameSelector({ onSelect, onCancel }: GameSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [games, setGames] = useState<GameSearchResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const backlogBuddyApiClient = new BacklogBuddyGamesApiClient();

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async (search: string = "") => {
    setIsLoading(true);
    try {
      const data = await backlogBuddyApiClient.searchGames({ name: search });
      setGames(data);
    } catch (error) {
      console.error("Failed to load games:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    loadGames(searchTerm);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for games..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-8"
          />
        </div>
        <Button onClick={handleSearch}>Search</Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-24 bg-muted animate-pulse rounded-md"
            ></div>
          ))}
        </div>
      ) : (
        <CustomScrollArea className="h-[400px]">
          <div className="space-y-2 pr-2">
            {games.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No games found. Try a different search term.
              </p>
            ) : (
              games.map((game) => (
                <Card
                  key={game.igdb_id}
                  className="hover:bg-accent/50 cursor-pointer transition-colors"
                  onClick={() => onSelect(game)}
                >
                  <CardContent className="p-4 flex gap-4">
                    <div className="w-16 h-20 overflow-hidden rounded-md flex-shrink-0">
                      <img
                        src={game.cover_art}
                        alt={game.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-medium">{game.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{game.rating}</span>
                        <Separator
                          orientation="vertical"
                          className="h-3 mx-1"
                        />
                        <span>{game.platforms[0]}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {game.genres?.slice(0, 3).map((genre: string) => (
                          <Badge
                            key={genre}
                            variant="outline"
                            className="text-xs"
                          >
                            {genre}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CustomScrollArea>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
