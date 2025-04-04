import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GAME_PLATFORMS, GAME_GENRES, GAME_STATUSES } from "@/types/game";
import { createGame } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { GameSelector } from "./GameSelector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BacklogBuddyGamesApiClient } from "@/lib/api-client/backlog-buddy-api/games/backlog-buddy-api.games.client";

interface AddGameDialogProps {
  onGameAdded: () => void;
  trigger?: React.ReactNode;
}

export function AddGameDialog({ onGameAdded, trigger }: AddGameDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("search");
  const [selectedExternalGame, setSelectedExternalGame] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    cover_art: "",
    platform: "",
    genre: "",
    genres: [] as string[],
    status: "backlog",
    playtime: 0,
    igdb_id: "",
    rating: 0,
    time_to_beat: {
      hastily: 0,
      normally: 0,
      completionist: 0,
    },
    game_modes: [] as string[],
  });
  const backlogBuddyGamesApiClient = new BacklogBuddyGamesApiClient();

  const handleChange = (
    field: string,
    value: string | string[] | number | object,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleExternalGameSelect = (game: any) => {
    setSelectedExternalGame(game);
    setFormData({
      ...formData,
      title: game.title,
      cover_art: game.cover_art,
      platform: game.platform,
      genre: game.genre,
      genres: game.genres || [],
      igdb_id: game.igdb_id,
      rating: game.rating || 0,
      time_to_beat: game.time_to_beat || {
        hastily: 0,
        normally: 0,
        completionist: 0,
      },
      game_modes: game.game_modes || [],
    });
    setActiveTab("details");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log(formData);
      const response = await backlogBuddyGamesApiClient.createGame(
        {
          igdb_id: parseInt(formData.igdb_id),
          status: formData.status,
          playtime: formData.playtime,
        }
      );

      toast({
        title: "Game added",
        description: "Your game has been added to your collection.",
      });

      setFormData({
        title: "",
        cover_art: "",
        platform: "",
        genre: "",
        genres: [],
        status: "backlog",
        playtime: 0,
        igdb_id: "",
        rating: 0,
        time_to_beat: {
          hastily: 0,
          normally: 0,
          completionist: 0,
        },
        game_modes: [],
      });
      setSelectedExternalGame(null);
      setActiveTab("search");

      onGameAdded();
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add game. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button>Add Game</Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Game</DialogTitle>
          <DialogDescription>
            Search for a game or manually enter details to add it to your
            collection.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="search">Search Game</TabsTrigger>
            <TabsTrigger value="details">Game Details</TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-4 py-4">
            <GameSelector
              onSelect={handleExternalGameSelect}
              onCancel={() => setOpen(false)}
            />
          </TabsContent>

          <TabsContent value="details">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                {selectedExternalGame && (
                  <div className="bg-muted/30 p-3 rounded-md text-sm">
                    <p className="font-medium">
                      Selected Game: {selectedExternalGame.title}
                    </p>
                    <p className="text-muted-foreground">
                      This game will be linked to your collection from the IGDB
                      database.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleChange("status", value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {GAME_STATUSES.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="playtime" className="text-right">
                    Hours Played
                  </Label>
                  <Input
                    id="playtime"
                    type="number"
                    min="0"
                    value={formData.playtime}
                    onChange={(e) =>
                      handleChange("playtime", e.target.value)
                    }
                    className="col-span-3"
                    placeholder="Hours played"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("search")}
                  className="mr-auto"
                >
                  Back to Search
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Adding..." : "Add Game"}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
