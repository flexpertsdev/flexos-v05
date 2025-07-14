<template>
  <div class="vision-panel">
    <div class="panel-header">
      <h2 class="panel-heading">Project Vision</h2>
      <button @click="editVision" class="edit-btn" title="Edit Vision">
        <svg viewBox="0 0 24 24" class="icon">
          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
        </svg>
      </button>
    </div>
    
    <div class="vision-card">
      <h3 class="project-name">{{ project?.name || 'My Project' }}</h3>
      <p class="project-description">
        {{ project?.description || 'No description provided. Add a compelling project description to communicate your vision.' }}
      </p>
      
      <div class="divider"></div>
      
      <div class="objectives-section">
        <h4 class="section-title">Key Objectives</h4>
        <ul v-if="objectives.length > 0" class="objectives-list">
          <li v-for="(objective, index) in objectives" :key="index">
            <span class="bullet">•</span>
            <span>{{ objective }}</span>
          </li>
        </ul>
        <div v-else class="empty-state">
          <p>No objectives defined yet.</p>
          <button @click="addObjective" class="add-btn">Add Objective</button>
        </div>
      </div>
      
      <div v-if="targetAudience || techStack" class="additional-info">
        <div v-if="targetAudience" class="info-section">
          <h4 class="section-title">Target Audience</h4>
          <p class="info-text">{{ targetAudience }}</p>
        </div>
        
        <div v-if="techStack" class="info-section">
          <h4 class="section-title">Tech Stack</h4>
          <div class="tech-tags">
            <span v-for="tech in techStackArray" :key="tech" class="tech-tag">{{ tech }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Database } from '~/types/database'

type Project = Database['public']['Tables']['projects']['Row']

interface Props {
  project?: Project | null
}

const props = defineProps<Props>()
const emit = defineEmits(['update:project'])

// Extract vision data from project metadata
const visionData = computed(() => {
  const metadata = props.project?.metadata as any
  return metadata?.vision || {}
})

// Computed properties for vision components
const objectives = computed(() => {
  return visionData.value.objectives || []
})

const targetAudience = computed(() => {
  return visionData.value.targetAudience || ''
})

const techStack = computed(() => {
  return visionData.value.techStack || ''
})

const techStackArray = computed(() => {
  if (!techStack.value) return []
  return techStack.value.split(',').map((tech: string) => tech.trim())
})

// Methods
const editVision = () => {
  // TODO: Open vision editor modal
  console.log('Edit vision')
}

const addObjective = () => {
  // TODO: Add objective through chat or modal
  console.log('Add objective')
}
</script>

<style scoped>
.vision-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.panel-heading {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.edit-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s;
}

.edit-btn:hover {
  background: var(--bg-secondary);
  color: var(--primary-500);
}

.icon {
  width: 20px;
  height: 20px;
  fill: currentColor;
}

.vision-card {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid var(--border-primary);
  flex: 1;
  overflow-y: auto;
}

.project-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--primary-500);
  margin-bottom: 1rem;
}

.project-description {
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: 1.5rem;
}

.divider {
  height: 1px;
  background: var(--border-primary);
  margin: 1.5rem 0;
}

.objectives-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.objectives-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.objectives-list li {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.5rem 0;
  color: var(--text-secondary);
  line-height: 1.6;
}

.bullet {
  color: var(--primary-500);
  font-weight: 600;
  flex-shrink: 0;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--text-tertiary);
}

.empty-state p {
  margin-bottom: 1rem;
}

.add-btn {
  background: var(--primary-500);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.add-btn:hover {
  background: var(--primary-600);
}

.additional-info {
  margin-top: 2rem;
}

.info-section {
  margin-bottom: 1.5rem;
}

.info-section:last-child {
  margin-bottom: 0;
}

.info-text {
  color: var(--text-secondary);
  line-height: 1.6;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tech-tag {
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.875rem;
  border: 1px solid var(--border-primary);
}
</style>