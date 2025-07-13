<template>
  <section class="hire-expert">
    <div class="hire-expert-content">
      <div class="expert-text">
        <h2 class="expert-title">Want to Talk to a Human?</h2>
        <h3 class="expert-subtitle">Let Our Flexperts Build It For You</h3>
        <p class="expert-description">
          Use FlexOS to explain your vision with our AI, create wireframes, and plan your project. 
          Then hand it over to one of our expert developers who will bring it to life—no AI frustrations, 
          just real human expertise delivering exactly what you need.
        </p>
        
        <ul class="expert-benefits">
          <li>
            <div class="benefit-icon">🧙‍♂️</div>
            <div class="benefit-content">
              <h4>Expert Developers</h4>
              <p>Seasoned professionals who understand your vision</p>
            </div>
          </li>
          <li>
            <div class="benefit-icon">🎯</div>
            <div class="benefit-content">
              <h4>No AI Hallucinations</h4>
              <p>Real code, real testing, real results</p>
            </div>
          </li>
          <li>
            <div class="benefit-icon">🚀</div>
            <div class="benefit-content">
              <h4>Fast Turnaround</h4>
              <p>From concept to deployment in days, not months</p>
            </div>
          </li>
        </ul>
        
        <NuxtLink to="/meet" class="expert-cta">
          Meet Our Flexperts →
        </NuxtLink>
      </div>
      
      <div class="expert-visual">
        <div class="expert-grid">
          <div 
            v-for="(expert, index) in experts" 
            :key="index"
            class="expert-card-wrapper"
            @mouseenter="handleMouseEnter(index)"
            @mouseleave="handleMouseLeave(index)"
          >
            <div 
              class="expert-card"
              @click="handleCardClick(index)"
            >
              <div class="expert-avatar">
                <img 
                  v-if="expert.image" 
                  :src="expert.image" 
                  :alt="expert.name"
                  class="avatar-image"
                >
                <div v-else class="avatar-emoji">{{ expert.emoji }}</div>
              </div>
              
              <div class="expert-info">
                <h5 class="expert-name">{{ expert.name }}</h5>
                <p class="expert-role">{{ expert.role }}</p>
              </div>
              
              <!-- Mobile tap indicator -->
              <div class="mobile-tap-hint">
                <span>Tap for details</span>
              </div>
            </div>
            
            <!-- Desktop hover popover / Mobile tap popover -->
            <transition name="popover">
              <div 
                v-if="activeExpert === index" 
                class="expert-popover"
                :class="[getPopoverPosition(index), { 'mobile-popover': isMobileView }]"
                @click.stop
              >
                <!-- Mobile close button -->
                <button 
                  v-if="isMobileView"
                  class="popover-close"
                  @click="activeExpert = null"
                  aria-label="Close"
                >
                  ×
                </button>
                
                <div class="popover-header">
                  <div class="popover-avatar">
                    <img 
                      v-if="expert.image" 
                      :src="expert.image" 
                      :alt="expert.name"
                    >
                    <div v-else class="popover-emoji">{{ expert.emoji }}</div>
                  </div>
                  <div>
                    <h6>{{ expert.name }}</h6>
                    <p>{{ expert.role }}</p>
                  </div>
                </div>
                
                <div class="popover-skills">
                  <span 
                    v-for="skill in expert.skills" 
                    :key="skill"
                    class="skill-tag"
                  >
                    {{ skill }}
                  </span>
                </div>
                
                <p v-if="expert.bio" class="popover-bio">{{ expert.bio }}</p>
                
                <NuxtLink 
                  :to="`/meet/${expert.id}`" 
                  class="popover-cta"
                  @click="activeExpert = null"
                >
                  View Profile →
                </NuxtLink>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
// Import images using Nuxt assets
import josImage from '~/assets/images/flexperts/jos.png'
import dimitarImage from '~/assets/images/flexperts/dimitar.png'
import bellaImage from '~/assets/images/flexperts/bella.png'
import rosieImage from '~/assets/images/flexperts/rosie.png'
import satoshiImage from '~/assets/images/flexperts/satoshi.png'

interface Expert {
  id: string
  name: string
  role: string
  skills: string[]
  emoji?: string
  image?: string
  bio?: string
}

const activeExpert = ref<number | null>(null)
const isMobileView = ref(false)
let hoverTimeout: NodeJS.Timeout | null = null

const experts = ref<Expert[]>([
  {
    id: 'jos',
    name: 'Jos',
    role: 'Founder & CEO',
    skills: ['Strategy', 'Product Vision', 'Leadership'],
    emoji: '👨‍💼',
    image: josImage,
    bio: 'Visionary leader with 15+ years in tech, specializing in no-code solutions and helping businesses transform their ideas into reality.'
  },
  {
    id: 'john',
    name: 'John',
    role: 'UX Design Lead',
    skills: ['UI/UX', 'Figma', 'User Research'],
    emoji: '🎨',
    image: bellaImage,
    bio: 'UX designer with 10+ years of experience creating intuitive and beautiful user interfaces.'
  },
  {
    id: 'izunna',
    name: 'Izunna',
    role: 'E-commerce Specialist',
    skills: ['Shopify', 'WooCommerce', 'Payment Systems'],
    emoji: '🛍️',
    image: rosieImage,
    bio: 'E-commerce expert helping businesses scale their online presence with high-converting stores.'
  },
  {
    id: 'dimitar',
    name: 'Dimitar',
    role: 'Backend Architect',
    skills: ['PHP', 'APIs', 'Database Design'],
    emoji: '🔧',
    image: dimitarImage,
    bio: 'Backend specialist with expertise in building scalable, secure applications.'
  },
  {
    id: 'essam',
    name: 'Essam',
    role: 'FlutterFlow Expert',
    skills: ['FlutterFlow', 'Mobile Apps', 'Firebase'],
    emoji: '📱',
    image: satoshiImage,
    bio: 'FlutterFlow specialist helping clients build powerful mobile applications.'
  }
])

const getPopoverPosition = (index: number) => {
  // Position popover based on card position in grid
  if (index === 0 || index === 1) return 'popover-left'
  if (index === 3 || index === 4) return 'popover-right'
  return 'popover-center'
}

const handleMouseEnter = (index: number) => {
  if (isMobileView.value) return
  
  // Clear any pending timeout
  if (hoverTimeout) {
    clearTimeout(hoverTimeout)
    hoverTimeout = null
  }
  
  activeExpert.value = index
}

const handleMouseLeave = (index: number) => {
  if (isMobileView.value) return
  
  // Add a small delay to allow moving to popover
  hoverTimeout = setTimeout(() => {
    if (activeExpert.value === index) {
      activeExpert.value = null
    }
  }, 100)
}

const handleCardClick = (index: number) => {
  if (isMobileView.value) {
    // Toggle popover on mobile
    activeExpert.value = activeExpert.value === index ? null : index
  }
}

// Check if device supports hover
const checkMobileView = () => {
  isMobileView.value = window.matchMedia('(hover: none)').matches || window.innerWidth < 768
}

// Handle clicking outside to close popover on mobile
const handleClickOutside = (event: MouseEvent) => {
  if (!isMobileView.value) return
  
  const target = event.target as HTMLElement
  if (!target.closest('.expert-card-wrapper')) {
    activeExpert.value = null
  }
}

onMounted(() => {
  checkMobileView()
  window.addEventListener('resize', checkMobileView)
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobileView)
  document.removeEventListener('click', handleClickOutside)
  if (hoverTimeout) {
    clearTimeout(hoverTimeout)
  }
})
</script>

<style scoped>
/* Hire an Expert Section */
.hire-expert {
  padding: 5rem 0;
  background: var(--bg-primary);
  position: relative;
  overflow: hidden;
}

.hire-expert-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.expert-text {
  animation: slideInLeft 0.8s ease-out;
}

.expert-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.expert-subtitle {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, var(--primary-400) 0%, var(--teal-400) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.expert-description {
  font-size: 1.125rem;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 2rem;
}

.expert-benefits {
  list-style: none;
  padding: 0;
  margin: 0 0 2.5rem 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.expert-benefits li {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.benefit-icon {
  font-size: 2.5rem;
  flex-shrink: 0;
}

.benefit-content h4 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: var(--text-primary);
}

.benefit-content p {
  font-size: 0.95rem;
  color: var(--text-secondary);
}

.expert-cta {
  display: inline-flex;
  align-items: center;
  padding: 1rem 2.5rem;
  background: var(--primary-500);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

.expert-cta:hover {
  background: var(--primary-600);
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(22, 193, 129, 0.3);
}

/* Expert Grid */
.expert-visual {
  animation: slideInRight 0.8s ease-out;
}

.expert-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  grid-template-rows: repeat(2, 1fr);
}

.expert-card-wrapper {
  position: relative;
}

.expert-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 16px;
  padding: 2rem 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
}

.expert-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border-color: var(--primary-500);
}

.expert-avatar {
  width: 80px;
  height: 80px;
  margin: 0 auto 1rem;
  border-radius: 50%;
  overflow: hidden;
  background: var(--bg-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-emoji {
  font-size: 2.5rem;
}

.expert-info {
  text-align: center;
}

.expert-name {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: var(--text-primary);
}

.expert-role {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

/* Mobile tap hint */
.mobile-tap-hint {
  display: none;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: var(--primary-500);
  opacity: 0;
  transition: opacity 0.3s ease;
}

@media (hover: none) {
  .mobile-tap-hint {
    display: block;
  }
  
  .expert-card:active .mobile-tap-hint {
    opacity: 1;
  }
}

/* Popover */
.expert-popover {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 1rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  width: 320px;
}

/* Mobile popover adjustments */
.expert-popover.mobile-popover {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin-top: 0;
  max-width: 90vw;
  max-height: 80vh;
  overflow-y: auto;
}

.popover-close {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.25rem;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.popover-close:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.expert-popover::before {
  content: '';
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 8px solid var(--border-primary);
}

.expert-popover::after {
  content: '';
  position: absolute;
  top: -7px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 8px solid var(--bg-primary);
}

/* Hide arrows on mobile popover */
.mobile-popover::before,
.mobile-popover::after {
  display: none;
}

.popover-left {
  left: 0;
  transform: translateX(0);
}

.popover-right {
  left: auto;
  right: 0;
  transform: translateX(0);
}

.popover-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.popover-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  background: var(--bg-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.popover-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.popover-emoji {
  font-size: 1.5rem;
}

.popover-header h6 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.125rem;
  color: var(--text-primary);
}

.popover-header p {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.popover-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.skill-tag {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 20px;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.popover-bio {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 1rem;
}

.popover-cta {
  display: inline-flex;
  align-items: center;
  color: var(--primary-500);
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
}

.popover-cta:hover {
  color: var(--primary-600);
  transform: translateX(4px);
}

/* Popover transition */
.popover-enter-active,
.popover-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.popover-enter-from,
.popover-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-10px);
}

.popover-left.popover-enter-from,
.popover-left.popover-leave-to {
  transform: translateY(-10px);
}

.popover-right.popover-enter-from,
.popover-right.popover-leave-to {
  transform: translateY(-10px);
}

/* Mobile popover transitions */
.mobile-popover.popover-enter-from,
.mobile-popover.popover-leave-to {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.9);
}

/* Responsive */
@media (max-width: 1024px) {
  .hire-expert-content {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
  
  .expert-visual {
    max-width: 600px;
    margin: 0 auto;
  }
  
  .expert-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .expert-title {
    font-size: 2rem;
  }
  
  .expert-subtitle {
    font-size: 1.5rem;
  }
  
  .expert-description {
    font-size: 1rem;
  }
  
  .expert-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  .expert-card {
    padding: 1.5rem 1rem;
  }
  
  .expert-avatar {
    width: 60px;
    height: 60px;
  }
  
  .expert-cta {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .expert-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
  
  .expert-card {
    padding: 1.25rem 0.75rem;
  }
  
  .expert-name {
    font-size: 1rem;
  }
  
  .expert-role {
    font-size: 0.75rem;
  }
}

/* Animations */
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>