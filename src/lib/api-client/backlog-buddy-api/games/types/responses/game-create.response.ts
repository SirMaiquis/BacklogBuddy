export type GameCreateResponse = {
    id: string;
    user_id: string;
    title: string;
    status: string;
    playtime: number;
    completion_percentage: number;
    achievements_earned: number;
    achievements_total: number;
    estimated_completion_time: number;
    created_at: string;
    updated_at: string;
    favorite: boolean;
    cover_art: string;
};
