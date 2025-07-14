# FlexOS Discovery Chat Implementation Guide

## High-Level Vision

### Core Concept
A context-aware AI chat system that adapts its behavior based on the user's needs:
- **Focus Mode**: Open exploration and ideation
- **Builder Mode**: Task-driven interactions
- **Wizard Mode**: Guided, structured processes

### Key Principles
1. **Every message is independent** - No forced chronological dependencies
2. **Context is intentional** - Only include what's relevant
3. **Rich interactions** - Beyond text: selections, comparisons, visual elements
4. **Streaming intelligence** - Show AI thinking process
5. **Actionable outputs** - Create real entities in the database

## Context System Architecture

### 1. Point-and-Click Attached Context
```typescript
interface SelectionContext {
  type: 'selection'
  data: {
    selectedElement: {
      type: 'component' | 'text' | 'feature' | 'page'
      id?: string
      content: string
      metadata: Record<string, any>
    }
    source: 'editor' | 'preview' | 'sidebar'
    position: { x: number; y: number }
  }
}
```

**Implementation**: 
- User selects element in UI
- Context attached to next message automatically
- AI understands what user is referring to

### 2. Uploaded & Parsed Context
```typescript
interface UploadedContext {
  type: 'attachment'
  data: {
    fileType: 'image' | 'pdf' | 'code' | 'design'
    originalName: string
    parsedContent: {
      summary: string
      extractedData: Record<string, any>
      relevantInsights: string[]
    }
    storageUrl: string
  }
}
```

**Processing Flow**:
1. User uploads file
2. System queues for processing
3. AI extracts relevant information
4. Parsed content becomes searchable context

### 3. Location-Based Context
```typescript
interface LocationContext {
  type: 'location'
  data: {
    currentView: 'dashboard' | 'editor' | 'preview' | 'settings'
    activeProject: string
    activePage?: string
    activeComponent?: string
    breadcrumb: string[]
    viewState: Record<string, any>
  }
}
```

**Automatic Tracking**:
- Track user navigation
- Include in message context when relevant
- AI knows where user is looking

### 4. Wizard-Specific Context
```typescript
interface WizardContext {
  type: 'wizard_session'
  data: {
    wizardType: string
    sessionId: string
    progress: {
      totalSteps: number
      completedSteps: string[]
      currentStep: string
    }
    collectedData: Record<string, any>
    pendingDecisions: Array<{
      key: string
      question: string
      required: boolean
    }>
  }
}
```

## Database Schema

```sql
-- Core message table with context support
CREATE TABLE public.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chat_id UUID NOT NULL REFERENCES public.ai_chats(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Message basics
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT,
    
    -- Context mode determines behavior
    context_mode TEXT NOT NULL CHECK (context_mode IN ('focus', 'builder', 'wizard')),
    wizard_session_id UUID REFERENCES public.wizard_sessions(id),
    
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

-- Structured outputs from messages
CREATE TABLE public.message_outputs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID NOT NULL REFERENCES public.chat_messages(id) ON DELETE CASCADE,
    output_type TEXT NOT NULL, -- 'feature', 'page', 'component', etc
    entity_id UUID NOT NULL, -- References actual created entity
    entity_data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Action suggestions and buttons
CREATE TABLE public.message_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID NOT NULL REFERENCES public.chat_messages(id) ON DELETE CASCADE,
    
    action_type TEXT NOT NULL, -- 'button', 'suggestion', 'quick_reply'
    action_key TEXT NOT NULL, -- Unique identifier for action
    
    -- Display
    label TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    style JSONB DEFAULT '{}', -- Color, size, variant
    
    -- Behavior
    action_data JSONB NOT NULL, -- What happens when clicked
    requires_confirmation BOOLEAN DEFAULT FALSE,
    
    -- State
    is_enabled BOOLEAN DEFAULT TRUE,
    was_used BOOLEAN DEFAULT FALSE,
    used_at TIMESTAMPTZ,
    
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Rich Message Types

### 1. Selection Message
```typescript
interface SelectionMessage {
  type: 'selection'
  content: string // Question/prompt
  data: {
    options: Array<{
      id: string
      label: string
      description?: string
      preview?: string // URL or base64
      metadata?: Record<string, any>
    }>
    allowMultiple: boolean
    layout: 'grid' | 'list' | 'carousel'
  }
}
```

### 2. Comparison Message
```typescript
interface ComparisonMessage {
  type: 'comparison'
  content: string
  data: {
    items: Array<{
      id: string
      title: string
      attributes: Record<string, any>
      preview?: string
    }>
    compareKeys: string[] // Which attributes to show
    layout: 'side-by-side' | 'table'
  }
}
```

### 3. Sequential Thinking Display
```typescript
interface ThinkingMessage {
  type: 'thinking'
  content: string // Current thought
  data: {
    stepNumber: number
    totalSteps?: number
    thinkingType: 'analyzing' | 'planning' | 'deciding'
    isRevision: boolean
    confidence: number
  }
}
```

## Anthropic API Implementation (Nuxt/Supabase)

### Server API Route
```typescript
// server/api/chat/stream.post.ts
import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'

export default defineEventHandler(async (event) => {
  const { messages, context, mode } = await readBody(event)
  const supabase = createClient(...)
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  
  // Build system prompt based on mode
  const systemPrompt = buildSystemPrompt(mode, context)
  
  // Create streaming response
  const stream = await anthropic.messages.create({
    model: 'claude-3-opus-20240229',
    max_tokens: 4000,
    temperature: mode === 'focus' ? 0.8 : 0.7,
    system: systemPrompt,
    messages: formatMessages(messages, context),
    stream: true,
  })
  
  // Set up SSE
  setHeader(event, 'Content-Type', 'text/event-stream')
  setHeader(event, 'Cache-Control', 'no-cache')
  
  const messageId = await createMessageRecord(supabase, {
    role: 'assistant',
    context_mode: mode,
    is_streaming: true,
  })
  
  let fullContent = ''
  let thinkingSteps = []
  let suggestedActions = []
  let createdEntities = []
  
  for await (const chunk of stream) {
    if (chunk.type === 'content_block_start') {
      if (chunk.content_block.type === 'text') {
        await send(event, `data: ${JSON.stringify({
          type: 'start',
          messageId
        })}\n\n`)
      }
    }
    
    if (chunk.type === 'content_block_delta') {
      const delta = chunk.delta.text
      fullContent += delta
      
      // Parse for special content
      const parsed = parseStreamDelta(delta, {
        onThinking: (step) => {
          thinkingSteps.push(step)
          send(event, `data: ${JSON.stringify({
            type: 'thinking',
            content: step
          })}\n\n`)
        },
        onAction: (action) => {
          suggestedActions.push(action)
        },
        onEntity: (entity) => {
          createdEntities.push(entity)
        }
      })
      
      // Send text delta
      await send(event, `data: ${JSON.stringify({
        type: 'delta',
        content: parsed.text
      })}\n\n`)
    }
  }
  
  // Finalize message
  await finalizeMessage(supabase, messageId, {
    content: fullContent,
    suggested_actions: suggestedActions,
    created_entities: createdEntities,
  })
  
  await send(event, `data: ${JSON.stringify({
    type: 'done',
    messageId,
    actions: suggestedActions,
    entities: createdEntities
  })}\n\n`)
})
```

### Client Implementation
```vue
<!-- components/DiscoveryChat.vue -->
<template>
  <div class="discovery-chat">
    <!-- Mode Switcher -->
    <ChatModeSwitcher v-model="currentMode" />
    
    <!-- Messages -->
    <div class="messages">
      <ChatMessage 
        v-for="message in messages" 
        :key="message.id"
        :message="message"
        @action-clicked="handleAction"
      />
      
      <!-- Streaming Message -->
      <StreamingMessage 
        v-if="isStreaming"
        :content="streamingContent"
        :thinking-steps="thinkingSteps"
      />
    </div>
    
    <!-- Input Area -->
    <ChatInput 
      v-model="input"
      :mode="currentMode"
      :attached-context="attachedContext"
      @submit="sendMessage"
      @attach-context="attachContext"
    />
  </div>
</template>

<script setup>
const currentMode = ref('builder')
const messages = ref([])
const isStreaming = ref(false)
const streamingContent = ref('')
const thinkingSteps = ref([])

async function sendMessage() {
  const userMessage = {
    role: 'user',
    content: input.value,
    context_mode: currentMode.value,
    contexts: gatherContexts(),
  }
  
  messages.value.push(userMessage)
  isStreaming.value = true
  streamingContent.value = ''
  thinkingSteps.value = []
  
  const response = await fetch('/api/chat/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: getRelevantMessages(),
      context: gatherContexts(),
      mode: currentMode.value,
    }),
  })
  
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    
    const chunk = decoder.decode(value)
    const lines = chunk.split('\n')
    
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = JSON.parse(line.slice(6))
        handleStreamData(data)
      }
    }
  }
}

function handleStreamData(data) {
  switch (data.type) {
    case 'delta':
      streamingContent.value += data.content
      break
      
    case 'thinking':
      thinkingSteps.value.push(data.content)
      break
      
    case 'done':
      isStreaming.value = false
      messages.value.push({
        id: data.messageId,
        role: 'assistant',
        content: streamingContent.value,
        suggested_actions: data.actions,
        created_entities: data.entities,
      })
      break
  }
}

function gatherContexts() {
  const contexts = []
  
  // Location context
  contexts.push({
    type: 'location',
    data: {
      currentView: route.name,
      activeProject: projectStore.currentProject?.id,
      activePage: pageStore.currentPage?.id,
    }
  })
  
  // Attached contexts
  if (attachedContext.value) {
    contexts.push(attachedContext.value)
  }
  
  // Mode-specific context
  if (currentMode.value === 'wizard' && activeWizard.value) {
    contexts.push({
      type: 'wizard_session',
      data: activeWizard.value
    })
  }
  
  return contexts
}
</script>
```

### Message Components
```vue
<!-- components/messages/SelectionMessage.vue -->
<template>
  <div class="selection-message">
    <p>{{ message.content }}</p>
    
    <div 
      class="options"
      :class="`layout-${message.data.layout}`"
    >
      <button
        v-for="option in message.data.options"
        :key="option.id"
        class="option"
        @click="selectOption(option)"
      >
        <img 
          v-if="option.preview" 
          :src="option.preview"
          :alt="option.label"
        >
        <span class="label">{{ option.label }}</span>
        <span 
          v-if="option.description" 
          class="description"
        >
          {{ option.description }}
        </span>
      </button>
    </div>
  </div>
</template>
```

## System Prompts by Mode

### Focus Mode
```
You are in FOCUS MODE - an exploratory conversation mode.
- Be curious and encouraging
- Ask open-ended questions
- Don't rush to solutions
- Build understanding gradually
- Remember everything discussed for future reference
```

### Builder Mode
```
You are in BUILDER MODE - a task-oriented mode.
- Be direct and efficient
- Create entities when requested
- Suggest specific actions
- Focus on implementation
- Each message should advance the project
```

### Wizard Mode
```
You are in WIZARD MODE - guiding through [WIZARD_TYPE].
Current progress: [PROGRESS]
Collected data: [DATA]

- Follow the wizard structure
- Collect required information
- Provide rich interactions
- Allow flexibility in order
- Show progress clearly
```

## Action System

### Action Types
```typescript
type ActionConfig = 
  | { type: 'create_entity', entity: 'feature' | 'page' | 'component', data: any }
  | { type: 'start_wizard', wizard: string }
  | { type: 'switch_mode', mode: 'focus' | 'builder' | 'wizard' }
  | { type: 'provide_input', inputType: string, validation?: any }
  | { type: 'navigate', target: string }
```

### Rendering Actions
```vue
<ActionButton
  v-for="action in message.suggested_actions"
  :key="action.id"
  :action="action"
  @click="executeAction(action)"
/>
```

This implementation guide provides the foundation for your discovery chat system with rich interactions, context awareness, and streaming AI responses.