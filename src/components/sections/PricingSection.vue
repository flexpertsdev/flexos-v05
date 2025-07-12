<template>
  <section id="pricing" class="pricing">
    <div class="pricing-content">
      <div class="pricing-header">
        <h2 class="pricing-title">Simple, Transparent Pricing</h2>
        <p class="pricing-subtitle">
          Start free, upgrade when you're ready. No surprises.
        </p>
      </div>
      
      <div class="pricing-grid">
        <!-- Free Tier -->
        <div class="pricing-card">
          <div class="card-header">
            <h3 class="card-title">Starter</h3>
            <div class="card-price">
              <span class="price-currency">$</span>
              <span class="price-amount">0</span>
              <span class="price-period">/forever</span>
            </div>
            <p class="card-description">Perfect for trying out FlexOS</p>
          </div>
          
          <ul class="card-features">
            <li>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
              <span>1 Project</span>
            </li>
            <li>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
              <span>AI-powered development</span>
            </li>
            <li>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
              <span>Export to GitHub</span>
            </li>
            <li>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
              <span>Community support</span>
            </li>
            <li>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
              <span>Starter templates</span>
            </li>
          </ul>
          
          <button class="card-cta card-cta-secondary">
            Start Building Free
          </button>
        </div>
        
        <!-- Growth Tier -->
        <div class="pricing-card featured">
          <div class="featured-badge">Most Popular</div>
          <div class="card-header">
            <h3 class="card-title">Growth</h3>
            <div class="card-price">
              <span class="price-currency">$</span>
              <span class="price-amount">11.11</span>
              <span class="price-period">/month</span>
            </div>
            <p class="card-description">For serious builders</p>
          </div>
          
          <ul class="card-features">
            <li>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
              <span>Up to 5 Projects</span>
            </li>
            <li>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
              <span>Priority AI processing</span>
            </li>
            <li>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
              <span>Advanced components</span>
            </li>
            <li>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
              <span>Email support</span>
            </li>
            <li>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
              <span>Custom domains</span>
            </li>
          </ul>
          
          <button class="card-cta card-cta-primary">
            Upgrade to Growth
          </button>
        </div>
        
        <!-- Unlimited Tier -->
        <div class="pricing-card">
          <div class="card-header">
            <h3 class="card-title">Unlimited</h3>
            <div class="card-price">
              <span class="price-currency">$</span>
              <span class="price-amount">29.99</span>
              <span class="price-period">/month</span>
            </div>
            <p class="card-description">For teams and agencies</p>
          </div>
          
          <ul class="card-features">
            <li>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
              <span>Unlimited Projects</span>
            </li>
            <li>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
              <span>Team collaboration</span>
            </li>
            <li>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
              <span>White-label options</span>
            </li>
            <li>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
              <span>Priority support</span>
            </li>
            <li>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
              <span>API access</span>
            </li>
          </ul>
          
          <button class="card-cta card-cta-secondary">
            Go Unlimited
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Pricing section doesn't need any reactive data or methods
</script>

<style scoped>
/* Pricing Section */
.pricing {
  padding: 5rem 0;
  background: var(--bg-secondary);
}

.pricing-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.pricing-header {
  text-align: center;
  margin-bottom: 3rem;
}

.pricing-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, var(--text-primary) 0%, var(--primary-400) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.pricing-subtitle {
  font-size: 1.125rem;
  color: var(--text-secondary);
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  align-items: stretch;
}

.pricing-card {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 16px;
  padding: 2rem;
  position: relative;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.pricing-card:hover {
  transform: translateY(-4px);
  border-color: var(--border-secondary);
}

.pricing-card.featured {
  border-color: var(--primary-500);
  transform: scale(1.05);
}

.pricing-card.featured:hover {
  transform: scale(1.05) translateY(-4px);
}

.featured-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--primary-500);
  color: white;
  padding: 0.25rem 1rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.card-header {
  text-align: center;
  margin-bottom: 2rem;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.card-price {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
}

.price-currency {
  font-size: 1.25rem;
  color: var(--text-secondary);
}

.price-amount {
  font-size: 3rem;
  font-weight: 700;
  color: var(--text-primary);
}

.price-period {
  font-size: 1rem;
  color: var(--text-secondary);
}

.card-description {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.card-features {
  list-style: none;
  padding: 0;
  margin: 0 0 2rem 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
}

.card-features li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.card-features svg {
  color: var(--primary-500);
  flex-shrink: 0;
}

.card-cta {
  width: 100%;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  margin-top: auto;
}

.card-cta-primary {
  background: var(--primary-500);
  color: white;
}

.card-cta-primary:hover {
  background: var(--primary-600);
  transform: translateY(-2px);
}

.card-cta-secondary {
  background: transparent;
  color: var(--text-primary);
  border: 2px solid var(--border-secondary);
}

.card-cta-secondary:hover {
  border-color: var(--primary-500);
  color: var(--primary-500);
}

/* Responsive */
@media (max-width: 768px) {
  .pricing-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  .pricing-card.featured {
    transform: scale(1);
  }
}
</style>