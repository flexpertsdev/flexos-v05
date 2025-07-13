<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="modal-overlay" @click="close">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h2>Navigate</h2>
            <button class="close-button" @click="close">✕</button>
          </div>
          
          <div class="nav-sections">
            <!-- Builder Modes -->
            <div class="nav-section">
              <h3 class="section-title">Builder Modes</h3>
              <div class="nav-grid">
                <button
                  v-for="mode in builderModes"
                  :key="mode.id"
                  class="nav-item"
                  @click="navigate(mode.route)"
                >
                  <span class="nav-icon">{{ mode.icon }}</span>
                  <span class="nav-label">{{ mode.label }}</span>
                  <span class="nav-description">{{ mode.description }}</span>
                </button>
              </div>
            </div>
            
            <!-- Wizards -->
            <div class="nav-section">
              <h3 class="section-title">Quick Start Wizards</h3>
              <div class="nav-grid">
                <button
                  v-for="wizard in wizards"
                  :key="wizard.id"
                  class="nav-item nav-item--wizard"
                  @click="navigate(wizard.route)"
                >
                  <span class="nav-icon">{{ wizard.icon }}</span>
                  <span class="nav-label">{{ wizard.label }}</span>
                  <span class="nav-description">{{ wizard.description }}</span>
                </button>
              </div>
            </div>
            
            <!-- Other Links -->
            <div class="nav-section">
              <h3 class="section-title">Other</h3>
              <div class="nav-list">
                <button
                  v-for="link in otherLinks"
                  :key="link.id"
                  class="nav-link"
                  @click="navigate(link.route)"
                >
                  <span class="link-icon">{{ link.icon }}</span>
                  <span class="link-label">{{ link.label }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
// Props
interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()

// Emit
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'navigate': [route: string]
}>()

// Navigation data
const builderModes = [
  {
    id: 'overview',
    label: 'Visual Overview',
    icon: '🗺️',
    description: 'See your entire app structure',
    route: 'overview'
  },
  {
    id: 'focus',
    label: 'Focus Mode',
    icon: '🎯',
    description: 'Deep dive into specific features',
    route: 'focus'
  },
  {
    id: 'builder',
    label: 'Core Builder',
    icon: '🏗️',
    description: 'Build with AI assistance',
    route: '/builder'
  }
]

const wizards = [
  {
    id: 'page',
    label: 'Create Page',
    icon: '📄',
    description: 'Generate a new page',
    route: 'wizard-page'
  },
  {
    id: 'feature',
    label: 'Add Feature',
    icon: '⚡',
    description: 'Add functionality to your app',
    route: 'wizard-feature'
  },
  {
    id: 'design',
    label: 'Design System',
    icon: '🎨',
    description: 'Configure your design system',
    route: 'wizard-design'
  },
  {
    id: 'database',
    label: 'Database Schema',
    icon: '🗄️',
    description: 'Design your data model',
    route: '/wizard/database-generator'
  }
]

const otherLinks = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: '🏠',
    route: '/dashboard'
  },
  {
    id: 'projects',
    label: 'All Projects',
    icon: '📁',
    route: '/projects'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: '⚙️',
    route: '/settings'
  },
  {
    id: 'docs',
    label: 'Documentation',
    icon: '📚',
    route: '/docs'
  }
]

// Methods
const close = () => {
  emit('update:modelValue', false)
}

const navigate = (route: string) => {
  emit('navigate', route)
  close()
}

// Handle escape key
const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.modelValue) {
    close()
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 1000;
}

.modal-content {
  background: var(--bg-primary);
  border-radius: 16px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-2xl);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-color);
  
  h2 {
    font-size: 20px;
    font-weight: 600;
    margin: 0;
  }
}

.close-button {
  padding: 8px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  color: var(--text-secondary);
  border-radius: 8px;
  transition: var(--transition-base);
  
  &:hover {
    background: var(--bg-hover);
  }
}

.nav-sections {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.nav-section {
  margin-bottom: 32px;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
  margin: 0 0 16px 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.nav-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px 16px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  cursor: pointer;
  transition: var(--transition-base);
  text-align: center;
  
  &:hover {
    border-color: var(--color-primary);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
  
  &.nav-item--wizard {
    background: var(--color-primary-light);
    border-color: var(--color-primary-border);
  }
}

.nav-icon {
  font-size: 32px;
}

.nav-label {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.nav-description {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.4;
}

.nav-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: none;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: var(--transition-base);
  text-align: left;
  
  &:hover {
    background: var(--bg-hover);
  }
}

.link-icon {
  font-size: 20px;
}

.link-label {
  font-size: 15px;
  color: var(--text-primary);
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9);
}

/* CSS Variables additions */
:root {
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  --color-primary-border: rgba(59, 130, 246, 0.3);
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-primary-border: rgba(59, 130, 246, 0.5);
  }
}

/* Mobile responsiveness */
@media (max-width: 640px) {
  .modal-content {
    max-height: 100vh;
    height: 100vh;
    border-radius: 0;
  }
  
  .nav-grid {
    grid-template-columns: 1fr;
  }
  
  .nav-sections {
    padding: 16px;
  }
}
</style>