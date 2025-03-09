-- Add favorite column to user_games table
ALTER TABLE user_games ADD COLUMN favorite BOOLEAN DEFAULT false;
