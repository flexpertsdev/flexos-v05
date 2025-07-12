<template>
  <div class="expert-profile">
    <button @click="$emit('close')" class="close-button">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M6 6l12 12M6 18L18 6"/>
      </svg>
    </button>
    
    <div class="profile-header">
      <div class="profile-image">
        <img 
          v-if="expert.image" 
          :src="expert.image" 
          :alt="expert.name"
        >
        <div v-else class="profile-avatar">{{ expert.emoji }}</div>
      </div>
      
      <div class="profile-info">
        <h1>{{ expert.name }}</h1>
        <p class="profile-role">{{ expert.role }}</p>
        
        <div class="profile-stats">
          <div class="stat-item">
            <span class="stat-number">{{ expert.videoCount || 0 }}</span>
            <span class="stat-label">Videos</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ formatNumber(expert.subscribers || 0) }}</span>
            <span class="stat-label">Subscribers</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ formatNumber(expert.totalViews || 0) }}</span>
            <span class="stat-label">Total Views</span>
          </div>
        </div>
        
        <div class="social-links">
          <a v-if="expert.youtube" :href="expert.youtube" target="_blank" class="social-link youtube">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </a>
          <a v-if="expert.twitter" :href="expert.twitter" target="_blank" class="social-link twitter">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
          </a>
          <a v-if="expert.linkedin" :href="expert.linkedin" target="_blank" class="social-link linkedin">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
    
    <div class="profile-content">
      <div class="bio-section">
        <h2>About</h2>
        <p>{{ expert.bio || 'Passionate about helping businesses build amazing apps without code. Specializing in modern development practices and innovative solutions.' }}</p>
      </div>
      
      <div class="skills-section">
        <h2>Expertise</h2>
        <div class="skills-grid">
          <span 
            v-for="skill in expert.skills" 
            :key="skill"
            class="skill-badge"
          >
            {{ skill }}
          </span>
        </div>
      </div>
      
      <div class="contact-section">
        <h2>Work With {{ expert.name }}</h2>
        <p>Ready to bring your project to life? {{ expert.name }} is available for consultations and development work.</p>
        <button @click="contactExpert" class="contact-button">
          Get in Touch →
        </button>
      </div>
      
      <div class="share-section">
        <p>Share {{ expert.name }}'s profile:</p>
        <input 
          :value="shareUrl" 
          readonly 
          @click="copyToClipboard"
          class="share-input"
        />
        <span v-if="copied" class="copied-message">Copied!</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Expert } from './ExpertGrid.vue'

const props = defineProps<{
  expert: Expert
}>()

const emit = defineEmits<{
  close: []
}>()

const copied = ref(false)

const shareUrl = computed(() => {
  const baseUrl = window.location.origin
  return `${baseUrl}/meet/${props.expert.id}`
})

const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

const contactExpert = () => {
  // In real app, this would open a contact form or redirect to booking page
  window.open(`mailto:${props.expert.id}@flexperts.com?subject=Project Inquiry`)
}

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(shareUrl.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}
</script>

<style scoped>
.expert-profile {
  background: var(--bg-secondary);
  border-radius: 20px;
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--text-secondary);
}

.close-button:hover {
  background: var(--bg-quaternary);
  color: var(--text-primary);
}

.profile-header {
  display: flex;
  gap: 2rem;
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border-primary);
}

.profile-image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  background: var(--bg-tertiary);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-avatar {
  font-size: 4rem;
}

.profile-info {
  flex: 1;
}

.profile-info h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  color: var(--text-primary);
}

.profile-role {
  font-size: 1.125rem;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

.profile-stats {
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-500);
}

.stat-label {
  display: block;
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  width: 40px;
  height: 40px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  color: var(--text-secondary);
}

.social-link:hover {
  transform: translateY(-2px);
  border-color: var(--border-secondary);
}

.social-link.youtube:hover {
  background: #FF0000;
  color: white;
  border-color: #FF0000;
}

.social-link.twitter:hover {
  background: #1DA1F2;
  color: white;
  border-color: #1DA1F2;
}

.social-link.linkedin:hover {
  background: #0077B5;
  color: white;
  border-color: #0077B5;
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.bio-section h2,
.skills-section h2,
.contact-section h2 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.bio-section p,
.contact-section p {
  line-height: 1.7;
  color: var(--text-secondary);
}

.skills-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.skill-badge {
  padding: 0.5rem 1rem;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 20px;
  font-size: 0.875rem;
  color: var(--text-primary);
  transition: all 0.2s;
}

.skill-badge:hover {
  background: var(--primary-100);
  border-color: var(--primary-500);
  color: var(--primary-600);
}

.contact-button {
  margin-top: 1rem;
  padding: 0.75rem 2rem;
  background: var(--primary-500);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.contact-button:hover {
  background: var(--primary-600);
  transform: translateY(-2px);
}

.share-section {
  background: var(--bg-tertiary);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
}

.share-section p {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 0.75rem;
}

.share-input {
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--bg-secondary);
  border: 2px solid var(--border-primary);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 0.875rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.share-input:hover {
  border-color: var(--primary-500);
}

.copied-message {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: var(--green-500);
  font-weight: 600;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .expert-profile {
    padding: 1.5rem;
  }
  
  .profile-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .profile-stats {
    justify-content: center;
  }
  
  .social-links {
    justify-content: center;
  }
}
</style>