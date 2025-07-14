-- Create vision_documents table
CREATE TABLE IF NOT EXISTS vision_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  elevator_pitch TEXT,
  user_personas JSONB DEFAULT '[]'::jsonb,
  pain_points JSONB DEFAULT '[]'::jsonb,
  features JSONB DEFAULT '[]'::jsonb,
  constraints JSONB DEFAULT '[]'::jsonb,
  design_themes JSONB DEFAULT '[]'::jsonb,
  success_metrics JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for project lookup
CREATE INDEX idx_vision_documents_project_id ON vision_documents(project_id);

-- Enable RLS
ALTER TABLE vision_documents ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own project visions" ON vision_documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = vision_documents.project_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create visions for their projects" ON vision_documents
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = vision_documents.project_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their project visions" ON vision_documents
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = vision_documents.project_id 
      AND projects.user_id = auth.uid()
    )
  );
