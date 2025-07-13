<template>
  <div class="chat-panel" :class="{ 'is-mobile': isMobile }">
    <div class="panel-header">
      <h3 class="panel-title">AI Assistant</h3>
      <button @click="clearChat" class="clear-btn">Clear</button>
    </div>
    <div class="chat-messages" ref="chatMessagesRef">
      <div v-for="message in messages" :key="message.id" class="message" :class="message.type">
        <div class="message-avatar" :class="message.type">{{ message.type === 'ai' ? 'AI' : 'U' }}</div>
        <div class="message-content" v-html="message.content"></div>
      </div>
      <div v-if="messages.length === 0" class="message ai">
        <div class="message-avatar ai">AI</div>
        <div class="message-content">Hi! I'm here to help you build your {{ project?.name?.toLowerCase() || 'project' }}. What would you like to work on today?</div>
      </div>
    </div>
    <div class="chat-input-area">
      <div class="input-container">
        <button @click="attachFile" class="attach-btn">
          <svg class="icon" viewBox="0 0 24 24"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
        </button>
        <textarea v-model="chatInput" placeholder="Ask about your project..." @keydown.enter.exact.prevent="sendMessage" @input="handleChatInput" class="chat-input" rows="1"></textarea>
        <button @click="sendMessage" class="send-btn" :class="{ show: chatInput.trim() }">
          <svg class="icon" viewBox="0 0 24 24"><path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z"/></svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import type { PropType } from 'vue'
import type { Database } from '~/types/database'

type Project = Database['public']['Tables']['projects']['Row']

interface Message {
  id: string
  content: string
  type: 'ai' | 'user'
}

defineProps({
  project: Object as PropType<Project | null>,
  isMobile: Boolean,
})

const chatInput = ref('')
const messages = ref<Message[]>([])
const chatMessagesRef = ref<HTMLElement | null>(null)

const clearChat = () => messages.value = []

const sendMessage = () => {
  if (!chatInput.value.trim()) return
  messages.value.push({ id: Date.now().toString(), content: chatInput.value, type: 'user' })
  const userMessage = chatInput.value
  chatInput.value = ''
  handleChatInput({ target: { value: '' } } as any)

  setTimeout(() => {
    messages.value.push({ id: Date.now().toString(), content: `Thinking about "${userMessage}"...`, type: 'ai' })
    scrollChatToBottom()
  }, 1000)
  scrollChatToBottom()
}

const scrollChatToBottom = () => {
  nextTick(() => {
    if (chatMessagesRef.value) {
      chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight
    }
  })
}

const handleChatInput = (event: Event) => {
  const textarea = event.target as HTMLTextAreaElement
  textarea.style.height = 'auto'
  textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
}

const attachFile = () => console.log('Attach file')
</script>

<style scoped>
.chat-panel {
  background: var(--bg-secondary);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
}

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

.clear-btn {
  background: transparent;
  border: 1px solid var(--border-primary);
  color: var(--text-secondary);
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  transition: all 0.2s;
}
.clear-btn:hover { background: var(--bg-tertiary); color: var(--text-primary); }

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message { display: flex; gap: 0.75rem; max-width: 85%; animation: messageSlide 0.3s ease-out; }
@keyframes messageSlide { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.message.user { align-self: flex-end; flex-direction: row-reverse; }

.message-avatar { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.875rem; font-weight: 600; color: white; flex-shrink: 0; }
.message-avatar.ai { background: var(--primary-500); }
.message-avatar.user { background: var(--bg-quaternary); }

.message-content { padding: 0.75rem 1rem; border-radius: 18px; font-size: 0.9375rem; line-height: 1.45; word-wrap: break-word; }
.message.user .message-content { background: var(--primary-500); color: white; }
.message.ai .message-content { background: var(--bg-tertiary); color: var(--text-primary); }

.chat-input-area { padding: 0.75rem; border-top: 1px solid var(--border-primary); background: var(--bg-secondary); }
.is-mobile .chat-input-area { padding-bottom: calc(0.75rem + env(safe-area-inset-bottom)); }

.input-container {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 24px;
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  padding: 0.5rem;
  transition: border-color 0.2s ease;
}
.input-container:focus-within { border-color: var(--primary-500); }

.attach-btn { background: none; border: none; color: var(--text-tertiary); cursor: pointer; padding: 0.5rem; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease; flex-shrink: 0; }

.chat-input { flex: 1; background: transparent; border: none; color: var(--text-primary); font-size: 0.9375rem; resize: none; min-height: 24px; max-height: 120px; padding: 0.5rem 0; line-height: 1.4; font-family: inherit; outline: none; }
.chat-input::placeholder { color: var(--text-muted); }

.send-btn { background: var(--primary-500); color: white; border: none; border-radius: 50%; width: 36px; height: 36px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease; opacity: 0; transform: scale(0.8); flex-shrink: 0; }
.send-btn.show { opacity: 1; transform: scale(1); }

.chat-messages::-webkit-scrollbar { width: 8px; }
.chat-messages::-webkit-scrollbar-track { background: var(--bg-secondary); }
.chat-messages::-webkit-scrollbar-thumb { background: var(--bg-quaternary); border-radius: 4px; }
.chat-messages::-webkit-scrollbar-thumb:hover { background: var(--border-secondary); }
</style>
