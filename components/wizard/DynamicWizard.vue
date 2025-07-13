<template>
  <WizardLayout 
    :progress="progress" 
    :active-tab="activeTab"
    :wizard-name="wizard?.name" 
    @tab-change="activeTab = $event"
    @exit="handleExit"
  >
    <template #chat>
      <div class="chat-container">
        <!-- Messages -->
        <div class="chat-messages" ref="messagesContainer">
          <TransitionGroup name="message">
            <div
              v-for="(message, index) in messages"
              :key="message.id"
              class="message"
              :class="message.role"
            >
              <div class="message-avatar" :class="`${message.role}-avatar`">
                {{ message.role === 'assistant' ? 'AI' : 'U' }}
              </div>
              <div class="message-content">
                <div v-if="message.isTyping" class="typing-indicator">
                  <div class="typing-dot"></div>
                  <div class="typing-dot"></div>
                  <div class="typing-dot"></div>
                </div>
                <div v-else v-html="formatMessage(message.content)"></div>
              </div>
            </div>
          </TransitionGroup>

          <!-- Current Phase Input -->
          <div v-if="currentPhase && !isProcessing" class="phase-input">
            <WizardPhaseInput
              :phase="currentPhase"
              :value="currentInput"
              @update="currentInput = $event"
              @submit="submitPhaseInput"
            />
          </div>
        </div>

        <!-- Input Area -->
        <div class="chat-input-area" v-if="!wizard || currentPhase?.type === 'question'">
          <form @submit.prevent="sendMessage">
            <div class="input-container">
              <input
                type="text"
                v-model="userInput"
                :placeholder="inputPlaceholder"
                :disabled="isProcessing"
                class="chat-input"
                ref="chatInput"
              />
              <button
                type="submit"
                :disabled="!userInput.trim() || isProcessing"
                class="send-btn"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z"/>
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </template>

    <template #magic>
      <DynamicWizardMagic
        :wizard="wizard"
        :current-phase="currentPhase"
        :answers="answers"
        :processing-steps="processingSteps"
      />
    </template>
  </WizardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { WizardConfig, WizardPhase, AIMessage } from '~/types/wizard'
import WizardLayout from './WizardLayout.vue'
import WizardPhaseInput from './WizardPhaseInput.vue'
import DynamicWizardMagic from './DynamicWizardMagic.vue'
import { useWizard } from '~/composables/useWizard'

const route = useRoute()
const {
  wizard,
  currentPhase,
  messages,
  answers,
  progress,
  isProcessing,
  processingSteps,
  loadWizard,
  sendMessage: sendWizardMessage,
  submitPhaseInput: submitInput
} = useWizard()

// Local state
const activeTab = ref<'chat' | 'magic'>('chat')
const userInput = ref('')
const currentInput = ref<any>(null)
const messagesContainer = ref<HTMLElement>()
const chatInput = ref<HTMLInputElement>()

// Computed
const inputPlaceholder = computed(() => {
  if (isProcessing.value) return 'Processing...'
  if (currentPhase.value?.type === 'selection') return 'Select an option above'
  return 'Type your answer...'
})

// Load wizard on mount
onMounted(async () => {
  const wizardId = route.params.id as string
  if (wizardId) {
    await loadWizard(wizardId)
  }
})

// Scroll to bottom when messages change
watch(messages, async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
})

// Focus input when phase changes
watch(currentPhase, async () => {
  await nextTick()
  if (chatInput.value && currentPhase.value?.inputType === 'text') {
    chatInput.value.focus()
  }
})

// Methods
async function sendMessage() {
  if (!userInput.value.trim() || isProcessing.value) return
  
  const message = userInput.value
  userInput.value = ''
  
  await sendWizardMessage(message)
}

async function submitPhaseInput(value: any) {
  currentInput.value = null
  await submitInput(value)
}

function formatMessage(content: string): string {
  // Convert newlines to <br> tags
  return content.replace(/\n/g, '<br>')
}

function handleExit() {
  // Handle any cleanup if needed
  // Navigation is handled by WizardLayout which will route to /wizards
}
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  padding-bottom: 120px; /* Space for input area */
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  min-height: 0; /* Fix for flexbox scrolling */
}

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
}

.assistant-avatar {
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
}

.message.user .message-content {
  background: rgba(22, 193, 129, 0.1);
  border: 1px solid rgba(22, 193, 129, 0.3);
}

.typing-indicator {
  display: flex;
  gap: 0.3rem;
  padding: 0.5rem 0;
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

.phase-input {
  margin-top: 2rem;
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.chat-input-area {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem 2rem;
  border-top: 1px solid var(--border-primary);
  background: var(--bg-secondary);
  z-index: 10;
}

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
  outline: none;
}

.chat-input:focus {
  border-color: var(--primary-500);
  background: var(--bg-quaternary);
}

.chat-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
  color: white;
}

.send-btn:hover:not(:disabled) {
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

/* Transitions */
.message-enter-active,
.message-leave-active {
  transition: all 0.3s ease;
}

.message-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.message-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .chat-messages {
    padding: 1rem;
    padding-bottom: 100px; /* Space for fixed input */
    gap: 1rem;
  }

  .message-avatar {
    width: 32px;
    height: 32px;
  }

  .message-content {
    font-size: 0.9rem;
    padding: 0.875rem 1rem;
  }

  .chat-input-area {
    padding: 1rem;
    padding-bottom: calc(1rem + var(--safe-area-bottom));
  }

  .chat-input {
    padding: 0.75rem 1.25rem;
  }

  .send-btn {
    width: 40px;
    height: 40px;
  }
}
</style>