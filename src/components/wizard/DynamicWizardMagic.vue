<template>
  <div class="magic-container">
    <!-- Header -->
    <div class="magic-header">
      <h2 class="magic-title">
        <span class="magic-icon">✨</span>
        Behind the Magic
      </h2>
      <p class="magic-subtitle">
        {{ currentPhase ? `Processing: ${currentPhase.name}` : 'Watch AI think and build in real-time' }}
      </p>
    </div>

    <!-- Content -->
    <div class="magic-content">
      <!-- Processing Steps -->
      <TransitionGroup name="process" tag="div">
        <div
          v-for="(step, index) in processingSteps"
          :key="step.id"
          class="process-section"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <h3 class="section-title">
            <div v-if="step.status === 'processing'" class="loader">
              <div class="loader-dot"></div>
              <div class="loader-dot"></div>
              <div class="loader-dot"></div>
            </div>
            <span v-else class="status-icon">
              {{ step.status === 'complete' ? '✓' : '○' }}
            </span>
            {{ step.title }}
          </h3>

          <div class="section-content">
            <!-- Step Items -->
            <div
              v-for="(item, itemIndex) in step.items"
              :key="item.id"
              class="process-item"
              :class="{ active: item.status === 'processing', complete: item.status === 'complete' }"
              :style="{ animationDelay: `${(index * 0.1) + (itemIndex * 0.05)}s` }"
            >
              <div class="item-icon" :style="{ background: getIconBackground(item.status) }">
                {{ item.icon }}
              </div>
              <div class="item-text">{{ item.text }}</div>
              <div class="item-status" :class="`status-${item.status}`">
                <span v-if="item.status === 'complete'">✓</span>
                <span v-else-if="item.status === 'processing'" class="processing-dot"></span>
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>

      <!-- Current Answers Summary -->
      <div v-if="Object.keys(answers).length > 0" class="answers-summary">
        <h3 class="section-title">
          <span class="status-icon">📋</span>
          Your Selections
        </h3>
        <div class="answer-list">
          <div
            v-for="(answer, phaseId) in answers"
            :key="phaseId"
            class="answer-item"
          >
            <div class="answer-label">{{ getPhaseLabel(String(phaseId)) }}</div>
            <div class="answer-value">{{ formatAnswer(answer) }}</div>
          </div>
        </div>
      </div>

      <!-- Visualization based on wizard type -->
      <div v-if="wizard?.id === 'website-refresh' && hasWebsiteUrl" class="website-preview">
        <h3 class="section-title">
          <span class="status-icon">🌐</span>
          Website Analysis
        </h3>
        <div class="preview-container">
          <div class="browser-mockup">
            <div class="browser-bar">
              <div class="browser-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div class="browser-url">{{ websiteUrl }}</div>
            </div>
            <div class="browser-content">
              <div class="analysis-overlay">
                <div class="analysis-stat">
                  <div class="stat-value">{{ analysisScore }}%</div>
                  <div class="stat-label">Compliance Score</div>
                </div>
                <div class="issue-badges">
                  <span class="issue-badge critical">{{ criticalIssues }} Critical</span>
                  <span class="issue-badge warning">{{ warningIssues }} Warnings</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Progress Visualization -->
      <div v-if="wizard" class="progress-visualization">
        <h3 class="section-title">
          <span class="status-icon">📊</span>
          Progress Overview
        </h3>
        <div class="phase-timeline">
          <div
            v-for="(phase, index) in wizard.phases"
            :key="phase.id"
            class="timeline-item"
            :class="{
              complete: isPhaseComplete(phase.id),
              current: phase.id === currentPhase?.id,
              future: isPhaseInFuture(phase.id)
            }"
          >
            <div class="timeline-dot"></div>
            <div class="timeline-label">{{ phase.name }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { WizardConfig, WizardPhase, WizardAnswers } from '~/types/wizard'

interface ProcessingStep {
  id: string
  title: string
  status: 'pending' | 'processing' | 'complete'
  items: ProcessingItem[]
}

interface ProcessingItem {
  id: string
  icon: string
  text: string
  status: 'pending' | 'processing' | 'complete'
}

interface Props {
  wizard: WizardConfig | null
  currentPhase: WizardPhase | null
  answers: WizardAnswers
  processingSteps: ProcessingStep[]
}

const props = defineProps<Props>()

// Computed
const hasWebsiteUrl = computed(() => {
  return props.wizard?.id === 'website-refresh' && props.answers['intro']
})

const websiteUrl = computed(() => {
  return props.answers['intro'] || ''
})

const analysisScore = computed(() => {
  // This would come from actual analysis
  return 78
})

const criticalIssues = computed(() => {
  // This would come from actual analysis
  return 3
})

const warningIssues = computed(() => {
  // This would come from actual analysis
  return 12
})

// Methods
function getIconBackground(status: string): string {
  switch (status) {
    case 'complete':
      return 'rgba(22, 193, 129, 0.2)'
    case 'processing':
      return 'rgba(234, 179, 8, 0.2)'
    default:
      return 'var(--bg-tertiary)'
  }
}

function getPhaseLabel(phaseId: string): string {
  const phase = props.wizard?.phases.find((p: WizardPhase) => p.id === phaseId)
  return phase?.name || phaseId
}

function formatAnswer(answer: any): string {
  if (Array.isArray(answer)) {
    return answer.join(', ')
  }
  if (typeof answer === 'boolean') {
    return answer ? 'Yes' : 'No'
  }
  if (typeof answer === 'object') {
    return JSON.stringify(answer)
  }
  return String(answer)
}

function isPhaseComplete(phaseId: string): boolean {
  return phaseId in props.answers
}

function isPhaseInFuture(phaseId: string): boolean {
  if (!props.wizard || !props.currentPhase) return false
  
  const phases = props.wizard.phases
  const currentIndex = phases.findIndex((p: WizardPhase) => p.id === props.currentPhase?.id)
  const phaseIndex = phases.findIndex((p: WizardPhase) => p.id === phaseId)
  
  return phaseIndex > currentIndex
}
</script>

<style scoped>
.magic-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.magic-header {
  padding: 2rem;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-primary);
}

.magic-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.magic-icon {
  font-size: 1.25rem;
}

.magic-subtitle {
  color: var(--text-tertiary);
  font-size: 0.875rem;
}

.magic-content {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  -webkit-overflow-scrolling: touch;
}

/* Process Sections */
.process-section {
  margin-bottom: 2rem;
  animation: fadeIn 0.6s ease-out forwards;
  opacity: 0;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

.section-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-icon {
  font-size: 1rem;
}

.loader {
  display: inline-flex;
  gap: 0.25rem;
}

.loader-dot {
  width: 4px;
  height: 4px;
  background: var(--primary-500);
  border-radius: 50%;
  animation: loaderBounce 1.4s ease-in-out infinite;
}

.loader-dot:nth-child(2) { animation-delay: 0.2s; }
.loader-dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes loaderBounce {
  0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
  40% { transform: scale(1.2); opacity: 1; }
}

/* Process Items */
.process-item {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s;
  opacity: 0;
  animation: processItemSlide 0.4s ease-out forwards;
}

@keyframes processItemSlide {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.process-item.active {
  border-color: var(--yellow-500);
  background: rgba(234, 179, 8, 0.05);
}

.process-item.complete {
  border-color: var(--primary-500);
  background: rgba(22, 193, 129, 0.05);
}

.item-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.item-text {
  flex: 1;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.item-status {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
}

.status-complete {
  background: var(--primary-500);
  color: white;
}

.status-processing {
  background: var(--yellow-500);
}

.processing-dot {
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(0.8); }
}

/* Answers Summary */
.answers-summary {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.answer-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.answer-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border-primary);
}

.answer-item:last-child {
  border-bottom: none;
}

.answer-label {
  font-size: 0.875rem;
  color: var(--text-tertiary);
}

.answer-value {
  font-size: 0.875rem;
  color: var(--text-primary);
  font-weight: 500;
}

/* Website Preview */
.website-preview {
  margin-bottom: 2rem;
}

.preview-container {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 1rem;
}

.browser-mockup {
  background: var(--bg-tertiary);
  border-radius: 8px;
  overflow: hidden;
}

.browser-bar {
  background: var(--bg-quaternary);
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.browser-dots {
  display: flex;
  gap: 0.5rem;
}

.browser-dots span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--border-primary);
}

.browser-url {
  flex: 1;
  font-size: 0.75rem;
  color: var(--text-tertiary);
  text-align: center;
}

.browser-content {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.analysis-overlay {
  text-align: center;
}

.analysis-stat {
  margin-bottom: 1rem;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary-500);
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-tertiary);
}

.issue-badges {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.issue-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.issue-badge.critical {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.issue-badge.warning {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
}

/* Progress Timeline */
.progress-visualization {
  margin-top: 2rem;
}

.phase-timeline {
  display: flex;
  flex-direction: column;
  gap: 0;
  position: relative;
  padding-left: 2rem;
}

.phase-timeline::before {
  content: '';
  position: absolute;
  left: 0.75rem;
  top: 0.75rem;
  bottom: 0.75rem;
  width: 2px;
  background: var(--border-primary);
}

.timeline-item {
  position: relative;
  padding: 0.75rem 0;
}

.timeline-dot {
  position: absolute;
  left: -1.375rem;
  top: 50%;
  transform: translateY(-50%);
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--bg-secondary);
  border: 2px solid var(--border-primary);
  transition: all 0.3s;
}

.timeline-item.complete .timeline-dot {
  background: var(--primary-500);
  border-color: var(--primary-500);
}

.timeline-item.current .timeline-dot {
  background: var(--yellow-500);
  border-color: var(--yellow-500);
  box-shadow: 0 0 0 4px rgba(234, 179, 8, 0.2);
}

.timeline-label {
  font-size: 0.875rem;
  color: var(--text-tertiary);
  transition: color 0.3s;
}

.timeline-item.complete .timeline-label {
  color: var(--text-primary);
}

.timeline-item.current .timeline-label {
  color: var(--text-primary);
  font-weight: 600;
}

/* Transitions */
.process-enter-active,
.process-leave-active {
  transition: all 0.3s ease;
}

.process-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.process-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .magic-header {
    padding: 1rem;
  }

  .magic-content {
    padding: 1rem;
  }

  .process-item {
    padding: 0.875rem;
  }

  .item-icon {
    width: 28px;
    height: 28px;
    font-size: 1rem;
  }

  .browser-content {
    height: 150px;
  }

  .stat-value {
    font-size: 2rem;
  }
}
</style>