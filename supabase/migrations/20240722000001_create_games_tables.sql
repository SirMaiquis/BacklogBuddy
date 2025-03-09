-- Create games table
CREATE TABLE IF NOT EXISTS games (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  cover_art TEXT,
  platform TEXT,
  genre TEXT,
  status TEXT NOT NULL DEFAULT 'backlog',
  playtime INTEGER DEFAULT 0,
  completion_percentage INTEGER DEFAULT 0,
  achievements_earned INTEGER DEFAULT 0,
  achievements_total INTEGER DEFAULT 0,
  estimated_completion_time INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create game notes table
CREATE TABLE IF NOT EXISTS game_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_notes ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view own games" ON games;
CREATE POLICY "Users can view own games"
  ON games FOR SELECT
  USING (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can insert own games" ON games;
CREATE POLICY "Users can insert own games"
  ON games FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can update own games" ON games;
CREATE POLICY "Users can update own games"
  ON games FOR UPDATE
  USING (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can delete own games" ON games;
CREATE POLICY "Users can delete own games"
  ON games FOR DELETE
  USING (auth.uid()::text = user_id);

-- Game notes policies
DROP POLICY IF EXISTS "Users can view own game notes" ON game_notes;
CREATE POLICY "Users can view own game notes"
  ON game_notes FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM games
    WHERE games.id = game_notes.game_id
    AND games.user_id = auth.uid()::text
  ));

DROP POLICY IF EXISTS "Users can insert own game notes" ON game_notes;
CREATE POLICY "Users can insert own game notes"
  ON game_notes FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM games
    WHERE games.id = game_notes.game_id
    AND games.user_id = auth.uid()::text
  ));

DROP POLICY IF EXISTS "Users can update own game notes" ON game_notes;
CREATE POLICY "Users can update own game notes"
  ON game_notes FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM games
    WHERE games.id = game_notes.game_id
    AND games.user_id = auth.uid()::text
  ));

DROP POLICY IF EXISTS "Users can delete own game notes" ON game_notes;
CREATE POLICY "Users can delete own game notes"
  ON game_notes FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM games
    WHERE games.id = game_notes.game_id
    AND games.user_id = auth.uid()::text
  ));

-- Enable realtime
alter publication supabase_realtime add table games;
alter publication supabase_realtime add table game_notes;