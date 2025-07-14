<template>
  <div class="pages-panel">
    <div class="panel-header">
      <h2 class="panel-heading">Design Pages</h2>
      <div class="panel-actions">
        <button @click="refreshPages" class="icon-btn" title="Refresh">
          <svg viewBox="0 0 24 24" class="icon">
            <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
          </svg>
        </button>
      </div>
    </div>
    
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading pages...</p>
    </div>
    
    <div v-else-if="error" class="error-state">
      <p>Error loading pages: {{ error }}</p>
      <button @click="loadPages" class="retry-btn">Retry</button>
    </div>
    
    <div v-else class="pages-grid">
      <!-- Page Cards -->
      <div 
        v-for="page in pages" 
        :key="page.id" 
        @click="openPage(page)"
        class="page-card"
      >
        <div class="page-header">
          <h3 class="page-title">{{ page.name }}</h3>
          <span class="status-badge" :class="getStatusClass(page)">{{ getStatusLabel(page) }}</span>
        </div>
        <p class="page-description">
          {{ getPageDescription(page) }}
        </p>
        <div class="page-meta">
          <span class="meta-item">
            <svg viewBox="0 0 24 24" class="meta-icon">
              <path d="M12 2l-5.5 9h11z"/>
              <circle cx="17.5" cy="17.5" r="4.5"/>
              <path d="M3 13.5h8v8H3z"/>
            </svg>
            {{ page.type || 'page' }}
          </span>
          <span class="meta-item">
            <svg viewBox="0 0 24 24" class="meta-icon">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            {{ page.path }}
          </span>
        </div>
        <div v-if="getPageTags(page).length > 0" class="page-tags">
          <span v-for="tag in getPageTags(page)" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </div>

      <!-- Empty state if no pages -->
      <div v-if="pages.length === 0" class="empty-state-card">
        <svg viewBox="0 0 24 24" class="empty-icon">
          <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
        </svg>
        <h3>No pages yet</h3>
        <p>Start by creating your first page</p>
      </div>

      <!-- Add New Page Button -->
      <button @click="addNewPage" class="add-page-card">
        <svg class="icon-lg" viewBox="0 0 24 24">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        <span>Add New Page</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import type { Database } from '~/types/database'

type Project = Database['public']['Tables']['projects']['Row']
type Page = Database['public']['Tables']['pages']['Row']

interface Props {
  project?: Project | null
}

const props = defineProps<Props>()
const emit = defineEmits(['select:page', 'add:page'])

const supabase = useSupabase()
const pages = ref<Page[]>([])
const loading = ref(true)
const error = ref('')

// Load pages from database
const loadPages = async () => {
  if (!props.project?.id) return
  
  loading.value = true
  error.value = ''
  
  try {
    const { data, error: fetchError } = await supabase
      .from('pages')
      .select('*')
      .eq('project_id', props.project.id)
      .order('order_index', { ascending: true })
    
    if (fetchError) throw fetchError
    
    pages.value = data || []
  } catch (err: any) {
    error.value = err.message
    console.error('Error loading pages:', err)
  } finally {
    loading.value = false
  }
}

// Get page status from metadata
const getPageStatus = (page: Page) => {
  const meta = page.meta as any
  return meta?.status || 'planned'
}

// Get status display class
const getStatusClass = (page: Page) => {
  const status = getPageStatus(page)
  return {
    'done': status === 'done' || status === 'completed',
    'in-progress': status === 'in-progress' || status === 'active',
    'planned': status === 'planned' || status === 'pending'
  }
}

// Get status label
const getStatusLabel = (page: Page) => {
  const status = getPageStatus(page)
  const statusMap: Record<string, string> = {
    'done': 'Done',
    'completed': 'Done',
    'in-progress': 'In Progress',
    'active': 'In Progress',
    'planned': 'Planned',
    'pending': 'Planned'
  }
  return statusMap[status] || 'Planned'
}

// Get page description
const getPageDescription = (page: Page) => {
  const meta = page.meta as any
  if (meta?.description) return meta.description
  
  // Generate description based on page type
  const typeDescriptions: Record<string, string> = {
    'home': 'Main landing page with key features and navigation',
    'product': 'Product details and information page',
    'listing': 'Browse and filter items or content',
    'form': 'User input and data collection page',
    'dashboard': 'Overview and summary information',
    'profile': 'User account and settings page'
  }
  
  return typeDescriptions[page.type] || 'Custom page layout and content'
}

// Get page tags from metadata
const getPageTags = (page: Page) => {
  const meta = page.meta as any
  if (meta?.tags && Array.isArray(meta.tags)) {
    return meta.tags.slice(0, 3) // Limit to 3 tags for display
  }
  
  // Generate default tags based on page type
  const defaultTags: Record<string, string[]> = {
    'home': ['Hero', 'Navigation', 'Features'],
    'product': ['Gallery', 'Details', 'Reviews'],
    'listing': ['Grid', 'Filters', 'Sorting'],
    'form': ['Inputs', 'Validation', 'Submit'],
    'dashboard': ['Charts', 'Stats', 'Overview'],
    'profile': ['Settings', 'Account', 'Preferences']
  }
  
  return defaultTags[page.type] || []
}

// Handle page selection
const openPage = (page: Page) => {
  emit('select:page', page)
}

// Add new page
const addNewPage = () => {
  emit('add:page')
}

// Refresh pages
const refreshPages = () => {
  loadPages()
}

// Load pages on mount and when project changes
onMounted(() => {
  loadPages()
})

watch(() => props.project?.id, () => {
  loadPages()
})

// Subscribe to real-time updates
onMounted(() => {
  if (!props.project?.id) return
  
  const channel = supabase
    .channel(`pages:${props.project.id}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'pages',
        filter: `project_id=eq.${props.project.id}`
      },
      () => {
        loadPages()
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
.pages-panel {
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

.pages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  overflow-y: auto;
  padding-bottom: 1rem;
}

.page-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.page-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--border-secondary);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.page-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-badge.done {
  background: rgba(22, 193, 129, 0.2);
  color: var(--primary-500);
}

.status-badge.in-progress {
  background: rgba(251, 191, 36, 0.2);
  color: #FBBF24;
}

.status-badge.planned {
  background: rgba(139, 148, 158, 0.2);
  color: var(--text-secondary);
}

.page-description {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.page-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.75rem;
  margin-top: 0.75rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.meta-icon {
  width: 14px;
  height: 14px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
}

.page-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  background: var(--bg-tertiary);
  color: var(--text-tertiary);
  border-radius: 4px;
}

.empty-state-card {
  grid-column: 1 / -1;
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

.add-page-card {
  background: transparent;
  border: 2px dashed var(--border-primary);
  border-radius: 12px;
  padding: 2rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  color: var(--text-tertiary);
  min-height: 200px;
}

.add-page-card:hover {
  border-color: var(--primary-500);
  background: var(--bg-secondary);
  color: var(--primary-500);
}

.add-page-card .icon-lg {
  width: 32px;
  height: 32px;
  stroke: currentColor;
  stroke-width: 2;
  fill: none;
}

.add-page-card span {
  font-weight: 500;
}
</style>