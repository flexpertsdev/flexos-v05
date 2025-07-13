<template>
  <section class="testimonials-section">
    <div class="section-content">
      <h2>Success Stories from Our Graduates</h2>
      
      <div class="testimonials-container">
        <button @click="previousTestimonial" class="nav-button prev">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        
        <div class="testimonial-wrapper">
          <transition name="slide-fade" mode="out-in">
            <div :key="currentIndex" class="testimonial-card">
              <div class="quote-icon">"</div>
              
              <p class="testimonial-text">
                {{ testimonials[currentIndex].text }}
              </p>
              
              <div class="testimonial-author">
                <div class="author-image">
                  <div class="author-avatar">{{ testimonials[currentIndex].emoji }}</div>
                </div>
                <div class="author-info">
                  <h4>{{ testimonials[currentIndex].name }}</h4>
                  <p>{{ testimonials[currentIndex].role }}</p>
                </div>
              </div>
              
              <div class="testimonial-stats">
                <div class="stat">
                  <span class="stat-icon">📱</span>
                  <span class="stat-text">{{ testimonials[currentIndex].apps }} apps built</span>
                </div>
                <div class="stat">
                  <span class="stat-icon">💰</span>
                  <span class="stat-text">{{ testimonials[currentIndex].revenue }}/month</span>
                </div>
                <div class="stat">
                  <span class="stat-icon">📈</span>
                  <span class="stat-text">{{ testimonials[currentIndex].downloads }} downloads</span>
                </div>
              </div>
            </div>
          </transition>
        </div>
        
        <button @click="nextTestimonial" class="nav-button next">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>
      
      <div class="testimonial-dots">
        <button 
          v-for="(_, index) in testimonials" 
          :key="index"
          @click="currentIndex = index"
          class="dot"
          :class="{ active: currentIndex === index }"
        ></button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const currentIndex = ref(0)
let autoPlayInterval: NodeJS.Timeout

const testimonials = [
  {
    text: "The Flexperts Academy transformed my idea into a market-ready product. I launched my fitness app and reached 1,000 downloads in the first month!",
    name: "Sarah Chen",
    role: "Fitness App Creator",
    emoji: "👩‍💻",
    apps: "3",
    revenue: "$5,000",
    downloads: "10K+"
  },
  {
    text: "As a non-technical founder, I thought building an app was impossible. The personalized coaching made all the difference. Now I run a successful e-commerce app.",
    name: "Michael Rodriguez",
    role: "E-commerce Entrepreneur",
    emoji: "👨‍💼",
    apps: "2",
    revenue: "$8,500",
    downloads: "25K+"
  },
  {
    text: "The hands-on approach and real-world projects prepared me perfectly. I now freelance as a no-code developer and have more clients than I can handle!",
    name: "Emma Johnson",
    role: "Freelance Developer",
    emoji: "👩‍🎨",
    apps: "12",
    revenue: "$12,000",
    downloads: "50K+"
  },
  {
    text: "Building apps without code seemed too good to be true, but the Academy proved me wrong. My productivity app is now used by thousands of professionals.",
    name: "David Park",
    role: "Productivity App Founder",
    emoji: "👨‍🏫",
    apps: "1",
    revenue: "$15,000",
    downloads: "35K+"
  }
]

const nextTestimonial = () => {
  currentIndex.value = (currentIndex.value + 1) % testimonials.length
}

const previousTestimonial = () => {
  currentIndex.value = currentIndex.value === 0 
    ? testimonials.length - 1 
    : currentIndex.value - 1
}

const startAutoPlay = () => {
  autoPlayInterval = setInterval(() => {
    nextTestimonial()
  }, 5000)
}

const stopAutoPlay = () => {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval)
  }
}

onMounted(() => {
  startAutoPlay()
})

onUnmounted(() => {
  stopAutoPlay()
})
</script>

<style scoped>
.testimonials-section {
  padding: 5rem 0;
  background: var(--bg-secondary);
  overflow: hidden;
}

.section-content {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-content h2 {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 3rem;
  color: var(--text-primary);
}

.testimonials-container {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
}

.testimonial-wrapper {
  flex: 1;
  overflow: hidden;
}

.testimonial-card {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 20px;
  padding: 3rem;
  position: relative;
}

.quote-icon {
  position: absolute;
  top: 2rem;
  left: 2rem;
  font-size: 4rem;
  font-weight: 700;
  color: var(--primary-200);
  opacity: 0.3;
}

.testimonial-text {
  font-size: 1.25rem;
  line-height: 1.8;
  color: var(--text-primary);
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.author-image {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  background: var(--bg-quaternary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.author-avatar {
  font-size: 2rem;
}

.author-info h4 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: var(--text-primary);
}

.author-info p {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
}

.testimonial-stats {
  display: flex;
  gap: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-primary);
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stat-icon {
  font-size: 1.25rem;
}

.stat-text {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

/* Navigation Buttons */
.nav-button {
  width: 48px;
  height: 48px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--text-secondary);
  flex-shrink: 0;
}

.nav-button:hover {
  background: var(--bg-quaternary);
  border-color: var(--primary-500);
  color: var(--primary-500);
}

/* Dots */
.testimonial-dots {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.dot {
  width: 8px;
  height: 8px;
  background: var(--bg-quaternary);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s;
}

.dot:hover {
  background: var(--primary-300);
}

.dot.active {
  width: 24px;
  background: var(--primary-500);
  border-radius: 4px;
}

/* Slide Fade Transition */
.slide-fade-enter-active {
  transition: all 0.5s ease;
}

.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .section-content h2 {
    font-size: 2rem;
  }
  
  .testimonial-card {
    padding: 2rem;
  }
  
  .testimonial-text {
    font-size: 1rem;
  }
  
  .testimonial-stats {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .nav-button {
    display: none;
  }
}
</style>