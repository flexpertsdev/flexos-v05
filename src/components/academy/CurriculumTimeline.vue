<template>
  <section id="curriculum" class="curriculum-section">
    <div class="section-content">
      <div class="section-header">
        <h2>Your 12-Week Journey</h2>
        <p>From zero to launching your first app with structured learning and expert guidance</p>
      </div>
      
      <div class="timeline">
        <div 
          v-for="(stage, index) in stages" 
          :key="index"
          class="timeline-item"
          :class="{ active: activeStage === index }"
          @click="activeStage = index"
        >
          <div class="timeline-marker">
            <span class="week">Week {{ stage.weeks }}</span>
            <div class="marker-dot"></div>
          </div>
          
          <div class="timeline-content">
            <h3>{{ stage.title }}</h3>
            <p>{{ stage.description }}</p>
            
            <transition name="expand">
              <div v-if="activeStage === index" class="stage-details">
                <h4>What you'll learn:</h4>
                <ul>
                  <li v-for="topic in stage.topics" :key="topic">{{ topic }}</li>
                </ul>
                
                <div class="stage-outcome">
                  <span class="outcome-icon">🎯</span>
                  <div>
                    <h5>Outcome</h5>
                    <p>{{ stage.outcome }}</p>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
      
      <div class="tools-section">
        <h3>Tools You'll Master</h3>
        <div class="tools-grid">
          <div class="tool-card">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg" alt="FlutterFlow" />
            <h4>FlutterFlow</h4>
            <p>Visual app builder</p>
          </div>
          <div class="tool-card">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" alt="Figma" />
            <h4>Figma</h4>
            <p>Design & prototyping</p>
          </div>
          <div class="tool-card">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg" alt="Firebase" />
            <h4>Firebase</h4>
            <p>Backend & database</p>
          </div>
          <div class="tool-card">
            <div class="tool-icon">🤖</div>
            <h4>AI Tools</h4>
            <p>Speed up development</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activeStage = ref(0)

const stages = [
  {
    weeks: '1-2',
    title: 'Business Case & Vision',
    description: 'Define your app idea and validate it with market research',
    topics: [
      'Identifying your target audience',
      'Market research and competitor analysis',
      'Creating user personas',
      'Defining your unique value proposition'
    ],
    outcome: 'A validated app concept with clear business goals'
  },
  {
    weeks: '3-4',
    title: 'App Design & Marketing',
    description: 'Design your app interface and plan your marketing strategy',
    topics: [
      'UI/UX fundamentals',
      'Creating wireframes in Figma',
      'Building interactive prototypes',
      'Marketing strategy and branding'
    ],
    outcome: 'Complete app designs and marketing plan'
  },
  {
    weeks: '5-6',
    title: 'FlutterFlow Basics',
    description: 'Master the fundamentals of no-code development',
    topics: [
      'FlutterFlow interface and workflow',
      'Building basic screens and navigation',
      'Working with components and widgets',
      'Responsive design principles'
    ],
    outcome: 'Your first functional app prototype'
  },
  {
    weeks: '7-9',
    title: 'Complex Features',
    description: 'Add advanced functionality to your app',
    topics: [
      'Database design with Firebase',
      'User authentication and profiles',
      'API integrations',
      'Custom functions and logic'
    ],
    outcome: 'Fully functional app with core features'
  },
  {
    weeks: '10-12',
    title: 'Launch Preparation',
    description: 'Polish, test, and launch your app to the world',
    topics: [
      'App testing and debugging',
      'Performance optimization',
      'App store submission process',
      'Launch marketing campaign'
    ],
    outcome: 'Your app live in app stores!'
  }
]
</script>

<style scoped>
.curriculum-section {
  padding: 5rem 0;
  background: var(--bg-secondary);
}

.section-content {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-header h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.section-header p {
  font-size: 1.125rem;
  color: var(--text-secondary);
}

/* Timeline */
.timeline {
  position: relative;
  padding-left: 3rem;
  margin-bottom: 4rem;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 1.5rem;
  top: 2rem;
  bottom: 2rem;
  width: 2px;
  background: var(--border-primary);
}

.timeline-item {
  position: relative;
  margin-bottom: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-marker {
  position: absolute;
  left: -3rem;
  top: 0;
  width: 3rem;
  text-align: center;
}

.week {
  font-size: 0.75rem;
  color: var(--text-tertiary);
  font-weight: 600;
}

.marker-dot {
  width: 16px;
  height: 16px;
  background: var(--bg-tertiary);
  border: 2px solid var(--border-primary);
  border-radius: 50%;
  margin: 0.5rem auto;
  transition: all 0.3s ease;
}

.timeline-item.active .marker-dot,
.timeline-item:hover .marker-dot {
  background: var(--primary-500);
  border-color: var(--primary-500);
  transform: scale(1.2);
}

.timeline-content {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.timeline-item:hover .timeline-content {
  border-color: var(--border-secondary);
  transform: translateX(4px);
}

.timeline-item.active .timeline-content {
  border-color: var(--primary-500);
  box-shadow: 0 10px 30px rgba(22, 193, 129, 0.1);
}

.timeline-content h3 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.timeline-content > p {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

/* Stage Details */
.stage-details {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-primary);
}

.stage-details h4 {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
}

.stage-details ul {
  list-style: none;
  padding: 0;
  margin: 0 0 1rem 0;
}

.stage-details li {
  position: relative;
  padding-left: 1.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.stage-details li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--primary-500);
  font-weight: 700;
}

.stage-outcome {
  display: flex;
  gap: 1rem;
  background: var(--bg-quaternary);
  border-radius: 8px;
  padding: 1rem;
}

.outcome-icon {
  font-size: 1.5rem;
}

.stage-outcome h5 {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.stage-outcome p {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
}

/* Expand Transition */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}

/* Tools Section */
.tools-section {
  background: var(--bg-tertiary);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
}

.tools-section h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: var(--text-primary);
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.tool-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.tool-card:hover {
  transform: translateY(-4px);
  border-color: var(--border-secondary);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.tool-card img {
  width: 48px;
  height: 48px;
  margin-bottom: 1rem;
}

.tool-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.tool-card h4 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: var(--text-primary);
}

.tool-card p {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .section-header h2 {
    font-size: 2rem;
  }
  
  .timeline {
    padding-left: 2rem;
  }
  
  .timeline::before {
    left: 0.75rem;
  }
  
  .timeline-marker {
    left: -2rem;
    width: 2rem;
  }
  
  .timeline-content {
    padding: 1rem;
  }
  
  .tools-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  .tool-card {
    padding: 1rem;
  }
}
</style>