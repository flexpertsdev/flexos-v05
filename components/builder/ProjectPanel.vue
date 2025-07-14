<template>
  <div class="project-panel" :class="{ 'is-mobile': isMobile }">
    <!-- Detail View -->
    <template v-if="detailView">
      <PageDetailView 
        v-if="detailView.type === 'page'"
        :page="detailView.data"
        @back="closeDetailView"
      />
      <FeatureDetailView 
        v-else-if="detailView.type === 'feature'"
        :feature="detailView.data"
        @back="closeDetailView"
      />
      <JourneyDetailView 
        v-else-if="detailView.type === 'journey'"
        :journey="detailView.data"
        @back="closeDetailView"
      />
    </template>
    
    <!-- Normal Panel View -->
    <template v-else>
      <!-- Mobile Header / Panel Selector -->
      <div v-if="isMobile" @click="showPanelSelector = true" class="panel-selector">
        <span>{{ activeTabLabel }}</span>
        <svg class="icon" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </div>

      <!-- Desktop Tabs -->
      <div v-else class="project-tabs">
        <button v-for="tab in projectTabs" :key="tab.id" @click="selectTab(tab.id)" class="tab-button" :class="{ active: activeTab === tab.id }">
          <svg class="icon" viewBox="0 0 24 24" v-html="tab.icon"></svg>
          <span>{{ tab.label }}</span>
        </button>
      </div>

      <!-- Content -->
      <div class="project-content">
        <component 
          :is="activeProjectComponent" 
          :project="project"
          @select:page="openPageDetail"
          @select:feature="openFeatureDetail"
          @select:journey="openJourneyDetail"
          @add:page="handleAddPage"
          @add:feature="handleAddFeature"
          @add:journey="handleAddJourney"
        />
      </div>
    </template>

    <!-- Mobile Panel Selector Bottom Sheet -->
    <transition name="slide-up">
      <div v-if="isMobile && showPanelSelector" class="bottom-sheet-overlay" @click="showPanelSelector = false">
        <div class="bottom-sheet" @click.stop>
          <div class="bottom-sheet-header">Select Panel</div>
          <button v-for="tab in projectTabs" :key="tab.id" @click="selectTab(tab.id)" class="bottom-sheet-option" :class="{ active: activeTab === tab.id }">
            {{ tab.label }}
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineAsyncComponent } from 'vue'
import type { PropType } from 'vue'
import type { Database } from '~/types/database'

type Project = Database['public']['Tables']['projects']['Row']
type Page = Database['public']['Tables']['pages']['Row']
type Feature = Database['public']['Tables']['features']['Row']
type Journey = Database['public']['Tables']['journeys']['Row']

const props = defineProps({
  project: Object as PropType<Project | null>,
  isMobile: Boolean,
  activeTab: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update:activeTab'])

const showPanelSelector = ref(false)
const detailView = ref<{
  type: 'page' | 'feature' | 'journey'
  data: any
} | null>(null)

const projectTabs = [
  { id: 'vision', label: 'Vision', icon: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>' },
  { id: 'pages', label: 'Pages', icon: '<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/>' },
  { id: 'features', label: 'Features', icon: '<path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/>' },
  { id: 'journeys', label: 'Journeys', icon: '<path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z"/>' },
  { id: 'design', label: 'Design', icon: '<path d="M3 3h18v18H3V3zm3 3v12h12V6H6z"/><circle cx="12" cy="12" r="3"/>' },
  { id: 'database', label: 'Database', icon: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>' },
]

// Import detail views
const PageDetailView = defineAsyncComponent(() => import('~/components/builder/PageDetailView.vue'))
const FeatureDetailView = defineAsyncComponent(() => import('~/components/builder/FeatureDetailView.vue'))
const JourneyDetailView = defineAsyncComponent(() => import('~/components/builder/JourneyDetailView.vue'))

const componentMap: Record<string, any> = {
  vision: defineAsyncComponent(() => import('~/components/builder/VisionPanel.vue')),
  pages: defineAsyncComponent(() => import('~/components/builder/PagesPanel.vue')),
  features: defineAsyncComponent(() => import('~/components/builder/FeaturesPanel.vue')),
  journeys: defineAsyncComponent(() => import('~/components/builder/JourneysPanel.vue')),
  design: defineAsyncComponent(() => import('~/components/builder/DesignPanel.vue')),
  database: defineAsyncComponent(() => import('~/components/builder/DatabasePanel.vue')),
}

const activeProjectComponent = computed(() => componentMap[props.activeTab] || componentMap.vision)
const activeTabLabel = computed(() => projectTabs.find(t => t.id === props.activeTab)?.label || 'Vision')

const selectTab = (tabId: string) => {
  emit('update:activeTab', tabId)
  showPanelSelector.value = false
}

// Detail view handlers
const openPageDetail = (page: Page) => {
  detailView.value = { type: 'page', data: page }
}

const openFeatureDetail = (feature: Feature) => {
  detailView.value = { type: 'feature', data: feature }
}

const openJourneyDetail = (journey: Journey) => {
  detailView.value = { type: 'journey', data: journey }
}

const closeDetailView = () => {
  detailView.value = null
}

// Add handlers
const handleAddPage = () => {
  // TODO: Open page creation dialog or trigger AI chat
  console.log('Add new page')
}

const handleAddFeature = () => {
  // TODO: Open feature creation dialog or trigger AI chat
  console.log('Add new feature')
}

const handleAddJourney = () => {
  // TODO: Open journey creation dialog or trigger AI chat
  console.log('Add new journey')
}
</script>

<style scoped>
.project-panel { background: var(--bg-primary); display: flex; flex-direction: column; overflow: hidden; height: 100%; }

/* Desktop Tabs */
.project-tabs { display: flex; background: var(--bg-secondary); border-bottom: 1px solid var(--border-primary); padding: 0 1rem; flex-shrink: 0; }
.tab-button { background: transparent; border: none; color: var(--text-tertiary); padding: 1rem 1.5rem; font-size: 0.875rem; font-weight: 500; cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.2s ease; display: flex; align-items: center; gap: 0.5rem; }
.tab-button:hover { color: var(--text-secondary); }
.tab-button.active { color: var(--primary-500); border-bottom-color: var(--primary-500); }

/* Mobile Panel Selector */
.panel-selector { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.5rem; background: var(--bg-secondary); border-bottom: 1px solid var(--border-primary); cursor: pointer; flex-shrink: 0; }
.panel-selector span { font-weight: 500; }

.project-content { flex: 1; overflow-y: auto; padding: 2rem; }
.is-mobile .project-content { padding: 1rem; }

/* Bottom Sheet */
.bottom-sheet-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); z-index: 1000; display: flex; align-items: flex-end; }
.bottom-sheet { width: 100%; background: var(--bg-secondary); border-radius: 16px 16px 0 0; padding-bottom: env(safe-area-inset-bottom); animation: slideUp 0.3s; }
.bottom-sheet-header { padding: 1rem 1.5rem; border-bottom: 1px solid var(--border-primary); font-weight: 600; text-align: center; }
.bottom-sheet-option { display: block; width: 100%; background: transparent; border: none; color: var(--text-primary); padding: 1.25rem 1.5rem; text-align: center; cursor: pointer; transition: background 0.2s; font-size: 1rem; }
.bottom-sheet-option:hover { background: var(--bg-tertiary); }
.bottom-sheet-option.active { color: var(--primary-500); font-weight: 600; }

.slide-up-enter-active { transition: opacity 0.3s, transform 0.3s; }
.slide-up-leave-active { transition: opacity 0.3s, transform 0.3s; }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; }
.slide-up-enter-from .bottom-sheet, .slide-up-leave-to .bottom-sheet { transform: translateY(100%); }

@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }

.project-content::-webkit-scrollbar { width: 8px; }
.project-content::-webkit-scrollbar-track { background: var(--bg-primary); }
.project-content::-webkit-scrollbar-thumb { background: var(--bg-quaternary); border-radius: 4px; }
.project-content::-webkit-scrollbar-thumb:hover { background: var(--border-secondary); }
</style>
