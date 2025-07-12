<template>
  <div class="flexfluencer-magic">
    <div class="magic-content">
      <!-- Platforms Phase -->
      <transition name="fade">
        <div v-if="currentPhase === 'platforms'" class="phase-content platforms">
          <h3>Select Your Platforms</h3>
          <div class="platform-showcase">
            <div 
              v-for="platform in platformShowcase" 
              :key="platform.id"
              class="platform-display"
              :class="{ active: activePlatform === platform.id }"
            >
              <div class="platform-logo">{{ platform.icon }}</div>
              <h4>{{ platform.name }}</h4>
              <div class="platform-stats">
                <div class="stat">
                  <span class="number">{{ platform.creators }}</span>
                  <span class="label">Active Creators</span>
                </div>
                <div class="stat">
                  <span class="number">{{ platform.commission }}%</span>
                  <span class="label">Commission Rate</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
      
      <!-- Audience Phase -->
      <transition name="fade">
        <div v-if="currentPhase === 'audience'" class="phase-content audience">
          <h3>Your Audience Reach</h3>
          <div class="audience-visualization">
            <div class="total-reach">
              <div class="reach-number">{{ animatedReach.toLocaleString() }}</div>
              <div class="reach-label">Total Followers</div>
            </div>
            <div class="reach-breakdown">
              <div 
                v-for="(data, platform) in audienceBreakdown" 
                :key="platform"
                class="platform-bar"
              >
                <div class="bar-label">
                  <span>{{ platform }}</span>
                  <span>{{ data.count.toLocaleString() }}</span>
                </div>
                <div class="bar-container">
                  <div 
                    class="bar-fill"
                    :style="{ width: data.percentage + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <div class="earning-potential">
            <h4>💰 Earning Potential</h4>
            <p>With your reach, you could earn:</p>
            <div class="potential-earnings">
              <span class="currency">$</span>
              <span class="amount">{{ potentialEarnings.toLocaleString() }}</span>
              <span class="period">/month</span>
            </div>
          </div>
        </div>
      </transition>
      
      <!-- Content Phase -->
      <transition name="fade">
        <div v-if="currentPhase === 'content'" class="phase-content content">
          <h3>Content Strategy</h3>
          <div class="content-types">
            <div 
              v-for="content in contentStrategy" 
              :key="content.type"
              class="content-card"
              :class="{ selected: selectedContentTypes.includes(content.type) }"
            >
              <div class="content-icon">{{ content.icon }}</div>
              <h4>{{ content.name }}</h4>
              <p>{{ content.description }}</p>
              <div class="content-examples">
                <span v-for="example in content.examples" :key="example" class="example-tag">
                  {{ example }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </transition>
      
      <!-- Products Phase -->
      <transition name="fade">
        <div v-if="currentPhase === 'products'" class="phase-content products">
          <h3>Partnership Opportunities</h3>
          <div class="products-showcase">
            <div 
              v-for="product in productsDetail" 
              :key="product.id"
              class="product-showcase"
            >
              <div class="product-header">
                <h4>{{ product.name }}</h4>
                <span class="commission-badge">{{ product.commission }}% Commission</span>
              </div>
              <p>{{ product.description }}</p>
              <div class="product-benefits">
                <div v-for="benefit in product.benefits" :key="benefit" class="benefit">
                  <span class="benefit-icon">✓</span>
                  {{ benefit }}
                </div>
              </div>
              <div class="expected-earnings">
                <span class="label">Expected monthly earnings:</span>
                <span class="amount">${{ product.expectedEarnings }}</span>
              </div>
            </div>
          </div>
        </div>
      </transition>
      
      <!-- Video Phase -->
      <transition name="fade">
        <div v-if="currentPhase === 'video'" class="phase-content video">
          <h3>Video Guidelines</h3>
          <div class="video-tips">
            <div class="tip-card">
              <div class="tip-icon">🎥</div>
              <h4>Keep it Authentic</h4>
              <p>Be yourself! We want to see your personality shine through.</p>
            </div>
            <div class="tip-card">
              <div class="tip-icon">⏱️</div>
              <h4>1-3 Minutes</h4>
              <p>Short and sweet. Tell us why you're excited about Flexperts.</p>
            </div>
            <div class="tip-card">
              <div class="tip-icon">💡</div>
              <h4>Good Lighting</h4>
              <p>Natural light works great. Make sure we can see you clearly.</p>
            </div>
            <div class="tip-card">
              <div class="tip-icon">🎯</div>
              <h4>Be Specific</h4>
              <p>Share your content plans and how you'll promote our products.</p>
            </div>
          </div>
          <div class="sample-script">
            <h4>Sample Talking Points</h4>
            <ul>
              <li>Introduce yourself and your content niche</li>
              <li>Share why you're passionate about no-code tools</li>
              <li>Explain how you'll integrate Flexperts into your content</li>
              <li>Mention any relevant experience or achievements</li>
            </ul>
          </div>
        </div>
      </transition>
      
      <!-- Complete Phase -->
      <transition name="fade">
        <div v-if="currentPhase === 'complete'" class="phase-content complete">
          <div class="success-animation">
            <div class="confetti">
              <span v-for="i in 20" :key="i" class="confetti-piece"></span>
            </div>
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="var(--green-500)" stroke-width="4" class="check-circle"/>
              <path d="M40 60 L55 75 L80 45" fill="none" stroke="var(--green-500)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" class="check-path"/>
            </svg>
          </div>
          
          <h3>Application Submitted! 🎉</h3>
          <p>You're one step closer to becoming a Flexfluencer!</p>
          
          <div class="next-steps">
            <h4>What Happens Next?</h4>
            <div class="step">
              <span class="step-number">1</span>
              <div class="step-content">
                <h5>Application Review</h5>
                <p>Our team will review your application within 48 hours</p>
              </div>
            </div>
            <div class="step">
              <span class="step-number">2</span>
              <div class="step-content">
                <h5>Welcome Package</h5>
                <p>Approved partners receive access to resources and materials</p>
              </div>
            </div>
            <div class="step">
              <span class="step-number">3</span>
              <div class="step-content">
                <h5>Start Earning</h5>
                <p>Begin creating content and earning commissions immediately</p>
              </div>
            </div>
          </div>
          
          <div class="cta-buttons">
            <button class="btn-primary">Explore Products</button>
            <button class="btn-secondary">Join Community</button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

const props = defineProps<{
  currentPhase: string
}>()

// Data
const activePlatform = ref('youtube')
const animatedReach = ref(0)
const selectedContentTypes = ref<string[]>([])

const platformShowcase = [
  { id: 'youtube', name: 'YouTube', icon: '📺', creators: '2M+', commission: 30 },
  { id: 'tiktok', name: 'TikTok', icon: '🎵', creators: '5M+', commission: 25 },
  { id: 'instagram', name: 'Instagram', icon: '📷', creators: '3M+', commission: 25 }
]

const audienceBreakdown = ref({
  YouTube: { count: 50000, percentage: 45 },
  TikTok: { count: 30000, percentage: 27 },
  Instagram: { count: 25000, percentage: 23 },
  Twitter: { count: 5000, percentage: 5 }
})

const contentStrategy = [
  {
    type: 'tutorials',
    name: 'Tech Tutorials',
    icon: '🎓',
    description: 'Step-by-step guides and how-tos',
    examples: ['App building', 'No-code basics', 'Tool reviews']
  },
  {
    type: 'reviews',
    name: 'Product Reviews',
    icon: '⭐',
    description: 'In-depth analysis and comparisons',
    examples: ['Feature demos', 'Pros & cons', 'Use cases']
  },
  {
    type: 'business',
    name: 'Business Content',
    icon: '💼',
    description: 'Entrepreneurship and growth',
    examples: ['Success stories', 'Tips & tricks', 'Case studies']
  }
]

const productsDetail = [
  {
    id: 'flexos',
    name: 'FlexOS Builder',
    commission: 30,
    description: 'AI-powered app builder that anyone can use',
    benefits: [
      'High conversion rates',
      'Recurring commissions',
      'Marketing materials provided'
    ],
    expectedEarnings: '2,500-5,000'
  },
  {
    id: 'academy',
    name: 'Flexperts Academy',
    commission: 25,
    description: '12-week comprehensive training program',
    benefits: [
      '$900 per sale',
      'Long-term student relationships',
      'Exclusive partner bonuses'
    ],
    expectedEarnings: '3,000-7,000'
  }
]

// Computed
const potentialEarnings = computed(() => {
  const totalReach = Object.values(audienceBreakdown.value)
    .reduce((sum, data) => sum + data.count, 0)
  return Math.round(totalReach * 0.001 * 30) // Rough estimate
})

// Watchers
watch(() => props.currentPhase, (phase) => {
  if (phase === 'audience') {
    animateReachCounter()
  }
})

// Platform rotation
onMounted(() => {
  setInterval(() => {
    const platforms = platformShowcase.map(p => p.id)
    const currentIndex = platforms.indexOf(activePlatform.value)
    activePlatform.value = platforms[(currentIndex + 1) % platforms.length]
  }, 2000)
})

// Methods
const animateReachCounter = () => {
  const target = Object.values(audienceBreakdown.value)
    .reduce((sum, data) => sum + data.count, 0)
  const increment = target / 50
  const timer = setInterval(() => {
    if (animatedReach.value < target) {
      animatedReach.value = Math.min(animatedReach.value + increment, target)
    } else {
      clearInterval(timer)
    }
  }, 30)
}
</script>

<style scoped>
.flexfluencer-magic {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: var(--bg-primary);
  position: relative;
  overflow: hidden;
}

.magic-content {
  width: 100%;
  max-width: 800px;
}

.phase-content {
  text-align: center;
}

.phase-content h3 {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: var(--text-primary);
}

/* Platforms Phase */
.platform-showcase {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.platform-display {
  background: var(--bg-secondary);
  border: 2px solid var(--border-primary);
  border-radius: 12px;
  padding: 2rem 1rem;
  transition: all 0.3s;
  opacity: 0.6;
}

.platform-display.active {
  opacity: 1;
  border-color: var(--primary-500);
  transform: scale(1.05);
  box-shadow: 0 10px 30px rgba(22, 193, 129, 0.2);
}

.platform-logo {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.platform-display h4 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.platform-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.platform-stats .stat {
  text-align: center;
}

.platform-stats .number {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-500);
}

.platform-stats .label {
  display: block;
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
}

/* Audience Phase */
.audience-visualization {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
}

.total-reach {
  margin-bottom: 2rem;
}

.reach-number {
  font-size: 3.5rem;
  font-weight: 700;
  color: var(--primary-500);
  line-height: 1;
}

.reach-label {
  font-size: 1.125rem;
  color: var(--text-secondary);
  margin-top: 0.5rem;
}

.reach-breakdown {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.platform-bar {
  text-align: left;
}

.bar-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.bar-container {
  height: 24px;
  background: var(--bg-tertiary);
  border-radius: 12px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-400), var(--primary-600));
  border-radius: 12px;
  transition: width 1s ease-out;
}

.earning-potential {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  padding: 1.5rem;
}

.earning-potential h4 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.earning-potential p {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.potential-earnings {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--green-500);
}

.potential-earnings .currency {
  font-size: 1.5rem;
  vertical-align: super;
}

.potential-earnings .period {
  font-size: 1rem;
  color: var(--text-secondary);
}

/* Content Phase */
.content-types {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.content-card {
  background: var(--bg-secondary);
  border: 2px solid var(--border-primary);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s;
}

.content-card:hover {
  border-color: var(--border-secondary);
  transform: translateY(-4px);
}

.content-card.selected {
  border-color: var(--primary-500);
  background: rgba(22, 193, 129, 0.05);
}

.content-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.content-card h4 {
  font-size: 1.125rem;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.content-card p {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.content-examples {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
}

.example-tag {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  background: var(--bg-tertiary);
  border-radius: 12px;
  color: var(--text-tertiary);
}

/* Products Phase */
.products-showcase {
  display: grid;
  gap: 1.5rem;
}

.product-showcase {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  padding: 2rem;
  text-align: left;
}

.product-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.product-header h4 {
  font-size: 1.25rem;
  color: var(--text-primary);
}

.commission-badge {
  background: var(--primary-100);
  color: var(--primary-600);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

.product-showcase p {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

.product-benefits {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.benefit {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.benefit-icon {
  color: var(--green-500);
  font-weight: 700;
}

.expected-earnings {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid var(--border-primary);
}

.expected-earnings .label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.expected-earnings .amount {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--green-500);
}

/* Video Phase */
.video-tips {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.tip-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
}

.tip-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.tip-card h4 {
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.tip-card p {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.sample-script {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  padding: 2rem;
  text-align: left;
}

.sample-script h4 {
  font-size: 1.125rem;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.sample-script ul {
  list-style: none;
  padding: 0;
}

.sample-script li {
  position: relative;
  padding-left: 1.5rem;
  margin-bottom: 0.75rem;
  color: var(--text-secondary);
}

.sample-script li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--primary-500);
  font-weight: 700;
}

/* Complete Phase */
.success-animation {
  position: relative;
  margin-bottom: 2rem;
}

.confetti {
  position: absolute;
  inset: -50%;
  pointer-events: none;
}

.confetti-piece {
  position: absolute;
  width: 10px;
  height: 10px;
  background: var(--primary-500);
  animation: confetti-fall 3s ease-out infinite;
}

.confetti-piece:nth-child(even) {
  background: var(--teal-400);
  animation-delay: 0.5s;
}

.confetti-piece:nth-child(3n) {
  background: var(--purple-400);
  animation-delay: 1s;
}

@keyframes confetti-fall {
  0% {
    transform: translateY(-100%) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(200vh) rotate(720deg);
    opacity: 0;
  }
}

.check-circle {
  stroke-dasharray: 314;
  stroke-dashoffset: 314;
  animation: drawCircle 0.8s ease-out forwards;
}

.check-path {
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation: drawCheck 0.5s ease-out 0.8s forwards;
}

@keyframes drawCircle {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes drawCheck {
  to {
    stroke-dashoffset: 0;
  }
}

.next-steps {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  padding: 2rem;
  margin: 2rem 0;
  text-align: left;
}

.next-steps h4 {
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  text-align: center;
  color: var(--text-primary);
}

.step {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.step:last-child {
  margin-bottom: 0;
}

.step-number {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  background: var(--primary-500);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.step-content h5 {
  font-size: 1rem;
  margin-bottom: 0.25rem;
  color: var(--text-primary);
}

.step-content p {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: var(--primary-500);
  color: white;
}

.btn-primary:hover {
  background: var(--primary-600);
  transform: translateY(-1px);
}

.btn-secondary {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: 2px solid var(--border-primary);
}

.btn-secondary:hover {
  background: var(--bg-quaternary);
}

/* Fade Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .platform-showcase {
    grid-template-columns: 1fr;
  }
  
  .content-types {
    grid-template-columns: 1fr;
  }
  
  .video-tips {
    grid-template-columns: 1fr;
  }
  
  .cta-buttons {
    flex-direction: column;
    width: 100%;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
}
</style>