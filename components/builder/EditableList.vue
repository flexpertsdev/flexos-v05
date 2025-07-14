<template>
  <div class="editable-list">
    <!-- Display Mode -->
    <ul v-if="!editable && modelValue?.length" class="list-display">
      <li v-for="(item, index) in modelValue" :key="index" class="list-item">
        <span class="item-icon">{{ icon }}</span>
        <span class="item-text">{{ item }}</span>
      </li>
    </ul>
    <p v-else-if="!editable && !modelValue?.length" class="empty-text">
      No items yet...
    </p>
    
    <!-- Edit Mode -->
    <div v-else class="list-edit">
      <div
        v-for="(item, index) in localItems"
        :key="index"
        class="edit-item"
      >
        <span class="item-icon">{{ icon }}</span>
        <input
          v-model="localItems[index]"
          @input="updateValue"
          class="item-input"
          :placeholder="placeholder"
        />
        <button
          @click="removeItem(index)"
          class="remove-button"
          title="Remove"
        >
          ×
        </button>
      </div>
      <button
        @click="addItem"
        class="add-button"
      >
        + {{ placeholder }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue: string[]
  editable: boolean
  placeholder: string
  icon: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

const localItems = ref<string[]>([...(props.modelValue || [])])

// Watch for external changes
watch(() => props.modelValue, (newVal) => {
  localItems.value = [...(newVal || [])]
})

// Add new item
const addItem = () => {
  localItems.value.push('')
  updateValue()
}

// Remove item
const removeItem = (index: number) => {
  localItems.value.splice(index, 1)
  updateValue()
}

// Update parent
const updateValue = () => {
  emit('update:modelValue', localItems.value.filter(item => item.trim()))
}
</script>

<style scoped>
.editable-list {
  width: 100%;
}

/* Display Mode */
.list-display {
  list-style: none;
  padding: 0;
  margin: 0;
}

.list-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.5rem 0;
  color: var(--text-primary);
  line-height: 1.5;
}

.item-icon {
  flex-shrink: 0;
  font-size: 1.125rem;
  margin-top: 0.125rem;
}

.item-text {
  flex: 1;
}

.empty-text {
  color: var(--text-tertiary);
  font-style: italic;
  font-size: 0.875rem;
}

/* Edit Mode */
.list-edit {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.edit-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.item-input {
  flex: 1;
  padding: 0.5rem 0.75rem;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 6px;
  color: var(--text-primary);
  font-size: 0.875rem;
  transition: all 0.2s;
}

.item-input:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
}

.remove-button {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--red-500);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1.25rem;
  cursor: pointer;
  transition: all 0.2s;
}

.remove-button:hover {
  background: var(--red-600);
  transform: scale(1.05);
}

.add-button {
  align-self: flex-start;
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px dashed var(--border-secondary);
  border-radius: 6px;
  color: var(--text-secondary);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.add-button:hover {
  border-color: var(--primary-500);
  color: var(--primary-500);
  background: var(--bg-tertiary);
}
</style>
