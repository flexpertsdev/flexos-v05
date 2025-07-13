import { ref, computed } from 'vue'
import type { Ref } from 'vue'

export interface ContextItem {
  id: string
  type: 'file' | 'component' | 'config' | 'reference'
  name: string
  path?: string
  content?: string
  active: boolean
  icon?: string
  metadata?: Record<string, any>
}

export interface BuilderContext {
  project: string
  framework: string
  currentFile?: string
  currentView: 'preview' | 'code' | 'design' | 'database'
  device: 'mobile' | 'tablet' | 'desktop' | 'custom'
  theme: 'light' | 'dark'
  items: ContextItem[]
}

export function useBuilderContext() {
  // Context state
  const context = ref<BuilderContext>({
    project: 'my-app',
    framework: 'vue',
    currentView: 'preview',
    device: 'desktop',
    theme: 'light',
    items: []
  })

  // Computed
  const activeItems = computed(() => 
    context.value.items.filter(item => item.active)
  )

  const contextSummary = computed(() => {
    const active = activeItems.value
    if (active.length === 0) return 'No context items selected'
    
    const types = [...new Set(active.map(item => item.type))]
    return `${active.length} items (${types.join(', ')})`
  })

  // Methods
  function addContextItem(item: Omit<ContextItem, 'id' | 'active'>) {
    const newItem: ContextItem = {
      ...item,
      id: generateId(),
      active: true
    }
    context.value.items.push(newItem)
    return newItem
  }

  function removeContextItem(id: string) {
    const index = context.value.items.findIndex(item => item.id === id)
    if (index > -1) {
      context.value.items.splice(index, 1)
    }
  }

  function toggleContextItem(id: string) {
    const item = context.value.items.find(item => item.id === id)
    if (item) {
      item.active = !item.active
    }
  }

  function clearContext() {
    context.value.items = []
  }

  function updateContext(updates: Partial<BuilderContext>) {
    context.value = { ...context.value, ...updates }
  }

  function setView(view: BuilderContext['currentView']) {
    context.value.currentView = view
  }

  function setDevice(device: BuilderContext['device']) {
    context.value.device = device
  }

  function setTheme(theme: BuilderContext['theme']) {
    context.value.theme = theme
  }

  // Add default context items
  function initializeDefaultContext() {
    addContextItem({
      type: 'file',
      name: 'App.vue',
      path: '/src/App.vue',
      icon: '📄',
      content: `<template>
  <div id="app">
    <router-view />
  </div>
</template>`
    })

    addContextItem({
      type: 'config',
      name: 'package.json',
      path: '/package.json',
      icon: '📦',
      metadata: {
        dependencies: {
          vue: '^3.3.0',
          'vue-router': '^4.2.0'
        }
      }
    })
  }

  // Helper
  function generateId(): string {
    return `ctx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  return {
    // State
    context: context as Readonly<Ref<BuilderContext>>,
    activeItems,
    contextSummary,

    // Methods
    addContextItem,
    removeContextItem,
    toggleContextItem,
    clearContext,
    updateContext,
    setView,
    setDevice,
    setTheme,
    initializeDefaultContext
  }
}