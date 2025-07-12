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
        
        <button class="expert-cta" @click="contactExpert">
          Talk to a Human Expert
        </button>
      </div>
      
      <div class="expert-visual">
        <div class="expert-illustration">
          <div class="illustration-card">
            <div class="card-avatar">👨‍💻</div>
            <div class="card-info">
              <h5>Meet Your Flexpert</h5>
              <p>Real developers, real solutions</p>
            </div>
          </div>
          <div class="illustration-features">
            <div class="feature-item">✓ Vue.js Experts</div>
            <div class="feature-item">✓ React Specialists</div>
            <div class="feature-item">✓ Full-Stack Developers</div>
            <div class="feature-item">✓ UI/UX Designers</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const contactExpert = () => {
  // Navigate to contact form or open modal
  alert('Contact form coming soon! Email us at experts@flexperts.com')
}
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
  padding: 1rem 2.5rem;
  background: var(--primary-500);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.expert-cta:hover {
  background: var(--primary-600);
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(22, 193, 129, 0.3);
}

/* Expert Visual */
.expert-visual {
  animation: slideInRight 0.8s ease-out;
  position: relative;
}

.expert-illustration {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  transform: rotate(2deg);
  transition: all 0.3s ease;
}

.expert-illustration:hover {
  transform: rotate(0deg) scale(1.02);
}

.illustration-card {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.card-avatar {
  font-size: 3rem;
  background: var(--bg-quaternary);
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-info h5 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: var(--text-primary);
}

.card-info p {
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.illustration-features {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.feature-item {
  background: var(--bg-quaternary);
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
  transition: all 0.2s ease;
}

.feature-item:hover {
  border-color: var(--primary-500);
  color: var(--primary-500);
  transform: translateX(4px);
}

/* Responsive */
@media (max-width: 1024px) {
  .hire-expert-content {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
  
  .expert-visual {
    max-width: 500px;
    margin: 0 auto;
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
  
  .expert-illustration {
    padding: 2rem;
  }
  
  .illustration-features {
    grid-template-columns: 1fr;
  }
  
  .expert-cta {
    width: 100%;
  }
}
</style>