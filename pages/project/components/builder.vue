<template>
  <div class="flexos-container">
    <!-- Desktop Header -->
    <header class="header" v-if="!isMobile">
      <div class="header-section header-left">
        <div class="logo" @click="goToLandingPage">
          <div class="logo-icon">F</div>
          <span class="logo-text">FlexOS</span>
        </div>
      </div>
      
      <div class="header-section header-center">
        <div class="project-name">{{ projectName }}</div>
      </div>
      
      <div class="header-section header-right">
        <div class="mode-toggle">
          <button 
            v-for="mode in modes" 
            :key="mode.id"
            :class="['mode-btn', { active: currentMode === mode.id }]"
            @click="setMode(mode.id)"
          >
            {{ mode.label }}
          </button>
        </div>
        <button class="settings-btn" @click="openSettings">
          <svg class="icon" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 1v6m0 6v6m3.22-10.22l4.24-4.24m-4.24 12.5l4.24 4.24M21 12h-6m-6 0H3m7.22-3.22L5.98 4.54m4.24 12.5l-4.24 4.24"/>
          </svg>
        </button>
      </div>
    </header>

    <!-- Mobile Header -->
    <header class="mobile-header" v-else>
      <div class="mobile-header-content">
        <div class="logo-mini" @click="goToLandingPage">
          <div class="logo-icon">F</div>
        </div>
        <div class="mobile-title">
          <span>{{ projectName }}</span>
          <span class="mobile-mode">{{ currentModeLabel }}</span>
        </div>
        <button class="mobile-menu-btn" @click="showMobileMenu = true">
          <svg class="icon icon-lg" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="1"/>
            <circle cx="19" cy="12" r="1"/>
            <circle cx="5" cy="12" r="1"/>
          </svg>
        </button>
      </div>
    </header>

    <!-- Desktop Layout -->
    <div class="main-layout" v-if="!isMobile">
      <!-- Chat Panel -->
      <div :class="['chat-panel', { 'panel-expanded': !showRightPanel }]">
        <ChatSection 
          :messages="messages"
          :attachedContext="attachedContext"
          @send-message="handleSendMessage"
          @attach-context="handleAttachContext"
          @remove-context="handleRemoveContext"
        />
      </div>

      <!-- Toggle Button -->
      <button class="panel-toggle-btn" @click="showRightPanel = !showRightPanel">
        <svg class="icon" viewBox="0 0 24 24">
          <polyline :points="showRightPanel ? '15 18 9 12 15 6' : '9 18 15 12 9 6'"/>
        </svg>
      </button>

      <!-- Content Panel -->
      <transition name="slide-panel">
        <div class="content-panel" v-if="showRightPanel">
          <TabNavigation 
            :tabs="tabs"
            :activeTab="activeTab"
            @change-tab="activeTab = $event"
          />
          <div class="tab-content">
            <component :is="activeTabComponent" />
          </div>
        </div>
      </transition>
    </div>

    <!-- Mobile Layout -->
    <div class="mobile-container" v-else>
      <div class="mobile-main">
        <!-- Mobile Chat View -->
        <div v-if="mobileView === 'chat'" class="mobile-chat-view">
          <ChatSection 
            :messages="messages"
            :attachedContext="attachedContext"
            :isMobile="true"
            @send-message="handleSendMessage"
            @attach-context="handleAttachContext"
            @remove-context="handleRemoveContext"
          />
        </div>

        <!-- Mobile Content View -->
        <div v-else class="mobile-content-view">
          <div class="mobile-content-header">
            <button class="back-btn" @click="mobileView = 'chat'">
              <svg class="icon" viewBox="0 0 24 24">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            <h2>{{ activeTabLabel }}</h2>
          </div>
          <div class="mobile-tab-content">
            <component :is="activeTabComponent" :isMobile="true" />
          </div>
        </div>
      </div>

      <!-- Mobile FAB -->
      <transition name="fab">
        <button 
          v-if="mobileView === 'chat'"
          class="mobile-fab"
          @click="showTabSelector = true"
        >
          <svg class="icon" viewBox="0 0 24 24">
            <rect width="7" height="9" x="3" y="3" rx="1"/>
            <rect width="7" height="5" x="14" y="3" rx="1"/>
          </svg>
        </button>
      </transition>
    </div>

    <!-- Mobile Mode Selector -->
    <BottomSheet 
      v-if="isMobile && showMobileMenu"
      @close="showMobileMenu = false"
      title="Settings"
    >
      <div class="mobile-menu-content">
        <div class="menu-section">
          <h3 class="menu-section-title">Mode</h3>
          <div class="mode-list">
            <button 
              v-for="mode in modes"
              :key="mode.id"
              :class="['mode-item', { active: currentMode === mode.id }]"
              @click="setMode(mode.id); showMobileMenu = false"
            >
              <span class="mode-item-label">{{ mode.label }}</span>
              <span class="mode-item-desc">{{ mode.description }}</span>
              <svg v-if="currentMode === mode.id" class="icon check-icon" viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </BottomSheet>

    <!-- Mobile Tab Selector -->
    <BottomSheet
      v-if="isMobile && showTabSelector"
      @close="showTabSelector = false"
      title="Navigate"
      :compact="true"
    >
      <div class="tab-list">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="tab-list-item"
          @click="selectMobileTab(tab.id)"
        >
          <svg class="icon" viewBox="0 0 24 24" v-html="tab.icon"></svg>
          <span>{{ tab.label }}</span>
          <svg class="icon arrow-icon" viewBox="0 0 24 24">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>
    </BottomSheet>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import ChatSection from './chat-section.vue'
import TabNavigation from './tab-navigation.vue'
import BottomSheet from './bottom-sheet.vue'

// Tab Components
import VisionTab from './vision-tab.vue'
// Using VisionTab as placeholder for other tabs
// import PagesTab from './pages-tab.vue'
// import FeaturesTab from './features-tab.vue'
// import JourneysTab from './journeys-tab.vue'
// import DesignTab from './design-tab.vue'
// import DatabaseTab from './database-tab.vue'

export default {
  name: 'FlexOSBuilder',
  components: {
    ChatSection,
    TabNavigation,
    BottomSheet,
    VisionTab,
    // Using VisionTab as placeholder for other tabs
    PagesTab: VisionTab,
    FeaturesTab: VisionTab,
    JourneysTab: VisionTab,
    DesignTab: VisionTab,
    DatabaseTab: VisionTab
  },
  setup() {
    // State
    const projectName = ref('E-commerce Store')
    const currentMode = ref('build')
    const activeTab = ref('vision')
    const showRightPanel = ref(true)
    const isMobile = ref(false)
    const mobileView = ref('chat')
    const showMobileMenu = ref(false)
    const showTabSelector = ref(false)
    const messages = ref([
      {
        id: 1,
        type: 'ai',
        content: "Hi! I'm here to help you build your e-commerce store. What would you like to work on today?"
      }
    ])
    const attachedContext = ref([])

    // Data
    const modes = [
      { id: 'build', label: 'Build', description: 'Create and edit your project' },
      { id: 'focus', label: 'Focus', description: 'Concentrated work mode' },
      { id: 'map', label: 'Map', description: 'View project structure' }
    ]

    const tabs = [
      { id: 'vision', label: 'Vision', icon: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>' },
      { id: 'pages', label: 'Pages', icon: '<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/>' },
      { id: 'features', label: 'Features', icon: '<path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/>' },
      { id: 'journeys', label: 'Journeys', icon: '<path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z"/>' },
      { id: 'design', label: 'Design', icon: '<path d="M3 3h18v18H3V3zm3 3v12h12V6H6z"/><circle cx="12" cy="12" r="3"/>' },
      { id: 'database', label: 'Database', icon: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>' }
    ]

    // Computed
    const currentModeLabel = computed(() => {
      const mode = modes.find(m => m.id === currentMode.value)
      return mode ? mode.label : ''
    })

    const activeTabLabel = computed(() => {
      const tab = tabs.find(t => t.id === activeTab.value)
      return tab ? tab.label : ''
    })

    const activeTabComponent = computed(() => {
      const componentMap = {
        vision: 'VisionTab',
        pages: 'PagesTab',
        features: 'FeaturesTab',
        journeys: 'JourneysTab',
        design: 'DesignTab',
        database: 'DatabaseTab'
      }
      return componentMap[activeTab.value] || 'VisionTab'
    })

    // Methods
    const setMode = (mode) => {
      currentMode.value = mode
    }

    const goToLandingPage = () => {
      // Navigate to landing page
      window.location.href = '/'
    }

    const openSettings = () => {
      // Open settings modal
      console.log('Open settings')
    }

    const handleSendMessage = (message) => {
      messages.value.push({
        id: Date.now(),
        type: 'user',
        content: message.text,
        attachments: message.attachments
      })

      // Simulate AI response
      setTimeout(() => {
        messages.value.push({
          id: Date.now() + 1,
          type: 'ai',
          content: "I'll help you with that! Let me analyze your requirements."
        })
      }, 1000)
    }

    const handleAttachContext = (context) => {
      attachedContext.value.push({
        ...context,
        id: `${context.type}-${Date.now()}`
      })
    }

    const handleRemoveContext = (id) => {
      attachedContext.value = attachedContext.value.filter(item => item.id !== id)
    }

    const selectMobileTab = (tabId) => {
      activeTab.value = tabId
      mobileView.value = 'content'
      showTabSelector.value = false
    }

    const checkMobile = () => {
      isMobile.value = window.innerWidth <= 768
    }

    // Lifecycle
    onMounted(() => {
      checkMobile()
      window.addEventListener('resize', checkMobile)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', checkMobile)
    })

    return {
      projectName,
      currentMode,
      modes,
      currentModeLabel,
      activeTab,
      tabs,
      activeTabLabel,
      activeTabComponent,
      showRightPanel,
      isMobile,
      mobileView,
      showMobileMenu,
      showTabSelector,
      messages,
      attachedContext,
      setMode,
      goToLandingPage,
      openSettings,
      handleSendMessage,
      handleAttachContext,
      handleRemoveContext,
      selectMobileTab
    }
  }
}
</script>

<style scoped>
/* CSS Variables */
:root {
  --bg-primary: #0F1419;
  --bg-secondary: #1A1F26;
  --bg-tertiary: #242B33;
  --bg-quaternary: #2D3440;
  
  --text-primary: #F7F9FA;
  --text-secondary: #D1D9E0;
  --text-tertiary: #8B949E;
  --text-muted: #6E7681;
  
  --border-primary: #30363D;
  --border-secondary: #3A4046;
  
  --primary-500: #16C181;
  --primary-400: #34D399;
  --primary-600: #10A574;
  
  --success: #2EA043;
  --warning: #DB6D28;
  --error: #F85149;
  --info: #58A6FF;
  
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.5);
  
  --header-height: 60px;
  --mobile-header-height: 56px;
}

/* Global Styles */
.flexos-container {
  height: 100vh;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Desktop Header */
.header {
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-primary);
  height: var(--header-height);
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 0 1.5rem;
}

.header-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-left {
  justify-content: flex-start;
}

.header-center {
  justify-content: center;
}

.header-right {
  justify-content: flex-end;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.logo:hover {
  opacity: 0.8;
}

.logo-icon {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, var(--primary-500), var(--primary-400));
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  color: white;
}

.logo-text {
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--primary-500);
}

.project-name {
  font-size: 1rem;
  color: var(--text-secondary);
  background: var(--bg-tertiary);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid var(--border-primary);
}

.mode-toggle {
  display: flex;
  background: var(--bg-tertiary);
  border-radius: 6px;
  padding: 2px;
  border: 1px solid var(--border-primary);
}

.mode-btn {
  padding: 0.375rem 0.75rem;
  border: none;
  background: transparent;
  color: var(--text-tertiary);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.mode-btn:hover {
  color: var(--text-secondary);
}

.mode-btn.active {
  background: var(--bg-quaternary);
  color: var(--primary-500);
}

.settings-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.settings-btn:hover {
  background: var(--bg-tertiary);
}

/* Mobile Header */
.mobile-header {
  background: var(--bg-secondary);
  height: var(--mobile-header-height);
  padding: 0 1rem;
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--border-primary);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.mobile-header-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
}

.logo-mini {
  cursor: pointer;
}

.mobile-title {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.mobile-title span:first-child {
  font-weight: 600;
  font-size: 1rem;
}

.mobile-mode {
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.mobile-menu-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  padding: 0.5rem;
  margin-right: -0.5rem;
  cursor: pointer;
}

/* Main Layout */
.main-layout {
  flex: 1;
  display: flex;
  position: relative;
  overflow: hidden;
}

.chat-panel {
  flex: 0 0 40%;
  background: var(--bg-secondary);
  display: flex;
  flex-direction: column;
  transition: flex 0.3s ease;
}

.chat-panel.panel-expanded {
  flex: 1;
}

.panel-toggle-btn {
  position: absolute;
  left: 40%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
  color: var(--text-secondary);
}

.panel-toggle-btn:hover {
  background: var(--bg-quaternary);
  transform: translate(-50%, -50%) scale(1.1);
}

.content-panel {
  flex: 0 0 60%;
  background: var(--bg-primary);
  display: flex;
  flex-direction: column;
  border-left: 1px solid var(--border-primary);
}

/* Mobile Layout */
.mobile-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-top: var(--mobile-header-height);
}

.mobile-main {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.mobile-chat-view,
.mobile-content-view {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.mobile-content-header {
  background: var(--bg-secondary);
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid var(--border-primary);
}

.mobile-content-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
}

.back-btn {
  background: none;
  border: none;
  color: var(--text-primary);
  padding: 0.5rem;
  margin-left: -0.5rem;
  cursor: pointer;
}

.mobile-tab-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

/* Mobile FAB */
.mobile-fab {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  background: var(--primary-500);
  color: white;
  border: none;
  border-radius: 50%;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(22, 193, 129, 0.4);
  cursor: pointer;
  transition: all 0.3s ease;
}

.mobile-fab:active {
  transform: scale(0.95);
}

/* Mobile Menu Content */
.mobile-menu-content {
  padding: 1rem;
}

.menu-section {
  margin-bottom: 1.5rem;
}

.menu-section-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.75rem;
}

.mode-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.mode-item {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  position: relative;
  transition: all 0.2s ease;
  text-align: left;
}

.mode-item:active {
  transform: scale(0.98);
}

.mode-item.active {
  border-color: var(--primary-500);
  background: rgba(22, 193, 129, 0.1);
}

.mode-item-label {
  font-weight: 600;
  color: var(--text-primary);
}

.mode-item-desc {
  font-size: 0.875rem;
  color: var(--text-tertiary);
}

.check-icon {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 20px;
  height: 20px;
  color: var(--primary-500);
}

/* Tab List */
.tab-list {
  display: flex;
  flex-direction: column;
}

.tab-list-item {
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--border-primary);
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  text-align: left;
  color: var(--text-secondary);
  transition: all 0.2s ease;
}

.tab-list-item:active {
  background: var(--bg-tertiary);
}

.tab-list-item:last-child {
  border-bottom: none;
}

.arrow-icon {
  margin-left: auto;
  opacity: 0.5;
}

/* Tab Content */
.tab-content {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
}

/* Icons */
.icon {
  width: 16px;
  height: 16px;
  stroke: currentColor;
  stroke-width: 2;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.icon-lg {
  width: 24px;
  height: 24px;
}

/* Transitions */
.slide-panel-enter-active,
.slide-panel-leave-active {
  transition: all 0.3s ease;
}

.slide-panel-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-panel-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.fab-enter-active,
.fab-leave-active {
  transition: all 0.3s ease;
}

.fab-enter-from,
.fab-leave-to {
  transform: scale(0);
  opacity: 0;
}

/* Responsive */
@media (min-width: 769px) and (max-width: 1024px) {
  .chat-panel {
    flex: 0 0 45%;
  }
  
  .content-panel {
    flex: 0 0 55%;
  }
  
  .panel-toggle-btn {
    left: 45%;
  }
}
</style>