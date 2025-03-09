export interface Game {
  id: string;
  user_id: string;
  title: string;
  cover_art?: string;
  platform?: string;
  genre?: string;
  genres?: string[];
  status: "backlog" | "playing" | "completed";
  playtime?: number;
  completion_percentage?: number;
  achievements_earned?: number;
  achievements_total?: number;
  estimated_completion_time?: number;
  created_at?: string;
  updated_at?: string;
  rating?: number;
  time_to_beat?: {
    hastily?: number;
    normally?: number;
    completionist?: number;
  };
  game_modes?: string[];
  external_game_id?: string;
  external_provider?: string;
  favorite?: boolean;
}

export interface ExternalGameProvider {
  id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserGameExternalProvider {
  id: string;
  user_game_id: string;
  external_game_provider_id: string;
  external_game_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface GameNote {
  id: string;
  game_id: string;
  content: string;
  created_at?: string;
  updated_at?: string;
}

export const GAME_PLATFORMS = [
  "PC",
  "PlayStation 5",
  "PlayStation 4",
  "Xbox Series X/S",
  "Xbox One",
  "Nintendo Switch",
  "Mobile",
  "Other",
];

export const GAME_GENRES = [
  "Action",
  "Adventure",
  "RPG",
  "Strategy",
  "Simulation",
  "Sports",
  "Racing",
  "Puzzle",
  "FPS",
  "Fighting",
  "Platformer",
  "Survival",
  "Horror",
  "MMO",
  "Visual Novel",
  "Indie",
  "Roguelike",
  "Stealth",
  "Open World",
  "Sandbox",
  "Battle Royale",
  "MOBA",
  "Card Game",
  "Other",
];

export const GAME_MODES = [
  "Single Player",
  "Multiplayer",
  "Co-op",
  "Online Co-op",
  "Local Co-op",
  "PvP",
  "Online PvP",
  "Local PvP",
  "Split Screen",
  "MMO",
  "Battle Royale",
];

export const GAME_STATUSES = [
  { value: "backlog", label: "Backlog" },
  { value: "playing", label: "Currently Playing" },
  { value: "completed", label: "Completed" },
];
