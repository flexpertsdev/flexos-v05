-- Create vision_documents table for real-time project vision tracking
CREATE TABLE IF NOT EXISTS public.vision_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Vision content (matching the VisionPanel structure)
    elevator_pitch TEXT,
    problem_statement TEXT,
    solution_overview TEXT,
    
    -- JSON arrays for complex data
    target_users JSONB DEFAULT '[]'::JSONB,
    pain_points JSONB DEFAULT '[]'::JSONB,
    opportunities JSONB DEFAULT '[]'::JSONB,
    core_features JSONB DEFAULT '[]'::JSONB,
    nice_to_haves JSONB DEFAULT '[]'::JSONB,
    future_ideas JSONB DEFAULT '[]'::JSONB,
    design_principles TEXT[] DEFAULT '{}',
    inspiration_references JSONB DEFAULT '[]'::JSONB,
    emotional_goals TEXT[] DEFAULT '{}',
    discovered_themes JSONB DEFAULT '[]'::JSONB,
    conversation_highlights JSONB DEFAULT '[]'::JSONB,
    
    -- Confidence scores
    confidence_scores JSONB DEFAULT '{
        "problem_understanding": 0,
        "solution_clarity": 0,
        "user_definition": 0,
        "feature_completeness": 0
    }'::JSONB,
    
    -- Metadata
    version INTEGER DEFAULT 1,
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure one vision document per project
    UNIQUE(project_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_vision_documents_project_id ON public.vision_documents(project_id);
CREATE INDEX IF NOT EXISTS idx_vision_documents_user_id ON public.vision_documents(user_id);

-- Enable RLS
ALTER TABLE public.vision_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view vision documents for their projects" ON public.vision_documents
    FOR SELECT USING (
        auth.uid() = user_id OR 
        EXISTS (
            SELECT 1 FROM public.project_collaborators 
            WHERE project_id = vision_documents.project_id 
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create vision documents for their projects" ON public.vision_documents
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM public.projects 
            WHERE id = vision_documents.project_id 
            AND (user_id = auth.uid() OR EXISTS (
                SELECT 1 FROM public.project_collaborators 
                WHERE project_id = projects.id 
                AND user_id = auth.uid() 
                AND role IN ('owner', 'editor')
            ))
        )
    );

CREATE POLICY "Users can update vision documents for their projects" ON public.vision_documents
    FOR UPDATE USING (
        auth.uid() = user_id OR 
        EXISTS (
            SELECT 1 FROM public.project_collaborators 
            WHERE project_id = vision_documents.project_id 
            AND user_id = auth.uid() 
            AND role IN ('owner', 'editor')
        )
    );

-- Update trigger for last_updated
CREATE TRIGGER update_vision_documents_updated_at BEFORE UPDATE ON public.vision_documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON public.vision_documents TO authenticated;

-- Add comment
COMMENT ON TABLE public.vision_documents IS 'Real-time vision tracking for Focus mode conversations';
