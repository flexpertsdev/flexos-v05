// Simple auth middleware using @nuxtjs/supabase
export default defineNuxtRouteMiddleware((to, from) => {
  const user = useSupabaseUser()
  
  // If no user and trying to access protected route, redirect to signin
  if (!user.value) {
    return navigateTo('/auth/signin')
  }
})