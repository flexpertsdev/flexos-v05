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
            'flexi-typing': userIsTyping
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

        <!-- Main Input Field with Button -->
        <div class="input-with-button">
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
          <button class="start-button" @click="startBuilding" :disabled="!userInput.trim()">
            Start Building →
          </button>
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
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Hero State
const userInput = ref('')
const inputFocused = ref(false)
const userIsTyping = ref(false)
const projectsBuilt = ref(12847)
const currentProjectType = ref('website')
const mainInput = ref<HTMLInputElement>()

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

// Methods
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
  mainInput.value?.focus()
}

const startBuilding = () => {
  const input = userInput.value.trim()
  if (!input) return

  // Navigate to wizard with the project description
  router.push({
    path: '/wizard',
    query: { project: input }
  })
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
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.flexi-avatar {
  width: 200px;
  height: 200px;
  object-fit: contain;
  filter: drop-shadow(0 20px 40px rgba(22, 193, 129, 0.3));
  transition: all 0.3s ease;
}

.flexi-avatar.flexi-typing {
  animation: lookDown 0.5s ease forwards;
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

/* Input with Button */
.input-with-button {
  display: flex;
  gap: 1rem;
  max-width: 700px;
  margin: 0 auto 2rem;
  align-items: stretch;
}

.main-input-container {
  flex: 1;
  position: relative;
  transition: all 0.3s ease;
}

.main-input {
  width: 100%;
  height: 100%;
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

/* Start Button */
.start-button {
  padding: 1.5rem 2.5rem;
  background: var(--primary-500);
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 1.125rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.start-button:hover:not(:disabled) {
  background: var(--primary-600);
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(22, 193, 129, 0.4);
}

.start-button:active:not(:disabled) {
  transform: translateY(0);
}

.start-button:disabled {
  background: var(--bg-quaternary);
  color: var(--text-muted);
  cursor: not-allowed;
  opacity: 0.6;
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

/* Mobile Responsive */
@media (max-width: 768px) {
  .hero {
    padding-top: calc(var(--safe-area-top) + 80px);
    min-height: auto;
  }
  
  .flexi-container {
    height: 150px;
    margin-bottom: 1rem;
  }
  
  .flexi-avatar {
    width: 150px;
    height: 150px;
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
  
  .input-with-button {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .main-input {
    padding: 1rem 1.5rem;
    font-size: 1rem;
  }
  
  .start-button {
    width: 100%;
    justify-content: center;
    padding: 1.25rem 2rem;
    font-size: 1rem;
  }
  
  .quick-starts {
    gap: 0.5rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    justify-content: center;
    padding: 0 0.5rem;
  }
  
  .quick-start-pill {
    padding: 0.6rem 1rem;
    font-size: 0.8rem;
  }
  
  .trust-builders {
    gap: 1.5rem;
    font-size: 0.75rem;
  }
  
  .trust-icon {
    font-size: 1rem;
  }
}
</style>