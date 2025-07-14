-- Migration to transform vision_documents to blueprint-based structure
-- This adds new columns while preserving existing data

-- Add blueprint columns to vision_documents table
ALTER TABLE public.vision_documents
ADD COLUMN IF NOT EXISTS blueprint_actions JSONB DEFAULT '[]'::JSONB,
ADD COLUMN IF NOT EXISTS blueprint_data JSONB DEFAULT '[]'::JSONB,
ADD COLUMN IF NOT EXISTS blueprint_views JSONB DEFAULT '[]'::JSONB,
ADD COLUMN IF NOT EXISTS blueprint_workflows JSONB DEFAULT '[]'::JSONB,
ADD COLUMN IF NOT EXISTS blueprint_features JSONB DEFAULT '[]'::JSONB,
ADD COLUMN IF NOT EXISTS blueprint_integrations JSONB DEFAULT '[]'::JSONB,
ADD COLUMN IF NOT EXISTS blueprint_metrics JSONB DEFAULT '[]'::JSONB,
ADD COLUMN IF NOT EXISTS last_extracted TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS extraction_version INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS blueprint_completeness JSONB DEFAULT '{
    "overall": 0,
    "identity": 0,
    "data": 0,
    "actions": 0,
    "views": 0,
    "features": 0
}'::JSONB;

-- Add core identity columns
ALTER TABLE public.vision_documents
ADD COLUMN IF NOT EXISTS app_name TEXT,
ADD COLUMN IF NOT EXISTS app_tagline TEXT,
ADD COLUMN IF NOT EXISTS app_description TEXT,
ADD COLUMN IF NOT EXISTS app_dna TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS similar_apps TEXT[] DEFAULT '{}';

-- Add new columns for extracted insights
ALTER TABLE public.vision_documents
ADD COLUMN IF NOT EXISTS user_goals TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS technical_needs TEXT[] DEFAULT '{}';

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_vision_blueprint_actions ON public.vision_documents USING gin(blueprint_actions);
CREATE INDEX IF NOT EXISTS idx_vision_blueprint_data ON public.vision_documents USING gin(blueprint_data);
CREATE INDEX IF NOT EXISTS idx_vision_blueprint_views ON public.vision_documents USING gin(blueprint_views);
CREATE INDEX IF NOT EXISTS idx_vision_extraction_version ON public.vision_documents(extraction_version);

-- Create a view for blueprint completeness
CREATE OR REPLACE VIEW public.vision_blueprint_status AS
SELECT 
    vd.id,
    vd.project_id,
    p.name as project_name,
    vd.app_name,
    vd.extraction_version,
    vd.last_extracted,
    vd.blueprint_completeness->>'overall' as overall_completeness,
    jsonb_array_length(vd.blueprint_actions) as action_count,
    jsonb_array_length(vd.blueprint_data) as data_type_count,
    jsonb_array_length(vd.blueprint_views) as view_count,
    jsonb_array_length(vd.blueprint_workflows) as workflow_count,
    jsonb_array_length(vd.blueprint_features) as feature_count,
    CASE 
        WHEN vd.last_extracted IS NULL THEN 'never'
        WHEN vd.last_extracted > NOW() - INTERVAL '1 hour' THEN 'recent'
        WHEN vd.last_extracted > NOW() - INTERVAL '1 day' THEN 'today'
        WHEN vd.last_extracted > NOW() - INTERVAL '1 week' THEN 'this_week'
        ELSE 'outdated'
    END as extraction_status
FROM public.vision_documents vd
JOIN public.projects p ON vd.project_id = p.id;

-- Grant permissions on the view
GRANT SELECT ON public.vision_blueprint_status TO authenticated;

-- Create a function to calculate blueprint completeness
CREATE OR REPLACE FUNCTION calculate_blueprint_completeness(doc_id UUID)
RETURNS JSONB AS $$
DECLARE
    doc RECORD;
    identity_score INTEGER;
    data_score INTEGER;
    actions_score INTEGER;
    views_score INTEGER;
    features_score INTEGER;
    overall_score INTEGER;
BEGIN
    SELECT * INTO doc FROM public.vision_documents WHERE id = doc_id;
    
    -- Calculate identity completeness (0-100)
    identity_score := 0;
    IF doc.app_name IS NOT NULL AND doc.app_name != '' THEN identity_score := identity_score + 25; END IF;
    IF doc.app_tagline IS NOT NULL AND doc.app_tagline != '' THEN identity_score := identity_score + 25; END IF;
    IF doc.app_description IS NOT NULL AND doc.app_description != '' THEN identity_score := identity_score + 25; END IF;
    IF array_length(doc.app_dna, 1) > 0 THEN identity_score := identity_score + 25; END IF;
    
    -- Calculate data completeness (at least 5 data types for 100%)
    data_score := LEAST(jsonb_array_length(doc.blueprint_data) * 20, 100);
    
    -- Calculate actions completeness (at least 10 actions for 100%)
    actions_score := LEAST(jsonb_array_length(doc.blueprint_actions) * 10, 100);
    
    -- Calculate views completeness (at least 6 views for 100%)
    views_score := LEAST(jsonb_array_length(doc.blueprint_views) * 17, 100);
    
    -- Calculate features completeness (at least 4 features for 100%)
    features_score := LEAST(jsonb_array_length(doc.blueprint_features) * 25, 100);
    
    -- Calculate overall score
    overall_score := (identity_score + data_score + actions_score + views_score + features_score) / 5;
    
    RETURN jsonb_build_object(
        'overall', overall_score,
        'identity', identity_score,
        'data', data_score,
        'actions', actions_score,
        'views', views_score,
        'features', features_score
    );
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to update completeness on changes
CREATE OR REPLACE FUNCTION update_blueprint_completeness()
RETURNS TRIGGER AS $$
BEGIN
    NEW.blueprint_completeness := calculate_blueprint_completeness(NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_vision_blueprint_completeness
    BEFORE INSERT OR UPDATE OF 
        blueprint_actions, blueprint_data, blueprint_views, blueprint_workflows, blueprint_features,
        app_name, app_tagline, app_description, app_dna
    ON public.vision_documents
    FOR EACH ROW
    EXECUTE FUNCTION update_blueprint_completeness();

-- Create a function to merge blueprint updates
CREATE OR REPLACE FUNCTION merge_blueprint_update(
    doc_id UUID,
    new_actions JSONB DEFAULT '[]'::JSONB,
    new_data JSONB DEFAULT '[]'::JSONB,
    new_views JSONB DEFAULT '[]'::JSONB,
    new_workflows JSONB DEFAULT '[]'::JSONB,
    new_features JSONB DEFAULT '[]'::JSONB
)
RETURNS VOID AS $$
BEGIN
    UPDATE public.vision_documents
    SET 
        -- Merge arrays, avoiding duplicates based on 'id' or 'name' field
        blueprint_actions = (
            SELECT jsonb_agg(DISTINCT action)
            FROM (
                SELECT jsonb_array_elements(blueprint_actions) AS action
                UNION
                SELECT jsonb_array_elements(new_actions) AS action
            ) actions
        ),
        blueprint_data = (
            SELECT jsonb_agg(DISTINCT data_type)
            FROM (
                SELECT jsonb_array_elements(blueprint_data) AS data_type
                UNION
                SELECT jsonb_array_elements(new_data) AS data_type
            ) data_types
        ),
        blueprint_views = (
            SELECT jsonb_agg(DISTINCT view)
            FROM (
                SELECT jsonb_array_elements(blueprint_views) AS view
                UNION
                SELECT jsonb_array_elements(new_views) AS view
            ) views
        ),
        blueprint_workflows = (
            SELECT jsonb_agg(DISTINCT workflow)
            FROM (
                SELECT jsonb_array_elements(blueprint_workflows) AS workflow
                UNION
                SELECT jsonb_array_elements(new_workflows) AS workflow
            ) workflows
        ),
        blueprint_features = (
            SELECT jsonb_agg(DISTINCT feature)
            FROM (
                SELECT jsonb_array_elements(blueprint_features) AS feature
                UNION
                SELECT jsonb_array_elements(new_features) AS feature
            ) features
        ),
        last_extracted = NOW(),
        extraction_version = 2
    WHERE id = doc_id;
END;
$$ LANGUAGE plpgsql;

-- Add comment
COMMENT ON TABLE public.vision_documents IS 'Blueprint-based vision documents for app development with action-focused structure';
COMMENT ON COLUMN public.vision_documents.blueprint_actions IS 'Array of actions users can perform in the app';
COMMENT ON COLUMN public.vision_documents.blueprint_data IS 'Data types and their categories (stored, computed, external, etc.)';
COMMENT ON COLUMN public.vision_documents.blueprint_views IS 'Views/screens and their purposes';
COMMENT ON COLUMN public.vision_documents.blueprint_workflows IS 'Action sequences that accomplish user goals';
COMMENT ON COLUMN public.vision_documents.blueprint_features IS 'High-level features grouping actions, views, and data';