<template>
  <div class="bg-surface-secondary rounded-lg">
    <!-- Header -->
    <div class="p-6 border-b border-surface">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-medium text-text-primary flex items-center gap-2">
            <span>🎯</span>
            App Blueprint
          </h3>
          <p class="text-sm text-text-secondary mt-1">
            Your app's practical blueprint - actions, data, and views
          </p>
        </div>
        <div class="flex items-center gap-4">
          <!-- Completeness Score -->
          <div v-if="blueprint" class="text-right">
            <div class="text-xs text-text-tertiary">Completeness</div>
            <div :class="completenessColorClass" class="text-2xl font-bold">
              {{ completeness }}%
            </div>
          </div>
          <!-- Extract Button -->
          <button
            @click="extractFromConversation"
            :disabled="isExtracting"
            class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <span v-if="isExtracting" class="animate-spin">⚙️</span>
            <span v-else>✨</span>
            {{ isExtracting ? 'Extracting...' : 'Extract from Chat' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div v-if="!blueprint && !loading" class="p-12 text-center">
      <div class="text-5xl mb-4">💬</div>
      <h4 class="text-lg font-medium text-text-primary mb-2">
        No Blueprint Yet
      </h4>
      <p class="text-text-secondary mb-6 max-w-md mx-auto">
        Start chatting about your project in Focus Mode and I'll extract the actions, data, and views
      </p>
      <button
        @click="$emit('switch-mode', 'focus')"
        class="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors flex items-center gap-2 mx-auto"
      >
        <span>🎯</span>
        Enter Focus Mode
      </button>
    </div>

    <!-- Loading State -->
    <div v-else-if="loading" class="p-12 text-center">
      <div class="animate-spin text-4xl mb-4">⚙️</div>
      <p class="text-text-secondary">Loading blueprint...</p>
    </div>

    <!-- Blueprint Content -->
    <div v-else-if="blueprint" class="p-6">
      <!-- Suggested Actions -->
      <div v-if="suggestedActions.length > 0" class="mb-6 p-4 bg-surface rounded-lg border border-primary/20">
        <h4 class="text-sm font-medium text-primary mb-3 flex items-center gap-2">
          <span>💡</span>
          Suggested Next Steps:
        </h4>
        <div class="space-y-2">
          <button 
            v-for="suggestion in suggestedActions" 
            :key="suggestion.action"
            @click="$emit('execute-suggestion', suggestion)"
            class="w-full text-left p-3 bg-surface-hover rounded-lg hover:bg-surface-active transition-colors"
          >
            <div class="font-medium text-text-primary">{{ suggestion.label }}</div>
            <div class="text-sm text-text-secondary">{{ suggestion.description }}</div>
          </button>
        </div>
      </div>

      <!-- Blueprint Tabs -->
      <div class="space-y-6">
        <!-- Tab Navigation -->
        <div class="flex gap-2 border-b border-surface">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'px-4 py-2 text-sm font-medium transition-colors border-b-2',
              activeTab === tab.id 
                ? 'text-primary border-primary' 
                : 'text-text-secondary border-transparent hover:text-text-primary'
            ]"
          >
            <span class="mr-2">{{ tab.icon }}</span>
            {{ tab.label }}
            <span v-if="tab.count" class="ml-2 text-xs bg-surface px-2 py-0.5 rounded-full">
              {{ tab.count }}
            </span>
          </button>
        </div>

        <!-- Tab Content -->
        <div class="min-h-[400px]">
          <!-- Actions Tab -->
          <div v-if="activeTab === 'actions'" class="space-y-4">
            <div v-if="!blueprint.actions?.length" class="text-center py-8 text-text-secondary">
              No actions defined yet. Tell me what users can do in your app.
            </div>
            <div v-else class="grid gap-3">
              <div 
                v-for="action in blueprint.actions" 
                :key="action.id || `${action.verb}-${action.target}`"
                class="p-4 bg-surface rounded-lg hover:bg-surface-hover transition-colors"
              >
                <div class="flex items-start justify-between">
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="px-2 py-1 bg-primary/10 text-primary rounded text-sm font-medium">
                        {{ action.verb }}
                      </span>
                      <span class="text-text-primary font-medium">{{ action.target }}</span>
                    </div>
                    <p v-if="action.description" class="text-sm text-text-secondary mt-1">
                      {{ action.description }}
                    </p>
                    <div v-if="action.contexts?.length" class="flex gap-2 mt-2">
                      <span 
                        v-for="context in action.contexts" 
                        :key="context"
                        class="text-xs bg-surface-secondary px-2 py-1 rounded"
                      >
                        {{ context }}
                      </span>
                    </div>
                  </div>
                  <button 
                    @click="$emit('edit-action', action)"
                    class="text-text-tertiary hover:text-text-primary"
                  >
                    ✏️
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Data Tab -->
          <div v-if="activeTab === 'data'" class="space-y-4">
            <div v-if="!blueprint.dataTypes?.length" class="text-center py-8 text-text-secondary">
              No data types defined yet. Tell me what information your app works with.
            </div>
            <div v-else>
              <!-- Group by category -->
              <div v-for="category in dataCategories" :key="category.name" class="mb-6">
                <h4 class="text-sm font-medium text-text-secondary mb-3 flex items-center gap-2">
                  <span>{{ category.icon }}</span>
                  {{ category.label }}
                </h4>
                <div class="grid gap-3">
                  <div 
                    v-for="dataType in getDataByCategory(category.name)" 
                    :key="dataType.name"
                    class="p-4 bg-surface rounded-lg"
                  >
                    <div class="flex items-start justify-between">
                      <div>
                        <div class="font-medium text-text-primary">{{ dataType.name }}</div>
                        <p v-if="dataType.description" class="text-sm text-text-secondary mt-1">
                          {{ dataType.description }}
                        </p>
                        <div v-if="dataType.operations?.length" class="flex gap-2 mt-2">
                          <span 
                            v-for="op in dataType.operations" 
                            :key="op"
                            class="text-xs bg-surface-secondary px-2 py-1 rounded uppercase"
                          >
                            {{ op }}
                          </span>
                        </div>
                      </div>
                      <span class="text-xs text-text-tertiary">{{ dataType.source || 'memory' }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Views Tab -->
          <div v-if="activeTab === 'views'" class="space-y-4">
            <div v-if="!blueprint.views?.length" class="text-center py-8 text-text-secondary">
              No views defined yet. Tell me what screens users will see.
            </div>
            <div v-else class="grid gap-3">
              <div 
                v-for="view in blueprint.views" 
                :key="view.id || view.name"
                class="p-4 bg-surface rounded-lg"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-2">
                      <span class="font-medium text-text-primary">{{ view.name }}</span>
                      <span class="px-2 py-1 bg-surface-secondary rounded text-xs">
                        {{ view.flexVue || 'full-page' }}
                      </span>
                    </div>
                    <p v-if="view.purpose" class="text-sm text-text-secondary mt-1">
                      {{ view.purpose }}
                    </p>
                    <div v-if="view.actions?.length" class="flex flex-wrap gap-2 mt-2">
                      <span 
                        v-for="action in view.actions" 
                        :key="action"
                        class="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                      >
                        {{ action }}
                      </span>
                    </div>
                    <div v-if="view.variants?.length" class="mt-2">
                      <span class="text-xs text-text-tertiary">Variants: </span>
                      <span 
                        v-for="(variant, idx) in view.variants" 
                        :key="variant.id"
                        class="text-xs text-text-secondary"
                      >
                        {{ variant.name }}{{ idx < view.variants.length - 1 ? ', ' : '' }}
                      </span>
                    </div>
                  </div>
                  <button 
                    @click="$emit('design-view', view)"
                    class="text-primary hover:text-primary-hover ml-4"
                  >
                    🎨 Design
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Workflows Tab -->
          <div v-if="activeTab === 'workflows'" class="space-y-4">
            <div v-if="!blueprint.workflows?.length" class="text-center py-8 text-text-secondary">
              No workflows defined yet. I'll identify them as you describe user journeys.
            </div>
            <div v-else class="grid gap-3">
              <div 
                v-for="workflow in blueprint.workflows" 
                :key="workflow.id"
                class="p-4 bg-surface rounded-lg"
              >
                <div class="font-medium text-text-primary mb-2">{{ workflow.name }}</div>
                <div v-if="workflow.description" class="text-sm text-text-secondary mb-3">
                  {{ workflow.description }}
                </div>
                <div class="flex items-center gap-2 text-sm">
                  <template v-for="(step, idx) in workflow.steps" :key="idx">
                    <span class="px-2 py-1 bg-surface-secondary rounded text-xs">
                      {{ step.action }}
                    </span>
                    <span v-if="idx < workflow.steps.length - 1" class="text-text-tertiary">→</span>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div v-if="completeness >= 70" class="mt-8 pt-6 border-t border-surface">
        <h4 class="text-sm font-medium text-text-secondary mb-4">
          Ready to Build! Generate:
        </h4>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            @click="$emit('generate', 'views')"
            class="p-3 bg-surface rounded-lg hover:bg-surface-hover transition-colors text-sm"
          >
            <span class="block text-2xl mb-1">📱</span>
            <span class="text-text-primary">Views</span>
          </button>
          <button
            @click="$emit('generate', 'data')"
            class="p-3 bg-surface rounded-lg hover:bg-surface-hover transition-colors text-sm"
          >
            <span class="block text-2xl mb-1">💾</span>
            <span class="text-text-primary">Database</span>
          </button>
          <button
            @click="$emit('generate', 'api')"
            class="p-3 bg-surface rounded-lg hover:bg-surface-hover transition-colors text-sm"
          >
            <span class="block text-2xl mb-1">🔌</span>
            <span class="text-text-primary">API</span>
          </button>
          <button
            @click="$emit('switch-mode', 'map')"
            class="p-3 bg-surface rounded-lg hover:bg-surface-hover transition-colors text-sm"
          >
            <span class="block text-2xl mb-1">🗺️</span>
            <span class="text-text-primary">View Map</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { PropType } from 'vue'

const props = defineProps({
  projectId: {
    type: String,
    required: true
  }
})

const emit = defineEmits<{
  'switch-mode': [mode: string]
  'execute-suggestion': [suggestion: any]
  'edit-action': [action: any]
  'design-view': [view: any]
  'generate': [type: string]
}>()

// Blueprint composable
const { 
  blueprint, 
  isLoading: loading, 
  completeness,
  suggestedActions,
  loadBlueprint,
  watchBlueprintUpdates
} = useBlueprint()

// Local state
const activeTab = ref('actions')
const isExtracting = ref(false)

// Tab configuration
const tabs = computed(() => [
  { 
    id: 'actions', 
    label: 'Actions', 
    icon: '⚡', 
    count: blueprint.value?.actions?.length || 0 
  },
  { 
    id: 'data', 
    label: 'Data', 
    icon: '💾', 
    count: blueprint.value?.dataTypes?.length || 0 
  },
  { 
    id: 'views', 
    label: 'Views', 
    icon: '📱', 
    count: blueprint.value?.views?.length || 0 
  },
  { 
    id: 'workflows', 
    label: 'Workflows', 
    icon: '🔄', 
    count: blueprint.value?.workflows?.length || 0 
  }
])

// Data categories
const dataCategories = [
  { name: 'stored', label: 'Stored Data', icon: '💾' },
  { name: 'computed', label: 'Computed Data', icon: '⚙️' },
  { name: 'external', label: 'External Data', icon: '🌐' },
  { name: 'static', label: 'Static Data', icon: '📋' },
  { name: 'state', label: 'State Data', icon: '🎯' }
]

// Completeness color
const completenessColorClass = computed(() => {
  if (completeness.value >= 80) return 'text-green-500'
  if (completeness.value >= 60) return 'text-yellow-500'
  if (completeness.value >= 40) return 'text-orange-500'
  return 'text-red-500'
})

// Get data by category
const getDataByCategory = (category: string) => {
  return blueprint.value?.dataTypes?.filter(dt => dt.category === category) || []
}

// Extract from conversation
const extractFromConversation = async () => {
  isExtracting.value = true
  try {
    // Get recent messages
    const messages = await $fetch<any[]>('/api/chat/messages', {
      query: { projectId: props.projectId, limit: 20 }
    })
    
    // Call extraction endpoint
    await $fetch('/api/vision/extract', {
      method: 'POST',
      body: {
        messages: messages || [],
        projectId: props.projectId
      }
    })
    
    // Reload blueprint
    await loadBlueprint(props.projectId)
  } catch (error) {
    console.error('Extraction failed:', error)
  } finally {
    isExtracting.value = false
  }
}

// Load on mount
onMounted(() => {
  loadBlueprint(props.projectId)
  watchBlueprintUpdates(props.projectId)
})
</script>

<style scoped>
/* Custom styles if needed */
</style>