import { supabase } from "../../supabase/supabase";
import { Game, GameNote, ExternalGameProvider } from "../types/game";

// Game CRUD operations
export async function fetchGames() {
  const { data, error } = await supabase
    .from("user_games")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data as Game[];
}

export async function fetchGamesByStatus(status: string) {
  const { data, error } = await supabase
    .from("user_games")
    .select("*")
    .eq("status", status)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data as Game[];
}

export async function fetchGame(id: string) {
  // Get the user game data
  const { data: userGameData, error: userGameError } = await supabase
    .from("user_games")
    .select("*")
    .eq("id", id)
    .single();

  if (userGameError) throw userGameError;

  // Get the external game data if available
  const { data: externalProviderData, error: externalProviderError } =
    await supabase
      .from("user_games_external_providers")
      .select(
        "external_game_id, external_game_provider_id, external_game_providers(name)",
      )
      .eq("user_game_id", id)
      .maybeSingle();

  // If there's external data, we would fetch it from the external API
  // For now, we'll just return the user game data
  // In a real implementation, you would fetch the game details from the external API

  // Combine the data
  const gameData = {
    ...userGameData,
    external_game_id: externalProviderData?.external_game_id,
    external_provider: externalProviderData?.external_game_providers?.name,
  };

  return gameData as Game;
}

// Mock external games for selection
export async function fetchExternalGames(search: string = "") {
  // Mock data for now
  const mockGames = [
    {
      id: "igdb-1234",
      title: "The Legend of Zelda: Breath of the Wild",
      cover_art:
        "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=300&q=80",
      platform: "Nintendo Switch",
      genre: "Adventure",
      genres: ["Adventure", "Action", "RPG"],
      rating: 4.8,
      game_modes: ["Single Player"],
      time_to_beat: {
        hastily: 40,
        normally: 60,
        completionist: 180,
      },
    },
    {
      id: "igdb-5678",
      title: "Elden Ring",
      cover_art:
        "https://images.unsplash.com/photo-1605979257913-1704eb7b6246?w=300&q=80",
      platform: "PC",
      genre: "RPG",
      genres: ["RPG", "Action", "Open World"],
      rating: 4.7,
      game_modes: ["Single Player", "Online Co-op"],
      time_to_beat: {
        hastily: 50,
        normally: 80,
        completionist: 150,
      },
    },
    {
      id: "igdb-9012",
      title: "God of War Ragnarök",
      cover_art:
        "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&q=80",
      platform: "PlayStation 5",
      genre: "Action",
      genres: ["Action", "Adventure"],
      rating: 4.9,
      game_modes: ["Single Player"],
      time_to_beat: {
        hastily: 20,
        normally: 35,
        completionist: 60,
      },
    },
  ];

  // Filter by search term if provided
  if (search) {
    const searchLower = search.toLowerCase();
    return mockGames.filter((game) =>
      game.title.toLowerCase().includes(searchLower),
    );
  }

  return mockGames;
}

export async function createGame(
  game: Omit<Game, "id" | "user_id" | "created_at" | "updated_at">,
) {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("User not authenticated");

  // First, create the user game entry
  const { data: userGameData, error: userGameError } = await supabase
    .from("user_games")
    .insert([
      {
        title: game.title,
        status: game.status,
        playtime: game.playtime || 0,
        completion_percentage: game.completion_percentage || 0,
        achievements_earned: game.achievements_earned || 0,
        achievements_total: game.achievements_total || 0,
        estimated_completion_time: game.estimated_completion_time,
        favorite: game.favorite || false,
        user_id: userData.user.id,
      },
    ])
    .select()
    .single();

  if (userGameError) throw userGameError;

  // If external game ID is provided, create the relationship
  if (game.external_game_id) {
    // Get the IGDB provider ID
    const { data: providerData, error: providerError } = await supabase
      .from("external_game_providers")
      .select("id")
      .eq("name", "IGDB")
      .single();

    if (providerError) throw providerError;

    // Create the relationship
    const { error: relationError } = await supabase
      .from("user_games_external_providers")
      .insert([
        {
          user_game_id: userGameData.id,
          external_game_provider_id: providerData.id,
          external_game_id: game.external_game_id,
        },
      ]);

    if (relationError) throw relationError;
  }

  return userGameData as Game;
}

export async function updateGame(id: string, updates: Partial<Game>) {
  // Filter out complex objects that might cause issues with Supabase
  const filteredUpdates = { ...updates };

  // Handle nested objects like time_to_beat
  if (updates.time_to_beat) {
    filteredUpdates.time_to_beat = updates.time_to_beat;
  }

  const { data, error } = await supabase
    .from("user_games")
    .update(filteredUpdates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Game;
}

export async function deleteGame(id: string) {
  const { error } = await supabase.from("user_games").delete().eq("id", id);

  if (error) throw error;
  return true;
}

// External game providers
export async function fetchExternalGameProviders() {
  const { data, error } = await supabase
    .from("external_game_providers")
    .select("*");

  if (error) throw error;
  return data as ExternalGameProvider[];
}

// Game Notes CRUD operations
export async function fetchGameNotes(gameId: string) {
  const { data, error } = await supabase
    .from("game_notes")
    .select("*")
    .eq("game_id", gameId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as GameNote[];
}

export async function createGameNote(note: {
  game_id: string;
  content: string;
}) {
  const { data, error } = await supabase
    .from("game_notes")
    .insert([note])
    .select()
    .single();

  if (error) throw error;
  return data as GameNote;
}

export async function updateGameNote(id: string, content: string) {
  const { data, error } = await supabase
    .from("game_notes")
    .update({ content })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as GameNote;
}

export async function deleteGameNote(id: string) {
  const { error } = await supabase.from("game_notes").delete().eq("id", id);

  if (error) throw error;
  return true;
}
