<template>
  <Teleport to="body">
    <transition name="fade">
      <div 
        v-if="show" 
        class="settings-backdrop"
        @click="close"
      />
    </transition>
    
    <transition name="slide-right">
      <div 
        v-if="show" 
        class="settings-panel"
        :class="{ 'is-mobile': isMobile }"
      >
        <!-- Header -->
        <div class="settings-header">
          <h2 class="settings-title">Settings</h2>
          <button @click="close" class="close-btn">
            <svg class="icon" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="settings-content">
          <!-- Project Section -->
          <div class="settings-section">
            <h3 class="section-title">Project</h3>
            <div class="setting-item">
              <label>Project Name</label>
              <input 
                type="text" 
                :value="project?.name" 
                class="setting-input"
                placeholder="Untitled Project"
              />
            </div>
            <div class="setting-item">
              <label>Description</label>
              <textarea 
                :value="project?.description" 
                class="setting-textarea"
                placeholder="Add a description..."
                rows="3"
              />
            </div>
          </div>

          <!-- Appearance Section -->
          <div class="settings-section">
            <h3 class="section-title">Appearance</h3>
            <div class="setting-item">
              <label>Theme</label>
              <select class="setting-select">
                <option>Dark (Default)</option>
                <option>Light</option>
                <option>System</option>
              </select>
            </div>
            <div class="setting-item">
              <label>Accent Color</label>
              <div class="color-options">
                <button 
                  v-for="color in accentColors"
                  :key="color"
                  class="color-option"
                  :style="{ backgroundColor: color }"
                  :class="{ active: color === '#16C181' }"
                />
              </div>
            </div>
          </div>

          <!-- Advanced Section -->
          <div class="settings-section">
            <h3 class="section-title">Advanced</h3>
            <div class="setting-item">
              <label>Export Project</label>
              <button class="btn btn-ghost">
                Download as JSON
              </button>
            </div>
            <div class="setting-item">
              <label>Delete Project</label>
              <button class="btn btn-danger">
                Delete Project
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { watch } from 'vue'

interface Props {
  show: boolean
  isMobile: boolean
  project: any
}

const props = defineProps<Props>()
const emit = defineEmits(['update:show'])

// Data
const accentColors = [
  '#16C181', // Default green
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#EC4899', // Pink
]

// Methods
const close = () => {
  emit('update:show', false)
}

// Lock body scroll when panel is open
watch(() => props.show, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

// Handle escape key
const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.show) {
    close()
  }
}

// Add/remove event listeners
watch(() => props.show, (newVal) => {
  if (newVal) {
    document.addEventListener('keydown', handleEscape)
  } else {
    document.removeEventListener('keydown', handleEscape)
  }
})
</script>

<style scoped>
/* Backdrop */
.settings-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 9998;
  backdrop-filter: blur(2px);
}

/* Panel */
.settings-panel {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 400px;
  max-width: 90vw;
  background: var(--bg-secondary);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.5);
}

.settings-panel.is-mobile {
  width: 100%;
  max-width: 100%;
}

/* Header */
.settings-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-primary);
  padding-top: calc(1.5rem + env(safe-area-inset-top, 0));
}

.settings-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
}

.close-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  padding: 0.5rem;
  margin: -0.5rem;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
}

.close-btn:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

/* Content */
.settings-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  padding-bottom: calc(1.5rem + env(safe-area-inset-bottom, 0));
}

/* Sections */
.settings-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

/* Setting Items */
.setting-item {
  margin-bottom: 1.5rem;
}

.setting-item label {
  display: block;
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.setting-input,
.setting-textarea,
.setting-select {
  width: 100%;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 6px;
  padding: 0.75rem;
  color: var(--text-primary);
  font-size: 0.875rem;
  font-family: inherit;
  transition: all 0.2s;
}

.setting-input:focus,
.setting-textarea:focus,
.setting-select:focus {
  outline: none;
  border-color: var(--primary-500);
  background: var(--bg-quaternary);
}

.setting-textarea {
  resize: vertical;
  min-height: 80px;
}

/* Color Options */
.color-options {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.color-option {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.color-option:hover {
  transform: scale(1.1);
}

.color-option.active {
  border-color: white;
  box-shadow: 0 0 0 3px var(--bg-tertiary);
}

/* Danger Button */
.btn-danger {
  background: #DC2626;
  color: white;
}

.btn-danger:hover {
  background: #B91C1C;
}

/* Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}
</style>