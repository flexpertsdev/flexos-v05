<template>
  <section class="flex-together">
    <div class="flex-together-bg">
      <div class="gradient-orb community-orb-1"></div>
      <div class="gradient-orb community-orb-2"></div>
    </div>
    
    <div class="flex-together-content">
      <div class="flex-together-header">
        <h2 class="flex-together-title">Flex Together</h2>
        <p class="flex-together-subtitle">
          See what our community has built with FlexOS
        </p>
      </div>
      
      <div class="showcase-grid">
        <div 
          v-for="project in showcaseProjects" 
          :key="project.id"
          class="showcase-card"
          @click="openProjectPreview(project)"
        >
          <div class="card-image">
            <img :src="project.thumbnail" :alt="project.name" />
            <div class="card-overlay">
              <button class="preview-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                Preview
              </button>
            </div>
          </div>
          <div class="card-content">
            <h3 class="card-name">{{ project.name }}</h3>
            <p class="card-description">{{ project.description }}</p>
            <div class="card-stats">
              <span class="stat-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                {{ project.users }}
              </span>
              <span class="stat-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                {{ project.rating }}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="influencer-section">
        <div class="influencer-card">
          <div class="influencer-icon">🚀</div>
          <div class="influencer-content">
            <h3>Become a Flexfluencer</h3>
            <p>Earn money by promoting apps to your audience</p>
            <button class="influencer-cta" @click="applyInfluencer">
              Start Earning as a Flexfluencer
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Project Preview Modal -->
    <transition name="modal-fade">
      <div v-if="showProjectModal" class="project-modal" @click="closeProjectPreview">
        <div class="project-modal-content" @click.stop>
          <button class="modal-close" @click="closeProjectPreview">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
          
          <div class="modal-grid">
            <div class="modal-preview">
              <img :src="selectedProject?.screenshot" :alt="selectedProject?.name" />
            </div>
            
            <div class="modal-info">
              <h2 class="modal-title">{{ selectedProject?.name }}</h2>
              <p class="modal-description">{{ selectedProject?.fullDescription }}</p>
              
              <div class="modal-features">
                <h4>Key Features</h4>
                <ul>
                  <li v-for="feature in selectedProject?.features" :key="feature">
                    {{ feature }}
                  </li>
                </ul>
              </div>
              
              <div class="modal-tech">
                <h4>Built With</h4>
                <div class="tech-tags">
                  <span v-for="tech in selectedProject?.techStack" :key="tech" class="tech-tag">
                    {{ tech }}
                  </span>
                </div>
              </div>
              
              <div class="modal-actions">
                <a :href="selectedProject?.liveUrl" target="_blank" class="modal-cta-primary">
                  Visit Live Site
                </a>
                <button class="modal-cta-secondary" @click="startSimilarProject">
                  Build Something Similar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface ShowcaseProject {
  id: number
  name: string
  description: string
  thumbnail: string
  screenshot: string
  fullDescription: string
  users: string
  rating: string
  liveUrl: string
  features: string[]
  techStack: string[]
}

const showProjectModal = ref(false)
const selectedProject = ref<ShowcaseProject | null>(null)

// Showcase projects data
const showcaseProjects = ref<ShowcaseProject[]>([
  {
    id: 1,
    name: 'AWHoney',
    description: 'AI-powered therapy chatbot for mental wellness',
    thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop',
    screenshot: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop',
    fullDescription: 'AWHoney provides 24/7 AI-powered therapy support, offering personalized mental health guidance through natural conversations. Built with FlexOS in just 2 weeks.',
    users: '5.2k users',
    rating: '4.9',
    liveUrl: 'https://awhoney.com',
    features: [
      'Natural language therapy conversations',
      'Mood tracking and analytics',
      'Personalized coping strategies',
      'Emergency support resources'
    ],
    techStack: ['Vue 3', 'Supabase', 'OpenAI API', 'Tailwind CSS']
  },
  {
    id: 2,
    name: 'LovingYourSkin',
    description: 'K-beauty marketplace connecting brands with beauty enthusiasts',
    thumbnail: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop',
    screenshot: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&h=600&fit=crop',
    fullDescription: 'A curated K-beauty marketplace featuring authentic Korean skincare and cosmetics. Complete e-commerce solution built with FlexOS including inventory management and payment processing.',
    users: '12k users',
    rating: '4.8',
    liveUrl: 'https://lovingyourskin.net',
    features: [
      'Product recommendation engine',
      'Live beauty consultations',
      'Subscription box service',
      'Influencer partnerships'
    ],
    techStack: ['Vue 3', 'Stripe', 'Cloudinary', 'PostgreSQL']
  },
  {
    id: 3,
    name: 'SkooledIn',
    description: 'AI education app helping students learn smarter',
    thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop',
    screenshot: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop',
    fullDescription: 'SkooledIn uses AI to create personalized learning paths for students. From homework help to exam prep, it adapts to each student\'s learning style and pace.',
    users: '28k users',
    rating: '4.7',
    liveUrl: 'https://skooledin.com',
    features: [
      'AI-powered study plans',
      'Interactive practice tests',
      'Progress tracking dashboard',
      'Peer collaboration tools'
    ],
    techStack: ['Nuxt 3', 'Firebase', 'TensorFlow.js', 'Chart.js']
  },
  {
    id: 4,
    name: 'PetPalace',
    description: 'Smart pet care platform for modern pet parents',
    thumbnail: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400&h=300&fit=crop',
    screenshot: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&h=600&fit=crop',
    fullDescription: 'PetPalace connects pet owners with verified vets, groomers, and pet sitters. Features AI-powered health monitoring and appointment scheduling.',
    users: '8.5k users',
    rating: '4.9',
    liveUrl: 'https://petpalace.app',
    features: [
      'Vet video consultations',
      'Health record management',
      'Smart feeding reminders',
      'Local service booking'
    ],
    techStack: ['Vue 3', 'Supabase', 'Twilio', 'MapBox']
  },
  {
    id: 5,
    name: 'FitnessFlex',
    description: 'Personal AI trainer that adapts to your fitness journey',
    thumbnail: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop',
    screenshot: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop',
    fullDescription: 'FitnessFlex creates personalized workout plans using AI, tracks your progress with computer vision, and provides real-time form corrections.',
    users: '15k users',
    rating: '4.8',
    liveUrl: 'https://fitnessflex.io',
    features: [
      'AI workout generation',
      'Form analysis with camera',
      'Nutrition tracking',
      'Community challenges'
    ],
    techStack: ['Nuxt 3', 'TensorFlow.js', 'WebRTC', 'D3.js']
  },
  {
    id: 6,
    name: 'EcoTracker',
    description: 'Track and reduce your carbon footprint with AI insights',
    thumbnail: 'https://images.unsplash.com/photo-1536431311719-398b6704d4cc?w=400&h=300&fit=crop',
    screenshot: 'https://images.unsplash.com/photo-1536431311719-398b6704d4cc?w=800&h=600&fit=crop',
    fullDescription: 'EcoTracker helps individuals and businesses monitor their environmental impact with AI-powered suggestions for sustainable living.',
    users: '6.7k users',
    rating: '4.6',
    liveUrl: 'https://ecotracker.earth',
    features: [
      'Carbon footprint calculator',
      'Sustainability challenges',
      'Green product marketplace',
      'Impact visualization'
    ],
    techStack: ['Vue 3', 'Node.js', 'MongoDB', 'Recharts']
  }
])

const openProjectPreview = (project: ShowcaseProject) => {
  selectedProject.value = project
  showProjectModal.value = true
  document.body.style.overflow = 'hidden'
}

const closeProjectPreview = () => {
  showProjectModal.value = false
  selectedProject.value = null
  document.body.style.overflow = ''
}

const applyInfluencer = () => {
  // Navigate to the flexfluencer wizard
  window.location.href = '/wizard/flexfluencer'
}

const startSimilarProject = () => {
  if (selectedProject.value) {
    window.location.href = `/wizard?template=${selectedProject.value.id}`
  }
}
</script>

<style scoped>
/* Flex Together Community Section */
.flex-together {
  padding: 5rem 0;
  background: var(--bg-primary);
  position: relative;
  overflow: hidden;
}

.flex-together-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.community-orb-1 {
  top: 10%;
  left: -10%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(22, 193, 129, 0.1) 0%, transparent 70%);
}

.community-orb-2 {
  bottom: 20%;
  right: -15%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
}

.flex-together-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
}

.flex-together-header {
  text-align: center;
  margin-bottom: 3rem;
}

.flex-together-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, var(--primary-400) 0%, var(--teal-400) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.flex-together-subtitle {
  font-size: 1.25rem;
  color: var(--text-secondary);
}

/* Showcase Grid */
.showcase-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-bottom: 4rem;
}

.showcase-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.showcase-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  border-color: var(--border-secondary);
}

.card-image {
  position: relative;
  padding-bottom: 60%;
  overflow: hidden;
}

.card-image img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.showcase-card:hover .card-image img {
  transform: scale(1.1);
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.showcase-card:hover .card-overlay {
  opacity: 1;
}

.preview-btn {
  padding: 0.75rem 1.5rem;
  background: var(--primary-500);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.preview-btn:hover {
  background: var(--primary-600);
  transform: scale(1.05);
}

.card-content {
  padding: 1.5rem;
}

.card-name {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.card-description {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 1rem;
}

.card-stats {
  display: flex;
  gap: 1.5rem;
  font-size: 0.875rem;
  color: var(--text-tertiary);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stat-item svg {
  color: var(--primary-500);
}

/* Influencer Section */
.influencer-section {
  background: var(--bg-secondary);
  border: 2px dashed var(--border-primary);
  border-radius: 20px;
  padding: 3rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.influencer-section::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(251, 191, 36, 0.1) 0%, transparent 70%);
  pointer-events: none;
}

.influencer-card {
  position: relative;
  z-index: 1;
}

.influencer-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  filter: drop-shadow(0 10px 20px rgba(251, 191, 36, 0.3));
}

.influencer-content h3 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.influencer-content p {
  font-size: 1.125rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.influencer-cta {
  padding: 1rem 2.5rem;
  background: linear-gradient(135deg, var(--amber-400), var(--amber-500));
  color: var(--amber-900);
  border: none;
  border-radius: 8px;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.influencer-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(251, 191, 36, 0.3);
}

/* Project Modal */
.project-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.project-modal-content {
  background: var(--bg-secondary);
  border-radius: 20px;
  max-width: 1200px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.modal-close {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 10;
}

.modal-close:hover {
  background: var(--bg-quaternary);
  transform: scale(1.1);
}

.modal-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  padding: 3rem;
}

.modal-preview {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-preview img {
  width: 100%;
  height: auto;
  display: block;
}

.modal-info {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.modal-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.modal-description {
  font-size: 1.125rem;
  color: var(--text-secondary);
  line-height: 1.7;
}

.modal-features h4,
.modal-tech h4 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.modal-features ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.modal-features li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-secondary);
}

.modal-features li::before {
  content: '✓';
  color: var(--primary-500);
  font-weight: 700;
  font-size: 1.125rem;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.tech-tag {
  padding: 0.5rem 1rem;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 20px;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: auto;
}

.modal-cta-primary,
.modal-cta-secondary {
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
  text-align: center;
  flex: 1;
}

.modal-cta-primary {
  background: var(--primary-500);
  color: white;
  border: none;
}

.modal-cta-primary:hover {
  background: var(--primary-600);
  transform: translateY(-2px);
}

.modal-cta-secondary {
  background: transparent;
  color: var(--text-primary);
  border: 2px solid var(--border-secondary);
}

.modal-cta-secondary:hover {
  border-color: var(--primary-500);
  color: var(--primary-500);
}

/* Modal Animation */
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
  .showcase-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .modal-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .modal-preview {
    order: 2;
  }
}

@media (max-width: 768px) {
  .flex-together-title {
    font-size: 2.5rem;
  }
  
  .showcase-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .influencer-section {
    padding: 2rem;
  }
  
  .influencer-content h3 {
    font-size: 1.5rem;
  }
  
  .influencer-content p {
    font-size: 1rem;
  }
  
  .modal-grid {
    padding: 2rem;
  }
  
  .modal-title {
    font-size: 2rem;
  }
  
  .modal-actions {
    flex-direction: column;
  }
}
</style>