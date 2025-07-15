<template>
  <div class="chat-panel" :class="{ 'is-mobile': isMobile }">
    <!-- Header -->
    <div class="panel-header">
      <h3 class="panel-title">AI Assistant</h3>
      <div class="header-actions">
        <!-- Mode Switcher -->
        <div class="mode-switcher">
          <button 
            v-for="mode in chatModes" 
            :key="mode.value"
            @click="switchMode(mode.value)"
            class="mode-btn"
            :class="{ active: currentMode === mode.value }"
            :title="mode.description"
          >
            {{ mode.label }}
          </button>
        </div>
        <button @click="toggleThinking" class="icon-btn" :class="{ active: showThinking }" title="Show AI thinking">
          <svg class="icon" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
        </button>
        <button @click="clearChat" class="clear-btn">Clear</button>
      </div>
    </div>
    
    <!-- Messages -->
    <div class="chat-messages" ref="chatMessagesRef">
      <!-- Welcome message -->
      <div v-if="messages.length === 0 && !isStreaming" class="message ai">
        <div class="message-avatar ai">AI</div>
        <div class="message-content">
          <template v-if="currentMode === 'focus'">
            Welcome to Focus mode! Let's explore your ideas for {{ project?.name || 'your project' }}. What's your vision? I'm here to help you think through the possibilities.
          </template>
          <template v-else-if="currentMode === 'builder'">
            Hi! I'm here to help you build {{ project?.name || 'your project' }}. What would you like to create or work on today?
          </template>
          <template v-else-if="currentMode === 'wizard'">
            Welcome to Wizard mode! I'll guide you through structured processes step by step. What would you like to set up?
          </template>
        </div>
      </div>
      
      <!-- Chat messages -->
      <div v-for="message in messages" :key="message.id" class="message" :class="message.role">
        <div class="message-avatar" :class="message.role">
          {{ message.role === 'assistant' ? 'AI' : 'U' }}
        </div>
        <div class="message-wrapper">
          <!-- Thinking steps (if enabled) -->
          <ThinkingDisplay 
            v-if="showThinking && message.message_data?.thinking_steps?.length" 
            :steps="message.message_data.thinking_steps"
            class="message-thinking"
          />
          
          <!-- Message content -->
          <div class="message-content">
            <!-- Rich message types -->
            <component 
              v-if="message.message_type !== 'text' && message.message_data"
              :is="getRichMessageComponent(message.message_type)"
              :data="message.message_data"
              @action="handleRichAction"
            />
            <!-- Regular text content -->
            <div v-else v-html="formatMessageContent(message.content)"></div>
          </div>
          
          <!-- Suggested actions -->
          <div v-if="message.suggested_actions?.length" class="message-actions">
            <button 
              v-for="(action, index) in message.suggested_actions" 
              :key="index"
              @click="executeAction(action)"
              class="action-btn"
            >
              {{ action.label }}
            </button>
          </div>
          
          <!-- Created entities -->
          <div v-if="message.created_entities?.length" class="message-entities">
            <div class="entities-label">Created:</div>
            <div v-for="entity in message.created_entities" :key="entity.id" class="entity-card">
              <span class="entity-type">{{ entity.type }}</span>
              <span class="entity-name">{{ entity.data.name }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Streaming message -->
      <div v-if="streamingMessage" class="message assistant streaming">
        <div class="message-avatar assistant">AI</div>
        <div class="message-wrapper">
          <!-- Thinking display during streaming -->
          <ThinkingDisplay 
            v-if="showThinking && thinkingSteps.length" 
            :steps="thinkingSteps"
            :is-streaming="true"
            class="message-thinking"
          />
          
          <!-- Streaming content -->
          <div class="message-content">
            <div v-if="streamingMessage?.content" v-html="formatMessageContent(streamingMessage.content)"></div>
            <div v-else class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Error state -->
      <div v-if="error" class="error-message">
        <svg class="icon" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
        <span>{{ error.message }}</span>
        <button @click="retryLastMessage" class="retry-btn">Retry</button>
      </div>
    </div>
    
    <!-- Context bar -->
    <div v-if="attachedContexts.length" class="context-bar">
      <div v-for="(ctx, index) in attachedContexts" :key="index" class="context-item">
        <span class="context-icon">{{ getContextIcon(ctx.type) }}</span>
        <span class="context-label">{{ getContextLabel(ctx) }}</span>
        <button @click="removeContext(index)" class="remove-btn">×</button>
      </div>
    </div>
    
    <!-- Input area -->
    <div class="chat-input-area">
      <div class="input-container" :class="{ disabled: isStreaming }">
        <button @click="showAttachments = true" class="attach-btn" :disabled="isStreaming">
          <svg class="icon" viewBox="0 0 24 24"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
        </button>
        <textarea 
          v-model="chatInput" 
          placeholder="Ask about your project..." 
          @keydown.enter.exact.prevent="handleSendMessage"
          @input="handleChatInput" 
          class="chat-input" 
          rows="1"
          :disabled="isStreaming"
        ></textarea>
        <button 
          @click="handleSendMessage" 
          class="send-btn" 
          :class="{ show: chatInput.trim() && !isStreaming }"
          :disabled="!chatInput.trim() || isStreaming"
        >
          <svg v-if="!isStreaming" class="icon" viewBox="0 0 24 24"><path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z"/></svg>
          <svg v-else class="icon spinning" viewBox="0 0 24 24"><path d="M12 2v4m0 12v4m10-10h-4M6 12H2m15.364 6.364l-2.828-2.828M8.464 8.464L5.636 5.636m12.728 0l-2.828 2.828m-7.072 7.072l-2.828 2.828"/></svg>
        </button>
      </div>
    </div>
    
    <!-- Attachments popover -->
    <AttachmentsPopover 
      v-if="showAttachments" 
      v-model:show="showAttachments"
      :project-id="project?.id || ''"
      @attach="handleAttachment"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, defineAsyncComponent, watch, onMounted } from 'vue'
import type { PropType } from 'vue'
import type { Database } from '~/types/database'
import type { Context, ChatMode, ActionConfig } from '~/types/chat'
import type { BlueprintUpdate } from '~/types/blueprint'

// Import rich message components dynamically
const ThinkingDisplay = defineAsyncComponent(() => import('./messages/ThinkingDisplay.vue'))
const AttachmentsPopover = defineAsyncComponent(() => import('./AttachmentsPopover.vue'))

type Project = Database['public']['Tables']['projects']['Row']

const props = defineProps({
  project: Object as PropType<Project | null>,
  isMobile: Boolean,
  mode: {
    type: String as PropType<ChatMode>,
    default: 'builder'
  },
  currentVision: {
    type: Object,
    default: () => null
  }
})

// Chat modes configuration
const chatModes: Array<{ value: ChatMode; label: string; description: string }> = [
  { value: 'focus', label: 'Focus', description: 'Exploratory conversation mode' },
  { value: 'builder', label: 'Builder', description: 'Task-oriented mode' },
  { value: 'wizard', label: 'Wizard', description: 'Guided process mode' }
]

// Current mode (reactive)
const currentMode = ref<ChatMode>(props.mode)

const emit = defineEmits<{
  'action-executed': [action: ActionConfig]
  'vision-update': [update: any]
  'blueprint-update': [update: BlueprintUpdate]
  'mode-changed': [mode: ChatMode]
}>()

// Auth and DB
const user = useSupabaseUser()
const supabase = useSupabaseTyped()

// Blueprint system
const { applyBlueprintUpdate } = useBlueprint()

// Chat state
const currentChatId = ref<string | null>(null)
const messages = ref<any[]>([])
const isStreaming = ref(false)
const streamingMessage = ref<any>(null)
const thinkingSteps = ref<any[]>([])
const error = ref<Error | null>(null)

// Local state
const chatInput = ref('')
const chatMessagesRef = ref<HTMLElement | null>(null)
const showThinking = ref(true)
const showAttachments = ref(false)
const attachedContexts = ref<Context[]>([])
const lastUserMessage = ref('')

// Handle sending messages
const handleSendMessage = async () => {
  if (!chatInput.value.trim() || isStreaming.value || !props.project) return
  
  const message = chatInput.value
  lastUserMessage.value = message
  chatInput.value = ''
  
  // Reset textarea height
  await nextTick()
  const textarea = document.querySelector('.chat-input') as HTMLTextAreaElement
  if (textarea) {
    textarea.style.height = 'auto'
  }
  
  // Add user message to UI immediately
  const tempUserMessage = {
    id: `temp-${Date.now()}`,
    chat_id: currentChatId.value || '',
    project_id: props.project.id,
    user_id: user.value?.id,
    role: 'user' as const,
    content: message,
    context_mode: currentMode.value,
    contexts: attachedContexts.value,
    message_type: 'text' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
  
  messages.value.push(tempUserMessage)
  
  // Clear contexts
  attachedContexts.value = []
  
  // Start loading
  isStreaming.value = true
  error.value = null
  
  try {
    // Gather context
    const contexts: Context[] = []
    
    // Add location context
    contexts.push({
      type: 'location',
      data: {
        currentView: 'builder',
        activeProject: props.project?.name || 'Unknown',
        activePage: undefined,
        activeComponent: undefined,
        breadcrumb: ['Projects', props.project?.name || 'Unknown'],
        viewState: {}
      },
      metadata: {
        source: 'automatic',
        timestamp: new Date().toISOString()
      }
    })
    
    // Add any attached contexts
    contexts.push(...attachedContexts.value)
    
    // Use Anthropic endpoint
    const endpoint = '/api/chat/anthropic'
    const response = await $fetch<{ content: string; error?: boolean }>(endpoint, {
      method: 'POST',
      body: {
        message,
        history: messages.value.slice(-10).map(m => ({
          role: m.role,
          content: m.content
        })),
        mode: currentMode.value,
        context: contexts,
        project: {
          name: props.project?.name,
          type: props.project?.type,
          description: props.project?.description
        },
        vision: props.currentVision
      }
    })
    
    // Add assistant message to UI
    const tempAssistantMessage = {
      id: `temp-${Date.now() + 1}`,
      chat_id: currentChatId.value || '',
      project_id: props.project.id,
      user_id: user.value?.id,
      role: 'assistant' as const,
      content: response.content,
      context_mode: currentMode.value,
      message_type: 'text' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    messages.value.push(tempAssistantMessage)
    
    // Process vision updates if in focus mode
    if (currentMode.value === 'focus') {
      const typedResponse = response as any
      
      // Process legacy vision updates
      if (typedResponse.visionUpdates) {
        console.log('Vision updates received:', typedResponse.visionUpdates)
        emit('vision-update', typedResponse.visionUpdates)
      }
      
      // Process new blueprint updates
      if (typedResponse.blueprintUpdates && props.project) {
        console.log('Blueprint updates received:', typedResponse.blueprintUpdates)
        emit('blueprint-update', typedResponse.blueprintUpdates)
        
        // Apply updates to database in real-time
        await applyBlueprintUpdate(props.project.id, typedResponse.blueprintUpdates)
      }
    }
    
    // Save to database in background (optional)
    saveMessagesToDatabase()
    
  } catch (err: any) {
    console.error('Chat error:', err)
    error.value = err
    
    // Add error message
    const errorMessage = {
      id: `error-${Date.now()}`,
      chat_id: currentChatId.value || '',
      project_id: props.project.id,
      user_id: user.value?.id,
      role: 'assistant' as const,
      content: `Sorry, I encountered an error: ${err.message || 'Unknown error'}`,
      context_mode: props.mode,
      message_type: 'text' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    messages.value.push(errorMessage)
  } finally {
    isStreaming.value = false
  }
  
  // Scroll to bottom
  scrollChatToBottom()
}

// Retry last message  
const retryLastMessage = async () => {
  if (lastUserMessage.value) {
    // Remove last error message if any
    if (messages.value.length > 0 && messages.value[messages.value.length - 1].role === 'assistant') {
      messages.value.pop()
    }
    error.value = null
    
    // Resend
    chatInput.value = lastUserMessage.value
    await handleSendMessage()
  }
}

// Clear chat
const clearChat = () => {
  messages.value = []
  lastUserMessage.value = ''
  attachedContexts.value = []
  error.value = null
}

// Toggle thinking display
const toggleThinking = () => {
  showThinking.value = !showThinking.value
}

// Switch chat mode
const switchMode = (mode: ChatMode) => {
  currentMode.value = mode
  emit('mode-changed', mode)
  // Optionally clear chat when switching modes
  // clearChat()
}

// Handle attachments
const handleAttachment = (attachment: Context) => {
  attachedContexts.value.push(attachment)
  showAttachments.value = false
}

// Remove context
const removeContext = (index: number) => {
  attachedContexts.value.splice(index, 1)
}

// Get context icon
const getContextIcon = (type: string): string => {
  const icons: Record<string, string> = {
    selection: '🎯',
    location: '📍',
    attachment: '📎',
    wizard: '🧙',
    reference: '🔗'
  }
  return icons[type] || '📄'
}

// Get context label
const getContextLabel = (ctx: Context): string => {
  switch (ctx.type) {
    case 'selection':
      return ctx.data.selectedElement?.content || 'Selection'
    case 'location':
      return ctx.data.currentView || 'Current view'
    case 'attachment':
      return ctx.data.originalName || 'Attachment'
    default:
      return ctx.type
  }
}

// Format message content (basic markdown support)
const formatMessageContent = (content: string | null): string => {
  if (!content) return ''
  
  // Basic markdown formatting
  return content
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Code blocks
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    // Inline code
    .replace(/`(.*?)`/g, '<code>$1</code>')
    // Line breaks
    .replace(/\n/g, '<br>')
}

// Get rich message component
const getRichMessageComponent = (type: string) => {
  // These would be implemented as separate components
  // TODO: Implement these message components
  const components: Record<string, any> = {
    // selection: defineAsyncComponent(() => import('./messages/SelectionMessage.vue')),
    // comparison: defineAsyncComponent(() => import('./messages/ComparisonMessage.vue')),
    // form: defineAsyncComponent(() => import('./messages/FormMessage.vue')),
    // visual: defineAsyncComponent(() => import('./messages/VisualMessage.vue'))
  }
  return components[type] || 'div'
}

// Handle rich message actions
const handleRichAction = (action: any) => {
  console.log('Rich message action:', action)
}

// Execute action
const executeAction = async (action: ActionConfig) => {
  console.log('Execute action:', action)
  emit('action-executed', action)
}

// Save messages to database (optional, in background)
const saveMessagesToDatabase = async () => {
  if (!props.project?.id || messages.value.length === 0) return
  
  try {
    // Save only the last few messages to avoid bulk operations
    const recentMessages = messages.value.slice(-5)
    
    for (const message of recentMessages) {
      // Skip if message already has an ID (already saved)
      if (message.id && !message.id.startsWith('temp-')) continue
      
      const messageData = {
        chat_id: message.chat_id || currentChatId.value,
        role: message.role,
        content: message.content,
        context_mode: message.context_mode || currentMode.value,
        message_type: message.message_type || 'text',
        message_data: message.message_data || {},
        contexts: message.contexts || attachedContexts.value,
        created_entities: message.created_entities || [],
        suggested_actions: message.suggested_actions || []
      }
      
      await $fetch(`/api/projects/${props.project.id}/messages`, {
        method: 'POST',
        body: messageData
      })
    }
  } catch (error) {
    console.error('Failed to save messages:', error)
    // Don't throw - this is a background operation
  }
}

// Scroll to bottom
const scrollChatToBottom = () => {
  nextTick(() => {
    if (chatMessagesRef.value) {
      chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight
    }
  })
}

// Handle textarea auto-resize
const handleChatInput = (event: Event) => {
  const textarea = event.target as HTMLTextAreaElement
  if (!textarea) return
  
  textarea.style.height = 'auto'
  textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
}

// Load existing messages on mount
onMounted(async () => {
  // Temporarily disabled database loading to simplify debugging
  // You can re-enable this later when everything is working
})

// Watch for new messages to scroll
watch(messages, () => {
  scrollChatToBottom()
})

watch(streamingMessage, () => {
  scrollChatToBottom()
})
</script>

<style scoped>
.chat-panel {
  background: var(--bg-secondary);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
}

/* Header */
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--border-primary);
  flex-shrink: 0;
}

.panel-title {
  font-size: 1rem;
  font-weight: 600;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.mode-switcher {
  display: flex;
  background: var(--bg-tertiary);
  border-radius: 8px;
  padding: 2px;
  gap: 2px;
}

.mode-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.mode-btn:hover:not(.active) {
  background: var(--bg-quaternary);
  color: var(--text-primary);
}

.mode-btn.active {
  background: var(--primary-500);
  color: white;
}

.icon-btn {
  background: transparent;
  border: 1px solid var(--border-primary);
  color: var(--text-secondary);
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.icon-btn:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.icon-btn.active {
  background: var(--primary-500);
  color: white;
  border-color: var(--primary-500);
}

.clear-btn {
  background: transparent;
  border: 1px solid var(--border-primary);
  color: var(--text-secondary);
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  transition: all 0.2s;
}

.clear-btn:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

/* Messages */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message {
  display: flex;
  gap: 0.75rem;
  max-width: 85%;
  animation: messageSlide 0.3s ease-out;
}

@keyframes messageSlide {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message.user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  flex-shrink: 0;
}

.message-avatar.assistant,
.message-avatar.ai {
  background: var(--primary-500);
}

.message-avatar.user {
  background: var(--bg-quaternary);
}

.message-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.message-content {
  padding: 0.75rem 1rem;
  border-radius: 18px;
  font-size: 0.9375rem;
  line-height: 1.5;
  word-wrap: break-word;
}

.message.user .message-content {
  background: var(--primary-500);
  color: white;
}

.message.assistant .message-content,
.message.ai .message-content {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

/* Streaming state */
.message.streaming .message-content {
  min-height: 36px;
}

.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 4px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: var(--text-tertiary);
  border-radius: 50%;
  animation: typing 1.4s infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

/* Code blocks */
.message-content pre {
  background: var(--bg-quaternary);
  border-radius: 8px;
  padding: 0.75rem;
  margin: 0.5rem 0;
  overflow-x: auto;
}

.message-content code {
  background: var(--bg-quaternary);
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-family: 'SF Mono', Monaco, monospace;
}

.message-content pre code {
  background: none;
  padding: 0;
}

/* Actions */
.message-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.action-btn {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  color: var(--text-primary);
  padding: 0.375rem 0.75rem;
  border-radius: 16px;
  font-size: 0.813rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: var(--primary-500);
  color: white;
  border-color: var(--primary-500);
  transform: translateY(-1px);
}

/* Entities */
.message-entities {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;
}

.entities-label {
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.entity-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.entity-type {
  color: var(--text-tertiary);
  text-transform: uppercase;
  font-size: 0.625rem;
  font-weight: 600;
}

.entity-name {
  color: var(--primary-500);
}

/* Error state */
.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  color: #ef4444;
  font-size: 0.875rem;
}

.retry-btn {
  margin-left: auto;
  background: transparent;
  border: 1px solid currentColor;
  color: inherit;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.retry-btn:hover {
  background: currentColor;
  color: white;
}

/* Context bar */
.context-bar {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-top: 1px solid var(--border-primary);
  background: var(--bg-tertiary);
  flex-wrap: wrap;
}

.context-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.5rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 16px;
  font-size: 0.75rem;
}

.context-icon {
  font-size: 0.875rem;
}

.context-label {
  color: var(--text-secondary);
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.remove-btn {
  background: none;
  border: none;
  color: var(--text-tertiary);
  font-size: 1rem;
  line-height: 1;
  cursor: pointer;
  padding: 0 0.125rem;
  margin-left: 0.25rem;
}

.remove-btn:hover {
  color: var(--text-primary);
}

/* Input area */
.chat-input-area {
  padding: 0.75rem;
  border-top: 1px solid var(--border-primary);
  background: var(--bg-secondary);
}

.is-mobile .chat-input-area {
  padding-bottom: calc(0.75rem + env(safe-area-inset-bottom));
}

.input-container {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 24px;
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  padding: 0.5rem;
  transition: all 0.2s ease;
}

.input-container:focus-within:not(.disabled) {
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px rgba(22, 193, 129, 0.1);
}

.input-container.disabled {
  opacity: 0.7;
}

.attach-btn {
  background: none;
  border: none;
  color: var(--text-tertiary);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.attach-btn:not(:disabled):hover {
  background: var(--bg-quaternary);
  color: var(--text-primary);
}

.attach-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.chat-input {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-size: 0.9375rem;
  resize: none;
  min-height: 24px;
  max-height: 120px;
  padding: 0.5rem 0;
  line-height: 1.4;
  font-family: inherit;
  outline: none;
}

.chat-input::placeholder {
  color: var(--text-muted);
}

.chat-input:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.send-btn {
  background: var(--primary-500);
  color: white;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  opacity: 0;
  transform: scale(0.8);
  flex-shrink: 0;
}

.send-btn.show {
  opacity: 1;
  transform: scale(1);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.send-btn:not(:disabled):hover {
  background: var(--primary-600);
  transform: scale(1.05);
}

/* Icon utilities */
.icon {
  width: 18px;
  height: 18px;
  stroke: currentColor;
  stroke-width: 2;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.icon.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Scrollbar */
.chat-messages::-webkit-scrollbar {
  width: 8px;
}

.chat-messages::-webkit-scrollbar-track {
  background: var(--bg-secondary);
}

.chat-messages::-webkit-scrollbar-thumb {
  background: var(--bg-quaternary);
  border-radius: 4px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: var(--border-secondary);
}
</style>