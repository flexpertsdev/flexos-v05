<template>
  <div class="bg-surface-secondary p-6 rounded-lg">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-medium text-text-primary">
        🎯 Project Vision
      </h3>
      <div class="flex items-center gap-2">
        <button
          v-if="!isEditing"
          @click="isEditing = true"
          class="text-sm text-primary hover:text-primary-hover transition-colors"
        >
          ✏️ Edit
        </button>
        <template v-else>
          <button
            @click="saveChanges"
            class="text-sm text-green-500 hover:text-green-600 transition-colors"
          >
            ✅ Save
          </button>
          <button
            @click="cancelEditing"
            class="text-sm text-red-500 hover:text-red-600 transition-colors"
          >
            ❌ Cancel
          </button>
        </template>
      </div>
    </div>
    
    <div v-if="!visionDoc" class="text-center py-12 text-text-secondary">
      <div class="text-4xl mb-4">🚀</div>
      <p>Start chatting about your project idea</p>
      <p class="text-sm mt-2">I'll help you shape your vision!</p>
    </div>
    
    <div v-else class="space-y-6">
      <!-- Elevator Pitch -->
      <div>
        <h4 class="text-sm font-medium text-text-secondary mb-2">
          🎯 The Vision
        </h4>
        <div v-if="!isEditing" class="text-text-primary">
          {{ visionDoc.elevator_pitch || 'Tell me about your idea...' }}
        </div>
        <textarea
          v-else
          v-model="editingDoc!.elevator_pitch"
          class="w-full p-3 bg-surface rounded-md text-text-primary resize-none"
          rows="3"
          placeholder="What's your big idea?"
        />
      </div>
      
      <!-- User Personas -->
      <div>
        <h4 class="text-sm font-medium text-text-secondary mb-2">
          👥 Who It's For
        </h4>
        <div v-if="!isEditing" class="space-y-2">
          <div
            v-for="(persona, index) in visionDoc.user_personas"
            :key="index"
            class="flex items-start gap-2"
          >
            <span class="text-primary">•</span>
            <span class="text-text-primary">{{ persona }}</span>
          </div>
          <div v-if="!visionDoc.user_personas?.length" class="text-text-tertiary">
            Who are your users?
          </div>
        </div>
        <div v-else class="space-y-2">
          <div
            v-for="(persona, index) in editingDoc?.user_personas || []"
            :key="index"
            class="flex items-center gap-2"
          >
            <input
              v-model="editingDoc!.user_personas[index]"
              class="flex-1 p-2 bg-surface rounded-md text-text-primary"
              placeholder="User persona..."
            />
            <button
              @click="removeItem('user_personas', index)"
              class="text-red-500 hover:text-red-600"
            >
              ❌
            </button>
          </div>
          <button
            @click="addItem('user_personas')"
            class="text-sm text-primary hover:text-primary-hover"
          >
            + Add persona
          </button>
        </div>
      </div>
      
      <!-- Pain Points -->
      <div>
        <h4 class="text-sm font-medium text-text-secondary mb-2">
          🔥 Problems We're Solving
        </h4>
        <div v-if="!isEditing" class="space-y-2">
          <div
            v-for="(point, index) in visionDoc.pain_points"
            :key="index"
            class="flex items-start gap-2"
          >
            <span class="text-orange-500">•</span>
            <span class="text-text-primary">{{ point }}</span>
          </div>
          <div v-if="!visionDoc.pain_points?.length" class="text-text-tertiary">
            What problems are you solving?
          </div>
        </div>
        <div v-else class="space-y-2">
          <div
            v-for="(point, index) in editingDoc?.pain_points || []"
            :key="index"
            class="flex items-center gap-2"
          >
            <input
              v-model="editingDoc!.pain_points[index]"
              class="flex-1 p-2 bg-surface rounded-md text-text-primary"
              placeholder="Pain point..."
            />
            <button
              @click="removeItem('pain_points', index)"
              class="text-red-500 hover:text-red-600"
            >
              ❌
            </button>
          </div>
          <button
            @click="addItem('pain_points')"
            class="text-sm text-primary hover:text-primary-hover"
          >
            + Add pain point
          </button>
        </div>
      </div>
      
      <!-- Key Features -->
      <div>
        <h4 class="text-sm font-medium text-text-secondary mb-2">
          ✨ Key Features
        </h4>
        <div v-if="!isEditing" class="space-y-2">
          <div
            v-for="(feature, index) in visionDoc.key_features"
            :key="index"
            class="flex items-start gap-2"
          >
            <span class="text-green-500">•</span>
            <span class="text-text-primary">{{ feature }}</span>
          </div>
          <div v-if="!visionDoc.key_features?.length" class="text-text-tertiary">
            What features will you build?
          </div>
        </div>
        <div v-else class="space-y-2">
          <div
            v-for="(feature, index) in editingDoc?.key_features || []"
            :key="index"
            class="flex items-center gap-2"
          >
            <input
              v-model="editingDoc!.key_features[index]"
              class="flex-1 p-2 bg-surface rounded-md text-text-primary"
              placeholder="Key feature..."
            />
            <button
              @click="removeItem('key_features', index)"
              class="text-red-500 hover:text-red-600"
            >
              ❌
            </button>
          </div>
          <button
            @click="addItem('key_features')"
            class="text-sm text-primary hover:text-primary-hover"
          >
            + Add feature
          </button>
        </div>
      </div>
    </div>
    
    <!-- Progress Indicator -->
    <div v-if="visionDoc" class="mt-6 pt-6 border-t border-surface">
      <div class="flex items-center justify-between text-sm">
        <span class="text-text-secondary">Vision Clarity</span>
        <span class="text-primary">{{ completionPercentage }}%</span>
      </div>
      <div class="mt-2 h-2 bg-surface rounded-full overflow-hidden">
        <div
          class="h-full bg-primary transition-all duration-300"
          :style="{ width: `${completionPercentage}%` }"
        />
      </div>
    </div>
    
    <!-- Share Button (Future Feature) -->
    <div v-if="visionDoc && completionPercentage > 50" class="mt-4 text-center">
      <button
        @click="shareProject"
        class="text-sm text-text-tertiary hover:text-text-secondary transition-colors"
        disabled
      >
        🔗 Share Project (Coming Soon)
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
// Use Supabase client directly from Nuxt module

interface VisionDocument {
  id?: string
  project_id: string
  elevator_pitch?: string
  target_users?: any[] // JSONB array from database
  pain_points?: any[] // JSONB array from database  
  core_features?: any[] // JSONB array from database
  // Legacy field names for backward compatibility
  user_personas?: string[]
  key_features?: string[]
}

const props = defineProps<{
  projectId: string
}>()

const supabase = useSupabaseTyped()
const user = useSupabaseUser()
const visionDoc = ref<VisionDocument | null>(null)
const editingDoc = ref<VisionDocument | null>(null)
const isEditing = ref(false)

// Load existing vision document
const loadVisionDoc = async () => {
  const { data, error } = await supabase
    .from('vision_documents')
    .select('*')
    .eq('project_id', props.projectId)
    .single()
  
  if (data) {
    // Transform database format to component format
    visionDoc.value = {
      ...data,
      // Map new field names to old ones for compatibility
      user_personas: data.target_users || data.user_personas || [],
      key_features: data.core_features || data.key_features || [],
      pain_points: data.pain_points || []
    }
  }
}

// Save changes to database
const saveChanges = async () => {
  if (!editingDoc.value && !visionDoc.value) return
  
  const dataToSave = editingDoc.value || visionDoc.value
  console.log('Saving vision document:', dataToSave)
  
  // Transform component format to database format
  const dbData = {
    project_id: props.projectId,
    user_id: user.value?.id,
    app_description: dataToSave?.elevator_pitch || '',
    target_users: dataToSave?.user_personas || [],
    pain_points: dataToSave?.pain_points || [],
    core_features: dataToSave?.key_features || []
  }
  
  const { data, error } = await supabase
    .from('vision_documents')
    .upsert(dbData)
    .select()
  
  if (error) {
    console.error('Error saving vision document:', error)
  } else {
    console.log('Vision document saved successfully:', data)
    if (editingDoc.value) {
      visionDoc.value = { ...editingDoc.value }
      isEditing.value = false
    }
  }
}

// Cancel editing
const cancelEditing = () => {
  editingDoc.value = visionDoc.value ? { ...visionDoc.value } : null
  isEditing.value = false
}

// Add item to array
const addItem = (field: 'user_personas' | 'pain_points' | 'key_features') => {
  if (!editingDoc.value) return
  editingDoc.value[field] = [...(editingDoc.value[field] || []), '']
}

// Remove item from array
const removeItem = (field: 'user_personas' | 'pain_points' | 'key_features', index: number) => {
  if (!editingDoc.value) return
  editingDoc.value[field] = editingDoc.value[field].filter((_, i) => i !== index)
}

// Calculate completion percentage
const completionPercentage = computed(() => {
  if (!visionDoc.value) return 0
  
  let score = 0
  if (visionDoc.value.elevator_pitch) score += 25
  if (visionDoc.value.user_personas?.length > 0) score += 25
  if (visionDoc.value.pain_points?.length > 0) score += 25
  if (visionDoc.value.key_features?.length > 0) score += 25
  
  return score
})

// Share project (future feature)
const shareProject = () => {
  // TODO: Implement project sharing
  console.log('Sharing coming soon!')
}

// Update vision from AI
const updateVision = (updates: Partial<VisionDocument>) => {
  console.log('VisionPanel updateVision called with:', updates)
  
  if (!visionDoc.value) {
    visionDoc.value = {
      project_id: props.projectId,
      elevator_pitch: '',
      user_personas: [],
      pain_points: [],
      key_features: []
    }
  }
  
  // Merge updates
  if (updates.elevator_pitch) {
    visionDoc.value.elevator_pitch = updates.elevator_pitch
  }
  
  // Handle both old and new field names
  if (updates.user_personas || updates.target_users) {
    const personas = updates.user_personas || updates.target_users || []
    visionDoc.value.user_personas = [
      ...new Set([...(visionDoc.value.user_personas || []), ...personas])
    ]
    visionDoc.value.target_users = visionDoc.value.user_personas
  }
  
  if (updates.pain_points) {
    visionDoc.value.pain_points = [
      ...new Set([...(visionDoc.value.pain_points || []), ...updates.pain_points])
    ]
  }
  
  if (updates.key_features || updates.core_features) {
    const features = updates.key_features || updates.core_features || []
    visionDoc.value.key_features = [
      ...new Set([...(visionDoc.value.key_features || []), ...features])
    ]
    visionDoc.value.core_features = visionDoc.value.key_features
  }
  
  console.log('Updated visionDoc:', visionDoc.value)
  
  // Auto-save to database
  saveChanges()
}

// Watch for editing mode
watch(isEditing, (newVal) => {
  if (newVal) {
    editingDoc.value = visionDoc.value ? { ...visionDoc.value } : {
      project_id: props.projectId,
      elevator_pitch: '',
      user_personas: [],
      pain_points: [],
      key_features: []
    }
  }
})

// Load on mount
onMounted(() => {
  loadVisionDoc()
})

// Expose update method
defineExpose({
  updateVision
})
</script>
