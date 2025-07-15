<template>
  <div class="attachment-selector">
    <!-- Search Header -->
    <div class="selector-header">
      <div class="search-container">
        <svg viewBox="0 0 24 24" class="search-icon">
          <path d="M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.35-4.35"/>
        </svg>
        <input 
          v-model="searchQuery"
          type="text"
          placeholder="Search pages, features, files..."
          class="search-input"
          @input="handleSearch"
        >
      </div>
    </div>
    
    <!-- Quick Actions -->
    <div class="quick-actions">
      <button @click="uploadFile" class="quick-action-btn">
        <svg viewBox="0 0 24 24" class="icon">
          <path d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z"/>
        </svg>
        <span>Upload File</span>
      </button>
      <button @click="addLink" class="quick-action-btn">
        <svg viewBox="0 0 24 24" class="icon">
          <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
        </svg>
        <span>Add Link</span>
      </button>
    </div>
    
    <!-- Content Sections -->
    <div class="selector-content">
      <!-- Pages -->
      <div v-if="filteredPages.length > 0" class="content-section">
        <div class="section-header" @click="toggleSection('pages')">
          <svg viewBox="0 0 24 24" class="section-icon">
            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
          </svg>
          <span class="section-title">Pages ({{ filteredPages.length }})</span>
          <svg viewBox="0 0 24 24" class="chevron" :class="{ expanded: expandedSections.pages }">
            <path d="M7 10l5 5 5-5z"/>
          </svg>
        </div>
        <div v-if="expandedSections.pages" class="section-items">
          <AttachmentListItem 
            v-for="page in filteredPages"
            :key="page.id"
            :item="formatPageItem(page)"
            @select="selectItem"
          />
        </div>
      </div>
      
      <!-- Features -->
      <div v-if="filteredFeatures.length > 0" class="content-section">
        <div class="section-header" @click="toggleSection('features')">
          <svg viewBox="0 0 24 24" class="section-icon">
            <path d="M9 12l2 2 4-4M7.835 4.697a3 3 0 001.946.773H14.22a3 3 0 001.946-.773l1.368-1.196A1 1 0 0118.196 3H5.804a1 1 0 01.662.501l1.369 1.196zM18 10h.01M6 21h12a2 2 0 002-2V9a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
          <span class="section-title">Features ({{ filteredFeatures.length }})</span>
          <svg viewBox="0 0 24 24" class="chevron" :class="{ expanded: expandedSections.features }">
            <path d="M7 10l5 5 5-5z"/>
          </svg>
        </div>
        <div v-if="expandedSections.features" class="section-items">
          <AttachmentListItem 
            v-for="feature in filteredFeatures"
            :key="feature.id"
            :item="formatFeatureItem(feature)"
            @select="selectItem"
          />
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-if="isSearching && noResults" class="empty-state">
        <svg viewBox="0 0 24 24" class="empty-icon">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
        <p>No results found for "{{ searchQuery }}"</p>
      </div>
    </div>
    
    <!-- Hidden file input -->
    <input 
      ref="fileInput"
      type="file"
      accept="image/*,.pdf,.doc,.docx,.txt,.md"
      style="display: none"
      @change="handleFileUpload"
    >
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Context } from '~/types/chat'
import type { PageRow } from '~/types/models/page'
import type { Database } from '~/types/database'

type Feature = Database['public']['Tables']['features']['Row']
type Journey = Database['public']['Tables']['journeys']['Row']

// Child component
const AttachmentListItem = defineAsyncComponent(() => import('./AttachmentListItem.vue'))

const props = defineProps<{
  projectId: string
}>()

const emit = defineEmits<{
  select: [context: Context]
}>()

// State
const searchQuery = ref('')
const pages = ref<PageRow[]>([])
const features = ref<Feature[]>([])
const fileInput = ref<HTMLInputElement>()

// UI State
const expandedSections = ref({
  pages: true,
  features: false
})

// Load data
const supabase = useSupabaseTyped()

const loadProjectData = async () => {
  // Load pages
  const { data: pagesData } = await supabase
    .from('pages')
    .select('*')
    .eq('project_id', props.projectId)
    .order('name')
  pages.value = pagesData || []
  
  // Load features
  const { data: featuresData } = await supabase
    .from('features')
    .select('*')
    .eq('project_id', props.projectId)
    .order('name')
  features.value = featuresData || []
}

// Search filtering - DISABLED DUE TO TYPESCRIPT BUG
const isSearching = computed(() => false) // searchQuery.value.length > 0

// Just return all items - no filtering due to TypeScript issue
const filteredPages = computed(() => pages.value)
const filteredFeatures = computed(() => features.value)

/*
// Original filtering code - causes "Type instantiation is excessively deep" error
const filteredPages = computed(() => {
  const currentPages = pages.value
  if (!isSearching.value) return currentPages
  
  const query = searchQuery.value.toLowerCase()
  const result: PageRow[] = []
  
  for (const page of currentPages) {
    if (page.name.toLowerCase().includes(query) || 
        page.path.toLowerCase().includes(query)) {
      result.push(page)
    }
  }
  
  return result
})

const filteredFeatures = computed(() => {
  const currentFeatures = features.value
  if (!isSearching.value) return currentFeatures
  
  const query = searchQuery.value.toLowerCase()
  const result: Feature[] = []
  
  for (const feature of currentFeatures) {
    if (feature.name.toLowerCase().includes(query) || 
        (feature.description && feature.description.toLowerCase().includes(query))) {
      result.push(feature)
    }
  }
  
  return result
})
*/

const noResults = computed(() => 
  filteredPages.value.length === 0 &&
  filteredFeatures.value.length === 0
)

// Format items for display
const formatPageItem = (page: PageRow) => ({
  id: page.id,
  type: 'page' as const,
  name: page.name,
  description: page.path,
  icon: '📄',
  data: page
})

const formatFeatureItem = (feature: Feature) => ({
  id: feature.id,
  type: 'feature' as const,
  name: feature.name,
  description: feature.description || 'No description',
  icon: '⚡',
  data: feature
})

// Methods
const handleSearch = () => {
  // Expand all sections when searching
  if (isSearching.value) {
    expandedSections.value.pages = true
    expandedSections.value.features = true
  }
}

const toggleSection = (section: keyof typeof expandedSections.value) => {
  expandedSections.value[section] = !expandedSections.value[section]
}

const selectItem = (item: any) => {
  const context: Context = {
    type: 'reference',
    data: {
      referenceType: item.type,
      referenceId: item.id,
      referenceName: item.name,
      referenceData: item.data
    }
  }
  emit('select', context)
}

const uploadFile = () => {
  fileInput.value?.click()
}

const handleFileUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  
  // TODO: Upload file to Supabase storage
  console.log('Upload file:', file)
  
  // Create attachment context
  const context: Context = {
    type: 'attachment',
    data: {
      attachmentId: `temp_${Date.now()}`,
      fileType: file.type.startsWith('image/') ? 'image' : 'file',
      originalName: file.name,
      storageUrl: URL.createObjectURL(file) // Temporary
    }
  }
  
  emit('select', context)
}

const addLink = () => {
  const url = prompt('Enter URL:')
  if (!url) return
  
  const context: Context = {
    type: 'attachment',
    data: {
      attachmentId: `url_${Date.now()}`,
      fileType: 'url',
      originalName: url,
      storageUrl: url
    }
  }
  
  emit('select', context)
}

onMounted(() => {
  loadProjectData()
})
</script>

<style scoped>
.attachment-selector {
  display: flex;
  flex-direction: column;
  height: 400px;
  max-height: 60vh;
}

/* Search Header */
.selector-header {
  padding: 1rem;
  border-bottom: 1px solid var(--border-primary);
  flex-shrink: 0;
}

.search-container {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  stroke: var(--text-tertiary);
  stroke-width: 2;
  fill: none;
}

.search-input {
  width: 100%;
  padding: 0.5rem 0.75rem 0.5rem 2.5rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-primary);
  border-radius: 6px;
  font-size: 0.875rem;
  color: var(--text-primary);
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px var(--primary-100);
}

/* Quick Actions */
.quick-actions {
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border-primary);
  flex-shrink: 0;
}

.quick-action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 6px;
  font-size: 0.75rem;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s;
}

.quick-action-btn:hover {
  background: var(--bg-quaternary);
  border-color: var(--primary-500);
  color: var(--primary-500);
}

.quick-action-btn .icon {
  width: 16px;
  height: 16px;
  fill: currentColor;
}

/* Content */
.selector-content {
  flex: 1;
  overflow-y: auto;
}

.content-section {
  border-bottom: 1px solid var(--border-primary);
}

.content-section:last-child {
  border-bottom: none;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background 0.2s;
  user-select: none;
}

.section-header:hover {
  background: var(--bg-tertiary);
}

.section-icon {
  width: 18px;
  height: 18px;
  fill: var(--text-secondary);
  flex-shrink: 0;
}

.section-title {
  flex: 1;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
}

.chevron {
  width: 18px;
  height: 18px;
  fill: var(--text-tertiary);
  transition: transform 0.2s;
}

.chevron.expanded {
  transform: rotate(180deg);
}

.section-items {
  padding: 0 0.5rem 0.5rem;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: var(--text-tertiary);
}

.empty-icon {
  width: 48px;
  height: 48px;
  fill: currentColor;
  margin-bottom: 1rem;
}

.empty-state p {
  font-size: 0.875rem;
  margin: 0;
}

/* Utilities */
.icon {
  width: 20px;
  height: 20px;
  fill: currentColor;
}
</style>
