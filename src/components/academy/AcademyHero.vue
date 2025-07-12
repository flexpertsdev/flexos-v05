<template>
  <section class="academy-hero">
    <div class="hero-content">
      <div class="hero-text">
        <div class="badge">
          <span class="badge-icon">🎓</span>
          <span class="badge-text">12-Week Program</span>
        </div>
        
        <h1 class="hero-title">
          Learn to Build Apps<br>
          <span class="gradient-text">Without Writing Code</span>
        </h1>
        
        <p class="hero-description">
          Join the Flexperts Academy and master no-code app development. 
          From idea to launch in 12 weeks with personalized coaching and hands-on projects.
        </p>
        
        <div class="hero-stats">
          <div class="stat">
            <span class="stat-number">500+</span>
            <span class="stat-label">Graduates</span>
          </div>
          <div class="stat">
            <span class="stat-number">95%</span>
            <span class="stat-label">Success Rate</span>
          </div>
          <div class="stat">
            <span class="stat-number">4.9/5</span>
            <span class="stat-label">Student Rating</span>
          </div>
        </div>
        
        <div class="cta-buttons">
          <button @click="scrollToApplication" class="btn-primary">
            Apply Now →
          </button>
          <button @click="scrollToCurriculum" class="btn-secondary">
            View Curriculum
          </button>
        </div>
      </div>
      
      <div class="hero-visual">
        <div class="visual-container">
          <div class="student-card">
            <img src="~/assets/images/flexi-superhero.png" alt="Student" class="student-avatar" />
            <div class="student-info">
              <h4>Sarah Chen</h4>
              <p>Built 3 apps, now earning $5k/month</p>
              <div class="rating">
                <span v-for="i in 5" :key="i" class="star">⭐</span>
              </div>
            </div>
          </div>
          
          <div class="feature-cards">
            <div class="feature-card">
              <span class="feature-icon">👥</span>
              <span>1-on-1 Coaching</span>
            </div>
            <div class="feature-card">
              <span class="feature-icon">🎯</span>
              <span>Project-Based</span>
            </div>
            <div class="feature-card">
              <span class="feature-icon">🚀</span>
              <span>Launch Ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Floating Elements -->
    <div class="floating-elements">
      <div class="float-1">🚀</div>
      <div class="float-2">💡</div>
      <div class="float-3">🎨</div>
    </div>
  </section>
</template>

<script setup lang="ts">
const scrollToApplication = () => {
  const element = document.getElementById('application')
  element?.scrollIntoView({ behavior: 'smooth' })
}

const scrollToCurriculum = () => {
  const element = document.getElementById('curriculum')
  element?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style scoped>
.academy-hero {
  padding: 5rem 0;
  position: relative;
  overflow: hidden;
  background: var(--bg-primary);
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

/* Hero Text */
.hero-text {
  animation: fadeInLeft 0.8s ease-out;
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 30px;
  padding: 0.5rem 1rem;
  margin-bottom: 1.5rem;
}

.badge-icon {
  font-size: 1.25rem;
}

.badge-text {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}

.gradient-text {
  background: linear-gradient(135deg, var(--primary-400) 0%, var(--teal-400) 50%, var(--purple-400) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-description {
  font-size: 1.25rem;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 2rem;
}

.hero-stats {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
}

.stat {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-500);
}

.stat-label {
  display: block;
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
}

.btn-primary,
.btn-secondary {
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: var(--primary-500);
  color: white;
}

.btn-primary:hover {
  background: var(--primary-600);
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(22, 193, 129, 0.3);
}

.btn-secondary {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 2px solid var(--border-primary);
}

.btn-secondary:hover {
  background: var(--bg-tertiary);
  border-color: var(--primary-500);
}

/* Hero Visual */
.hero-visual {
  animation: fadeInRight 0.8s ease-out;
  position: relative;
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.visual-container {
  position: relative;
}

.student-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  transform: rotate(-2deg);
  transition: all 0.3s ease;
}

.student-card:hover {
  transform: rotate(0deg) scale(1.02);
}

.student-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 1rem;
  object-fit: contain;
}

.student-info h4 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.student-info p {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 0.75rem;
}

.rating {
  display: flex;
  gap: 0.125rem;
}

.star {
  font-size: 0.875rem;
}

.feature-cards {
  position: absolute;
  bottom: -2rem;
  right: -2rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.feature-card {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-primary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  animation: slideIn 0.8s ease-out;
  animation-fill-mode: both;
}

.feature-card:nth-child(1) { animation-delay: 0.1s; }
.feature-card:nth-child(2) { animation-delay: 0.2s; }
.feature-card:nth-child(3) { animation-delay: 0.3s; }

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.feature-icon {
  font-size: 1.25rem;
}

/* Floating Elements */
.floating-elements {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.float-1,
.float-2,
.float-3 {
  position: absolute;
  font-size: 2rem;
  opacity: 0.1;
  animation: float 20s ease-in-out infinite;
}

.float-1 {
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.float-2 {
  top: 60%;
  right: 10%;
  animation-delay: 7s;
}

.float-3 {
  bottom: 20%;
  left: 50%;
  animation-delay: 14s;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(30px, -30px) rotate(90deg);
  }
  50% {
    transform: translate(-20px, 20px) rotate(180deg);
  }
  75% {
    transform: translate(20px, 30px) rotate(270deg);
  }
}

/* Mobile Responsive */
@media (max-width: 1024px) {
  .hero-content {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
  
  .hero-visual {
    display: none;
  }
}

@media (max-width: 768px) {
  .academy-hero {
    padding: 3rem 0;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-description {
    font-size: 1rem;
  }
  
  .hero-stats {
    justify-content: space-around;
  }
  
  .stat-number {
    font-size: 1.5rem;
  }
  
  .cta-buttons {
    flex-direction: column;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
    font-size: 1rem;
  }
}
</style>