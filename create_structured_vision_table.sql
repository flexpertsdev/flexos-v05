-- Create structured_vision_documents table
CREATE TABLE IF NOT EXISTS structured_vision_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  
  -- Core Vision
  project_name TEXT,
  tagline TEXT,
  description TEXT,
  
  -- Arrays stored as JSONB
  objectives JSONB DEFAULT '[]'::jsonb,
  target_users JSONB DEFAULT '{"primary": [], "secondary": []}'::jsonb,
  problems JSONB DEFAULT '[]'::jsonb,
  solutions JSONB DEFAULT '[]'::jsonb,
  core_features JSONB DEFAULT '[]'::jsonb,
  nice_to_have_features JSONB DEFAULT '[]'::jsonb,
  user_journeys JSONB DEFAULT '[]'::jsonb,
  design_principles JSONB DEFAULT '[]'::jsonb,
  brand_personality JSONB DEFAULT '[]'::jsonb,
  tech_stack JSONB DEFAULT '[]'::jsonb,
  integrations JSONB DEFAULT '[]'::jsonb,
  success_metrics JSONB DEFAULT '[]'::jsonb,
  unique_value_props JSONB DEFAULT '[]'::jsonb,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE structured_vision_documents ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own structured vision documents" ON structured_vision_documents;
DROP POLICY IF EXISTS "Users can create structured vision documents" ON structured_vision_documents;
DROP POLICY IF EXISTS "Users can update own structured vision documents" ON structured_vision_documents;

-- Create policies
CREATE POLICY "Users can view own structured vision documents" ON structured_vision_documents
  FOR SELECT USING (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create structured vision documents" ON structured_vision_documents
  FOR INSERT WITH CHECK (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own structured vision documents" ON structured_vision_documents
  FOR UPDATE USING (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

-- Add unique constraint
ALTER TABLE structured_vision_documents 
ADD CONSTRAINT structured_vision_documents_project_id_key UNIQUE (project_id);

-- Drop and recreate trigger
DROP TRIGGER IF EXISTS update_structured_vision_documents_updated_at ON structured_vision_documents;
CREATE TRIGGER update_structured_vision_documents_updated_at 
BEFORE UPDATE ON structured_vision_documents 
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
