<template>
  <div class="refresh-magic">
    <div class="magic-content">
      <!-- Analyzing Phase -->
      <transition name="fade">
        <div v-if="currentPhase === 'analyzing'" class="phase-content analyzing">
          <div class="scanner">
            <div class="scan-line"></div>
            <div class="website-preview">
              <div class="browser-bar">
                <div class="browser-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div class="browser-url">{{ websiteUrl }}</div>
              </div>
              <div class="website-content">
                <div class="content-skeleton">
                  <div class="skeleton-header"></div>
                  <div class="skeleton-nav"></div>
                  <div class="skeleton-hero"></div>
                  <div class="skeleton-content">
                    <div class="skeleton-box"></div>
                    <div class="skeleton-box"></div>
                    <div class="skeleton-box"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="analysis-stats">
            <h3>Analyzing Your Website</h3>
            <div class="stat-grid">
              <div class="stat-item">
                <div class="stat-icon">📄</div>
                <div class="stat-info">
                  <span class="stat-number">{{ stats.pages }}</span>
                  <span class="stat-label">Pages Found</span>
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-icon">🖼️</div>
                <div class="stat-info">
                  <span class="stat-number">{{ stats.images }}</span>
                  <span class="stat-label">Images</span>
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-icon">⚡</div>
                <div class="stat-info">
                  <span class="stat-number">{{ stats.performance }}%</span>
                  <span class="stat-label">Performance</span>
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-icon">♿</div>
                <div class="stat-info">
                  <span class="stat-number">{{ stats.accessibility }}%</span>
                  <span class="stat-label">Accessibility</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
      
      <!-- Planning Phase -->
      <transition name="fade">
        <div v-if="currentPhase === 'planning'" class="phase-content planning">
          <h3>Planning Your Refresh</h3>
          
          <div class="plan-items">
            <div 
              v-for="(item, index) in planItems" 
              :key="index"
              class="plan-item"
              :class="{ completed: item.completed }"
            >
              <div class="plan-icon">{{ item.icon }}</div>
              <div class="plan-details">
                <h4>{{ item.title }}</h4>
                <p>{{ item.description }}</p>
              </div>
              <div class="plan-status">
                <transition name="check">
                  <svg v-if="item.completed" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="var(--green-500)"/>
                    <path d="M8 12l2 2 6-6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </transition>
              </div>
            </div>
          </div>
          
          <div class="compliance-preview">
            <h4>EAA Compliance Requirements</h4>
            <div class="requirement-list">
              <div v-for="req in complianceRequirements" :key="req" class="requirement">
                <span class="req-icon">✓</span>
                {{ req }}
              </div>
            </div>
          </div>
        </div>
      </transition>
      
      <!-- Design Phase -->
      <transition name="fade">
        <div v-if="currentPhase === 'design'" class="phase-content design">
          <h3>Applying Design Style</h3>
          
          <div class="design-preview">
            <div class="color-palette">
              <h4>Color Palette</h4>
              <div class="colors">
                <div 
                  v-for="color in designColors" 
                  :key="color.name"
                  class="color-swatch"
                  :style="{ background: color.value }"
                >
                  <span class="color-name">{{ color.name }}</span>
                </div>
              </div>
            </div>
            
            <div class="typography-preview">
              <h4>Typography</h4>
              <div class="type-samples">
                <h1 class="sample-h1">Heading 1</h1>
                <h2 class="sample-h2">Heading 2</h2>
                <p class="sample-p">Body text sample with your new modern typography</p>
              </div>
            </div>
            
            <div class="component-preview">
              <h4>Components</h4>
              <div class="component-grid">
                <div class="component-card">Button</div>
                <div class="component-card">Card</div>
                <div class="component-card">Form</div>
                <div class="component-card">Nav</div>
              </div>
            </div>
          </div>
        </div>
      </transition>
      
      <!-- Generating Phase -->
      <transition name="fade">
        <div v-if="currentPhase === 'generating'" class="phase-content generating">
          <div class="magic-animation">
            <div class="magic-circle">
              <div class="circle-ring"></div>
              <div class="circle-ring"></div>
              <div class="circle-ring"></div>
              <img src="~/assets/images/flexi-superhero.png" alt="Flexi" class="flexi-center" />
            </div>
          </div>
          
          <h3>Creating Your New Website</h3>
          <p class="generating-text">{{ generatingMessage }}</p>
          
          <div class="progress-details">
            <div 
              v-for="task in generationTasks" 
              :key="task.id"
              class="task-item"
              :class="{ active: task.active, completed: task.completed }"
            >
              <div class="task-icon">
                <span v-if="!task.completed && !task.active">○</span>
                <span v-if="task.active" class="spinner"></span>
                <span v-if="task.completed">✓</span>
              </div>
              <span class="task-name">{{ task.name }}</span>
            </div>
          </div>
        </div>
      </transition>
      
      <!-- Complete Phase -->
      <transition name="fade">
        <div v-if="currentPhase === 'complete'" class="phase-content complete">
          <div class="success-animation">
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="var(--green-500)" stroke-width="4" class="check-circle"/>
              <path d="M40 60 L55 75 L80 45" fill="none" stroke="var(--green-500)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" class="check-path"/>
            </svg>
          </div>
          
          <h3>Your Website is Ready!</h3>
          
          <div class="completion-stats">
            <div class="completion-card">
              <h4>✅ 100% EAA Compliant</h4>
              <p>Fully meets WCAG 2.2 AA standards</p>
            </div>
            <div class="completion-card">
              <h4>⚡ 95% Performance Score</h4>
              <p>Lightning fast on all devices</p>
            </div>
            <div class="completion-card">
              <h4>📱 Mobile Optimized</h4>
              <p>Perfect experience on any screen</p>
            </div>
          </div>
          
          <div class="preview-container">
            <div class="device-preview desktop">
              <div class="device-frame">
                <div class="preview-placeholder">Desktop Preview</div>
              </div>
            </div>
            <div class="device-preview mobile">
              <div class="device-frame">
                <div class="preview-placeholder">Mobile Preview</div>
              </div>
            </div>
          </div>
          
          <div class="action-buttons">
            <button class="btn-primary">View Live Preview</button>
            <button class="btn-secondary">Download Files</button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  currentPhase: string
  websiteUrl?: string
}>()

// Reactive data
const stats = ref({
  pages: 0,
  images: 0,
  performance: 0,
  accessibility: 0
})

const planItems = ref([
  {
    icon: '🔍',
    title: 'Content Extraction',
    description: 'Extracting all your valuable content',
    completed: false
  },
  {
    icon: '♿',
    title: 'Accessibility Audit',
    description: 'Checking WCAG 2.2 AA compliance',
    completed: false
  },
  {
    icon: '🎨',
    title: 'Design Analysis',
    description: 'Understanding your brand identity',
    completed: false
  },
  {
    icon: '📱',
    title: 'Mobile Optimization',
    description: 'Planning responsive layouts',
    completed: false
  }
])

const complianceRequirements = [
  'Alt text for all images',
  'Proper heading hierarchy',
  'Color contrast 4.5:1 minimum',
  'Keyboard navigation support',
  'Screen reader compatibility'
]

const designColors = ref([
  { name: 'Primary', value: '#16C581' },
  { name: 'Secondary', value: '#14B8A6' },
  { name: 'Accent', value: '#3B82F6' },
  { name: 'Dark', value: '#1F2937' }
])

const generatingMessage = ref('Applying modern design patterns...')

const generationTasks = ref([
  { id: 1, name: 'Creating responsive layouts', active: true, completed: false },
  { id: 2, name: 'Optimizing images', active: false, completed: false },
  { id: 3, name: 'Building components', active: false, completed: false },
  { id: 4, name: 'Ensuring accessibility', active: false, completed: false },
  { id: 5, name: 'Final optimization', active: false, completed: false }
])

// Simulate progress when phase changes
watch(() => props.currentPhase, (phase) => {
  if (phase === 'analyzing') {
    animateStats()
  } else if (phase === 'planning') {
    animatePlanItems()
  } else if (phase === 'generating') {
    animateGeneration()
  }
})

const animateStats = () => {
  const targetStats = {
    pages: 12,
    images: 48,
    performance: 65,
    accessibility: 62
  }
  
  const interval = setInterval(() => {
    if (stats.value.pages < targetStats.pages) stats.value.pages++
    if (stats.value.images < targetStats.images) stats.value.images += 2
    if (stats.value.performance < targetStats.performance) stats.value.performance += 3
    if (stats.value.accessibility < targetStats.accessibility) stats.value.accessibility += 2
    
    if (stats.value.pages >= targetStats.pages && 
        stats.value.images >= targetStats.images &&
        stats.value.performance >= targetStats.performance &&
        stats.value.accessibility >= targetStats.accessibility) {
      clearInterval(interval)
    }
  }, 100)
}

const animatePlanItems = () => {
  planItems.value.forEach((item, index) => {
    setTimeout(() => {
      item.completed = true
    }, (index + 1) * 800)
  })
}

const animateGeneration = () => {
  const messages = [
    'Applying modern design patterns...',
    'Optimizing for mobile devices...',
    'Ensuring WCAG compliance...',
    'Generating responsive layouts...',
    'Finalizing your new website...'
  ]
  
  let messageIndex = 0
  const messageInterval = setInterval(() => {
    messageIndex++
    if (messageIndex < messages.length) {
      generatingMessage.value = messages[messageIndex]
    } else {
      clearInterval(messageInterval)
    }
  }, 2000)
  
  generationTasks.value.forEach((task, index) => {
    setTimeout(() => {
      if (index > 0) {
        generationTasks.value[index - 1].active = false
        generationTasks.value[index - 1].completed = true
      }
      task.active = true
      
      if (index === generationTasks.value.length - 1) {
        setTimeout(() => {
          task.active = false
          task.completed = true
        }, 2000)
      }
    }, index * 2000)
  })
}
</script>

<style scoped>
.refresh-magic {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: var(--bg-primary);
  position: relative;
  overflow: hidden;
}

.magic-content {
  width: 100%;
  max-width: 800px;
}

.phase-content {
  text-align: center;
}

/* Analyzing Phase */
.scanner {
  position: relative;
  max-width: 500px;
  margin: 0 auto 2rem;
}

.scan-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--primary-500), transparent);
  animation: scan 2s linear infinite;
}

@keyframes scan {
  from { top: 0; }
  to { top: 100%; }
}

.website-preview {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.browser-bar {
  background: var(--bg-tertiary);
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid var(--border-primary);
}

.browser-dots {
  display: flex;
  gap: 0.5rem;
}

.browser-dots span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--bg-quaternary);
}

.browser-url {
  flex: 1;
  background: var(--bg-secondary);
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.website-content {
  padding: 2rem;
  min-height: 300px;
}

.content-skeleton {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.skeleton-header,
.skeleton-nav,
.skeleton-hero,
.skeleton-box {
  background: var(--bg-tertiary);
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}

.skeleton-header {
  height: 60px;
}

.skeleton-nav {
  height: 40px;
}

.skeleton-hero {
  height: 150px;
}

.skeleton-content {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.skeleton-box {
  height: 80px;
}

.skeleton-header::after,
.skeleton-nav::after,
.skeleton-hero::after,
.skeleton-box::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  100% { left: 100%; }
}

.analysis-stats h3 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.stat-icon {
  font-size: 2.5rem;
}

.stat-info {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-label {
  display: block;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

/* Planning Phase */
.plan-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 500px;
  margin: 2rem auto;
}

.plan-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  text-align: left;
  transition: all 0.3s;
}

.plan-item.completed {
  border-color: var(--green-500);
  background: rgba(34, 197, 94, 0.05);
}

.plan-icon {
  font-size: 2rem;
}

.plan-details {
  flex: 1;
}

.plan-details h4 {
  font-size: 1rem;
  margin-bottom: 0.25rem;
  color: var(--text-primary);
}

.plan-details p {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
}

.plan-status svg {
  animation: checkIn 0.3s ease-out;
}

@keyframes checkIn {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}

.compliance-preview {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  padding: 1.5rem;
  max-width: 500px;
  margin: 0 auto;
}

.compliance-preview h4 {
  font-size: 1.125rem;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.requirement-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: left;
}

.requirement {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.req-icon {
  color: var(--green-500);
  font-weight: 700;
}

/* Design Phase */
.design-preview {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 2rem;
}

.color-palette,
.typography-preview,
.component-preview {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  padding: 1.5rem;
}

.color-palette h4,
.typography-preview h4,
.component-preview h4 {
  font-size: 1rem;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.colors {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.color-swatch {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  display: flex;
  align-items: flex-end;
  padding: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.color-name {
  font-size: 0.75rem;
  color: white;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.type-samples {
  text-align: left;
}

.sample-h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.sample-h2 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.sample-p {
  font-size: 1rem;
  color: var(--text-secondary);
}

.component-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.component-card {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 6px;
  padding: 1rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

/* Generating Phase */
.magic-animation {
  margin-bottom: 2rem;
}

.magic-circle {
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto;
}

.circle-ring {
  position: absolute;
  inset: 0;
  border: 2px solid var(--primary-500);
  border-radius: 50%;
  opacity: 0.3;
}

.circle-ring:nth-child(1) {
  animation: ripple 3s linear infinite;
}

.circle-ring:nth-child(2) {
  animation: ripple 3s linear infinite 1s;
}

.circle-ring:nth-child(3) {
  animation: ripple 3s linear infinite 2s;
}

@keyframes ripple {
  from {
    transform: scale(0.8);
    opacity: 0.6;
  }
  to {
    transform: scale(1.4);
    opacity: 0;
  }
}

.flexi-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  object-fit: contain;
}

.generating-text {
  font-size: 1.125rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

.progress-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 400px;
  margin: 0 auto;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  color: var(--text-tertiary);
  transition: color 0.3s;
}

.task-item.active {
  color: var(--primary-500);
  font-weight: 600;
}

.task-item.completed {
  color: var(--text-primary);
}

.task-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid var(--primary-200);
  border-top-color: var(--primary-500);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Complete Phase */
.success-animation {
  margin-bottom: 2rem;
}

.check-circle {
  stroke-dasharray: 314;
  stroke-dashoffset: 314;
  animation: drawCircle 0.8s ease-out forwards;
}

.check-path {
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation: drawCheck 0.5s ease-out 0.8s forwards;
}

@keyframes drawCircle {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes drawCheck {
  to {
    stroke-dashoffset: 0;
  }
}

.completion-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin: 2rem 0;
}

.completion-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  padding: 1.5rem;
}

.completion-card h4 {
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.completion-card p {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
}

.preview-container {
  display: flex;
  gap: 2rem;
  justify-content: center;
  margin: 2rem 0;
}

.device-preview {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  padding: 1rem;
}

.device-preview.desktop .device-frame {
  width: 300px;
  height: 200px;
}

.device-preview.mobile .device-frame {
  width: 120px;
  height: 240px;
}

.device-frame {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-placeholder {
  font-size: 0.875rem;
  color: var(--text-tertiary);
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: var(--primary-500);
  color: white;
}

.btn-primary:hover {
  background: var(--primary-600);
  transform: translateY(-1px);
}

.btn-secondary {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: 2px solid var(--border-primary);
}

.btn-secondary:hover {
  background: var(--bg-quaternary);
}

/* Fade Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .stat-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .colors {
    flex-wrap: wrap;
  }
  
  .color-swatch {
    width: 60px;
    height: 60px;
  }
  
  .component-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .completion-stats {
    grid-template-columns: 1fr;
  }
  
  .preview-container {
    flex-direction: column;
    align-items: center;
  }
  
  .action-buttons {
    flex-direction: column;
    width: 100%;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
}
</style>