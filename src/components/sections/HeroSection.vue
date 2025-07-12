<template>
  <section class="hero">
    <div class="hero-content">
      <!-- Flexi Avatar -->
      <div class="flexi-container">
        <img 
          src="~/assets/images/flexi-superhero.png" 
          alt="Flexi - Your AI Building Companion" 
          class="flexi-avatar"
          :class="{
            'flexi-typing': userIsTyping,
            'flexi-thinking': isProcessing,
            'flexi-success': showSuccess
          }"
        />
      </div>

      <!-- Main Content -->
      <div class="hero-main">
        <h1 class="hero-title">
          Build your <span class="typing-text">{{ currentProjectType }}</span>
        </h1>
        
        <p class="hero-tagline">
          Just tell Flexi what you want to create<br>
          No code. No experience. Just ideas.
        </p>

        <!-- Main Input Field -->
        <div class="main-input-container" :class="{ 'input-active': inputFocused }">
          <input
            ref="mainInput"
            v-model="userInput"
            @focus="inputFocused = true"
            @blur="inputFocused = false"
            @input="handleUserTyping"
            @keypress.enter="startBuilding"
            type="text"
            class="main-input"
            placeholder="Hi! I'm Flexi 👋 Tell me what you want to build..."
          />
          <div class="input-glow"></div>
        </div>

        <!-- Quick Start Pills -->
        <div class="quick-starts">
          <button 
            v-for="quick in quickStarts" 
            :key="quick.text"
            @click="selectQuickStart(quick.text)"
            class="quick-start-pill"
          >
            {{ quick.icon }} {{ quick.text }}
          </button>
        </div>
      </div>

      <!-- Chat Interface (Shows after first input) -->
      <transition name="slide-up">
        <div v-if="showChat" class="flexi-chat">
          <div class="chat-messages" ref="chatMessages">
            <div v-for="(msg, index) in flexiMessages" :key="index" class="flexi-message">
              <div v-if="msg.type === 'flexi'" class="flexi-bubble">
                💬 Flexi: {{ msg.content }}
              </div>
              <div v-else class="user-bubble">
                {{ msg.content }}
              </div>
            </div>
            
            <div v-if="isProcessing" class="flexi-message">
              <div class="flexi-bubble">
                <div class="typing-indicator">
                  <div class="typing-dot"></div>
                  <div class="typing-dot"></div>
                  <div class="typing-dot"></div>
                </div>
              </div>
            </div>

            <div v-if="showProgress" class="progress-container">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: buildProgress + '%' }"></div>
              </div>
              <p class="progress-text">🚀 Building your project... {{ buildProgress }}%</p>
            </div>
          </div>

          <div v-if="needsHelp" class="help-prompt">
            <p>😟 Need human help? Our Flexperts are here!</p>
            <button class="expert-help-btn" @click="connectToExpert">
              Connect with Expert
            </button>
          </div>

          <div v-if="showChatInput" class="chat-input-container">
            <input
              v-model="chatInput"
              @keypress.enter="sendChatMessage"
              type="text"
              class="chat-input"
              placeholder="Your response..."
            />
          </div>
        </div>
      </transition>

      <!-- Trust Builders -->
      <div class="trust-builders">
        <div class="trust-item">
          <span class="trust-icon">✨</span>
          <span class="trust-text">{{ projectsBuilt.toLocaleString() }} projects built this week</span>
        </div>
        <div class="trust-item">
          <span class="trust-icon">🏗️</span>
          <span class="trust-text">No code required</span>
        </div>
        <div class="trust-item">
          <span class="trust-icon">👥</span>
          <span class="trust-text">Expert help available</span>
        </div>
        <div class="trust-item">
          <span class="trust-icon">🚀</span>
          <span class="trust-text">Deploy instantly</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from 'vue'

interface FlexiMessage {
  type: 'flexi' | 'user'
  content: string
}

// Flexi Hero State
const userInput = ref('')
const chatInput = ref('')
const inputFocused = ref(false)
const userIsTyping = ref(false)
const isProcessing = ref(false)
const showSuccess = ref(false)
const showChat = ref(false)
const showChatInput = ref(false)
const showProgress = ref(false)
const buildProgress = ref(0)
const needsHelp = ref(false)
const projectsBuilt = ref(12847)
const currentProjectType = ref('website')
const flexiMessages = ref<FlexiMessage[]>([])
const mainInput = ref<HTMLInputElement>()
const chatMessages = ref<HTMLElement>()

// Project types for typing animation
const projectTypes = ['website', 'app', 'store', 'dashboard', 'portfolio', 'blog']
let typeIndex = 0
let typeInterval: NodeJS.Timeout

// Quick starts
const quickStarts = ref([
  { icon: '🛍️', text: 'Online store' },
  { icon: '📱', text: 'Mobile app' },
  { icon: '📊', text: 'Dashboard' },
  { icon: '🎯', text: 'Landing page' }
])

// Flexi Methods
const handleUserTyping = () => {
  userIsTyping.value = true
  clearTimeout(typingTimeout)
  typingTimeout = setTimeout(() => {
    userIsTyping.value = false
  }, 500)
}

let typingTimeout: NodeJS.Timeout

const selectQuickStart = (projectType: string) => {
  userInput.value = `I want to build an ${projectType}`
  startBuilding()
}

const startBuilding = async () => {
  const input = userInput.value.trim()
  if (!input) return

  // Show chat and add user message
  showChat.value = true
  flexiMessages.value.push({ type: 'user', content: input })
  userInput.value = ''
  
  // Flexi starts thinking
  isProcessing.value = true
  userIsTyping.value = false
  
  await nextTick()
  scrollToBottom()

  // Simulate Flexi response
  setTimeout(() => {
    isProcessing.value = false
    
    if (input.toLowerCase().includes('store') || input.toLowerCase().includes('e-commerce')) {
      flexiMessages.value.push({
        type: 'flexi',
        content: "Great idea! I'll help you build that e-commerce site. First, what will you be selling?"
      })
      showChatInput.value = true
    } else if (input.toLowerCase().includes('app')) {
      flexiMessages.value.push({
        type: 'flexi',
        content: "Awesome! A mobile app it is. Will this be for iOS, Android, or both?"
      })
      showChatInput.value = true
    } else if (input.toLowerCase().includes('dashboard')) {
      flexiMessages.value.push({
        type: 'flexi',
        content: "Perfect! I love building dashboards. What kind of data will you be visualizing?"
      })
      showChatInput.value = true
    } else {
      flexiMessages.value.push({
        type: 'flexi',
        content: `Excellent choice! Let me start building your ${currentProjectType.value}. I'll need to know a bit more about your vision.`
      })
      showChatInput.value = true
    }
    
    scrollToBottom()
  }, 1500)
}

const sendChatMessage = async () => {
  const message = chatInput.value.trim()
  if (!message) return

  flexiMessages.value.push({ type: 'user', content: message })
  chatInput.value = ''
  showChatInput.value = false
  isProcessing.value = true
  
  await nextTick()
  scrollToBottom()

  // Simulate building process
  setTimeout(() => {
    isProcessing.value = false
    flexiMessages.value.push({
      type: 'flexi',
      content: "Perfect! I have everything I need. Let me start building your project now..."
    })
    
    // Show progress
    setTimeout(() => {
      showProgress.value = true
      simulateBuildProgress()
    }, 1000)
    
    scrollToBottom()
  }, 2000)
}

const simulateBuildProgress = () => {
  const interval = setInterval(() => {
    buildProgress.value += 5
    if (buildProgress.value >= 100) {
      clearInterval(interval)
      showProgress.value = false
      showSuccess.value = true
      
      setTimeout(() => {
        showSuccess.value = false
        // Here you would typically redirect to signup or next step
        alert('🎉 Your project is ready! Sign up to deploy it instantly.')
      }, 2000)
    }
  }, 200)
}

const connectToExpert = () => {
  window.location.href = '#experts'
}

const scrollToBottom = () => {
  if (chatMessages.value) {
    chatMessages.value.scrollTop = chatMessages.value.scrollHeight
  }
}

// Lifecycle
onMounted(() => {
  // Start typing animation
  typeInterval = setInterval(() => {
    typeIndex = (typeIndex + 1) % projectTypes.length
    currentProjectType.value = projectTypes[typeIndex]
  }, 2000)

  // Animate project counter
  const interval = setInterval(() => {
    projectsBuilt.value += Math.floor(Math.random() * 5) + 1
  }, 3000)
})

onUnmounted(() => {
  clearInterval(typeInterval)
})
</script>

<style scoped>
/* Hero Section */
.hero {
  padding-top: calc(var(--safe-area-top) + 100px);
  padding-bottom: 4rem;
  position: relative;
  min-height: 90vh;
  display: flex;
  align-items: center;
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  width: 100%;
  text-align: center;
}

/* Flexi Avatar */
.flexi-container {
  margin-bottom: 2rem;
  position: relative;
  height: 280px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.flexi-avatar {
  width: 280px;
  height: 280px;
  object-fit: contain;
  animation: float 6s ease-in-out infinite;
  filter: drop-shadow(0 20px 40px rgba(22, 193, 129, 0.3));
  transition: all 0.3s ease;
}

.flexi-avatar.flexi-typing {
  animation: float 6s ease-in-out infinite, lookDown 0.5s ease forwards;
}

.flexi-avatar.flexi-thinking {
  animation: float 6s ease-in-out infinite, thinking 2s ease-in-out infinite;
}

.flexi-avatar.flexi-success {
  animation: victoryPose 1s ease forwards;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-10px) rotate(-2deg); }
  75% { transform: translateY(10px) rotate(2deg); }
}

@keyframes lookDown {
  0% { transform: translateY(0) rotate(0deg); }
  100% { transform: translateY(5px) rotate(5deg); }
}

@keyframes thinking {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-5px) scale(1.05); }
}

@keyframes victoryPose {
  0% { transform: translateY(0) rotate(0deg) scale(1); }
  50% { transform: translateY(-30px) rotate(-10deg) scale(1.1); }
  100% { transform: translateY(-20px) rotate(5deg) scale(1.05); }
}

/* Hero Main Content */
.hero-main {
  animation: fadeInUp 0.8s ease-out 0.3s both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.typing-text {
  background: linear-gradient(135deg, var(--primary-400) 0%, var(--teal-400) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
  min-width: 200px;
  text-align: left;
}

.hero-tagline {
  font-size: 1.25rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 2.5rem;
}

/* Main Input */
.main-input-container {
  max-width: 600px;
  margin: 0 auto 2rem;
  position: relative;
  transition: all 0.3s ease;
}

.main-input {
  width: 100%;
  padding: 1.5rem 2rem;
  font-size: 1.125rem;
  background: var(--bg-secondary);
  border: 2px solid var(--border-primary);
  border-radius: 16px;
  color: var(--text-primary);
  transition: all 0.3s ease;
  outline: none;
}

.main-input:focus {
  border-color: var(--primary-500);
  background: var(--bg-tertiary);
}

.main-input::placeholder {
  color: var(--text-tertiary);
}

.input-glow {
  position: absolute;
  inset: -2px;
  background: linear-gradient(135deg, var(--primary-500), var(--teal-400));
  border-radius: 18px;
  opacity: 0;
  filter: blur(10px);
  transition: opacity 0.3s ease;
  z-index: -1;
}

.input-active .input-glow {
  opacity: 0.3;
}

/* Quick Start Pills */
.quick-starts {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 3rem;
}

.quick-start-pill {
  padding: 0.75rem 1.5rem;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 30px;
  color: var(--text-primary);
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  outline: none;
}

.quick-start-pill:hover {
  background: var(--bg-quaternary);
  border-color: var(--primary-500);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(22, 193, 129, 0.2);
}

/* Trust Builders */
.trust-builders {
  display: flex;
  justify-content: center;
  gap: 3rem;
  flex-wrap: wrap;
  opacity: 0.8;
}

.trust-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.trust-icon {
  font-size: 1.125rem;
}

/* Flexi Chat */
.flexi-chat {
  max-width: 700px;
  margin: 0 auto 3rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.chat-messages {
  max-height: 400px;
  overflow-y: auto;
  padding: 2rem;
}

.flexi-message {
  margin-bottom: 1.5rem;
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

.flexi-bubble {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 16px;
  padding: 1rem 1.5rem;
  max-width: 80%;
  margin-right: auto;
  font-size: 0.95rem;
  line-height: 1.5;
}

.user-bubble {
  background: rgba(22, 193, 129, 0.1);
  border: 1px solid rgba(22, 193, 129, 0.3);
  border-radius: 16px;
  padding: 1rem 1.5rem;
  max-width: 80%;
  margin-left: auto;
  font-size: 0.95rem;
  line-height: 1.5;
  text-align: right;
}

.typing-indicator {
  display: flex;
  gap: 0.3rem;
  padding: 0.75rem 1rem;
}

.typing-dot {
  width: 6px;
  height: 6px;
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

/* Progress Bar */
.progress-container {
  margin-top: 2rem;
  text-align: center;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: var(--bg-quaternary);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-500), var(--teal-400));
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

/* Help Prompt */
.help-prompt {
  background: var(--bg-tertiary);
  border-top: 1px solid var(--border-primary);
  padding: 1.5rem 2rem;
  text-align: center;
}

.help-prompt p {
  margin-bottom: 1rem;
  color: var(--text-secondary);
}

.expert-help-btn {
  padding: 0.75rem 2rem;
  background: transparent;
  border: 2px solid var(--primary-500);
  border-radius: 8px;
  color: var(--primary-500);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.expert-help-btn:hover {
  background: var(--primary-500);
  color: white;
  transform: translateY(-2px);
}

/* Chat Input Container */
.chat-input-container {
  border-top: 1px solid var(--border-primary);
  padding: 1.5rem 2rem;
}

.chat-input {
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 0.95rem;
  outline: none;
  transition: all 0.2s;
}

.chat-input:focus {
  border-color: var(--primary-500);
  background: var(--bg-quaternary);
}

/* Slide up animation */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Mobile Responsive - Flexi Hero */
@media (max-width: 768px) {
  .hero {
    padding-top: calc(var(--safe-area-top) + 80px);
    min-height: auto;
  }
  /* Flexi Mobile */
  .flexi-container {
    height: 200px;
    margin-bottom: 1rem;
  }
  .flexi-avatar {
    width: 200px;
    height: 200px;
  }
  .hero-title {
    font-size: 2rem;
  }
  .typing-text {
    min-width: 150px;
  }
  .hero-tagline {
    font-size: 1rem;
  }
  .main-input-container {
    margin-bottom: 1.5rem;
  }
  .main-input {
    padding: 1rem 1.5rem;
    font-size: 1rem;
  }
  .quick-starts {
    gap: 0.5rem;
    margin-bottom: 2rem;
    overflow-x: auto;
    flex-wrap: nowrap;
    justify-content: flex-start;
    padding: 0 0.5rem;
    -webkit-overflow-scrolling: touch;
  }
  .quick-start-pill {
    flex-shrink: 0;
    padding: 0.6rem 1.2rem;
    font-size: 0.875rem;
  }
  .trust-builders {
    gap: 1.5rem;
    font-size: 0.75rem;
  }
  .trust-icon {
    font-size: 1rem;
  }
  .flexi-chat {
    margin: 0 -1rem 2rem;
    border-radius: 0;
  }
  .chat-messages {
    max-height: 300px;
    padding: 1.5rem;
  }
  .help-prompt {
    padding: 1rem;
  }
  .expert-help-btn {
    padding: 0.6rem 1.5rem;
    font-size: 0.875rem;
  }
}
</style>