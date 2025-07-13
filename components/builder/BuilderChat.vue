<template>
  <div class="builder-chat">
    <!-- Chat Header -->
    <div class="chat-header">
      <h2 class="chat-title">FlexOS Builder</h2>
      <div class="chat-actions">
        <button class="action-btn" @click="clearChat" title="Clear chat">
          🗑️
        </button>
        <button class="action-btn" @click="toggleContext" title="Toggle context">
          📎
        </button>
      </div>
    </div>
    
    <!-- Context Panel -->
    <Transition name="slide">
      <div v-if="showContext" class="context-panel">
        <h3 class="context-title">Project Context</h3>
        <div class="context-items">
          <div
            v-for="item in context.items"
            :key="item.id"
            class="context-item"
            :class="{ 'context-item--active': item.active }"
            @click="toggleContextItemState(item.id)"
          >
            <span class="context-icon">{{ item.icon }}</span>
            <span class="context-label">{{ item.name }}</span>
            <span v-if="item.active" class="context-check">✓</span>
          </div>
        </div>
        <div class="context-summary">
          {{ contextSummary }}
        </div>
      </div>
    </Transition>
    
    <!-- Messages Container -->
    <div ref="messagesContainer" class="messages-container">
      <div v-if="messages.length === 0" class="welcome-message">
        <h3>Welcome to FlexOS Builder! 👋</h3>
        <p>I'm here to help you build your application. You can:</p>
        <ul>
          <li>Describe features you want to add</li>
          <li>Ask me to create components or pages</li>
          <li>Request help with debugging</li>
          <li>Get guidance on best practices</li>
        </ul>
        <p>Try saying: "Create a user dashboard with charts"</p>
      </div>
      
      <div
        v-for="message in messages"
        :key="message.id"
        class="message"
        :class="`message--${message.role}`"
      >
        <div class="message-content">
          <div v-if="message.role === 'user'" class="message-text">
            {{ message.content }}
          </div>
          <div v-else class="message-text" v-html="renderMarkdown(message.content)" />
          
          <div v-if="message.attachments && message.attachments.length > 0" class="message-attachments">
            <div
              v-for="attachment in message.attachments"
              :key="attachment.id"
              class="attachment"
            >
              <span class="attachment-icon">📄</span>
              <span class="attachment-name">{{ attachment.name }}</span>
            </div>
          </div>
        </div>
        
        <div class="message-meta">
          <span class="message-time">{{ formatTime(message.timestamp) }}</span>
        </div>
      </div>
      
      <!-- Typing Indicator -->
      <div v-if="isTyping" class="message message--assistant">
        <div class="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
    
    <!-- Input Area -->
    <div class="input-area">
      <div class="input-wrapper">
        <textarea
          v-model="inputMessage"
          @keydown.enter.prevent="handleSubmit"
          @keydown.shift.enter="handleNewLine"
          @input="adjustTextareaHeight"
          ref="messageInput"
          class="message-input"
          placeholder="Describe what you want to build..."
          :disabled="isLoading"
          rows="1"
        />
        <button
          @click="handleSubmit"
          class="send-button"
          :disabled="!inputMessage.trim() || isLoading"
        >
          <span v-if="!isLoading">↵</span>
          <span v-else class="loading-spinner">⟳</span>
        </button>
      </div>
      
      <div class="input-actions">
        <button class="input-action" @click="attachFile" title="Attach file">
          📎
        </button>
        <button class="input-action" @click="takeScreenshot" title="Screenshot">
          📸
        </button>
        <button class="input-action" @click="selectCode" title="Select code">
          🔍
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, watch } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'isomorphic-dompurify'
import { useBuilderContext } from '~/composables/useBuilderContext'

// Types
interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  attachments?: Attachment[]
}

interface Attachment {
  id: string
  name: string
  type: string
  content?: string
}


// State
const messages = ref<Message[]>([])
const inputMessage = ref('')
const isLoading = ref(false)
const isTyping = ref(false)
const showContext = ref(false)

// Refs
const messagesContainer = ref<HTMLElement>()
const messageInput = ref<HTMLTextAreaElement>()

// Use context composable
const { 
  context, 
  activeItems, 
  contextSummary,
  addContextItem,
  toggleContextItem: toggleContextItemState,
  initializeDefaultContext
} = useBuilderContext()

// Initialize context on mount
onMounted(() => {
  initializeDefaultContext()
  
  // Add builder-specific context items
  addContextItem({
    type: 'reference',
    name: 'Project Vision',
    icon: '🎯'
  })
  addContextItem({
    type: 'reference',
    name: 'User Journeys',
    icon: '🚶'
  })
})

// Methods
const handleSubmit = async () => {
  if (!inputMessage.value.trim() || isLoading.value) return
  
  const userMessage: Message = {
    id: generateId(),
    role: 'user',
    content: inputMessage.value,
    timestamp: new Date()
  }
  
  messages.value.push(userMessage)
  inputMessage.value = ''
  isLoading.value = true
  isTyping.value = true
  
  // Reset textarea height
  if (messageInput.value) {
    messageInput.value.style.height = 'auto'
  }
  
  // Scroll to bottom
  await scrollToBottom()
  
  try {
    // Call API
    const response = await $fetch('/api/builder/chat', {
      method: 'POST',
      body: {
        messages: messages.value.map(m => ({
          role: m.role,
          content: m.content
        })),
        context: getActiveContext()
      }
    })
    
    isTyping.value = false
    
    const assistantMessage: Message = {
      id: generateId(),
      role: 'assistant',
      content: response.content,
      timestamp: new Date()
    }
    
    messages.value.push(assistantMessage)
    await scrollToBottom()
    
  } catch (error) {
    isTyping.value = false
    console.error('Chat error:', error)
    
    const errorMessage: Message = {
      id: generateId(),
      role: 'assistant',
      content: 'Sorry, I encountered an error. Please try again.',
      timestamp: new Date()
    }
    
    messages.value.push(errorMessage)
  } finally {
    isLoading.value = false
  }
}

const handleNewLine = (e: KeyboardEvent) => {
  if (e.shiftKey) {
    return // Let default behavior happen
  }
}

const adjustTextareaHeight = () => {
  const textarea = messageInput.value
  if (!textarea) return
  
  textarea.style.height = 'auto'
  textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px'
}

const clearChat = () => {
  if (confirm('Clear all messages?')) {
    messages.value = []
  }
}

const toggleContext = () => {
  showContext.value = !showContext.value
}


const getActiveContext = () => {
  return activeItems.value.map(item => ({
    type: item.type,
    name: item.name,
    content: item.content,
    metadata: item.metadata
  }))
}

const attachFile = () => {
  // TODO: Implement file attachment
  console.log('Attach file')
}

const takeScreenshot = () => {
  // TODO: Implement screenshot
  console.log('Take screenshot')
}

const selectCode = () => {
  // TODO: Implement code selection
  console.log('Select code')
}

const renderMarkdown = (content: string): string => {
  const html = marked(content, {
    breaks: true,
    gfm: true
  })
  return DOMPurify.sanitize(html)
}

const formatTime = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(date)
}

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// Watch for messages changes
watch(messages, () => {
  scrollToBottom()
}, { deep: true })

// Focus input on mount
onMounted(() => {
  messageInput.value?.focus()
})
</script>

<style scoped>
.builder-chat {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
}

/* Header */
.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-secondary);
}

.chat-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.chat-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 8px;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 8px;
  transition: var(--transition-base);
  font-size: 16px;
  
  &:hover {
    background: var(--bg-hover);
  }
}

/* Context Panel */
.context-panel {
  padding: 16px;
  background: var(--bg-tertiary);
  border-bottom: 1px solid var(--border-color);
}

.context-title {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: var(--text-secondary);
}

.context-items {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.context-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: var(--transition-base);
  
  &:hover {
    border-color: var(--color-primary);
  }
  
  &.context-item--active {
    background: var(--color-primary-light);
    border-color: var(--color-primary);
    color: var(--color-primary);
  }
}

.context-icon {
  font-size: 16px;
}

.context-label {
  flex: 1;
  font-size: 14px;
}

.context-check {
  font-size: 12px;
  font-weight: 600;
}

.context-summary {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: rgba(22, 193, 129, 0.1);
  border-radius: 8px;
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-align: center;
}

/* Messages */
.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  scroll-behavior: smooth;
}

.welcome-message {
  padding: 24px;
  text-align: center;
  color: var(--text-secondary);
  
  h3 {
    font-size: 20px;
    margin: 0 0 16px 0;
    color: var(--text-primary);
  }
  
  p {
    margin: 16px 0;
  }
  
  ul {
    text-align: left;
    max-width: 400px;
    margin: 16px auto;
    list-style: none;
    padding: 0;
    
    li {
      padding: 8px 0;
      padding-left: 24px;
      position: relative;
      
      &:before {
        content: '•';
        position: absolute;
        left: 8px;
        color: var(--color-primary);
      }
    }
  }
}

.message {
  margin-bottom: 16px;
  
  &.message--user {
    display: flex;
    justify-content: flex-end;
  }
  
  &.message--assistant {
    display: flex;
    justify-content: flex-start;
  }
}

.message-content {
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 16px;
  
  .message--user & {
    background: var(--color-primary);
    color: white;
  }
  
  .message--assistant & {
    background: var(--bg-secondary);
    color: var(--text-primary);
  }
}

.message-text {
  font-size: 14px;
  line-height: 1.5;
  
  /* Markdown styles */
  :deep(p) {
    margin: 0 0 8px 0;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  :deep(code) {
    background: var(--bg-code);
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 13px;
  }
  
  :deep(pre) {
    background: var(--bg-code);
    padding: 12px;
    border-radius: 8px;
    overflow-x: auto;
    margin: 8px 0;
  }
}

.message-attachments {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.attachment {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  font-size: 12px;
}

.message-meta {
  margin-top: 4px;
  padding: 0 16px;
}

.message-time {
  font-size: 11px;
  color: var(--text-tertiary);
}

/* Typing Indicator */
.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 8px;
  
  span {
    width: 8px;
    height: 8px;
    background: var(--text-secondary);
    border-radius: 50%;
    animation: typing 1.4s infinite;
    
    &:nth-child(2) {
      animation-delay: 0.2s;
    }
    
    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.7;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

/* Input Area */
.input-area {
  padding: 16px;
  border-top: 1px solid var(--border-color);
  background: var(--bg-secondary);
}

.input-wrapper {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 8px;
  transition: var(--transition-base);
  
  &:focus-within {
    border-color: var(--color-primary);
  }
}

.message-input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  font-size: 14px;
  resize: none;
  min-height: 24px;
  max-height: 200px;
  line-height: 1.5;
  color: var(--text-primary);
  
  &::placeholder {
    color: var(--text-tertiary);
  }
}

.send-button {
  padding: 8px 12px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: var(--transition-base);
  font-size: 16px;
  min-width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover:not(:disabled) {
    background: var(--color-primary-dark);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.loading-spinner {
  display: inline-block;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.input-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.input-action {
  padding: 6px 12px;
  background: none;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: var(--transition-base);
  font-size: 14px;
  
  &:hover {
    background: var(--bg-hover);
    border-color: var(--color-primary);
  }
}

/* Transitions */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  transform: translateY(-20px);
  opacity: 0;
}

.slide-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

/* CSS Variables */
:root {
  --bg-tertiary: #f3f4f6;
  --bg-code: #f3f4f6;
  --text-tertiary: #9ca3af;
  --color-primary-light: rgba(59, 130, 246, 0.1);
  --color-primary-dark: #2563eb;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg-tertiary: #0f172a;
    --bg-code: #1e293b;
    --text-tertiary: #64748b;
    --color-primary-light: rgba(59, 130, 246, 0.2);
  }
}
</style>