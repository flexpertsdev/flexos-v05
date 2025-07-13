<template>
  <header class="app-header" :class="{ 'header-scrolled': isScrolled }">
    <div class="header-content">
      <!-- Left Section -->
      <div class="header-left">
        <button 
          v-if="showBackButton" 
          @click="handleBack"
          class="back-button"
          aria-label="Go back"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          <span v-if="!isMobile">{{ backText || 'Back' }}</span>
        </button>
        
        <NuxtLink v-else to="/" class="logo-link">
          <div class="logo">
            <div class="logo-icon">F</div>
            <span class="logo-text">{{ title || 'FlexOS' }}</span>
          </div>
        </NuxtLink>
      </div>

      <!-- Center Section (Optional) -->
      <div v-if="subtitle" class="header-center">
        <span class="header-subtitle">{{ subtitle }}</span>
      </div>

      <!-- Right Section -->
      <div class="header-right">
        <!-- Desktop Navigation -->
        <nav v-if="!isMobile" class="desktop-nav">
          <NuxtLink 
            v-for="item in navigationItems" 
            :key="item.path"
            :to="item.path"
            class="nav-link"
            :class="{ active: isActiveRoute(item.path) }"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>

        <!-- Custom Action Slot -->
        <slot name="action" />

        <!-- Mobile Menu Button -->
        <button 
          v-if="isMobile && showMenu"
          @click="toggleMenu"
          class="menu-button"
          :aria-label="menuOpen ? 'Close menu' : 'Open menu'"
          :aria-expanded="menuOpen"
        >
          <div class="hamburger" :class="{ open: menuOpen }">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNavigation } from '~/composables/useNavigation'

interface NavigationItem {
  path: string
  label: string
  icon?: string
}

interface Props {
  title?: string
  subtitle?: string
  showBackButton?: boolean
  backText?: string
  backPath?: string
  showMenu?: boolean
  navigationItems?: NavigationItem[]
}

const props = withDefaults(defineProps<Props>(), {
  showMenu: true,
  navigationItems: () => [
    { path: '/', label: 'Home' },
    { path: '/academy', label: 'Academy' }
  ]
})

const emit = defineEmits<{
  back: []
}>()

const route = useRoute()
const router = useRouter()
const { menuOpen, toggleMenu } = useNavigation()

// Reactive state
const isScrolled = ref(false)
const isMobile = ref(false)

// Handle scroll
const handleScroll = () => {
  isScrolled.value = window.scrollY > 10
}

// Handle resize
const handleResize = () => {
  isMobile.value = window.innerWidth <= 768
}

// Handle back button
const handleBack = () => {
  emit('back')
  if (props.backPath) {
    router.push(props.backPath)
  } else {
    router.back()
  }
}

// Check if route is active
const isActiveRoute = (path: string) => {
  return route.path === path || route.path.startsWith(path + '/')
}

// Lifecycle
onMounted(() => {
  handleResize()
  handleScroll()
  window.addEventListener('resize', handleResize)
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-primary);
  transition: all 0.3s ease;
  padding-top: env(safe-area-inset-top, 0);
}

.header-scrolled {
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

/* Left Section */
.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  margin-left: -0.75rem;
  background: none;
  border: none;
  color: var(--text-primary);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.back-button:hover {
  background: var(--bg-tertiary);
}

.logo-link {
  text-decoration: none;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
}

.logo-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, var(--primary-500), var(--primary-400));
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 1.25rem;
  color: white;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
}

/* Center Section */
.header-center {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1rem;
}

.header-subtitle {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
}

/* Right Section */
.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Desktop Navigation */
.desktop-nav {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-link {
  padding: 0.5rem 1rem;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.nav-link:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.nav-link.active {
  background: rgba(22, 193, 129, 0.1);
  color: var(--primary-500);
}

/* Menu Button */
.menu-button {
  position: relative;
  width: 40px;
  height: 40px;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: background 0.2s ease;
}

.menu-button:hover {
  background: var(--bg-tertiary);
}

.hamburger {
  width: 24px;
  height: 18px;
  position: relative;
  transform: rotate(0deg);
  transition: 0.5s ease-in-out;
}

.hamburger span {
  display: block;
  position: absolute;
  height: 2px;
  width: 100%;
  background: var(--text-primary);
  border-radius: 2px;
  opacity: 1;
  left: 0;
  transform: rotate(0deg);
  transition: 0.25s ease-in-out;
}

.hamburger span:nth-child(1) {
  top: 0px;
}

.hamburger span:nth-child(2) {
  top: 8px;
}

.hamburger span:nth-child(3) {
  top: 16px;
}

.hamburger.open span:nth-child(1) {
  top: 8px;
  transform: rotate(135deg);
}

.hamburger.open span:nth-child(2) {
  opacity: 0;
  left: -60px;
}

.hamburger.open span:nth-child(3) {
  top: 8px;
  transform: rotate(-135deg);
}

/* Mobile Styles */
@media (max-width: 768px) {
  .header-content {
    height: 56px;
    padding: 0 1rem;
  }

  .logo-text {
    font-size: 1.125rem;
  }

  .logo-icon {
    width: 32px;
    height: 32px;
    font-size: 1.125rem;
  }

  .header-center {
    display: none;
  }

  .back-button {
    padding: 0.5rem;
    margin-left: -0.5rem;
  }
}
</style>