// Composable for Anthropic streaming chat
import type { Context, ChatMode, ActionConfig } from '~/types/chat'

// Define specific event types
type StreamEvent = 
  | { type: 'start'; messageId: string; timestamp: string }
  | { type: 'delta'; content: string; timestamp: string }
  | { type: 'thinking'; step: any; timestamp: string }
  | { type: 'entity'; entity: any; timestamp: string }
  | { type: 'action'; action: any; timestamp: string }
  | { type: 'error'; error: any; timestamp: string }
  | { type: 'done'; messageId?: string; timestamp: string }

// Local ChatMessage type
interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string | null
  context_mode: 'focus' | 'builder' | 'wizard' | null
  contexts?: any[]
  message_data?: {
    thinking_steps?: any[]
  }
  created_entities?: any[]
  suggested_actions?: any[]
  created_at: string
}

interface StreamOptions {
  messages: ChatMessage[]
  mode: ChatMode
  contexts: Context[]
  projectId: string
  onDelta?: (content: string) => void
  onThinking?: (step: any) => void
  onEntity?: (entity: any) => void
  onAction?: (action: any) => void
  onComplete?: (message: any) => void
  onError?: (error: any) => void
}

export const useAnthropicStream = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  
  const streamMessage = async (options: StreamOptions) => {
    const {
      messages,
      mode,
      contexts,
      projectId,
      onDelta,
      onThinking,
      onEntity,
      onAction,
      onComplete,
      onError
    } = options
    
    if (!user.value) {
      onError?.({ message: 'User not authenticated' })
      return
    }
    
    try {
      // Get session token
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('No active session')
      }
      
      // Make streaming request
      const response = await fetch('/api/builder/chat-stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          messages,
          context: contexts,
          mode,
          projectId,
          temperature: 0.7,
          maxTokens: 4000
        })
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      // Read the stream
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      
      let fullContent = ''
      let messageId = ''
      const createdEntities: any[] = []
      const suggestedActions: any[] = []
      const thinkingSteps: any[] = []
      
      while (reader) {
        const { done, value } = await reader.read()
        if (done) break
        
        // Decode chunk
        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              const event = data
              
              switch (event.type) {
                case 'start':
                  if ('messageId' in event) {
                    messageId = event.messageId || ''
                  }
                  break
                  
                case 'delta':
                  if ('content' in event) {
                    fullContent += event.content || ''
                    onDelta?.(event.content || '')
                  }
                  break
                  
                case 'thinking':
                  if ('step' in event && event.step) {
                    thinkingSteps.push(event.step)
                    onThinking?.(event.step)
                  }
                  break
                  
                case 'entity':
                  if ('entity' in event && event.entity) {
                    createdEntities.push(event.entity)
                    onEntity?.(event.entity)
                  }
                  break
                  
                case 'action':
                  if ('action' in event && event.action) {
                    suggestedActions.push(event.action)
                    onAction?.(event.action)
                  }
                  break
                  
                case 'done':
                  onComplete?.({
                    id: messageId,
                    content: fullContent,
                    created_entities: createdEntities,
                    suggested_actions: suggestedActions,
                    thinking_steps: thinkingSteps
                  })
                  break
                  
                case 'error':
                  if ('error' in event) {
                    onError?.(event.error)
                  }
                  break
              }
            } catch (e) {
              // Ignore parsing errors for incomplete chunks
            }
          }
        }
      }
    } catch (error) {
      onError?.(error)
    }
  }
  
  return {
    streamMessage
  }
}
