<template>
  <div class="desktop-layout">
    <!-- Top Navigation -->
    <TopNavigation 
      :project="project"
      :mode="mode"
      @update:mode="$emit('update:mode', $event)"
      @open-settings="$emit('open-settings')"
    />

    <!-- Main Content -->
    <main class="main-content" v-if="mode === 'builder'">
      <!-- Chat Panel (40%) -->
      <div class="chat-panel">
        <ChatPanel :project="project" />
      </div>

      <!-- Project Panel (60%) -->
      <div class="project-panel">
        <ProjectPanel 
          :project="project" 
          :active-tab="activeProjectTab"
          @update:active-tab="$emit('update:activeProjectTab', $event)"
        />
      </div>
    </main>

    <!-- Focus Mode -->
    <main v-else-if="mode === 'focus'" class="main-content-alt">
      <div class="focus-mode">
        <h2>Focus Mode</h2>
        <p>Deep conversation about your project</p>
      </div>
    </main>

    <!-- Map Mode -->
    <main v-else-if="mode === 'map'" class="main-content-alt">
      <div class="map-mode">
        <h2>Project Map</h2>
        <p>Visual overview coming soon...</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import TopNavigation from './TopNavigation.vue'
import ChatPanel from '~/components/builder/ChatPanel.vue'
import ProjectPanel from '~/components/builder/ProjectPanel.vue'

interface Props {
  project: any
  mode: 'builder' | 'focus' | 'map'
  activeProjectTab: string
}

const props = defineProps<Props>()
const emit = defineEmits(['update:mode', 'update:activeProjectTab', 'open-settings'])
</script>

<style scoped>
.desktop-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* Main Content - Builder Mode */
.main-content {
  display: grid;
  grid-template-columns: 40% 60%;
  flex: 1;
  overflow: hidden;
  gap: 1px;
  background: var(--border-primary);
}

.chat-panel,
.project-panel {
  overflow: hidden;
  background: var(--bg-primary);
}

/* Alternative Content - Focus/Map Modes */
.main-content-alt {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
}

.focus-mode,
.map-mode {
  text-align: center;
  padding: 2rem;
}

.focus-mode h2,
.map-mode h2 {
  font-size: 2.5rem;
  color: var(--primary-500);
  margin-bottom: 1rem;
  font-weight: 600;
}

.focus-mode p,
.map-mode p {
  font-size: 1.25rem;
  color: var(--text-secondary);
}
</style>