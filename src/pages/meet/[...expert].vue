<template>
  <div class="meet-page">
    <!-- Header -->
    <header class="page-header">
      <div class="header-content">
        <nuxt-link to="/" class="back-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Home
        </nuxt-link>
        
        <h1 class="page-title">Meet the Flexperts</h1>
        
        <nuxt-link to="/academy" class="earn-button">
          💰 Earn as a Flexpert
        </nuxt-link>
      </div>
    </header>
    
    <!-- Main Content -->
    <main class="main-content">
      <div class="content-wrapper">
        <!-- Expert Grid or Profile -->
        <transition name="fade" mode="out-in">
          <div v-if="!selectedExpert" key="grid">
            <p class="intro-text">
              Our team of expert developers and content creators are here to help you succeed. 
              Each Flexpert brings unique skills and experience to help you build amazing applications.
            </p>
            
            <ExpertGrid 
              :experts="experts"
              :selected-expert="selectedExpertId || undefined"
              @select-expert="selectExpert"
            />
          </div>
          
          <div v-else key="profile">
            <ExpertProfile 
              :expert="selectedExpert"
              @close="closeProfile"
            />
            
            <YouTubeShowcase 
              v-if="selectedExpert.featuredVideos?.length"
              :videos="selectedExpert.featuredVideos"
              :youtube-channel="selectedExpert.youtube"
            />
          </div>
        </transition>
      </div>
    </main>
    
    <!-- Mobile Navigation -->
    <nav v-if="selectedExpert" class="mobile-nav">
      <button @click="closeProfile" class="nav-button">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        All Experts
      </button>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ExpertGrid from '@/components/meet/ExpertGrid.vue'
import ExpertProfile from '@/components/meet/ExpertProfile.vue'
import YouTubeShowcase from '@/components/meet/YouTubeShowcase.vue'
import type { Expert } from '@/components/meet/ExpertGrid.vue'
// Import images using Nuxt assets
import josImage from '@/assets/images/flexperts/jos.png'
import dimitarImage from '@/assets/images/flexperts/dimitar.png'
import bellaImage from '@/assets/images/flexperts/bella.png'
import rosieImage from '@/assets/images/flexperts/rosie.png'
import satoshiImage from '@/assets/images/flexperts/satoshi.png'

const route = useRoute()
const router = useRouter()

// Expert data
const experts = ref<Expert[]>([
  {
    id: 'jos',
    name: 'Jos',
    role: 'Founder & CEO',
    skills: ['Strategy', 'Product Vision', 'Leadership', 'Flutter', 'AI Integration'],
    emoji: '👨‍💼',
    image: josImage,
    bio: 'Founder of Flexperts with a vision to democratize app development. Passionate about helping entrepreneurs and businesses build amazing products without traditional coding barriers.',
    youtube: 'https://youtube.com/@flexperts',
    twitter: 'https://twitter.com/flexpertsdev',
    linkedin: 'https://linkedin.com/company/flexperts',
    videoCount: 45,
    subscribers: 15000,
    totalViews: 250000,
    featuredVideos: [
      {
        id: 'dQw4w9WgXcQ',
        title: 'Building Your First App with FlexOS - Complete Tutorial',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        views: '12K',
        duration: '15:42',
        publishedAt: '2 weeks ago'
      },
      {
        id: 'dQw4w9WgXcQ',
        title: 'No-Code vs Traditional Development: What You Need to Know',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        views: '8.5K',
        duration: '10:23',
        publishedAt: '1 month ago'
      }
    ]
  },
  {
    id: 'john',
    name: 'John',
    role: 'UX Design Lead',
    skills: ['UI/UX', 'Figma', 'User Research', 'Design Systems', 'Prototyping'],
    emoji: '🎨',
    image: bellaImage,
    bio: 'UX designer with 10+ years of experience creating intuitive and beautiful user interfaces. Specializes in converting complex requirements into simple, elegant solutions.',
    twitter: 'https://twitter.com/johnuxdesign',
    videoCount: 28,
    subscribers: 8500,
    totalViews: 120000
  },
  {
    id: 'izunna',
    name: 'Izunna',
    role: 'E-commerce Specialist',
    skills: ['Shopify', 'WooCommerce', 'Payment Systems', 'Conversion Optimization', 'Analytics'],
    emoji: '🛍️',
    image: rosieImage,
    bio: 'E-commerce expert helping businesses scale their online presence. Specialized in creating high-converting stores and implementing advanced e-commerce strategies.',
    youtube: 'https://youtube.com/@izunnaecommerce',
    videoCount: 52,
    subscribers: 22000,
    totalViews: 450000
  },
  {
    id: 'dimitar',
    name: 'Dimitar',
    role: 'Backend Architect',
    skills: ['PHP', 'APIs', 'Database Design', 'Cloud Architecture', 'Security'],
    emoji: '🔧',
    image: dimitarImage,
    bio: 'Backend specialist with expertise in building scalable, secure applications. Passionate about clean code and robust architecture that stands the test of time.',
    linkedin: 'https://linkedin.com/in/dimitar-backend',
    videoCount: 18,
    subscribers: 5200,
    totalViews: 85000
  },
  {
    id: 'essam',
    name: 'Essam',
    role: 'FlutterFlow Expert',
    skills: ['FlutterFlow', 'Mobile Apps', 'Firebase', 'State Management', 'Custom Functions'],
    emoji: '📱',
    image: satoshiImage,
    bio: 'FlutterFlow specialist helping clients build powerful mobile applications. Expert in extending FlutterFlow capabilities with custom code and integrations.',
    youtube: 'https://youtube.com/@essamflutterflow',
    twitter: 'https://twitter.com/essamff',
    videoCount: 38,
    subscribers: 18000,
    totalViews: 320000,
    featuredVideos: [
      {
        id: 'dQw4w9WgXcQ',
        title: 'Advanced FlutterFlow Techniques for Production Apps',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        views: '25K',
        duration: '22:15',
        publishedAt: '1 week ago'
      }
    ]
  }
])

const selectedExpertId = ref<string | null>(null)

const selectedExpert = computed(() => 
  selectedExpertId.value 
    ? experts.value.find(e => e.id === selectedExpertId.value) || null
    : null
)

const selectExpert = (expert: Expert) => {
  selectedExpertId.value = expert.id
  router.push(`/meet/${expert.id}`)
}

const closeProfile = () => {
  selectedExpertId.value = null
  router.push('/meet')
}

// Handle route params
onMounted(() => {
  const expertParam = route.params.expert
  if (expertParam && typeof expertParam === 'string') {
    selectedExpertId.value = expertParam
  } else if (Array.isArray(expertParam) && expertParam.length > 0) {
    selectedExpertId.value = expertParam[0]
  }
})

// Watch for route changes
watch(() => route.params.expert, (newExpert) => {
  if (newExpert && typeof newExpert === 'string') {
    selectedExpertId.value = newExpert
  } else if (Array.isArray(newExpert) && newExpert.length > 0) {
    selectedExpertId.value = newExpert[0]
  } else {
    selectedExpertId.value = null
  }
})
</script>

<style scoped>
.meet-page {
  min-height: 100vh;
  background: var(--bg-primary);
}

/* Header */
.page-header {
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-primary);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.back-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s;
}

.back-link:hover {
  color: var(--primary-500);
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.earn-button {
  padding: 0.5rem 1rem;
  background: var(--primary-500);
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.earn-button:hover {
  background: var(--primary-600);
  transform: translateY(-2px);
}

/* Main Content */
.main-content {
  padding: 2rem 0 4rem;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.intro-text {
  font-size: 1.125rem;
  color: var(--text-secondary);
  text-align: center;
  max-width: 800px;
  margin: 0 auto 3rem;
  line-height: 1.7;
}

/* Mobile Navigation */
.mobile-nav {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-primary);
  padding: 1rem;
  z-index: 90;
}

.nav-button {
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.nav-button:hover {
  background: var(--bg-quaternary);
  border-color: var(--primary-500);
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .header-content {
    padding: 1rem;
  }
  
  .page-title {
    font-size: 1.25rem;
  }
  
  .earn-button {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
  }
  
  .back-link {
    font-size: 0;
  }
  
  .back-link svg {
    font-size: 1rem;
  }
  
  .intro-text {
    font-size: 1rem;
    margin-bottom: 2rem;
  }
  
  .mobile-nav {
    display: block;
  }
  
  .main-content {
    padding-bottom: 5rem;
  }
}
</style>