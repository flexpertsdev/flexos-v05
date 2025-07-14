<template>
  <div class="selection-message">
    <p class="prompt">{{ data.prompt || 'Please select an option:' }}</p>
    <div :class="['options', data.layout || 'list']">
      <button
        v-for="option in data.options"
        :key="option.id"
        @click="selectOption(option)"
        class="option-card"
      >
        <h4 class="option-label">{{ option.label }}</h4>
        <p v-if="option.description" class="option-description">{{ option.description }}</p>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  data: {
    prompt?: string
    options: Array<{
      id: string
      label: string
      description?: string
    }>
    layout?: 'list' | 'grid' | 'carousel'
  }
}

const props = defineProps<Props>()
const emit = defineEmits(['select'])

const selectOption = (option: any) => {
  emit('select', option)
}
</script>

<style scoped>
.selection-message {
  padding: 1rem;
}

.prompt {
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.options {
  display: flex;
  gap: 0.75rem;
}

.options.list {
  flex-direction: column;
}

.options.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}

.option-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.option-card:hover {
  border-color: var(--primary-500);
  background: var(--bg-hover);
}

.option-label {
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.option-description {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
}
</style>