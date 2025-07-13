<template>
  <section class="features">
    <div class="features-content">
      <h2 class="features-title">Everything You Need to Build</h2>
      <p class="features-subtitle">From idea to deployment in record time</p>
      
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">🤖</div>
          <h3 class="feature-title">AI-Powered Development</h3>
          <p class="feature-description">
            Our AI understands your requirements and generates production-ready code instantly.
          </p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">🎨</div>
          <h3 class="feature-title">Beautiful UI Components</h3>
          <p class="feature-description">
            Pre-built, customizable components that look great on every device.
          </p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">⚡</div>
          <h3 class="feature-title">Instant Deployment</h3>
          <p class="feature-description">
            Deploy to production with one click. We handle all the infrastructure.
          </p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">🔐</div>
          <h3 class="feature-title">Built-in Security</h3>
          <p class="feature-description">
            Enterprise-grade security features included by default in every app.
          </p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">📊</div>
          <h3 class="feature-title">Real-time Analytics</h3>
          <p class="feature-description">
            Monitor your app's performance with built-in analytics and insights.
          </p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">🚀</div>
          <h3 class="feature-title">Scalable Infrastructure</h3>
          <p class="feature-description">
            Your apps automatically scale to handle millions of users.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Features section doesn't need any reactive data or methods
</script>

<style scoped>
/* Features Section */
.features {
  padding: 5rem 0;
  position: relative;
}

.features-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.features-title {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1rem;
}

.features-subtitle {
  font-size: 1.125rem;
  color: var(--text-secondary);
  text-align: center;
  margin-bottom: 3rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.feature-card {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  padding: 2rem;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--primary-500), var(--purple-500));
  transform: scaleX(0);
  transition: transform 0.3s;
}

.feature-card:hover {
  transform: translateY(-4px);
  border-color: var(--border-secondary);
}

.feature-card:hover::before {
  transform: scaleX(1);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.feature-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.feature-description {
  color: var(--text-secondary);
  line-height: 1.6;
}

/* Responsive */
@media (max-width: 1024px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .features-title {
    font-size: 2rem;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .feature-card {
    padding: 1.5rem;
  }
}
</style>