# Anthropic API Integration & Streaming Guide

## API Configuration

### Environment Setup
```bash
# .env
ANTHROPIC_API_KEY=your-api-key
ANTHROPIC_MODEL=claude-3-opus-20240229
ANTHROPIC_MAX_TOKENS=4000
```

### Nuxt Configuration
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    experimental: {
      asyncContext: true // For streaming support
    }
  },
  runtimeConfig: {
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    anthropicModel: process.env.ANTHROPIC_MODEL,
    public: {
      // Don't expose API key to client
    }
  }
})
```

## Streaming Response Parser

### Server-Side Stream Handler
```typescript
// server/utils/anthropic-stream.ts
import { Anthropic } from '@anthropic-ai/sdk'

interface StreamHandlers {
  onThinking?: (step: ThinkingStep) => void
  onDataObject?: (obj: DataObject) => void
  onAction?: (action: ActionSuggestion) => void
  onText?: (text: string) => void
  onError?: (error: Error) => void
}

export class AnthropicStreamParser {
  private buffer = ''
  private inThinkingBlock = false
  private inDataBlock = false
  private currentDataType = ''
  
  constructor(private handlers: StreamHandlers) {}
  
  processChunk(text: string) {
    this.buffer += text
    
    // Parse thinking blocks
    this.parseThinkingBlocks()
    
    // Parse data objects
    this.parseDataObjects()
    
    // Parse action suggestions
    this.parseActions()
    
    // Send remaining text
    if (this.buffer && !this.inSpecialBlock()) {
      this.handlers.onText?.(this.buffer)
      this.buffer = ''
    }
  }
  
  private parseThinkingBlocks() {
    const thinkingRegex = /<thinking>([\s\S]*?)<\/thinking>/g
    let match
    
    while ((match = thinkingRegex.exec(this.buffer)) !== null) {
      const thinking = match[1].trim()
      const steps = this.parseThinkingSteps(thinking)
      
      steps.forEach(step => {
        this.handlers.onThinking?.(step)
      })
      
      // Remove thinking block from buffer
      this.buffer = this.buffer.replace(match[0], '')
    }
  }
  
  private parseThinkingSteps(thinking: string): ThinkingStep[] {
    // Parse structured thinking format
    const steps: ThinkingStep[] = []
    const lines = thinking.split('\n')
    
    let currentStep: Partial<ThinkingStep> = {}
    
    for (const line of lines) {
      if (line.startsWith('Step ')) {
        if (currentStep.content) {
          steps.push(currentStep as ThinkingStep)
        }
        currentStep = {
          number: parseInt(line.match(/Step (\d+)/)?.[1] || '1'),
          content: '',
          type: 'analysis'
        }
      } else if (line.startsWith('Type:')) {
        currentStep.type = line.replace('Type:', '').trim() as any
      } else if (line.startsWith('Confidence:')) {
        currentStep.confidence = parseFloat(line.replace('Confidence:', '').trim())
      } else if (line.trim()) {
        currentStep.content = (currentStep.content || '') + line + '\n'
      }
    }
    
    if (currentStep.content) {
      steps.push(currentStep as ThinkingStep)
    }
    
    return steps
  }
  
  private parseDataObjects() {
    // Parse CREATE_ENTITY blocks
    const entityRegex = /<CREATE_ENTITY type="(\w+)">([\s\S]*?)<\/CREATE_ENTITY>/g
    let match
    
    while ((match = entityRegex.exec(this.buffer)) !== null) {
      const type = match[1]
      const dataStr = match[2].trim()
      
      try {
        const data = JSON.parse(dataStr)
        this.handlers.onDataObject?.({
          type,
          data,
          id: crypto.randomUUID()
        })
      } catch (e) {
        console.error('Failed to parse entity data:', e)
      }
      
      this.buffer = this.buffer.replace(match[0], '')
    }
  }
  
  private parseActions() {
    // Parse ACTION_SUGGESTION blocks
    const actionRegex = /<ACTION type="(\w+)" label="([^"]+)"(?: data='([^']+)')?\/>/g
    let match
    
    while ((match = actionRegex.exec(this.buffer)) !== null) {
      const [_, type, label, dataStr] = match
      
      this.handlers.onAction?.({
        type,
        label,
        data: dataStr ? JSON.parse(dataStr) : {}
      })
      
      this.buffer = this.buffer.replace(match[0], '')
    }
  }
  
  private inSpecialBlock(): boolean {
    return this.buffer.includes('<thinking>') && !this.buffer.includes('</thinking>') ||
           this.buffer.includes('<CREATE_ENTITY') && !this.buffer.includes('</CREATE_ENTITY>')
  }
}
```

### Enhanced System Prompts

```typescript
// server/utils/prompts.ts
export function buildSystemPrompt(mode: ChatMode, context: Context[]): string {
  const basePrompt = getBasePromptForMode(mode)
  const contextPrompt = buildContextPrompt(context)
  const outputInstructions = getOutputInstructions(mode)
  
  return `${basePrompt}

${contextPrompt}

${outputInstructions}

## Output Format Instructions

When creating entities, use:
<CREATE_ENTITY type="feature|page|component|journey">
{
  "name": "Entity Name",
  "description": "Description",
  ... entity-specific fields
}
</CREATE_ENTITY>

When suggesting actions, use:
<ACTION type="action_type" label="Button Label" data='{"key": "value"}'/>

When showing your thinking process, use:
<thinking>
Step 1: Analyzing the user's request...
Type: analysis
Confidence: 0.8

Step 2: Identifying required components...
Type: planning
Confidence: 0.9
</thinking>

For rich interactions in wizard mode:
<RICH_MESSAGE type="selection|comparison|form">
{
  "prompt": "Question for user",
  "options": [...],
  "layout": "grid|list|carousel"
}
</RICH_MESSAGE>
`
}

function getBasePromptForMode(mode: ChatMode): string {
  const prompts = {
    focus: `You are in FOCUS MODE - an exploratory conversation assistant.
Your goal is to understand the user's vision through natural conversation.
- Be curious and ask clarifying questions
- Don't rush to implementation
- Build a complete understanding of their needs
- Remember all details for future reference`,
    
    builder: `You are in BUILDER MODE - a task-oriented assistant.
Your goal is to efficiently create what the user needs.
- Be direct and action-oriented
- Create entities when appropriate
- Suggest next steps
- Focus on getting things done`,
    
    wizard: `You are in WIZARD MODE - guiding through a structured process.
Your goal is to collect specific information while remaining conversational.
- Follow the wizard structure but allow flexibility
- Use rich interactions when appropriate
- Show progress clearly
- Validate inputs helpfully`
  }
  
  return prompts[mode]
}
```

### Client-Side Stream Consumer

```typescript
// composables/useAnthropicStream.ts
export function useAnthropicStream() {
  const messages = useState<Message[]>('chat.messages', () => [])
  const isStreaming = useState('chat.isStreaming', () => false)
  const streamingMessage = useState<Partial<Message>>('chat.streamingMessage', () => ({}))
  const thinkingSteps = useState<ThinkingStep[]>('chat.thinkingSteps', () => [])
  
  async function sendMessage(
    content: string, 
    mode: ChatMode,
    contexts: Context[]
  ) {
    // Add user message
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content,
      context_mode: mode,
      contexts,
      created_at: new Date().toISOString()
    }
    
    messages.value.push(userMessage)
    
    // Start streaming
    isStreaming.value = true
    streamingMessage.value = {
      id: generateId(),
      role: 'assistant',
      content: '',
      context_mode: mode,
      message_type: 'text',
      suggested_actions: [],
      created_entities: []
    }
    thinkingSteps.value = []
    
    try {
      const response = await $fetch('/api/chat/stream', {
        method: 'POST',
        body: {
          messages: getContextualMessages(mode),
          context: contexts,
          mode
        },
        responseType: 'stream'
      })
      
      const reader = response.pipeThrough(new TextDecoderStream()).getReader()
      
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        // Parse SSE events
        const events = value.split('\n\n')
        for (const event of events) {
          if (event.startsWith('data: ')) {
            const data = JSON.parse(event.slice(6))
            handleStreamEvent(data)
          }
        }
      }
    } catch (error) {
      console.error('Stream error:', error)
      handleStreamError(error)
    } finally {
      isStreaming.value = false
      if (streamingMessage.value.content) {
        messages.value.push(streamingMessage.value as Message)
      }
    }
  }
  
  function handleStreamEvent(event: StreamEvent) {
    switch (event.type) {
      case 'delta':
        streamingMessage.value.content += event.content
        break
        
      case 'thinking':
        thinkingSteps.value.push(event.step)
        break
        
      case 'entity':
        streamingMessage.value.created_entities?.push(event.entity)
        break
        
      case 'action':
        streamingMessage.value.suggested_actions?.push(event.action)
        break
        
      case 'rich_message':
        streamingMessage.value.message_type = event.messageType
        streamingMessage.value.message_data = event.data
        break
        
      case 'done':
        streamingMessage.value.stream_completed = true
        break
    }
  }
  
  return {
    messages: readonly(messages),
    isStreaming: readonly(isStreaming),
    streamingMessage: readonly(streamingMessage),
    thinkingSteps: readonly(thinkingSteps),
    sendMessage
  }
}
```

### Rich Message Components

```vue
<!-- components/messages/ThinkingDisplay.vue -->
<template>
  <div v-if="steps.length > 0" class="thinking-display">
    <div class="thinking-header">
      <Icon name="mdi:brain" />
      <span>AI Thinking Process</span>
      <button @click="expanded = !expanded">
        <Icon :name="expanded ? 'mdi:chevron-up' : 'mdi:chevron-down'" />
      </button>
    </div>
    
    <Transition name="slide">
      <div v-show="expanded" class="thinking-steps">
        <div 
          v-for="(step, index) in steps" 
          :key="index"
          class="thinking-step"
          :class="`type-${step.type}`"
        >
          <div class="step-header">
            <span class="step-number">Step {{ step.number }}</span>
            <span class="step-type">{{ step.type }}</span>
            <span 
              v-if="step.confidence" 
              class="step-confidence"
            >
              {{ (step.confidence * 100).toFixed(0) }}% confident
            </span>
          </div>
          <div class="step-content">
            {{ step.content }}
          </div>
          <div 
            v-if="step.isRevision" 
            class="revision-indicator"
          >
            Revising previous thinking
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
interface ThinkingStep {
  number: number
  type: 'analysis' | 'planning' | 'decision' | 'revision'
  content: string
  confidence?: number
  isRevision?: boolean
}

defineProps<{
  steps: ThinkingStep[]
}>()

const expanded = ref(true)
</script>
```

### Entity Creation Handler

```typescript
// server/utils/entity-creator.ts
export async function createEntityFromAI(
  supabase: SupabaseClient,
  entity: DataObject,
  projectId: string,
  messageId: string
) {
  switch (entity.type) {
    case 'feature':
      return await createFeature(supabase, {
        project_id: projectId,
        name: entity.data.name,
        description: entity.data.description,
        category: entity.data.category || 'custom',
        priority: entity.data.priority || 'medium',
        dependencies: entity.data.dependencies || [],
        settings: entity.data.settings || {},
        status: 'planned'
      })
      
    case 'page':
      return await createPage(supabase, {
        project_id: projectId,
        name: entity.data.name,
        slug: generateSlug(entity.data.name),
        path: entity.data.path || `/${generateSlug(entity.data.name)}`,
        type: entity.data.type || 'page',
        parent_id: entity.data.parent_id,
        template: entity.data.template,
        meta: entity.data.meta || {},
        content: entity.data.content || {}
      })
      
    case 'component':
      return await createComponent(supabase, {
        project_id: projectId,
        name: entity.data.name,
        slug: generateSlug(entity.data.name),
        category: entity.data.category,
        description: entity.data.description,
        props: entity.data.props || {},
        slots: entity.data.slots || {},
        events: entity.data.events || {},
        code: entity.data.code
      })
      
    case 'journey':
      return await createJourney(supabase, {
        project_id: projectId,
        name: entity.data.name,
        slug: generateSlug(entity.data.name),
        description: entity.data.description,
        type: entity.data.type || 'user-flow',
        persona: entity.data.persona,
        steps: entity.data.steps || [],
        triggers: entity.data.triggers || [],
        outcomes: entity.data.outcomes || []
      })
  }
}
```

## Complete Flow Example

```typescript
// User sends message
"I need a user authentication system with social login"

// System processes:
1. Determine mode: 'builder' (task-oriented)
2. Gather context: current project, location, no wizard active
3. Stream to Anthropic with appropriate prompt

// AI responds with streaming:
<thinking>
Step 1: User needs authentication system
Type: analysis
Confidence: 0.95

Step 2: Includes social login requirement
Type: planning
Confidence: 0.9
</thinking>

I'll help you set up a complete authentication system with social login. Let me create the necessary components:

<CREATE_ENTITY type="feature">
{
  "name": "User Authentication",
  "description": "Complete auth system with email/password and social providers",
  "category": "auth",
  "priority": "high",
  "settings": {
    "providers": ["email", "google", "github"],
    "features": ["registration", "login", "password-reset", "email-verification"]
  }
}
</CREATE_ENTITY>

<CREATE_ENTITY type="page">
{
  "name": "Login",
  "path": "/auth/login",
  "type": "page",
  "template": "auth",
  "meta": {
    "requiresAuth": false,
    "redirectAuthenticated": "/dashboard"
  }
}
</CREATE_ENTITY>

<ACTION type="start_wizard" label="Configure Auth Providers" data='{"wizard": "auth-setup"}'/>
<ACTION type="create_entity" label="Add Registration Page" data='{"entity": "page", "template": "register"}'/>

Would you like me to walk you through setting up the authentication providers? I can also create the registration and password reset pages.

// Client displays:
- Thinking process (collapsible)
- Main message
- Created entities (as cards)
- Action buttons
```

This provides a complete implementation guide for the Anthropic streaming integration with rich message handling and entity creation.