<template>
  <div class="mobile-layout">
    <!-- Mobile Header -->
    <MobileHeader 
      :project="project"
      :mode="mode"
      @open-mode-selector="showModeSelector = true"
      @open-settings="$emit('open-settings')"
    />

    <!-- Mobile Tabs (for builder mode) -->
    <div v-if="mode === 'builder'" class="mobile-tabs">
      <button 
        @click="$emit('update:activeMobileTab', 'chat')"
        class="mobile-tab"
        :class="{ active: activeMobileTab === 'chat' }"
      >
        Chat
      </button>
      <button 
        @click="$emit('update:activeMobileTab', 'project')"
        class="mobile-tab"
        :class="{ active: activeMobileTab === 'project' }"
      >
        Project
      </button>
    </div>

    <!-- Content Area -->
    <main class="mobile-content">
      <!-- Builder Mode -->
      <template v-if="mode === 'builder'">
        <div v-show="activeMobileTab === 'chat'" class="content-panel">
          <ChatPanel :project="project" is-mobile />
        </div>
        
        <div v-show="activeMobileTab === 'project'" class="content-panel">
          <!-- Project Panel Header -->
          <div @click="showProjectSelector = true" class="panel-selector">
            <span>{{ projectTabs.find(t => t.id === activeProjectTab)?.label || 'Vision' }}</span>
            <svg class="icon" viewBox="0 0 24 24">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
          
          <!-- Project Content -->
          <div class="project-content">
            <component :is="activeProjectComponent" :project="project" />
          </div>
        </div>
      </template>

      <!-- Focus Mode -->
      <div v-else-if="mode === 'focus'" class="focus-mode">
        <h2>Focus Mode</h2>
        <p>Deep conversation about your project</p>
      </div>

      <!-- Map Mode -->
      <div v-else-if="mode === 'map'" class="map-mode">
        <h2>Project Map</h2>
        <p>Visual overview coming soon...</p>
      </div>
    </main>

    <!-- Mode Selector Bottom Sheet -->
    <MobileBottomSheet 
      v-model:show="showModeSelector"
      title="Select Mode"
    >
      <button 
        v-for="modeOption in modes"
        :key="modeOption.value"
        @click="selectMode(modeOption.value)"
        class="bottom-sheet-option"
        :class="{ active: mode === modeOption.value }"
      >
        <span class="option-icon">{{ modeOption.icon }}</span>
        <span class="option-label">{{ modeOption.label }}</span>
        <span class="option-description">{{ modeOption.description }}</span>
      </button>
    </MobileBottomSheet>

    <!-- Project Panel Selector Bottom Sheet -->
    <MobileBottomSheet 
      v-model:show="showProjectSelector"
      title="Select Panel"
    >
      <button 
        v-for="tab in projectTabs"
        :key="tab.id"
        @click="selectProjectTab(tab.id)"
        class="bottom-sheet-option"
        :class="{ active: activeProjectTab === tab.id }"
      >
        {{ tab.label }}
      </button>
    </MobileBottomSheet>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineAsyncComponent } from 'vue'
import MobileHeader from './MobileHeader.vue'
import MobileBottomSheet from './MobileBottomSheet.vue'
import ChatPanel from '~/components/builder/ChatPanel.vue'

// Dynamic imports for project panels
const VisionPanel = defineAsyncComponent(() => import('~/components/builder/VisionPanel.vue'))
const PagesPanel = defineAsyncComponent(() => import('~/components/builder/PagesPanel.vue'))
const FeaturesPanel = defineAsyncComponent(() => import('~/components/builder/FeaturesPanel.vue'))
const JourneysPanel = defineAsyncComponent(() => import('~/components/builder/JourneysPanel.vue'))
const DesignPanel = defineAsyncComponent(() => import('~/components/builder/DesignPanel.vue'))
const DatabasePanel = defineAsyncComponent(() => import('~/components/builder/DatabasePanel.vue'))

// Props & Emits
interface Props {
  project: any
  mode: 'builder' | 'focus' | 'map'
  activeProjectTab: string
  activeMobileTab: 'chat' | 'project'
}

const props = defineProps<Props>()
const emit = defineEmits(['update:mode', 'update:activeProjectTab', 'update:activeMobileTab', 'open-settings'])

// State
const showModeSelector = ref(false)
const showProjectSelector = ref(false)

// Data
const modes = [
  { 
    value: 'builder', 
    label: 'Builder', 
    icon: '🔨',
    description: 'Build your project with AI assistance'
  },
  { 
    value: 'focus', 
    label: 'Focus', 
    icon: '🎯',
    description: 'Deep dive into specific topics'
  },
  { 
    value: 'map', 
    label: 'Map', 
    icon: '🗺️',
    description: 'Visual overview of your project'
  }
]

const projectTabs = [
  { id: 'vision', label: 'Vision' },
  { id: 'pages', label: 'Pages' },
  { id: 'features', label: 'Features' },
  { id: 'journeys', label: 'Journeys' },
  { id: 'design', label: 'Design' },
  { id: 'database', label: 'Database' }
]

// Computed
const activeProjectComponent = computed(() => {
  const components: Record<string, any> = {
    vision: VisionPanel,
    pages: PagesPanel,
    features: FeaturesPanel,
    journeys: JourneysPanel,
    design: DesignPanel,
    database: DatabasePanel
  }
  return components[props.activeProjectTab] || VisionPanel
})

// Methods
const selectMode = (mode: 'builder' | 'focus' | 'map') => {
  emit('update:mode', mode)
  showModeSelector.value = false
}

const selectProjectTab = (tabId: string) => {
  emit('update:activeProjectTab', tabId)
  showProjectSelector.value = false
}
</script>

<style scoped>
.mobile-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--bg-primary);
}

/* Mobile Tabs */
.mobile-tabs {
  display: flex;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-primary);
  flex-shrink: 0;
}

.mobile-tab {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--text-tertiary);
  padding: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  position: relative;
  transition: color 0.2s;
  border-bottom: 2px solid transparent;
}

.mobile-tab.active {
  color: var(--primary-500);
  border-bottom-color: var(--primary-500);
}

/* Content Area */
.mobile-content {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.content-panel {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* Panel Selector */
.panel-selector {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-primary);
  cursor: pointer;
  transition: background 0.2s;
}

.panel-selector:hover {
  background: var(--bg-tertiary);
}

.panel-selector span {
  font-weight: 500;
  color: var(--text-primary);
}

.project-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

/* Focus and Map Modes */
.focus-mode,
.map-mode {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  padding: 2rem;
}

.focus-mode h2,
.map-mode h2 {
  font-size: 2rem;
  color: var(--primary-500);
  margin-bottom: 1rem;
}

.focus-mode p,
.map-mode p {
  color: var(--text-secondary);
  font-size: 1.125rem;
}

/* Bottom Sheet Options */
.bottom-sheet-option {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding: 1rem 1.5rem;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
  text-align: left;
  gap: 0.25rem;
}

.bottom-sheet-option:hover {
  background: var(--bg-tertiary);
}

.bottom-sheet-option.active {
  background: var(--bg-tertiary);
}

.option-icon {
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
}

.option-label {
  color: var(--text-primary);
  font-weight: 500;
  font-size: 1rem;
}

.option-description {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.bottom-sheet-option.active .option-label {
  color: var(--primary-500);
}
</style>