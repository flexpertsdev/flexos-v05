<template>
  <div class="database-panel">
    <h2 class="panel-heading">Database</h2>
    <div class="panel-content">
      <p class="placeholder-text">Define your data models and relationships</p>
      
      <div class="model-list">
        <div 
          v-for="(model, modelName) in databaseSchema.models" 
          :key="modelName"
          class="model-item"
        >
          <div class="model-header">
            <span class="model-icon">{{ getModelIcon(model.type) }}</span>
            <h3>{{ modelName }}</h3>
            <button @click="editModel(modelName)" class="edit-button">Edit</button>
          </div>
          <div class="model-fields">
            <div 
              v-for="(field, fieldName) in model.fields" 
              :key="fieldName"
              class="field"
            >
              <span class="field-name">{{ fieldName }}</span>
              <span class="field-type">{{ field.type }}</span>
              <span v-if="field.relation" class="field-relation">→ {{ field.relation.model }}</span>
            </div>
          </div>
        </div>
        
        <!-- Empty state -->
        <div v-if="Object.keys(databaseSchema.models).length === 0" class="empty-state">
          <svg viewBox="0 0 24 24" class="empty-icon">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
          </svg>
          <p>No models defined yet</p>
          <p class="empty-hint">Create your first data model to get started</p>
        </div>
      </div>

      <button @click="addModel" class="add-button">
        <span>+</span> Add New Model
      </button>
    </div>
    
    <!-- Model Editor Modal -->
    <Teleport to="body">
      <div v-if="showModelEditor" class="modal-overlay" @click="closeModelEditor">
        <div class="model-editor" @click.stop>
          <div class="editor-header">
            <h3>{{ editingModel.originalName ? 'Edit Model' : 'New Model' }}</h3>
            <button @click="closeModelEditor" class="close-button">
              <svg viewBox="0 0 24 24" class="icon">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>
          
          <div class="editor-content">
            <!-- Model Name -->
            <div class="form-group">
              <label>Model Name</label>
              <input 
                v-model="editingModel.name" 
                type="text"
                placeholder="e.g., User, Post, Product"
                class="form-input"
              >
            </div>
            
            <!-- Model Type -->
            <div class="form-group">
              <label>Model Type</label>
              <select v-model="editingModel.type" class="form-select">
                <option value="collection">Collection</option>
                <option value="document">Document</option>
                <option value="embedded">Embedded</option>
              </select>
            </div>
            
            <!-- Fields -->
            <div class="form-group">
              <label>Fields</label>
              <div class="fields-list">
                <div 
                  v-for="(field, index) in editingModel.fields" 
                  :key="index"
                  class="field-editor"
                >
                  <input 
                    v-model="field.name" 
                    type="text"
                    placeholder="Field name"
                    class="field-input"
                  >
                  <select v-model="field.type" class="field-select">
                    <option value="String">String</option>
                    <option value="Number">Number</option>
                    <option value="Boolean">Boolean</option>
                    <option value="Date">Date</option>
                    <option value="UUID">UUID</option>
                    <option value="JSON">JSON</option>
                    <option value="Text">Text</option>
                    <option value="Reference">Reference</option>
                  </select>
                  <input 
                    v-if="field.type === 'Reference'"
                    v-model="field.relation" 
                    type="text"
                    placeholder="Model name"
                    class="relation-input"
                  >
                  <button @click="removeField(index)" class="remove-field-btn">
                    <svg viewBox="0 0 24 24" class="icon">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                  </button>
                </div>
              </div>
              <button @click="addField" class="add-field-btn">
                <svg viewBox="0 0 24 24" class="icon">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
                Add Field
              </button>
            </div>
          </div>
          
          <div class="editor-actions">
            <button @click="closeModelEditor" class="btn-cancel">Cancel</button>
            <button @click="deleteModel" v-if="editingModel.originalName" class="btn-delete">Delete</button>
            <button @click="saveModel" class="btn-save">Save</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import type { Database } from '~/types/database'

type Project = Database['public']['Tables']['projects']['Row']

interface Props {
  project?: Project | null
}

interface FieldDefinition {
  type: string
  required?: boolean
  unique?: boolean
  default?: any
  relation?: {
    model: string
  }
}

interface Field {
  name: string
  type: string
  required?: boolean
  unique?: boolean
  default?: any
  relation?: string
}

interface Model {
  type: 'collection' | 'document' | 'embedded'
  fields: Record<string, FieldDefinition>
}

interface DatabaseSchema {
  models: Record<string, Model>
  version: string
}

const props = defineProps<Props>()
const supabase = useSupabaseTyped()

// Default database schema
const defaultSchema: DatabaseSchema = {
  models: {},
  version: '1.0.0'
}

// Reactive database schema state
const databaseSchema = reactive<DatabaseSchema>(JSON.parse(JSON.stringify(defaultSchema)))

// Model editor state
const showModelEditor = ref(false)
const editingModel = reactive({
  originalName: '',
  name: '',
  type: 'collection' as Model['type'],
  fields: [] as Array<{ name: string; type: string; relation?: string }>
})

// Load database schema from project metadata
const loadDatabaseSchema = () => {
  if (props.project?.metadata && typeof props.project.metadata === 'object') {
    const metadata = props.project.metadata as any
    if (metadata.databaseSchema) {
      Object.assign(databaseSchema, metadata.databaseSchema)
    }
  }
}

// Update database schema in database
const updateDatabaseSchema = async () => {
  if (!props.project) return
  
  try {
    const newMetadata = {
      ...(props.project.metadata as object || {}),
      databaseSchema: JSON.parse(JSON.stringify(databaseSchema))
    }
    
    const { error } = await supabase
      .from('projects')
      .update({ metadata: newMetadata } as any)
      .eq('id', props.project.id)
    
    if (error) {
      console.error('Failed to update database schema:', error)
    }
  } catch (error) {
    console.error('Error updating database schema:', error)
  }
}

// Get icon for model type
const getModelIcon = (type: string) => {
  const icons: Record<string, string> = {
    collection: '📊',
    document: '📄',
    embedded: '📦'
  }
  return icons[type] || '📊'
}

// Model editor methods
const editModel = (modelName: string) => {
  const model = databaseSchema.models[modelName]
  if (model) {
    editingModel.originalName = modelName
    editingModel.name = modelName
    editingModel.type = model.type
    editingModel.fields = Object.entries(model.fields).map(([name, field]) => ({
      name,
      type: field.type,
      relation: field.relation ? field.relation.model : undefined
    }))
    showModelEditor.value = true
  }
}

const addModel = () => {
  editingModel.originalName = ''
  editingModel.name = ''
  editingModel.type = 'collection'
  editingModel.fields = [
    { name: 'id', type: 'UUID' },
    { name: 'createdAt', type: 'Date' },
    { name: 'updatedAt', type: 'Date' }
  ]
  showModelEditor.value = true
}

const saveModel = () => {
  if (!editingModel.name.trim()) return
  
  // Convert fields array to object
  const fieldsObject: Record<string, FieldDefinition> = {}
  editingModel.fields.forEach(field => {
    if (field.name.trim()) {
      fieldsObject[field.name] = {
        type: field.type,
        ...(field.relation && { relation: { model: field.relation } })
      }
    }
  })
  
  // If renaming, delete old model
  if (editingModel.originalName && editingModel.originalName !== editingModel.name) {
    delete databaseSchema.models[editingModel.originalName]
  }
  
  // Save model
  databaseSchema.models[editingModel.name] = {
    type: editingModel.type,
    fields: fieldsObject
  }
  
  updateDatabaseSchema()
  closeModelEditor()
}

const deleteModel = () => {
  if (editingModel.originalName && editingModel.originalName in databaseSchema.models) {
    delete databaseSchema.models[editingModel.originalName]
    updateDatabaseSchema()
    closeModelEditor()
  }
}

const closeModelEditor = () => {
  showModelEditor.value = false
  editingModel.originalName = ''
  editingModel.name = ''
  editingModel.type = 'collection'
  editingModel.fields = []
}

// Field management
const addField = () => {
  editingModel.fields.push({ name: '', type: 'String' })
}

const removeField = (index: number) => {
  editingModel.fields.splice(index, 1)
}

// Watch for project changes
watch(() => props.project, () => {
  loadDatabaseSchema()
}, { immediate: true })
</script>

<style scoped>
.database-panel {
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

.panel-content {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.placeholder-text {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

.model-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.model-item {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 0.5rem;
  padding: 1.5rem;
}

.model-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.model-icon {
  font-size: 1.5rem;
}

.model-header h3 {
  color: var(--text-primary);
  font-size: 1.125rem;
  font-weight: 600;
  flex: 1;
}

.edit-button {
  background-color: var(--border-primary);
  border: 1px solid var(--border-secondary);
  border-radius: 0.375rem;
  padding: 0.375rem 0.75rem;
  color: var(--text-primary);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.edit-button:hover {
  background-color: var(--border-secondary);
}

.model-fields {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  background-color: var(--bg-primary);
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.field-name {
  color: var(--text-primary);
  font-weight: 500;
  min-width: 120px;
}

.field-type {
  color: var(--primary-500);
  font-family: monospace;
}

.field-relation {
  color: var(--success-500);
  margin-left: auto;
  font-size: 0.75rem;
}

.add-button {
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
  margin-top: auto;
}

.add-button:hover {
  background-color: var(--border-secondary);
}

.add-button span {
  font-size: 1.25rem;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  color: var(--text-tertiary);
}

.empty-icon {
  width: 64px;
  height: 64px;
  fill: currentColor;
  opacity: 0.5;
  margin-bottom: 1rem;
}

.empty-state p {
  margin: 0;
  font-size: 0.875rem;
}

.empty-hint {
  margin-top: 0.5rem !important;
  color: var(--text-muted);
  font-size: 0.75rem !important;
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

/* Model Editor */
.model-editor {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  width: 600px;
  max-width: 90vw;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-lg);
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-primary);
}

.editor-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  color: var(--text-tertiary);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s;
}

.close-button:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.icon {
  width: 20px;
  height: 20px;
  fill: currentColor;
}

/* Editor Content */
.editor-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.form-input,
.form-select {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 6px;
  padding: 0.625rem 0.75rem;
  color: var(--text-primary);
  font-size: 0.875rem;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px rgba(22, 193, 129, 0.1);
}

/* Fields List */
.fields-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field-editor {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.field-input {
  flex: 1;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  color: var(--text-primary);
  font-size: 0.875rem;
}

.field-select {
  width: 140px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  color: var(--text-primary);
  font-size: 0.875rem;
  cursor: pointer;
}

.relation-input {
  width: 120px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  color: var(--text-primary);
  font-size: 0.875rem;
}

.field-input:focus,
.field-select:focus,
.relation-input:focus {
  outline: none;
  border-color: var(--primary-500);
}

.remove-field-btn {
  background: none;
  border: none;
  color: var(--text-tertiary);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s;
}

.remove-field-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #EF4444;
}

.add-field-btn {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.add-field-btn:hover {
  background: var(--bg-quaternary);
  color: var(--text-primary);
  border-color: var(--primary-500);
}

/* Editor Actions */
.editor-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  padding: 1.5rem;
  border-top: 1px solid var(--border-primary);
}

.btn-cancel,
.btn-delete,
.btn-save {
  padding: 0.625rem 1.25rem;
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