<template>
  <div class="journeys-panel">
    <div class="panel-header">
      <h2 class="panel-heading">User Journeys</h2>
      <div class="panel-actions">
        <button @click="refreshJourneys" class="icon-btn" title="Refresh">
          <svg viewBox="0 0 24 24" class="icon">
            <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
          </svg>
        </button>
      </div>
    </div>
    
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading journeys...</p>
    </div>
    
    <div v-else-if="error" class="error-state">
      <p>Error loading journeys: {{ error }}</p>
      <button @click="loadJourneys" class="retry-btn">Retry</button>
    </div>
    
    <div v-else class="journeys-list">
      <!-- Journey Cards -->
      <div 
        v-for="journey in journeys" 
        :key="journey.id"
        @click="openJourney(journey)" 
        class="journey-card"
      >
        <div class="journey-header">
          <span class="journey-icon">{{ getJourneyIcon(journey) }}</span>
          <h3 class="journey-title">{{ journey.name }}</h3>
          <span class="journey-status" :class="journey.status">{{ formatStatus(journey.status) }}</span>
        </div>
        <div v-if="getJourneySteps(journey).length > 0" class="journey-steps">
          <template v-for="(step, index) in getJourneySteps(journey)" :key="step.id || index">
            <div class="step">
              <span class="step-name">{{ step.name || `Step ${index + 1}` }}</span>
            </div>
            <span v-if="index < getJourneySteps(journey).length - 1" class="arrow">→</span>
          </template>
        </div>
        <p class="journey-description">
          {{ journey.description || 'No description provided' }}
        </p>
        <div v-if="journey.persona || journey.type" class="journey-meta">
          <span v-if="journey.persona" class="meta-tag">
            <svg viewBox="0 0 24 24" class="meta-icon">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            {{ journey.persona }}
          </span>
          <span v-if="journey.type" class="meta-tag">{{ journey.type }}</span>
        </div>
      </div>

      <!-- Empty state if no journeys -->
      <div v-if="journeys.length === 0" class="empty-state-card">
        <svg viewBox="0 0 24 24" class="empty-icon">
          <path d="M13 2.05v3.03c3.39.49 6 3.39 6 6.92 0 .9-.18 1.75-.48 2.54l2.6 1.53c.56-1.24.88-2.62.88-4.07 0-5.18-3.95-9.45-9-9.95zM12 19c-3.87 0-7-3.13-7-7 0-3.53 2.61-6.43 6-6.92V2.05c-5.06.5-9 4.76-9 9.95 0 5.52 4.47 10 9.99 10 3.31 0 6.24-1.61 8.06-4.09l-2.6-1.53C16.17 17.98 14.21 19 12 19z"/>
        </svg>
        <h3>No journeys yet</h3>
        <p>Start by creating your first user journey</p>
      </div>

      <!-- Add New Journey Button -->
      <button @click="addNewJourney" class="add-journey-btn">
        <svg class="icon" viewBox="0 0 24 24">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        <span>Add New Journey</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import type { Database } from '~/types/database'

type Project = Database['public']['Tables']['projects']['Row']
type Journey = Database['public']['Tables']['journeys']['Row']

interface Props {
  project?: Project | null
}

const props = defineProps<Props>()
const emit = defineEmits(['select:journey', 'add:journey'])

const supabase = useSupabase()
const journeys = ref<Journey[]>([])
const loading = ref(true)
const error = ref('')

// Load journeys from database
const loadJourneys = async () => {
  if (!props.project?.id) return
  
  loading.value = true
  error.value = ''
  
  try {
    const { data, error: fetchError } = await supabase
      .from('journeys')
      .select('*')
      .eq('project_id', props.project.id)
      .order('created_at', { ascending: true })
    
    if (fetchError) throw fetchError
    
    journeys.value = data || []
  } catch (err: any) {
    error.value = err.message
    console.error('Error loading journeys:', err)
  } finally {
    loading.value = false
  }
}

// Get journey icon based on type or name
const getJourneyIcon = (journey: Journey) => {
  const iconMap: Record<string, string> = {
    'onboarding': '🚀',
    'purchase': '🛒',
    'support': '💬',
    'discovery': '🔍',
    'retention': '🎯',
    'referral': '🤝',
    'upgrade': '⬆️',
    'feedback': '📝'
  }
  
  // Check type first, then name
  if (journey.type && iconMap[journey.type.toLowerCase()]) {
    return iconMap[journey.type.toLowerCase()]
  }
  
  // Check if name contains keywords
  const name = journey.name.toLowerCase()
  for (const [key, icon] of Object.entries(iconMap)) {
    if (name.includes(key)) return icon
  }
  
  // Default icon
  return '🛤️'
}

// Get journey steps from JSON data
const getJourneySteps = (journey: Journey) => {
  const steps = journey.steps as any
  if (!steps || !Array.isArray(steps)) return []
  return steps
}

// Format status display
const formatStatus = (status: string) => {
  const statusMap: Record<string, string> = {
    'draft': 'Draft',
    'active': 'Active',
    'completed': 'Completed',
    'archived': 'Archived'
  }
  return statusMap[status] || status
}

// Handle journey selection
const openJourney = (journey: Journey) => {
  emit('select:journey', journey)
}

// Add new journey
const addNewJourney = () => {
  emit('add:journey')
}

// Refresh journeys
const refreshJourneys = () => {
  loadJourneys()
}

// Load journeys on mount and when project changes
onMounted(() => {
  loadJourneys()
})

watch(() => props.project?.id, () => {
  loadJourneys()
})

// Subscribe to real-time updates
onMounted(() => {
  if (!props.project?.id) return
  
  const channel = supabase
    .channel(`journeys:${props.project.id}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'journeys',
        filter: `project_id=eq.${props.project.id}`
      },
      () => {
        loadJourneys()
      }
    )
    .subscribe()
  
  // Cleanup on unmount
  onUnmounted(() => {
    supabase.removeChannel(channel)
  })
})
</script>

<style scoped>
.journeys-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.panel-heading {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.panel-actions {
  display: flex;
  gap: 0.5rem;
}

.icon-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s;
}

.icon-btn:hover {
  background: var(--bg-secondary);
  color: var(--primary-500);
}

.icon {
  width: 20px;
  height: 20px;
  fill: currentColor;
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: var(--text-tertiary);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border-primary);
  border-top-color: var(--primary-500);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.retry-btn {
  background: var(--primary-500);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 1rem;
}

.journeys-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  padding-bottom: 1rem;
}

.journey-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.2s ease;
  cursor: pointer;
}

.journey-card:hover {
  border-color: var(--border-secondary);
  box-shadow: var(--shadow-sm);
}

.journey-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.journey-status {
  margin-left: auto;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.journey-status.active {
  background: rgba(22, 193, 129, 0.2);
  color: var(--primary-500);
}

.journey-status.draft {
  background: rgba(139, 148, 158, 0.2);
  color: var(--text-secondary);
}

.journey-status.completed {
  background: rgba(34, 197, 94, 0.2);
  color: #22C55E;
}

.journey-status.archived {
  background: rgba(107, 114, 128, 0.2);
  color: #6B7280;
}

.journey-icon {
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--bg-tertiary);
  border-radius: 8px;
}

.journey-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
}

.journey-steps {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
  padding: 1rem;
  background: var(--bg-primary);
  border-radius: 8px;
}

.step {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 6px;
  padding: 0.5rem 1rem;
}

.step-name {
  color: var(--text-primary);
  font-size: 0.875rem;
  font-weight: 500;
}

.arrow {
  color: var(--text-tertiary);
  font-size: 1.125rem;
  font-weight: 300;
}

.journey-description {
  color: var(--text-secondary);
  font-size: 0.875rem;
  line-height: 1.5;
}

.add-journey-btn {
  background: transparent;
  border: 2px dashed var(--border-primary);
  border-radius: 12px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: var(--text-tertiary);
  font-weight: 500;
}

.add-journey-btn:hover {
  border-color: var(--primary-500);
  background: var(--bg-secondary);
  color: var(--primary-500);
}

.add-journey-btn .icon {
  width: 20px;
  height: 20px;
  stroke: currentColor;
  stroke-width: 2;
  fill: none;
}

.journey-meta {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.meta-tag {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  background: var(--bg-tertiary);
  color: var(--text-tertiary);
  border-radius: 4px;
}

.meta-icon {
  width: 14px;
  height: 14px;
  fill: currentColor;
}

.empty-state-card {
  text-align: center;
  padding: 3rem;
  color: var(--text-tertiary);
}

.empty-icon {
  width: 48px;
  height: 48px;
  fill: currentColor;
  margin-bottom: 1rem;
}

.empty-state-card h3 {
  font-size: 1.125rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.empty-state-card p {
  font-size: 0.875rem;
  margin: 0;
}
</style>