export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated, isLoading } = useAuth()
  
  // Wait for auth to initialize
  if (isLoading.value) {
    return
  }
  
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
  
  // Redirect to signin if not authenticated and trying to access protected route
  if (!isAuthenticated.value && !isPublicRoute) {
    return navigateTo('/auth/signin')
  }
})