<template>
  <div class="expert-grid">
    <div 
      v-for="expert in experts" 
      :key="expert.id"
      class="expert-card"
      :class="{ active: selectedExpert === expert.id }"
      @click="selectExpert(expert)"
    >
      <div class="expert-image">
        <img 
          v-if="expert.image" 
          :src="expert.image" 
          :alt="expert.name"
        >
        <div v-else class="expert-avatar">{{ expert.emoji }}</div>
      </div>
      
      <div class="expert-info">
        <h3>{{ expert.name }}</h3>
        <p class="expert-role">{{ expert.role }}</p>
        
        <div class="expert-specialties">
          <span 
            v-for="(skill, index) in expert.skills.slice(0, 2)" 
            :key="index"
            class="skill-tag"
          >
            {{ skill }}
          </span>
          <span v-if="expert.skills.length > 2" class="more-skills">
            +{{ expert.skills.length - 2 }}
          </span>
        </div>
        
        <div class="expert-stats">
          <div class="stat">
            <span class="stat-icon">📺</span>
            <span class="stat-value">{{ expert.videoCount || 0 }}</span>
          </div>
          <div class="stat">
            <span class="stat-icon">👥</span>
            <span class="stat-value">{{ formatNumber(expert.subscribers || 0) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

export interface Expert {
  id: string
  name: string
  role: string
  skills: string[]
  emoji?: string
  image?: string
  bio?: string
  youtube?: string
  twitter?: string
  linkedin?: string
  videoCount?: number
  subscribers?: number
  featuredVideos?: Video[]
}

export interface Video {
  id: string
  title: string
  thumbnail: string
  views: string
  duration: string
}

const props = defineProps<{
  experts: Expert[]
  selectedExpert?: string
}>()

const emit = defineEmits<{
  'select-expert': [expert: Expert]
}>()

const selectExpert = (expert: Expert) => {
  emit('select-expert', expert)
}

const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}
</script>

<style scoped>
.expert-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.expert-card {
  background: var(--bg-secondary);
  border: 2px solid var(--border-primary);
  border-radius: 16px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.expert-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--primary-400), var(--teal-400));
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.expert-card:hover {
  border-color: var(--border-secondary);
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.expert-card:hover::before {
  transform: scaleX(1);
}

.expert-card.active {
  border-color: var(--primary-500);
  background: rgba(22, 193, 129, 0.05);
}

.expert-image {
  width: 80px;
  height: 80px;
  margin: 0 auto 1rem;
  border-radius: 50%;
  overflow: hidden;
  background: var(--bg-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.expert-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.expert-avatar {
  font-size: 2.5rem;
}

.expert-info {
  text-align: center;
}

.expert-info h3 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  color: var(--text-primary);
}

.expert-role {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.expert-specialties {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 1rem;
  min-height: 28px;
}

.skill-tag {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  color: var(--text-secondary);
}

.more-skills {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  background: var(--primary-100);
  color: var(--primary-600);
  border-radius: 12px;
  font-weight: 600;
}

.expert-stats {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-primary);
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stat-icon {
  font-size: 1rem;
}

.stat-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .expert-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }
  
  .expert-card {
    padding: 1rem;
  }
  
  .expert-image {
    width: 60px;
    height: 60px;
  }
  
  .expert-avatar {
    font-size: 2rem;
  }
  
  .expert-info h3 {
    font-size: 1rem;
  }
  
  .expert-role {
    font-size: 0.75rem;
  }
  
  .expert-specialties {
    flex-wrap: wrap;
  }
}
</style>