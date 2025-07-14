import { useSupabaseUser, useSupabaseClient } from '#supabase/client'

export const useAuth = () => {
  const user = useSupabaseUser()
  const supabase = useSupabaseClient()
  const router = useRouter()
  
  const isAuthenticated = computed(() => !!user.value)
  
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      // Redirect to signin page
      await router.push('/auth/signin')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }
  
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error }
    }
  }
  
  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      })
      
      if (error) throw error
      
      return { data, error: null }
    } catch (error: any) {
      return { data: null, error }
    }
  }
  
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })
      
      if (error) throw error
      
      return { error: null }
    } catch (error: any) {
      return { error }
    }
  }
  
  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })
      
      if (error) throw error
      
      return { error: null }
    } catch (error: any) {
      return { error }
    }
  }
  
  return {
    user: readonly(user),
    isAuthenticated: readonly(isAuthenticated),
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword
  }
}