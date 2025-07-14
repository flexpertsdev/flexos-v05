import { watch } from 'vue'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { isAuthenticated, isLoading } = useAuth()
  
  // Public routes that don't require auth
  const publicRoutes = [
    '/',
    '/auth/signin',
    '/auth/signup',
    '/auth/reset-password',
    '/auth/callback',
    '/academy',
    '/meet',
    '/wizards'
  ]
  
  // Check if route is public
  const isPublicRoute = publicRoutes.some(route => to.path.startsWith(route))
  
  // If it's a public route, allow access
  if (isPublicRoute) {
    return
  }
  
  // For protected routes, wait for auth to initialize
  if (isLoading.value) {
    await new Promise<void>((resolve) => {
      const unwatch = watch(isLoading, (newValue) => {
        if (!newValue) {
          unwatch()
          resolve()
        }
      }, { immediate: true })
    })
  }
  
  // After auth has loaded, check if user is authenticated
  if (!isAuthenticated.value) {
    return navigateTo('/auth/signin')
  }
})