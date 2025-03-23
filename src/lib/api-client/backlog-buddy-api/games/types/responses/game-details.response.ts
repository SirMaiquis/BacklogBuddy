export type GameDetailsResponse = {
  id: string;
  user_id: string;
  title: string;
  status: "backlog" | "playing" | "completed";
  playtime: number;
  completion_percentage: number;
  achievements_earned: number;
  achievements_total: number;
  estimated_completion_time: any;
  created_at: string;
  updated_at: string;
  favorite: boolean;
  cover_art: string;
  igdb_id: number;
  platforms: string[];
  genres: string[];
  summary: string;
  time_to_beat: TimeToBeat;
  rating: number;
};

type TimeToBeat = {
  completionist: number;
  normally: number;
  hastily: number;
};
