<template>
  <div>
    <!-- Animated Background -->
    <div class="animated-bg">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
      <div class="gradient-orb orb-3"></div>
    </div>

    <!-- Header -->
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <span style="font-size: 1.5rem;">🚀</span>
          <span>FlexOS</span>
        </div>
        
        <nav class="nav-links">
          <a href="#features" class="nav-link">Features</a>
          <a href="#pricing" class="nav-link">Pricing</a>
          <a href="#docs" class="nav-link">Docs</a>
          <button class="login-btn">Sign In</button>
        </nav>
        
        <button class="mobile-menu-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 12h18M3 6h18M3 18h18"/>
          </svg>
        </button>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">
            Build Apps 10x Faster with AI
          </h1>
          <p class="hero-subtitle">
            Transform your ideas into production-ready applications in minutes. 
            Our AI assistant guides you through every step, from concept to deployment.
          </p>
          <div class="cta-buttons">
            <button class="cta-primary" @click="startDemo">
              Start Building Free
            </button>
            <button class="cta-secondary" @click="watchVideo">
              Watch Demo
            </button>
          </div>
        </div>

        <div class="chat-preview">
          <div class="live-badge">
            <span class="live-dot"></span>
            LIVE DEMO
          </div>
          
          <div class="chat-window">
            <div class="chat-header">
              <div class="chat-header-title">
                <span>🧙</span>
                FlexOS AI Assistant
              </div>
              <div class="status-indicator"></div>
            </div>

            <div class="chat-messages" ref="chatMessages">
              <div class="chat-message">
                <div class="chat-avatar">AI</div>
                <div class="chat-bubble">
                  Hi! I'm your AI assistant. I can help you build amazing applications. 
                  What would you like to create today?
                </div>
              </div>
              
              <div v-if="!conversationStarted" class="chat-suggestions">
                <div class="suggestion-chip" @click="selectSuggestion('E-commerce platform')">
                  🛍️ E-commerce platform
                </div>
                <div class="suggestion-chip" @click="selectSuggestion('SaaS dashboard')">
                  📊 SaaS dashboard
                </div>
                <div class="suggestion-chip" @click="selectSuggestion('Social app')">
                  💬 Social app
                </div>
              </div>

              <div v-for="(message, index) in messages" :key="index" class="chat-message">
                <div v-if="message.type === 'ai'" class="chat-avatar">AI</div>
                <div 
                  class="chat-bubble" 
                  :style="message.type === 'user' ? 'background: rgba(22, 193, 129, 0.1); margin-left: auto;' : ''"
                >
                  {{ message.content }}
                </div>
              </div>

              <div v-if="isTyping" class="chat-message">
                <div class="chat-avatar">AI</div>
                <div class="chat-bubble">
                  <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                  </div>
                </div>
              </div>

              <div v-if="showContinueButton" style="text-align: center; margin-top: 1rem;">
                <button 
                  @click="launchWizard" 
                  class="continue-button"
                  @mouseover="continueButtonHover = true"
                  @mouseout="continueButtonHover = false"
                  :style="continueButtonHover ? 'background: var(--primary-600)' : 'background: var(--primary-500)'"
                >
                  <span v-if="!loadingWizard">Continue to Builder →</span>
                  <div v-else class="loading">
                    <div class="loading-dot"></div>
                    <div class="loading-dot"></div>
                    <div class="loading-dot"></div>
                  </div>
                </button>
              </div>
            </div>

            <div class="chat-input-area">
              <input 
                type="text" 
                class="chat-input" 
                v-model="chatInput"
                placeholder="Describe your app idea..."
                @keypress.enter.prevent="sendMessage"
              >
              <button class="chat-send" @click="sendMessage" :disabled="!chatInput.trim() || isTyping">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                  <path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Differentiators Section -->
    <section class="differentiators">
      <div class="differentiators-content">
        <div class="differentiators-header">
          <h2 class="differentiators-title">Why FlexOS is Different</h2>
          <p class="differentiators-subtitle">
            Built by developers who understand the pitfalls of AI-assisted development
          </p>
        </div>
        
        <div class="differentiators-tabs">
          <div class="tabs-navigation">
            <button 
              v-for="(tab, index) in differentiatorTabs" 
              :key="tab.id"
              :class="['tab-button', { active: activeTab === index }]"
              @click="setActiveTab(index)"
            >
              <div class="tab-icon">{{ tab.icon }}</div>
              <div class="tab-content">
                <h3 class="tab-title">{{ tab.title }}</h3>
                <p class="tab-subtitle">{{ tab.subtitle }}</p>
              </div>
              <div class="tab-indicator"></div>
            </button>
          </div>
          
          <div class="tabs-content">
            <transition name="tab-fade" mode="out-in">
              <div :key="activeTab" class="tab-panel">
                <div class="panel-text">
                  <h3 class="panel-title">{{ differentiatorTabs[activeTab].title }}</h3>
                  <p class="panel-description">{{ differentiatorTabs[activeTab].description }}</p>
                  <ul class="panel-features">
                    <li v-for="feature in differentiatorTabs[activeTab].features" :key="feature">
                      {{ feature }}
                    </li>
                  </ul>
                </div>
                
                <div class="panel-media">
                  <div class="video-placeholder" @click="openVideo">
                    <div class="video-gradient"></div>
                    <div class="video-content">
                      <div class="play-button">
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="white">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                      <p class="video-label">{{ differentiatorTabs[activeTab].videoLabel }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features">
      <div class="features-content">
        <h2 class="features-title">Everything You Need to Build</h2>
        <p class="features-subtitle">From idea to deployment in record time</p>
        
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🤖</div>
            <h3 class="feature-title">AI-Powered Development</h3>
            <p class="feature-description">
              Our AI understands your requirements and generates production-ready code instantly.
            </p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">🎨</div>
            <h3 class="feature-title">Beautiful UI Components</h3>
            <p class="feature-description">
              Pre-built, customizable components that look great on every device.
            </p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">⚡</div>
            <h3 class="feature-title">Instant Deployment</h3>
            <p class="feature-description">
              Deploy to production with one click. We handle all the infrastructure.
            </p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">🔐</div>
            <h3 class="feature-title">Built-in Security</h3>
            <p class="feature-description">
              Enterprise-grade security features included by default in every app.
            </p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">📊</div>
            <h3 class="feature-title">Real-time Analytics</h3>
            <p class="feature-description">
              Monitor your app's performance with built-in analytics and insights.
            </p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">🚀</div>
            <h3 class="feature-title">Scalable Infrastructure</h3>
            <p class="feature-description">
              Your apps automatically scale to handle millions of users.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section id="pricing" class="pricing">
      <div class="pricing-content">
        <div class="pricing-header">
          <h2 class="pricing-title">Simple, Transparent Pricing</h2>
          <p class="pricing-subtitle">
            Start free, upgrade when you're ready. No surprises.
          </p>
        </div>
        
        <div class="pricing-grid">
          <!-- Free Tier -->
          <div class="pricing-card">
            <div class="card-header">
              <h3 class="card-title">Starter</h3>
              <div class="card-price">
                <span class="price-currency">$</span>
                <span class="price-amount">0</span>
                <span class="price-period">/forever</span>
              </div>
              <p class="card-description">Perfect for trying out FlexOS</p>
            </div>
            
            <ul class="card-features">
              <li>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                <span>1 Project</span>
              </li>
              <li>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                <span>AI-powered development</span>
              </li>
              <li>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                <span>Export to GitHub</span>
              </li>
              <li>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                <span>Community support</span>
              </li>
            </ul>
            
            <button class="card-cta card-cta-secondary">
              Start Building Free
            </button>
          </div>
          
          <!-- Growth Tier -->
          <div class="pricing-card featured">
            <div class="featured-badge">Most Popular</div>
            <div class="card-header">
              <h3 class="card-title">Growth</h3>
              <div class="card-price">
                <span class="price-currency">$</span>
                <span class="price-amount">11.11</span>
                <span class="price-period">/month</span>
              </div>
              <p class="card-description">For serious builders</p>
            </div>
            
            <ul class="card-features">
              <li>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                <span>Up to 5 Projects</span>
              </li>
              <li>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                <span>Priority AI processing</span>
              </li>
              <li>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                <span>Advanced components</span>
              </li>
              <li>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                <span>Email support</span>
              </li>
              <li>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                <span>Custom domains</span>
              </li>
            </ul>
            
            <button class="card-cta card-cta-primary">
              Upgrade to Growth
            </button>
          </div>
          
          <!-- Unlimited Tier -->
          <div class="pricing-card">
            <div class="card-header">
              <h3 class="card-title">Unlimited</h3>
              <div class="card-price">
                <span class="price-currency">$</span>
                <span class="price-amount">29.99</span>
                <span class="price-period">/month</span>
              </div>
              <p class="card-description">For teams and agencies</p>
            </div>
            
            <ul class="card-features">
              <li>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                <span>Unlimited Projects</span>
              </li>
              <li>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                <span>Team collaboration</span>
              </li>
              <li>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                <span>White-label options</span>
              </li>
              <li>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                <span>Priority support</span>
              </li>
              <li>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                <span>API access</span>
              </li>
            </ul>
            
            <button class="card-cta card-cta-secondary">
              Go Unlimited
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Hire an Expert Section -->
    <section class="hire-expert">
      <div class="hire-expert-content">
        <div class="expert-text">
          <h2 class="expert-title">Want to Talk to a Human?</h2>
          <h3 class="expert-subtitle">Let Our Flexperts Build It For You</h3>
          <p class="expert-description">
            Use FlexOS to explain your vision with our AI, create wireframes, and plan your project. 
            Then hand it over to one of our expert developers who will bring it to life—no AI frustrations, 
            just real human expertise delivering exactly what you need.
          </p>
          
          <ul class="expert-benefits">
            <li>
              <div class="benefit-icon">🧙‍♂️</div>
              <div class="benefit-content">
                <h4>Expert Developers</h4>
                <p>Seasoned professionals who understand your vision</p>
              </div>
            </li>
            <li>
              <div class="benefit-icon">🎯</div>
              <div class="benefit-content">
                <h4>No AI Hallucinations</h4>
                <p>Real code, real testing, real results</p>
              </div>
            </li>
            <li>
              <div class="benefit-icon">🚀</div>
              <div class="benefit-content">
                <h4>Fast Turnaround</h4>
                <p>From concept to deployment in days, not months</p>
              </div>
            </li>
          </ul>
          
          <button class="expert-cta" @click="contactExpert">
            Talk to a Human Expert
          </button>
        </div>
        
        <div class="expert-visual">
          <div class="expert-illustration">
            <div class="illustration-card">
              <div class="card-avatar">👨‍💻</div>
              <div class="card-info">
                <h5>Meet Your Flexpert</h5>
                <p>Real developers, real solutions</p>
              </div>
            </div>
            <div class="illustration-features">
              <div class="feature-item">✓ Vue.js Experts</div>
              <div class="feature-item">✓ React Specialists</div>
              <div class="feature-item">✓ Full-Stack Developers</div>
              <div class="feature-item">✓ UI/UX Designers</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Website Refresh Section -->
    <section class="website-refresh">
      <div class="refresh-content">
        <div class="refresh-header">
          <div class="eu-badge">
            <span class="badge-icon">⚠️</span>
            <span class="badge-text">EU Accessibility Deadline: June 2025</span>
          </div>
          <h2 class="refresh-title">Time to Refresh Your Website?</h2>
          <p class="refresh-subtitle">
            Transform your outdated site into a modern, accessible, lightning-fast experience
          </p>
        </div>
        
        <div class="refresh-input-area">
          <input 
            type="url" 
            v-model="websiteUrl" 
            placeholder="Enter your current website URL..."
            class="refresh-input"
            @keypress.enter="startWebsiteRefresh"
          >
          <button class="refresh-button" @click="startWebsiteRefresh">
            Analyze My Site
          </button>
        </div>
        
        <div class="refresh-benefits">
          <div class="benefit-card">
            <div class="benefit-icon">♿</div>
            <h4>WCAG Compliant</h4>
            <p>Meet EU accessibility requirements</p>
          </div>
          <div class="benefit-card">
            <div class="benefit-icon">📱</div>
            <h4>Mobile-First</h4>
            <p>Perfect on every device</p>
          </div>
          <div class="benefit-card">
            <div class="benefit-icon">⚡</div>
            <h4>Lightning Fast</h4>
            <p>Core Web Vitals optimized</p>
          </div>
          <div class="benefit-card">
            <div class="benefit-icon">🎨</div>
            <h4>Modern Design</h4>
            <p>Fresh look, better UX</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-left">
          <span class="copyright">© Flexperts 2025</span>
        </div>
        
        <div class="footer-center">
          <span>Built with 💚 by</span>
          <img 
            src="https://storage.googleapis.com/flutterflow-io-6f20.appspot.com/projects/flexpertsdev-pb6ym6/assets/hh0wb4fgqcrc/flexpertsLogoWhite.png" 
            alt="Flexperts" 
            class="footer-logo"
          >
        </div>
        
        <div class="footer-right">
          <a href="#legal" class="footer-link">Legal Stuff</a>
        </div>
      </div>
    </footer>

    <!-- Video Modal -->
    <transition name="modal-fade">
      <div v-if="showVideoModal" class="video-modal" @click="closeVideo">
        <div class="video-modal-content" @click.stop>
          <button class="video-close" @click="closeVideo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
          <div class="video-container">
            <div class="video-placeholder-large">
              <div class="video-gradient"></div>
              <div class="video-content">
                <div class="play-button">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="white">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <p class="video-label-large">Video Coming Soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'

interface ChatMessage {
  type: 'user' | 'ai'
  content: string
}

const messages = ref<ChatMessage[]>([])
const chatInput = ref('')
const isTyping = ref(false)
const conversationStarted = ref(false)
const showContinueButton = ref(false)
const continueButtonHover = ref(false)
const loadingWizard = ref(false)
const chatMessages = ref<HTMLElement>()
const activeTab = ref(0)
const showVideoModal = ref(false)
const activeVideo = ref('')
const websiteUrl = ref('')

// Differentiator tabs data
const differentiatorTabs = ref([
  {
    id: 'plan',
    icon: '📋',
    title: 'Plan Before You Build',
    subtitle: 'AI that thinks first',
    description: 'Unlike other AI builders that jump straight into code, FlexOS creates a comprehensive plan. Our AI understands your entire project scope before writing a single line.',
    features: [
      'Complete project architecture planning',
      'Component hierarchy visualization',
      'Database schema design upfront',
      'API endpoint mapping'
    ],
    videoLabel: 'See planning in action'
  },
  {
    id: 'accurate',
    icon: '🎯',
    title: 'No Hallucinations',
    subtitle: 'Reliable, tested code',
    description: 'Every line of code is verified against best practices and tested patterns. No made-up functions, no phantom APIs, just solid, working code you can trust.',
    features: [
      'Real-time code validation',
      'Framework-specific best practices',
      'Automatic error detection',
      'Production-ready output'
    ],
    videoLabel: 'Watch accuracy demo'
  },
  {
    id: 'human',
    icon: '🤝',
    title: 'Made for Humans',
    subtitle: 'Developer-first design',
    description: 'Built by developers who felt the pain of AI tools. Natural conversations, readable code, and an interface that speaks your language.',
    features: [
      'Natural language understanding',
      'Clean, commented code output',
      'Interactive refinement process',
      'Version control integration'
    ],
    videoLabel: 'Experience the difference'
  }
])

const scrollToBottom = async () => {
  await nextTick()
  if (chatMessages.value) {
    chatMessages.value.scrollTop = chatMessages.value.scrollHeight
  }
}

const selectSuggestion = (suggestion: string) => {
  chatInput.value = suggestion
  setTimeout(() => {
    sendMessage()
  }, 100)
}

const sendMessage = async () => {
  const message = chatInput.value.trim()
  
  if (!message || isTyping.value) return
  
  messages.value.push({ type: 'user', content: message })
  chatInput.value = ''
  
  if (!conversationStarted.value) {
    conversationStarted.value = true
  }
  
  isTyping.value = true
  await scrollToBottom()
  
  setTimeout(async () => {
    isTyping.value = false
    
    if (message.toLowerCase().includes('e-commerce') || message.toLowerCase().includes('shop')) {
      messages.value.push({
        type: 'ai',
        content: "Great choice! An e-commerce platform is perfect for selling products online. I'll help you build a modern, fully-featured store with shopping cart, payment processing, and inventory management."
      })
      await scrollToBottom()
      
      setTimeout(async () => {
        isTyping.value = true
        await scrollToBottom()
        
        setTimeout(async () => {
          isTyping.value = false
          messages.value.push({
            type: 'ai',
            content: "Let me start by asking a few questions to understand your vision better. Click 'Continue' to start building your e-commerce platform!"
          })
          showContinueButton.value = true
          await scrollToBottom()
        }, 1500)
      }, 1000)
    } else if (message.toLowerCase().includes('saas') || message.toLowerCase().includes('dashboard')) {
      messages.value.push({
        type: 'ai',
        content: "Excellent! A SaaS dashboard is a great way to provide value to your users. I'll help you create a professional dashboard with user management, analytics, and billing."
      })
      await scrollToBottom()
      
      setTimeout(async () => {
        isTyping.value = true
        await scrollToBottom()
        
        setTimeout(async () => {
          isTyping.value = false
          messages.value.push({
            type: 'ai',
            content: "Ready to design your SaaS platform? Click 'Continue' to start the setup wizard!"
          })
          showContinueButton.value = true
          await scrollToBottom()
        }, 1500)
      }, 1000)
    } else if (message.toLowerCase().includes('social') || message.toLowerCase().includes('chat')) {
      messages.value.push({
        type: 'ai',
        content: "Perfect! A social app is a fantastic way to connect people. I'll help you build features like real-time messaging, user profiles, and content sharing."
      })
      await scrollToBottom()
      
      setTimeout(async () => {
        isTyping.value = true
        await scrollToBottom()
        
        setTimeout(async () => {
          isTyping.value = false
          messages.value.push({
            type: 'ai',
            content: "Let's create something amazing together. Click 'Continue' to start building your social platform!"
          })
          showContinueButton.value = true
          await scrollToBottom()
        }, 1500)
      }, 1000)
    } else {
      messages.value.push({
        type: 'ai',
        content: "That sounds interesting! I can help you build that. Let me understand your requirements better."
      })
      await scrollToBottom()
      
      setTimeout(async () => {
        isTyping.value = true
        await scrollToBottom()
        
        setTimeout(async () => {
          isTyping.value = false
          messages.value.push({
            type: 'ai',
            content: "Click 'Continue' to start our detailed setup wizard where we'll plan every aspect of your application!"
          })
          showContinueButton.value = true
          await scrollToBottom()
        }, 1500)
      }, 1000)
    }
  }, 1500)
}

const launchWizard = () => {
  loadingWizard.value = true
  
  setTimeout(() => {
    window.location.href = '#wizard'
    alert('Navigate to full wizard view!')
  }, 1000)
}

const startDemo = () => {
  const chatWindow = document.querySelector('.chat-window') as HTMLElement
  if (chatWindow) {
    chatWindow.style.boxShadow = '0 20px 60px rgba(22, 193, 129, 0.3)'
    setTimeout(() => {
      chatWindow.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.5)'
    }, 2000)
  }
  
  chatInput.value = ''
  const input = document.querySelector('.chat-input') as HTMLInputElement
  if (input) {
    input.focus()
    input.placeholder = "Try: 'I want to build an e-commerce platform'"
  }
}

const watchVideo = () => {
  alert('Video demo coming soon!')
}

const setActiveTab = (index: number) => {
  activeTab.value = index
}

const openVideo = () => {
  showVideoModal.value = true
  activeVideo.value = differentiatorTabs.value[activeTab.value].videoUrl || ''
  document.body.style.overflow = 'hidden'
}

const closeVideo = () => {
  showVideoModal.value = false
  activeVideo.value = ''
  document.body.style.overflow = ''
}

const contactExpert = () => {
  // Navigate to contact form or open modal
  alert('Contact form coming soon! Email us at experts@flexperts.com')
}

const startWebsiteRefresh = () => {
  if (!websiteUrl.value) {
    alert('Please enter your website URL')
    return
  }
  // Navigate to wizard with website refresh flow
  window.location.href = `/wizard?mode=refresh&url=${encodeURIComponent(websiteUrl.value)}`
}

// Smooth scroll for anchor links
onMounted(() => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault()
      const href = (e.currentTarget as HTMLAnchorElement).getAttribute('href')
      if (href) {
        const target = document.querySelector(href)
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' })
        }
      }
    })
  })

  // ESC key to close video modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && showVideoModal.value) {
      closeVideo()
    }
  })
})
</script>

<style scoped>
/* Animated Background */
.animated-bg {
  position: fixed;
  inset: 0;
  overflow: hidden;
  z-index: -1;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.3;
  animation: float 20s ease-in-out infinite;
}

.orb-1 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, var(--primary-500), transparent);
  top: -200px;
  right: -200px;
  animation-delay: 0s;
}

.orb-2 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, var(--purple-500), transparent);
  bottom: -100px;
  left: -100px;
  animation-delay: 5s;
}

.orb-3 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, var(--blue-500), transparent);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: 10s;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -30px) scale(1.1); }
  66% { transform: translate(-30px, 30px) scale(0.9); }
}

/* Header */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(15, 20, 25, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-primary);
  z-index: 100;
  padding-top: var(--safe-area-top);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 700;
}

.nav-links {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-link:hover {
  color: var(--text-primary);
}

.login-btn {
  padding: 0.5rem 1.5rem;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  color: var(--text-primary);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.login-btn:hover {
  background: var(--bg-quaternary);
  border-color: var(--border-secondary);
}

/* Hero Section */
.hero {
  padding-top: calc(var(--safe-area-top) + 120px);
  padding-bottom: 4rem;
  position: relative;
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.hero-text {
  animation: slideInLeft 0.8s ease-out;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, var(--text-primary) 0%, var(--primary-400) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 2rem;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.cta-primary {
  padding: 1rem 2rem;
  background: var(--primary-500);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
}

.cta-primary::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%);
  transform: translateX(-100%);
  transition: transform 0.6s;
}

.cta-primary:hover::before {
  transform: translateX(100%);
}

.cta-primary:hover {
  background: var(--primary-600);
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(22, 193, 129, 0.3);
}

.cta-secondary {
  padding: 1rem 2rem;
  background: transparent;
  color: var(--text-primary);
  border: 2px solid var(--border-secondary);
  border-radius: 12px;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.cta-secondary:hover {
  border-color: var(--primary-500);
  color: var(--primary-500);
  transform: translateY(-2px);
}

/* Chat Preview */
.chat-preview {
  position: relative;
  animation: slideInRight 0.8s ease-out;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.chat-window {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  position: relative;
  height: 500px;
  display: flex;
  flex-direction: column;
}

.chat-header {
  background: var(--bg-tertiary);
  padding: 1.25rem;
  border-bottom: 1px solid var(--border-primary);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.chat-header-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
}

.status-indicator {
  width: 8px;
  height: 8px;
  background: var(--primary-500);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(0.8); }
}

.chat-messages {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.chat-message {
  display: flex;
  gap: 0.75rem;
  animation: messageSlide 0.4s ease-out;
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

.chat-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-500), var(--primary-400));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
}

.chat-bubble {
  background: var(--bg-tertiary);
  padding: 0.75rem 1rem;
  border-radius: 12px;
  font-size: 0.875rem;
  line-height: 1.5;
  max-width: 80%;
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

.chat-input-area {
  padding: 1rem;
  border-top: 1px solid var(--border-primary);
  display: flex;
  gap: 0.75rem;
}

.chat-input {
  flex: 1;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 24px;
  padding: 0.75rem 1rem;
  color: var(--text-primary);
  font-family: inherit;
  font-size: 0.875rem;
  outline: none;
  transition: all 0.2s;
}

.chat-input:focus {
  border-color: var(--primary-500);
  background: var(--bg-quaternary);
}

.chat-send {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--primary-500);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.chat-send:hover {
  background: var(--primary-600);
  transform: scale(1.05);
}

.chat-send:disabled {
  background: var(--bg-quaternary);
  cursor: not-allowed;
}

.continue-button {
  background: var(--primary-500);
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 24px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
}

/* Differentiators Section */
.differentiators {
  padding: 6rem 0;
  position: relative;
  overflow: hidden;
}

.differentiators-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.differentiators-header {
  text-align: center;
  margin-bottom: 4rem;
}

.differentiators-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, var(--text-primary) 0%, var(--primary-400) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.differentiators-subtitle {
  font-size: 1.125rem;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto;
}

.differentiators-tabs {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 3rem;
  align-items: start;
}

/* Tab Navigation */
.tabs-navigation {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tab-button {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.tab-button:hover {
  background: var(--bg-tertiary);
  border-color: var(--border-secondary);
  transform: translateX(4px);
}

.tab-button.active {
  background: var(--bg-tertiary);
  border-color: var(--primary-500);
  transform: translateX(8px);
}

.tab-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.tab-content {
  flex: 1;
}

.tab-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.tab-subtitle {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
}

.tab-indicator {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: var(--primary-500);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.tab-button.active .tab-indicator {
  transform: scaleX(1);
}

/* Tab Content */
.tabs-content {
  position: relative;
  min-height: 400px;
}

.tab-panel {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
}

.panel-text {
  animation: slideInLeft 0.5s ease-out;
}

.panel-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.panel-description {
  font-size: 1.125rem;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 2rem;
}

.panel-features {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.panel-features li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.panel-features li::before {
  content: '✓';
  color: var(--primary-500);
  font-weight: 700;
  font-size: 1.125rem;
}

/* Video Placeholder */
.panel-media {
  animation: slideInRight 0.5s ease-out;
}

.video-placeholder {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  border-radius: 16px;
  overflow: hidden;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.video-placeholder:hover {
  transform: scale(1.02);
  box-shadow: 0 20px 60px rgba(22, 193, 129, 0.2);
}

.video-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, 
    rgba(22, 193, 129, 0.1) 0%, 
    rgba(20, 184, 166, 0.1) 50%,
    rgba(59, 130, 246, 0.1) 100%
  );
}

.video-content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.play-button {
  width: 80px;
  height: 80px;
  background: rgba(22, 193, 129, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.video-placeholder:hover .play-button {
  background: var(--primary-500);
  transform: scale(1.1);
}

.video-label {
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  margin: 0;
}

/* Tab Fade Animation */
.tab-fade-enter-active,
.tab-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.tab-fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.tab-fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* Features Section */
.features {
  padding: 4rem 0;
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-primary);
}

.features-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.features-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.features-subtitle {
  text-align: center;
  color: var(--text-secondary);
  font-size: 1.125rem;
  margin-bottom: 3rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  padding: 2rem;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--primary-500), var(--purple-500));
  transform: scaleX(0);
  transition: transform 0.3s;
}

.feature-card:hover {
  transform: translateY(-4px);
  border-color: var(--border-secondary);
}

.feature-card:hover::before {
  transform: scaleX(1);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.feature-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.feature-description {
  color: var(--text-secondary);
  line-height: 1.6;
}

/* Mobile Menu */
.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  color: var(--text-primary);
  cursor: pointer;
  padding: 0.5rem;
}

/* Chat Suggestions */
.chat-suggestions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}

.suggestion-chip {
  padding: 0.5rem 1rem;
  background: var(--bg-quaternary);
  border: 1px solid var(--border-primary);
  border-radius: 20px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.suggestion-chip:hover {
  background: rgba(22, 193, 129, 0.1);
  border-color: var(--primary-500);
  color: var(--primary-500);
}

/* Live Badge */
.live-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: var(--primary-500);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  animation: livePulse 2s ease-in-out infinite;
}

@keyframes livePulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

.live-dot {
  width: 6px;
  height: 6px;
  background: white;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

/* Responsive */
@media (max-width: 768px) {
  .nav-links {
    display: none;
  }

  .mobile-menu-btn {
    display: block;
  }

  .hero-content {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 0 1rem;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.125rem;
  }

  .chat-preview {
    max-width: 100%;
  }

  .chat-window {
    height: 400px;
  }

  /* Differentiators Mobile */
  .differentiators-tabs {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .tabs-navigation {
    flex-direction: row;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    -ms-overflow-style: none;
    padding-bottom: 0.5rem;
  }

  .tabs-navigation::-webkit-scrollbar {
    display: none;
  }

  .tab-button {
    min-width: 280px;
    flex-shrink: 0;
  }

  .tab-button:hover,
  .tab-button.active {
    transform: translateX(0) translateY(-2px);
  }

  .tab-panel {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .panel-text {
    order: 2;
  }

  .panel-media {
    order: 1;
  }

  .panel-title {
    font-size: 1.5rem;
  }

  .panel-description {
    font-size: 1rem;
  }

  .differentiators-title {
    font-size: 2rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .cta-buttons {
    flex-direction: column;
    width: 100%;
  }

  .cta-primary,
  .cta-secondary {
    width: 100%;
    text-align: center;
  }
}

/* Loading state */
.loading {
  display: inline-flex;
  gap: 0.25rem;
}

.loading-dot {
  width: 4px;
  height: 4px;
  background: var(--primary-500);
  border-radius: 50%;
  animation: loadingBounce 1.4s ease-in-out infinite;
}

.loading-dot:nth-child(2) { animation-delay: 0.2s; }
.loading-dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes loadingBounce {
  0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
  40% { transform: scale(1.2); opacity: 1; }
}

/* Footer */
.footer {
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-primary);
  padding: 1.5rem 0;
  margin-top: 4rem;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.footer-left,
.footer-center,
.footer-right {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.footer-left {
  justify-content: flex-start;
}

.footer-center {
  justify-content: center;
}

.footer-right {
  justify-content: flex-end;
}

.footer-logo {
  height: 20px;
  width: auto;
  filter: brightness(0) invert(1);
  opacity: 0.8;
  transition: opacity 0.2s;
}

.footer-logo:hover {
  opacity: 1;
}

.footer-link {
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s;
}

.footer-link:hover {
  color: var(--text-primary);
}

.copyright {
  opacity: 0.8;
}

/* Footer responsive */
@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .footer-left,
  .footer-center,
  .footer-right {
    justify-content: center;
    width: 100%;
  }

  .footer-left {
    order: 2;
  }

  .footer-center {
    order: 1;
  }

  .footer-right {
    order: 3;
  }
}

/* Video Modal */
.video-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
  cursor: pointer;
}

.video-modal-content {
  position: relative;
  max-width: 1200px;
  width: 100%;
  cursor: default;
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.video-close {
  position: absolute;
  top: -3rem;
  right: 0;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: all 0.2s;
  z-index: 10;
}

.video-close:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

.video-container {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%;
  background: var(--bg-tertiary);
  border-radius: 16px;
  overflow: hidden;
}

.video-placeholder-large {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-label-large {
  color: var(--text-primary);
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 2rem;
}

/* Modal fade animation */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* Enhanced mobile responsiveness */
@media (max-width: 640px) {
  /* Differentiators mobile improvements */
  .differentiators {
    padding: 3rem 0;
  }

  .differentiators-header {
    margin-bottom: 2rem;
  }

  .differentiators-title {
    font-size: 1.75rem;
    line-height: 1.2;
  }

  .differentiators-subtitle {
    font-size: 1rem;
    padding: 0 1rem;
  }

  .tabs-navigation {
    gap: 0.5rem;
    padding: 0 1rem;
  }

  .tab-button {
    min-width: 240px;
    padding: 1rem;
  }

  .tab-icon {
    font-size: 1.5rem;
  }

  .tab-title {
    font-size: 1rem;
  }

  .tab-subtitle {
    font-size: 0.75rem;
  }

  .panel-title {
    font-size: 1.25rem;
  }

  .panel-description {
    font-size: 0.95rem;
    line-height: 1.6;
  }

  .panel-features {
    gap: 0.75rem;
  }

  .panel-features li {
    font-size: 0.875rem;
  }

  /* Video modal mobile */
  .video-modal {
    padding: 1rem;
  }

  .video-close {
    top: 1rem;
    right: 1rem;
    position: fixed;
  }

  .video-container {
    border-radius: 12px;
    margin-top: 4rem;
  }
}

/* Improved touch targets */
@media (hover: none) {
  .tab-button {
    min-height: 64px;
  }

  .video-placeholder {
    min-height: 200px;
  }
}

/* Pricing Section */
.pricing {
  padding: 6rem 0;
  background: var(--bg-secondary);
}

.pricing-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.pricing-header {
  text-align: center;
  margin-bottom: 4rem;
}

.pricing-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.pricing-subtitle {
  font-size: 1.125rem;
  color: var(--text-secondary);
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  align-items: start;
}

.pricing-card {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 16px;
  padding: 2rem;
  position: relative;
  transition: all 0.3s ease;
}

.pricing-card:hover {
  transform: translateY(-4px);
  border-color: var(--border-secondary);
}

.pricing-card.featured {
  border-color: var(--primary-500);
  transform: scale(1.05);
}

.pricing-card.featured:hover {
  transform: scale(1.05) translateY(-4px);
}

.featured-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--primary-500);
  color: white;
  padding: 0.25rem 1rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.card-header {
  text-align: center;
  margin-bottom: 2rem;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.card-price {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
}

.price-currency {
  font-size: 1.5rem;
  color: var(--text-secondary);
}

.price-amount {
  font-size: 3rem;
  font-weight: 700;
  color: var(--text-primary);
}

.price-period {
  font-size: 1rem;
  color: var(--text-secondary);
}

.card-description {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.card-features {
  list-style: none;
  padding: 0;
  margin: 0 0 2rem 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.card-features li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.card-features svg {
  color: var(--primary-500);
  flex-shrink: 0;
}

.card-cta {
  width: 100%;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.card-cta-primary {
  background: var(--primary-500);
  color: white;
}

.card-cta-primary:hover {
  background: var(--primary-600);
  transform: translateY(-2px);
}

.card-cta-secondary {
  background: transparent;
  color: var(--text-primary);
  border: 2px solid var(--border-secondary);
}

.card-cta-secondary:hover {
  border-color: var(--primary-500);
  color: var(--primary-500);
}

/* Hire Expert Section */
.hire-expert {
  padding: 6rem 0;
  position: relative;
  overflow: hidden;
}

.hire-expert-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.expert-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, var(--text-primary) 0%, var(--primary-400) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.expert-subtitle {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}

.expert-description {
  font-size: 1.125rem;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 2rem;
}

.expert-benefits {
  list-style: none;
  padding: 0;
  margin: 0 0 2rem 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.expert-benefits li {
  display: flex;
  gap: 1rem;
  align-items: start;
}

.benefit-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.benefit-content h4 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: var(--text-primary);
}

.benefit-content p {
  font-size: 0.95rem;
  color: var(--text-secondary);
  margin: 0;
}

.expert-cta {
  padding: 1rem 2rem;
  background: var(--primary-500);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.expert-cta:hover {
  background: var(--primary-600);
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(22, 193, 129, 0.3);
}

.expert-illustration {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 16px;
  padding: 2rem;
}

.illustration-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.card-avatar {
  font-size: 3rem;
}

.card-info h5 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.card-info p {
  color: var(--text-secondary);
  font-size: 0.95rem;
  margin: 0;
}

.illustration-features {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.feature-item {
  background: var(--bg-tertiary);
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Website Refresh Section */
.website-refresh {
  padding: 6rem 0;
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-primary);
}

.refresh-content {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 2rem;
}

.refresh-header {
  text-align: center;
  margin-bottom: 3rem;
}

.eu-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(234, 179, 8, 0.1);
  border: 1px solid var(--yellow-500);
  color: var(--yellow-500);
  padding: 0.5rem 1rem;
  border-radius: 24px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.badge-icon {
  font-size: 1.125rem;
}

.refresh-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.refresh-subtitle {
  font-size: 1.125rem;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto;
}

.refresh-input-area {
  display: flex;
  gap: 1rem;
  margin-bottom: 3rem;
}

.refresh-input {
  flex: 1;
  padding: 1rem 1.5rem;
  background: var(--bg-tertiary);
  border: 2px solid var(--border-primary);
  border-radius: 12px;
  color: var(--text-primary);
  font-size: 1.125rem;
  font-family: inherit;
  outline: none;
  transition: all 0.2s;
}

.refresh-input:focus {
  border-color: var(--primary-500);
  background: var(--bg-quaternary);
}

.refresh-input::placeholder {
  color: var(--text-tertiary);
}

.refresh-button {
  padding: 1rem 2rem;
  background: var(--primary-500);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.refresh-button:hover {
  background: var(--primary-600);
  transform: translateY(-2px);
}

.refresh-benefits {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.benefit-card {
  text-align: center;
}

.benefit-card .benefit-icon {
  font-size: 2.5rem;
  margin-bottom: 0.75rem;
  display: block;
}

.benefit-card h4 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.benefit-card p {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
}

/* Responsive for new sections */
@media (max-width: 768px) {
  .pricing-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .pricing-card.featured {
    transform: scale(1);
  }

  .hire-expert-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .expert-visual {
    order: -1;
  }

  .expert-title {
    font-size: 2rem;
  }

  .refresh-input-area {
    flex-direction: column;
  }

  .refresh-benefits {
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
}

@media (max-width: 640px) {
  .pricing-title,
  .expert-title,
  .refresh-title {
    font-size: 1.75rem;
  }

  .refresh-benefits {
    grid-template-columns: 1fr;
  }

  .illustration-features {
    grid-template-columns: 1fr;
  }
}
</style>