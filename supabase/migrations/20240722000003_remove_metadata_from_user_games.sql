-- Remove cover_art, platform, and genre from user_games table
ALTER TABLE user_games DROP COLUMN IF EXISTS cover_art;
ALTER TABLE user_games DROP COLUMN IF EXISTS platform;
ALTER TABLE user_games DROP COLUMN IF EXISTS genre;
