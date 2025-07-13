<template>
  <header class="mobile-header">
    <div class="header-content">
      <!-- Logo/Dashboard Link -->
      <NuxtLink to="/dashboard" class="logo-button">
        <span>F</span>
      </NuxtLink>
      
      <!-- Project Name -->
      <h1 class="project-title">{{ project?.name || 'Project' }}</h1>
      
      <!-- Mode Switcher Button -->
      <button @click="$emit('open-mode-selector')" class="mode-button">
        <span class="mode-icon">{{ modeIcon }}</span>
        <svg class="icon chevron" viewBox="0 0 24 24">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  project: any
  mode: 'builder' | 'focus' | 'map'
}

const props = defineProps<Props>()
const emit = defineEmits(['open-mode-selector', 'open-settings'])

// Computed
const modeIcon = computed(() => {
  const icons = {
    builder: '🔨',
    focus: '🎯',
    map: '🗺️'
  }
  return icons[props.mode] || '🔨'
})
</script>

<style scoped>
.mobile-header {
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-primary);
  padding-top: env(safe-area-inset-top, 0);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  height: var(--mobile-header-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  gap: 1rem;
}

/* Logo Button */
.logo-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, var(--primary-500), var(--primary-400));
  color: white;
  font-weight: 700;
  font-size: 1.125rem;
  border-radius: 8px;
  text-decoration: none;
  flex-shrink: 0;
  transition: transform 0.2s;
}

.logo-button:active {
  transform: scale(0.95);
}

/* Project Title */
.project-title {
  flex: 1;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Mode Button */
.mode-button {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.mode-button:active {
  background: var(--bg-quaternary);
  transform: scale(0.95);
}

.mode-icon {
  font-size: 1rem;
}

.icon.chevron {
  width: 16px;
  height: 16px;
  color: var(--text-tertiary);
}
</style>