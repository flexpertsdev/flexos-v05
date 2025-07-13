-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    company TEXT,
    role TEXT DEFAULT 'user',
    onboarding_completed BOOLEAN DEFAULT FALSE,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects table
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    type TEXT DEFAULT 'web-app', -- web-app, mobile-app, pwa, api, fullstack, library
    status TEXT DEFAULT 'draft', -- draft, active, archived
    visibility TEXT DEFAULT 'private', -- private, public
    icon TEXT DEFAULT '🚀',
    color TEXT DEFAULT '#16C181',
    settings JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project collaborators
CREATE TABLE public.project_collaborators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'viewer', -- owner, editor, viewer
    permissions JSONB DEFAULT '{}',
    invited_by UUID REFERENCES public.users(id),
    accepted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id, user_id)
);

-- Pages table
CREATE TABLE public.pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    path TEXT NOT NULL,
    type TEXT DEFAULT 'page', -- page, layout, component
    parent_id UUID REFERENCES public.pages(id) ON DELETE CASCADE,
    template TEXT,
    settings JSONB DEFAULT '{}',
    meta JSONB DEFAULT '{}',
    content JSONB DEFAULT '{}',
    order_index INTEGER DEFAULT 0,
    is_home BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id, path)
);

-- Features table
CREATE TABLE public.features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    category TEXT, -- auth, database, api, ui, integration
    type TEXT, -- core, plugin, custom
    status TEXT DEFAULT 'planned', -- planned, in-progress, completed
    priority TEXT DEFAULT 'medium', -- low, medium, high, critical
    settings JSONB DEFAULT '{}',
    dependencies JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id, slug)
);

-- Journeys (user flows)
CREATE TABLE public.journeys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    type TEXT DEFAULT 'user-flow', -- user-flow, admin-flow, api-flow
    persona TEXT,
    status TEXT DEFAULT 'draft',
    steps JSONB DEFAULT '[]',
    triggers JSONB DEFAULT '[]',
    outcomes JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id, slug)
);

-- Components table
CREATE TABLE public.components (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    category TEXT, -- base, form, layout, navigation, etc.
    description TEXT,
    props JSONB DEFAULT '{}',
    slots JSONB DEFAULT '{}',
    events JSONB DEFAULT '{}',
    code TEXT,
    preview_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id, slug)
);

-- Wizard runs (track wizard completions)
CREATE TABLE public.wizard_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    wizard_id TEXT NOT NULL,
    status TEXT DEFAULT 'in-progress', -- in-progress, completed, abandoned
    current_phase TEXT,
    answers JSONB DEFAULT '{}',
    outputs JSONB DEFAULT '{}',
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project activity log
CREATE TABLE public.project_activity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    action TEXT NOT NULL, -- created, updated, deleted, shared, exported
    entity_type TEXT, -- project, page, feature, journey, component
    entity_id UUID,
    entity_name TEXT,
    details JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI chat history
CREATE TABLE public.ai_chats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    wizard_run_id UUID REFERENCES public.wizard_runs(id) ON DELETE CASCADE,
    messages JSONB DEFAULT '[]',
    context JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_projects_user_id ON public.projects(user_id);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_pages_project_id ON public.pages(project_id);
CREATE INDEX idx_features_project_id ON public.features(project_id);
CREATE INDEX idx_journeys_project_id ON public.journeys(project_id);
CREATE INDEX idx_components_project_id ON public.components(project_id);
CREATE INDEX idx_wizard_runs_user_id ON public.wizard_runs(user_id);
CREATE INDEX idx_wizard_runs_project_id ON public.wizard_runs(project_id);
CREATE INDEX idx_project_activity_project_id ON public.project_activity(project_id);
CREATE INDEX idx_ai_chats_project_id ON public.ai_chats(project_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.components ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wizard_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_chats ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users can read their own profile
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Projects policies
CREATE POLICY "Users can view own projects" ON public.projects
    FOR SELECT USING (
        auth.uid() = user_id OR 
        EXISTS (
            SELECT 1 FROM public.project_collaborators 
            WHERE project_id = projects.id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create projects" ON public.projects
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON public.projects
    FOR UPDATE USING (
        auth.uid() = user_id OR 
        EXISTS (
            SELECT 1 FROM public.project_collaborators 
            WHERE project_id = projects.id AND user_id = auth.uid() AND role IN ('owner', 'editor')
        )
    );

CREATE POLICY "Users can delete own projects" ON public.projects
    FOR DELETE USING (auth.uid() = user_id);

-- Similar policies for other tables (pages, features, journeys, components)
CREATE POLICY "Users can manage project pages" ON public.pages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.projects 
            WHERE id = pages.project_id AND (
                user_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM public.project_collaborators 
                    WHERE project_id = projects.id AND user_id = auth.uid() AND role IN ('owner', 'editor')
                )
            )
        )
    );

CREATE POLICY "Users can manage project features" ON public.features
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.projects 
            WHERE id = features.project_id AND (
                user_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM public.project_collaborators 
                    WHERE project_id = projects.id AND user_id = auth.uid() AND role IN ('owner', 'editor')
                )
            )
        )
    );

-- Wizard runs - users can only see their own
CREATE POLICY "Users can manage own wizard runs" ON public.wizard_runs
    FOR ALL USING (auth.uid() = user_id);

-- Functions

-- Function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email)
    VALUES (NEW.id, NEW.email);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update triggers to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON public.pages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_features_updated_at BEFORE UPDATE ON public.features
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_journeys_updated_at BEFORE UPDATE ON public.journeys
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_components_updated_at BEFORE UPDATE ON public.components
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_wizard_runs_updated_at BEFORE UPDATE ON public.wizard_runs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_ai_chats_updated_at BEFORE UPDATE ON public.ai_chats
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Function to generate project slug
CREATE OR REPLACE FUNCTION generate_project_slug(project_name TEXT, user_id UUID)
RETURNS TEXT AS $$
DECLARE
    base_slug TEXT;
    final_slug TEXT;
    counter INTEGER := 0;
BEGIN
    -- Convert to lowercase and replace spaces with hyphens
    base_slug := LOWER(REGEXP_REPLACE(project_name, '[^a-zA-Z0-9]+', '-', 'g'));
    base_slug := TRIM(BOTH '-' FROM base_slug);
    
    final_slug := base_slug;
    
    -- Check for uniqueness and add counter if needed
    WHILE EXISTS (SELECT 1 FROM public.projects WHERE slug = final_slug) LOOP
        counter := counter + 1;
        final_slug := base_slug || '-' || counter;
    END LOOP;
    
    RETURN final_slug;
END;
$$ LANGUAGE plpgsql;