<template>
  <section class="website-refresh">
    <div class="refresh-content">
      <div class="refresh-header">
        <div class="eu-badge">
          <span class="badge-icon">⚠️</span>
          <span class="badge-text">EU Accessibility Deadline: June 2025</span>
        </div>
        <h2 class="refresh-title">Time to Refresh Your Website?</h2>
        <p class="refresh-subtitle">
          Transform your outdated site into a modern, accessible, lightning-fast experience
        </p>
      </div>
      
      <div class="refresh-input-area">
        <input 
          type="url" 
          v-model="websiteUrl" 
          placeholder="Enter your current website URL..."
          class="refresh-input"
          @keypress.enter="startWebsiteRefresh"
        >
        <button class="refresh-button" @click="startWebsiteRefresh">
          Analyze My Site
        </button>
      </div>
      
      <div class="refresh-benefits">
        <div class="benefit-card">
          <div class="benefit-icon">♿</div>
          <h4>WCAG Compliant</h4>
          <p>Meet EU accessibility requirements</p>
        </div>
        <div class="benefit-card">
          <div class="benefit-icon">📱</div>
          <h4>Mobile-First</h4>
          <p>Perfect on every device</p>
        </div>
        <div class="benefit-card">
          <div class="benefit-icon">⚡</div>
          <h4>Lightning Fast</h4>
          <p>Core Web Vitals optimized</p>
        </div>
        <div class="benefit-card">
          <div class="benefit-icon">🎨</div>
          <h4>Modern Design</h4>
          <p>Fresh look, better UX</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const websiteUrl = ref('')

const startWebsiteRefresh = () => {
  if (!websiteUrl.value) {
    alert('Please enter your website URL')
    return
  }
  // Navigate to wizard with website refresh flow
  window.location.href = `/wizard/refresh?url=${encodeURIComponent(websiteUrl.value)}`
}
</script>

<style scoped>
/* Website Refresh Section */
.website-refresh {
  padding: 5rem 0;
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-primary);
  position: relative;
  overflow: hidden;
}

.website-refresh::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(22, 193, 129, 0.05) 0%, transparent 70%);
  pointer-events: none;
}

.refresh-content {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 2rem;
  text-align: center;
  position: relative;
  z-index: 1;
}

.refresh-header {
  margin-bottom: 3rem;
}

.eu-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-radius: 30px;
  padding: 0.5rem 1rem;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  color: var(--amber-400);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}

.badge-icon {
  font-size: 1.125rem;
}

.refresh-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, var(--text-primary) 0%, var(--primary-400) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.refresh-subtitle {
  font-size: 1.125rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

/* Input Area */
.refresh-input-area {
  display: flex;
  gap: 1rem;
  max-width: 600px;
  margin: 0 auto 3rem;
}

.refresh-input {
  flex: 1;
  padding: 1rem 1.5rem;
  background: var(--bg-tertiary);
  border: 2px solid var(--border-primary);
  border-radius: 12px;
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.3s ease;
  outline: none;
}

.refresh-input::placeholder {
  color: var(--text-tertiary);
}

.refresh-input:focus {
  border-color: var(--primary-500);
  background: var(--bg-quaternary);
}

.refresh-button {
  padding: 1rem 2rem;
  background: var(--primary-500);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.refresh-button:hover {
  background: var(--primary-600);
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(22, 193, 129, 0.3);
}

/* Benefits Grid */
.refresh-benefits {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.benefit-card {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  padding: 2rem 1.5rem;
  transition: all 0.3s ease;
  text-align: center;
}

.benefit-card:hover {
  transform: translateY(-4px);
  border-color: var(--border-secondary);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.benefit-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  display: block;
}

.benefit-card h4 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.benefit-card p {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

/* Responsive */
@media (max-width: 768px) {
  .refresh-title {
    font-size: 2rem;
  }
  
  .refresh-subtitle {
    font-size: 1rem;
  }
  
  .refresh-input-area {
    flex-direction: column;
  }
  
  .refresh-button {
    width: 100%;
  }
  
  .refresh-benefits {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  .benefit-card {
    padding: 1.5rem 1rem;
  }
  
  .benefit-icon {
    font-size: 2rem;
  }
  
  .benefit-card h4 {
    font-size: 1rem;
  }
  
  .benefit-card p {
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .refresh-benefits {
    grid-template-columns: 1fr;
  }
}
</style>