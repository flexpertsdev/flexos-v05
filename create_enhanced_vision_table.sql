-- Create the enhanced project visions table
CREATE TABLE IF NOT EXISTS project_visions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  version INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'analyzing', 'ready', 'generating')),
  
  -- Core Vision
  project_name TEXT,
  tagline TEXT,
  description TEXT,
  
  -- Strategic Elements
  objectives TEXT[] DEFAULT '{}',
  target_audience JSONB DEFAULT '{"primary": "", "secondary": "", "characteristics": []}',
  problems TEXT[] DEFAULT '{}',
  solutions TEXT[] DEFAULT '{}',
  
  -- Product Definition
  features JSONB DEFAULT '{"core": [], "nice_to_have": []}',
  user_journeys JSONB DEFAULT '[]',
  
  -- Design & Experience
  design_principles TEXT[] DEFAULT '{}',
  brand_personality TEXT[] DEFAULT '{}',
  ui_style JSONB DEFAULT '{"tone": "", "colors": [], "inspiration": []}',
  
  -- Success & Impact
  success_metrics TEXT[] DEFAULT '{}',
  value_proposition TEXT,
  
  -- AI Analysis
  ai_insights TEXT,
  questions_for_user TEXT[] DEFAULT '{}',
  readiness_score INTEGER DEFAULT 0 CHECK (readiness_score >= 0 AND readiness_score <= 100),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_project_visions_project_id ON project_visions(project_id);
CREATE INDEX idx_project_visions_version ON project_visions(project_id, version DESC);

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_project_visions_updated_at 
  BEFORE UPDATE ON project_visions 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies
ALTER TABLE project_visions ENABLE ROW LEVEL SECURITY;

-- Policy for reading visions (users can read visions for projects they have access to)
CREATE POLICY "Users can read project visions" ON project_visions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM project_members
      WHERE project_members.project_id = project_visions.project_id
      AND project_members.user_id = auth.uid()
    )
  );

-- Policy for creating/updating visions (only project members can modify)
CREATE POLICY "Project members can modify visions" ON project_visions
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM project_members
      WHERE project_members.project_id = project_visions.project_id
      AND project_members.user_id = auth.uid()
      AND project_members.role IN ('owner', 'admin', 'member')
    )
  );
