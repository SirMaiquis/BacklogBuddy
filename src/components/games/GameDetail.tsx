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
import { GAME_STATUSES } from "@/types/game";
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
import { GameNote } from "@/types/game";
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
  Zap,
  Timer,
  CheckCircle,
  FileText,
  Gamepad,
} from "lucide-react";
import { GameDetailsResponse } from "@/lib/api-client/backlog-buddy-api/games/types/responses/game-details.response";
import { BacklogBuddyGamesApiClient } from "@/lib/api-client/backlog-buddy-api/games/backlog-buddy-api.games.client";

export function GameDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [game, setGame] = useState<GameDetailsResponse | null>(null);
  const [notes, setNotes] = useState<GameNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedGame, setEditedGame] = useState<Partial<GameDetailsResponse>>({});
  const [newNote, setNewNote] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editedNoteContent, setEditedNoteContent] = useState("");
  const [activeTab, setActiveTab] = useState("details");

  const backlogBuddyApiClient = new BacklogBuddyGamesApiClient();

  const loadGame = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const gameData = await backlogBuddyApiClient.getGameDetails({ id });

      setGame(gameData);
      setEditedGame({
        status: gameData.status,
        playtime: gameData.playtime,
        completion_percentage: gameData.completion_percentage,
        achievements_earned: gameData.achievements_earned,
        achievements_total: gameData.achievements_total,
        estimated_completion_time: gameData.estimated_completion_time,
        favorite: gameData.favorite,
      });

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
      loadGame();
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

  return (
    <div className="container mx-auto p-6">
      <Button variant="outline" onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex gap-6 items-start">
          <div className="w-64 flex-shrink-0">
            <Card className="custom-card overflow-hidden border-none shadow-xl">
              <CardContent className="p-0">
                <div className="aspect-[3/4] w-full overflow-hidden">
                  <img
                    src={game.cover_art || defaultCoverArt}
                    alt={game.title}
                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="custom-card flex-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Game Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium flex items-center gap-2">
                  <Tag className="h-4 w-4 text-primary" /> Title
                </p>
                <p className="text-sm">{game.title}</p>
              </div>

              {game.platforms && game.platforms.length > 0 && (
                <div className="space-y-1">
                  <p className="text-sm font-medium flex items-center gap-2">
                    <Gamepad className="h-4 w-4 text-primary" /> Platforms
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {game.platforms.map((platform) => (
                      <Badge
                        key={platform}
                        variant="outline"
                        className="text-xs"
                      >
                        {platform}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {game.genres && (
                <div className="space-y-1">
                  <p className="text-sm font-medium flex items-center gap-2">
                    <Tag className="h-4 w-4 text-primary" /> Genres
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {game.genres.map((genre) => (
                      <Badge key={genre} variant="outline" className="text-xs">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {game.summary && (
                <div className="space-y-1">
                  <p className="text-sm font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" /> Summary
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {game.summary}
                  </p>
                </div>
              )}

              {game.rating && (
                <div className="space-y-1">
                  <p className="text-sm font-medium flex items-center gap-2">
                    <Star className="h-4 w-4 text-primary" /> Rating
                  </p>
                  <p className="text-sm">{Math.round(game.rating)}%</p>
                </div>
              )}

              {game.time_to_beat && (
                <div className="space-y-1">
                  <p className="text-sm font-medium flex items-center gap-2">
                    <Timer className="h-4 w-4 text-primary" /> Time to Beat
                  </p>
                  <div className="space-y-2 text-sm">
                    {game.time_to_beat.hastily && (
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1">
                          <Zap className="h-3 w-3 text-amber-500" /> Hastily
                        </div>
                        <span>
                          {Math.round(game.time_to_beat.hastily)} hours
                        </span>
                      </div>
                    )}
                    {game.time_to_beat.normally && (
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-blue-500" /> Normally
                        </div>
                        <span>
                          {Math.round(game.time_to_beat.normally)} hours
                        </span>
                      </div>
                    )}
                    {game.time_to_beat.completionist && (
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 text-green-500" />{" "}
                          Completionist
                        </div>
                        <span>
                          {Math.round(game.time_to_beat.completionist)} hours
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold gradient-text">{game.title}</h1>
              <div className="flex flex-wrap gap-2 mt-2">
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
                {game.platforms &&
                  game.platforms.map((platform) => (
                    <Badge key={platform} variant="outline">
                      {platform}
                    </Badge>
                  ))}
                {game.genres &&
                  game.genres.map((genre) => (
                    <Badge key={genre} variant="secondary">
                      {genre}
                    </Badge>
                  ))}
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

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Estimated Completion Time (hours)
                      </label>
                      <Input
                        type="number"
                        min="0"
                        value={editedGame.estimated_completion_time || ""}
                        onChange={(e) =>
                          setEditedGame({
                            ...editedGame,
                            estimated_completion_time:
                              parseInt(e.target.value) || 0,
                          })
                        }
                      />
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
