export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated, isLoading } = useAuth()
  
  // Wait for auth to initialize
  if (isLoading.value) {
    return
  }
  
  // Redirect to dashboard if authenticated
  if (isAuthenticated.value) {
    return navigateTo('/dashboard')
  }
})