<template>
  <section class="differentiators">
    <div class="differentiators-content">
      <div class="differentiators-header">
        <h2 class="differentiators-title">Why FlexOS is Different</h2>
        <p class="differentiators-subtitle">
          Built by developers who understand the pitfalls of AI-assisted development
        </p>
      </div>
      
      <div class="differentiators-tabs">
        <div class="tabs-navigation">
          <button 
            v-for="(tab, index) in differentiatorTabs" 
            :key="tab.id"
            :class="['tab-button', { active: activeTab === index }]"
            @click="setActiveTab(index)"
          >
            <div class="tab-icon">{{ tab.icon }}</div>
            <div class="tab-content">
              <h3 class="tab-title">{{ tab.title }}</h3>
              <p class="tab-subtitle">{{ tab.subtitle }}</p>
            </div>
            <div class="tab-indicator"></div>
          </button>
        </div>
        
        <div class="tabs-content">
          <transition name="tab-fade" mode="out-in">
            <div :key="activeTab" class="tab-panel">
              <div class="panel-text">
                <h3 class="panel-title">{{ differentiatorTabs[activeTab].title }}</h3>
                <p class="panel-description">{{ differentiatorTabs[activeTab].description }}</p>
                <ul class="panel-features">
                  <li v-for="feature in differentiatorTabs[activeTab].features" :key="feature">
                    {{ feature }}
                  </li>
                </ul>
              </div>
              
              <div class="panel-media">
                <div class="video-placeholder" @click="openVideo">
                  <div class="video-gradient"></div>
                  <div class="video-content">
                    <div class="play-button">
                      <svg width="60" height="60" viewBox="0 0 24 24" fill="white">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                    <p class="video-label">{{ differentiatorTabs[activeTab].videoLabel }}</p>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </section>

  <!-- Video Modal -->
  <transition name="modal-fade">
    <div v-if="showVideoModal" class="video-modal" @click.self="closeVideo">
      <div class="modal-content">
        <button class="modal-close" @click="closeVideo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 6l12 12M6 18L18 6"/>
          </svg>
        </button>
        <div class="video-placeholder-large" @click="closeVideo">
          <div class="video-gradient"></div>
          <div class="video-content">
            <div class="play-button">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
            <p class="video-label-large">Video Coming Soon</p>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref(0)
const showVideoModal = ref(false)

// Differentiator tabs data
const differentiatorTabs = ref([
  {
    id: 'plan',
    icon: '📋',
    title: 'Plan Before You Build',
    subtitle: 'AI that thinks first',
    description: 'Unlike other AI builders that jump straight into code, FlexOS creates a comprehensive plan. Our AI understands your entire project scope before writing a single line.',
    features: [
      'Complete project architecture planning',
      'Component hierarchy visualization',
      'Database schema design upfront',
      'API endpoint mapping'
    ],
    videoLabel: 'See planning in action'
  },
  {
    id: 'accurate',
    icon: '🎯',
    title: 'No Hallucinations',
    subtitle: 'Reliable, tested code',
    description: 'Every line of code is verified against best practices and tested patterns. No made-up functions, no phantom APIs, just solid, working code you can trust.',
    features: [
      'Real-time code validation',
      'Framework-specific best practices',
      'Automatic error detection',
      'Production-ready output'
    ],
    videoLabel: 'Watch accuracy demo'
  },
  {
    id: 'human',
    icon: '🤝',
    title: 'Made for Humans',
    subtitle: 'Developer-first design',
    description: 'Built by developers who felt the pain of AI tools. Natural conversations, readable code, and an interface that speaks your language.',
    features: [
      'Natural language understanding',
      'Clean, commented code output',
      'Interactive refinement process',
      'Version control integration'
    ],
    videoLabel: 'Experience the difference'
  }
])

const setActiveTab = (index: number) => {
  activeTab.value = index
}

const openVideo = () => {
  showVideoModal.value = true
  document.body.style.overflow = 'hidden'
}

const closeVideo = () => {
  showVideoModal.value = false
  document.body.style.overflow = ''
}
</script>

<style scoped>
/* Differentiators Section */
.differentiators {
  padding: 4rem 0;
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-primary);
  border-bottom: 1px solid var(--border-primary);
}

.differentiators-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.differentiators-header {
  text-align: center;
  margin-bottom: 3rem;
}

.differentiators-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, var(--text-primary) 0%, var(--primary-400) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.differentiators-subtitle {
  font-size: 1.125rem;
  color: var(--text-secondary);
}

/* Tab Navigation */
.differentiators-tabs {
  display: flex;
  gap: 3rem;
  align-items: flex-start;
}

.tabs-navigation {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex-shrink: 0;
  width: 300px;
}

.tab-button {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  position: relative;
  overflow: hidden;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.tab-button:hover {
  border-color: var(--border-secondary);
  transform: translateX(4px);
}

.tab-button.active {
  border-color: var(--primary-500);
  background: var(--bg-quaternary);
}

.tab-icon {
  font-size: 2rem;
}

.tab-content {
  flex: 1;
}

.tab-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: var(--text-primary);
}

.tab-subtitle {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.tab-indicator {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: var(--primary-500);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.tab-button.active .tab-indicator {
  transform: scaleX(1);
}

/* Tab Content */
.tabs-content {
  position: relative;
  min-height: 400px;
}

.tab-panel {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
}

.panel-text {
  animation: slideInLeft 0.5s ease-out;
}

.panel-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.panel-description {
  font-size: 1.125rem;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 2rem;
}

.panel-features {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.panel-features li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.panel-features li::before {
  content: '✓';
  color: var(--primary-500);
  font-weight: 700;
  font-size: 1.125rem;
}

/* Video Placeholder */
.panel-media {
  animation: slideInRight 0.5s ease-out;
}

.video-placeholder {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  border-radius: 16px;
  overflow: hidden;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.video-placeholder:hover {
  transform: scale(1.02);
  box-shadow: 0 20px 60px rgba(22, 193, 129, 0.2);
}

.video-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, 
    rgba(22, 193, 129, 0.1) 0%, 
    rgba(20, 184, 166, 0.1) 50%,
    rgba(59, 130, 246, 0.1) 100%
  );
}

.video-content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.play-button {
  width: 80px;
  height: 80px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.video-placeholder:hover .play-button {
  transform: scale(1.1);
  background: rgba(22, 193, 129, 0.9);
}

.video-label {
  font-size: 1rem;
  color: var(--text-primary);
  font-weight: 600;
}

/* Tab Fade Animation */
.tab-fade-enter-active,
.tab-fade-leave-active {
  transition: all 0.3s ease;
}

.tab-fade-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.tab-fade-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

/* Video Modal */
.video-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.modal-content {
  position: relative;
  max-width: 1200px;
  width: 100%;
  cursor: default;
}

.modal-close {
  position: absolute;
  top: -3rem;
  right: 0;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
}

.modal-close:hover {
  transform: scale(1.1);
}

.video-placeholder-large {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%;
  border-radius: 16px;
  overflow: hidden;
  background: var(--bg-secondary);
  cursor: pointer;
}

.video-label-large {
  font-size: 1.5rem;
  color: white;
  font-weight: 600;
}

/* Modal Fade Animation */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 1024px) {
  .differentiators-tabs {
    flex-direction: column;
  }
  
  .tabs-navigation {
    width: 100%;
    flex-direction: row;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  
  .tab-button {
    min-width: 250px;
  }
  
  .tab-panel {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .panel-media {
    order: -1;
  }
}

@media (max-width: 768px) {
  .differentiators-title {
    font-size: 2rem;
  }
  
  .panel-title {
    font-size: 1.5rem;
  }
  
  .panel-description {
    font-size: 1rem;
  }
  
  .tabs-navigation {
    padding: 0 1rem;
  }
}
</style>