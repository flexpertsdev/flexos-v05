-- Add chat_messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chat_id UUID REFERENCES public.ai_chats(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Message basics
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT,
    
    -- Context mode determines behavior
    context_mode TEXT NOT NULL DEFAULT 'builder' CHECK (context_mode IN ('focus', 'builder', 'wizard')),
    wizard_session_id UUID,
    
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
    
    -- Context attachments
    contexts JSONB DEFAULT '[]', -- Array of context objects
    
    -- Outputs and actions
    created_entities JSONB DEFAULT '[]',
    suggested_actions JSONB DEFAULT '[]',
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_chat_messages_project_id ON public.chat_messages(project_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON public.chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_chat_id ON public.chat_messages(chat_id);

-- Enable RLS
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own messages" ON public.chat_messages
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own messages" ON public.chat_messages
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own messages" ON public.chat_messages
    FOR UPDATE USING (auth.uid() = user_id);
