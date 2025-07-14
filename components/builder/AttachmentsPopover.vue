<template>
  <div>
    <!-- Desktop Popover -->
    <Teleport to="body" v-if="!isMobile">
      <Transition name="popover">
        <div v-if="show" class="popover-container" @click="handleBackdropClick">
          <div 
            ref="popoverRef"
            class="popover" 
            :style="popoverPosition"
            @click.stop
          >
            <div class="popover-header">
              <h3 class="popover-title">Add Attachments</h3>
              <button @click="close" class="close-btn">
                <svg class="icon" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            
            <div class="popover-content">
              <AttachmentSelector 
                :project-id="projectId"
                @select="handleAttach" 
              />
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
    
    <!-- Mobile Bottom Sheet -->
    <MobileBottomSheet 
      v-if="isMobile"
      :show="show"
      @update:show="handleShowUpdate"
      title="Add Attachments"
    >
      <AttachmentSelector 
        :project-id="projectId"
        @select="handleAttach" 
      />
    </MobileBottomSheet>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { Context } from '~/types/chat'

const MobileBottomSheet = defineAsyncComponent(() => import('../common/MobileBottomSheet.vue'))
const AttachmentSelector = defineAsyncComponent(() => import('./AttachmentSelector.vue'))

interface Props {
  show: boolean
  projectId: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:show': [value: boolean]
  'attach': [context: Context]
}>()

// Device detection
const isMobile = ref(false)
const popoverRef = ref<HTMLElement>()

// Popover positioning
const popoverPosition = ref({
  bottom: '80px',
  left: '20px'
})

// Check if mobile
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

// Close popover
const close = () => {
  emit('update:show', false)
}

// Handle backdrop click
const handleBackdropClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget) {
    close()
  }
}

// Handle attachment
const handleAttach = (context: Context) => {
  emit('attach', context)
  close()
}

// Handle show update from MobileBottomSheet
const handleShowUpdate = (value: boolean) => {
  emit('update:show', value)
}

// Position popover above input
const positionPopover = () => {
  // This is a simple positioning - you might want to make it more sophisticated
  const inputArea = document.querySelector('.chat-input-area')
  if (inputArea && popoverRef.value) {
    const rect = inputArea.getBoundingClientRect()
    popoverPosition.value = {
      bottom: `${window.innerHeight - rect.top + 10}px`,
      left: '20px'
    }
  }
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  if (!isMobile.value) {
    positionPopover()
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped>
/* Popover container */
.popover-container {
  position: fixed;
  inset: 0;
  z-index: 1000;
  pointer-events: none;
}

.popover {
  position: fixed;
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  box-shadow: var(--shadow-lg);
  width: 360px;
  max-width: calc(100vw - 40px);
  pointer-events: all;
  animation: popoverIn 0.2s ease-out;
}

@keyframes popoverIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Popover header */
.popover-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--border-primary);
}

.popover-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-tertiary);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s;
}

.close-btn:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

/* Popover content */
.popover-content {
  padding: 1rem;
}

/* Transitions */
.popover-enter-active,
.popover-leave-active {
  transition: opacity 0.2s ease;
}

.popover-enter-from,
.popover-leave-to {
  opacity: 0;
}

/* Update popover sizing for list view */
.popover {
  width: 420px;
}

.popover-content {
  padding: 0;
  max-height: 500px;
  overflow: hidden;
}

/* Icon utility */
.icon {
  width: 18px;
  height: 18px;
  stroke: currentColor;
  stroke-width: 2;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>