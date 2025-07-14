<template>
  <div class="vision-document">
    <!-- Header with Edit Button -->
    <div class="vision-header">
      <h2 class="vision-title">Project Vision</h2>
      <button 
        v-if="!isEditing" 
        @click="startEditing" 
        class="edit-button"
      >
        ✏️ Edit
      </button>
      <div v-else class="edit-actions">
        <button @click="saveChanges" class="save-button">
          ✅ Save
        </button>
        <button @click="cancelEditing" class="cancel-button">
          ❌ Cancel
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!hasContent" class="empty-state">
      <div class="empty-icon">🚀</div>
      <h3>Let's Define Your Vision</h3>
      <p>Start chatting about your project idea and I'll help structure your vision.</p>
    </div>

    <!-- Vision Content -->
    <div v-else class="vision-content">
      <!-- Project Overview Section -->
      <section class="vision-section">
        <h3 class="section-title">{{ visionDoc.project_name || project?.name || 'Your Project' }}</h3>
        
        <div v-if="!isEditing" class="section-content">
          <p class="tagline">{{ visionDoc.tagline || 'Add a catchy tagline...' }}</p>
          <p class="description">{{ visionDoc.description || 'Describe your project vision...' }}</p>
        </div>
        <div v-else class="edit-fields">
          <input 
            v-model="editingDoc.project_name" 
            placeholder="Project Name"
            class="edit-input"
          />
          <input 
            v-model="editingDoc.tagline" 
            placeholder="Tagline"
            class="edit-input"
          />
          <textarea 
            v-model="editingDoc.description" 
            placeholder="Project Description"
            class="edit-textarea"
            rows="3"
          />
        </div>
      </section>

      <!-- Key Objectives -->
      <section class="vision-section">
        <h3 class="section-title">Key Objectives</h3>
        <EditableList 
          v-model="isEditing ? editingDoc.objectives : visionDoc.objectives"
          :editable="isEditing"
          placeholder="Add an objective"
          icon="🎯"
        />
      </section>

      <!-- Target Audience -->
      <section class="vision-section">
        <h3 class="section-title">Target Audience</h3>
        
        <div class="subsection">
          <h4>Primary Users</h4>
          <EditableList 
            v-model="isEditing ? editingDoc.target_users.primary : visionDoc.target_users.primary"
            :editable="isEditing"
            placeholder="Add primary user type"
            icon="👤"
          />
        </div>
        
        <div class="subsection">
          <h4>Secondary Users</h4>
          <EditableList 
            v-model="isEditing ? editingDoc.target_users.secondary : visionDoc.target_users.secondary"
            :editable="isEditing"
            placeholder="Add secondary user type"
            icon="👥"
          />
        </div>
      </section>

      <!-- Problems & Solutions -->
      <section class="vision-section">
        <h3 class="section-title">Problems & Solutions</h3>
        
        <div class="subsection">
          <h4>Problems We're Solving</h4>
          <EditableList 
            v-model="isEditing ? editingDoc.problems : visionDoc.problems"
            :editable="isEditing"
            placeholder="Add a problem"
            icon="🔥"
          />
        </div>
        
        <div class="subsection">
          <h4>Our Solutions</h4>
          <EditableList 
            v-model="isEditing ? editingDoc.solutions : visionDoc.solutions"
            :editable="isEditing"
            placeholder="Add a solution"
            icon="💡"
          />
        </div>
      </section>

      <!-- Features -->
      <section class="vision-section">
        <h3 class="section-title">Features & Capabilities</h3>
        
        <div class="subsection">
          <h4>Core Features</h4>
          <EditableList 
            v-model="isEditing ? editingDoc.core_features : visionDoc.core_features"
            :editable="isEditing"
            placeholder="Add a core feature"
            icon="⭐"
          />
        </div>
        
        <div class="subsection">
          <h4>Nice to Have</h4>
          <EditableList 
            v-model="isEditing ? editingDoc.nice_to_have_features : visionDoc.nice_to_have_features"
            :editable="isEditing"
            placeholder="Add a nice-to-have feature"
            icon="✨"
          />
        </div>
      </section>

      <!-- Design Principles -->
      <section class="vision-section">
        <h3 class="section-title">Design & Brand</h3>
        
        <div class="subsection">
          <h4>Design Principles</h4>
          <EditableList 
            v-model="isEditing ? editingDoc.design_principles : visionDoc.design_principles"
            :editable="isEditing"
            placeholder="Add a design principle"
            icon="🎨"
          />
        </div>
        
        <div class="subsection">
          <h4>Brand Personality</h4>
          <EditableList 
            v-model="isEditing ? editingDoc.brand_personality : visionDoc.brand_personality"
            :editable="isEditing"
            placeholder="Add a personality trait"
            icon="🌟"
          />
        </div>
      </section>

      <!-- Success Metrics -->
      <section class="vision-section">
        <h3 class="section-title">Success Metrics</h3>
        <EditableList 
          v-model="isEditing ? editingDoc.success_metrics : visionDoc.success_metrics"
          :editable="isEditing"
          placeholder="Add a success metric"
          icon="📊"
        />
      </section>

      <!-- Progress Bar -->
      <div class="vision-progress">
        <div class="progress-header">
          <span>Vision Completeness</span>
          <span>{{ completionPercentage }}%</span>
        </div>
        <div class="progress-bar">
          <div 
            class="progress-fill" 
            :style="{ width: `${completionPercentage}%` }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useSupabase } from '~/composables/useSupabase'
import type { StructuredVisionDocument } from '~/types/vision'
import EditableList from './EditableList.vue'

const props = defineProps<{
  projectId: string
  project?: any
}>()

const supabase = useSupabase()
const visionDoc = ref<StructuredVisionDocument>(createEmptyVision())
const editingDoc = ref<StructuredVisionDocument>(createEmptyVision())
const isEditing = ref(false)

// Create empty vision document
function createEmptyVision(): StructuredVisionDocument {
  return {
    project_id: props.projectId,
    project_name: '',
    tagline: '',
    description: '',
    objectives: [],
    target_users: {
      primary: [],
      secondary: []
    },
    problems: [],
    solutions: [],
    core_features: [],
    nice_to_have_features: [],
    user_journeys: [],
    design_principles: [],
    brand_personality: [],
    tech_stack: [],
    integrations: [],
    success_metrics: [],
    unique_value_props: []
  }
}

// Check if has any content
const hasContent = computed(() => {
  const v = visionDoc.value
  return !!(
    v.project_name || 
    v.tagline || 
    v.description ||
    v.objectives.length ||
    v.target_users.primary.length ||
    v.target_users.secondary.length ||
    v.problems.length ||
    v.solutions.length ||
    v.core_features.length
  )
})

// Calculate completion percentage
const completionPercentage = computed(() => {
  const v = visionDoc.value
  let filled = 0
  const total = 10
  
  if (v.tagline) filled++
  if (v.description) filled++
  if (v.objectives.length > 0) filled++
  if (v.target_users.primary.length > 0) filled++
  if (v.problems.length > 0) filled++
  if (v.solutions.length > 0) filled++
  if (v.core_features.length > 0) filled++
  if (v.design_principles.length > 0) filled++
  if (v.success_metrics.length > 0) filled++
  if (v.unique_value_props.length > 0) filled++
  
  return Math.round((filled / total) * 100)
})

// Load vision document
const loadVision = async () => {
  const { data, error } = await supabase
    .from('structured_vision_documents')
    .select('*')
    .eq('project_id', props.projectId)
    .single()
  
  if (data) {
    visionDoc.value = data
  }
}

// Start editing
const startEditing = () => {
  editingDoc.value = JSON.parse(JSON.stringify(visionDoc.value))
  isEditing.value = true
}

// Cancel editing
const cancelEditing = () => {
  isEditing.value = false
}

// Save changes
const saveChanges = async () => {
  console.log('Saving structured vision:', editingDoc.value)
  
  const { error } = await supabase
    .from('structured_vision_documents')
    .upsert({
      ...editingDoc.value,
      project_id: props.projectId
    })
  
  if (!error) {
    visionDoc.value = JSON.parse(JSON.stringify(editingDoc.value))
    isEditing.value = false
  } else {
    console.error('Error saving vision:', error)
  }
}

// Update vision from AI insights
const updateFromInsights = (insights: any) => {
  console.log('Updating from insights:', insights)
  
  // Smart merge of insights into structured document
  if (insights.elevator_pitch && !visionDoc.value.description) {
    visionDoc.value.description = insights.elevator_pitch
  }
  
  if (insights.user_personas?.length) {
    insights.user_personas.forEach((persona: string) => {
      if (!visionDoc.value.target_users.primary.includes(persona)) {
        visionDoc.value.target_users.primary.push(persona)
      }
    })
  }
  
  if (insights.pain_points?.length) {
    insights.pain_points.forEach((pain: string) => {
      if (!visionDoc.value.problems.includes(pain)) {
        visionDoc.value.problems.push(pain)
      }
    })
  }
  
  if (insights.key_features?.length) {
    insights.key_features.forEach((feature: string) => {
      if (!visionDoc.value.core_features.includes(feature)) {
        visionDoc.value.core_features.push(feature)
      }
    })
  }
  
  // Auto-save
  saveChanges()
}

// Load on mount
onMounted(() => {
  loadVision()
})

// Expose update method
defineExpose({
  updateVision: updateFromInsights
})
</script>

<style scoped>
.vision-document {
  height: 100%;
  overflow-y: auto;
  padding: 2rem;
}

.vision-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.vision-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
}

.edit-button,
.save-button,
.cancel-button {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.edit-button {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.edit-button:hover {
  background: var(--bg-quaternary);
}

.save-button {
  background: var(--green-500);
  color: white;
  margin-right: 0.5rem;
}

.cancel-button {
  background: var(--red-500);
  color: white;
}

.edit-actions {
  display: flex;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-secondary);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

/* Vision Content */
.vision-content {
  max-width: 800px;
  margin: 0 auto;
}

.vision-section {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--green-400);
  margin-bottom: 1.5rem;
}

.section-content {
  color: var(--text-primary);
}

.tagline {
  font-size: 1.125rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
  font-style: italic;
}

.description {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--text-primary);
}

.subsection {
  margin-bottom: 2rem;
}

.subsection h4 {
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

/* Edit Fields */
.edit-fields {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.edit-input,
.edit-textarea {
  width: 100%;
  padding: 0.75rem;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 6px;
  color: var(--text-primary);
  font-size: 0.9375rem;
  transition: all 0.2s;
}

.edit-input:focus,
.edit-textarea:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
}

.edit-textarea {
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
  line-height: 1.5;
}

/* Progress */
.vision-progress {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-primary);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.progress-bar {
  height: 8px;
  background: var(--bg-tertiary);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--green-500);
  transition: width 0.3s ease;
}

/* Scrollbar */
.vision-document::-webkit-scrollbar {
  width: 8px;
}

.vision-document::-webkit-scrollbar-track {
  background: transparent;
}

.vision-document::-webkit-scrollbar-thumb {
  background: var(--bg-quaternary);
  border-radius: 4px;
}

.vision-document::-webkit-scrollbar-thumb:hover {
  background: var(--border-secondary);
}
</style>
