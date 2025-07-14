<template>
  <div class="form-message">
    <form @submit.prevent="handleSubmit">
      <div v-for="field in data.fields" :key="field.name" class="form-field">
        <label :for="field.name" class="field-label">
          {{ field.label }}
          <span v-if="field.required" class="required">*</span>
        </label>
        
        <input
          v-if="field.type === 'text' || field.type === 'number'"
          :id="field.name"
          v-model="formData[field.name]"
          :type="field.type"
          :required="field.required"
          class="field-input"
        />
        
        <textarea
          v-else-if="field.type === 'textarea'"
          :id="field.name"
          v-model="formData[field.name]"
          :required="field.required"
          rows="3"
          class="field-textarea"
        />
        
        <select
          v-else-if="field.type === 'select'"
          :id="field.name"
          v-model="formData[field.name]"
          :required="field.required"
          class="field-select"
        >
          <option value="">Choose...</option>
          <option v-for="option in field.options" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
        
        <label v-else-if="field.type === 'checkbox'" class="checkbox-label">
          <input
            :id="field.name"
            v-model="formData[field.name]"
            type="checkbox"
            class="field-checkbox"
          />
          {{ field.label }}
        </label>
      </div>
      
      <button type="submit" class="submit-btn">
        {{ data.submitLabel || 'Submit' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

interface Props {
  data: {
    fields: Array<{
      name: string
      label: string
      type: 'text' | 'number' | 'select' | 'checkbox' | 'textarea'
      required?: boolean
      options?: Array<{ value: string; label: string }>
    }>
    submitLabel?: string
  }
}

const props = defineProps<Props>()
const emit = defineEmits(['submit'])

// Initialize form data
const formData = reactive<Record<string, any>>({})
props.data.fields.forEach(field => {
  formData[field.name] = field.type === 'checkbox' ? false : ''
})

const handleSubmit = () => {
  emit('submit', formData)
}
</script>

<style scoped>
.form-message {
  padding: 1rem;
}

.form-field {
  margin-bottom: 1.25rem;
}

.field-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.required {
  color: var(--danger-500);
}

.field-input,
.field-textarea,
.field-select {
  width: 100%;
  padding: 0.5rem 0.75rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-primary);
  border-radius: 6px;
  color: var(--text-primary);
  font-size: 0.875rem;
  transition: all 0.2s;
}

.field-input:focus,
.field-textarea:focus,
.field-select:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px var(--primary-100);
}

.field-textarea {
  resize: vertical;
  font-family: inherit;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.field-checkbox {
  width: 1rem;
  height: 1rem;
  cursor: pointer;
}

.submit-btn {
  background: var(--primary-500);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.submit-btn:hover {
  background: var(--primary-600);
}

.submit-btn:active {
  transform: translateY(1px);
}
</style>