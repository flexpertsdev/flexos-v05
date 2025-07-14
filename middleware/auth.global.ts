export default defineNuxtRouteMiddleware(async (to, from) => {
  // Skip auth check on server side for initial page load
  // The Supabase module will handle the redirect
  if (process.server) {
    return
  }
  
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
  // Use exact match for root paths and prefix match for sub-paths
  const isPublicRoute = publicRoutes.some(route => {
    // Exact match
    if (to.path === route) return true
    // Prefix match with proper path boundary
    if (route !== '/' && (to.path === route || to.path.startsWith(route + '/'))) return true
    return false
  })
  
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
