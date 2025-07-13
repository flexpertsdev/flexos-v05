<template>
  <Teleport to="body">
    <transition name="fade">
      <div 
        v-if="show" 
        class="bottom-sheet-backdrop"
        @click="close"
      />
    </transition>
    
    <transition name="slide-up">
      <div 
        v-if="show" 
        class="bottom-sheet-container"
        @click.self="close"
      >
        <div class="bottom-sheet" @click.stop>
          <!-- Handle bar for dragging -->
          <div class="bottom-sheet-handle">
            <div class="handle-bar"></div>
          </div>
          
          <!-- Header -->
          <div v-if="title" class="bottom-sheet-header">
            <h3 class="bottom-sheet-title">{{ title }}</h3>
            <button @click="close" class="close-btn">
              <svg class="icon" viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <!-- Content -->
          <div class="bottom-sheet-content">
            <slot />
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { watch, nextTick } from 'vue'

interface Props {
  show: boolean
  title?: string
}

const props = defineProps<Props>()
const emit = defineEmits(['update:show'])

// Methods
const close = () => {
  emit('update:show', false)
}

// Lock body scroll when sheet is open
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
.bottom-sheet-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 9998;
  backdrop-filter: blur(2px);
}

/* Container */
.bottom-sheet-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: flex;
  align-items: flex-end;
  pointer-events: none;
}

/* Bottom Sheet */
.bottom-sheet {
  width: 100%;
  background: var(--bg-secondary);
  border-radius: 20px 20px 0 0;
  padding-bottom: env(safe-area-inset-bottom, 0);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  pointer-events: auto;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.5);
}

/* Handle */
.bottom-sheet-handle {
  padding: 0.75rem;
  display: flex;
  justify-content: center;
}

.handle-bar {
  width: 48px;
  height: 4px;
  background: var(--border-secondary);
  border-radius: 2px;
}

/* Header */
.bottom-sheet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem 1rem;
  border-bottom: 1px solid var(--border-primary);
}

.bottom-sheet-title {
  font-size: 1.125rem;
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
.bottom-sheet-content {
  flex: 1;
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
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

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-enter-from .bottom-sheet,
.slide-up-leave-to .bottom-sheet {
  transform: translateY(100%);
}

/* Ensure smooth animations on mobile */
@media (prefers-reduced-motion: reduce) {
  .fade-enter-active,
  .fade-leave-active,
  .slide-up-enter-active,
  .slide-up-leave-active {
    transition-duration: 0.01ms !important;
  }
}
</style>