-- Create chat messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    chat_id uuid REFERENCES public.ai_chats(id) ON DELETE CASCADE,
    project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    role text NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content text,
    context_mode text CHECK (context_mode IN ('focus', 'builder', 'wizard')),
    message_type text DEFAULT 'text',
    is_streaming boolean DEFAULT false,
    stream_id text,
    stream_completed boolean DEFAULT false,
    contexts jsonb DEFAULT '[]'::jsonb,
    message_data jsonb DEFAULT '{}'::jsonb,
    created_entities jsonb DEFAULT '[]'::jsonb,
    suggested_actions jsonb DEFAULT '[]'::jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create message outputs table (tracks entities created by AI)
CREATE TABLE IF NOT EXISTS public.message_outputs (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    message_id uuid REFERENCES public.chat_messages(id) ON DELETE CASCADE,
    output_type text NOT NULL,
    entity_id uuid NOT NULL,
    entity_table text NOT NULL,
    entity_data jsonb DEFAULT '{}'::jsonb,
    created_at timestamptz DEFAULT now()
);

-- Create message actions table (tracks suggested actions)
CREATE TABLE IF NOT EXISTS public.message_actions (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    message_id uuid REFERENCES public.chat_messages(id) ON DELETE CASCADE,
    action_type text NOT NULL,
    action_key text NOT NULL,
    label text NOT NULL,
    action_data jsonb DEFAULT '{}'::jsonb,
    display_order integer DEFAULT 0,
    was_used boolean DEFAULT false,
    used_at timestamptz,
    created_at timestamptz DEFAULT now()
);

-- Create wizard sessions table
CREATE TABLE IF NOT EXISTS public.wizard_sessions (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    wizard_type text NOT NULL,
    state text DEFAULT 'active' CHECK (state IN ('active', 'completed', 'cancelled')),
    current_step text,
    collected_data jsonb DEFAULT '{}'::jsonb,
    progress float DEFAULT 0,
    completed_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Update ai_chats table to include mode tracking
ALTER TABLE public.ai_chats 
ADD COLUMN IF NOT EXISTS mode text DEFAULT 'builder' CHECK (mode IN ('focus', 'builder', 'wizard'));

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_chat_messages_chat_id ON public.chat_messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_project_id ON public.chat_messages(project_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON public.chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_context_mode ON public.chat_messages(context_mode);
CREATE INDEX IF NOT EXISTS idx_message_outputs_message_id ON public.message_outputs(message_id);
CREATE INDEX IF NOT EXISTS idx_message_actions_message_id ON public.message_actions(message_id);
CREATE INDEX IF NOT EXISTS idx_wizard_sessions_project_id ON public.wizard_sessions(project_id);
CREATE INDEX IF NOT EXISTS idx_wizard_sessions_user_id ON public.wizard_sessions(user_id);

-- RLS Policies
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_outputs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wizard_sessions ENABLE ROW LEVEL SECURITY;

-- Chat messages policies
CREATE POLICY "Users can view their own chat messages" ON public.chat_messages
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own chat messages" ON public.chat_messages
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chat messages" ON public.chat_messages
    FOR UPDATE USING (auth.uid() = user_id);

-- Message outputs policies
CREATE POLICY "Users can view message outputs from their messages" ON public.message_outputs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.chat_messages
            WHERE chat_messages.id = message_outputs.message_id
            AND chat_messages.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create message outputs for their messages" ON public.message_outputs
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.chat_messages
            WHERE chat_messages.id = message_outputs.message_id
            AND chat_messages.user_id = auth.uid()
        )
    );

-- Message actions policies
CREATE POLICY "Users can view message actions from their messages" ON public.message_actions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.chat_messages
            WHERE chat_messages.id = message_actions.message_id
            AND chat_messages.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create message actions for their messages" ON public.message_actions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.chat_messages
            WHERE chat_messages.id = message_actions.message_id
            AND chat_messages.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update message actions from their messages" ON public.message_actions
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.chat_messages
            WHERE chat_messages.id = message_actions.message_id
            AND chat_messages.user_id = auth.uid()
        )
    );

-- Wizard sessions policies
CREATE POLICY "Users can view their own wizard sessions" ON public.wizard_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own wizard sessions" ON public.wizard_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wizard sessions" ON public.wizard_sessions
    FOR UPDATE USING (auth.uid() = user_id);

-- Functions
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers
CREATE TRIGGER update_chat_messages_updated_at BEFORE UPDATE ON public.chat_messages
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_wizard_sessions_updated_at BEFORE UPDATE ON public.wizard_sessions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();