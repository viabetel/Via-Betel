-- Marketplace Features: Favorites, Comparisons, Saved Searches
-- Execute after 002_complete_trust_system.sql

-- Favorites table (user saves favorite instructors)
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  instructor_slug TEXT NOT NULL,
  instructor_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, instructor_slug)
);

-- Enable RLS on favorites
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own favorites" 
  ON favorites FOR ALL 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Comparisons table (user compares instructors)
CREATE TABLE IF NOT EXISTS comparisons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  instructor_slug TEXT NOT NULL,
  instructor_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, instructor_slug)
);

-- Enable RLS on comparisons
ALTER TABLE comparisons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own comparisons" 
  ON comparisons FOR ALL 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Saved Searches table (user saves search filters for later)
CREATE TABLE IF NOT EXISTS saved_searches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- User-defined name: "Instrutores JF Cat. B"
  filters JSONB NOT NULL, -- { city, category, maxPrice, minRating, etc }
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on saved_searches
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own saved searches" 
  ON saved_searches FOR ALL 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_instructor_slug ON favorites(instructor_slug);
CREATE INDEX IF NOT EXISTS idx_comparisons_user_id ON comparisons(user_id);
CREATE INDEX IF NOT EXISTS idx_comparisons_instructor_slug ON comparisons(instructor_slug);
CREATE INDEX IF NOT EXISTS idx_saved_searches_user_id ON saved_searches(user_id);

-- Trigger for auto-updating updated_at on saved_searches
CREATE TRIGGER update_saved_searches_updated_at BEFORE UPDATE ON saved_searches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Success message
SELECT 'Marketplace features schema created successfully!' as message;
