<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition name="backdrop">
      <div 
        v-if="isOpen"
        class="bottom-sheet-backdrop"
        @click="close"
      />
    </Transition>

    <!-- Bottom Sheet -->
    <Transition name="sheet">
      <div 
        v-if="isOpen"
        ref="sheetRef"
        class="bottom-sheet"
        :class="{ 'full-height': isFullHeight }"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
      >
        <!-- Handle Bar -->
        <div class="sheet-handle" @click="toggleHeight">
          <div class="handle-bar" />
        </div>

        <!-- Header -->
        <div class="sheet-header">
          <h2 class="sheet-title">{{ title || 'Menu' }}</h2>
          <button 
            @click="close"
            class="close-button"
            aria-label="Close menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="sheet-content">
          <slot>
            <!-- Default Navigation Content -->
            <nav class="navigation-menu">
              <NuxtLink
                v-for="item in navigationItems"
                :key="item.path"
                :to="item.path"
                class="nav-item"
                :class="{ active: isActiveRoute(item.path) }"
                @click="handleNavClick"
              >
                <span class="nav-icon">{{ item.icon }}</span>
                <span class="nav-label">{{ item.label }}</span>
                <svg class="nav-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </NuxtLink>
            </nav>

            <!-- User Section (if needed) -->
            <div v-if="showUserSection" class="user-section">
              <div class="section-divider" />
              <button class="nav-item">
                <span class="nav-icon">⚙️</span>
                <span class="nav-label">Settings</span>
              </button>
              <button class="nav-item">
                <span class="nav-icon">🚪</span>
                <span class="nav-label">Sign Out</span>
              </button>
            </div>
          </slot>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useNavigation } from '~/composables/useNavigation'

interface Props {
  modelValue?: boolean
  title?: string
  showUserSection?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  showUserSection: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

const route = useRoute()
const { navigationItems, closeMenu } = useNavigation()

// Local state
const isOpen = ref(props.modelValue)
const isFullHeight = ref(false)
const sheetRef = ref<HTMLElement>()

// Touch handling
const touchStartY = ref(0)
const touchEndY = ref(0)
const isDragging = ref(false)

// Watch for external changes
watch(() => props.modelValue, (newVal) => {
  isOpen.value = newVal
})

// Watch internal changes
watch(isOpen, (newVal) => {
  emit('update:modelValue', newVal)
  if (!newVal) {
    emit('close')
    isFullHeight.value = false
  }
})

// Methods
const close = () => {
  isOpen.value = false
  closeMenu()
}

const toggleHeight = () => {
  isFullHeight.value = !isFullHeight.value
}

const handleNavClick = () => {
  close()
}

const isActiveRoute = (path: string) => {
  return route.path === path || route.path.startsWith(path + '/')
}

// Touch handlers for swipe to dismiss
const handleTouchStart = (e: TouchEvent) => {
  touchStartY.value = e.touches[0].clientY
  isDragging.value = true
}

const handleTouchMove = (e: TouchEvent) => {
  if (!isDragging.value) return
  
  const currentY = e.touches[0].clientY
  const diff = currentY - touchStartY.value
  
  // Only allow dragging down
  if (diff > 0 && sheetRef.value) {
    sheetRef.value.style.transform = `translateY(${diff}px)`
  }
}

const handleTouchEnd = (e: TouchEvent) => {
  if (!isDragging.value) return
  
  touchEndY.value = e.changedTouches[0].clientY
  isDragging.value = false
  
  const diff = touchEndY.value - touchStartY.value
  
  // If dragged more than 100px down, close the sheet
  if (diff > 100) {
    close()
  } else if (sheetRef.value) {
    // Snap back
    sheetRef.value.style.transform = ''
  }
}

// Handle escape key
const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isOpen.value) {
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
/* Backdrop */
.bottom-sheet-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 998;
  backdrop-filter: blur(4px);
}

/* Bottom Sheet */
.bottom-sheet {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--bg-secondary);
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.2);
  z-index: 999;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.bottom-sheet.full-height {
  max-height: calc(100vh - env(safe-area-inset-top, 20px));
  border-radius: 0;
}

/* Handle */
.sheet-handle {
  padding: 0.75rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
}

.handle-bar {
  width: 48px;
  height: 4px;
  background: var(--text-tertiary);
  border-radius: 2px;
  transition: background 0.2s ease;
}

.sheet-handle:hover .handle-bar {
  background: var(--text-secondary);
}

/* Header */
.sheet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem 1rem;
  border-bottom: 1px solid var(--border-primary);
}

.sheet-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
}

.close-button {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.close-button:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

/* Content */
.sheet-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0;
  padding-bottom: calc(1rem + env(safe-area-inset-bottom, 0));
}

/* Navigation Menu */
.navigation-menu {
  display: flex;
  flex-direction: column;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  color: var(--text-primary);
  text-decoration: none;
  background: none;
  border: none;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.nav-item:hover {
  background: var(--bg-tertiary);
}

.nav-item.active {
  background: rgba(22, 193, 129, 0.1);
  color: var(--primary-500);
}

.nav-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 24px;
  background: var(--primary-500);
  border-radius: 0 2px 2px 0;
}

.nav-icon {
  font-size: 1.25rem;
  width: 32px;
  text-align: center;
}

.nav-label {
  flex: 1;
}

.nav-arrow {
  opacity: 0.5;
}

/* User Section */
.user-section {
  margin-top: 1rem;
}

.section-divider {
  height: 1px;
  background: var(--border-primary);
  margin: 0 1.5rem 1rem;
}

/* Transitions */
.backdrop-enter-active,
.backdrop-leave-active {
  transition: opacity 0.3s ease;
}

.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}

.sheet-enter-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sheet-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sheet-enter-from,
.sheet-leave-to {
  transform: translateY(100%);
}

/* Full height animation */
.bottom-sheet.full-height .sheet-handle {
  padding-top: calc(0.75rem + env(safe-area-inset-top, 0));
}
</style>