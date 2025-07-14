<template>
  <div class="journey-detail-view">
    <div class="detail-header">
      <button @click="goBack" class="back-btn">
        <svg viewBox="0 0 24 24" class="icon">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
        Back
      </button>
      
      <div class="header-content">
        <h1 class="journey-title">{{ journey?.name || 'Journey Details' }}</h1>
        <div class="header-actions">
          <button @click="editJourney" class="action-btn">
            <svg viewBox="0 0 24 24" class="icon">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
            </svg>
            Edit
          </button>
        </div>
      </div>
    </div>
    
    <div class="detail-content">
      <p>Journey detail view coming soon...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Database } from '~/types/database'

type Journey = Database['public']['Tables']['journeys']['Row']

interface Props {
  journey?: Journey | null
}

const props = defineProps<Props>()
const emit = defineEmits(['back'])

const goBack = () => {
  emit('back')
}

const editJourney = () => {
  console.log('Edit journey')
}
</script>

<style scoped>
.journey-detail-view {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
}

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

.journey-title {
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

.detail-content {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
}

.icon {
  width: 20px;
  height: 20px;
  fill: currentColor;
}
</style>