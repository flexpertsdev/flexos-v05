-- Create update_updated_at_column function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

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

-- Enable RLS
ALTER TABLE vision_documents ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own vision documents" ON vision_documents;
DROP POLICY IF EXISTS "Users can create vision documents" ON vision_documents;
DROP POLICY IF EXISTS "Users can update own vision documents" ON vision_documents;

-- Create policies
CREATE POLICY "Users can view own vision documents" ON vision_documents
  FOR SELECT USING (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create vision documents" ON vision_documents
  FOR INSERT WITH CHECK (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own vision documents" ON vision_documents
  FOR UPDATE USING (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

-- Drop and recreate trigger
DROP TRIGGER IF EXISTS update_vision_documents_updated_at ON vision_documents;
CREATE TRIGGER update_vision_documents_updated_at 
BEFORE UPDATE ON vision_documents 
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
