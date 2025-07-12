<template>
  <section class="pricing-section">
    <div class="section-content">
      <div class="pricing-card">
        <div class="price-header">
          <h2>Investment in Your Future</h2>
          <div class="price-tag">
            <span class="currency">$</span>
            <span class="amount">3,600</span>
            <span class="period">one-time</span>
          </div>
          <p class="price-note">Payment plans available</p>
        </div>
        
        <div class="included-features">
          <h3>Everything Included</h3>
          <div class="features-grid">
            <div class="feature">
              <span class="feature-icon">👥</span>
              <div class="feature-content">
                <h4>12 Hours 1-on-1 Coaching</h4>
                <p>Personalized guidance from expert developers</p>
              </div>
            </div>
            <div class="feature">
              <span class="feature-icon">🎯</span>
              <div class="feature-content">
                <h4>6 Hours Group Sessions</h4>
                <p>Learn with peers and share experiences</p>
              </div>
            </div>
            <div class="feature">
              <span class="feature-icon">📚</span>
              <div class="feature-content">
                <h4>On-Demand Video Library</h4>
                <p>Lifetime access to all course materials</p>
              </div>
            </div>
            <div class="feature">
              <span class="feature-icon">💻</span>
              <div class="feature-content">
                <h4>Online Workspace</h4>
                <p>Interactive worksheets and resources</p>
              </div>
            </div>
            <div class="feature">
              <span class="feature-icon">🚀</span>
              <div class="feature-content">
                <h4>Launch Your Own App</h4>
                <p>Graduate with a live app in stores</p>
              </div>
            </div>
            <div class="feature">
              <span class="feature-icon">🏆</span>
              <div class="feature-content">
                <h4>Certificate & Portfolio</h4>
                <p>Showcase your new skills</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="payment-options">
          <h3>Flexible Payment Options</h3>
          <div class="options-grid">
            <label class="payment-option">
              <input type="radio" name="payment" value="full" checked />
              <div class="option-content">
                <h4>Pay in Full</h4>
                <p>$3,600 - Save $200</p>
                <span class="badge">Best Value</span>
              </div>
            </label>
            <label class="payment-option">
              <input type="radio" name="payment" value="split" />
              <div class="option-content">
                <h4>2 Payments</h4>
                <p>$1,900 × 2</p>
              </div>
            </label>
            <label class="payment-option">
              <input type="radio" name="payment" value="monthly" />
              <div class="option-content">
                <h4>Monthly Plan</h4>
                <p>$650 × 6</p>
              </div>
            </label>
          </div>
        </div>
        
        <div class="guarantee">
          <span class="guarantee-icon">🛡️</span>
          <div>
            <h4>30-Day Money Back Guarantee</h4>
            <p>Not satisfied? Get a full refund within the first 30 days</p>
          </div>
        </div>
        
        <div class="cta-section">
          <button @click="scrollToApplication" class="apply-button">
            Secure Your Spot →
          </button>
          <p class="spots-remaining">Only <strong>8 spots</strong> remaining for next cohort</p>
        </div>
      </div>
      
      <div class="roi-calculator">
        <h3>Calculate Your ROI</h3>
        <div class="calculator-content">
          <div class="input-group">
            <label>Apps you plan to build</label>
            <input v-model.number="appsCount" type="number" min="1" max="10" />
          </div>
          <div class="input-group">
            <label>Average app revenue/month</label>
            <input v-model.number="avgRevenue" type="number" min="100" step="100" />
          </div>
          
          <div class="roi-result">
            <p class="roi-label">Potential yearly revenue</p>
            <p class="roi-amount">${{ (appsCount * avgRevenue * 12).toLocaleString() }}</p>
            <p class="roi-payback">{{ paybackPeriod }} payback</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const appsCount = ref(2)
const avgRevenue = ref(1000)

const paybackPeriod = computed(() => {
  const monthlyRevenue = appsCount.value * avgRevenue.value
  const months = Math.ceil(3600 / monthlyRevenue)
  
  if (months <= 1) return 'Immediate'
  if (months <= 3) return `${months} months`
  return `${months} months`
})

const scrollToApplication = () => {
  const element = document.getElementById('application')
  element?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style scoped>
.pricing-section {
  padding: 5rem 0;
  background: var(--bg-primary);
}

.section-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;
}

/* Pricing Card */
.pricing-card {
  background: var(--bg-secondary);
  border: 2px solid var(--border-primary);
  border-radius: 20px;
  padding: 3rem;
  position: relative;
  overflow: hidden;
}

.pricing-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--primary-400), var(--teal-400), var(--purple-400));
}

.price-header {
  text-align: center;
  margin-bottom: 3rem;
}

.price-header h2 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}

.price-tag {
  font-size: 3rem;
  font-weight: 700;
  color: var(--primary-500);
  margin-bottom: 0.5rem;
}

.currency {
  font-size: 1.5rem;
  vertical-align: super;
}

.period {
  font-size: 1rem;
  color: var(--text-secondary);
  margin-left: 0.5rem;
}

.price-note {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

/* Included Features */
.included-features {
  margin-bottom: 3rem;
}

.included-features h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.feature {
  display: flex;
  gap: 1rem;
}

.feature-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.feature-content h4 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: var(--text-primary);
}

.feature-content p {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
}

/* Payment Options */
.payment-options {
  margin-bottom: 2rem;
}

.payment-options h3 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.payment-option {
  cursor: pointer;
}

.payment-option input {
  display: none;
}

.option-content {
  background: var(--bg-tertiary);
  border: 2px solid var(--border-primary);
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
}

.payment-option input:checked + .option-content {
  border-color: var(--primary-500);
  background: rgba(22, 193, 129, 0.05);
}

.option-content h4 {
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: var(--text-primary);
}

.option-content p {
  font-size: 1rem;
  font-weight: 700;
  color: var(--primary-500);
  margin: 0;
}

.badge {
  position: absolute;
  top: -10px;
  right: -10px;
  background: var(--primary-500);
  color: white;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-weight: 600;
}

/* Guarantee */
.guarantee {
  display: flex;
  gap: 1rem;
  background: var(--bg-tertiary);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.guarantee-icon {
  font-size: 2rem;
}

.guarantee h4 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: var(--text-primary);
}

.guarantee p {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
}

/* CTA Section */
.cta-section {
  text-align: center;
}

.apply-button {
  width: 100%;
  padding: 1.25rem 2rem;
  background: var(--primary-500);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.125rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.apply-button:hover {
  background: var(--primary-600);
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(22, 193, 129, 0.3);
}

.spots-remaining {
  margin-top: 1rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.spots-remaining strong {
  color: var(--red-500);
}

/* ROI Calculator */
.roi-calculator {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 16px;
  padding: 2rem;
  height: fit-content;
}

.roi-calculator h3 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}

.input-group {
  margin-bottom: 1.5rem;
}

.input-group label {
  display: block;
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.input-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--bg-tertiary);
  border: 2px solid var(--border-primary);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.2s;
}

.input-group input:focus {
  outline: none;
  border-color: var(--primary-500);
}

.roi-result {
  background: var(--bg-tertiary);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
}

.roi-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.roi-amount {
  font-size: 2rem;
  font-weight: 700;
  color: var(--green-500);
  margin: 0 0 0.5rem 0;
}

.roi-payback {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
}

/* Mobile Responsive */
@media (max-width: 1024px) {
  .section-content {
    grid-template-columns: 1fr;
  }
  
  .roi-calculator {
    order: -1;
  }
}

@media (max-width: 768px) {
  .pricing-card {
    padding: 2rem;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .options-grid {
    grid-template-columns: 1fr;
  }
}
</style>