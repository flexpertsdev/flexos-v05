// Chat Composable with Streaming Support
// Manages chat state and handles real-time streaming from the API

import type { 
  ChatMessage, 
  ChatMode, 
  Context, 
  ThinkingStep,
  ActionConfig,
  StreamEvent,
  StreamStartEvent,
  StreamDeltaEvent,
  StreamThinkingEvent,
  StreamEntityEvent,
  StreamActionEvent,
  StreamRichMessageEvent,
  StreamErrorEvent,
  StreamDoneEvent,
  UseChatOptions,
  ChatState
} from '~/types/chat'

export const useChat = (options: UseChatOptions = {}) => {
  const { 
    mode = 'builder',
    onMessage,
    onError,
    onThinking,
    onEntity,
    onAction
  } = options
  
  // Get current project from route
  const route = useRoute()
  const projectId = computed(() => route.params.slug as string)
  
  // Chat state
  const state = reactive<ChatState>({
    messages: [],
    isStreaming: false,
    streamingMessage: null,
    thinkingSteps: [],
    error: null,
    connectionState: 'idle'
  })
  
  // Active abort controller for streaming
  let abortController: AbortController | null = null
  let reconnectTimeout: NodeJS.Timeout | null = null
  let reconnectAttempts = 0
  const maxReconnectAttempts = 3
  const reconnectDelay = 1000
  
  // Load existing messages
  const loadMessages = async () => {
    if (!projectId.value) return
    
    try {
      const supabase = useSupabase()
      const { data: chatData } = await supabase
        .from('ai_chats')
        .select(`
          *,
          chat_messages (
            *,
            message_actions (*),
            message_outputs (*)
          )
        `)
        .eq('project_id', projectId.value)
        .eq('status', 'active')
        .single()
        
      if (chatData?.chat_messages) {
        state.messages = chatData.chat_messages.sort((a: any, b: any) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        )
      }
    } catch (error) {
      console.error('Failed to load messages:', error)
      state.error = error as Error
      onError?.(error as Error)
    }
  }
  
  // Send a message with streaming response
  const sendMessage = async (content: string, contexts: Context[] = []) => {
    if (!content.trim() || state.isStreaming) return
    
    try {
      // Add user message immediately
      const userMessage: Partial<ChatMessage> = {
        id: generateTempId(),
        role: 'user',
        content,
        context_mode: mode,
        contexts: contexts as any,
        created_at: new Date().toISOString()
      }
      
      state.messages.push(userMessage as ChatMessage)
      onMessage?.(userMessage as ChatMessage)
      
      // Start streaming
      state.isStreaming = true
      state.streamingMessage = {
        id: generateTempId(),
        role: 'assistant',
        content: '',
        context_mode: mode,
        message_type: 'text',
        suggested_actions: [],
        created_entities: [],
        created_at: new Date().toISOString()
      }
      state.thinkingSteps = []
      state.error = null
      state.connectionState = 'connecting'
      
      // Gather context
      const fullContext = [...contexts, ...gatherAutomaticContext()]
      
      // Create abort controller for this request
      abortController = new AbortController()
      
      // Get auth token from Supabase
      const supabase = useSupabase()
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        throw new Error('Not authenticated. Please sign in to use the chat.')
      }
      
      // Create streaming request using fetch with readable stream
      const response = await fetch('/api/builder/chat-stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          messages: getRecentMessages(),
          context: fullContext,
          mode,
          projectId: projectId.value
        }),
        signal: abortController.signal
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please sign in again.')
        }
        const errorText = await response.text()
        throw new Error(`Chat API error: ${response.status} - ${errorText}`)
      }
      
      // Read the stream
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      
      if (!reader) {
        throw new Error('No response body')
      }
      
      state.connectionState = 'connected'
      
      // Process the stream
      let buffer = ''
      
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        buffer += decoder.decode(value, { stream: true })
        
        // Process complete SSE events
        const lines = buffer.split('\n')
        buffer = lines.pop() || '' // Keep incomplete line in buffer
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data: StreamEvent = JSON.parse(line.slice(6))
              handleStreamEvent(data)
            } catch (error) {
              console.error('Failed to parse stream event:', error)
            }
          } else if (line === 'event: close') {
            closeStream()
            return
          }
        }
      }
      
      // Process any remaining data
      if (buffer && buffer.startsWith('data: ')) {
        try {
          const data: StreamEvent = JSON.parse(buffer.slice(6))
          handleStreamEvent(data)
        } catch (error) {
          console.error('Failed to parse final stream event:', error)
        }
      }
      
    } catch (error) {
      state.error = error as Error
      state.isStreaming = false
      state.connectionState = 'error'
      onError?.(error as Error)
    }
  }
  
  // Handle incoming stream events
  const handleStreamEvent = (event: StreamEvent) => {
    switch (event.type) {
      case 'start': {
        const startEvent = event as StreamStartEvent
        if (state.streamingMessage) {
          state.streamingMessage.id = startEvent.messageId
        }
        break
      }
        
      case 'delta': {
        const deltaEvent = event as StreamDeltaEvent
        if (state.streamingMessage) {
          state.streamingMessage.content = (state.streamingMessage.content || '') + deltaEvent.content
        }
        break
      }
        
      case 'thinking': {
        const thinkingEvent = event as StreamThinkingEvent
        state.thinkingSteps.push(thinkingEvent.step)
        onThinking?.(thinkingEvent.step)
        break
      }
        
      case 'entity': {
        const entityEvent = event as StreamEntityEvent
        if (state.streamingMessage) {
          state.streamingMessage.created_entities?.push(entityEvent.entity)
        }
        onEntity?.(entityEvent.entity)
        break
      }
        
      case 'action': {
        const actionEvent = event as StreamActionEvent
        if (state.streamingMessage) {
          state.streamingMessage.suggested_actions?.push(actionEvent.action)
        }
        onAction?.(actionEvent.action as ActionConfig)
        break
      }
        
      case 'rich_message': {
        const richMessageEvent = event as StreamRichMessageEvent
        if (state.streamingMessage) {
          state.streamingMessage.message_type = richMessageEvent.messageType
          state.streamingMessage.message_data = richMessageEvent.data
        }
        break
      }
        
      case 'error': {
        const errorEvent = event as StreamErrorEvent
        state.error = new Error(errorEvent.error.message)
        onError?.(state.error)
        break
      }
        
      case 'done': {
        finalizeStreamingMessage(event as StreamDoneEvent)
        break
      }
    }
  }
  
  // Finalize the streaming message
  const finalizeStreamingMessage = (event: StreamDoneEvent) => {
    if (state.streamingMessage) {
      const finalMessage = {
        ...state.streamingMessage,
        id: event.messageId,
        stream_completed: true,
        message_data: {
          ...state.streamingMessage.message_data,
          thinking_steps: state.thinkingSteps
        }
      } as ChatMessage
      
      state.messages.push(finalMessage)
      onMessage?.(finalMessage)
      
      state.streamingMessage = null
      state.isStreaming = false
      state.connectionState = 'idle'
    }
    
    closeStream()
  }
  
  // Handle stream errors with reconnection
  const handleStreamError = (error: Error) => {
    console.error('Stream error:', error)
    
    if (reconnectAttempts < maxReconnectAttempts) {
      reconnectAttempts++
      state.connectionState = 'connecting'
      
      reconnectTimeout = setTimeout(() => {
        if (state.streamingMessage?.content) {
          // Continue with existing message
          retryStream()
        }
      }, reconnectDelay * reconnectAttempts)
    } else {
      state.error = error
      state.isStreaming = false
      state.connectionState = 'error'
      onError?.(error)
      closeStream()
    }
  }
  
  // Retry streaming connection
  const retryStream = async () => {
    // Implementation depends on your retry strategy
    // For now, we'll just close and report error
    closeStream()
  }
  
  // Close the stream connection
  const closeStream = () => {
    if (abortController) {
      abortController.abort()
      abortController = null
    }
    
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout)
      reconnectTimeout = null
    }
    
    reconnectAttempts = 0
  }
  
  // Get recent messages for context
  const getRecentMessages = (): ChatMessage[] => {
    // In focus mode, include more history
    const messageCount = mode === 'focus' ? 10 : 3
    return state.messages.slice(-messageCount)
  }
  
  // Gather automatic context
  const gatherAutomaticContext = (): Context[] => {
    const contexts: Context[] = []
    
    // Add location context
    contexts.push({
      type: 'location',
      data: {
        currentView: 'builder',
        activeProject: projectId.value,
        breadcrumb: ['Projects', projectId.value],
        viewState: {}
      }
    })
    
    return contexts
  }
  
  // Execute an action suggestion
  const executeAction = async (action: ActionConfig) => {
    switch (action.type) {
      case 'create_entity':
        // Handle entity creation
        break
        
      case 'start_wizard':
        // Start a wizard session
        await navigateTo(`/wizard/${action.data.wizard}`)
        break
        
      case 'switch_mode':
        // Switch chat mode
        // This would need to be handled by parent component
        break
        
      case 'navigate':
        // Navigate to a specific page
        await navigateTo(action.data.target)
        break
    }
  }
  
  // Clear chat history
  const clearChat = async () => {
    state.messages = []
    state.thinkingSteps = []
    state.error = null
    
    // Could also clear from database if needed
  }
  
  // Clean up on unmount
  onUnmounted(() => {
    closeStream()
  })
  
  // Load messages on mount
  onMounted(() => {
    loadMessages()
  })
  
  // Reload when project changes
  watch(projectId, () => {
    loadMessages()
  })
  
  return {
    // State
    messages: computed(() => state.messages),
    isStreaming: computed(() => state.isStreaming),
    streamingMessage: computed(() => state.streamingMessage),
    thinkingSteps: computed(() => state.thinkingSteps),
    error: computed(() => state.error),
    connectionState: computed(() => state.connectionState),
    
    // Methods
    sendMessage,
    executeAction,
    clearChat,
    loadMessages
  }
}

// Helper to generate temporary IDs
function generateTempId(): string {
  return `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}