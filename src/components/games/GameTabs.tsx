import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GameGrid } from "./GameGrid";
import { GameFilters, GameFilters as GameFiltersType } from "./GameFilters";
import { AddGameDialog } from "./AddGameDialog";
import { Button } from "@/components/ui/button";
import { Plus, Layers, Archive, Gamepad, Trophy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { GameResponse } from "@/lib/api-client/backlog-buddy-api/games/types/responses/games.response";
import { BacklogBuddyGamesApiClient } from "@/lib/api-client/backlog-buddy-api/games/backlog-buddy-api.games.client";

export function GameTabs() {
  const [games, setGames] = useState<GameResponse[]>([]);
  const [filteredGames, setFilteredGames] = useState<GameResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [filters, setFilters] = useState<GameFiltersType>({
    search: "",
    platform: "",
    genre: "",
    favorites: false,
  });

  const backlogBuddyGamesApiClient = new BacklogBuddyGamesApiClient();

  const loadGames = async () => {
    setIsLoading(true);
    try {
      console.log("Loading games from GameTabs.tsx");
      const data = await backlogBuddyGamesApiClient.getGames();
      setGames(data);
    } catch (error) {
      console.error("Failed to load games:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGames();
  }, []);

  useEffect(() => {
    let result = [...games];

    // Filter by tab (status)
    if (activeTab !== "all") {
      result = result.filter((game) => game.status === activeTab);
    }

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter((game) =>
        game.title.toLowerCase().includes(searchLower),
      );
    }

    // Apply favorites filter
    if (filters.favorites) {
      result = result.filter((game) => game.favorite === true);
    }

    setFilteredGames(result);
  }, [games, activeTab, filters]);

  const handleFilterChange = (newFilters: GameFiltersType) => {
    setFilters(newFilters);
  };

  // Count games by status
  const allGamesCount = games.length;
  const backlogGamesCount = games.filter(
    (game) => game.status === "backlog",
  ).length;
  const playingGamesCount = games.filter(
    (game) => game.status === "playing",
  ).length;
  const completedGamesCount = games.filter(
    (game) => game.status === "completed",
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          My Game Collection
        </h2>
        <AddGameDialog
          onGameAdded={loadGames}
          trigger={
            <Button
              id="add-game-button"
              className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-md"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Game
            </Button>
          }
        />
      </div>

      <GameFilters onFilterChange={handleFilterChange} />

      <Card className="p-1 shadow-md">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 bg-muted/50 p-1">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md"
            >
              <Layers className="h-4 w-4 mr-2 hidden sm:inline-block" />
              All{" "}
              <span className="ml-1.5 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full hidden sm:inline-block">
                {allGamesCount}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="backlog"
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md"
            >
              <Archive className="h-4 w-4 mr-2 hidden sm:inline-block" />
              Backlog{" "}
              <span className="ml-1.5 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full hidden sm:inline-block">
                {backlogGamesCount}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="playing"
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md"
            >
              <Gamepad className="h-4 w-4 mr-2 hidden sm:inline-block" />
              Playing{" "}
              <span className="ml-1.5 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full hidden sm:inline-block">
                {playingGamesCount}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md"
            >
              <Trophy className="h-4 w-4 mr-2 hidden sm:inline-block" />
              Completed{" "}
              <span className="ml-1.5 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full hidden sm:inline-block">
                {completedGamesCount}
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6 px-1">
            <GameGrid
              games={filteredGames}
              isLoading={isLoading}
              emptyStateAction={() =>
                document.getElementById("add-game-button")?.click()
              }
            />
          </TabsContent>

          <TabsContent value="backlog" className="mt-6 px-1">
            <GameGrid
              games={filteredGames}
              isLoading={isLoading}
              emptyStateAction={() =>
                document.getElementById("add-game-button")?.click()
              }
            />
          </TabsContent>

          <TabsContent value="playing" className="mt-6 px-1">
            <GameGrid
              games={filteredGames}
              isLoading={isLoading}
              emptyStateAction={() =>
                document.getElementById("add-game-button")?.click()
              }
            />
          </TabsContent>

          <TabsContent value="completed" className="mt-6 px-1">
            <GameGrid
              games={filteredGames}
              isLoading={isLoading}
              emptyStateAction={() =>
                document.getElementById("add-game-button")?.click()
              }
            />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
