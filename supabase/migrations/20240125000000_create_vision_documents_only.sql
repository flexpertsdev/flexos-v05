-- Create vision_documents table only if it doesn't exist
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

-- Add RLS policies only if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'vision_documents' 
    AND policyname = 'Users can view own vision documents'
  ) THEN
    CREATE POLICY "Users can view own vision documents" ON vision_documents
      FOR SELECT USING (
        project_id IN (
          SELECT id FROM projects WHERE user_id = auth.uid()
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'vision_documents' 
    AND policyname = 'Users can create vision documents'
  ) THEN
    CREATE POLICY "Users can create vision documents" ON vision_documents
      FOR INSERT WITH CHECK (
        project_id IN (
          SELECT id FROM projects WHERE user_id = auth.uid()
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'vision_documents' 
    AND policyname = 'Users can update own vision documents'
  ) THEN
    CREATE POLICY "Users can update own vision documents" ON vision_documents
      FOR UPDATE USING (
        project_id IN (
          SELECT id FROM projects WHERE user_id = auth.uid()
        )
      );
  END IF;
END $$;

-- Enable RLS
ALTER TABLE vision_documents ENABLE ROW LEVEL SECURITY;

-- Add updated_at trigger only if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_vision_documents_updated_at'
  ) THEN
    CREATE TRIGGER update_vision_documents_updated_at 
    BEFORE UPDATE ON vision_documents 
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;
