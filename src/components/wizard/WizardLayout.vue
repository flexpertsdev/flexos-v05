<template>
  <div class="wizard-container">
    <!-- Header with Exit Button -->
    <header class="wizard-header">
      <div class="header-content">
        <button 
          @click="exitWizard"
          class="exit-button"
          aria-label="Exit wizard"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
          <span class="exit-text">Exit</span>
        </button>
        
        <h1 class="wizard-title">{{ wizardName || 'Wizard' }}</h1>
        
        <!-- Tab Navigation (Mobile) -->
        <div class="tab-nav-mobile">
          <button 
            class="tab-button" 
            :class="{ active: activeTab === 'chat' }"
            @click="$emit('tab-change', 'chat')"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span>Chat</span>
          </button>
          <button 
            class="tab-button"
            :class="{ active: activeTab === 'magic' }"
            @click="$emit('tab-change', 'magic')"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5"/>
            </svg>
            <span>Magic</span>
          </button>
        </div>
      </div>
      
      <!-- Progress Bar -->
      <WizardProgress :progress="progress" />
    </header>

    <!-- Main Content Area -->
    <div class="wizard-content">
      <!-- Chat Panel -->
      <div class="chat-panel" :class="{ 'mobile-hidden': activeTab === 'magic' }">
        <slot name="chat" />
      </div>

      <!-- Process Panel -->
      <div class="process-panel" :class="{ 'mobile-active': activeTab === 'magic' }">
        <slot name="magic" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import WizardProgress from './WizardProgress.vue'

interface Props {
  progress?: number
  activeTab?: 'chat' | 'magic'
  wizardName?: string
}

withDefaults(defineProps<Props>(), {
  progress: 0,
  activeTab: 'chat'
})

const emit = defineEmits<{
  'tab-change': [tab: 'chat' | 'magic']
  'exit': []
}>()

const router = useRouter()

const exitWizard = () => {
  emit('exit')
  // Navigate to wizards list or dashboard
  router.push('/wizards')
}
</script>

<style scoped>
/* Main Container */
.wizard-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: 100dvh;
  background: var(--bg-primary);
}

/* Header */
.wizard-header {
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-primary);
  position: sticky;
  top: 0;
  z-index: 100;
  flex-shrink: 0;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  height: 56px;
  gap: 1rem;
}

.exit-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  margin-left: -0.75rem;
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.exit-button:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.exit-text {
  display: none;
}

.wizard-title {
  flex: 1;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Tab Navigation */
.tab-nav-mobile {
  display: none;
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: transparent;
  border: none;
  color: var(--text-tertiary);
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s;
  cursor: pointer;
  border-radius: 8px;
}

.tab-button.active {
  background: rgba(22, 193, 129, 0.1);
  color: var(--primary-500);
}

.tab-button span {
  display: none;
}

/* Content Area */
.wizard-content {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  overflow: hidden;
}

/* Chat Panel */
.chat-panel {
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-primary);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Process Panel */
.process-panel {
  background: var(--bg-primary);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .wizard-title {
    display: none;
  }

  .exit-text {
    display: inline;
  }

  .tab-nav-mobile {
    display: flex;
    gap: 0.5rem;
  }

  .tab-button span {
    display: inline;
  }

  .wizard-content {
    grid-template-columns: 1fr;
    position: relative;
  }

  .chat-panel {
    border-right: none;
  }

  .chat-panel.mobile-hidden {
    display: none;
  }

  .process-panel {
    display: none;
  }

  .process-panel.mobile-active {
    display: flex;
  }
}

/* Desktop Styles */
@media (min-width: 769px) {
  .header-content {
    padding: 0 1.5rem;
    height: 60px;
  }

  .wizard-title {
    font-size: 1.25rem;
    text-align: left;
  }

  .exit-text {
    display: inline;
  }

  .exit-button {
    padding: 0.5rem 1rem;
  }
}

/* Tablet Adjustments */
@media (min-width: 769px) and (max-width: 1024px) {
  .wizard-content {
    grid-template-columns: 1.2fr 1fr;
  }
}

/* iOS Safe Areas */
@supports (-webkit-touch-callout: none) {
  .wizard-container {
    height: -webkit-fill-available;
  }
  
  .wizard-header {
    padding-top: env(safe-area-inset-top, 0);
  }
}
</style>