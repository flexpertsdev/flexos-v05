<template>
  <div class="wizard-chat">
    <div class="chat-header">
      <h1 class="wizard-title">
        <span style="font-size: 1.5rem;">🧙</span>
        FlexOS Builder
      </h1>
      <p class="wizard-subtitle">{{ subtitle }}</p>
    </div>

    <div class="chat-messages" ref="chatMessages">
      <!-- Messages -->
      <div 
        v-for="(message, index) in messages" 
        :key="index"
        class="message"
        :class="{ user: message.type === 'user' }"
      >
        <div v-if="message.type === 'ai'" class="message-avatar ai-avatar">AI</div>
        <div class="message-content">
          <template v-if="message.type === 'ai' && message.content">
            <div v-html="formatMessage(message.content)"></div>
          </template>
          <template v-else-if="message.type === 'user'">
            {{ message.content }}
          </template>
        </div>
        <div v-if="message.type === 'user'" class="message-avatar user-avatar">U</div>
      </div>

      <!-- Typing Indicator -->
      <div v-if="isTyping" class="message">
        <div class="message-avatar ai-avatar">AI</div>
        <div class="message-content">
          <div class="typing-indicator">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div v-if="quickActions.length > 0 && !isTyping" class="quick-actions">
        <button 
          v-for="action in quickActions" 
          :key="action"
          class="quick-action"
          @click="$emit('quick-action', action)"
        >
          {{ action }}
        </button>
      </div>
    </div>

    <div class="chat-input-area">
      <!-- Reply Context -->
      <div v-if="replyContext" class="reply-context">
        <div class="reply-context-content">
          <strong>{{ replyContext.title }}</strong>
          <div style="font-size: 0.75rem; margin-top: 0.25rem;">
            {{ replyContext.description }}
          </div>
        </div>
        <button class="close-btn" @click="$emit('clear-context')">×</button>
      </div>

      <div class="input-container">
        <input 
          ref="inputRef"
          v-model="inputValue"
          type="text" 
          class="chat-input" 
          placeholder="Type your answer..."
          @keypress.enter="sendMessage"
          @input="$emit('update:modelValue', inputValue)"
        >
        <button 
          class="send-btn" 
          @click="sendMessage" 
          :disabled="!inputValue.trim()"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'

interface Message {
  type: 'ai' | 'user'
  content: string
}

interface ReplyContext {
  title: string
  description: string
}

interface Props {
  messages?: Message[]
  isTyping?: boolean
  quickActions?: string[]
  replyContext?: ReplyContext | null
  subtitle?: string
  modelValue?: string
}

const props = withDefaults(defineProps<Props>(), {
  messages: () => [],
  isTyping: false,
  quickActions: () => [],
  replyContext: null,
  subtitle: "Let's build something amazing",
  modelValue: ''
})

const emit = defineEmits<{
  'send': [message: string]
  'quick-action': [action: string]
  'clear-context': []
  'update:modelValue': [value: string]
}>()

const inputValue = ref(props.modelValue)
const chatMessages = ref<HTMLElement>()
const inputRef = ref<HTMLInputElement>()

// Sync with v-model
watch(() => props.modelValue, (newVal) => {
  inputValue.value = newVal
})

const formatMessage = (text: string) => {
  return text.replace(/\n/g, '<br>')
}

const sendMessage = () => {
  const message = inputValue.value.trim()
  if (!message) return
  
  emit('send', message)
  inputValue.value = ''
  emit('update:modelValue', '')
}

const scrollToBottom = async () => {
  await nextTick()
  if (chatMessages.value) {
    chatMessages.value.scrollTop = chatMessages.value.scrollHeight
  }
}

// Scroll when messages change
watch(() => props.messages.length, () => {
  scrollToBottom()
})

watch(() => props.isTyping, () => {
  scrollToBottom()
})

// Public methods
defineExpose({
  focus: () => inputRef.value?.focus(),
  scrollToBottom
})
</script>

<style scoped>
.wizard-chat {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* Header */
.chat-header {
  padding: 2rem;
  border-bottom: 1px solid var(--border-primary);
  background: var(--bg-tertiary);
  transition: padding 0.3s ease;
}

.wizard-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-primary);
  transition: font-size 0.3s ease;
}

.wizard-subtitle {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

/* Chat Messages */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}

/* Messages */
.message {
  display: flex;
  gap: 1rem;
  animation: messageSlide 0.4s ease-out;
}

@keyframes messageSlide {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message.user {
  justify-content: flex-end;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  flex-shrink: 0;
  transition: width 0.3s ease, height 0.3s ease;
}

.ai-avatar {
  background: linear-gradient(135deg, var(--primary-500), var(--primary-400));
  color: white;
}

.user-avatar {
  background: var(--bg-quaternary);
  color: var(--text-secondary);
}

.message-content {
  background: var(--bg-tertiary);
  padding: 1rem 1.25rem;
  border-radius: 16px;
  max-width: 80%;
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--text-primary);
  transition: all 0.3s ease;
}

.message.user .message-content {
  background: rgba(22, 193, 129, 0.1);
  border: 1px solid rgba(22, 193, 129, 0.3);
}

/* Typing Indicator */
.typing-indicator {
  display: flex;
  gap: 0.3rem;
  padding: 0.75rem 1rem;
}

.typing-dot {
  width: 8px;
  height: 8px;
  background: var(--text-tertiary);
  border-radius: 50%;
  animation: typing 1.4s ease-in-out infinite;
}

.typing-dot:nth-child(2) { animation-delay: 0.2s; }
.typing-dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes typing {
  0%, 60%, 100% { opacity: 0.3; transform: scale(1); }
  30% { opacity: 1; transform: scale(1.2); }
}

/* Quick Actions */
.quick-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.quick-action {
  padding: 0.5rem 1rem;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-secondary);
  border-radius: 20px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--text-primary);
  font-weight: 500;
}

.quick-action:hover {
  background: rgba(22, 193, 129, 0.1);
  border-color: var(--primary-500);
  color: var(--primary-500);
  transform: translateY(-1px);
}

/* Input Area */
.chat-input-area {
  padding: 2rem;
  border-top: 1px solid var(--border-primary);
  background: var(--bg-secondary);
  transition: padding 0.3s ease;
}

/* Reply Context */
.reply-context {
  background: var(--bg-quaternary);
  border-left: 3px solid var(--purple-500);
  padding: 0.75rem;
  margin-bottom: 0.75rem;
  border-radius: 4px;
  font-size: 0.875rem;
  color: var(--text-secondary);
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.reply-context-content {
  flex: 1;
}

.close-btn {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--bg-tertiary);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  font-size: 1rem;
  flex-shrink: 0;
  cursor: pointer;
  transition: all 0.2s;
}

.close-btn:hover {
  background: var(--bg-quaternary);
  color: var(--text-secondary);
}

/* Input Container */
.input-container {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.chat-input {
  flex: 1;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 24px;
  padding: 1rem 1.5rem;
  color: var(--text-primary);
  font-family: inherit;
  font-size: 0.95rem;
  transition: all 0.2s;
  resize: none;
  outline: none;
}

.chat-input:focus {
  border-color: var(--primary-500);
  background: var(--bg-quaternary);
}

.send-btn {
  background: var(--primary-500);
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}

.send-btn:hover {
  background: var(--primary-600);
  transform: scale(1.05);
}

.send-btn:active {
  transform: scale(0.95);
}

.send-btn:disabled {
  background: var(--bg-quaternary);
  color: var(--text-muted);
  cursor: not-allowed;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .chat-header {
    padding: calc(var(--safe-area-top) + 1rem) 1rem 1rem;
  }

  .wizard-title {
    font-size: 1.125rem;
  }

  .chat-messages {
    padding: 1rem;
    padding-bottom: 100px;
  }

  .message-avatar {
    width: 28px;
    height: 28px;
  }

  .message-content {
    font-size: 0.9375rem;
  }

  .chat-input-area {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 0.75rem;
    padding-bottom: calc(var(--safe-area-bottom) + 0.75rem);
    z-index: 100;
  }

  .input-container {
    gap: 0.5rem;
  }

  .chat-input {
    padding: 0.75rem 1.25rem;
    font-size: 0.9375rem;
  }

  .send-btn {
    width: 40px;
    height: 40px;
  }
}

/* Tablet Adjustments */
@media (min-width: 769px) and (max-width: 1024px) {
  .chat-header {
    padding: 1.5rem;
  }

  .chat-messages {
    padding: 1.5rem;
  }
}
</style>