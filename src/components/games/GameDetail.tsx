import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { GAME_STATUSES, GAME_GENRES, GAME_MODES } from "@/types/game";
import {
  fetchGame,
  updateGame,
  deleteGame,
  fetchGameNotes,
  createGameNote,
  updateGameNote,
  deleteGameNote,
} from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { Game, GameNote } from "@/types/game";
import {
  ArrowLeft,
  Clock,
  Trophy,
  Percent,
  Trash,
  Edit,
  Save,
  Plus,
  Star,
  Tag,
  Users,
  Zap,
  Timer,
  CheckCircle,
  Award,
  Heart,
} from "lucide-react";

export function GameDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [game, setGame] = useState<Game | null>(null);
  const [notes, setNotes] = useState<GameNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedGame, setEditedGame] = useState<Partial<Game>>({});
  const [newNote, setNewNote] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editedNoteContent, setEditedNoteContent] = useState("");
  const [activeTab, setActiveTab] = useState("details");

  // Mock data for new fields
  const mockData = {
    cover_art:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&q=80",
    platform: "PlayStation 5",
    genre: "Action",
    rating: 4.5,
    genres: ["Action", "Adventure", "RPG"],
    game_modes: ["Single Player", "Online Co-op"],
    time_to_beat: {
      hastily: 15,
      normally: 30,
      completionist: 60,
    },
  };

  const loadGame = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const gameData = await fetchGame(id);

      // Add mock data for new fields if they don't exist
      const enhancedGameData = {
        ...gameData,
        // Add external data that would come from the external provider
        cover_art: gameData.cover_art || mockData.cover_art || defaultCoverArt,
        platform: gameData.platform || mockData.platform,
        genre: gameData.genre || mockData.genre,
        rating: gameData.rating || mockData.rating,
        genres: gameData.genres || mockData.genres,
        game_modes: gameData.game_modes || mockData.game_modes,
        time_to_beat: gameData.time_to_beat || mockData.time_to_beat,
      };

      setGame(enhancedGameData);
      setEditedGame(enhancedGameData);

      const notesData = await fetchGameNotes(id);
      setNotes(notesData);
    } catch (error) {
      console.error("Failed to load game:", error);
      toast({
        title: "Error",
        description: "Failed to load game details.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGame();
  }, [id]);

  const handleSaveChanges = async () => {
    if (!id || !game) return;

    try {
      const updatedGame = await updateGame(id, editedGame);
      // Add mock data back if it was removed during the update
      const enhancedUpdatedGame = {
        ...updatedGame,
        cover_art: updatedGame.cover_art || game.cover_art,
        platform: updatedGame.platform || game.platform,
        genre: updatedGame.genre || game.genre,
        rating: updatedGame.rating || game.rating,
        genres: updatedGame.genres || game.genres,
        game_modes: updatedGame.game_modes || game.game_modes,
        time_to_beat: updatedGame.time_to_beat || game.time_to_beat,
      };
      setGame(enhancedUpdatedGame);
      setIsEditing(false);
      toast({
        title: "Changes saved",
        description: "Game details have been updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save changes.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteGame = async () => {
    if (!id) return;

    try {
      await deleteGame(id);
      toast({
        title: "Game deleted",
        description: "The game has been removed from your collection.",
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete game.",
        variant: "destructive",
      });
    }
  };

  const handleAddNote = async () => {
    if (!id || !newNote.trim()) return;

    try {
      const addedNote = await createGameNote({
        game_id: id,
        content: newNote,
      });
      setNotes([addedNote, ...notes]);
      setNewNote("");
      toast({
        title: "Note added",
        description: "Your note has been saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add note.",
        variant: "destructive",
      });
    }
  };

  const handleEditNote = (note: GameNote) => {
    setEditingNoteId(note.id);
    setEditedNoteContent(note.content);
  };

  const handleSaveNote = async () => {
    if (!editingNoteId) return;

    try {
      const updatedNote = await updateGameNote(
        editingNoteId,
        editedNoteContent,
      );
      setNotes(
        notes.map((note) => (note.id === editingNoteId ? updatedNote : note)),
      );
      setEditingNoteId(null);
      setEditedNoteContent("");
      toast({
        title: "Note updated",
        description: "Your note has been updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update note.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await deleteGameNote(noteId);
      setNotes(notes.filter((note) => note.id !== noteId));
      toast({
        title: "Note deleted",
        description: "Your note has been deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete note.",
        variant: "destructive",
      });
    }
  };

  const handleGenreChange = (selectedGenres: string[]) => {
    setEditedGame({
      ...editedGame,
      genres: selectedGenres,
    });
  };

  const handleGameModeChange = (selectedModes: string[]) => {
    setEditedGame({
      ...editedGame,
      game_modes: selectedModes,
    });
  };

  const handleTimeToBeatChange = (
    type: "hastily" | "normally" | "completionist",
    value: string,
  ) => {
    setEditedGame({
      ...editedGame,
      time_to_beat: {
        ...editedGame.time_to_beat,
        [type]: parseInt(value) || 0,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Game not found</h2>
        <Button onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
      </div>
    );
  }

  const defaultCoverArt =
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&q=80";

  // Render star rating
  const renderStarRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star
            key={`full-${i}`}
            className="h-4 w-4 fill-yellow-400 text-yellow-400"
          />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star className="h-4 w-4 text-yellow-400" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="h-4 w-4 text-yellow-400" />
        ))}
        <span className="ml-2 text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <Button variant="outline" onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card className="custom-card">
            <CardContent className="p-0">
              <div className="aspect-[3/4] w-full overflow-hidden">
                <img
                  src={game.cover_art || defaultCoverArt}
                  alt={game.title}
                  className="object-cover w-full h-full"
                />
              </div>
            </CardContent>
          </Card>

          {/* Game Info Card */}
          <Card className="custom-card mt-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Game Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Rating */}
              <div className="space-y-1">
                <p className="text-sm font-medium flex items-center gap-2">
                  <Award className="h-4 w-4 text-primary" /> Rating
                </p>
                {renderStarRating(game.rating || 0)}
              </div>

              {/* Genres */}
              <div className="space-y-1">
                <p className="text-sm font-medium flex items-center gap-2">
                  <Tag className="h-4 w-4 text-primary" /> Genres
                </p>
                <div className="flex flex-wrap gap-1">
                  {game.genres &&
                    game.genres.map((genre) => (
                      <Badge key={genre} variant="outline" className="text-xs">
                        {genre}
                      </Badge>
                    ))}
                </div>
              </div>

              {/* Game Modes */}
              <div className="space-y-1">
                <p className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" /> Game Modes
                </p>
                <div className="flex flex-wrap gap-1">
                  {game.game_modes &&
                    game.game_modes.map((mode) => (
                      <Badge key={mode} variant="secondary" className="text-xs">
                        {mode}
                      </Badge>
                    ))}
                </div>
              </div>

              {/* Time to Beat */}
              <div className="space-y-1">
                <p className="text-sm font-medium flex items-center gap-2">
                  <Timer className="h-4 w-4 text-primary" /> Time to Beat
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <Zap className="h-3 w-3 text-amber-500" /> Hastily
                    </div>
                    <span>{game.time_to_beat?.hastily || 0} hours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-blue-500" /> Normally
                    </div>
                    <span>{game.time_to_beat?.normally || 0} hours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-500" />{" "}
                      Completionist
                    </div>
                    <span>{game.time_to_beat?.completionist || 0} hours</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold gradient-text">{game.title}</h1>
              <div className="flex flex-wrap gap-2 mt-2">
                {game.platform && (
                  <Badge variant="outline">{game.platform}</Badge>
                )}
                <Badge
                  className={`
                    ${game.status === "backlog" ? "bg-slate-500" : ""}
                    ${game.status === "playing" ? "bg-blue-500" : ""}
                    ${game.status === "completed" ? "bg-green-500" : ""}
                  `}
                >
                  {game.status === "backlog" ? "Backlog" : ""}
                  {game.status === "playing" ? "Playing" : ""}
                  {game.status === "completed" ? "Completed" : ""}
                </Badge>
              </div>
            </div>

            <div className="flex gap-2">
              {!isEditing ? (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      updateGame(id, { favorite: !game.favorite }).then(() => {
                        setGame({ ...game, favorite: !game.favorite });
                        toast({
                          title: game.favorite
                            ? "Removed from favorites"
                            : "Added to favorites",
                          description: game.favorite
                            ? "Game removed from favorites"
                            : "Game added to favorites",
                        });
                      })
                    }
                    title={
                      game.favorite
                        ? "Remove from favorites"
                        : "Add to favorites"
                    }
                  >
                    <Star
                      className={`h-4 w-4 ${game.favorite ? "fill-yellow-400 text-yellow-400" : ""}`}
                    />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="icon">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Game</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this game? This action
                          cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteGame}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              ) : (
                <Button onClick={handleSaveChanges} className="gradient-button">
                  <Save className="mr-2 h-4 w-4" /> Save Changes
                </Button>
              )}
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Progress</TabsTrigger>
              <TabsTrigger value="edit">Edit Details</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6 pt-6">
              <Card className="custom-card">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Playtime</p>
                          <p className="text-2xl font-bold">
                            {game.playtime || 0} hours
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Achievements</p>
                          <p className="text-2xl font-bold">
                            {game.achievements_earned || 0} /{" "}
                            {game.achievements_total || 0}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-sm font-medium">Completion</p>
                          <p className="text-sm">
                            {game.completion_percentage || 0}%
                          </p>
                        </div>
                        <Progress
                          value={game.completion_percentage || 0}
                          className="h-2"
                        />
                      </div>

                      {game.estimated_completion_time && (
                        <div className="flex items-center gap-2">
                          <Percent className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">
                              Estimated Completion
                            </p>
                            <p className="text-lg">
                              {game.estimated_completion_time} hours
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="edit" className="space-y-6 pt-6">
              <Card className="custom-card">
                <CardContent className="pt-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Status</label>
                      <Select
                        value={editedGame.status || game.status}
                        onValueChange={(value) =>
                          setEditedGame({
                            ...editedGame,
                            status: value as any,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
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

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Playtime (hours)
                      </label>
                      <Input
                        type="number"
                        min="0"
                        value={editedGame.playtime || ""}
                        onChange={(e) =>
                          setEditedGame({
                            ...editedGame,
                            playtime: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Completion Percentage
                      </label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={editedGame.completion_percentage || ""}
                        onChange={(e) =>
                          setEditedGame({
                            ...editedGame,
                            completion_percentage:
                              parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Achievements Earned
                      </label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          min="0"
                          value={editedGame.achievements_earned || ""}
                          onChange={(e) =>
                            setEditedGame({
                              ...editedGame,
                              achievements_earned:
                                parseInt(e.target.value) || 0,
                            })
                          }
                        />
                        <span className="flex items-center">/</span>
                        <Input
                          type="number"
                          min="0"
                          value={editedGame.achievements_total || ""}
                          onChange={(e) =>
                            setEditedGame({
                              ...editedGame,
                              achievements_total: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Rating */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Award className="h-4 w-4" /> Rating (0-5)
                    </label>
                    <Input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={editedGame.rating || game.rating || ""}
                      onChange={(e) =>
                        setEditedGame({
                          ...editedGame,
                          rating: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>

                  {/* Time to Beat */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Timer className="h-4 w-4" /> Time to Beat (hours)
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs flex items-center gap-1">
                          <Zap className="h-3 w-3 text-amber-500" /> Hastily
                        </label>
                        <Input
                          type="number"
                          min="0"
                          value={
                            editedGame.time_to_beat?.hastily ||
                            game.time_to_beat?.hastily ||
                            ""
                          }
                          onChange={(e) =>
                            handleTimeToBeatChange("hastily", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs flex items-center gap-1">
                          <Clock className="h-3 w-3 text-blue-500" /> Normally
                        </label>
                        <Input
                          type="number"
                          min="0"
                          value={
                            editedGame.time_to_beat?.normally ||
                            game.time_to_beat?.normally ||
                            ""
                          }
                          onChange={(e) =>
                            handleTimeToBeatChange("normally", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 text-green-500" />{" "}
                          Completionist
                        </label>
                        <Input
                          type="number"
                          min="0"
                          value={
                            editedGame.time_to_beat?.completionist ||
                            game.time_to_beat?.completionist ||
                            ""
                          }
                          onChange={(e) =>
                            handleTimeToBeatChange(
                              "completionist",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Genres - Multi-select */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Tag className="h-4 w-4" /> Genres
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {GAME_GENRES.map((genre) => {
                        const isSelected =
                          editedGame.genres?.includes(genre) ||
                          (game.genres?.includes(genre) && !editedGame.genres);
                        return (
                          <Badge
                            key={genre}
                            variant={isSelected ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => {
                              const currentGenres =
                                editedGame.genres || game.genres || [];
                              if (isSelected) {
                                handleGenreChange(
                                  currentGenres.filter((g) => g !== genre),
                                );
                              } else {
                                handleGenreChange([...currentGenres, genre]);
                              }
                            }}
                          >
                            {genre}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>

                  {/* Game Modes - Multi-select */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Users className="h-4 w-4" /> Game Modes
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {GAME_MODES.map((mode) => {
                        const isSelected =
                          editedGame.game_modes?.includes(mode) ||
                          (game.game_modes?.includes(mode) &&
                            !editedGame.game_modes);
                        return (
                          <Badge
                            key={mode}
                            variant={isSelected ? "secondary" : "outline"}
                            className="cursor-pointer"
                            onClick={() => {
                              const currentModes =
                                editedGame.game_modes || game.game_modes || [];
                              if (isSelected) {
                                handleGameModeChange(
                                  currentModes.filter((m) => m !== mode),
                                );
                              } else {
                                handleGameModeChange([...currentModes, mode]);
                              }
                            }}
                          >
                            {mode}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes" className="space-y-6 pt-6">
              <Card className="custom-card">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Add Note</label>
                      <div className="flex gap-2">
                        <Textarea
                          placeholder="Write your thoughts about the game..."
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          className="flex-grow"
                        />
                        <Button
                          onClick={handleAddNote}
                          className="gradient-button"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      {notes.length === 0 ? (
                        <p className="text-muted-foreground text-center py-4">
                          No notes yet. Add your first note above.
                        </p>
                      ) : (
                        notes.map((note) => (
                          <div key={note.id} className="space-y-2">
                            {editingNoteId === note.id ? (
                              <div className="space-y-2">
                                <Textarea
                                  value={editedNoteContent}
                                  onChange={(e) =>
                                    setEditedNoteContent(e.target.value)
                                  }
                                />
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setEditingNoteId(null)}
                                  >
                                    Cancel
                                  </Button>
                                  <Button size="sm" onClick={handleSaveNote}>
                                    Save
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="bg-muted p-4 rounded-md">
                                <div className="flex justify-between items-start">
                                  <p className="whitespace-pre-wrap">
                                    {note.content}
                                  </p>
                                  <div className="flex gap-1">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleEditNote(note)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleDeleteNote(note.id)}
                                    >
                                      <Trash className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                  {new Date(
                                    note.created_at || "",
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
