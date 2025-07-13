import { ref, computed, onMounted, onUnmounted } from 'vue'

export interface BreakpointConfig {
  mobile?: number
  tablet?: number
  desktop?: number
}

export function useBreakpoint(config: BreakpointConfig = {}) {
  const defaultBreakpoints = {
    mobile: 640,
    tablet: 768,
    desktop: 1024
  }
  
  const breakpoints = { ...defaultBreakpoints, ...config }
  const windowWidth = ref(0)
  
  const updateWidth = () => {
    windowWidth.value = window.innerWidth
  }
  
  onMounted(() => {
    updateWidth()
    window.addEventListener('resize', updateWidth)
  })
  
  onUnmounted(() => {
    window.removeEventListener('resize', updateWidth)
  })
  
  const smaller = (breakpoint: keyof typeof breakpoints) => {
    return computed(() => windowWidth.value < breakpoints[breakpoint])
  }
  
  const larger = (breakpoint: keyof typeof breakpoints) => {
    return computed(() => windowWidth.value >= breakpoints[breakpoint])
  }
  
  const between = (min: keyof typeof breakpoints, max: keyof typeof breakpoints) => {
    return computed(() => 
      windowWidth.value >= breakpoints[min] && 
      windowWidth.value < breakpoints[max]
    )
  }
  
  return {
    smaller,
    larger,
    between,
    current: computed(() => windowWidth.value)
  }
}