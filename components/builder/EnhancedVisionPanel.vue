<template>
  <div class="bg-surface-secondary rounded-lg">
    <!-- Header -->
    <div class="p-6 border-b border-surface">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-medium text-text-primary flex items-center gap-2">
            <span>🎯</span>
            Project Vision
          </h3>
          <p class="text-sm text-text-secondary mt-1">
            AI-powered vision from your conversations
          </p>
        </div>
        <div class="flex items-center gap-4">
          <!-- Readiness Score -->
          <div v-if="vision" class="text-right">
            <div class="text-xs text-text-tertiary">Readiness</div>
            <div :class="readinessColorClass" class="text-2xl font-bold">
              {{ vision.readiness_score }}%
            </div>
          </div>
          <!-- Analyze Button -->
          <button
            @click="analyzeConversation"
            :disabled="isAnalyzing"
            class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <span v-if="isAnalyzing" class="animate-spin">⚙️</span>
            <span v-else>✨</span>
            {{ isAnalyzing ? 'Analyzing...' : 'Analyze Chat' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div v-if="!vision && !loading" class="p-12 text-center">
      <div class="text-5xl mb-4">💬</div>
      <h4 class="text-lg font-medium text-text-primary mb-2">
        No Vision Document Yet
      </h4>
      <p class="text-text-secondary mb-6 max-w-md mx-auto">
        Start chatting about your project and I'll help extract a clear vision to guide development
      </p>
      <button
        @click="analyzeConversation"
        class="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors flex items-center gap-2 mx-auto"
      >
        <span>✨</span>
        Create Vision from Chat
      </button>
    </div>

    <!-- Loading State -->
    <div v-else-if="loading" class="p-12 text-center">
      <div class="animate-spin text-4xl mb-4">⚙️</div>
      <p class="text-text-secondary">Loading vision document...</p>
    </div>

    <!-- Vision Content -->
    <div v-else-if="vision" class="p-6">
      <!-- AI Questions Section -->
      <div v-if="vision.questions_for_user?.length > 0" class="mb-6 p-4 bg-surface rounded-lg border border-primary/20">
        <h4 class="text-sm font-medium text-primary mb-3 flex items-center gap-2">
          <span>💭</span>
          AI wants to know more:
        </h4>
        <div class="space-y-2">
          <div 
            v-for="(question, index) in vision.questions_for_user" 
            :key="index"
            class="text-sm text-text-primary flex items-start gap-2"
          >
            <span class="text-primary">•</span>
            <span>{{ question }}</span>
          </div>
        </div>
        <p class="text-xs text-text-secondary mt-3">
          Answer these in the chat to improve your vision clarity
        </p>
      </div>

      <!-- Vision Tabs -->
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
          </button>
        </div>

        <!-- Tab Content -->
        <div class="min-h-[400px]">
          <!-- Overview Tab -->
          <div v-if="activeTab === 'overview'" class="space-y-6">
            <div>
              <h4 class="text-sm font-medium text-text-secondary mb-2">Project Name</h4>
              <p class="text-xl font-medium text-text-primary">
                {{ vision.project_name || 'Unnamed Project' }}
              </p>
            </div>
            
            <div>
              <h4 class="text-sm font-medium text-text-secondary mb-2">Tagline</h4>
              <p class="text-lg text-text-primary italic">
                {{ vision.tagline || 'No tagline yet' }}
              </p>
            </div>
            
            <div>
              <h4 class="text-sm font-medium text-text-secondary mb-2">Description</h4>
              <p class="text-text-primary whitespace-pre-wrap">
                {{ vision.description || 'No description yet' }}
              </p>
            </div>

            <div>
              <h4 class="text-sm font-medium text-text-secondary mb-2">Value Proposition</h4>
              <p class="text-text-primary">
                {{ vision.value_proposition || 'Not defined yet' }}
              </p>
            </div>
          </div>

          <!-- Strategy Tab -->
          <div v-if="activeTab === 'strategy'" class="space-y-6">
            <div>
              <h4 class="text-sm font-medium text-text-secondary mb-3">🎯 Objectives</h4>
              <div class="space-y-2">
                <div v-for="(obj, index) in vision.objectives" :key="index" class="flex items-start gap-2">
                  <span class="text-green-500">✓</span>
                  <span class="text-text-primary">{{ obj }}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 class="text-sm font-medium text-text-secondary mb-3">🔥 Problems We're Solving</h4>
              <div class="space-y-2">
                <div v-for="(problem, index) in vision.problems" :key="index" class="flex items-start gap-2">
                  <span class="text-orange-500">•</span>
                  <span class="text-text-primary">{{ problem }}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 class="text-sm font-medium text-text-secondary mb-3">💡 Our Solutions</h4>
              <div class="space-y-2">
                <div v-for="(solution, index) in vision.solutions" :key="index" class="flex items-start gap-2">
                  <span class="text-blue-500">→</span>
                  <span class="text-text-primary">{{ solution }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Audience Tab -->
          <div v-if="activeTab === 'audience'" class="space-y-6">
            <div>
              <h4 class="text-sm font-medium text-text-secondary mb-3">Primary Audience</h4>
              <p class="text-text-primary mb-4">
                {{ vision.target_audience?.primary || 'Not defined' }}
              </p>
              
              <div v-if="vision.target_audience?.characteristics?.length > 0">
                <h5 class="text-xs font-medium text-text-tertiary mb-2">Characteristics</h5>
                <div class="flex flex-wrap gap-2">
                  <span 
                    v-for="(char, index) in vision.target_audience.characteristics" 
                    :key="index"
                    class="px-3 py-1 bg-surface rounded-full text-sm text-text-primary"
                  >
                    {{ char }}
                  </span>
                </div>
              </div>
            </div>

            <div v-if="vision.target_audience?.secondary">
              <h4 class="text-sm font-medium text-text-secondary mb-3">Secondary Audience</h4>
              <p class="text-text-primary">
                {{ vision.target_audience.secondary }}
              </p>
            </div>

            <div v-if="vision.user_journeys?.length > 0">
              <h4 class="text-sm font-medium text-text-secondary mb-3">User Journeys</h4>
              <div class="space-y-4">
                <div 
                  v-for="(journey, index) in vision.user_journeys" 
                  :key="index"
                  class="p-4 bg-surface rounded-lg"
                >
                  <h5 class="font-medium text-text-primary mb-1">{{ journey.persona }}</h5>
                  <p class="text-sm text-text-secondary mb-3">Goal: {{ journey.goal }}</p>
                  <div class="space-y-1">
                    <div 
                      v-for="(step, stepIndex) in journey.steps" 
                      :key="stepIndex"
                      class="text-sm text-text-primary flex items-start gap-2"
                    >
                      <span class="text-text-tertiary">{{ stepIndex + 1 }}.</span>
                      <span>{{ step }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Features Tab -->
          <div v-if="activeTab === 'features'" class="space-y-6">
            <div>
              <h4 class="text-sm font-medium text-text-secondary mb-3">🚀 Core Features</h4>
              <div class="space-y-2">
                <div 
                  v-for="(feature, index) in vision.features?.core" 
                  :key="index" 
                  class="flex items-start gap-2"
                >
                  <span class="text-green-500">⭐</span>
                  <span class="text-text-primary">{{ feature }}</span>
                </div>
              </div>
            </div>

            <div v-if="vision.features?.nice_to_have?.length > 0">
              <h4 class="text-sm font-medium text-text-secondary mb-3">✨ Nice to Have</h4>
              <div class="space-y-2">
                <div 
                  v-for="(feature, index) in vision.features.nice_to_have" 
                  :key="index" 
                  class="flex items-start gap-2"
                >
                  <span class="text-blue-500">•</span>
                  <span class="text-text-primary">{{ feature }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Design Tab -->
          <div v-if="activeTab === 'design'" class="space-y-6">
            <div>
              <h4 class="text-sm font-medium text-text-secondary mb-3">Design Principles</h4>
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="(principle, index) in vision.design_principles" 
                  :key="index"
                  class="px-3 py-1 bg-surface rounded-full text-sm text-text-primary"
                >
                  {{ principle }}
                </span>
              </div>
            </div>

            <div>
              <h4 class="text-sm font-medium text-text-secondary mb-3">Brand Personality</h4>
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="(trait, index) in vision.brand_personality" 
                  :key="index"
                  class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >
                  {{ trait }}
                </span>
              </div>
            </div>

            <div v-if="vision.ui_style">
              <h4 class="text-sm font-medium text-text-secondary mb-3">UI Style</h4>
              <div class="space-y-3">
                <div>
                  <span class="text-xs text-text-tertiary">Tone:</span>
                  <span class="ml-2 text-text-primary">{{ vision.ui_style.tone }}</span>
                </div>
                <div v-if="vision.ui_style.colors?.length > 0">
                  <span class="text-xs text-text-tertiary">Colors:</span>
                  <div class="flex gap-2 mt-1">
                    <div 
                      v-for="(color, index) in vision.ui_style.colors" 
                      :key="index"
                      class="w-8 h-8 rounded"
                      :style="{ backgroundColor: color }"
                      :title="color"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div v-if="vision.readiness_score >= 70" class="mt-8 pt-6 border-t border-surface">
        <h4 class="text-sm font-medium text-text-secondary mb-4">
          Ready to Build! Generate:
        </h4>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            @click="generateArtifacts('features')"
            class="p-3 bg-surface rounded-lg hover:bg-surface-hover transition-colors text-sm"
          >
            <span class="block text-2xl mb-1">🚀</span>
            <span class="text-text-primary">Features</span>
          </button>
          <button
            @click="generateArtifacts('pages')"
            class="p-3 bg-surface rounded-lg hover:bg-surface-hover transition-colors text-sm"
          >
            <span class="block text-2xl mb-1">📄</span>
            <span class="text-text-primary">Pages</span>
          </button>
          <button
            @click="generateArtifacts('journeys')"
            class="p-3 bg-surface rounded-lg hover:bg-surface-hover transition-colors text-sm"
          >
            <span class="block text-2xl mb-1">🗺️</span>
            <span class="text-text-primary">User Journeys</span>
          </button>
          <button
            @click="generateArtifacts('mockups')"
            class="p-3 bg-surface rounded-lg hover:bg-surface-hover transition-colors text-sm"
          >
            <span class="block text-2xl mb-1">🎨</span>
            <span class="text-text-primary">Mockups</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSupabase } from '~/composables/useSupabase'
import { useToast } from '~/composables/useToast'

interface VisionDocument {
  id: string
  project_id: string
  version: number
  status: 'draft' | 'analyzing' | 'ready' | 'generating'
  
  // Core Vision
  project_name: string
  tagline: string
  description: string
  
  // Strategic Elements
  objectives: string[]
  target_audience: {
    primary: string
    secondary?: string
    characteristics: string[]
  }
  problems: string[]
  solutions: string[]
  
  // Product Definition
  features: {
    core: string[]
    nice_to_have: string[]
  }
  user_journeys: Array<{
    persona: string
    goal: string
    steps: string[]
  }>
  
  // Design & Experience
  design_principles: string[]
  brand_personality: string[]
  ui_style: {
    tone: string
    colors: string[]
    inspiration: string[]
  }
  
  // Success & Impact
  success_metrics: string[]
  value_proposition: string
  
  // AI Analysis
  ai_insights: string
  questions_for_user: string[]
  readiness_score: number
  
  created_at: string
  updated_at: string
}

const props = defineProps<{
  projectId: string
}>()

const supabase = useSupabase()
const { showToast } = useToast()

const vision = ref<VisionDocument | null>(null)
const loading = ref(true)
const isAnalyzing = ref(false)
const activeTab = ref('overview')

const tabs = [
  { id: 'overview', label: 'Overview', icon: '🎯' },
  { id: 'strategy', label: 'Strategy', icon: '🧭' },
  { id: 'audience', label: 'Audience', icon: '👥' },
  { id: 'features', label: 'Features', icon: '✨' },
  { id: 'design', label: 'Design', icon: '🎨' }
]

const readinessColorClass = computed(() => {
  if (!vision.value) return 'text-gray-400'
  if (vision.value.readiness_score >= 80) return 'text-green-600'
  if (vision.value.readiness_score >= 60) return 'text-yellow-600'
  return 'text-red-600'
})

const loadVision = async () => {
  try {
    const { data, error } = await supabase
      .from('project_visions')
      .select('*')
      .eq('project_id', props.projectId)
      .order('version', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    vision.value = data
  } catch (error) {
    console.error('Error loading vision:', error)
  } finally {
    loading.value = false
  }
}

const analyzeConversation = async () => {
  isAnalyzing.value = true
  try {
    const response = await $fetch('/api/vision/analyze', {
      method: 'POST',
      body: { projectId: props.projectId }
    })

    vision.value = response.vision
    
    showToast({
      title: 'Vision Updated',
      description: 'AI has analyzed your conversation and updated the vision document',
      type: 'success'
    })
  } catch (error) {
    showToast({
      title: 'Analysis Failed',
      description: 'Could not analyze the conversation',
      type: 'error'
    })
  } finally {
    isAnalyzing.value = false
  }
}

const generateArtifacts = async (type: 'features' | 'pages' | 'journeys' | 'mockups') => {
  if (!vision.value || vision.value.readiness_score < 70) {
    showToast({
      title: 'Vision Not Ready',
      description: 'Please refine your vision further before generating artifacts',
      type: 'warning'
    })
    return
  }

  try {
    const response = await $fetch('/api/vision/generate', {
      method: 'POST',
      body: { 
        projectId: props.projectId,
        visionId: vision.value.id,
        type 
      }
    })

    showToast({
      title: 'Generation Started',
      description: `Creating ${type} based on your vision...`,
      type: 'success'
    })
    
    // Reload vision to see updated status
    await loadVision()
  } catch (error) {
    showToast({
      title: 'Generation Failed',
      description: `Could not generate ${type}`,
      type: 'error'
    })
  }
}

onMounted(() => {
  loadVision()
})

// Expose methods for parent components
defineExpose({
  analyzeConversation,
  loadVision
})
</script>
