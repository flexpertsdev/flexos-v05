<template>
  <div class="chat-section">
    <div class="chat-header" v-if="!isMobile">
      <h3>AI Assistant</h3>
      <button class="clear-btn" @click="$emit('clear-chat')">Clear</button>
    </div>
    
    <div class="chat-messages" ref="messagesContainer">
      <div 
        v-for="message in messages" 
        :key="message.id"
        :class="['message', message.type]"
      >
        <div class="message-avatar">
          {{ message.type === 'user' ? 'U' : 'AI' }}
        </div>
        <div class="message-content">
          {{ message.content }}
          <div v-if="message.attachments?.length" class="message-attachments">
            <div 
              v-for="attachment in message.attachments" 
              :key="attachment.id"
              class="attachment-badge"
            >
              {{ attachment.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="chat-input-area">
      <!-- Context Bar -->
      <div v-if="attachedContext.length > 0" class="context-bar">
        <div 
          v-for="item in attachedContext" 
          :key="item.id"
          class="context-item"
        >
          <svg class="icon" viewBox="0 0 24 24" v-html="getContextIcon(item.type)"></svg>
          {{ item.name }}
          <button class="remove-btn" @click="$emit('remove-context', item.id)">
            <svg class="icon" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>
      
      <div class="input-container">
        <button class="attach-btn" @click="toggleAttachMenu">
          <svg class="icon" viewBox="0 0 24 24">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
          </svg>
        </button>
        
        <textarea 
          v-model="inputText"
          class="chat-input" 
          placeholder="Ask about your project..." 
          @keydown.enter.prevent="handleEnter"
          @input="handleInput"
          ref="textarea"
          rows="1"
        ></textarea>
        
        <transition name="fade">
          <button 
            v-if="showSendButton"
            class="send-btn"
            @click="sendMessage"
          >
            <svg class="icon" viewBox="0 0 24 24">
              <path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z"/>
            </svg>
          </button>
        </transition>
        
        <!-- Attachment Menu -->
        <transition name="menu-slide">
          <div v-if="showAttachMenu" class="attachment-menu" ref="attachMenuRef">
            <div class="attachment-menu-section">
              <div class="attachment-menu-title">Upload Files</div>
              <div class="attachment-menu-item" @click="uploadFiles">
                <svg class="icon" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                </svg>
                Documents & Images
              </div>
            </div>
            
            <div class="attachment-divider"></div>
            
            <div class="attachment-menu-section">
              <div class="attachment-menu-title">Attach Project Context</div>
              <div 
                v-for="contextOption in contextOptions"
                :key="contextOption.type"
                class="attachment-menu-item"
                @click="attachContext(contextOption.type, contextOption.name)"
              >
                <svg class="icon" viewBox="0 0 24 24" v-html="contextOption.icon"></svg>
                {{ contextOption.name }}
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
    
    <input 
      type="file" 
      ref="fileInput"
      style="display: none"
      multiple
      accept="image/*,.pdf,.doc,.docx,.txt"
      @change="handleFileSelect"
    >
  </div>
</template>

<script>
import { ref, computed, watch, nextTick } from 'vue'

export default {
  name: 'ChatSection',
  props: {
    messages: {
      type: Array,
      default: () => []
    },
    attachedContext: {
      type: Array,
      default: () => []
    },
    isMobile: {
      type: Boolean,
      default: false
    }
  },
  emits: ['send-message', 'attach-context', 'remove-context', 'clear-chat'],
  setup(props, { emit }) {
    const inputText = ref('')
    const showAttachMenu = ref(false)
    const textarea = ref(null)
    const fileInput = ref(null)
    const messagesContainer = ref(null)
    const attachMenuRef = ref(null)
    
    const contextOptions = [
      { type: 'page', name: 'Homepage', icon: '<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/>' },
      { type: 'feature', name: 'User Authentication', icon: '<path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/>' },
      { type: 'journey', name: 'Purchase Flow', icon: '<path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z"/>' }
    ]
    
    const showSendButton = computed(() => {
      return inputText.value.trim() || props.attachedContext.length > 0
    })
    
    const toggleAttachMenu = () => {
      showAttachMenu.value = !showAttachMenu.value
    }
    
    const handleInput = () => {
      if (textarea.value) {
        textarea.value.style.height = 'auto'
        textarea.value.style.height = Math.min(textarea.value.scrollHeight, 120) + 'px'
      }
    }
    
    const handleEnter = (event) => {
      if (!event.shiftKey) {
        sendMessage()
      }
    }
    
    const sendMessage = () => {
      const text = inputText.value.trim()
      if (!text && props.attachedContext.length === 0) return
      
      emit('send-message', {
        text,
        attachments: [...props.attachedContext]
      })
      
      inputText.value = ''
      nextTick(() => {
        if (textarea.value) {
          textarea.value.style.height = 'auto'
        }
      })
    }
    
    const uploadFiles = () => {
      showAttachMenu.value = false
      fileInput.value?.click()
    }
    
    const handleFileSelect = (event) => {
      const files = Array.from(event.target.files)
      files.forEach(file => {
        emit('attach-context', {
          type: 'file',
          name: file.name,
          file
        })
      })
      event.target.value = ''
    }
    
    const attachContext = (type, name) => {
      emit('attach-context', { type, name })
      showAttachMenu.value = false
    }
    
    const getContextIcon = (type) => {
      const icons = {
        page: '<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/>',
        feature: '<path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/>',
        journey: '<path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z"/>',
        file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/>'
      }
      return icons[type] || ''
    }
    
    // Auto scroll to bottom on new messages
    watch(() => props.messages.length, () => {
      nextTick(() => {
        if (messagesContainer.value) {
          messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
        }
      })
    })
    
    // Close attach menu when clicking outside
    const handleClickOutside = (event) => {
      if (attachMenuRef.value && !attachMenuRef.value.contains(event.target)) {
        showAttachMenu.value = false
      }
    }
    
    watch(showAttachMenu, (newVal) => {
      if (newVal) {
        document.addEventListener('click', handleClickOutside)
      } else {
        document.removeEventListener('click', handleClickOutside)
      }
    })
    
    return {
      inputText,
      showAttachMenu,
      textarea,
      fileInput,
      messagesContainer,
      attachMenuRef,
      contextOptions,
      showSendButton,
      toggleAttachMenu,
      handleInput,
      handleEnter,
      sendMessage,
      uploadFiles,
      handleFileSelect,
      attachContext,
      getContextIcon
    }
  }
}
</script>

<style scoped>
.chat-section {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.chat-header {
  padding: 1rem;
  border-bottom: 1px solid var(--border-primary);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.chat-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
}

.clear-btn {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  color: var(--text-secondary);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.clear-btn:hover {
  background: var(--bg-quaternary);
  color: var(--text-primary);
}

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
  gap: 0.5rem;
  max-width: 80%;
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
  background: var(--primary-500);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  flex-shrink: 0;
}

.message.user .message-avatar {
  background: var(--bg-quaternary);
}

.message-content {
  background: var(--bg-tertiary);
  padding: 0.75rem 1rem;
  border-radius: 18px;
  font-size: 0.9375rem;
  line-height: 1.4;
  word-wrap: break-word;
}

.message.user .message-content {
  background: var(--primary-500);
  color: white;
}

.message-attachments {
  margin-top: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.attachment-badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
}

.chat-input-area {
  padding: 1rem;
  border-top: 1px solid var(--border-primary);
  background: var(--bg-secondary);
}

.context-bar {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 0.75rem;
}

.context-item {
  background: var(--bg-quaternary);
  border: 1px solid var(--border-secondary);
  border-radius: 16px;
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
}

.context-item .remove-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0;
  width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.input-container {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 24px;
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  padding: 0.5rem;
  transition: border-color 0.2s ease;
  position: relative;
}

.input-container:focus-within {
  border-color: var(--primary-500);
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
}

.attach-btn:hover {
  background: var(--bg-quaternary);
}

.chat-input {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-size: 0.875rem;
  resize: none;
  min-height: 20px;
  max-height: 120px;
  padding: 0.5rem 0;
  line-height: 1.4;
  font-family: inherit;
  outline: none;
}

.chat-input::placeholder {
  color: var(--text-muted);
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
}

.send-btn:hover {
  background: var(--primary-600);
}

.send-btn:active {
  transform: scale(0.95);
}

.attachment-menu {
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  margin-bottom: 0.5rem;
  background: var(--bg-secondary);
  border-radius: 12px;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  max-height: 320px;
}

.attachment-menu-section {
  padding: 0.75rem 0;
}

.attachment-menu-title {
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.attachment-menu-item {
  padding: 0.75rem 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
  transition: all 0.2s ease;
}

.attachment-menu-item:hover {
  background: var(--bg-tertiary);
}

.attachment-divider {
  height: 1px;
  background: var(--border-primary);
}

.icon {
  width: 16px;
  height: 16px;
  stroke: currentColor;
  stroke-width: 2;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.menu-slide-enter-active,
.menu-slide-leave-active {
  transition: all 0.3s ease;
}

.menu-slide-enter-from,
.menu-slide-leave-to {
  transform: translateY(10px);
  opacity: 0;
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .chat-messages {
    padding: 0.75rem;
  }
  
  .message {
    max-width: 85%;
  }
  
  .chat-input-area {
    padding: 0.75rem;
  }
}
</style>