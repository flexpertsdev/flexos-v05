<template>
  <div>
    <!-- Animated Background -->
    <div class="animated-bg">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
      <div class="gradient-orb orb-3"></div>
    </div>

    <!-- Header -->
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <span style="font-size: 1.5rem;">🦸‍♀️</span>
          <span>Flexi</span>
        </div>
        
        <nav class="nav-links">
          <a href="#experts" class="nav-link">Get Help from Experts</a>
          <button class="login-btn">Sign In</button>
        </nav>
        
        <button class="mobile-menu-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 12h18M3 6h18M3 18h18"/>
          </svg>
        </button>
      </div>
    </header>

    <!-- Components -->
    <HeroSection />
    <DifferentiatorsSection />
    <FeaturesSection />
    <PricingSection />
    <HireExpertSection />
    <WebsiteRefreshSection />
    <CommunityShowcase />
    <FooterSection />
  </div>
</template>

<script setup lang="ts">
import HeroSection from '@/components/sections/HeroSection.vue'
import DifferentiatorsSection from '@/components/sections/DifferentiatorsSection.vue'
import FeaturesSection from '@/components/sections/FeaturesSection.vue'
import PricingSection from '@/components/sections/PricingSection.vue'
import HireExpertSection from '@/components/sections/HireExpertSection.vue'
import WebsiteRefreshSection from '@/components/sections/WebsiteRefreshSection.vue'
import CommunityShowcase from '@/components/sections/CommunityShowcase.vue'
import FooterSection from '@/components/sections/FooterSection.vue'
</script>

<style scoped>
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

/* Header */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(var(--bg-primary-rgb), 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border-primary);
  padding: 1rem 0;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-link:hover {
  color: var(--primary-500);
}

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

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  color: var(--text-primary);
  cursor: pointer;
  padding: 0.5rem;
}

/* Responsive */
@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
  
  .mobile-menu-btn {
    display: block;
  }
}
</style>