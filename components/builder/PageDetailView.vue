<template>
  <div class="page-detail-view">
    <div class="detail-header">
      <button @click="goBack" class="back-btn">
        <svg viewBox="0 0 24 24" class="icon">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
        Back
      </button>
      
      <div class="header-content">
        <h1 class="page-title">{{ page?.name || 'Page Details' }}</h1>
        <div class="header-actions">
          <button @click="editPage" class="action-btn">
            <svg viewBox="0 0 24 24" class="icon">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
            </svg>
            Edit
          </button>
          <button @click="previewPage" class="action-btn primary">
            <svg viewBox="0 0 24 24" class="icon">
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
            </svg>
            Preview
          </button>
        </div>
      </div>
    </div>
    
    <div class="detail-content">
      <!-- Page Info Section -->
      <div class="content-section">
        <h2 class="section-title">Page Information</h2>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Path</span>
            <span class="info-value">{{ page?.path || '/' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Type</span>
            <span class="info-value">{{ page?.type || 'page' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Status</span>
            <span class="status-badge" :class="statusClass">{{ statusText }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Template</span>
            <span class="info-value">{{ page?.template || 'default' }}</span>
          </div>
        </div>
        
        <div v-if="pageDescription" class="description">
          <h3 class="subsection-title">Description</h3>
          <p>{{ pageDescription }}</p>
        </div>
      </div>
      
      <!-- AI-Generated Vue HTML Section -->
      <div class="content-section">
        <div class="section-header">
          <h2 class="section-title">AI-Generated Vue Template</h2>
          <div class="section-actions">
            <button @click="regenerateTemplate" class="icon-btn" title="Regenerate with AI">
              <svg viewBox="0 0 24 24" class="icon">
                <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
              </svg>
            </button>
            <button @click="copyTemplate" class="icon-btn" title="Copy to clipboard">
              <svg viewBox="0 0 24 24" class="icon">
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
              </svg>
            </button>
            <button @click="toggleEditor" class="icon-btn" :title="isEditing ? 'View mode' : 'Edit mode'">
              <svg v-if="!isEditing" viewBox="0 0 24 24" class="icon">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
              </svg>
              <svg v-else viewBox="0 0 24 24" class="icon">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="template-container">
          <!-- Code View -->
          <div v-if="!isEditing" class="code-view">
            <pre class="code-block"><code class="language-vue">{{ vueTemplate || getDefaultTemplate() }}</code></pre>
          </div>
          
          <!-- Edit Mode -->
          <div v-else class="edit-view">
            <textarea 
              v-model="editableTemplate" 
              class="template-editor"
              placeholder="Enter your Vue template code here..."
              spellcheck="false"
            ></textarea>
            <div class="edit-actions">
              <button @click="cancelEdit" class="btn-secondary">Cancel</button>
              <button @click="saveTemplate" class="btn-primary">Save Changes</button>
            </div>
          </div>
        </div>
        
        <!-- Template Info -->
        <div class="template-info">
          <p class="info-text">
            <svg viewBox="0 0 24 24" class="info-icon">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
            This template was generated by AI based on your page requirements. You can edit it directly or regenerate with different specifications.
          </p>
        </div>
      </div>
      
      <!-- Preview Section -->
      <div class="content-section">
        <div class="section-header">
          <h2 class="section-title">Live Preview</h2>
          <div class="preview-controls">
            <button 
              v-for="device in devices" 
              :key="device.id"
              @click="selectedDevice = device.id"
              class="device-btn"
              :class="{ active: selectedDevice === device.id }"
            >
              <svg viewBox="0 0 24 24" class="icon">
                <path :d="device.icon"/>
              </svg>
              {{ device.name }}
            </button>
          </div>
        </div>
        
        <div class="preview-wrapper" :class="`device-${selectedDevice}`">
          <div class="preview-frame">
            <iframe
              ref="previewFrame"
              class="preview-iframe"
              sandbox="allow-scripts allow-same-origin"
              :srcdoc="previewHtml"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { PageRow, PageMeta, PageContent } from '~/types/models/page'
import { getPageMeta, getPageContent } from '~/types/models/page'

interface Props {
  page?: PageRow | null
}

const props = defineProps<Props>()
const emit = defineEmits(['back', 'update'])

// State
const isEditing = ref(false)
const editableTemplate = ref('')
const selectedDevice = ref('desktop')

// Device preview options
const devices = [
  { id: 'mobile', name: 'Mobile', icon: 'M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z' },
  { id: 'tablet', name: 'Tablet', icon: 'M21 4H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 1.99-.9 1.99-2L23 6c0-1.1-.9-2-2-2zm-2 14H5V6h14v12z' },
  { id: 'desktop', name: 'Desktop', icon: 'M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7l-2 3v1h8v-1l-2-3h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 12H3V4h18v10z' }
]

// Computed properties
const pageMeta = computed<PageMeta>(() => {
  if (!props.page) return {}
  return getPageMeta(props.page)
})

const pageContent = computed<PageContent>(() => {
  if (!props.page) return {}
  return getPageContent(props.page)
})

const statusClass = computed(() => {
  const status = pageMeta.value.status || 'draft'
  return {
    'done': status === 'done' || status === 'completed',
    'in-progress': status === 'in-progress',
    'draft': status === 'draft'
  }
})

const statusText = computed(() => {
  const status = pageMeta.value.status || 'draft'
  const statusMap: Record<string, string> = {
    'done': 'Completed',
    'completed': 'Completed',
    'in-progress': 'In Progress',
    'draft': 'Draft'
  }
  return statusMap[status] || 'Draft'
})

const pageDescription = computed(() => {
  return pageMeta.value.description || null
})

const vueTemplate = computed(() => {
  return pageContent.value.vueTemplate || pageContent.value.template || ''
})

// Get default template
const getDefaultTemplate = () => {
  return `<template>
  <div class="${props.page?.slug || 'page'}-container">
    <h1>${props.page?.name || 'Page Title'}</h1>
    <p>This page is currently empty. The AI will generate content based on your requirements.</p>
  </div>
</template>

<script setup>
// Page logic will go here
<\/script>

<style scoped>
.${props.page?.slug || 'page'}-container {
  padding: 2rem;
}
</style>`
}

// Preview HTML with styling
const previewHtml = computed(() => {
  const template = vueTemplate.value || getDefaultTemplate()
  // Extract template content
  const templateMatch = template.match(/<template>([\s\S]*?)<\/template>/)
  const styleMatch = template.match(/<style[^>]*>([\s\S]*?)<\/style>/)
  
  const html = templateMatch ? templateMatch[1] : '<div>No template found</div>'
  const css = styleMatch ? styleMatch[1] : ''
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: -apple-system, system-ui, sans-serif;
          background: #f5f5f5;
          color: #333;
        }
        ${css}
      </style>
    </head>
    <body>
      ${html}
    </body>
    </html>
  `
})

// Methods
const goBack = () => {
  emit('back')
}

const editPage = () => {
  // TODO: Open page editor
  console.log('Edit page')
}

const previewPage = () => {
  // TODO: Open full preview
  console.log('Preview page')
}

const toggleEditor = () => {
  if (!isEditing.value) {
    editableTemplate.value = vueTemplate.value || getDefaultTemplate()
  }
  isEditing.value = !isEditing.value
}

const saveTemplate = async () => {
  if (!props.page) return
  
  // Update page content with new template
  const newContent: PageContent = {
    ...pageContent.value,
    vueTemplate: editableTemplate.value
  }
  
  // TODO: Save to database
  console.log('Save template', newContent)
  isEditing.value = false
}

const cancelEdit = () => {
  editableTemplate.value = ''
  isEditing.value = false
}

const copyTemplate = async () => {
  try {
    await navigator.clipboard.writeText(vueTemplate.value || getDefaultTemplate())
    // TODO: Show success toast
    console.log('Copied to clipboard')
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

const regenerateTemplate = () => {
  // TODO: Call AI to regenerate template
  console.log('Regenerate template with AI')
}
</script>

<style scoped>
.page-detail-view {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
}

/* Header */
.detail-header {
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-primary);
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s;
}

.back-btn:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.header-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--text-primary);
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 6px;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: var(--bg-quaternary);
  border-color: var(--border-secondary);
}

.action-btn.primary {
  background: var(--primary-500);
  border-color: var(--primary-500);
  color: white;
}

.action-btn.primary:hover {
  background: var(--primary-600);
  border-color: var(--primary-600);
}

/* Content */
.detail-content {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
}

.content-section {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.section-actions {
  display: flex;
  gap: 0.5rem;
}

/* Info Grid */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.info-value {
  font-size: 1rem;
  color: var(--text-primary);
  font-weight: 500;
}

.status-badge {
  display: inline-flex;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
  width: fit-content;
}

.status-badge.done {
  background: rgba(22, 193, 129, 0.2);
  color: var(--primary-500);
}

.status-badge.in-progress {
  background: rgba(251, 191, 36, 0.2);
  color: #FBBF24;
}

.status-badge.draft {
  background: rgba(139, 148, 158, 0.2);
  color: var(--text-secondary);
}

.description {
  margin-top: 1rem;
}

.subsection-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.description p {
  color: var(--text-secondary);
  line-height: 1.6;
}

/* Template Section */
.template-container {
  background: var(--bg-primary);
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.code-view {
  position: relative;
}

.code-block {
  padding: 1.5rem;
  margin: 0;
  overflow-x: auto;
  font-size: 0.875rem;
  line-height: 1.6;
}

.code-block code {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  color: var(--text-primary);
}

.edit-view {
  display: flex;
  flex-direction: column;
}

.template-editor {
  width: 100%;
  min-height: 400px;
  padding: 1.5rem;
  background: transparent;
  border: none;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--text-primary);
  resize: vertical;
}

.template-editor:focus {
  outline: none;
}

.edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem;
  border-top: 1px solid var(--border-primary);
  background: var(--bg-secondary);
}

.btn-primary,
.btn-secondary {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: var(--primary-500);
  border: none;
  color: white;
}

.btn-primary:hover {
  background: var(--primary-600);
}

.btn-secondary {
  background: transparent;
  border: 1px solid var(--border-primary);
  color: var(--text-primary);
}

.btn-secondary:hover {
  background: var(--bg-tertiary);
}

.template-info {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.info-icon {
  width: 20px;
  height: 20px;
  fill: var(--text-tertiary);
  flex-shrink: 0;
}

.info-text {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0;
}

/* Preview Section */
.preview-controls {
  display: flex;
  gap: 0.5rem;
}

.device-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.75rem;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 6px;
  color: var(--text-secondary);
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.device-btn:hover {
  background: var(--bg-quaternary);
  color: var(--text-primary);
}

.device-btn.active {
  background: var(--primary-500);
  border-color: var(--primary-500);
  color: white;
}

.device-btn .icon {
  width: 16px;
  height: 16px;
}

.preview-wrapper {
  background: var(--bg-tertiary);
  border-radius: 8px;
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 500px;
}

.preview-frame {
  background: white;
  border-radius: 8px;
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  transition: all 0.3s;
}

.device-mobile .preview-frame {
  width: 375px;
  height: 667px;
}

.device-tablet .preview-frame {
  width: 768px;
  height: 600px;
}

.device-desktop .preview-frame {
  width: 100%;
  max-width: 1200px;
  height: 600px;
}

.preview-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

/* Utilities */
.icon {
  width: 20px;
  height: 20px;
  fill: currentColor;
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
  background: var(--bg-tertiary);
  color: var(--primary-500);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .detail-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .detail-content {
    padding: 1rem;
  }
  
  .preview-wrapper {
    padding: 1rem;
    overflow-x: auto;
  }
  
  .device-tablet .preview-frame,
  .device-desktop .preview-frame {
    width: 375px;
    height: 667px;
  }
}
</style>
