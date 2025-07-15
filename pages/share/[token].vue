<template>
  <div class="min-h-screen bg-surface">
    <!-- Public Header -->
    <header class="bg-surface-secondary border-b border-surface">
      <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <h1 class="text-2xl font-bold text-primary">FlexOS</h1>
          <span class="text-text-secondary">Project Preview</span>
        </div>
        <div class="text-sm text-text-tertiary">
          👁️ {{ viewCount }} views
        </div>
      </div>
    </header>
    
    <!-- Project Content -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="text-center">
        <div class="animate-spin text-4xl mb-4">⚡</div>
        <p class="text-text-secondary">Loading project...</p>
      </div>
    </div>
    
    <div v-else-if="error" class="flex items-center justify-center py-20">
      <div class="text-center">
        <div class="text-4xl mb-4">😕</div>
        <p class="text-text-secondary">{{ error }}</p>
      </div>
    </div>
    
    <div v-else-if="project" class="max-w-6xl mx-auto px-6 py-8">
      <!-- Project Header -->
      <div class="mb-8">
        <h2 class="text-3xl font-bold text-text-primary mb-2">
          {{ project.name }}
        </h2>
        <p class="text-text-secondary">
          Shared by {{ project.user?.email?.split('@')[0] || 'Anonymous' }}
        </p>
      </div>
      
      <!-- Vision Document -->
      <div v-if="project.vision_document" class="grid md:grid-cols-2 gap-6 mb-8">
        <div class="bg-surface-secondary p-6 rounded-lg">
          <h3 class="text-xl font-semibold text-text-primary mb-4">
            🎯 The Vision
          </h3>
          <p class="text-text-primary leading-relaxed">
            {{ project.vision_document.elevator_pitch }}
          </p>
        </div>
        
        <div class="bg-surface-secondary p-6 rounded-lg">
          <h3 class="text-xl font-semibold text-text-primary mb-4">
            👥 Target Users
          </h3>
          <ul class="space-y-2">
            <li
              v-for="(persona, index) in project.vision_document.user_personas"
              :key="index"
              class="flex items-start gap-2"
            >
              <span class="text-primary">•</span>
              <span class="text-text-primary">{{ persona }}</span>
            </li>
          </ul>
        </div>
        
        <div class="bg-surface-secondary p-6 rounded-lg">
          <h3 class="text-xl font-semibold text-text-primary mb-4">
            🔥 Problems Solved
          </h3>
          <ul class="space-y-2">
            <li
              v-for="(pain, index) in project.vision_document.pain_points"
              :key="index"
              class="flex items-start gap-2"
            >
              <span class="text-orange-500">•</span>
              <span class="text-text-primary">{{ pain }}</span>
            </li>
          </ul>
        </div>
        
        <div class="bg-surface-secondary p-6 rounded-lg">
          <h3 class="text-xl font-semibold text-text-primary mb-4">
            ✨ Key Features
          </h3>
          <ul class="space-y-2">
            <li
              v-for="(feature, index) in project.vision_document.key_features"
              :key="index"
              class="flex items-start gap-2"
            >
              <span class="text-green-500">•</span>
              <span class="text-text-primary">{{ feature }}</span>
            </li>
          </ul>
        </div>
      </div>
      
      <!-- Design System Preview -->
      <div v-if="project.design_system" class="mb-8">
        <h3 class="text-2xl font-semibold text-text-primary mb-4">
          🎨 Design System
        </h3>
        <div class="bg-surface-secondary p-6 rounded-lg">
          <!-- Color palette preview -->
          <div class="grid grid-cols-4 gap-4 mb-6">
            <div
              v-for="(color, name) in project.design_system.colors"
              :key="name"
              class="text-center"
            >
              <div
                class="w-full h-20 rounded-lg mb-2"
                :style="{ backgroundColor: color }"
              />
              <p class="text-sm text-text-secondary">{{ name }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Mockups Preview -->
      <div v-if="project.mockups?.length" class="mb-8">
        <h3 class="text-2xl font-semibold text-text-primary mb-4">
          📱 Mockups
        </h3>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="mockup in project.mockups"
            :key="mockup.id"
            class="bg-surface-secondary rounded-lg overflow-hidden"
          >
            <img
              :src="mockup.preview_url"
              :alt="mockup.name"
              class="w-full h-48 object-cover"
            />
            <div class="p-4">
              <h4 class="font-medium text-text-primary">{{ mockup.name }}</h4>
            </div>
          </div>
        </div>
      </div>
      
      <!-- CTA -->
      <div class="text-center py-12 border-t border-surface">
        <h3 class="text-xl font-semibold text-text-primary mb-4">
          Want to build something amazing?
        </h3>
        <p class="text-text-secondary mb-6">
          Start your own project with FlexOS
        </p>
        <NuxtLink
          to="/"
          class="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
        >
          Get Started Free
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const supabase = useSupabaseTyped()

const loading = ref(true)
const error = ref('')
const project = ref<any>(null)
const viewCount = ref(0)

const loadSharedProject = async () => {
  try {
    const token = route.params.token as string
    
    // Get shared project
    const { data: share, error: shareError } = await supabase
      .from('shared_projects')
      .select(`
        *,
        project:projects (
          *,
          vision_document:vision_documents (*),
          design_system:design_systems (*),
          mockups (*),
          user:users (email)
        )
      `)
      .eq('share_token', token)
      .eq('is_public', true)
      .single()
    
    if (shareError || !share) {
      error.value = 'Project not found or link has expired'
      return
    }
    
    project.value = share.project
    viewCount.value = share.view_count || 0
    
    // Increment view count
    await supabase.rpc('increment_share_view_count', {
      share_token_param: token
    })
    
  } catch (err) {
    error.value = 'Failed to load project'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadSharedProject()
})
</script>
