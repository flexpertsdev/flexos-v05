<template>
  <div class="builder-layout">
    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <h2>Loading project...</h2>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <h2>Project Error</h2>
      <p>{{ error }}</p>
      <NuxtLink to="/dashboard" class="btn btn-primary">Back to Dashboard</NuxtLink>
    </div>

    <!-- Main Content -->
    <template v-else>
      <DesktopLayout 
        v-if="!isMobile" 
        :project="project"
        v-model:mode="currentMode"
        v-model:activeProjectTab="activeProjectTab"
        @open-settings="showSettings = true"
      />
      
      <MobileLayout 
        v-else 
        :project="project"
        v-model:mode="currentMode"
        v-model:activeProjectTab="activeProjectTab"
        v-model:activeMobileTab="activeMobileTab"
        @open-settings="showSettings = true"
      />

      <!-- Settings Panel (shared) -->
      <SettingsPanel 
        v-model:show="showSettings"
        :is-mobile="isMobile"
        :project="project"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, defineAsyncComponent } from 'vue'

// Import layouts
import DesktopLayout from './DesktopLayout.vue'
import MobileLayout from './MobileLayout.vue'
import SettingsPanel from './SettingsPanel.vue'

// Props
interface Props {
  project: any
}

const props = defineProps<Props>()

// State
const loading = ref(false)
const error = ref('')
const isMobile = ref(false)
const currentMode = ref<'builder' | 'focus' | 'map'>('builder')
const activeProjectTab = ref('vision')
const activeMobileTab = ref<'chat' | 'project'>('chat')
const showSettings = ref(false)

// Methods
const checkIfMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

// Lifecycle
onMounted(() => {
  checkIfMobile()
  window.addEventListener('resize', checkIfMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkIfMobile)
})
</script>

<style scoped>
.builder-layout {
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* Loading and Error States */
.loading-container,
.error-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
}

.loading-container h2,
.error-container h2 {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 1rem;
}

.error-container p {
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 3px solid var(--border-primary);
  border-top-color: var(--primary-500);
  border-radius: 50%;
  margin-bottom: 2rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>