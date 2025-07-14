// Chat System Type Definitions
// Implements the FlexOS Discovery Chat architecture

import type { Database } from './database'

// Re-export database types for convenience
export type ChatMessage = Database['public']['Tables']['chat_messages']['Row']
export type ChatMessageInsert = Database['public']['Tables']['chat_messages']['Insert']
export type MessageAction = Database['public']['Tables']['message_actions']['Row']
export type MessageOutput = Database['public']['Tables']['message_outputs']['Row']
export type Attachment = Database['public']['Tables']['attachments']['Row']
export type WizardSession = Database['public']['Tables']['wizard_sessions']['Row']

// Chat modes determine behavior
export type ChatMode = 'focus' | 'builder' | 'wizard'

// Message types for rich content
export type MessageType = 
  | 'text' 
  | 'thinking' 
  | 'selection' 
  | 'comparison' 
  | 'form' 
  | 'visual' 
  | 'code' 
  | 'design'

// Context types for message attachments
export interface Context {
  type: 'selection' | 'location' | 'attachment' | 'wizard' | 'reference'
  data: Record<string, any>
  metadata?: {
    source: string
    timestamp: string
    confidence?: number
  }
}

// Selection context when user clicks on UI elements
export interface SelectionContext extends Context {
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

// Location context for current view
export interface LocationContext extends Context {
  type: 'location'
  data: {
    currentView: 'dashboard' | 'builder' | 'preview' | 'settings'
    activeProject: string
    activePage?: string
    activeComponent?: string
    breadcrumb: string[]
    viewState: Record<string, any>
  }
}

// Attachment context for uploaded files
export interface AttachmentContext extends Context {
  type: 'attachment'
  data: {
    attachmentId: string
    fileType: 'image' | 'pdf' | 'code' | 'design'
    originalName: string
    parsedContent?: {
      summary: string
      extractedData: Record<string, any>
      relevantInsights: string[]
    }
    storageUrl: string
  }
}

// Thinking step for AI reasoning display
export interface ThinkingStep {
  number: number
  type: 'analysis' | 'planning' | 'decision' | 'revision'
  content: string
  confidence?: number
  isRevision?: boolean
}

// Action configuration for interactive buttons
export interface ActionConfig {
  type: 'create_entity' | 'start_wizard' | 'switch_mode' | 'provide_input' | 'navigate'
  data: Record<string, any>
}

// Streaming event types
export type StreamEventType = 
  | 'start'
  | 'delta'
  | 'thinking'
  | 'entity'
  | 'action'
  | 'rich_message'
  | 'error'
  | 'done'

// Base streaming event
export interface StreamEvent {
  type: StreamEventType
  timestamp: string
}

// Specific streaming events
export interface StreamStartEvent extends StreamEvent {
  type: 'start'
  messageId: string
}

export interface StreamDeltaEvent extends StreamEvent {
  type: 'delta'
  content: string
}

export interface StreamThinkingEvent extends StreamEvent {
  type: 'thinking'
  step: ThinkingStep
}

export interface StreamEntityEvent extends StreamEvent {
  type: 'entity'
  entity: {
    type: string
    data: Record<string, any>
    id: string
  }
}

export interface StreamActionEvent extends StreamEvent {
  type: 'action'
  action: {
    type: string
    label: string
    data: Record<string, any>
  }
}

export interface StreamRichMessageEvent extends StreamEvent {
  type: 'rich_message'
  messageType: MessageType
  data: Record<string, any>
}

export interface StreamErrorEvent extends StreamEvent {
  type: 'error'
  error: {
    code: string
    message: string
    details?: Record<string, any>
  }
}

export interface StreamDoneEvent extends StreamEvent {
  type: 'done'
  messageId: string
  actions: ActionConfig[]
  entities: Array<{
    type: string
    id: string
    data: Record<string, any>
  }>
}

// API request/response types
export interface ChatStreamRequest {
  messages: ChatMessage[]
  context: Context[]
  mode: ChatMode
  projectId: string
  temperature?: number
  maxTokens?: number
}

export interface ChatStreamResponse {
  messageId: string
  stream: ReadableStream<Uint8Array>
}

// Rich message data structures
export interface SelectionMessageData {
  options: Array<{
    id: string
    label: string
    description?: string
    preview?: string
    metadata?: Record<string, any>
  }>
  allowMultiple: boolean
  layout: 'grid' | 'list' | 'carousel'
}

export interface ComparisonMessageData {
  items: Array<{
    id: string
    title: string
    attributes: Record<string, any>
    preview?: string
  }>
  compareKeys: string[]
  layout: 'side-by-side' | 'table'
}

export interface FormMessageData {
  fields: Array<{
    name: string
    label: string
    type: 'text' | 'number' | 'select' | 'checkbox' | 'textarea'
    required?: boolean
    options?: Array<{ value: string; label: string }>
    validation?: Record<string, any>
  }>
  submitLabel?: string
}

// Chat state management
export interface ChatState {
  messages: ChatMessage[]
  isStreaming: boolean
  streamingMessage: Partial<ChatMessage> | null
  thinkingSteps: ThinkingStep[]
  error: Error | null
  connectionState: 'idle' | 'connecting' | 'connected' | 'error'
}

// Composable options
export interface UseChatOptions {
  mode?: ChatMode
  onMessage?: (message: ChatMessage) => void
  onError?: (error: Error) => void
  onThinking?: (step: ThinkingStep) => void
  onEntity?: (entity: any) => void
  onAction?: (action: ActionConfig) => void
}

// System prompts configuration
export interface SystemPromptConfig {
  mode: ChatMode
  projectContext?: {
    name: string
    type: string
    description?: string
    currentState?: Record<string, any>
  }
  wizardContext?: {
    type: string
    progress: number
    collectedData: Record<string, any>
  }
  userPreferences?: {
    conversationStyle?: 'concise' | 'detailed' | 'balanced'
    showThinking?: boolean
    autoCreateEntities?: boolean
  }
}