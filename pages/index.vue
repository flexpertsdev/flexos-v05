<template>
  <div>
    <!-- Animated Background -->
    <div class="animated-bg">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
      <div class="gradient-orb orb-3"></div>
    </div>

    <!-- Header -->
    <AppHeader title="FlexOS">
      <template #action>
        <button v-if="!isAuthenticated" class="login-btn" @click="handleLogin">Sign In</button>
        <button v-else class="login-btn" @click="handleDashboard">Dashboard</button>
      </template>
    </AppHeader>
    
    <!-- Mobile Navigation -->
    <BottomSheet v-model="menuOpen" />

    <!-- Main Content -->
    <main class="main-content">
      <HeroSection />
      <DifferentiatorsSection />
      <FeaturesSection />
      <PricingSection />
      <HireExpertSection />
      <WebsiteRefreshSection />
      <CommunityShowcase />
      <FooterSection />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useNavigation } from '~/composables/useNavigation'
// Remove old auth import
import AppHeader from '~/components/layout/AppHeader.vue'
import BottomSheet from '~/components/layout/BottomSheet.vue'
import HeroSection from '~/components/sections/HeroSection.vue'
import DifferentiatorsSection from '~/components/sections/DifferentiatorsSection.vue'
import FeaturesSection from '~/components/sections/FeaturesSection.vue'
import PricingSection from '~/components/sections/PricingSection.vue'
import HireExpertSection from '~/components/sections/HireExpertSection.vue'
import WebsiteRefreshSection from '~/components/sections/WebsiteRefreshSection.vue'
import CommunityShowcase from '~/components/sections/CommunityShowcase.vue'
import FooterSection from '~/components/sections/FooterSection.vue'

const { menuOpen } = useNavigation()
const user = useSupabaseUser()
const router = useRouter()

// Computed auth state
const isAuthenticated = computed(() => !!user.value)
const isLoading = computed(() => user.value === undefined)

// Redirect authenticated users to dashboard
onMounted(() => {
  // Wait for auth to load
  const checkAuth = () => {
    if (!isLoading.value && isAuthenticated.value) {
      router.push('/dashboard')
    }
  }
  
  // Check immediately and after a short delay to handle async auth state
  checkAuth()
  if (isLoading.value) {
    setTimeout(checkAuth, 100)
  }
})

const handleLogin = () => {
  router.push('/auth/signin')
}

const handleDashboard = () => {
  router.push('/dashboard')
}
</script>

<style scoped>
/* Main Content */
.main-content {
  padding-top: calc(60px + env(safe-area-inset-top, 0)); /* Account for fixed header */
}

/* Animated Background */
.animated-bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  overflow: hidden;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.6;
  animation: float 20s ease-in-out infinite;
}

.orb-1 {
  top: 10%;
  left: 10%;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(22, 193, 129, 0.3) 0%, transparent 70%);
  animation-delay: 0s;
}

.orb-2 {
  top: 60%;
  right: 10%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%);
  animation-delay: 7s;
}

.orb-3 {
  bottom: 10%;
  left: 30%;
  width: 350px;
  height: 350px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%);
  animation-delay: 14s;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(30px, -30px) scale(1.1);
  }
  50% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  75% {
    transform: translate(20px, 30px) scale(1.05);
  }
}

/* Header Action Button */

.login-btn {
  padding: 0.5rem 1.5rem;
  background: var(--primary-500);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.login-btn:hover {
  background: var(--primary-600);
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 768px) {
  .main-content {
    padding-top: calc(56px + env(safe-area-inset-top, 0)); /* Mobile header height */
  }
  
  .login-btn {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
}
</style>