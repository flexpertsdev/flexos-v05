-- Create shared_projects table for public sharing
CREATE TABLE IF NOT EXISTS shared_projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  share_token VARCHAR(32) NOT NULL UNIQUE,
  is_public BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE shared_projects ENABLE ROW LEVEL SECURITY;

-- Users can create shares for their own projects
CREATE POLICY "Users can create project shares" ON shared_projects
  FOR INSERT WITH CHECK (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

-- Users can view their own shares
CREATE POLICY "Users can view own shares" ON shared_projects
  FOR SELECT USING (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

-- Anyone can view public shares
CREATE POLICY "Anyone can view public shares" ON shared_projects
  FOR SELECT USING (
    is_public = true
  );

-- Users can delete their own shares
CREATE POLICY "Users can delete own shares" ON shared_projects
  FOR DELETE USING (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

-- Create function to increment view count
CREATE OR REPLACE FUNCTION increment_share_view_count(share_token_param VARCHAR)
RETURNS void AS $$
BEGIN
  UPDATE shared_projects 
  SET view_count = view_count + 1
  WHERE share_token = share_token_param
  AND is_public = true
  AND (expires_at IS NULL OR expires_at > NOW());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add is_generated flags to track AI-generated content
ALTER TABLE pages ADD COLUMN IF NOT EXISTS is_generated BOOLEAN DEFAULT false;
ALTER TABLE features ADD COLUMN IF NOT EXISTS is_generated BOOLEAN DEFAULT false;
ALTER TABLE user_journeys ADD COLUMN IF NOT EXISTS is_generated BOOLEAN DEFAULT false;
