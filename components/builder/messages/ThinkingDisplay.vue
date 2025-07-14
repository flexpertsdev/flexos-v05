<template>
  <div class="thinking-display" :class="{ collapsed: !expanded }">
    <div class="thinking-header" @click="toggleExpanded">
      <div class="header-left">
        <svg class="icon brain-icon" viewBox="0 0 24 24">
          <path d="M12 2a9 9 0 0 0-9 9c0 4.97 4.03 9 9 9a9 9 0 0 0 0-18zm-5.5 9c0-1.66.67-3.16 1.76-4.24l1.42 1.42A3.5 3.5 0 0 0 8.5 11c0 .97.39 1.84 1.03 2.47l-1.42 1.42A5.5 5.5 0 0 1 6.5 11zm9.97 2.47A3.5 3.5 0 0 0 15.5 11c0-1.03-.44-1.96-1.15-2.61l1.42-1.42A5.5 5.5 0 0 1 17.5 11c0 1.66-.67 3.16-1.76 4.24l-1.27-1.27z"/>
        </svg>
        <span class="thinking-title">AI Thinking Process</span>
        <span v-if="isStreaming" class="streaming-badge">Live</span>
      </div>
      <button class="expand-btn">
        <svg class="icon chevron" viewBox="0 0 24 24">
          <path d="M7 10l5 5 5-5"/>
        </svg>
      </button>
    </div>
    
    <Transition name="slide">
      <div v-show="expanded" class="thinking-content">
        <div 
          v-for="(step, index) in steps" 
          :key="`${step.number}-${index}`"
          class="thinking-step"
          :class="[
            `type-${step.type}`,
            { 
              'is-revision': step.isRevision,
              'is-animating': isStreaming && index === steps.length - 1
            }
          ]"
        >
          <div class="step-header">
            <span class="step-number">Step {{ step.number }}</span>
            <span class="step-type">{{ formatType(step.type) }}</span>
            <span 
              v-if="step.confidence !== undefined" 
              class="step-confidence"
              :class="getConfidenceClass(step.confidence)"
            >
              {{ Math.round(step.confidence * 100) }}% confident
            </span>
          </div>
          
          <div class="step-content">
            {{ step.content }}
          </div>
          
          <div v-if="step.isRevision" class="revision-indicator">
            <svg class="icon" viewBox="0 0 24 24">
              <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46A7.93 7.93 0 0 0 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74A7.93 7.93 0 0 0 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
            </svg>
            Revising previous thinking
          </div>
        </div>
        
        <!-- Loading indicator for streaming -->
        <div v-if="isStreaming" class="thinking-loading">
          <div class="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span class="loading-text">Processing...</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ThinkingStep } from '~/types/chat'

interface Props {
  steps: ThinkingStep[]
  isStreaming?: boolean
  defaultExpanded?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isStreaming: false,
  defaultExpanded: true
})

const expanded = ref(props.defaultExpanded)

// Toggle expanded state
const toggleExpanded = () => {
  expanded.value = !expanded.value
}

// Format step type for display
const formatType = (type: string): string => {
  const typeMap: Record<string, string> = {
    analysis: 'Analyzing',
    planning: 'Planning',
    decision: 'Deciding',
    revision: 'Revising'
  }
  return typeMap[type] || type.charAt(0).toUpperCase() + type.slice(1)
}

// Get confidence class based on value
const getConfidenceClass = (confidence: number): string => {
  if (confidence >= 0.8) return 'high'
  if (confidence >= 0.5) return 'medium'
  return 'low'
}
</script>

<style scoped>
.thinking-display {
  background: var(--bg-quaternary);
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.thinking-display.collapsed {
  background: var(--bg-tertiary);
}

/* Header */
.thinking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  cursor: pointer;
  user-select: none;
  transition: background 0.2s;
}

.thinking-header:hover {
  background: rgba(255, 255, 255, 0.02);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.brain-icon {
  color: var(--primary-500);
  width: 20px;
  height: 20px;
}

.thinking-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.streaming-badge {
  padding: 0.125rem 0.5rem;
  background: rgba(22, 193, 129, 0.2);
  color: var(--primary-500);
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

.expand-btn {
  background: none;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  color: var(--text-tertiary);
  transition: all 0.2s;
}

.expand-btn:hover {
  color: var(--text-primary);
}

.chevron {
  width: 16px;
  height: 16px;
  transition: transform 0.3s ease;
}

.collapsed .chevron {
  transform: rotate(-90deg);
}

/* Content */
.thinking-content {
  padding: 0 1rem 1rem;
  max-height: 400px;
  overflow-y: auto;
}

.thinking-step {
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: var(--bg-tertiary);
  border-radius: 8px;
  border: 1px solid var(--border-primary);
  transition: all 0.2s;
}

.thinking-step.is-animating {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.thinking-step:last-child {
  margin-bottom: 0;
}

/* Step types */
.thinking-step.type-analysis {
  border-left: 3px solid #3B82F6;
}

.thinking-step.type-planning {
  border-left: 3px solid #8B5CF6;
}

.thinking-step.type-decision {
  border-left: 3px solid #F59E0B;
}

.thinking-step.type-revision {
  border-left: 3px solid #EF4444;
  background: rgba(239, 68, 68, 0.05);
}

/* Step header */
.step-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.75rem;
}

.step-number {
  color: var(--text-tertiary);
  font-weight: 600;
}

.step-type {
  padding: 0.125rem 0.375rem;
  background: var(--bg-quaternary);
  border-radius: 4px;
  color: var(--text-secondary);
  font-weight: 500;
}

.step-confidence {
  margin-left: auto;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.7rem;
}

.step-confidence.high {
  background: rgba(34, 197, 94, 0.1);
  color: #22C55E;
}

.step-confidence.medium {
  background: rgba(251, 191, 36, 0.1);
  color: #FBBF24;
}

.step-confidence.low {
  background: rgba(239, 68, 68, 0.1);
  color: #EF4444;
}

/* Step content */
.step-content {
  color: var(--text-primary);
  font-size: 0.875rem;
  line-height: 1.5;
  white-space: pre-wrap;
}

/* Revision indicator */
.revision-indicator {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid var(--border-primary);
  color: var(--text-tertiary);
  font-size: 0.75rem;
  font-style: italic;
}

.revision-indicator .icon {
  width: 14px;
  height: 14px;
  color: #EF4444;
}

/* Loading indicator */
.thinking-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  color: var(--text-tertiary);
}

.loading-dots {
  display: flex;
  gap: 4px;
}

.loading-dots span {
  width: 6px;
  height: 6px;
  background: currentColor;
  border-radius: 50%;
  animation: loadingDot 1.4s infinite;
}

.loading-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.loading-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes loadingDot {
  0%, 60%, 100% {
    transform: scale(1);
    opacity: 0.4;
  }
  30% {
    transform: scale(1.3);
    opacity: 1;
  }
}

.loading-text {
  font-size: 0.813rem;
  color: var(--text-secondary);
}

/* Slide transition */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Scrollbar */
.thinking-content::-webkit-scrollbar {
  width: 6px;
}

.thinking-content::-webkit-scrollbar-track {
  background: var(--bg-tertiary);
}

.thinking-content::-webkit-scrollbar-thumb {
  background: var(--bg-quaternary);
  border-radius: 3px;
}

.thinking-content::-webkit-scrollbar-thumb:hover {
  background: var(--border-secondary);
}

/* Icon utilities */
.icon {
  width: 18px;
  height: 18px;
  stroke: currentColor;
  stroke-width: 2;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>