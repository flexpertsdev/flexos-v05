-- Discovery Chat Schema Migration
-- This migration implements the FlexOS Discovery Chat architecture
-- with support for streaming AI interactions, rich message types,
-- context awareness, and multiple chat modes (Focus, Builder, Wizard)

-- ============================================
-- CORE CHAT TABLES
-- ============================================

-- Drop existing ai_chats messages column if we're migrating
-- (We'll migrate this data to the new chat_messages table)
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'ai_chats' 
        AND column_name = 'messages'
    ) THEN
        -- Store messages for migration
        CREATE TEMP TABLE temp_chat_messages AS 
        SELECT id as chat_id, project_id, user_id, messages, created_at 
        FROM public.ai_chats 
        WHERE messages IS NOT NULL AND messages != '[]'::jsonb;
        
        -- Drop the old column
        ALTER TABLE public.ai_chats DROP COLUMN messages;
    END IF;
END $$;

-- Update ai_chats table structure
ALTER TABLE public.ai_chats 
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived')),
ADD COLUMN IF NOT EXISTS model TEXT DEFAULT 'claude-3-opus-20240229',
ADD COLUMN IF NOT EXISTS total_messages INTEGER DEFAULT 0;

-- Individual messages with rich context support
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chat_id UUID NOT NULL REFERENCES public.ai_chats(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Message basics
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT,
    
    -- Context mode determines behavior
    context_mode TEXT NOT NULL DEFAULT 'builder' CHECK (context_mode IN ('focus', 'builder', 'wizard')),
    wizard_session_id UUID, -- Will reference wizard_sessions table
    
    -- Rich message support
    message_type TEXT DEFAULT 'text' CHECK (message_type IN (
        'text', 'thinking', 'selection', 'comparison', 
        'form', 'visual', 'code', 'design'
    )),
    message_data JSONB DEFAULT '{}',
    
    -- Streaming support
    is_streaming BOOLEAN DEFAULT FALSE,
    stream_id UUID,
    stream_completed BOOLEAN DEFAULT FALSE,
    
    -- Context attachments (array of context objects)
    contexts JSONB DEFAULT '[]',
    
    -- Outputs and actions
    created_entities JSONB DEFAULT '[]',
    suggested_actions JSONB DEFAULT '[]',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Structured outputs from messages
CREATE TABLE IF NOT EXISTS public.message_outputs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID NOT NULL REFERENCES public.chat_messages(id) ON DELETE CASCADE,
    output_type TEXT NOT NULL, -- 'feature', 'page', 'component', 'journey'
    entity_id UUID NOT NULL, -- References actual created entity
    entity_table TEXT NOT NULL, -- Which table the entity is in
    entity_data JSONB NOT NULL, -- Snapshot of created data
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Action suggestions and interactive elements
CREATE TABLE IF NOT EXISTS public.message_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID NOT NULL REFERENCES public.chat_messages(id) ON DELETE CASCADE,
    
    action_type TEXT NOT NULL CHECK (action_type IN ('button', 'suggestion', 'quick_reply')),
    action_key TEXT NOT NULL, -- Unique identifier for action
    
    -- Display properties
    label TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    style JSONB DEFAULT '{}', -- Color, size, variant
    
    -- Behavior configuration
    action_data JSONB NOT NULL, -- What happens when clicked
    requires_confirmation BOOLEAN DEFAULT FALSE,
    
    -- State tracking
    is_enabled BOOLEAN DEFAULT TRUE,
    was_used BOOLEAN DEFAULT FALSE,
    used_at TIMESTAMPTZ,
    used_by UUID REFERENCES public.users(id),
    
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wizard sessions for guided experiences
CREATE TABLE IF NOT EXISTS public.wizard_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    wizard_type TEXT NOT NULL, -- 'project_setup', 'feature_builder', 'page_creator', etc.
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned')),
    
    -- Progress tracking
    total_steps INTEGER,
    completed_steps TEXT[] DEFAULT '{}',
    current_step TEXT,
    
    -- Collected data throughout the wizard
    collected_data JSONB DEFAULT '{}',
    pending_decisions JSONB DEFAULT '[]',
    
    -- Timing
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days')
);

-- Add foreign key for wizard sessions
ALTER TABLE public.chat_messages 
ADD CONSTRAINT chat_messages_wizard_session_fkey 
FOREIGN KEY (wizard_session_id) REFERENCES public.wizard_sessions(id) ON DELETE SET NULL;

-- ============================================
-- ATTACHMENT SYSTEM
-- ============================================

-- File attachments with AI context support
CREATE TABLE IF NOT EXISTS public.attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    message_id UUID REFERENCES public.chat_messages(id) ON DELETE SET NULL,
    
    -- Attachment types for different contexts
    attachment_type TEXT NOT NULL CHECK (attachment_type IN (
        'file',              -- Generic file upload
        'image',             -- Image files (screenshots, designs)
        'document',          -- PDFs, docs, etc.
        'url',               -- External URLs
        'project_context',   -- Reference to project entity
        'selection',         -- User selection in UI
        'component_reference' -- Reference to existing component
    )),
    
    -- File information
    name TEXT NOT NULL,
    original_name TEXT,
    mime_type TEXT,
    size_bytes BIGINT,
    storage_path TEXT, -- Supabase storage path
    public_url TEXT,   -- Public URL if available
    
    -- Parsed content for AI context
    parsed_content JSONB DEFAULT '{}', -- AI-extracted insights
    metadata JSONB DEFAULT '{}',       -- Additional metadata
    
    -- Processing status for async parsing
    processing_status TEXT DEFAULT 'pending' CHECK (processing_status IN (
        'pending', 'processing', 'completed', 'failed'
    )),
    processing_error TEXT,
    processing_attempts INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);

-- ============================================
-- VISUAL MAP MODE SUPPORT
-- ============================================

-- Project flow visualization for Map mode
CREATE TABLE IF NOT EXISTS public.project_flows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT DEFAULT 'Main Flow',
    description TEXT,
    
    -- VueFlow compatible node/edge structure
    nodes JSONB DEFAULT '[]', -- Array of node objects
    edges JSONB DEFAULT '[]', -- Array of edge objects
    
    -- Viewport state
    viewport JSONB DEFAULT '{"x": 0, "y": 0, "zoom": 1}',
    
    -- Layout configuration
    layout_type TEXT DEFAULT 'auto' CHECK (layout_type IN (
        'auto',         -- Automatic layout
        'hierarchical', -- Top-down hierarchy
        'force',        -- Force-directed
        'manual'        -- User-positioned
    )),
    layout_config JSONB DEFAULT '{}',
    
    -- Organization features
    node_groups JSONB DEFAULT '{}', -- Grouping for organization
    
    -- Versioning
    version INTEGER DEFAULT 1,
    is_current BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Node templates for consistent map elements
CREATE TABLE IF NOT EXISTS public.flow_node_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    node_type TEXT NOT NULL, -- 'page', 'feature', 'component', 'journey', 'custom'
    
    -- Default configuration
    default_data JSONB DEFAULT '{}',
    default_style JSONB DEFAULT '{}',
    
    -- Connection rules
    allowed_source_types TEXT[] DEFAULT '{}',
    allowed_target_types TEXT[] DEFAULT '{}',
    max_connections INTEGER,
    
    -- Visual properties
    icon TEXT,
    color TEXT,
    
    is_system BOOLEAN DEFAULT FALSE, -- System templates can't be deleted
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BUILDER STATE PERSISTENCE
-- ============================================

-- Persist builder UI state per user/project
CREATE TABLE IF NOT EXISTS public.builder_states (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Current mode and view state
    current_mode TEXT DEFAULT 'builder' CHECK (current_mode IN ('builder', 'focus', 'map')),
    active_tab TEXT DEFAULT 'vision',
    
    -- Layout preferences
    panel_sizes JSONB DEFAULT '{"chat": 40, "project": 60}',
    collapsed_panels TEXT[] DEFAULT '{}',
    panel_order TEXT[] DEFAULT '{"chat", "project"}',
    
    -- Focus mode specific settings
    focus_preferences JSONB DEFAULT '{
        "show_thinking": true,
        "auto_expand_context": false,
        "conversation_style": "balanced",
        "context_retention": "session"
    }',
    
    -- Map mode specific settings
    map_preferences JSONB DEFAULT '{
        "auto_layout": true,
        "show_labels": true,
        "show_connections": true,
        "connection_style": "smooth",
        "snap_to_grid": false,
        "grid_size": 20
    }',
    
    -- General preferences
    preferences JSONB DEFAULT '{
        "theme": "dark",
        "compact_mode": false,
        "show_hints": true,
        "auto_save": true
    }',
    
    -- Last activity
    last_active_at TIMESTAMPTZ DEFAULT NOW(),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure one state per user/project combination
    UNIQUE(project_id, user_id)
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Chat messages indexes
CREATE INDEX IF NOT EXISTS idx_chat_messages_chat_id ON public.chat_messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_project_id ON public.chat_messages(project_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON public.chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON public.chat_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_context_mode ON public.chat_messages(context_mode);
CREATE INDEX IF NOT EXISTS idx_chat_messages_wizard_session ON public.chat_messages(wizard_session_id) WHERE wizard_session_id IS NOT NULL;

-- Message outputs indexes
CREATE INDEX IF NOT EXISTS idx_message_outputs_message_id ON public.message_outputs(message_id);
CREATE INDEX IF NOT EXISTS idx_message_outputs_entity_id ON public.message_outputs(entity_id);
CREATE INDEX IF NOT EXISTS idx_message_outputs_type ON public.message_outputs(output_type);

-- Message actions indexes
CREATE INDEX IF NOT EXISTS idx_message_actions_message_id ON public.message_actions(message_id);
CREATE INDEX IF NOT EXISTS idx_message_actions_was_used ON public.message_actions(was_used);

-- Wizard sessions indexes
CREATE INDEX IF NOT EXISTS idx_wizard_sessions_user_id ON public.wizard_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_wizard_sessions_project_id ON public.wizard_sessions(project_id);
CREATE INDEX IF NOT EXISTS idx_wizard_sessions_status ON public.wizard_sessions(status);
CREATE INDEX IF NOT EXISTS idx_wizard_sessions_type ON public.wizard_sessions(wizard_type);

-- Attachments indexes
CREATE INDEX IF NOT EXISTS idx_attachments_project_id ON public.attachments(project_id);
CREATE INDEX IF NOT EXISTS idx_attachments_message_id ON public.attachments(message_id);
CREATE INDEX IF NOT EXISTS idx_attachments_type ON public.attachments(attachment_type);
CREATE INDEX IF NOT EXISTS idx_attachments_processing ON public.attachments(processing_status) WHERE processing_status = 'pending';

-- Project flows indexes
CREATE INDEX IF NOT EXISTS idx_project_flows_project_id ON public.project_flows(project_id);
CREATE INDEX IF NOT EXISTS idx_project_flows_user_id ON public.project_flows(user_id);
CREATE INDEX IF NOT EXISTS idx_project_flows_current ON public.project_flows(project_id, is_current) WHERE is_current = TRUE;

-- Builder states indexes
CREATE INDEX IF NOT EXISTS idx_builder_states_project_user ON public.builder_states(project_id, user_id);
CREATE INDEX IF NOT EXISTS idx_builder_states_last_active ON public.builder_states(last_active_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all new tables
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_outputs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wizard_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flow_node_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.builder_states ENABLE ROW LEVEL SECURITY;

-- Chat messages policies
CREATE POLICY "Users can view their project chat messages" ON public.chat_messages
    FOR SELECT USING (
        auth.uid() = user_id OR 
        EXISTS (
            SELECT 1 FROM public.project_collaborators 
            WHERE project_id = chat_messages.project_id 
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create chat messages in their projects" ON public.chat_messages
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM public.projects 
            WHERE id = chat_messages.project_id 
            AND (user_id = auth.uid() OR EXISTS (
                SELECT 1 FROM public.project_collaborators 
                WHERE project_id = projects.id 
                AND user_id = auth.uid() 
                AND role IN ('owner', 'editor')
            ))
        )
    );

CREATE POLICY "Users can update their own chat messages" ON public.chat_messages
    FOR UPDATE USING (auth.uid() = user_id);

-- Message outputs policies
CREATE POLICY "Users can view message outputs from their projects" ON public.message_outputs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.chat_messages 
            WHERE id = message_outputs.message_id 
            AND (user_id = auth.uid() OR EXISTS (
                SELECT 1 FROM public.project_collaborators 
                WHERE project_id = chat_messages.project_id 
                AND user_id = auth.uid()
            ))
        )
    );

CREATE POLICY "Users can create message outputs" ON public.message_outputs
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.chat_messages 
            WHERE id = message_outputs.message_id 
            AND user_id = auth.uid()
        )
    );

-- Message actions policies
CREATE POLICY "Users can view message actions" ON public.message_actions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.chat_messages 
            WHERE id = message_actions.message_id 
            AND (user_id = auth.uid() OR EXISTS (
                SELECT 1 FROM public.project_collaborators 
                WHERE project_id = chat_messages.project_id 
                AND user_id = auth.uid()
            ))
        )
    );

CREATE POLICY "Users can update message actions" ON public.message_actions
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.chat_messages 
            WHERE id = message_actions.message_id 
            AND (user_id = auth.uid() OR EXISTS (
                SELECT 1 FROM public.project_collaborators 
                WHERE project_id = chat_messages.project_id 
                AND user_id = auth.uid() 
                AND role IN ('owner', 'editor')
            ))
        )
    );

-- Wizard sessions policies
CREATE POLICY "Users can manage their wizard sessions" ON public.wizard_sessions
    FOR ALL USING (auth.uid() = user_id);

-- Attachments policies
CREATE POLICY "Users can view attachments in their projects" ON public.attachments
    FOR SELECT USING (
        auth.uid() = user_id OR 
        EXISTS (
            SELECT 1 FROM public.project_collaborators 
            WHERE project_id = attachments.project_id 
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create attachments in their projects" ON public.attachments
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM public.projects 
            WHERE id = attachments.project_id 
            AND (user_id = auth.uid() OR EXISTS (
                SELECT 1 FROM public.project_collaborators 
                WHERE project_id = projects.id 
                AND user_id = auth.uid() 
                AND role IN ('owner', 'editor')
            ))
        )
    );

CREATE POLICY "Users can delete their attachments" ON public.attachments
    FOR DELETE USING (auth.uid() = user_id);

-- Project flows policies
CREATE POLICY "Users can manage flows in their projects" ON public.project_flows
    FOR ALL USING (
        auth.uid() = user_id OR 
        EXISTS (
            SELECT 1 FROM public.project_collaborators 
            WHERE project_id = project_flows.project_id 
            AND user_id = auth.uid() 
            AND role IN ('owner', 'editor')
        )
    );

-- Flow node templates policies
CREATE POLICY "Users can view all templates" ON public.flow_node_templates
    FOR SELECT USING (TRUE);

CREATE POLICY "Only admins can manage system templates" ON public.flow_node_templates
    FOR ALL USING (
        NOT is_system OR 
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Builder states policies
CREATE POLICY "Users can manage their builder states" ON public.builder_states
    FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- UPDATE TRIGGERS
-- ============================================

-- Add update triggers for new tables
CREATE TRIGGER update_chat_messages_updated_at BEFORE UPDATE ON public.chat_messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_wizard_sessions_updated_at BEFORE UPDATE ON public.wizard_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_project_flows_updated_at BEFORE UPDATE ON public.project_flows
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_flow_node_templates_updated_at BEFORE UPDATE ON public.flow_node_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_builder_states_updated_at BEFORE UPDATE ON public.builder_states
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Update last_active_at for builder states
CREATE OR REPLACE FUNCTION update_builder_state_activity()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_active_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_builder_state_activity BEFORE UPDATE ON public.builder_states
    FOR EACH ROW EXECUTE FUNCTION update_builder_state_activity();

-- ============================================
-- MESSAGE COUNT TRIGGER
-- ============================================

-- Function to update message count in ai_chats
CREATE OR REPLACE FUNCTION update_chat_message_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.ai_chats 
        SET total_messages = total_messages + 1,
            updated_at = NOW()
        WHERE id = NEW.chat_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.ai_chats 
        SET total_messages = total_messages - 1,
            updated_at = NOW()
        WHERE id = OLD.chat_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_chat_message_count_trigger
AFTER INSERT OR DELETE ON public.chat_messages
FOR EACH ROW EXECUTE FUNCTION update_chat_message_count();

-- ============================================
-- DATA MIGRATION
-- ============================================

-- Migrate existing ai_chats messages to new structure
DO $$ 
DECLARE
    chat_record RECORD;
    message_json JSONB;
    message_array JSONB;
BEGIN
    -- Check if we have data to migrate
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'temp_chat_messages') THEN
        FOR chat_record IN SELECT * FROM temp_chat_messages LOOP
            message_array := chat_record.messages;
            
            -- Process each message in the array
            FOR message_json IN SELECT * FROM jsonb_array_elements(message_array) LOOP
                INSERT INTO public.chat_messages (
                    chat_id,
                    project_id,
                    user_id,
                    role,
                    content,
                    context_mode,
                    created_at
                ) VALUES (
                    chat_record.chat_id,
                    chat_record.project_id,
                    chat_record.user_id,
                    COALESCE(message_json->>'role', 'user'),
                    message_json->>'content',
                    'builder', -- Default to builder mode for historical messages
                    COALESCE((message_json->>'created_at')::timestamptz, chat_record.created_at)
                );
            END LOOP;
            
            -- Update message count
            UPDATE public.ai_chats 
            SET total_messages = jsonb_array_length(message_array)
            WHERE id = chat_record.chat_id;
        END LOOP;
        
        -- Clean up temp table
        DROP TABLE temp_chat_messages;
    END IF;
END $$;

-- ============================================
-- DEFAULT FLOW NODE TEMPLATES
-- ============================================

-- Insert default node templates for the map view
INSERT INTO public.flow_node_templates (name, description, node_type, default_data, default_style, icon, color, is_system)
VALUES 
    ('Page Node', 'Represents a page in your application', 'page', 
     '{"label": "New Page", "path": "/", "type": "page"}', 
     '{"width": 180, "height": 80, "backgroundColor": "#1A1F26", "borderColor": "#16C181"}',
     'mdi:file-document-outline', '#16C181', true),
     
    ('Feature Node', 'Represents a feature or functionality', 'feature',
     '{"label": "New Feature", "status": "planned", "priority": "medium"}',
     '{"width": 200, "height": 100, "backgroundColor": "#1A1F26", "borderColor": "#3B82F6"}',
     'mdi:puzzle-outline', '#3B82F6', true),
     
    ('Component Node', 'Represents a reusable component', 'component',
     '{"label": "New Component", "category": "custom"}',
     '{"width": 160, "height": 80, "backgroundColor": "#1A1F26", "borderColor": "#8B5CF6"}',
     'mdi:cube-outline', '#8B5CF6', true),
     
    ('Journey Node', 'Represents a user journey or flow', 'journey',
     '{"label": "New Journey", "persona": "user", "steps": []}',
     '{"width": 220, "height": 120, "backgroundColor": "#1A1F26", "borderColor": "#F59E0B"}',
     'mdi:map-marker-path', '#F59E0B', true),
     
    ('API Endpoint', 'Represents an API endpoint', 'custom',
     '{"label": "New Endpoint", "method": "GET", "path": "/api/"}',
     '{"width": 180, "height": 80, "backgroundColor": "#1A1F26", "borderColor": "#EF4444"}',
     'mdi:api', '#EF4444', true),
     
    ('Database Table', 'Represents a database table', 'custom',
     '{"label": "New Table", "schema": "public"}',
     '{"width": 180, "height": 100, "backgroundColor": "#1A1F26", "borderColor": "#10B981"}',
     'mdi:database', '#10B981', true);

-- ============================================
-- GRANT PERMISSIONS
-- ============================================

-- Grant necessary permissions to authenticated users
GRANT SELECT, INSERT, UPDATE ON public.chat_messages TO authenticated;
GRANT SELECT, INSERT ON public.message_outputs TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.message_actions TO authenticated;
GRANT ALL ON public.wizard_sessions TO authenticated;
GRANT ALL ON public.attachments TO authenticated;
GRANT ALL ON public.project_flows TO authenticated;
GRANT SELECT ON public.flow_node_templates TO authenticated;
GRANT ALL ON public.builder_states TO authenticated;

-- Grant usage on sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- ============================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================

COMMENT ON TABLE public.chat_messages IS 'Individual chat messages with support for rich content types and streaming';
COMMENT ON TABLE public.message_outputs IS 'Tracks entities created by AI messages';
COMMENT ON TABLE public.message_actions IS 'Interactive action buttons and suggestions from AI';
COMMENT ON TABLE public.wizard_sessions IS 'Guided wizard sessions for complex workflows';
COMMENT ON TABLE public.attachments IS 'File and context attachments for chat messages';
COMMENT ON TABLE public.project_flows IS 'Visual project structure for Map mode using VueFlow';
COMMENT ON TABLE public.builder_states IS 'Persisted UI state for each user/project combination';

COMMENT ON COLUMN public.chat_messages.context_mode IS 'Chat mode: focus (exploratory), builder (task-driven), wizard (guided)';
COMMENT ON COLUMN public.chat_messages.contexts IS 'Array of context objects attached to the message';
COMMENT ON COLUMN public.attachments.parsed_content IS 'AI-extracted insights from the attachment for context';
COMMENT ON COLUMN public.project_flows.nodes IS 'VueFlow-compatible node array with positions and data';
COMMENT ON COLUMN public.builder_states.focus_preferences IS 'User preferences specific to Focus mode';