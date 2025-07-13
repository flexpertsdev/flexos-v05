<template>
  <div class="builder-content">
    <!-- Content Header -->
    <div class="content-header">
      <div class="header-left">
        <h2 class="page-title">{{ currentPage?.name || 'Preview' }}</h2>
        <div class="breadcrumb">
          <span>{{ projectName }}</span>
          <span class="separator">/</span>
          <span>{{ currentPage?.path || 'home' }}</span>
        </div>
      </div>
      
      <div class="header-actions">
        <button
          v-for="view in viewModes"
          :key="view.id"
          class="view-button"
          :class="{ 'view-button--active': activeView === view.id }"
          @click="$emit('update:activeView', view.id)"
        >
          <span class="view-icon">{{ view.icon }}</span>
          <span class="view-label">{{ view.label }}</span>
        </button>
      </div>
    </div>
    
    <!-- Content Area -->
    <div class="content-area">
      <!-- Preview View -->
      <div v-if="activeView === 'preview'" class="preview-container">
        <div class="device-frame" :class="`device-frame--${deviceMode}`">
          <iframe
            ref="previewFrame"
            :src="previewUrl"
            class="preview-iframe"
            @load="handleIframeLoad"
          />
        </div>
        
        <!-- Device Selector -->
        <div class="device-selector">
          <button
            v-for="device in devices"
            :key="device.id"
            class="device-button"
            :class="{ 'device-button--active': deviceMode === device.id }"
            @click="deviceMode = device.id"
          >
            {{ device.icon }}
          </button>
        </div>
      </div>
      
      <!-- Code View -->
      <div v-else-if="activeView === 'code'" class="code-container">
        <div class="code-tabs">
          <button
            v-for="file in openFiles"
            :key="file.path"
            class="code-tab"
            :class="{ 'code-tab--active': activeFile?.path === file.path }"
            @click="activeFile = file"
          >
            <span class="file-icon">{{ getFileIcon(file.type) }}</span>
            <span class="file-name">{{ file.name }}</span>
            <button class="close-tab" @click.stop="closeFile(file)">×</button>
          </button>
        </div>
        
        <div class="code-editor">
          <!-- Placeholder for code editor -->
          <pre class="code-content"><code>{{ activeFile?.content || '// Select a file to view' }}</code></pre>
        </div>
      </div>
      
      <!-- Design View -->
      <div v-else-if="activeView === 'design'" class="design-container">
        <div class="design-panels">
          <!-- Component Tree -->
          <div class="design-panel">
            <h3 class="panel-title">Components</h3>
            <div class="component-tree">
              <!-- Component tree would go here -->
              <div class="tree-item">
                <span class="tree-icon">📦</span>
                <span>HomePage</span>
              </div>
              <div class="tree-item tree-item--nested">
                <span class="tree-icon">📦</span>
                <span>Header</span>
              </div>
              <div class="tree-item tree-item--nested">
                <span class="tree-icon">📦</span>
                <span>HeroSection</span>
              </div>
            </div>
          </div>
          
          <!-- Properties Panel -->
          <div class="design-panel">
            <h3 class="panel-title">Properties</h3>
            <div class="properties-list">
              <div class="property-item">
                <label>Title</label>
                <input type="text" value="Welcome to FlexOS" />
              </div>
              <div class="property-item">
                <label>Background</label>
                <input type="color" value="#3b82f6" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Database View -->
      <div v-else-if="activeView === 'database'" class="database-container">
        <div class="database-sidebar">
          <h3 class="sidebar-title">Tables</h3>
          <div class="table-list">
            <div
              v-for="table in databaseTables"
              :key="table.name"
              class="table-item"
              :class="{ 'table-item--active': activeTable?.name === table.name }"
              @click="activeTable = table"
            >
              <span class="table-icon">🗃️</span>
              <span>{{ table.name }}</span>
              <span class="record-count">{{ table.recordCount }}</span>
            </div>
          </div>
        </div>
        
        <div class="database-content">
          <div v-if="activeTable" class="table-viewer">
            <h3>{{ activeTable.name }}</h3>
            <div class="table-grid">
              <!-- Table data would go here -->
              <table>
                <thead>
                  <tr>
                    <th v-for="column in activeTable.columns" :key="column">
                      {{ column }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colspan="3" class="empty-state">No data yet</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div v-else class="empty-state">
            Select a table to view
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Props
interface Props {
  activeView: 'preview' | 'code' | 'design' | 'database'
}

const props = defineProps<Props>()

// Emit
const emit = defineEmits<{
  'update:activeView': [view: string]
}>()

// State
const deviceMode = ref<'mobile' | 'tablet' | 'desktop'>('desktop')
const activeFile = ref<any>(null)
const activeTable = ref<any>(null)
const previewUrl = ref('/preview')
const projectName = ref('My FlexOS App')

// Mock data
const currentPage = ref({
  name: 'Home Page',
  path: 'pages/index.vue'
})

const viewModes = [
  { id: 'preview', label: 'Preview', icon: '👁️' },
  { id: 'code', label: 'Code', icon: '💻' },
  { id: 'design', label: 'Design', icon: '🎨' },
  { id: 'database', label: 'Database', icon: '🗄️' }
]

const devices = [
  { id: 'mobile', icon: '📱', width: 375, height: 667 },
  { id: 'tablet', icon: '📱', width: 768, height: 1024 },
  { id: 'desktop', icon: '🖥️', width: '100%', height: '100%' }
]

const openFiles = ref([
  { 
    path: 'pages/index.vue', 
    name: 'index.vue', 
    type: 'vue',
    content: '<template>\n  <div>\n    <h1>Welcome to FlexOS</h1>\n  </div>\n</template>'
  },
  { 
    path: 'components/Header.vue', 
    name: 'Header.vue', 
    type: 'vue',
    content: '<template>\n  <header>\n    <!-- Header content -->\n  </header>\n</template>'
  }
])

const databaseTables = ref([
  { name: 'users', recordCount: 0, columns: ['id', 'email', 'created_at'] },
  { name: 'projects', recordCount: 0, columns: ['id', 'name', 'owner_id'] },
  { name: 'pages', recordCount: 0, columns: ['id', 'title', 'path'] }
])

// Methods
const getFileIcon = (type: string) => {
  const icons: Record<string, string> = {
    vue: '🟢',
    js: '🟡',
    ts: '🔵',
    css: '🎨',
    html: '📄'
  }
  return icons[type] || '📄'
}

const closeFile = (file: any) => {
  const index = openFiles.value.indexOf(file)
  if (index > -1) {
    openFiles.value.splice(index, 1)
    if (activeFile.value === file) {
      activeFile.value = openFiles.value[0] || null
    }
  }
}

const handleIframeLoad = () => {
  console.log('Preview loaded')
}
</script>

<style scoped>
.builder-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
}

/* Header */
.content-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-secondary);
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text-secondary);
}

.separator {
  opacity: 0.5;
}

.header-actions {
  display: flex;
  gap: 4px;
  background: var(--bg-tertiary);
  padding: 4px;
  border-radius: 8px;
}

.view-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: none;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: var(--transition-base);
  color: var(--text-secondary);
  
  &:hover {
    background: var(--bg-hover);
  }
  
  &.view-button--active {
    background: var(--bg-primary);
    color: var(--color-primary);
    box-shadow: var(--shadow-sm);
  }
}

.view-icon {
  font-size: 16px;
}

.view-label {
  font-size: 13px;
  font-weight: 500;
}

/* Content Area */
.content-area {
  flex: 1;
  overflow: hidden;
  position: relative;
}

/* Preview View */
.preview-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-tertiary);
  padding: 24px;
}

.device-frame {
  background: white;
  border-radius: 12px;
  box-shadow: var(--shadow-xl);
  overflow: hidden;
  transition: all 0.3s ease;
  
  &.device-frame--mobile {
    width: 375px;
    height: 667px;
    border: 12px solid #333;
    border-radius: 24px;
  }
  
  &.device-frame--tablet {
    width: 768px;
    height: 600px;
    border: 16px solid #333;
    border-radius: 16px;
  }
  
  &.device-frame--desktop {
    width: 100%;
    height: 100%;
    max-width: 1200px;
    max-height: 800px;
  }
}

.preview-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.device-selector {
  position: absolute;
  bottom: 24px;
  right: 24px;
  display: flex;
  gap: 8px;
  background: var(--bg-primary);
  padding: 8px;
  border-radius: 12px;
  box-shadow: var(--shadow-lg);
}

.device-button {
  padding: 8px 12px;
  background: none;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: var(--transition-base);
  font-size: 20px;
  
  &:hover {
    background: var(--bg-hover);
  }
  
  &.device-button--active {
    background: var(--color-primary);
    color: white;
  }
}

/* Code View */
.code-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.code-tabs {
  display: flex;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  overflow-x: auto;
}

.code-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: var(--transition-base);
  white-space: nowrap;
  color: var(--text-secondary);
  
  &:hover {
    background: var(--bg-hover);
  }
  
  &.code-tab--active {
    color: var(--color-primary);
    border-bottom-color: var(--color-primary);
    background: var(--bg-primary);
  }
}

.file-icon {
  font-size: 14px;
}

.file-name {
  font-size: 13px;
}

.close-tab {
  margin-left: 4px;
  padding: 2px 4px;
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 1;
  }
}

.code-editor {
  flex: 1;
  overflow: auto;
  background: var(--bg-code);
}

.code-content {
  margin: 0;
  padding: 16px;
  font-family: monospace;
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-primary);
}

/* Design View */
.design-container {
  height: 100%;
  display: flex;
}

.design-panels {
  display: flex;
  width: 100%;
}

.design-panel {
  flex: 1;
  padding: 16px;
  border-right: 1px solid var(--border-color);
  overflow-y: auto;
  
  &:last-child {
    border-right: none;
  }
}

.panel-title {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: var(--text-secondary);
}

.component-tree {
  font-size: 14px;
}

.tree-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  cursor: pointer;
  border-radius: 6px;
  
  &:hover {
    background: var(--bg-hover);
  }
  
  &.tree-item--nested {
    padding-left: 24px;
  }
}

.tree-icon {
  font-size: 16px;
}

.properties-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.property-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  
  label {
    font-size: 12px;
    font-weight: 500;
    color: var(--text-secondary);
  }
  
  input {
    padding: 8px;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    font-size: 14px;
    background: var(--bg-primary);
    color: var(--text-primary);
    
    &:focus {
      outline: none;
      border-color: var(--color-primary);
    }
  }
}

/* Database View */
.database-container {
  height: 100%;
  display: flex;
}

.database-sidebar {
  width: 250px;
  padding: 16px;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  overflow-y: auto;
}

.sidebar-title {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: var(--text-secondary);
}

.table-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.table-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: var(--transition-base);
  
  &:hover {
    background: var(--bg-hover);
  }
  
  &.table-item--active {
    background: var(--color-primary-light);
    color: var(--color-primary);
  }
}

.table-icon {
  font-size: 16px;
}

.record-count {
  margin-left: auto;
  font-size: 12px;
  opacity: 0.7;
}

.database-content {
  flex: 1;
  padding: 24px;
  overflow: auto;
}

.table-viewer {
  h3 {
    font-size: 18px;
    margin: 0 0 16px 0;
  }
}

.table-grid {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th {
    background: var(--bg-secondary);
    padding: 12px;
    text-align: left;
    font-weight: 600;
    font-size: 14px;
    border-bottom: 1px solid var(--border-color);
  }
  
  td {
    padding: 12px;
    font-size: 14px;
  }
}

.empty-state {
  text-align: center;
  color: var(--text-secondary);
  padding: 48px;
}

/* CSS Variables additions */
:root {
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .header-actions {
    display: none;
  }
  
  .design-panels {
    flex-direction: column;
  }
  
  .design-panel {
    border-right: none;
    border-bottom: 1px solid var(--border-color);
  }
  
  .database-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--border-color);
  }
  
  .database-container {
    flex-direction: column;
  }
}
</style>