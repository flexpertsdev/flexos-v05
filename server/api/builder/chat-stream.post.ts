// Streaming Chat API Endpoint
// Implements Server-Sent Events (SSE) for real-time AI responses

import { defineEventHandler, readBody, createError, setHeader, sendStream } from 'h3'
import { Anthropic } from '@anthropic-ai/sdk'
import { serverSupabaseServiceRole, serverSupabaseClient } from '#supabase/server'
import type { Database } from '~/types/database'
import { AnthropicStreamParser } from '~/server/utils/anthropic-stream'
import type { 
  ChatStreamRequest, 
  StreamEvent,
  ThinkingStep,
  ChatMessage,
  ChatMode,
  Context,
  ActionConfig
} from '~/types/chat'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  // Parse request body
  const body = await readBody<ChatStreamRequest>(event)
  const { messages, context, mode, projectId, temperature = 0.7, maxTokens = 4000 } = body
  
  // Get authenticated user from Authorization header
  const authHeader = event.node.req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Missing or invalid authorization header'
    })
  }
  
  const token = authHeader.split(' ')[1]
  
  // Initialize Supabase client for server-side operations
  const supabase = await serverSupabaseServiceRole<Database>(event)
  
  // Verify the user's token
  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  if (authError || !user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid or expired token'
    })
  }
  
  // Verify project access
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .eq('user_id', user.id)
    .single()
    
  if (projectError || !project) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Project not found or access denied'
    })
  }
  
  // Initialize Anthropic client
  const anthropic = new Anthropic({
    apiKey: config.anthropicApiKey
  })
  
  // Set up SSE headers
  event.node.res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  })
  
  // Create chat record in database
  const { data: chatData } = await supabase
    .from('ai_chats')
    .select('*')
    .eq('project_id', projectId)
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single()
    
  let chatId = chatData?.id
  
  if (!chatId) {
    const { data: newChat } = await supabase
      .from('ai_chats')
      .insert({
        project_id: projectId,
        user_id: user.id,
        title: 'New Chat',
        status: 'active',
        model: config.anthropicModel || 'claude-3-opus-20240229',
        total_messages: 0
      })
      .select()
      .single()
      
    chatId = newChat?.id
  }
  
  // Create message record for streaming
  const { data: messageRecord } = await supabase
    .from('chat_messages')
    .insert({
      chat_id: chatId,
      project_id: projectId,
      user_id: user.id,
      role: 'assistant',
      context_mode: mode,
      is_streaming: true,
      stream_id: generateStreamId(),
      contexts: [],
      created_entities: [],
      suggested_actions: []
    })
    .select()
    .single()
    
  const messageId = messageRecord?.id
  
  // Helper to send SSE events
  const sendEvent = (streamEvent: StreamEvent) => {
    const data = JSON.stringify({ ...streamEvent, timestamp: new Date().toISOString() })
    event.node.res.write(`data: ${data}\n\n`)
  }
  
  // Send initial event
  sendEvent({
    type: 'start',
    messageId: messageId || '',
    timestamp: ''
  } as StreamEvent)
  
  try {
    // Build system prompt based on mode
    const systemPrompt = buildSystemPrompt(mode, context, project)
    
    // Format messages for Anthropic
    const formattedMessages = formatMessagesForAnthropic(messages, context)
    
    // Create streaming request
    const stream = await anthropic.messages.create({
      model: config.anthropicModel || 'claude-3-opus-20240229',
      max_tokens: maxTokens,
      temperature: mode === 'focus' ? 0.8 : temperature,
      system: systemPrompt,
      messages: formattedMessages,
      stream: true,
    })
    
    // Track streaming data
    let fullContent = ''
    const thinkingSteps: ThinkingStep[] = []
    const suggestedActions: any[] = []
    const createdEntities: any[] = []
    
    // Set up stream parser
    const parser = new AnthropicStreamParser({
      onThinking: async (step) => {
        thinkingSteps.push(step)
        sendEvent({
          type: 'thinking',
          step,
          timestamp: ''
        } as StreamEvent)
      },
      onDataObject: async (obj) => {
        createdEntities.push(obj)
        sendEvent({
          type: 'entity',
          entity: obj,
          timestamp: ''
        } as StreamEvent)
      },
      onAction: async (action) => {
        suggestedActions.push(action)
        sendEvent({
          type: 'action',
          action,
          timestamp: ''
        } as StreamEvent)
      },
      onRichMessage: async (message) => {
        sendEvent({
          type: 'rich_message',
          messageType: message.type as any,
          data: message.content,
          timestamp: ''
        } as StreamEvent)
      },
      onText: async (text) => {
        fullContent += text
        sendEvent({
          type: 'delta',
          content: text,
          timestamp: ''
        } as StreamEvent)
      },
      onError: async (error) => {
        console.error('Stream parsing error:', error)
        sendEvent({
          type: 'error',
          error: {
            code: 'PARSE_ERROR',
            message: error.message
          },
          timestamp: ''
        } as StreamEvent)
      }
    })
    
    // Process stream chunks
    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
        await parser.processChunk(chunk.delta.text)
      }
    }
    
    // Flush any remaining content
    await parser.flush()
    
    // Update message in database
    await supabase
      .from('chat_messages')
      .update({
        content: fullContent,
        is_streaming: false,
        stream_completed: true,
        suggested_actions: suggestedActions,
        created_entities: createdEntities,
        message_data: {
          thinking_steps: thinkingSteps
        }
      })
      .eq('id', messageId)
    
    // Create entity records if any
    for (const entity of createdEntities) {
      await createEntityFromAI(supabase, entity, projectId, messageId)
    }
    
    // Create action records
    for (let i = 0; i < suggestedActions.length; i++) {
      const action = suggestedActions[i]
      await supabase
        .from('message_actions')
        .insert({
          message_id: messageId,
          action_type: 'suggestion',
          action_key: `${action.type}_${i}`,
          label: action.label,
          action_data: action.data,
          display_order: i
        })
    }
    
    // Send completion event
    sendEvent({
      type: 'done',
      messageId,
      actions: suggestedActions.map(a => ({
        type: a.type,
        data: a.data
      })) as ActionConfig[],
      entities: createdEntities,
      timestamp: ''
    } as StreamEvent)
    
  } catch (error: any) {
    console.error('Streaming error:', error)
    
    // Update message as failed
    await supabase
      .from('chat_messages')
      .update({
        is_streaming: false,
        stream_completed: false,
        content: 'An error occurred while generating the response.'
      })
      .eq('id', messageId)
    
    // Send error event
    sendEvent({
      type: 'error',
      error: {
        code: error.code || 'STREAM_ERROR',
        message: error.message || 'An unexpected error occurred',
        details: error.details
      },
      timestamp: ''
    } as StreamEvent)
  }
  
  // End the stream
  event.node.res.write('event: close\ndata: \n\n')
  event.node.res.end()
})

// Helper functions

function generateStreamId(): string {
  return `stream_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

function buildSystemPrompt(mode: ChatMode, contexts: Context[], project: any): string {
  const basePrompts = {
    focus: `You are in FOCUS MODE - an exploratory conversation assistant for the FlexOS project builder.
Your goal is to understand the user's vision through natural conversation.
- Be curious and ask clarifying questions
- Don't rush to implementation
- Build a complete understanding of their needs
- Remember all details for future reference
- Encourage creative thinking and exploration`,
    
    builder: `You are in BUILDER MODE - a task-oriented assistant for the FlexOS project builder.
Your goal is to efficiently create what the user needs.
- Be direct and action-oriented
- Create entities when appropriate using CREATE_ENTITY blocks
- Suggest next steps using ACTION blocks
- Focus on getting things done
- Each message should advance the project`,
    
    wizard: `You are in WIZARD MODE - guiding through a structured process in FlexOS.
Your goal is to collect specific information while remaining conversational.
- Follow the wizard structure but allow flexibility
- Use rich interactions when appropriate with RICH_MESSAGE blocks
- Show progress clearly
- Validate inputs helpfully
- Guide users through complex workflows`
  }
  
  let prompt = basePrompts[mode]
  
  // Add project context
  if (project) {
    prompt += `\n\nProject Context:
- Name: ${project.name}
- Type: ${project.type}
- Description: ${project.description || 'No description'}
- Status: ${project.status}`
  }
  
  // Add context information
  if (contexts.length > 0) {
    prompt += '\n\nCurrent Context:'
    contexts.forEach(ctx => {
      if (ctx.type === 'location') {
        prompt += `\n- User is viewing: ${ctx.data.currentView}`
      } else if (ctx.type === 'selection') {
        prompt += `\n- User selected: ${ctx.data.selectedElement.type} - ${ctx.data.selectedElement.content}`
      } else if (ctx.type === 'attachment') {
        prompt += `\n- User attached: ${ctx.data.originalName} (${ctx.data.fileType})`
      }
    })
  }
  
  // Add output format instructions
  prompt += `

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
</RICH_MESSAGE>`
  
  return prompt
}

function formatMessagesForAnthropic(messages: ChatMessage[], contexts: Context[]): any[] {
  // Convert our message format to Anthropic's expected format
  return messages.map(msg => ({
    role: msg.role === 'assistant' ? 'assistant' : 'user',
    content: msg.content || ''
  }))
}

async function createEntityFromAI(
  supabase: any,
  entity: any,
  projectId: string,
  messageId: string
): Promise<void> {
  try {
    let createdEntity
    
    switch (entity.type) {
      case 'feature':
        const { data: feature } = await supabase
          .from('features')
          .insert({
            project_id: projectId,
            name: entity.data.name,
            slug: generateSlug(entity.data.name),
            description: entity.data.description,
            category: entity.data.category || 'custom',
            type: entity.data.type || 'custom',
            status: entity.data.status || 'planned',
            priority: entity.data.priority || 'medium',
            settings: entity.data.settings || {},
            dependencies: entity.data.dependencies || []
          })
          .select()
          .single()
        createdEntity = feature
        break
        
      case 'page':
        const { data: page } = await supabase
          .from('pages')
          .insert({
            project_id: projectId,
            name: entity.data.name,
            slug: generateSlug(entity.data.name),
            path: entity.data.path || `/${generateSlug(entity.data.name)}`,
            type: entity.data.type || 'page',
            parent_id: entity.data.parent_id,
            template: entity.data.template,
            settings: entity.data.settings || {},
            meta: entity.data.meta || {},
            content: entity.data.content || {}
          })
          .select()
          .single()
        createdEntity = page
        break
        
      case 'component':
        const { data: component } = await supabase
          .from('components')
          .insert({
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
          .select()
          .single()
        createdEntity = component
        break
    }
    
    // Record the output
    if (createdEntity) {
      await supabase
        .from('message_outputs')
        .insert({
          message_id: messageId,
          output_type: entity.type,
          entity_id: createdEntity.id,
          entity_table: `${entity.type}s`, // features, pages, components
          entity_data: createdEntity
        })
    }
  } catch (error) {
    console.error('Failed to create entity:', error)
  }
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}