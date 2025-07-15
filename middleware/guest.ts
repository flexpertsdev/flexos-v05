// Guest middleware - redirect to dashboard if already authenticated
export default defineNuxtRouteMiddleware((to, from) => {
  const user = useSupabaseUser()
  
  // If user is already authenticated, redirect to dashboard
  if (user.value) {
    return navigateTo('/dashboard')
  }
})