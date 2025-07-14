// Extended chat types for the actual database structure
// This file provides the real chat message structure with all fields

import type { Database } from './database'

// Extended ChatMessage type that includes all database fields
export interface ChatMessageRow {
  id: string
  chat_id: string
  project_id: string
  user_id: string
  role: 'user' | 'assistant' | 'system'
  content: string | null
  context_mode: 'focus' | 'builder' | 'wizard' | null
  message_type: string | null
  is_streaming: boolean
  stream_id: string | null
  stream_completed: boolean
  contexts: any[]
  message_data: {
    thinking_steps?: any[]
    [key: string]: any
  }
  created_entities: any[]
  suggested_actions: any[]
  created_at: string
  updated_at: string
}

// Simplified message for component use
export interface SimplifiedChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  context_mode: 'focus' | 'builder' | 'wizard'
  contexts?: any[]
  thinking_steps?: any[]
  created_entities?: any[]
  suggested_actions?: any[]
  created_at: string
}

// Helper to convert database row to simplified message
export function simplifyMessage(row: Partial<ChatMessageRow>): SimplifiedChatMessage {
  return {
    id: row.id || generateId(),
    role: row.role === 'system' ? 'assistant' : row.role || 'user',
    content: row.content || '',
    context_mode: row.context_mode || 'focus',
    contexts: row.contexts || [],
    thinking_steps: row.message_data?.thinking_steps || [],
    created_entities: row.created_entities || [],
    suggested_actions: row.suggested_actions || [],
    created_at: row.created_at || new Date().toISOString()
  }
}

// Helper to create a database row from simplified message
export function toDatabaseRow(
  message: SimplifiedChatMessage,
  chatId: string,
  projectId: string,
  userId: string
): Partial<ChatMessageRow> {
  return {
    id: message.id,
    chat_id: chatId,
    project_id: projectId,
    user_id: userId,
    role: message.role,
    content: message.content,
    context_mode: message.context_mode,
    contexts: message.contexts || [],
    message_data: {
      thinking_steps: message.thinking_steps || []
    },
    created_entities: message.created_entities || [],
    suggested_actions: message.suggested_actions || [],
    created_at: message.created_at
  }
}

function generateId() {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}
