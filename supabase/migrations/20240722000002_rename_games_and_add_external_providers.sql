-- Rename games table to user_games
ALTER TABLE IF EXISTS games RENAME TO user_games;

-- Create external_game_providers table
CREATE TABLE IF NOT EXISTS external_game_providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_games_external_providers table for many-to-many relationship
CREATE TABLE IF NOT EXISTS user_games_external_providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_game_id UUID NOT NULL REFERENCES user_games(id) ON DELETE CASCADE,
  external_game_provider_id UUID NOT NULL REFERENCES external_game_providers(id) ON DELETE CASCADE,
  external_game_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_game_id, external_game_provider_id)
);

-- Insert IGDB as the initial external provider
INSERT INTO external_game_providers (name) VALUES ('IGDB');

-- Enable realtime for new tables
alter publication supabase_realtime add table external_game_providers;
alter publication supabase_realtime add table user_games_external_providers;
