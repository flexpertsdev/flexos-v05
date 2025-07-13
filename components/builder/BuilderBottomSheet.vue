<template>
  <div 
    class="builder-bottom-sheet"
    :class="{ 
      'builder-bottom-sheet--dragging': isDragging,
      'builder-bottom-sheet--open': currentSnap > 0
    }"
    :style="sheetStyle"
    @touchstart.passive="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
  >
    <!-- Handle -->
    <div 
      class="sheet-handle"
      @mousedown="handleMouseDown"
      role="button"
      :aria-label="`Drag to ${currentSnap > 0.5 ? 'minimize' : 'expand'} chat`"
      tabindex="0"
      @keydown.space.prevent="cycleSnapPoint"
      @keydown.enter.prevent="cycleSnapPoint"
    >
      <div class="handle-bar" />
    </div>
    
    <!-- Content -->
    <div 
      class="sheet-content"
      :style="{ height: contentHeight }"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

interface Props {
  modelValue: number
  snapPoints?: number[]
  minHeight?: number
}

const props = withDefaults(defineProps<Props>(), {
  snapPoints: () => [0.1, 0.5, 0.9],
  minHeight: 100
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

// State
const isDragging = ref(false)
const startY = ref(0)
const startHeight = ref(0)
const currentHeight = ref(window.innerHeight * props.modelValue)
const velocity = ref(0)
const lastY = ref(0)
const lastTime = ref(0)

// Computed
const currentSnap = computed(() => currentHeight.value / window.innerHeight)

const sheetStyle = computed(() => ({
  height: `${currentHeight.value}px`,
  transition: isDragging.value ? 'none' : 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  willChange: isDragging.value ? 'height' : 'auto'
}))

const contentHeight = computed(() => {
  const handleHeight = 32 // Height of the handle
  return `calc(100% - ${handleHeight}px)`
})

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  if (!isDragging.value) {
    currentHeight.value = window.innerHeight * newValue
  }
})

// Touch handlers
const handleTouchStart = (e: TouchEvent) => {
  const touch = e.touches[0]
  startDrag(touch.clientY)
}

const handleTouchMove = (e: TouchEvent) => {
  if (!isDragging.value) return
  e.preventDefault()
  
  const touch = e.touches[0]
  const currentY = touch.clientY
  const currentTime = Date.now()
  
  // Calculate velocity
  if (lastTime.value > 0) {
    const timeDelta = currentTime - lastTime.value
    const yDelta = currentY - lastY.value
    velocity.value = yDelta / timeDelta
  }
  
  lastY.value = currentY
  lastTime.value = currentTime
  
  updateHeight(currentY)
}

const handleTouchEnd = () => {
  endDrag()
}

// Mouse handlers (for desktop testing)
const handleMouseDown = (e: MouseEvent) => {
  startDrag(e.clientY)
  
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

const handleMouseMove = (e: MouseEvent) => {
  if (!isDragging.value) return
  
  const currentY = e.clientY
  const currentTime = Date.now()
  
  // Calculate velocity
  if (lastTime.value > 0) {
    const timeDelta = currentTime - lastTime.value
    const yDelta = currentY - lastY.value
    velocity.value = yDelta / timeDelta
  }
  
  lastY.value = currentY
  lastTime.value = currentTime
  
  updateHeight(currentY)
}

const handleMouseUp = () => {
  endDrag()
  
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
}

// Drag logic
const startDrag = (y: number) => {
  isDragging.value = true
  startY.value = y
  startHeight.value = currentHeight.value
  velocity.value = 0
  lastY.value = y
  lastTime.value = Date.now()
  
  // Add haptic feedback if available
  if ('vibrate' in navigator) {
    navigator.vibrate(10)
  }
}

const updateHeight = (y: number) => {
  const deltaY = startY.value - y
  const newHeight = Math.max(props.minHeight, Math.min(window.innerHeight * 0.95, startHeight.value + deltaY))
  currentHeight.value = newHeight
}

const endDrag = () => {
  if (!isDragging.value) return
  
  isDragging.value = false
  
  // Use velocity to determine snap direction
  let targetHeight: number
  
  if (Math.abs(velocity.value) > 0.5) {
    // Fast swipe - go to next/previous snap point
    if (velocity.value > 0) {
      // Swiping down - go to lower snap point
      targetHeight = findNextLowerSnapPoint(currentHeight.value)
    } else {
      // Swiping up - go to higher snap point
      targetHeight = findNextHigherSnapPoint(currentHeight.value)
    }
  } else {
    // Slow drag - snap to closest point
    targetHeight = findClosestSnapPoint(currentHeight.value)
  }
  
  currentHeight.value = targetHeight
  emit('update:modelValue', targetHeight / window.innerHeight)
  
  // Reset velocity tracking
  velocity.value = 0
  lastY.value = 0
  lastTime.value = 0
}

// Keyboard navigation
const cycleSnapPoint = () => {
  const currentIndex = props.snapPoints.findIndex(
    point => Math.abs(point - currentSnap.value) < 0.05
  )
  
  const nextIndex = (currentIndex + 1) % props.snapPoints.length
  const targetHeight = window.innerHeight * props.snapPoints[nextIndex]
  
  currentHeight.value = targetHeight
  emit('update:modelValue', props.snapPoints[nextIndex])
  
  // Add haptic feedback
  if ('vibrate' in navigator) {
    navigator.vibrate(10)
  }
}

// Helper functions
const findClosestSnapPoint = (height: number): number => {
  const snapHeights = props.snapPoints.map(point => window.innerHeight * point)
  
  return snapHeights.reduce((closest, snap) => {
    return Math.abs(snap - height) < Math.abs(closest - height) ? snap : closest
  })
}

const findNextHigherSnapPoint = (height: number): number => {
  const snapHeights = props.snapPoints.map(point => window.innerHeight * point)
  const higher = snapHeights.filter(snap => snap > height + 10)
  
  return higher.length > 0 ? Math.min(...higher) : snapHeights[snapHeights.length - 1]
}

const findNextLowerSnapPoint = (height: number): number => {
  const snapHeights = props.snapPoints.map(point => window.innerHeight * point)
  const lower = snapHeights.filter(snap => snap < height - 10)
  
  return lower.length > 0 ? Math.max(...lower) : snapHeights[0]
}

// Handle window resize
const handleResize = () => {
  const currentRatio = currentHeight.value / window.innerHeight
  currentHeight.value = window.innerHeight * currentRatio
}

// Lifecycle
onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.builder-bottom-sheet {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--bg-secondary);
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  box-shadow: 0 -2px 16px rgba(0, 0, 0, 0.1);
  z-index: 200;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  
  /* Optimize for mobile rendering */
  contain: layout style paint;
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.builder-bottom-sheet--dragging {
  /* Disable text selection while dragging */
  -webkit-user-select: none;
  user-select: none;
  cursor: grabbing;
}

.sheet-handle {
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  /* Prevent double-tap zoom on mobile */
  touch-action: manipulation;
  /* Larger touch target */
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    inset: -8px;
  }
}

.sheet-handle:active {
  cursor: grabbing;
}

.handle-bar {
  width: 36px;
  height: 4px;
  background: var(--border-secondary);
  border-radius: 2px;
  transition: all 0.2s;
}

.sheet-handle:hover .handle-bar,
.sheet-handle:focus .handle-bar {
  background: var(--text-secondary);
  width: 48px;
}

.sheet-content {
  overflow: hidden;
  /* Prevent overscroll bounce */
  overscroll-behavior: contain;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .builder-bottom-sheet {
    box-shadow: 0 -2px 16px rgba(0, 0, 0, 0.3);
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .builder-bottom-sheet {
    transition: none !important;
  }
}
</style>