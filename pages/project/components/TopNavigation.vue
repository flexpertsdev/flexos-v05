<template>
  <nav class="top-nav">
    <!-- Left Section -->
    <div class="nav-left">
      <NuxtLink to="/dashboard" class="logo">
        <span class="logo-icon">F</span>
        <span class="logo-text">FlexOS Builder</span>
      </NuxtLink>
    </div>
    
    <!-- Center Section -->
    <div class="nav-center">
      <NuxtLink to="/dashboard" class="project-name">
        {{ project?.name || 'Untitled Project' }}
      </NuxtLink>
    </div>
    
    <!-- Right Section -->
    <div class="nav-right">
      <!-- Mode Selector -->
      <div class="mode-selector-wrapper">
        <select 
          :value="mode" 
          @change="$emit('update:mode', $event.target.value)"
          class="mode-selector"
        >
          <option value="builder">🔨 Builder</option>
          <option value="focus">🎯 Focus</option>
          <option value="map">🗺️ Map</option>
        </select>
      </div>
      
      <!-- Settings Button -->
      <button @click="$emit('open-settings')" class="settings-btn">
        <svg class="icon" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
interface Props {
  project: any
  mode: 'builder' | 'focus' | 'map'
}

const props = defineProps<Props>()
const emit = defineEmits(['update:mode', 'open-settings'])
</script>

<style scoped>
.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1.5rem;
  height: 60px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-primary);
  flex-shrink: 0;
}

.nav-left,
.nav-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

/* Logo */
.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  font-weight: 600;
  color: var(--text-primary);
  transition: opacity 0.2s;
}

.logo:hover {
  opacity: 0.8;
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
  font-size: 1.125rem;
}

.logo-text {
  font-size: 1.125rem;
  color: var(--text-primary);
}

/* Project Name */
.project-name {
  font-size: 1rem;
  color: var(--text-secondary);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.2s;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
}

.project-name:hover {
  background: var(--bg-quaternary);
  color: var(--text-primary);
  transform: translateY(-1px);
}

/* Mode Selector */
.mode-selector-wrapper {
  position: relative;
}

.mode-selector {
  appearance: none;
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  border: 1px solid var(--border-primary);
  padding: 0.5rem 2.5rem 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.mode-selector:hover {
  background: var(--bg-quaternary);
  color: var(--text-primary);
}

.mode-selector:focus {
  outline: none;
  border-color: var(--primary-500);
}

.mode-selector-wrapper::after {
  content: '▾';
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: var(--text-tertiary);
}

/* Settings Button */
.settings-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s;
}

.settings-btn:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}
</style>