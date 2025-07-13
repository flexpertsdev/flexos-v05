<template>
  <div class="academy-page">
    <!-- Header -->
    <AppHeader title="FlexOS Academy">
      <template #action>
        <a href="#application" class="apply-button">Apply Now</a>
      </template>
    </AppHeader>
    
    <!-- Mobile Navigation -->
    <BottomSheet v-model="menuOpen" />
    
    <!-- Main Content -->
    <main>
      <AcademyHero />
      <CurriculumTimeline />
      <PricingSection />
      <TestimonialsCarousel />
      
      <!-- Application Section -->
      <section id="application" class="application-section">
        <div class="section-content">
          <div class="application-card">
            <h2>Ready to Start Your Journey?</h2>
            <p>Join the next cohort of Flexperts Academy and transform your ideas into reality.</p>
            
            <form @submit.prevent="submitApplication" class="application-form">
              <div class="form-grid">
                <div class="form-group">
                  <label>Full Name</label>
                  <input v-model="application.name" type="text" required />
                </div>
                
                <div class="form-group">
                  <label>Email Address</label>
                  <input v-model="application.email" type="email" required />
                </div>
                
                <div class="form-group">
                  <label>Phone Number</label>
                  <input v-model="application.phone" type="tel" />
                </div>
                
                <div class="form-group">
                  <label>Current Occupation</label>
                  <input v-model="application.occupation" type="text" />
                </div>
              </div>
              
              <div class="form-group full-width">
                <label>What's your app idea?</label>
                <textarea 
                  v-model="application.idea" 
                  rows="4" 
                  placeholder="Tell us about the app you want to build..."
                  required
                ></textarea>
              </div>
              
              <div class="form-group full-width">
                <label>Why do you want to join Flexperts Academy?</label>
                <textarea 
                  v-model="application.motivation" 
                  rows="3" 
                  placeholder="Share your motivation and goals..."
                  required
                ></textarea>
              </div>
              
              <div class="form-group full-width">
                <label>Experience Level</label>
                <div class="radio-group">
                  <label class="radio-label">
                    <input v-model="application.experience" type="radio" value="beginner" required />
                    <span>Complete Beginner</span>
                  </label>
                  <label class="radio-label">
                    <input v-model="application.experience" type="radio" value="some" required />
                    <span>Some Technical Experience</span>
                  </label>
                  <label class="radio-label">
                    <input v-model="application.experience" type="radio" value="developer" required />
                    <span>Developer Looking to Learn No-Code</span>
                  </label>
                </div>
              </div>
              
              <button type="submit" class="submit-button" :disabled="isSubmitting">
                {{ isSubmitting ? 'Submitting...' : 'Submit Application →' }}
              </button>
            </form>
            
            <div v-if="showSuccess" class="success-message">
              <span class="success-icon">✅</span>
              <h3>Application Submitted!</h3>
              <p>We'll review your application and get back to you within 48 hours.</p>
            </div>
          </div>
          
          <div class="faq-section">
            <h3>Frequently Asked Questions</h3>
            
            <div class="faq-item" v-for="(faq, index) in faqs" :key="index">
              <button @click="toggleFaq(index)" class="faq-question">
                {{ faq.question }}
                <svg 
                  class="faq-icon" 
                  :class="{ open: openFaq === index }"
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  stroke-width="2"
                >
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>
              <transition name="expand">
                <div v-if="openFaq === index" class="faq-answer">
                  {{ faq.answer }}
                </div>
              </transition>
            </div>
          </div>
        </div>
      </section>
    </main>
    
    <!-- Footer -->
    <footer class="page-footer">
      <div class="footer-content">
        <p>&copy; 2024 Flexperts Academy. All rights reserved.</p>
        <div class="footer-links">
          <a href="/terms">Terms</a>
          <a href="/privacy">Privacy</a>
          <a href="mailto:academy@flexperts.com">Contact</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useNavigation } from '~/composables/useNavigation'
import AppHeader from '~/components/layout/AppHeader.vue'
import BottomSheet from '~/components/layout/BottomSheet.vue'
import AcademyHero from '~/components/academy/AcademyHero.vue'
import CurriculumTimeline from '~/components/academy/CurriculumTimeline.vue'
import PricingSection from '~/components/academy/PricingSection.vue'
import TestimonialsCarousel from '~/components/academy/TestimonialsCarousel.vue'

const { menuOpen } = useNavigation()

// Application form
const application = ref({
  name: '',
  email: '',
  phone: '',
  occupation: '',
  idea: '',
  motivation: '',
  experience: ''
})

const isSubmitting = ref(false)
const showSuccess = ref(false)

const submitApplication = async () => {
  isSubmitting.value = true
  
  // Simulate API call
  setTimeout(() => {
    isSubmitting.value = false
    showSuccess.value = true
    
    // Reset form after 5 seconds
    setTimeout(() => {
      showSuccess.value = false
      application.value = {
        name: '',
        email: '',
        phone: '',
        occupation: '',
        idea: '',
        motivation: '',
        experience: ''
      }
    }, 5000)
  }, 2000)
}

// FAQ
const openFaq = ref<number | null>(null)

const faqs = [
  {
    question: "Do I need any coding experience?",
    answer: "No! The Flexperts Academy is designed for complete beginners. We'll teach you everything you need to know to build professional apps without writing code."
  },
  {
    question: "How much time do I need to commit?",
    answer: "Plan for 10-15 hours per week over the 12-week program. This includes video lessons, hands-on practice, and coaching sessions."
  },
  {
    question: "What if I can't attend a live session?",
    answer: "All sessions are recorded and available in your student portal. You can also schedule makeup 1-on-1 sessions with your coach."
  },
  {
    question: "Is there a money-back guarantee?",
    answer: "Yes! We offer a 30-day money-back guarantee. If you're not satisfied with the program, get a full refund within the first 30 days."
  },
  {
    question: "What happens after I graduate?",
    answer: "You'll have lifetime access to the course materials, ongoing community support, and can join our alumni network for continued learning and opportunities."
  }
]

const toggleFaq = (index: number) => {
  openFaq.value = openFaq.value === index ? null : index
}
</script>

<style scoped>
.academy-page {
  min-height: 100vh;
  min-height: 100dvh;
  background: var(--bg-primary);
  padding-top: calc(60px + env(safe-area-inset-top, 0)); /* Account for fixed header */
}

/* Header Action Button */
.apply-button {
  padding: 0.5rem 1rem;
  background: var(--primary-500);
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.2s;
  display: inline-block;
}

.apply-button:hover {
  background: var(--primary-600);
  transform: translateY(-2px);
}

/* Application Section */
.application-section {
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

.application-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 20px;
  padding: 3rem;
  position: relative;
}

.application-card h2 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.application-card > p {
  font-size: 1.125rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

/* Form */
.application-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}

.form-group input,
.form-group textarea {
  padding: 0.75rem 1rem;
  background: var(--bg-tertiary);
  border: 2px solid var(--border-primary);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.2s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary-500);
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.radio-label input {
  width: auto;
  margin: 0;
}

.submit-button {
  padding: 1rem 2rem;
  background: var(--primary-500);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-button:hover:not(:disabled) {
  background: var(--primary-600);
  transform: translateY(-2px);
}

.submit-button:disabled {
  background: var(--bg-quaternary);
  color: var(--text-muted);
  cursor: not-allowed;
}

/* Success Message */
.success-message {
  position: absolute;
  inset: 0;
  background: var(--bg-secondary);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 3rem;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.success-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.success-message h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.success-message p {
  color: var(--text-secondary);
}

/* FAQ Section */
.faq-section {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 16px;
  padding: 2rem;
  height: fit-content;
}

.faq-section h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}

.faq-item {
  margin-bottom: 1rem;
}

.faq-question {
  width: 100%;
  text-align: left;
  padding: 1rem;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.faq-question:hover {
  background: var(--bg-quaternary);
}

.faq-icon {
  transition: transform 0.3s;
}

.faq-icon.open {
  transform: rotate(180deg);
}

.faq-answer {
  padding: 1rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

/* Footer */
.page-footer {
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-primary);
  padding: 2rem 0;
  margin-top: 5rem;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-content p {
  color: var(--text-secondary);
  margin: 0;
}

.footer-links {
  display: flex;
  gap: 2rem;
}

.footer-links a {
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: var(--primary-500);
}

/* Transitions */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}

/* Mobile Responsive */
@media (max-width: 1024px) {
  .section-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .academy-page {
    padding-top: calc(56px + env(safe-area-inset-top, 0)); /* Mobile header height */
  }
  
  .apply-button {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .application-card {
    padding: 2rem;
  }
  
  .footer-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>