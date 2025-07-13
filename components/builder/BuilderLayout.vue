<template>
  <div class="builder-layout" :class="{ 'builder-layout--mobile': isMobile }">
    <!-- Desktop Layout -->
    <div v-if="!isMobile" class="builder-desktop">
      <!-- Chat Panel -->
      <div class="builder-panel builder-panel--chat" :style="{ width: `${chatPanelWidth}%` }">
        <BuilderChat />
      </div>
      
      <!-- Resize Handle -->
      <div 
        class="resize-handle"
        @mousedown="startResize"
        @touchstart="startResize"
      />
      
      <!-- Content Panel -->
      <div class="builder-panel builder-panel--content" :style="{ width: `${100 - chatPanelWidth}%` }">
        <BuilderContent :activeView="activeView" />
      </div>
    </div>
    
    <!-- Mobile Layout -->
    <div v-else class="builder-mobile">
      <!-- Content Area -->
      <div class="builder-mobile-content">
        <BuilderContent :activeView="activeView" />
      </div>
      
      <!-- Mobile Bottom Sheet -->
      <BottomSheet v-model="bottomSheetOpen" :snapPoints="[0.1, 0.5, 0.9]">
        <div class="mobile-chat-container">
          <BuilderChat />
        </div>
      </BottomSheet>
      
      <!-- Mobile Bottom Nav -->
      <div class="builder-bottom-nav">
        <button
          v-for="item in mobileNavItems"
          :key="item.id"
          class="nav-item"
          :class="{ 'nav-item--active': activeTab === item.id }"
          @click="handleMobileNavClick(item)"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-label">{{ item.label }}</span>
        </button>
      </div>
    </div>
    
    <!-- Navigation Modal -->
    <BuilderNavModal 
      v-model="navModalOpen"
      @navigate="handleNavigation"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBreakpoint } from '~/composables/useBreakpoint'
import BuilderChat from './BuilderChat.vue'
import BuilderContent from './BuilderContent.vue'
import BuilderNavModal from './BuilderNavModal.vue'
import BottomSheet from '~/components/layout/BottomSheet.vue'

// Router
const router = useRouter()

// Responsive
const breakpoints = useBreakpoint({
  mobile: 640,
  tablet: 768,
  desktop: 1024
})

const isMobile = computed(() => breakpoints.smaller('tablet'))

// Panel resize (desktop)
const chatPanelWidth = ref(40)
const isResizing = ref(false)

const startResize = (e: MouseEvent | TouchEvent) => {
  isResizing.value = true
  document.addEventListener('mousemove', handleResize)
  document.addEventListener('mouseup', stopResize)
  document.addEventListener('touchmove', handleResize)
  document.addEventListener('touchend', stopResize)
}

const handleResize = (e: MouseEvent | TouchEvent) => {
  if (!isResizing.value) return
  
  const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX
  const containerWidth = window.innerWidth
  const newWidth = (clientX / containerWidth) * 100
  
  // Limit panel width between 20% and 80%
  chatPanelWidth.value = Math.min(Math.max(newWidth, 20), 80)
}

const stopResize = () => {
  isResizing.value = false
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
  document.removeEventListener('touchmove', handleResize)
  document.removeEventListener('touchend', stopResize)
}

// Mobile bottom sheet
const bottomSheetOpen = ref(0.1)
const activeTab = ref('chat')
const navModalOpen = ref(false)

// Navigation
const activeView = ref('preview')

const mobileNavItems = [
  { id: 'chat', label: 'Chat', icon: '💬' },
  { id: 'context', label: 'Context', icon: '📎' },
  { id: 'view', label: 'View', icon: '👁️' },
  { id: 'nav', label: 'Navigate', icon: '🧭' }
]

const handleMobileNavClick = (item: typeof mobileNavItems[0]) => {
  switch (item.id) {
    case 'chat':
      bottomSheetOpen.value = 0.5
      activeTab.value = 'chat'
      break
    case 'context':
      bottomSheetOpen.value = 0.5
      activeTab.value = 'context'
      break
    case 'view':
      // Toggle view modes
      activeView.value = activeView.value === 'preview' ? 'code' : 'preview'
      break
    case 'nav':
      navModalOpen.value = true
      break
  }
}

const handleNavigation = (route: string) => {
  navModalOpen.value = false
  
  // Handle navigation based on route
  switch (route) {
    case 'overview':
      router.push('/builder/overview')
      break
    case 'focus':
      router.push('/builder/focus')
      break
    case 'wizard-page':
      router.push('/wizard/page-generator')
      break
    case 'wizard-feature':
      router.push('/wizard/feature-generator')
      break
    case 'wizard-design':
      router.push('/wizard/design-system-generator')
      break
    default:
      router.push(route)
  }
}

// Keyboard shortcuts
const handleKeydown = (e: KeyboardEvent) => {
  // Cmd/Ctrl + K - Toggle chat
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    if (isMobile.value) {
      bottomSheetOpen.value = bottomSheetOpen.value > 0.5 ? 0.1 : 0.9
    }
  }
  
  // Cmd/Ctrl + Shift + V - Toggle view
  if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'v') {
    e.preventDefault()
    activeView.value = activeView.value === 'preview' ? 'code' : 'preview'
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.builder-layout {
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  background: var(--bg-primary);
}

/* Desktop Layout */
.builder-desktop {
  display: flex;
  height: 100%;
}

.builder-panel {
  height: 100%;
  overflow: hidden;
  position: relative;
}

.builder-panel--chat {
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  min-width: 300px;
}

.builder-panel--content {
  flex: 1;
  min-width: 400px;
}

.resize-handle {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: transparent;
  cursor: col-resize;
  z-index: 10;
  
  &:hover {
    background: var(--color-primary);
    opacity: 0.5;
  }
  
  &:active {
    background: var(--color-primary);
    opacity: 1;
  }
}

/* Mobile Layout */
.builder-mobile {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.builder-mobile-content {
  flex: 1;
  overflow: hidden;
  padding-bottom: var(--bottom-nav-height, 60px);
}

.mobile-chat-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.builder-bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: var(--bottom-nav-height, 60px);
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding-bottom: var(--safe-area-bottom, 0);
  z-index: 100;
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px;
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  transition: var(--transition-base);
  min-height: 48px;
  
  &:active {
    transform: scale(0.95);
  }
  
  &.nav-item--active {
    color: var(--color-primary);
  }
}

.nav-icon {
  font-size: 20px;
}

.nav-label {
  font-size: 11px;
  font-weight: 500;
}

/* Ensure mobile-first styles */
@media (hover: hover) {
  .nav-item:hover {
    color: var(--color-primary);
    background: var(--bg-hover);
  }
}

/* CSS Variables */
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f9fafb;
  --bg-hover: rgba(0, 0, 0, 0.05);
  --text-primary: #111827;
  --text-secondary: #6b7280;
  --color-primary: #3b82f6;
  --border-color: #e5e7eb;
  --transition-base: all 0.2s ease;
  --bottom-nav-height: 60px;
  --safe-area-bottom: env(safe-area-inset-bottom);
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #111827;
    --bg-secondary: #1f2937;
    --bg-hover: rgba(255, 255, 255, 0.1);
    --text-primary: #f9fafb;
    --text-secondary: #9ca3af;
    --border-color: #374151;
  }
}
</style>