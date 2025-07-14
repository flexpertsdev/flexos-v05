<template>
  <Teleport to="body">
    <Transition name="sheet">
      <div v-if="show" class="bottom-sheet-container" @click="handleBackdropClick">
        <div 
          ref="sheetRef"
          class="bottom-sheet" 
          @click.stop
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd"
        >
          <!-- Drag handle -->
          <div class="drag-handle-container">
            <div class="drag-handle"></div>
          </div>
          
          <!-- Header -->
          <div class="sheet-header">
            <h3 class="sheet-title">{{ title }}</h3>
            <button @click="close" class="close-btn">
              <svg class="icon" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
          
          <!-- Content -->
          <div class="sheet-content">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'

interface Props {
  show: boolean
  title?: string
  maxHeight?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  maxHeight: '80vh'
})

const emit = defineEmits<{
  'update:show': [value: boolean]
}>()

// Refs
const sheetRef = ref<HTMLElement>()
const startY = ref(0)
const currentY = ref(0)
const isDragging = ref(false)

// Close sheet
const close = () => {
  emit('update:show', false)
}

// Handle backdrop click
const handleBackdropClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget) {
    close()
  }
}

// Touch handling for drag to dismiss
const handleTouchStart = (event: TouchEvent) => {
  const touch = event.touches[0]
  startY.value = touch.clientY
  currentY.value = touch.clientY
  isDragging.value = true
}

const handleTouchMove = (event: TouchEvent) => {
  if (!isDragging.value || !sheetRef.value) return
  
  const touch = event.touches[0]
  currentY.value = touch.clientY
  const deltaY = currentY.value - startY.value
  
  // Only allow dragging down
  if (deltaY > 0) {
    sheetRef.value.style.transform = `translateY(${deltaY}px)`
  }
}

const handleTouchEnd = () => {
  if (!isDragging.value || !sheetRef.value) return
  
  const deltaY = currentY.value - startY.value
  const threshold = 100 // px to trigger dismiss
  
  if (deltaY > threshold) {
    close()
  } else {
    // Snap back
    sheetRef.value.style.transform = ''
  }
  
  isDragging.value = false
}

// Prevent body scroll when sheet is open
watch(() => props.show, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

// Cleanup on unmount
onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<style scoped>
.bottom-sheet-container {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.bottom-sheet {
  background: var(--bg-secondary);
  border-radius: 24px 24px 0 0;
  width: 100%;
  max-width: 600px;
  max-height: v-bind(maxHeight);
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
  padding-bottom: env(safe-area-inset-bottom);
}

/* Drag handle */
.drag-handle-container {
  padding: 0.75rem;
  display: flex;
  justify-content: center;
  cursor: grab;
}

.drag-handle {
  width: 48px;
  height: 4px;
  background: var(--bg-quaternary);
  border-radius: 2px;
}

/* Header */
.sheet-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1.5rem 1rem;
  flex-shrink: 0;
}

.sheet-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-tertiary);
  cursor: pointer;
  padding: 0.5rem;
  margin: -0.5rem;
  border-radius: 8px;
  transition: all 0.2s;
}

.close-btn:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

/* Content */
.sheet-content {
  flex: 1;
  overflow-y: auto;
  padding: 0 1.5rem 1.5rem;
  -webkit-overflow-scrolling: touch;
}

/* Scrollbar */
.sheet-content::-webkit-scrollbar {
  width: 6px;
}

.sheet-content::-webkit-scrollbar-track {
  background: transparent;
}

.sheet-content::-webkit-scrollbar-thumb {
  background: var(--bg-quaternary);
  border-radius: 3px;
}

/* Transitions */
.sheet-enter-active,
.sheet-leave-active {
  transition: opacity 0.3s ease;
}

.sheet-enter-active .bottom-sheet,
.sheet-leave-active .bottom-sheet {
  transition: transform 0.3s ease;
}

.sheet-enter-from {
  opacity: 0;
}

.sheet-enter-from .bottom-sheet {
  transform: translateY(100%);
}

.sheet-leave-to {
  opacity: 0;
}

.sheet-leave-to .bottom-sheet {
  transform: translateY(100%);
}

/* Icon utility */
.icon {
  width: 20px;
  height: 20px;
  stroke: currentColor;
  stroke-width: 2;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>