export type GameCreateRequest = {
    status?: string;
    playtime?: number;
    completion_percentage?: number;
    achievements_earned?: number;
    achievements_total?: number;
    estimated_completion_time?: number;
    favorite?: boolean;
    igdb_id: number;
};
