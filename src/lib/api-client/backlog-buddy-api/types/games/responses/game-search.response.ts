export type GameSearchResponse = {
  igdb_id: number;
  name: string;
  platforms: string[];
  genres: string[];
  cover_art: string;
  rating?: number;
};
