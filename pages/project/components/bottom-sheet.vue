<template>
  <teleport to="body">
    <transition name="backdrop">
      <div v-if="show" class="bottom-sheet-backdrop" @click="close"></div>
    </transition>
    
    <transition name="sheet">
      <div v-if="show" class="bottom-sheet" :class="{ compact: compact }">
        <div class="bottom-sheet-handle" @click="close">
          <div class="bottom-sheet-bar"></div>
        </div>
        
        <div v-if="title && !compact" class="bottom-sheet-header">
          <h2 class="bottom-sheet-title">{{ title }}</h2>
        </div>
        
        <div class="bottom-sheet-content">
          <slot></slot>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script>
import { watch } from 'vue'

export default {
  name: 'BottomSheet',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    compact: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'close'],
  setup(props, { emit }) {
    const show = props.modelValue
    
    const close = () => {
      emit('close')
      emit('update:modelValue', false)
    }
    
    // Prevent body scroll when sheet is open
    watch(() => props.modelValue, (newVal) => {
      if (newVal) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    })
    
    return {
      show: props.modelValue,
      close
    }
  }
}
</script>

<style scoped>
.bottom-sheet-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.bottom-sheet {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--bg-secondary);
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  z-index: 1000;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.5);
}

.bottom-sheet.compact {
  max-height: 50vh;
}

.bottom-sheet-handle {
  padding: 0.75rem;
  display: flex;
  justify-content: center;
  cursor: pointer;
}

.bottom-sheet-bar {
  width: 48px;
  height: 4px;
  background: var(--text-muted);
  border-radius: 2px;
}

.bottom-sheet-header {
  padding: 0 1.5rem 1rem;
  border-bottom: 1px solid var(--border-primary);
}

.bottom-sheet-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
}

.bottom-sheet-content {
  flex: 1;
  overflow-y: auto;
  padding-bottom: env(safe-area-inset-bottom, 1rem);
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

.sheet-enter-active,
.sheet-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sheet-enter-from,
.sheet-leave-to {
  transform: translateY(100%);
}
</style>