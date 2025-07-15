<template>
  <div class="flexos-builder">
    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <h2>Loading project...</h2>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <h2>Project not found</h2>
      <p>{{ error }}</p>
      <NuxtLink to="/dashboard" class="btn btn-primary">Back to Dashboard</NuxtLink>
    </div>

    <!-- Builder Interface -->
    <template v-else>
      <!-- Desktop Layout -->
      <div v-if="!isMobile" class="desktop-layout">
        <nav class="top-nav">
          <div class="nav-left">
            <NuxtLink to="/dashboard" class="logo">
              <span class="logo-icon">F</span>
              <span>FlexOS Builder</span>
            </NuxtLink>
          </div>
          <div class="nav-center">
            <div class="project-name">{{ project?.name || 'Untitled Project' }}</div>
          </div>
          <div class="nav-right">
            <div class="mode-selector-wrapper">
              <select v-model="currentMode" class="mode-selector">
                <option value="builder">Builder</option>
                <option value="focus">Focus</option>
                <option value="map">Map</option>
              </select>
            </div>
            <button @click="openSettings" class="settings-btn">
              <svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            </button>
          </div>
        </nav>

        <main class="main-content" v-if="currentMode === 'builder' || currentMode === 'focus'">
          <ChatPanel 
            :project="project" 
            :mode="currentMode"
            @vision-update="handleVisionUpdate"
            @mode-changed="handleModeChange"
          />
          <ProjectPanel 
            :project="project" 
            v-model:active-tab="activeProjectTab"
            ref="projectPanelRef"
            @switch-mode="handleModeChange"
          />
        </main>
        
        <main v-else-if="currentMode === 'wizard'" class="main-content-alt">
            <MapModePlaceholder />
        </main>
      </div>

      <!-- Mobile Layout -->
      <div v-else class="mobile-layout">
        <header class="app-bar">
          <NuxtLink to="/dashboard" class="logo-button">F</NuxtLink>
          <h1 class="mobile-project-title">{{ project?.name || 'Project' }}</h1>
          <button @click="openSettings" class="settings-btn">
            <svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
          </button>
        </header>

        <div class="mobile-tabs">
          <button @click="activeMobileTab = 'chat'" class="mobile-tab" :class="{ active: activeMobileTab === 'chat' }">Chat</button>
          <button @click="activeMobileTab = 'project'" class="mobile-tab" :class="{ active: activeMobileTab === 'project' }">Project</button>
          <button @click="activeMobileTab = 'map'" class="mobile-tab" :class="{ active: activeMobileTab === 'map' }">Map</button>
        </div>

        <main class="mobile-content" v-if="project">
          <ChatPanel v-show="activeMobileTab === 'chat'" :project="project" is-mobile />
          <ProjectPanel v-show="activeMobileTab === 'project'" :project="project" v-model:active-tab="activeProjectTab" is-mobile />
          <MapModePlaceholder v-show="activeMobileTab === 'map'" />
        </main>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, defineAsyncComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Database } from '~/types/database'

// Protected page - requires authentication
definePageMeta({
  middleware: 'auth'
})

// Import shared components
const ChatPanel = defineAsyncComponent(() => import('~/components/builder/ChatPanel.vue'))
const ProjectPanel = defineAsyncComponent(() => import('~/components/builder/ProjectPanel.vue'))
const FocusModeChat = defineAsyncComponent(() => import('~/components/builder/FocusModePlaceholder.vue'))
const MapModePlaceholder = defineAsyncComponent(() => import('~/components/builder/MapModePlaceholder.vue'))

// Types
type Project = Database['public']['Tables']['projects']['Row']

// Composables
const route = useRoute()
const router = useRouter()
const user = useSupabaseUser()
const supabase = useSupabaseTyped()

// State
const project = ref<Project | null>(null)
const loading = ref(true)
const error = ref('')
const isMobile = ref(false)
const currentMode = ref('builder')
const activeMobileTab = ref('chat')
const activeProjectTab = ref('vision') // Default project tab
const projectPanelRef = ref<any>(null)

// Check query params for initial mode
const initialMode = route.query.mode as string
const isInitialSession = route.query.initial === 'true'

// Methods
const loadProject = async () => {
  loading.value = true
  const slug = route.params.slug as string
  const { data, error: fetchError } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .eq('user_id', user.value!.id)
    .single()
  
  if (fetchError || !data) {
    error.value = fetchError?.message || 'Project not found'
  } else {
    project.value = data
    await supabase
      .from('projects')
      .update({ last_accessed_at: new Date().toISOString() })
      .eq('id', data.id)
  }
  loading.value = false
}

const openSettings = () => console.log('Open settings')

const checkIfMobile = () => isMobile.value = window.innerWidth <= 768

// Handle vision updates from chat
const handleVisionUpdate = (update: any) => {
  console.log('Vision update in project page:', update)
  // Pass directly to ProjectPanel's vision panel
  if (projectPanelRef.value) {
    projectPanelRef.value.updateVision(update)
  }
}

// Handle mode changes from chat
const handleModeChange = (newMode: string) => {
  currentMode.value = newMode
  
  // If switching to focus mode, show blueprint panel
  if (newMode === 'focus') {
    activeProjectTab.value = 'blueprint'
  }
}

// Lifecycle
onMounted(async () => {
  checkIfMobile()
  window.addEventListener('resize', checkIfMobile)
  await loadProject()
  
  // Set initial mode from query params
  if (initialMode === 'focus') {
    currentMode.value = 'focus'
    if (isMobile.value) {
      activeMobileTab.value = 'focus'
    }
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', checkIfMobile)
})

watch(() => route.params.slug, () => {
  if (route.params.slug) loadProject()
})

// Note: This page requires authentication middleware
</script>

<style>
/* Global Styles - not scoped */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

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
    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
    --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.4);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.flexos-builder {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  height: 100vh;
  height: 100dvh; /* Dynamic viewport height */
  background: var(--bg-primary);
  color: var(--text-primary);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Common icon style */
.icon {
  width: 18px;
  height: 18px;
  stroke: currentColor;
  stroke-width: 2;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* Loading and Error States */
.loading-container, .error-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
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
@keyframes spin { to { transform: rotate(360deg); } }

/* --- Desktop Layout --- */
.desktop-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.5rem;
  height: 60px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-primary);
  flex-shrink: 0;
}
.nav-left, .nav-right { display: flex; align-items: center; gap: 0.75rem; }
.nav-center { flex: 1; display: flex; justify-content: center; }

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--primary-500);
}
.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, var(--primary-500), var(--primary-400));
  color: white;
  font-weight: 900;
  border-radius: 8px;
}

.project-name {
  font-size: 1rem;
  color: var(--text-secondary);
  background: var(--bg-tertiary);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid var(--border-primary);
}

.mode-selector-wrapper { position: relative; }
.mode-selector {
  appearance: none;
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  border: 1px solid var(--border-primary);
  padding: 0.5rem 2rem 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}
.mode-selector:hover { background: var(--bg-quaternary); color: var(--text-primary); }
.mode-selector-wrapper::after {
    content: '▾';
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: var(--text-tertiary);
}

.settings-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  border-radius: 6px;
  transition: all 0.2s;
}
.settings-btn:hover { background: var(--bg-tertiary); color: var(--text-primary); }

.main-content {
  display: grid;
  grid-template-columns: 40% 60%;
  flex: 1;
  overflow: hidden;
  gap: 1px;
  background: var(--border-primary);
}

.main-content-alt {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* --- Mobile Layout --- */
.mobile-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.app-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
  height: 56px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-primary);
  flex-shrink: 0;
}
.logo-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: var(--primary-500);
  color: white;
  font-weight: 700;
  font-size: 1.125rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  text-decoration: none;
}
.mobile-project-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-primary);
}

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
  padding: 0.875rem;
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

.mobile-content {
  flex: 1;
  overflow: hidden;
  position: relative;
}
.mobile-content > * {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

/* Hide desktop/mobile layouts based on screen size */
.mobile-layout { display: none; }
@media (max-width: 768px) {
  .desktop-layout { display: none; }
  .mobile-layout { display: flex; }
}
</style>