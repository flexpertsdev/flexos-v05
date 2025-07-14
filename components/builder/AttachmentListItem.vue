<template>
  <div @click="handleSelect" class="attachment-list-item">
    <span class="item-icon">{{ item.icon }}</span>
    <div class="item-content">
      <span class="item-name">{{ item.name }}</span>
      <span class="item-description">{{ item.description }}</span>
    </div>
    <svg v-if="selected" viewBox="0 0 24 24" class="check-icon">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface AttachmentItem {
  id: string
  type: string
  name: string
  description: string
  icon: string
  data: any
}

const props = defineProps<{
  item: AttachmentItem
  selected?: boolean
}>()

const emit = defineEmits<{
  select: [item: AttachmentItem]
}>()

const handleSelect = () => {
  emit('select', props.item)
}
</script>

<style scoped>
.attachment-list-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
}

.attachment-list-item:hover {
  background: var(--bg-tertiary);
}

.item-icon {
  font-size: 1.125rem;
  flex-shrink: 0;
}

.item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0;
}

.item-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-description {
  font-size: 0.75rem;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.check-icon {
  width: 16px;
  height: 16px;
  fill: var(--primary-500);
  flex-shrink: 0;
}
</style>