<template>
  <div class="panel-container">
    <!-- Fixed Header -->
    <div class="panel-header">
      <div class="header-row">
        <h2 class="panel-heading">Features</h2>
        <div class="panel-actions">
          <button @click="refreshFeatures" class="icon-btn" title="Refresh">
            <svg viewBox="0 0 24 24" class="icon">
              <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Scrollable Content -->
    <div class="panel-content">
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading features...</p>
      </div>
      
      <div v-else-if="error" class="error-state">
        <p>Error loading features: {{ error }}</p>
        <button @click="loadFeatures" class="retry-btn">Retry</button>
      </div>
      
      <div v-else class="features-list">
        <!-- Feature Cards -->
        <div 
          v-for="feature in features" 
          :key="feature.id"
          @click="openFeature(feature)" 
          class="feature-card"
        >
          <div class="feature-header">
            <div class="feature-icon" :class="getStatusClass(feature)">
              <svg v-if="feature.status === 'completed'" class="icon" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4"/>
                <circle cx="12" cy="12" r="10"/>
              </svg>
              <svg v-else-if="feature.status === 'active'" class="icon" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <svg v-else class="icon" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="16"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
              </svg>
            </div>
            <div class="feature-info">
              <h3 class="feature-title">{{ feature.name }}</h3>
              <p class="feature-description">{{ feature.description || 'No description provided' }}</p>
            </div>
            <span class="priority-badge" :class="feature.priority">{{ formatPriority(feature.priority) }}</span>
          </div>
          <div v-if="getProgress(feature) !== null" class="feature-progress">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: getProgress(feature) + '%' }"></div>
            </div>
            <span class="progress-text">{{ getProgressText(feature) }}</span>
          </div>
          <div v-if="feature.category || feature.type" class="feature-meta">
            <span v-if="feature.category" class="meta-tag">{{ feature.category }}</span>
            <span v-if="feature.type" class="meta-tag">{{ feature.type }}</span>
          </div>
        </div>

        <!-- Empty state if no features -->
        <div v-if="features.length === 0" class="empty-state-card">
          <svg viewBox="0 0 24 24" class="empty-icon">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
          </svg>
          <h3>No features yet</h3>
          <p>Start by adding your first feature</p>
        </div>
      </div>
    </div>
    
    <!-- Fixed Footer with Add Button -->
    <div class="panel-footer">
      <button @click="addNewFeature" class="add-button">
        <span class="icon">+</span>
        <span>Add New Feature</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import type { Database } from '~/types/database'

type Project = Database['public']['Tables']['projects']['Row']
type Feature = Database['public']['Tables']['features']['Row']

interface Props {
  project?: Project | null
}

const props = defineProps<Props>()
const emit = defineEmits(['select:feature', 'add:feature'])

const supabase = useSupabase()
const features = ref<Feature[]>([])
const loading = ref(true)
const error = ref('')

// Load features from database
const loadFeatures = async () => {
  if (!props.project?.id) return
  
  loading.value = true
  error.value = ''
  
  try {
    const { data, error: fetchError } = await supabase
      .from('features')
      .select('*')
      .eq('project_id', props.project.id)
      .order('priority', { ascending: false })
      .order('created_at', { ascending: true })
    
    if (fetchError) throw fetchError
    
    features.value = data || []
  } catch (err: any) {
    error.value = err.message
    console.error('Error loading features:', err)
  } finally {
    loading.value = false
  }
}

// Get status display class
const getStatusClass = (feature: Feature) => {
  return {
    'completed': feature.status === 'completed' || feature.status === 'done',
    'in-progress': feature.status === 'active' || feature.status === 'in-progress',
    'planned': feature.status === 'planned' || feature.status === 'pending'
  }
}

// Format priority display
const formatPriority = (priority: string) => {
  return priority.charAt(0).toUpperCase() + priority.slice(1)
}

// Get progress percentage from feature settings
const getProgress = (feature: Feature) => {
  const settings = feature.settings as any
  if (feature.status === 'completed') return 100
  if (feature.status === 'planned') return 0
  return settings?.progress || null
}

// Get progress text
const getProgressText = (feature: Feature) => {
  const progress = getProgress(feature)
  if (progress === null) return ''
  if (progress === 100) return 'Completed'
  if (progress === 0) return 'Not Started'
  return `${progress}% Complete`
}

// Handle feature selection
const openFeature = (feature: Feature) => {
  emit('select:feature', feature)
}

// Add new feature
const addNewFeature = () => {
  emit('add:feature')
}

// Refresh features
const refreshFeatures = () => {
  loadFeatures()
}

// Load features on mount and when project changes
onMounted(() => {
  loadFeatures()
})

watch(() => props.project?.id, () => {
  loadFeatures()
})

// Subscribe to real-time updates
onMounted(() => {
  if (!props.project?.id) return
  
  const channel = supabase
    .channel(`features:${props.project.id}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'features',
        filter: `project_id=eq.${props.project.id}`
      },
      () => {
        loadFeatures()
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
/* Panel Container Layout */
.panel-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
}

/* Fixed Header */
.panel-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-primary);
  flex-shrink: 0;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  border: 1px solid var(--border-primary);
  color: var(--text-secondary);
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.icon-btn:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

/* Scrollable Content */
.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  padding-bottom: 0;
  min-height: 0; /* Important for Firefox */
}

/* Fixed Footer */
.panel-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border-primary);
  background: var(--bg-primary);
  flex-shrink: 0;
  /* Subtle shadow for depth */
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.05);
}

.add-button {
  width: 100%;
  background-color: var(--border-primary);
  border: 1px solid var(--border-secondary);
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  color: var(--text-primary);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.add-button:hover {
  background-color: var(--border-secondary);
  transform: translateY(-1px);
}

.add-button:active {
  transform: translateY(0);
}

.add-button .icon {
  font-size: 1.25rem;
  line-height: 1;
}

/* Icon */
.icon {
  width: 20px;
  height: 20px;
  stroke: currentColor;
  stroke-width: 2;
  fill: none;
}

/* Loading & Error States */
.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
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
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: var(--primary-500);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.retry-btn:hover {
  background: var(--primary-600);
}

/* Features List */
.features-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-bottom: 1rem; /* Add some space at the bottom */
}

.feature-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.2s ease;
  cursor: pointer;
}

.feature-card:hover {
  border-color: var(--border-secondary);
  box-shadow: var(--shadow-sm);
}

.feature-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
}

.feature-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.feature-icon.completed {
  background: rgba(22, 193, 129, 0.2);
  color: var(--primary-500);
}

.feature-icon.in-progress {
  background: rgba(251, 191, 36, 0.2);
  color: #FBBF24;
}

.feature-icon.planned {
  background: rgba(139, 148, 158, 0.2);
  color: var(--text-tertiary);
}

.feature-icon .icon {
  width: 24px;
  height: 24px;
  stroke: currentColor;
  stroke-width: 2;
  fill: none;
}

.feature-info {
  flex: 1;
}

.feature-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.feature-description {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

.priority-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.priority-badge.high {
  background: rgba(239, 68, 68, 0.2);
  color: #EF4444;
}

.priority-badge.medium {
  background: rgba(251, 191, 36, 0.2);
  color: #FBBF24;
}

.priority-badge.low {
  background: rgba(139, 148, 158, 0.2);
  color: var(--text-secondary);
}

.feature-progress {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: var(--bg-tertiary);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--primary-500);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-weight: 500;
}



.feature-meta {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.meta-tag {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  background: var(--bg-tertiary);
  color: var(--text-tertiary);
  border-radius: 4px;
  text-transform: capitalize;
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

/* Mobile Responsive */
@media (max-width: 768px) {
  .panel-header {
    padding: 1rem;
  }
  
  .panel-content {
    padding: 1rem;
  }
  
  .panel-footer {
    padding: 0.75rem 1rem;
  }
  
  .panel-heading {
    font-size: 1.25rem;
  }
  
  .feature-card {
    padding: 1.25rem;
  }
}
</style>