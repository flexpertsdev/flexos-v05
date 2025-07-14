<template>
  <div class="comparison-message">
    <p class="prompt">{{ data.prompt || 'Compare options:' }}</p>
    <div :class="['comparison-layout', data.layout || 'side-by-side']">
      <div v-for="item in data.items" :key="item.id" class="comparison-item">
        <h4 class="item-title">{{ item.title }}</h4>
        <div class="attributes">
          <div v-for="key in compareKeys" :key="key" class="attribute">
            <span class="attribute-label">{{ key }}:</span>
            <span class="attribute-value">{{ item.attributes[key] || '-' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  data: {
    prompt?: string
    items: Array<{
      id: string
      title: string
      attributes: Record<string, any>
    }>
    compareKeys: string[]
    layout?: 'side-by-side' | 'table'
  }
}

const props = defineProps<Props>()

const compareKeys = computed(() => {
  return props.data.compareKeys || Object.keys(props.data.items[0]?.attributes || {})
})
</script>

<style scoped>
.comparison-message {
  padding: 1rem;
}

.prompt {
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.comparison-layout {
  display: grid;
  gap: 1rem;
}

.comparison-layout.side-by-side {
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

.comparison-item {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  padding: 1rem;
}

.item-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--primary-500);
  margin-bottom: 1rem;
}

.attributes {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.attribute {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.25rem 0;
}

.attribute-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.attribute-value {
  font-size: 0.875rem;
  color: var(--text-primary);
}
</style>