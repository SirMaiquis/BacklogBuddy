import { supabase } from "../../supabase/supabase";
import { Game, GameNote, ExternalGameProvider } from "../types/game";
import { GameResponse } from "./api-client/backlog-buddy-api/types/games/responses/games.response";

const API_URL = import.meta.env.VITE_API_URL;

export async function fetchGames() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const response = await fetch(`${API_URL}/games`, {
    headers: {
      Authorization: `Bearer ${user.access_token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch games");
  }

  const data = await response.json();
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
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const response = await fetch(`${API_URL}/games/details/${id}`, {
    headers: {
      Authorization: `Bearer ${user.access_token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch game details");
  }

  const data = await response.json();
  return data as Game;
}

export async function fetchExternalGames(search: string = "") {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const response = await fetch(
    `${API_URL}/games/search?name=${encodeURIComponent(search)}`,
    {
      headers: {
        Authorization: `Bearer ${user.access_token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch games");
  }

  const data = await response.json();
  return data.map((game: any) => ({
    id: game.igdb_id.toString(),
    title: game.name,
    cover_art: game.cover_art,
    platform: game.platforms[0],
    platforms: game.platforms,
    genres: game.genres,
    genre: game.genres[0],
  }));
}

export async function createGame(game: {
  status: string;
  playtime?: number;
  completion_percentage?: number;
  achievements_earned?: number;
  achievements_total?: number;
  estimated_completion_time?: number;
  favorite?: boolean;
  igdb_id: number;
}) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const response = await fetch(`${API_URL}/games`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${user.access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(game),
  });

  if (!response.ok) {
    throw new Error("Failed to create game");
  }

  const data = await response.json();
  return data;
}

export async function updateGame(
  id: string,
  updates: Partial<GameResponse>
): Promise<GameResponse> {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const response = await fetch(`${API_URL}/games/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${user.access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error("Failed to update game");
  }

  const data = await response.json();
  return data as GameResponse;
}

export async function deleteGame(id: string) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const response = await fetch(`${API_URL}/games/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${user.access_token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to update game");
  }

  const data = await response.json();
  return data;
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
