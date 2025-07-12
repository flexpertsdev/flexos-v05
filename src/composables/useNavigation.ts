import { ref, computed } from 'vue'

// Global state
const menuOpen = ref(false)
const activeSection = ref<string | null>(null)

export function useNavigation() {
  // Toggle menu
  const toggleMenu = () => {
    menuOpen.value = !menuOpen.value
    
    // Prevent body scroll when menu is open
    if (menuOpen.value) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }

  // Close menu
  const closeMenu = () => {
    menuOpen.value = false
    document.body.style.overflow = ''
  }

  // Open menu
  const openMenu = () => {
    menuOpen.value = true
    document.body.style.overflow = 'hidden'
  }

  // Set active section (for wizards)
  const setActiveSection = (section: string | null) => {
    activeSection.value = section
  }

  // Navigation items
  const navigationItems = computed(() => [
    { 
      path: '/', 
      label: 'Home',
      icon: '🏠'
    },
    { 
      path: '/academy', 
      label: 'Academy',
      icon: '🎓'
    }
  ])

  // Filter navigation items based on environment
  const filteredNavigationItems = computed(() => {
    const isDev = process.env.NODE_ENV === 'development'
    return navigationItems.value.filter(item => !item.devOnly || isDev)
  })

  return {
    menuOpen: computed(() => menuOpen.value),
    activeSection: computed(() => activeSection.value),
    navigationItems: filteredNavigationItems,
    toggleMenu,
    closeMenu,
    openMenu,
    setActiveSection
  }
}