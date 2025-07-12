<template>
  <div class="wizard-container">
    <!-- Progress Bar -->
    <WizardProgress :progress="progress" />

    <!-- Tab Navigation (Mobile) -->
    <div class="tab-nav">
      <button 
        class="tab-button" 
        :class="{ active: activeTab === 'chat' }"
        @click="$emit('tab-change', 'chat')"
      >
        Chat
      </button>
      <button 
        class="tab-button"
        :class="{ active: activeTab === 'magic' }"
        @click="$emit('tab-change', 'magic')"
      >
        Magic ✨
      </button>
    </div>

    <!-- Chat Panel -->
    <div class="chat-panel">
      <slot name="chat" />
    </div>

    <!-- Process Panel -->
    <div class="process-panel" :class="{ active: activeTab === 'magic' }">
      <slot name="magic" />
    </div>
  </div>
</template>

<script setup lang="ts">
import WizardProgress from './WizardProgress.vue'

interface Props {
  progress?: number
  activeTab?: 'chat' | 'magic'
}

withDefaults(defineProps<Props>(), {
  progress: 0,
  activeTab: 'chat'
})

defineEmits<{
  'tab-change': [tab: 'chat' | 'magic']
}>()
</script>

<style scoped>
/* Main Container */
.wizard-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 100vh;
  height: 100dvh;
  position: relative;
  transition: grid-template-columns 0.3s ease;
  background: var(--bg-primary);
}

/* Chat Panel */
.chat-panel {
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-primary);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

/* Tab Navigation (Mobile Only) */
.tab-nav {
  display: none;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-primary);
  position: sticky;
  top: 0;
  z-index: 10;
}

.tab-button {
  flex: 1;
  padding: 1rem;
  background: transparent;
  border: none;
  color: var(--text-tertiary);
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.2s;
  position: relative;
  cursor: pointer;
}

.tab-button.active {
  color: var(--text-primary);
}

.tab-button::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--primary-500);
  transform: scaleX(0);
  transition: transform 0.3s;
}

.tab-button.active::after {
  transform: scaleX(1);
}

/* Process Panel */
.process-panel {
  background: var(--bg-primary);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .wizard-container {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto 1fr;
  }

  .chat-panel {
    border-right: none;
    grid-row: 3;
  }

  .tab-nav {
    display: flex;
    grid-row: 2;
  }

  .process-panel {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    transform: translateX(100%);
    z-index: 90;
    padding-top: calc(48px + 40px); /* Height of progress bar + tab nav */
  }

  .process-panel.active {
    display: flex;
    transform: translateX(0);
  }
}

/* Tablet Adjustments */
@media (min-width: 769px) and (max-width: 1024px) {
  .wizard-container {
    grid-template-columns: 1.2fr 1fr;
  }
}

/* High DPI Screens */
@media (-webkit-min-device-pixel-ratio: 2) {
  .progress-bar {
    height: 2px;
  }
}

/* iOS Safe Areas */
@supports (-webkit-touch-callout: none) {
  .wizard-container {
    height: -webkit-fill-available;
  }
}

/* Smooth Transitions for viewport changes */
@media (prefers-reduced-motion: no-preference) {
  .wizard-container {
    transition-property: grid-template-columns;
    transition-duration: 0.3s;
    transition-timing-function: ease-out;
  }
}
</style>