<template>
  <div class="thinking-display">
    <div class="thinking-header" @click="toggle">
      <svg viewBox="0 0 24 24" class="thinking-icon">
        <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
      </svg>
      <span>AI Thinking Process</span>
      <svg viewBox="0 0 24 24" class="chevron" :class="{ collapsed: collapsed }">
        <path d="M7 10l5 5 5-5z"/>
      </svg>
    </div>
    
    <Transition name="slide">
      <div v-show="!collapsed" class="thinking-steps">
        <div 
          v-for="(step, index) in steps" 
          :key="index"
          class="thinking-step"
          :class="[`type-${step.type}`, { revision: step.isRevision }]"
        >
          <div class="step-header">
            <span class="step-number">Step {{ step.number || index + 1 }}</span>
            <span class="step-type">{{ formatType(step.type) }}</span>
            <span 
              v-if="step.confidence !== undefined" 
              class="step-confidence"
              :class="getConfidenceClass(step.confidence)"
            >
              {{ Math.round((step.confidence || 0) * 100) }}% confident
            </span>
          </div>
          <div class="step-content">
            {{ step.content }}
          </div>
          <div v-if="step.isRevision" class="revision-indicator">
            <svg viewBox="0 0 24 24" class="revision-icon">
              <path d="M12.5,8C9.85,8 7.45,9 5.6,10.6L2,7V16H11L7.38,12.38C8.77,11.22 10.54,10.5 12.5,10.5C16.04,10.5 19.05,12.81 20.1,16L22.47,15.22C21.08,11.03 17.15,8 12.5,8Z" />
            </svg>
            Revising previous thinking
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

interface ThinkingStep {
  number?: number
  type: 'analysis' | 'planning' | 'decision' | 'revision'
  content: string
  confidence?: number
  isRevision?: boolean
}

interface Props {
  steps: ThinkingStep[]
  collapsed?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  collapsed: false
})

const emit = defineEmits<{
  toggle: []
}>()

const toggle = () => {
  emit('toggle')
}

const formatType = (type: string) => {
  const typeMap: Record<string, string> = {
    analysis: 'Analyzing',
    planning: 'Planning',
    decision: 'Deciding',
    revision: 'Revising'
  }
  return typeMap[type] || type
}

const getConfidenceClass = (confidence: number) => {
  if (confidence >= 0.8) return 'high'
  if (confidence >= 0.5) return 'medium'
  return 'low'
}
</script>

<style scoped>
.thinking-display {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  overflow: hidden;
}

.thinking-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  user-select: none;
  transition: background 0.2s;
}

.thinking-header:hover {
  background: var(--bg-quaternary);
}

.thinking-icon {
  width: 18px;
  height: 18px;
  fill: var(--primary-500);
}

.thinking-header span {
  flex: 1;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.chevron {
  width: 18px;
  height: 18px;
  fill: var(--text-tertiary);
  transition: transform 0.2s;
}

.chevron.collapsed {
  transform: rotate(-90deg);
}

.thinking-steps {
  padding: 0.75rem 1rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.thinking-step {
  padding: 0.75rem;
  background: var(--bg-secondary);
  border-radius: 8px;
  border-left: 3px solid var(--border-primary);
}

.thinking-step.type-analysis {
  border-left-color: var(--info-500);
}

.thinking-step.type-planning {
  border-left-color: var(--warning-500);
}

.thinking-step.type-decision {
  border-left-color: var(--success-500);
}

.thinking-step.type-revision,
.thinking-step.revision {
  border-left-color: var(--error-500);
}

.step-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
  font-size: 0.75rem;
}

.step-number {
  font-weight: 600;
  color: var(--text-primary);
}

.step-type {
  color: var(--text-secondary);
}

.step-confidence {
  margin-left: auto;
  padding: 0.125rem 0.5rem;
  border-radius: 12px;
  font-size: 0.6875rem;
  font-weight: 500;
}

.step-confidence.high {
  background: rgba(34, 197, 94, 0.1);
  color: var(--success-500);
}

.step-confidence.medium {
  background: rgba(251, 191, 36, 0.1);
  color: var(--warning-500);
}

.step-confidence.low {
  background: rgba(239, 68, 68, 0.1);
  color: var(--error-500);
}

.step-content {
  color: var(--text-primary);
  font-size: 0.875rem;
  line-height: 1.6;
}

.revision-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid var(--border-primary);
  color: var(--text-tertiary);
  font-size: 0.75rem;
}

.revision-icon {
  width: 16px;
  height: 16px;
  fill: currentColor;
}

/* Transition */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease;
}

.slide-enter-from {
  max-height: 0;
  opacity: 0;
}

.slide-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
