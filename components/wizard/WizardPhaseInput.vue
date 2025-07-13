<template>
  <div class="phase-input-container">
    <!-- Text Input -->
    <div v-if="phase.inputType === 'text'" class="input-wrapper">
      <input
        type="text"
        v-model="localValue"
        :placeholder="phase.helpText"
        @keypress.enter="submit"
        class="text-input"
        ref="inputRef"
      />
      <button @click="submit" class="submit-button">
        Continue →
      </button>
    </div>

    <!-- Textarea -->
    <div v-else-if="phase.inputType === 'textarea'" class="input-wrapper">
      <textarea
        v-model="localValue"
        :placeholder="phase.helpText"
        :rows="4"
        class="textarea-input"
        ref="inputRef"
      ></textarea>
      <button @click="submit" class="submit-button">
        Continue →
      </button>
    </div>

    <!-- URL Input -->
    <div v-else-if="phase.inputType === 'url'" class="input-wrapper">
      <div class="url-input-container">
        <span class="url-prefix">🌐</span>
        <input
          type="url"
          v-model="localValue"
          placeholder="https://example.com"
          @keypress.enter="submit"
          class="url-input"
          ref="inputRef"
        />
      </div>
      <button @click="submit" :disabled="!isValid" class="submit-button">
        Analyze Website →
      </button>
    </div>

    <!-- Email Input -->
    <div v-else-if="phase.inputType === 'email'" class="input-wrapper">
      <input
        type="email"
        v-model="localValue"
        placeholder="email@example.com"
        @keypress.enter="submit"
        class="email-input"
        ref="inputRef"
      />
      <button @click="submit" class="submit-button">
        Continue →
      </button>
    </div>

    <!-- Number Input -->
    <div v-else-if="phase.inputType === 'number'" class="input-wrapper">
      <input
        type="number"
        v-model.number="localValue"
        :min="phase.validation?.min"
        :max="phase.validation?.max"
        @keypress.enter="submit"
        class="number-input"
        ref="inputRef"
      />
      <button @click="submit" class="submit-button">
        Continue →
      </button>
    </div>

    <!-- Checkbox (single) -->
    <div v-else-if="phase.inputType === 'checkbox'" class="checkbox-wrapper">
      <label class="checkbox-label single">
        <input
          type="checkbox"
          v-model="localValue"
          @change="submit"
        />
        <span class="checkbox-custom"></span>
        <span>{{ phase.options?.[0]?.label || 'I agree' }}</span>
      </label>
    </div>

    <!-- Checkboxes (multiple) -->
    <div v-else-if="phase.inputType === 'checkboxes'" class="checkboxes-wrapper">
      <label
        v-for="option in phase.options"
        :key="option.id"
        class="checkbox-label"
      >
        <input
          type="checkbox"
          :value="option.value"
          v-model="localValue"
        />
        <span class="checkbox-custom"></span>
        <div class="checkbox-content">
          <span class="checkbox-text">{{ option.label }}</span>
          <span v-if="option.description" class="checkbox-description">
            {{ option.description }}
          </span>
        </div>
      </label>
      <button @click="submit" class="submit-button">
        Continue →
      </button>
    </div>

    <!-- Radio -->
    <div v-else-if="phase.inputType === 'radio'" class="radio-wrapper">
      <label
        v-for="option in phase.options"
        :key="option.id"
        class="radio-label"
      >
        <input
          type="radio"
          :value="option.value"
          v-model="localValue"
          @change="autoSubmit && submit()"
        />
        <span class="radio-custom"></span>
        <div class="radio-content">
          <span class="radio-text">{{ option.label }}</span>
          <span v-if="option.description" class="radio-description">
            {{ option.description }}
          </span>
        </div>
      </label>
      <button v-if="!autoSubmit" @click="submit" class="submit-button">
        Continue →
      </button>
    </div>

    <!-- Select -->
    <div v-else-if="phase.inputType === 'select'" class="select-wrapper">
      <select v-model="localValue" class="select-input">
        <option value="">Choose an option...</option>
        <option
          v-for="option in phase.options"
          :key="option.id"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
      <button @click="submit" class="submit-button">
        Continue →
      </button>
    </div>

    <!-- Grid Selection -->
    <div v-else-if="phase.inputType === 'grid'" class="grid-wrapper">
      <div class="selection-grid">
        <div
          v-for="option in phase.options"
          :key="option.id"
          class="grid-item"
          :class="{ selected: localValue === option.value }"
          @click="selectGridItem(option.value)"
        >
          <div class="grid-icon">{{ option.icon }}</div>
          <div class="grid-label">{{ option.label }}</div>
          <div v-if="option.description" class="grid-description">
            {{ option.description }}
          </div>
        </div>
      </div>
      <button @click="submit" class="submit-button">
        Continue →
      </button>
    </div>

    <!-- Style Grid (for design selection) -->
    <div v-else-if="phase.inputType === 'style-grid'" class="style-grid-wrapper">
      <div class="style-grid">
        <div
          v-for="option in phase.options"
          :key="option.id"
          class="style-item"
          :class="{ selected: localValue === option.value }"
          @click="selectGridItem(option.value)"
        >
          <div 
            class="style-preview"
            :style="getStylePreview(option.metadata)"
          >
            <div class="style-icon">{{ option.icon }}</div>
          </div>
          <div class="style-label">{{ option.label }}</div>
        </div>
      </div>
      <button @click="submit" class="submit-button">
        Continue →
      </button>
    </div>

    <!-- Validation Error -->
    <div v-if="validationError" class="validation-error">
      {{ validationError }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import type { WizardPhase } from '~/types/wizard'

interface Props {
  phase: WizardPhase
  value: any
  autoSubmit?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  autoSubmit: false
})

const emit = defineEmits<{
  update: [value: any]
  submit: [value: any]
}>()

// Local state
const localValue = ref<any>(
  props.phase.inputType === 'checkboxes' 
    ? (Array.isArray(props.value) ? props.value : [])
    : props.value
)
const validationError = ref('')
const inputRef = ref<HTMLElement>()
const hasAttemptedSubmit = ref(false)

// Computed
const isValid = computed(() => {
  if (!props.phase.validation) return true
  
  const validation = validateInput(localValue.value)
  return validation.valid
})

// Watch for external value changes
watch(() => props.value, (newValue) => {
  if (props.phase.inputType === 'checkboxes') {
    localValue.value = Array.isArray(newValue) ? newValue : []
  } else {
    localValue.value = newValue
  }
})

// Watch for local value changes
watch(localValue, (newValue) => {
  emit('update', newValue)
  // Only validate if user has attempted to submit
  if (hasAttemptedSubmit.value) {
    validateInput(newValue)
  }
})

// Focus input on mount
onMounted(async () => {
  await nextTick()
  if (inputRef.value && 'focus' in inputRef.value) {
    inputRef.value.focus()
  }
})

// Methods
function submit() {
  hasAttemptedSubmit.value = true
  
  // Validate before submitting
  const validation = validateInput(localValue.value)
  if (!validation.valid) {
    return
  }
  
  // Clear validation state for next phase
  hasAttemptedSubmit.value = false
  validationError.value = ''
  
  emit('submit', localValue.value)
}

function selectGridItem(value: any) {
  localValue.value = value
  if (props.autoSubmit) {
    submit()
  }
}

function validateInput(value: any): { valid: boolean; message?: string } {
  const rules = props.phase.validation
  if (!rules) return { valid: true }
  
  // Reset error
  validationError.value = ''
  
  // Required
  if (rules.required && !value) {
    validationError.value = rules.message || 'This field is required'
    return { valid: false, message: validationError.value }
  }
  
  // String validations
  if (typeof value === 'string') {
    if (rules.minLength && value.length < rules.minLength) {
      validationError.value = rules.message || `Minimum length is ${rules.minLength}`
      return { valid: false, message: validationError.value }
    }
    
    if (rules.maxLength && value.length > rules.maxLength) {
      validationError.value = rules.message || `Maximum length is ${rules.maxLength}`
      return { valid: false, message: validationError.value }
    }
    
    if (rules.pattern && !new RegExp(rules.pattern).test(value)) {
      validationError.value = rules.message || 'Invalid format'
      return { valid: false, message: validationError.value }
    }
    
    if (rules.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      validationError.value = rules.message || 'Invalid email address'
      return { valid: false, message: validationError.value }
    }
    
    if (rules.url && !/^https?:\/\/[^\s]+$/.test(value)) {
      validationError.value = rules.message || 'Invalid URL'
      return { valid: false, message: validationError.value }
    }
  }
  
  // Number validations
  if (typeof value === 'number') {
    if (rules.min !== undefined && value < rules.min) {
      validationError.value = rules.message || `Minimum value is ${rules.min}`
      return { valid: false, message: validationError.value }
    }
    
    if (rules.max !== undefined && value > rules.max) {
      validationError.value = rules.message || `Maximum value is ${rules.max}`
      return { valid: false, message: validationError.value }
    }
  }
  
  // Array validations (for checkboxes)
  if (Array.isArray(value)) {
    if (rules.required && value.length === 0) {
      validationError.value = rules.message || 'Please select at least one option'
      return { valid: false, message: validationError.value }
    }
  }
  
  return { valid: true }
}

function getStylePreview(metadata: any) {
  if (!metadata) return {}
  
  return {
    background: `linear-gradient(135deg, ${metadata.primary}, ${metadata.secondary})`,
    color: metadata.accent
  }
}
</script>

<style scoped>
.phase-input-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Text Inputs */
.text-input,
.textarea-input,
.email-input,
.number-input,
.url-input,
.select-input {
  width: 100%;
  padding: 1rem;
  background: var(--bg-quaternary);
  border: 2px solid var(--border-primary);
  border-radius: 12px;
  color: var(--text-primary);
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.2s;
  outline: none;
}

.text-input:focus,
.textarea-input:focus,
.email-input:focus,
.number-input:focus,
.url-input:focus,
.select-input:focus {
  border-color: var(--primary-500);
  background: var(--bg-tertiary);
}

.textarea-input {
  resize: vertical;
  min-height: 100px;
}

/* URL Input */
.url-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.url-prefix {
  position: absolute;
  left: 1rem;
  font-size: 1.25rem;
}

.url-input {
  padding-left: 3rem;
}

/* Checkboxes */
.checkbox-label,
.radio-label {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--bg-quaternary);
  border: 2px solid var(--border-primary);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 0.75rem;
}

.checkbox-label:hover,
.radio-label:hover {
  border-color: var(--primary-500);
  background: var(--bg-tertiary);
}

.checkbox-label.single {
  margin-bottom: 0;
}

input[type="checkbox"],
input[type="radio"] {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.checkbox-custom,
.radio-custom {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-secondary);
  border-radius: 4px;
  transition: all 0.2s;
  flex-shrink: 0;
  position: relative;
}

.radio-custom {
  border-radius: 50%;
}

input[type="checkbox"]:checked + .checkbox-custom,
input[type="radio"]:checked + .radio-custom {
  background: var(--primary-500);
  border-color: var(--primary-500);
}

input[type="checkbox"]:checked + .checkbox-custom::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 0.875rem;
  font-weight: bold;
}

input[type="radio"]:checked + .radio-custom::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
}

.checkbox-content,
.radio-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.checkbox-text,
.radio-text {
  color: var(--text-primary);
  font-weight: 500;
}

.checkbox-description,
.radio-description {
  color: var(--text-tertiary);
  font-size: 0.875rem;
}

/* Grid Selection */
.selection-grid,
.style-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.grid-item,
.style-item {
  padding: 1.5rem;
  background: var(--bg-quaternary);
  border: 2px solid var(--border-primary);
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.grid-item:hover,
.style-item:hover {
  border-color: var(--primary-500);
  transform: translateY(-2px);
}

.grid-item.selected,
.style-item.selected {
  border-color: var(--primary-500);
  background: rgba(22, 193, 129, 0.1);
}

.grid-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.grid-label,
.style-label {
  font-weight: 600;
  color: var(--text-primary);
}

.grid-description {
  font-size: 0.875rem;
  color: var(--text-tertiary);
  margin-top: 0.5rem;
}

/* Style Grid */
.style-preview {
  width: 100%;
  height: 80px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.75rem;
}

.style-icon {
  font-size: 2rem;
}

/* Submit Button */
.submit-button {
  padding: 1rem 2rem;
  background: var(--primary-500);
  color: white;
  border: none;
  border-radius: 24px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  align-self: center;
}

.submit-button:hover:not(:disabled) {
  background: var(--primary-600);
  transform: translateY(-1px);
}

.submit-button:disabled {
  background: var(--bg-quaternary);
  color: var(--text-muted);
  cursor: not-allowed;
}

/* Validation Error */
.validation-error {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  text-align: center;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .selection-grid,
  .style-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }

  .grid-item,
  .style-item {
    padding: 1rem;
  }

  .grid-icon {
    font-size: 1.5rem;
  }

  .style-preview {
    height: 60px;
  }

  .submit-button {
    width: 100%;
  }
}
</style>