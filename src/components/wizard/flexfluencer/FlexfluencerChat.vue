<template>
  <div class="flexfluencer-chat">
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
          
          <!-- Text Input -->
          <div v-else-if="message.type === 'text-input'" class="input-section">
            <input 
              v-model="formData[message.field]" 
              :type="message.inputType || 'text'"
              :placeholder="message.placeholder"
              class="text-input"
              @keypress.enter="message.field && submitTextInput(message.field)"
            />
            <button 
              @click="message.field && submitTextInput(message.field)" 
              class="submit-button" 
              :disabled="!formData[message.field]"
            >
              Continue →
            </button>
          </div>
          
          <!-- Platform Selection -->
          <div v-else-if="message.type === 'platform-select'" class="platform-grid">
            <div 
              v-for="platform in platforms" 
              :key="platform.id"
              class="platform-card"
              :class="{ selected: selectedPlatforms.includes(platform.id) }"
              @click="togglePlatform(platform.id)"
            >
              <span class="platform-icon">{{ platform.icon }}</span>
              <span class="platform-name">{{ platform.name }}</span>
              <span v-if="selectedPlatforms.includes(platform.id)" class="check-icon">✓</span>
            </div>
            <button 
              @click="submitPlatforms" 
              class="submit-button"
              :disabled="selectedPlatforms.length === 0"
            >
              Continue →
            </button>
          </div>
          
          <!-- Audience Size -->
          <div v-else-if="message.type === 'audience-input'" class="audience-section">
            <div 
              v-for="platform in selectedPlatformDetails" 
              :key="platform"
              class="audience-input"
            >
              <label>{{ platform }} followers/subscribers:</label>
              <input 
                v-model.number="audienceData[platform]" 
                type="number"
                placeholder="e.g., 10000"
                class="text-input"
              />
            </div>
            <button 
              @click="submitAudience" 
              class="submit-button"
              :disabled="!isAudienceComplete"
            >
              Continue →
            </button>
          </div>
          
          <!-- Content Type -->
          <div v-else-if="message.type === 'content-type'" class="checkbox-group">
            <label 
              v-for="content in contentTypes" 
              :key="content.value"
              class="checkbox-label"
            >
              <input 
                type="checkbox" 
                :value="content.value"
                v-model="selectedContent"
              />
              <span class="checkbox-custom"></span>
              {{ content.label }}
            </label>
            <button 
              @click="submitContent" 
              class="submit-button"
              :disabled="selectedContent.length === 0"
            >
              Continue →
            </button>
          </div>
          
          <!-- Products Interest -->
          <div v-else-if="message.type === 'products-select'" class="products-section">
            <div class="products-grid">
              <div 
                v-for="product in products" 
                :key="product.id"
                class="product-card"
                :class="{ selected: selectedProducts.includes(product.id) }"
                @click="toggleProduct(product.id)"
              >
                <h4>{{ product.name }}</h4>
                <p>{{ product.description }}</p>
                <span class="commission">{{ product.commission }}% commission</span>
              </div>
            </div>
            <button 
              @click="submitProducts" 
              class="submit-button"
              :disabled="selectedProducts.length === 0"
            >
              Continue →
            </button>
          </div>
          
          <!-- Video Upload -->
          <div v-else-if="message.type === 'video-upload'" class="upload-section">
            <div class="upload-area" @click="fileInputRef?.click()" @drop.prevent="handleDrop" @dragover.prevent>
              <input 
                :ref="el => fileInputRef = el as HTMLInputElement"
                type="file" 
                accept="video/*"
                @change="handleFileSelect"
                style="display: none"
              />
              <div v-if="!uploadedVideo" class="upload-prompt">
                <span class="upload-icon">📹</span>
                <h4>Upload Your Introduction Video</h4>
                <p>Click to browse or drag and drop</p>
                <span class="file-info">MP4, MOV, or AVI (max 100MB)</span>
              </div>
              <div v-else class="upload-preview">
                <span class="file-icon">🎬</span>
                <h4>{{ uploadedVideo.name }}</h4>
                <p>{{ formatFileSize(uploadedVideo.size) }}</p>
                <button @click.stop="removeVideo" class="remove-btn">Remove</button>
              </div>
            </div>
            <button 
              @click="submitVideo" 
              class="submit-button"
              :disabled="!uploadedVideo"
            >
              Submit Application →
            </button>
          </div>
          
          <!-- Review Summary -->
          <div v-else-if="message.type === 'summary'" class="summary-section">
            <h3>Application Summary</h3>
            <div class="summary-item">
              <span class="label">Name:</span>
              <span class="value">{{ formData.name }}</span>
            </div>
            <div class="summary-item">
              <span class="label">Email:</span>
              <span class="value">{{ formData.email }}</span>
            </div>
            <div class="summary-item">
              <span class="label">Platforms:</span>
              <span class="value">{{ selectedPlatforms.join(', ') }}</span>
            </div>
            <div class="summary-item">
              <span class="label">Total Reach:</span>
              <span class="value">{{ totalReach.toLocaleString() }} followers</span>
            </div>
            <div class="summary-item">
              <span class="label">Content Types:</span>
              <span class="value">{{ selectedContent.join(', ') }}</span>
            </div>
            <div class="summary-item">
              <span class="label">Products:</span>
              <span class="value">{{ selectedProducts.join(', ') }}</span>
            </div>
            <button @click="finalSubmit" class="submit-button primary">
              Confirm & Submit →
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'

interface Message {
  sender: 'ai' | 'user'
  type: string
  content?: string
  field?: string
  inputType?: string
  placeholder?: string
}

const emit = defineEmits<{
  'phase-change': [phase: string]
  'progress-update': [progress: number]
}>()

// State
const messages = ref<Message[]>([])
const messagesContainer = ref<HTMLElement>()
const fileInputRef = ref<HTMLInputElement>()
const isTyping = ref(false)

// Form Data
const formData = ref({
  name: '',
  email: '',
  location: ''
})

const selectedPlatforms = ref<string[]>([])
const audienceData = ref<Record<string, number>>({})
const selectedContent = ref<string[]>([])
const selectedProducts = ref<string[]>([])
const uploadedVideo = ref<File | null>(null)

// Options
const platforms = [
  { id: 'youtube', name: 'YouTube', icon: '📺' },
  { id: 'tiktok', name: 'TikTok', icon: '🎵' },
  { id: 'instagram', name: 'Instagram', icon: '📷' },
  { id: 'twitter', name: 'Twitter/X', icon: '🐦' },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼' },
  { id: 'facebook', name: 'Facebook', icon: '👥' }
]

const contentTypes = [
  { value: 'tutorials', label: 'Tech Tutorials' },
  { value: 'reviews', label: 'Product Reviews' },
  { value: 'development', label: 'Development Content' },
  { value: 'business', label: 'Business & Entrepreneurship' },
  { value: 'design', label: 'Design & UX' },
  { value: 'education', label: 'Educational Content' }
]

const products = [
  { 
    id: 'flexos', 
    name: 'FlexOS Builder', 
    description: 'AI-powered app builder',
    commission: 30
  },
  { 
    id: 'academy', 
    name: 'Flexperts Academy', 
    description: '12-week training program',
    commission: 25
  },
  { 
    id: 'enterprise', 
    name: 'Enterprise Solutions', 
    description: 'Custom development services',
    commission: 20
  }
]

// Computed
const selectedPlatformDetails = computed(() => 
  selectedPlatforms.value.map(id => 
    platforms.find(p => p.id === id)?.name || id
  )
)

const isAudienceComplete = computed(() => 
  selectedPlatforms.value.every(platform => 
    audienceData.value[platforms.find(p => p.id === platform)?.name || ''] > 0
  )
)

const totalReach = computed(() => 
  Object.values(audienceData.value).reduce((sum, count) => sum + (count || 0), 0)
)

// Methods
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

const startConversation = async () => {
  await addMessage({
    sender: 'ai',
    type: 'text',
    content: `<h3>🎉 Welcome to the Flexfluencer Program!</h3>
    <p>I'm excited to learn about you and your content creation journey. As a Flexfluencer, you'll earn generous commissions while helping your audience discover amazing no-code tools.</p>
    <p>Let's start with some basic information.</p>`
  })
  
  await addMessage({
    sender: 'ai',
    type: 'text',
    content: '<strong>What\'s your name?</strong>'
  })
  
  await addMessage({
    sender: 'ai',
    type: 'text-input',
    field: 'name',
    placeholder: 'Enter your full name'
  })
}

const submitTextInput = async (field: string) => {
  const value = formData.value[field as keyof typeof formData.value]
  if (!value) return
  
  await addMessage({
    sender: 'user',
    type: 'text',
    content: value
  })
  
  emit('progress-update', 15)
  
  if (field === 'name') {
    await addMessage({
      sender: 'ai',
      type: 'text',
      content: `Nice to meet you, ${value}! 👋`
    })
    
    await addMessage({
      sender: 'ai',
      type: 'text',
      content: '<strong>What\'s your email address?</strong>'
    })
    
    await addMessage({
      sender: 'ai',
      type: 'text-input',
      field: 'email',
      inputType: 'email',
      placeholder: 'your@email.com'
    })
  } else if (field === 'email') {
    await askPlatforms()
  }
}

const askPlatforms = async () => {
  emit('progress-update', 30)
  emit('phase-change', 'platforms')
  
  await addMessage({
    sender: 'ai',
    type: 'text',
    content: '<strong>Which platforms do you create content on?</strong> Select all that apply.'
  })
  
  await addMessage({
    sender: 'ai',
    type: 'platform-select'
  })
}

const togglePlatform = (platformId: string) => {
  const index = selectedPlatforms.value.indexOf(platformId)
  if (index > -1) {
    selectedPlatforms.value.splice(index, 1)
  } else {
    selectedPlatforms.value.push(platformId)
  }
}

const submitPlatforms = async () => {
  await addMessage({
    sender: 'user',
    type: 'text',
    content: `Selected platforms: ${selectedPlatforms.value.join(', ')}`
  })
  
  emit('progress-update', 45)
  emit('phase-change', 'audience')
  
  await addMessage({
    sender: 'ai',
    type: 'text',
    content: '<strong>Great choices! Now let\'s talk about your audience size.</strong>'
  })
  
  await addMessage({
    sender: 'ai',
    type: 'audience-input'
  })
}

const submitAudience = async () => {
  const audienceText = Object.entries(audienceData.value)
    .map(([platform, count]) => `${platform}: ${count.toLocaleString()}`)
    .join(', ')
  
  await addMessage({
    sender: 'user',
    type: 'text',
    content: audienceText
  })
  
  emit('progress-update', 60)
  emit('phase-change', 'content')
  
  await addMessage({
    sender: 'ai',
    type: 'text',
    content: `<strong>Impressive reach of ${totalReach.value.toLocaleString()} total followers! 🚀</strong>`
  })
  
  await addMessage({
    sender: 'ai',
    type: 'text',
    content: '<strong>What type of content do you create?</strong> Select all that apply.'
  })
  
  await addMessage({
    sender: 'ai',
    type: 'content-type'
  })
}

const submitContent = async () => {
  await addMessage({
    sender: 'user',
    type: 'text',
    content: `Content types: ${selectedContent.value.join(', ')}`
  })
  
  emit('progress-update', 75)
  emit('phase-change', 'products')
  
  await addMessage({
    sender: 'ai',
    type: 'text',
    content: '<strong>Which Flexperts products would you like to promote?</strong>'
  })
  
  await addMessage({
    sender: 'ai',
    type: 'products-select'
  })
}

const toggleProduct = (productId: string) => {
  const index = selectedProducts.value.indexOf(productId)
  if (index > -1) {
    selectedProducts.value.splice(index, 1)
  } else {
    selectedProducts.value.push(productId)
  }
}

const submitProducts = async () => {
  await addMessage({
    sender: 'user',
    type: 'text',
    content: `Interested in promoting: ${selectedProducts.value.join(', ')}`
  })
  
  emit('progress-update', 90)
  emit('phase-change', 'video')
  
  await addMessage({
    sender: 'ai',
    type: 'text',
    content: '<strong>Almost done! 🎬</strong> Please upload a short video (1-3 minutes) introducing yourself and explaining why you\'d be a great Flexfluencer.'
  })
  
  await addMessage({
    sender: 'ai',
    type: 'video-upload'
  })
}

const handleFileSelect = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file && file.size <= 100 * 1024 * 1024) { // 100MB limit
    uploadedVideo.value = file
  } else {
    alert('Please select a video file under 100MB')
  }
}

const handleDrop = (event: DragEvent) => {
  const file = event.dataTransfer?.files[0]
  if (file && file.type.startsWith('video/') && file.size <= 100 * 1024 * 1024) {
    uploadedVideo.value = file
  }
}

const removeVideo = () => {
  uploadedVideo.value = null
}

const formatFileSize = (bytes: number) => {
  const mb = bytes / (1024 * 1024)
  return `${mb.toFixed(1)} MB`
}

const submitVideo = async () => {
  await addMessage({
    sender: 'user',
    type: 'text',
    content: `Uploaded video: ${uploadedVideo.value?.name}`
  })
  
  emit('progress-update', 95)
  emit('phase-change', 'review')
  
  await addMessage({
    sender: 'ai',
    type: 'text',
    content: '<strong>Perfect! Let\'s review your application before submitting.</strong>'
  })
  
  await addMessage({
    sender: 'ai',
    type: 'summary'
  })
}

const finalSubmit = async () => {
  emit('progress-update', 100)
  emit('phase-change', 'complete')
  
  await addMessage({
    sender: 'ai',
    type: 'text',
    content: `<h3>🎉 Application Submitted Successfully!</h3>
    <p>Thank you for applying to become a Flexfluencer, ${formData.value.name}!</p>
    <p>We'll review your application and get back to you within 48 hours at ${formData.value.email}.</p>
    <p>In the meantime, feel free to explore our products and start planning your content strategy!</p>`
  })
}

// Initialize
onMounted(() => {
  startConversation()
})
</script>

<style scoped>
.flexfluencer-chat {
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

/* Input Sections */
.input-section,
.audience-section,
.upload-section {
  margin-top: 0.5rem;
}

.text-input {
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--bg-secondary);
  border: 2px solid var(--border-primary);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.2s;
  margin-bottom: 1rem;
}

.text-input:focus {
  outline: none;
  border-color: var(--primary-500);
}

/* Platform Selection */
.platform-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin: 0.5rem 0 1rem;
}

.platform-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: var(--bg-quaternary);
  border: 2px solid var(--border-primary);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.platform-card:hover {
  border-color: var(--border-secondary);
  transform: translateY(-2px);
}

.platform-card.selected {
  border-color: var(--primary-500);
  background: rgba(22, 193, 129, 0.1);
}

.platform-icon {
  font-size: 2rem;
}

.platform-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}

.check-icon {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: var(--primary-500);
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
}

/* Audience Input */
.audience-input {
  margin-bottom: 1rem;
}

.audience-input label {
  display: block;
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

/* Content Type Checkboxes */
.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin: 0.5rem 0 1rem;
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

/* Products Selection */
.products-grid {
  display: grid;
  gap: 1rem;
  margin: 0.5rem 0 1rem;
}

.product-card {
  padding: 1rem;
  background: var(--bg-quaternary);
  border: 2px solid var(--border-primary);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.product-card:hover {
  border-color: var(--border-secondary);
}

.product-card.selected {
  border-color: var(--primary-500);
  background: rgba(22, 193, 129, 0.05);
}

.product-card h4 {
  font-size: 1rem;
  margin-bottom: 0.25rem;
  color: var(--text-primary);
}

.product-card p {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.commission {
  display: inline-block;
  background: var(--primary-100);
  color: var(--primary-600);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

/* Video Upload */
.upload-area {
  background: var(--bg-quaternary);
  border: 2px dashed var(--border-primary);
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 1rem;
}

.upload-area:hover {
  border-color: var(--primary-500);
  background: rgba(22, 193, 129, 0.05);
}

.upload-icon,
.file-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
}

.upload-prompt h4,
.upload-preview h4 {
  font-size: 1.125rem;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.upload-prompt p,
.upload-preview p {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.file-info {
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.remove-btn {
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--red-500);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.remove-btn:hover {
  background: var(--red-600);
}

/* Summary Section */
.summary-section {
  background: var(--bg-quaternary);
  border-radius: 8px;
  padding: 1.5rem;
  margin-top: 0.5rem;
}

.summary-section h3 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.summary-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border-primary);
}

.summary-item:last-of-type {
  border-bottom: none;
  margin-bottom: 1rem;
}

.summary-item .label {
  font-weight: 600;
  color: var(--text-secondary);
}

.summary-item .value {
  color: var(--text-primary);
}

/* Submit Button */
.submit-button {
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

.submit-button.primary {
  width: 100%;
  font-size: 1rem;
  padding: 1rem 2rem;
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

/* Mobile Responsive */
@media (max-width: 768px) {
  .chat-messages {
    padding: 1rem;
  }
  
  .message-content {
    max-width: 90%;
  }
  
  .platform-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>