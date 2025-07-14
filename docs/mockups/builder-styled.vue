<template>
  <div class="flexos-builder">
    <!-- Desktop Layout -->
    <div v-if="!isMobile" class="desktop-layout">
      <!-- Top Navigation Bar -->
      <nav class="top-nav">
        <div class="nav-left">
          <div class="logo">
            <span class="logo-icon">F</span>
            <span class="logo-text">FlexOS Builder</span>
          </div>
        </div>
        
        <div class="nav-center">
          <span class="project-name">{{ projectName }}</span>
        </div>
        
        <div class="nav-right">
          <!-- Mode Selector -->
          <select v-model="currentMode" class="mode-selector">
            <option value="builder">Builder</option>
            <option value="focus">Focus</option>
            <option value="map">Map</option>
          </select>
          
          <!-- Settings Icon -->
          <button @click="openSettings" class="settings-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 1v6m0 6v6m9-9h-6m-6 0H3m16.24-5.24l-4.24 4.24m-6 6l-4.24 4.24m0-14.48l4.24 4.24m6 6l4.24 4.24"/>
            </svg>
          </button>
        </div>
      </nav>

      <!-- Main Content Area -->
      <div class="main-content">
        <!-- Chat Panel -->
        <div class="chat-panel">
          <div class="panel-header">
            <div class="ai-indicator">
              <span class="ai-badge">AI</span>
              <span class="ai-text">AI Assistant</span>
            </div>
            <button @click="clearChat" class="clear-btn">Clear</button>
          </div>
          
          <div class="chat-messages" ref="chatMessages">
            <div v-for="message in messages" :key="message.id" class="message" :class="message.type">
              <div v-if="message.type === 'ai'" class="message-avatar">
                <span class="ai-badge">AI</span>
              </div>
              <div class="message-content">{{ message.content }}</div>
            </div>
            <div v-if="messages.length === 0" class="message ai">
              <div class="message-avatar">
                <span class="ai-badge">AI</span>
              </div>
              <div class="message-content">Hi! I'm here to help you build your {{ projectName.toLowerCase() }}. What would you like to work on today?</div>
            </div>
          </div>
          
          <div class="chat-input-container">
            <button @click="attachFile" class="attach-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
              </svg>
            </button>
            <input 
              v-model="chatInput" 
              placeholder="Ask about your project..."
              @keyup.enter="sendMessage"
              class="chat-input"
            />
          </div>
        </div>

        <!-- Project Panel -->
        <div class="project-panel">
          <!-- Project Tabs -->
          <div class="project-tabs">
            <button 
              v-for="tab in projectTabs" 
              :key="tab.id"
              @click="activeProjectTab = tab.id"
              class="tab-button"
              :class="{ active: activeProjectTab === tab.id }"
            >
              <component v-if="tab.icon" :is="tab.icon" class="tab-icon" />
              {{ tab.label }}
            </button>
          </div>
          
          <!-- Project Content -->
          <div class="project-content">
            <!-- Vision Panel -->
            <div v-if="activeProjectTab === 'vision'" class="vision-panel">
              <h1 class="project-title">Project Vision</h1>
              
              <div class="project-header">
                <h2 class="project-name-large">{{ projectName }}</h2>
                <p class="project-description">
                  A modern, responsive e-commerce platform that provides seamless shopping experiences across all 
                  devices. Built with performance and user experience at its core.
                </p>
              </div>
              
              <div class="objectives-section">
                <h3 class="section-title">Key Objectives</h3>
                <ul class="objectives-list">
                  <li>Fast, responsive design for all devices</li>
                  <li>Intuitive product discovery and search</li>
                  <li>Secure and streamlined checkout process</li>
                  <li>Real-time inventory management</li>
                </ul>
              </div>
            </div>
            
            <!-- Pages Panel -->
            <div v-if="activeProjectTab === 'pages'" class="pages-panel">
              <div class="pages-header">
                <h2 class="pages-title">Pages</h2>
              </div>
              
              <div class="pages-section">
                <h3 class="section-subtitle">Design Pages</h3>
                <div class="page-item">
                  <span class="page-name">Homepage</span>
                </div>
              </div>
            </div>
            
            <!-- Other panels would go here -->
            <div v-if="!['vision', 'pages'].includes(activeProjectTab)" class="placeholder-panel">
              <h2>{{ projectTabs.find(t => t.id === activeProjectTab)?.label }}</h2>
              <p>Content for {{ activeProjectTab }} panel</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Layout -->
    <div v-else class="mobile-layout">
      <!-- App Bar -->
      <header class="app-bar">
        <button @click="goToDashboard" class="logo-button">
          <span>F</span>
        </button>
        
        <select v-model="currentMode" class="mode-selector">
          <option value="builder">Builder</option>
          <option value="focus">Focus</option>
          <option value="map">Map</option>
        </select>
        
        <button @click="openSettings" class="settings-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 1v6m0 6v6m9-9h-6m-6 0H3m16.24-5.24l-4.24 4.24m-6 6l-4.24 4.24m0-14.48l4.24 4.24m6 6l4.24 4.24"/>
          </svg>
        </button>
      </header>

      <!-- Tab Navigation -->
      <div class="mobile-tabs">
        <button 
          @click="activeMobileTab = 'chat'"
          class="mobile-tab"
          :class="{ active: activeMobileTab === 'chat' }"
        >
          Chat
        </button>
        <button 
          @click="activeMobileTab = 'project'"
          class="mobile-tab"
          :class="{ active: activeMobileTab === 'project' }"
        >
          Project
        </button>
      </div>

      <!-- Mobile Content -->
      <div class="mobile-content">
        <!-- Chat View -->
        <div v-if="activeMobileTab === 'chat'" class="mobile-chat-view">
          <div class="panel-header">
            <div class="ai-indicator">
              <span class="ai-badge">AI</span>
              <span class="ai-text">AI Assistant</span>
            </div>
            <button @click="clearChat" class="clear-btn">Clear</button>
          </div>
          
          <div class="chat-messages">
            <div v-for="message in messages" :key="message.id" class="message" :class="message.type">
              <div v-if="message.type === 'ai'" class="message-avatar">
                <span class="ai-badge">AI</span>
              </div>
              <div class="message-content">{{ message.content }}</div>
            </div>
            <div v-if="messages.length === 0" class="message ai">
              <div class="message-avatar">
                <span class="ai-badge">AI</span>
              </div>
              <div class="message-content">Hi! I'm here to help you build your {{ projectName.toLowerCase() }}. What would you like to work on today?</div>
            </div>
          </div>
          
          <div class="chat-input-container">
            <button @click="attachFile" class="attach-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
              </svg>
            </button>
            <input 
              v-model="chatInput" 
              placeholder="Ask about your project..."
              @keyup.enter="sendMessage"
              class="chat-input"
            />
          </div>
        </div>

        <!-- Project View -->
        <div v-if="activeMobileTab === 'project'" class="mobile-project-view">
          <div @click="showPanelSelector = true" class="panel-selector">
            <span>{{ projectTabs.find(t => t.id === activeProjectTab)?.label || 'Vision' }}</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
          
          <div class="project-content">
            <!-- Vision Panel -->
            <div v-if="activeProjectTab === 'vision'" class="vision-panel">
              <h1 class="project-title">Project Vision</h1>
              
              <div class="project-header">
                <h2 class="project-name-large">{{ projectName }}</h2>
                <p class="project-description">
                  A modern, responsive e-commerce platform that provides seamless shopping experiences across all 
                  devices. Built with performance and user experience at its core.
                </p>
              </div>
              
              <div class="objectives-section">
                <h3 class="section-title">Key Objectives</h3>
                <ul class="objectives-list">
                  <li>Fast, responsive design for all devices</li>
                  <li>Intuitive product discovery and search</li>
                  <li>Secure and streamlined checkout process</li>
                  <li>Real-time inventory management</li>
                </ul>
              </div>
            </div>
            
            <!-- Other panels -->
            <div v-if="activeProjectTab === 'pages'" class="pages-panel">
              <div class="pages-header">
                <h2 class="pages-title">Pages</h2>
              </div>
              
              <div class="pages-section">
                <h3 class="section-subtitle">Design Pages</h3>
                <div class="page-item">
                  <span class="page-name">Homepage</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Panel Selector Bottom Sheet -->
      <transition name="slide-up">
        <div v-if="showPanelSelector" class="bottom-sheet-overlay" @click="showPanelSelector = false">
          <div class="bottom-sheet" @click.stop>
            <div class="bottom-sheet-header">
              <span>Select Panel</span>
            </div>
            <button 
              v-for="tab in projectTabs" 
              :key="tab.id"
              @click="selectPanel(tab.id)"
              class="bottom-sheet-option"
              :class="{ active: activeProjectTab === tab.id }"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FlexOSBuilder',
  data() {
    return {
      isMobile: false,
      currentMode: 'builder',
      projectName: 'E-commerce Store',
      activeMobileTab: 'chat',
      activeProjectTab: 'vision',
      showPanelSelector: false,
      chatInput: '',
      messages: [],
      projectTabs: [
        { id: 'vision', label: 'Vision' },
        { id: 'pages', label: 'Pages' },
        { id: 'features', label: 'Features' },
        { id: 'journeys', label: 'Journeys' },
        { id: 'design', label: 'Design' },
        { id: 'database', label: 'Database' }
      ]
    }
  },
  methods: {
    clearChat() {
      this.messages = []
    },
    sendMessage() {
      if (this.chatInput.trim()) {
        this.messages.push({
          id: Date.now(),
          type: 'user',
          content: this.chatInput
        })
        this.chatInput = ''
        
        // Simulate AI response
        setTimeout(() => {
          this.messages.push({
            id: Date.now() + 1,
            type: 'ai',
            content: 'I understand. Let me help you with that...'
          })
        }, 1000)
      }
    },
    attachFile() {
      console.log('Attach file clicked')
    },
    openSettings() {
      console.log('Open settings')
    },
    goToDashboard() {
      console.log('Go to dashboard')
    },
    selectPanel(panelId) {
      this.activeProjectTab = panelId
      this.showPanelSelector = false
    },
    checkIfMobile() {
      this.isMobile = window.innerWidth < 768
    }
  },
  mounted() {
    this.checkIfMobile()
    window.addEventListener('resize', this.checkIfMobile)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkIfMobile)
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.flexos-builder {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  height: 100vh;
  background: #0a0a0a;
  color: #ffffff;
  overflow: hidden;
}

/* Desktop Layout */
.desktop-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* Top Navigation */
.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1.5rem;
  height: 60px;
  background: #1a1a1a;
  border-bottom: 1px solid #2a2a2a;
}

.nav-left, .nav-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: #10b981;
  color: white;
  font-weight: bold;
  border-radius: 6px;
}

.logo-text {
  font-size: 1.125rem;
  font-weight: 500;
}

.project-name {
  font-size: 1rem;
  color: #a0a0a0;
}

.mode-selector {
  background: #2a2a2a;
  color: #ffffff;
  border: 1px solid #3a3a3a;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
}

.settings-btn {
  background: transparent;
  border: none;
  color: #a0a0a0;
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s;
}

.settings-btn:hover {
  background: #2a2a2a;
  color: #ffffff;
}

/* Main Content */
.main-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Chat Panel */
.chat-panel {
  width: 50%;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #2a2a2a;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: #1a1a1a;
  border-bottom: 1px solid #2a2a2a;
}

.ai-indicator {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.ai-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: #10b981;
  color: white;
  font-weight: bold;
  font-size: 0.875rem;
  border-radius: 50%;
}

.ai-text {
  font-size: 0.875rem;
  color: #a0a0a0;
}

.clear-btn {
  background: transparent;
  border: none;
  color: #a0a0a0;
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.2s;
}

.clear-btn:hover {
  background: #2a2a2a;
  color: #ffffff;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.message {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.message.user {
  justify-content: flex-end;
}

.message.user .message-content {
  background: #2a2a2a;
  color: #ffffff;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  max-width: 70%;
}

.message.ai .message-content {
  background: transparent;
  color: #e0e0e0;
  max-width: 80%;
  line-height: 1.6;
}

.message-avatar {
  flex-shrink: 0;
}

.chat-input-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: #1a1a1a;
  border-top: 1px solid #2a2a2a;
}

.attach-btn {
  background: transparent;
  border: none;
  color: #a0a0a0;
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s;
}

.attach-btn:hover {
  background: #2a2a2a;
  color: #ffffff;
}

.chat-input {
  flex: 1;
  background: #2a2a2a;
  border: 1px solid #3a3a3a;
  color: #ffffff;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.2s;
}

.chat-input:focus {
  border-color: #10b981;
}

.chat-input::placeholder {
  color: #6a6a6a;
}

/* Project Panel */
.project-panel {
  width: 50%;
  display: flex;
  flex-direction: column;
  background: #0f0f0f;
}

.project-tabs {
  display: flex;
  background: #1a1a1a;
  border-bottom: 1px solid #2a2a2a;
  padding: 0 1.5rem;
}

.tab-button {
  background: transparent;
  border: none;
  color: #6a6a6a;
  padding: 1rem 1.5rem;
  font-size: 0.875rem;
  cursor: pointer;
  position: relative;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tab-button:hover {
  color: #a0a0a0;
}

.tab-button.active {
  color: #10b981;
}

.tab-button.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: #10b981;
}

.tab-icon {
  width: 16px;
  height: 16px;
}

.project-content {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
}

/* Vision Panel */
.vision-panel {
  max-width: 800px;
}

.project-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6a6a6a;
  margin-bottom: 2rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.project-header {
  margin-bottom: 3rem;
}

.project-name-large {
  font-size: 2rem;
  font-weight: 600;
  color: #10b981;
  margin-bottom: 1rem;
}

.project-description {
  font-size: 1rem;
  line-height: 1.6;
  color: #a0a0a0;
}

.objectives-section {
  margin-top: 3rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #ffffff;
}

.objectives-list {
  list-style: none;
  padding: 0;
}

.objectives-list li {
  position: relative;
  padding-left: 1.5rem;
  margin-bottom: 1rem;
  color: #a0a0a0;
  line-height: 1.6;
}

.objectives-list li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #10b981;
  font-weight: bold;
}

/* Pages Panel */
.pages-panel {
  padding: 0;
}

.pages-header {
  padding: 2rem;
  border-bottom: 1px solid #2a2a2a;
}

.pages-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.pages-section {
  padding: 2rem;
}

.section-subtitle {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6a6a6a;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.page-item {
  padding: 1rem;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.page-item:hover {
  background: #2a2a2a;
  border-color: #3a3a3a;
}

.page-name {
  font-size: 1rem;
  color: #ffffff;
}

/* Placeholder Panel */
.placeholder-panel {
  padding: 2rem;
  text-align: center;
  color: #6a6a6a;
}

/* Mobile Layout */
.mobile-layout {
  display: none;
  flex-direction: column;
  height: 100%;
}

.app-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
  height: 56px;
  background: #1a1a1a;
  border-bottom: 1px solid #2a2a2a;
}

.logo-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #10b981;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.mobile-tabs {
  display: flex;
  background: #1a1a1a;
  border-bottom: 1px solid #2a2a2a;
}

.mobile-tab {
  flex: 1;
  background: transparent;
  border: none;
  color: #6a6a6a;
  padding: 1rem;
  font-size: 0.875rem;
  cursor: pointer;
  position: relative;
  transition: color 0.2s;
}

.mobile-tab.active {
  color: #ffffff;
}

.mobile-tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: #10b981;
}

.mobile-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.mobile-chat-view,
.mobile-project-view {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.panel-selector {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: #1a1a1a;
  border-bottom: 1px solid #2a2a2a;
  cursor: pointer;
}

.panel-selector:hover {
  background: #2a2a2a;
}

/* Bottom Sheet */
.bottom-sheet-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
}

.bottom-sheet {
  width: 100%;
  background: #1a1a1a;
  border-radius: 16px 16px 0 0;
  padding-bottom: env(safe-area-inset-bottom);
}

.bottom-sheet-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #2a2a2a;
  font-weight: 500;
}

.bottom-sheet-option {
  display: block;
  width: 100%;
  background: transparent;
  border: none;
  color: #ffffff;
  padding: 1rem 1.5rem;
  text-align: left;
  cursor: pointer;
  transition: background 0.2s;
}

.bottom-sheet-option:hover {
  background: #2a2a2a;
}

.bottom-sheet-option.active {
  color: #10b981;
}

/* Transitions */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.slide-up-enter-from {
  opacity: 0;
}

.slide-up-leave-to {
  opacity: 0;
}

.slide-up-enter-from .bottom-sheet,
.slide-up-leave-to .bottom-sheet {
  transform: translateY(100%);
}

/* Responsive */
@media (max-width: 768px) {
  .desktop-layout {
    display: none;
  }
  
  .mobile-layout {
    display: flex;
  }
}

/* Scrollbar Styling */
.chat-messages::-webkit-scrollbar,
.project-content::-webkit-scrollbar {
  width: 8px;
}

.chat-messages::-webkit-scrollbar-track,
.project-content::-webkit-scrollbar-track {
  background: #1a1a1a;
}

.chat-messages::-webkit-scrollbar-thumb,
.project-content::-webkit-scrollbar-thumb {
  background: #3a3a3a;
  border-radius: 4px;
}

.chat-messages::-webkit-scrollbar-thumb:hover,
.project-content::-webkit-scrollbar-thumb:hover {
  background: #4a4a4a;
}
</style>