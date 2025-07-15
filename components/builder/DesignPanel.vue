<template>
  <div class="design-panel">
    <h2 class="panel-heading">Design System</h2>
    
    <div class="design-content">
      <!-- Color Palette Section -->
      <div class="design-section">
        <h3 class="section-title">Color Palette</h3>
        <div class="color-grid">
          <div 
            v-for="(color, key) in designSystem.colors" 
            :key="key"
            class="color-card"
            @click="editColor(key)"
          >
            <div class="color-swatch" :style="{ background: color.value }"></div>
            <div class="color-info">
              <span class="color-name">{{ color.name }}</span>
              <span class="color-value">{{ color.value }}</span>
            </div>
          </div>
          <button @click="addColor" class="add-color-btn">
            <svg viewBox="0 0 24 24" class="add-icon">
              <path d="M12 5v14m-7-7h14"/>
            </svg>
            <span>Add Color</span>
          </button>
        </div>
      </div>

      <!-- Typography Section -->
      <div class="design-section">
        <h3 class="section-title">Typography</h3>
        <div class="typography-card">
          <div class="font-preview" :style="typographyStyles">
            <h1 class="preview-heading">The quick brown fox</h1>
            <p class="preview-paragraph">
              The quick brown fox jumps over the lazy dog. This pangram contains all letters of the alphabet.
            </p>
          </div>
          <div class="font-controls">
            <div class="control-group">
              <label>Font Family</label>
              <select 
                v-model="designSystem.typography.fontFamily" 
                @change="updateDesignSystem"
                class="font-select"
              >
                <option>Inter</option>
                <option>Roboto</option>
                <option>Open Sans</option>
                <option>Poppins</option>
                <option>System</option>
              </select>
            </div>
            <div class="control-group">
              <label>Base Size</label>
              <select 
                v-model="designSystem.typography.baseSize" 
                @change="updateDesignSystem"
                class="font-select"
              >
                <option>14px</option>
                <option>16px</option>
                <option>18px</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Theme Mode Section -->
      <div class="design-section">
        <h3 class="section-title">Theme Mode</h3>
        <div class="theme-grid">
          <label class="theme-card">
            <input 
              type="radio" 
              name="theme" 
              value="light"
              v-model="designSystem.theme.mode"
              @change="updateDesignSystem"
            />
            <div class="theme-preview light">
              <div class="preview-header"></div>
              <div class="preview-content">
                <div class="preview-sidebar"></div>
                <div class="preview-main"></div>
              </div>
            </div>
            <span class="theme-label">Light</span>
          </label>
          
          <label class="theme-card">
            <input 
              type="radio" 
              name="theme" 
              value="dark"
              v-model="designSystem.theme.mode"
              @change="updateDesignSystem"
            />
            <div class="theme-preview dark">
              <div class="preview-header"></div>
              <div class="preview-content">
                <div class="preview-sidebar"></div>
                <div class="preview-main"></div>
              </div>
            </div>
            <span class="theme-label">Dark</span>
          </label>
          
          <label class="theme-card">
            <input 
              type="radio" 
              name="theme" 
              value="auto"
              v-model="designSystem.theme.mode"
              @change="updateDesignSystem"
            />
            <div class="theme-preview auto">
              <div class="preview-header"></div>
              <div class="preview-content">
                <div class="preview-sidebar"></div>
                <div class="preview-main"></div>
              </div>
            </div>
            <span class="theme-label">Auto</span>
          </label>
        </div>
      </div>

      <!-- Spacing Section -->
      <div class="design-section">
        <h3 class="section-title">Spacing & Layout</h3>
        <div class="spacing-grid">
          <div 
            v-for="(value, key) in designSystem.spacing" 
            :key="key"
            class="spacing-item"
          >
            <div 
              class="spacing-demo" 
              :style="{ width: value, height: '32px', background: designSystem.colors.primary?.value || 'var(--primary-500)' }"
            ></div>
            <span class="spacing-label">{{ key.toUpperCase() }} ({{ value }})</span>
          </div>
        </div>
      </div>

      <!-- Border Radius Section -->
      <div class="design-section">
        <h3 class="section-title">Border Radius</h3>
        <div class="radius-grid">
          <div 
            v-for="(value, key) in designSystem.borderRadius" 
            :key="key"
            class="radius-item"
          >
            <div 
              class="radius-demo" 
              :style="{ 
                borderRadius: value,
                background: 'var(--bg-secondary)',
                border: `2px solid ${designSystem.colors.primary?.value || 'var(--primary-500)'}`
              }"
            ></div>
            <span class="radius-label">{{ formatRadiusLabel(key, value) }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Color Editor Modal -->
    <Teleport to="body">
      <div v-if="showColorEditor" class="modal-overlay" @click="closeColorEditor">
        <div class="color-editor" @click.stop>
          <h3>Edit Color</h3>
          <div class="editor-content">
            <div class="input-group">
              <label>Name</label>
              <input 
                v-model="editingColor.name" 
                type="text"
                class="editor-input"
              >
            </div>
            <div class="input-group">
              <label>Value</label>
              <div class="color-input-wrapper">
                <input 
                  v-model="editingColor.value" 
                  type="color"
                  class="color-picker"
                >
                <input 
                  v-model="editingColor.value" 
                  type="text"
                  class="editor-input"
                >
              </div>
            </div>
          </div>
          <div class="editor-actions">
            <button @click="closeColorEditor" class="btn-cancel">Cancel</button>
            <button @click="deleteColor" v-if="editingColor.key !== 'new'" class="btn-delete">Delete</button>
            <button @click="saveColor" class="btn-save">Save</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue'
import type { Database } from '~/types/database'

type Project = Database['public']['Tables']['projects']['Row']

interface Props {
  project?: Project | null
}

interface DesignSystem {
  colors: Record<string, { name: string; value: string }>
  typography: {
    fontFamily: string
    baseSize: string
  }
  theme: {
    mode: 'light' | 'dark' | 'auto'
  }
  spacing: Record<string, string>
  borderRadius: Record<string, string>
}

const props = defineProps<Props>()
const supabase = useSupabaseTyped()

// Default design system
const defaultDesignSystem: DesignSystem = {
  colors: {
    primary: { name: 'Primary', value: '#16C181' },
    secondary: { name: 'Secondary', value: '#3B82F6' },
    success: { name: 'Success', value: '#22C55E' },
    warning: { name: 'Warning', value: '#FBBF24' },
    danger: { name: 'Danger', value: '#EF4444' },
    info: { name: 'Info', value: '#06B6D4' }
  },
  typography: {
    fontFamily: 'Inter',
    baseSize: '16px'
  },
  theme: {
    mode: 'dark'
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px'
  },
  borderRadius: {
    none: '0',
    sm: '4px',
    md: '8px',
    lg: '12px',
    full: '50%'
  }
}

// Reactive design system state
const designSystem = reactive<DesignSystem>(JSON.parse(JSON.stringify(defaultDesignSystem)))

// Color editor state
const showColorEditor = ref(false)
const editingColor = reactive({
  key: '',
  name: '',
  value: ''
})

// Load design system from project metadata
const loadDesignSystem = () => {
  if (props.project?.metadata && typeof props.project.metadata === 'object') {
    const metadata = props.project.metadata as any
    if (metadata.designSystem) {
      Object.assign(designSystem, metadata.designSystem)
    }
  }
}

// Update design system in database
const updateDesignSystem = async () => {
  if (!props.project) return
  
  try {
    const newMetadata = {
      ...(props.project.metadata as object || {}),
      designSystem: JSON.parse(JSON.stringify(designSystem))
    }
    
    const { error } = await supabase
      .from('projects')
      .update({ metadata: newMetadata } as any)
      .eq('id', props.project.id)
    
    if (error) {
      console.error('Failed to update design system:', error)
    }
  } catch (error) {
    console.error('Error updating design system:', error)
  }
}

// Typography styles
const typographyStyles = computed(() => ({
  fontFamily: designSystem.typography.fontFamily === 'System' 
    ? '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    : designSystem.typography.fontFamily,
  fontSize: designSystem.typography.baseSize
}))

// Color editor methods
const editColor = (key: string) => {
  const color = designSystem.colors[key]
  if (color) {
    editingColor.key = key
    editingColor.name = color.name
    editingColor.value = color.value
    showColorEditor.value = true
  }
}

const addColor = () => {
  editingColor.key = 'new'
  editingColor.name = 'New Color'
  editingColor.value = '#000000'
  showColorEditor.value = true
}

const saveColor = () => {
  if (editingColor.key === 'new') {
    // Generate a new key
    const key = editingColor.name.toLowerCase().replace(/\s+/g, '-')
    designSystem.colors[key] = {
      name: editingColor.name,
      value: editingColor.value
    }
  } else {
    designSystem.colors[editingColor.key] = {
      name: editingColor.name,
      value: editingColor.value
    }
  }
  updateDesignSystem()
  closeColorEditor()
}

const deleteColor = () => {
  if (editingColor.key !== 'new' && editingColor.key in designSystem.colors) {
    delete designSystem.colors[editingColor.key]
    updateDesignSystem()
    closeColorEditor()
  }
}

const closeColorEditor = () => {
  showColorEditor.value = false
  editingColor.key = ''
  editingColor.name = ''
  editingColor.value = ''
}

// Format radius label
const formatRadiusLabel = (key: string, value: string) => {
  return `${key.charAt(0).toUpperCase() + key.slice(1)} ${value === '50%' ? '' : `(${value})`}`
}

// Watch for project changes
watch(() => props.project, () => {
  loadDesignSystem()
}, { immediate: true })
</script>

<style scoped>
.design-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.panel-heading {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
}

.design-content {
  flex: 1;
  overflow-y: auto;
}

/* Design Sections */
.design-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

/* Color Palette */
.color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}

.color-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.color-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.color-swatch {
  width: 100%;
  height: 80px;
  border-radius: 8px;
  margin-bottom: 0.75rem;
  transition: transform 0.2s;
}

.color-card:hover .color-swatch {
  transform: scale(0.95);
}

.add-color-btn {
  background: var(--bg-secondary);
  border: 2px dashed var(--border-primary);
  border-radius: 12px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 140px;
}

.add-color-btn:hover {
  border-color: var(--primary-500);
  border-style: solid;
  background: var(--bg-tertiary);
}

.add-icon {
  width: 24px;
  height: 24px;
  stroke: var(--text-tertiary);
  stroke-width: 2;
  fill: none;
}

.add-color-btn:hover .add-icon {
  stroke: var(--primary-500);
}

.color-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.color-name {
  font-weight: 500;
  color: var(--text-primary);
}

.color-value {
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-family: monospace;
}

/* Typography */
.typography-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  padding: 1.5rem;
}

.font-preview {
  margin-bottom: 1.5rem;
}

.preview-heading {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.preview-paragraph {
  color: var(--text-secondary);
  line-height: 1.6;
}

.font-controls {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.control-group label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.font-select {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 6px;
  padding: 0.5rem;
  color: var(--text-primary);
  font-size: 0.875rem;
  cursor: pointer;
}

.font-select:focus {
  outline: none;
  border-color: var(--primary-500);
}

/* Theme Mode */
.theme-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
}

.theme-card {
  position: relative;
  cursor: pointer;
}

.theme-card input {
  position: absolute;
  opacity: 0;
}

.theme-preview {
  background: var(--bg-secondary);
  border: 2px solid var(--border-primary);
  border-radius: 12px;
  padding: 0.75rem;
  height: 120px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.theme-card input:checked + .theme-preview {
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px rgba(22, 193, 129, 0.2);
}

.preview-header {
  height: 20px;
  background: var(--bg-tertiary);
  border-radius: 4px;
}

.preview-content {
  flex: 1;
  display: flex;
  gap: 0.5rem;
}

.preview-sidebar {
  width: 30%;
  background: var(--bg-tertiary);
  border-radius: 4px;
}

.preview-main {
  flex: 1;
  background: var(--bg-quaternary);
  border-radius: 4px;
}

.theme-preview.light .preview-header,
.theme-preview.light .preview-sidebar {
  background: #E5E7EB;
}

.theme-preview.light .preview-main {
  background: #F3F4F6;
}

.theme-preview.light {
  background: white;
}

.theme-preview.auto {
  background: linear-gradient(to right, white 50%, var(--bg-secondary) 50%);
}

.theme-label {
  display: block;
  text-align: center;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
}

/* Spacing */
.spacing-grid {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.spacing-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.spacing-demo {
  background: var(--primary-500);
  opacity: 0.8;
}

.spacing-demo.xs {
  width: 4px;
  height: 32px;
}

.spacing-demo.sm {
  width: 8px;
  height: 32px;
}

.spacing-demo.md {
  width: 16px;
  height: 32px;
}

.spacing-demo.lg {
  width: 24px;
  height: 32px;
}

.spacing-demo.xl {
  width: 32px;
  height: 32px;
}

.spacing-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

/* Border Radius */
.radius-grid {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.radius-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.radius-demo {
  width: 60px;
  height: 60px;
  background: var(--bg-secondary);
  border: 2px solid var(--primary-500);
}

.radius-demo.none {
  border-radius: 0;
}

.radius-demo.sm {
  border-radius: 4px;
}

.radius-demo.md {
  border-radius: 8px;
}

.radius-demo.lg {
  border-radius: 12px;
}

.radius-demo.full {
  border-radius: 50%;
}

.radius-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

/* Modal Overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

/* Color Editor */
.color-editor {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  padding: 1.5rem;
  min-width: 320px;
  box-shadow: var(--shadow-lg);
}

.color-editor h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
}

.editor-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.editor-input {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 6px;
  padding: 0.5rem;
  color: var(--text-primary);
  font-size: 0.875rem;
}

.editor-input:focus {
  outline: none;
  border-color: var(--primary-500);
}

.color-input-wrapper {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.color-picker {
  width: 40px;
  height: 40px;
  border: 1px solid var(--border-primary);
  border-radius: 6px;
  cursor: pointer;
  background: transparent;
  padding: 2px;
}

.color-picker::-webkit-color-swatch-wrapper {
  padding: 0;
}

.color-picker::-webkit-color-swatch {
  border: none;
  border-radius: 4px;
}

.editor-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.btn-cancel,
.btn-delete,
.btn-save {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-cancel {
  background: var(--bg-tertiary);
  color: var(--text-secondary);
}

.btn-cancel:hover {
  background: var(--bg-quaternary);
  color: var(--text-primary);
}

.btn-delete {
  background: rgba(239, 68, 68, 0.1);
  color: #EF4444;
  margin-right: auto;
}

.btn-delete:hover {
  background: rgba(239, 68, 68, 0.2);
}

.btn-save {
  background: var(--primary-500);
  color: white;
}

.btn-save:hover {
  background: var(--primary-600);
}
</style>