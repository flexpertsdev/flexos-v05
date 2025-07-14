-- Create vision_documents table
CREATE TABLE IF NOT EXISTS vision_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  elevator_pitch TEXT,
  user_personas JSONB DEFAULT '[]'::jsonb,
  pain_points JSONB DEFAULT '[]'::jsonb,
  key_features JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE vision_documents ENABLE ROW LEVEL SECURITY;

-- Users can view their own vision documents
CREATE POLICY "Users can view own vision documents" ON vision_documents
  FOR SELECT USING (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

-- Users can create vision documents for their projects
CREATE POLICY "Users can create vision documents" ON vision_documents
  FOR INSERT WITH CHECK (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

-- Users can update their own vision documents
CREATE POLICY "Users can update own vision documents" ON vision_documents
  FOR UPDATE USING (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_vision_documents_updated_at BEFORE UPDATE
  ON vision_documents FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
