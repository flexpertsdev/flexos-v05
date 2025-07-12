<template>
  <div class="refresh-chat">
    <div class="chat-messages" ref="messagesContainer">
      <div 
        v-for="(message, index) in messages" 
        :key="index"
        class="message"
        :class="message.sender"
      >
        <div v-if="message.sender === 'ai'" class="message-avatar">
          <img src="~/assets/images/flexi-superhero.png" alt="Flexi" />
        </div>
        
        <div class="message-content">
          <div v-if="message.type === 'text'" v-html="message.content"></div>
          
          <!-- URL Input -->
          <div v-else-if="message.type === 'url-input'" class="url-input-section">
            <input 
              v-model="websiteUrl" 
              type="url" 
              placeholder="https://example.com"
              class="url-input"
              @keypress.enter="submitUrl"
            />
            <button @click="submitUrl" class="submit-button" :disabled="!websiteUrl">
              Analyze Website →
            </button>
          </div>
          
          <!-- Compliance Report -->
          <div v-else-if="message.type === 'compliance-report'" class="compliance-report">
            <div class="report-header">
              <h3>EAA Compliance Report</h3>
              <div class="compliance-status" :class="message.data.compliant ? 'compliant' : 'non-compliant'">
                {{ message.data.compliant ? '✓ Compliant' : '✗ Non-Compliant' }}
              </div>
            </div>
            
            <div class="compliance-stats">
              <div class="stat">
                <span class="stat-label">Violations</span>
                <span class="stat-value violations">{{ message.data.violations }}</span>
              </div>
              <div class="stat">
                <span class="stat-label">Warnings</span>
                <span class="stat-value warnings">{{ message.data.warnings }}</span>
              </div>
              <div class="stat">
                <span class="stat-label">Passed</span>
                <span class="stat-value passed">{{ message.data.passed }}</span>
              </div>
              <div class="stat">
                <span class="stat-label">Score</span>
                <span class="stat-value">{{ message.data.score }}/100</span>
              </div>
            </div>
            
            <div class="deadline-warning">
              <span class="warning-icon">⚠️</span>
              <div>
                <strong>EU Deadline: June 28, 2025</strong>
                <p>Non-compliance can result in fines up to €1,000,000</p>
              </div>
            </div>
          </div>
          
          <!-- Checkboxes -->
          <div v-else-if="message.type === 'checkboxes'" class="checkbox-group">
            <label 
              v-for="option in message.options" 
              :key="option.value"
              class="checkbox-label"
            >
              <input 
                type="checkbox" 
                :value="option.value"
                v-model="selectedOptions[message.id!]"
              />
              <span class="checkbox-custom"></span>
              {{ option.label }}
            </label>
            <button 
              @click="message.id && submitCheckboxes(message.id)" 
              class="submit-button"
              :disabled="!message.id || !selectedOptions[message.id]?.length"
            >
              Continue →
            </button>
          </div>
          
          <!-- Radio Options -->
          <div v-else-if="message.type === 'radio'" class="radio-group">
            <label 
              v-for="option in message.options" 
              :key="option.value"
              class="radio-label"
              :class="{ 'recommended': option.recommended }"
            >
              <input 
                type="radio" 
                :value="option.value"
                v-model="selectedRadio[message.id!]"
              />
              <span class="radio-custom"></span>
              <div class="radio-content">
                <span class="radio-title">{{ option.label }}</span>
                <span v-if="option.description" class="radio-description">{{ option.description }}</span>
                <span v-if="option.recommended" class="recommended-badge">Recommended</span>
              </div>
            </label>
            <button 
              @click="message.id && submitRadio(message.id)" 
              class="submit-button"
              :disabled="!message.id || !selectedRadio[message.id]"
            >
              Continue →
            </button>
          </div>
          
          <!-- Style Examples -->
          <div v-else-if="message.type === 'style-examples'" class="style-examples">
            <div class="style-grid">
              <div 
                v-for="style in message.styles" 
                :key="style.id"
                class="style-card"
                :class="{ selected: selectedStyle === style.id }"
                @click="selectStyle(style.id)"
              >
                <div class="style-preview">{{ style.preview }}</div>
                <h4>{{ style.name }}</h4>
                <p>{{ style.description }}</p>
              </div>
            </div>
            <button 
              @click="submitStyle" 
              class="submit-button"
              :disabled="!selectedStyle"
            >
              Apply This Style →
            </button>
          </div>
        </div>
      </div>
      
      <!-- Typing Indicator -->
      <div v-if="isTyping" class="message ai">
        <div class="message-avatar">
          <img src="~/assets/images/flexi-superhero.png" alt="Flexi" />
        </div>
        <div class="message-content">
          <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Quick Actions -->
    <div v-if="showQuickActions" class="quick-actions">
      <button 
        v-for="action in quickActions" 
        :key="action.text"
        @click="selectQuickAction(action)"
        class="quick-action"
      >
        {{ action.text }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'

interface Message {
  sender: 'ai' | 'user'
  type: 'text' | 'url-input' | 'compliance-report' | 'checkboxes' | 'radio' | 'style-examples'
  content?: string
  options?: any[]
  data?: any
  id?: string
  styles?: any[]
}

const emit = defineEmits<{
  'phase-change': [phase: string]
  'progress-update': [progress: number]
}>()

const messages = ref<Message[]>([])
const messagesContainer = ref<HTMLElement>()
const isTyping = ref(false)
const websiteUrl = ref('')
const selectedOptions = ref<Record<string, string[]>>({})
const selectedRadio = ref<Record<string, string>>({})
const selectedStyle = ref('')
const showQuickActions = ref(false)
const quickActions = ref<any[]>([])
const currentPhase = ref('intro')

// Initialize conversation
onMounted(() => {
  startConversation()
})

const startConversation = async () => {
  await addMessage({
    sender: 'ai',
    type: 'text',
    content: `<h3>🔄 Let's Modernize Your Website!</h3>
    <p>I'll help you refresh your website with a modern design and ensure it meets the new <strong>European Accessibility Act requirements</strong> that come into force June 28, 2025.</p>
    <p>Let's start by analyzing what you have now.</p>`
  })
  
  await addMessage({
    sender: 'ai',
    type: 'text',
    content: '<strong>What\'s your current website URL?</strong>'
  })
  
  await addMessage({
    sender: 'ai',
    type: 'url-input'
  })
}

const submitUrl = async () => {
  if (!websiteUrl.value) return
  
  await addMessage({
    sender: 'user',
    type: 'text',
    content: websiteUrl.value
  })
  
  isTyping.value = true
  emit('phase-change', 'analyzing')
  emit('progress-update', 20)
  
  // Simulate analysis
  setTimeout(async () => {
    isTyping.value = false
    
    await addMessage({
      sender: 'ai',
      type: 'text',
      content: `<p>Analyzing <strong>${websiteUrl.value}</strong>...</p>`
    })
    
    await addMessage({
      sender: 'ai',
      type: 'compliance-report',
      data: {
        compliant: false,
        violations: 23,
        warnings: 15,
        passed: 112,
        score: 62
      }
    })
    
    await addMessage({
      sender: 'ai',
      type: 'text',
      content: '<strong>What do you like about your current website?</strong>'
    })
    
    await addMessage({
      sender: 'ai',
      type: 'checkboxes',
      id: 'likes',
      options: [
        { value: 'content', label: 'The content/messaging' },
        { value: 'colors', label: 'The color scheme' },
        { value: 'layout', label: 'The layout/structure' },
        { value: 'features', label: 'The features/functionality' },
        { value: 'images', label: 'The images/media' }
      ]
    })
  }, 2000)
}

const submitCheckboxes = async (id: string) => {
  const selected = selectedOptions.value[id] || []
  
  await addMessage({
    sender: 'user',
    type: 'text',
    content: selected.map(s => `✓ ${s}`).join('<br>')
  })
  
  if (id === 'likes') {
    await askImprovements()
  } else if (id === 'improvements') {
    await askGoal()
  }
}

const askImprovements = async () => {
  await addMessage({
    sender: 'ai',
    type: 'text',
    content: '<strong>What needs improvement?</strong>'
  })
  
  await addMessage({
    sender: 'ai',
    type: 'checkboxes',
    id: 'improvements',
    options: [
      { value: 'outdated', label: 'Looks outdated' },
      { value: 'mobile', label: 'Not mobile-friendly' },
      { value: 'slow', label: 'Slow loading' },
      { value: 'navigation', label: 'Hard to navigate' },
      { value: 'conversion', label: "Doesn't convert visitors" },
      { value: 'features', label: 'Missing modern features' }
    ]
  })
}

const askGoal = async () => {
  emit('phase-change', 'planning')
  emit('progress-update', 40)
  
  await addMessage({
    sender: 'ai',
    type: 'text',
    content: '<strong>What\'s your primary goal for this refresh?</strong>'
  })
  
  await addMessage({
    sender: 'ai',
    type: 'radio',
    id: 'goal',
    options: [
      { 
        value: 'compliance', 
        label: 'EAA Compliance Focus',
        description: 'Fix accessibility issues first',
        recommended: true
      },
      { 
        value: 'redesign', 
        label: 'Complete Redesign',
        description: 'New look with built-in accessibility'
      },
      { 
        value: 'quick', 
        label: 'Quick Compliance',
        description: 'Minimal changes to meet EAA requirements'
      },
      { 
        value: 'future', 
        label: 'Future-Proof Update',
        description: 'Full modernization and compliance'
      }
    ]
  })
}

const submitRadio = async (id: string) => {
  const selected = selectedRadio.value[id]
  
  await addMessage({
    sender: 'user',
    type: 'text',
    content: selected
  })
  
  if (id === 'goal') {
    await askStyle()
  }
}

const askStyle = async () => {
  emit('phase-change', 'design')
  emit('progress-update', 60)
  
  await addMessage({
    sender: 'ai',
    type: 'text',
    content: '<strong>What style direction appeals to you?</strong>'
  })
  
  await addMessage({
    sender: 'ai',
    type: 'style-examples',
    styles: [
      { 
        id: 'minimal',
        name: 'Modern & Minimalist',
        description: 'Clean, lots of white space',
        preview: '□ □ □'
      },
      { 
        id: 'bold',
        name: 'Bold & Vibrant',
        description: 'Strong colors, dynamic',
        preview: '■ ■ ■'
      },
      { 
        id: 'professional',
        name: 'Professional & Trustworthy',
        description: 'Corporate, serious',
        preview: '▭ ▭ ▭'
      },
      { 
        id: 'warm',
        name: 'Warm & Friendly',
        description: 'Approachable, casual',
        preview: '◯ ◯ ◯'
      },
      { 
        id: 'creative',
        name: 'Creative & Unique',
        description: 'Artistic, distinctive',
        preview: '◢ ◣ ◤'
      },
      { 
        id: 'tech',
        name: 'Tech & Innovative',
        description: 'Futuristic, cutting-edge',
        preview: '⬡ ⬡ ⬡'
      }
    ]
  })
}

const selectStyle = (styleId: string) => {
  selectedStyle.value = styleId
}

const submitStyle = async () => {
  await addMessage({
    sender: 'user',
    type: 'text',
    content: `Selected style: ${selectedStyle.value}`
  })
  
  emit('phase-change', 'generating')
  emit('progress-update', 80)
  
  await addMessage({
    sender: 'ai',
    type: 'text',
    content: `<h3>🎨 Perfect Choice!</h3>
    <p>I'm now creating your refreshed website with:</p>
    <ul>
      <li>✓ ${selectedStyle.value} design style</li>
      <li>✓ Full EAA/WCAG 2.2 AA compliance</li>
      <li>✓ Mobile-first responsive design</li>
      <li>✓ Modern performance optimizations</li>
      <li>✓ Your existing content preserved</li>
    </ul>
    <p><strong>Generating your new website...</strong></p>`
  })
  
  setTimeout(() => {
    emit('phase-change', 'complete')
    emit('progress-update', 100)
  }, 3000)
}

const selectQuickAction = (action: any) => {
  // Handle quick action selection
}

const addMessage = async (message: Message) => {
  messages.value.push(message)
  await nextTick()
  scrollToBottom()
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// Watch for phase changes
watch(currentPhase, (phase) => {
  emit('phase-change', phase)
})
</script>

<style scoped>
.refresh-chat {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--bg-secondary);
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  scroll-behavior: smooth;
}

.message {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  animation: fadeInUp 0.3s ease-out;
}

.message.user {
  justify-content: flex-end;
}

.message.user .message-content {
  background: var(--primary-500);
  color: white;
  border-radius: 18px 18px 4px 18px;
  padding: 0.75rem 1.25rem;
  max-width: 70%;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  background: var(--bg-tertiary);
}

.message-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.message-content {
  background: var(--bg-tertiary);
  border-radius: 4px 18px 18px 18px;
  padding: 1rem 1.25rem;
  max-width: 80%;
}

/* URL Input */
.url-input-section {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.url-input {
  flex: 1;
  padding: 0.75rem 1rem;
  background: var(--bg-secondary);
  border: 2px solid var(--border-primary);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.2s;
}

.url-input:focus {
  outline: none;
  border-color: var(--primary-500);
}

/* Compliance Report */
.compliance-report {
  background: var(--bg-quaternary);
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 0.5rem;
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.report-header h3 {
  margin: 0;
  font-size: 1.125rem;
}

.compliance-status {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

.compliance-status.compliant {
  background: rgba(34, 197, 94, 0.1);
  color: var(--green-500);
}

.compliance-status.non-compliant {
  background: rgba(239, 68, 68, 0.1);
  color: var(--red-500);
}

.compliance-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
}

.stat {
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 0.75rem;
  color: var(--text-tertiary);
  margin-bottom: 0.25rem;
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-value.violations {
  color: var(--red-500);
}

.stat-value.warnings {
  color: var(--amber-500);
}

.stat-value.passed {
  color: var(--green-500);
}

.deadline-warning {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-radius: 8px;
  padding: 1rem;
}

.warning-icon {
  font-size: 1.5rem;
}

.deadline-warning strong {
  display: block;
  margin-bottom: 0.25rem;
  color: var(--amber-500);
}

.deadline-warning p {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

/* Checkboxes */
.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background 0.2s;
}

.checkbox-label:hover {
  background: var(--bg-quaternary);
}

.checkbox-custom {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-secondary);
  border-radius: 4px;
  position: relative;
  transition: all 0.2s;
}

input[type="checkbox"] {
  display: none;
}

input[type="checkbox"]:checked + .checkbox-custom {
  background: var(--primary-500);
  border-color: var(--primary-500);
}

input[type="checkbox"]:checked + .checkbox-custom::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 14px;
}

/* Radio Options */
.radio-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.radio-label {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
  padding: 1rem;
  border: 2px solid var(--border-primary);
  border-radius: 8px;
  transition: all 0.2s;
}

.radio-label:hover {
  border-color: var(--border-secondary);
  background: var(--bg-quaternary);
}

.radio-label.recommended {
  border-color: var(--primary-200);
  background: rgba(22, 193, 129, 0.05);
}

input[type="radio"] {
  display: none;
}

.radio-custom {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-secondary);
  border-radius: 50%;
  position: relative;
  transition: all 0.2s;
  flex-shrink: 0;
  margin-top: 2px;
}

input[type="radio"]:checked + .radio-custom {
  border-color: var(--primary-500);
}

input[type="radio"]:checked + .radio-custom::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 10px;
  height: 10px;
  background: var(--primary-500);
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.radio-content {
  flex: 1;
}

.radio-title {
  display: block;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.radio-description {
  display: block;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.recommended-badge {
  display: inline-block;
  background: var(--primary-500);
  color: white;
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
  border-radius: 12px;
  margin-top: 0.5rem;
}

/* Style Examples */
.style-examples {
  margin-top: 0.5rem;
}

.style-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
}

.style-card {
  background: var(--bg-quaternary);
  border: 2px solid var(--border-primary);
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.style-card:hover {
  border-color: var(--border-secondary);
  transform: translateY(-2px);
}

.style-card.selected {
  border-color: var(--primary-500);
  background: rgba(22, 193, 129, 0.05);
}

.style-preview {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.style-card h4 {
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
  color: var(--text-primary);
}

.style-card p {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin: 0;
}

/* Submit Button */
.submit-button {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: var(--primary-500);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.submit-button:hover:not(:disabled) {
  background: var(--primary-600);
  transform: translateY(-1px);
}

.submit-button:disabled {
  background: var(--bg-quaternary);
  color: var(--text-muted);
  cursor: not-allowed;
}

/* Typing Indicator */
.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 0.5rem 0;
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
    opacity: 0.3;
    transform: translateY(0);
  }
  30% {
    opacity: 1;
    transform: translateY(-10px);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Quick Actions */
.quick-actions {
  padding: 1rem;
  border-top: 1px solid var(--border-primary);
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.quick-action {
  padding: 0.5rem 1rem;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 20px;
  color: var(--text-primary);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.quick-action:hover {
  background: var(--bg-quaternary);
  border-color: var(--primary-500);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .chat-messages {
    padding: 1rem;
  }
  
  .message-content {
    max-width: 90%;
  }
  
  .compliance-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .style-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .url-input-section {
    flex-direction: column;
  }
}
</style>