import { ref, computed, watch } from 'vue'
import type { User, Session } from '@supabase/supabase-js'

// Global auth state
const currentUser = ref<User | null>(null)
const currentSession = ref<Session | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)

// Initialize auth state
let initialized = false

export function useAuth() {
  const router = useRouter()
  const supabase = useSupabase()
  
  // Initialize auth listener only once
  if (!initialized && process.client) {
    initialized = true
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      currentSession.value = session
      currentUser.value = session?.user ?? null
      isLoading.value = false
    })
    
    // Listen for auth changes
    supabase.auth.onAuthStateChange((_event, session) => {
      currentSession.value = session
      currentUser.value = session?.user ?? null
      isLoading.value = false
    })
  }
  
  // Computed properties
  const isAuthenticated = computed(() => !!currentUser.value)
  const user = computed(() => currentUser.value)
  const session = computed(() => currentSession.value)
  
  // Sign up with email
  const signUp = async (email: string, password: string, metadata?: Record<string, any>) => {
    try {
      error.value = null
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      })
      
      if (signUpError) throw signUpError
      
      return { data, error: null }
    } catch (err: any) {
      error.value = err.message
      return { data: null, error: err.message }
    }
  }
  
  // Sign in with email
  const signIn = async (email: string, password: string) => {
    try {
      error.value = null
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (signInError) throw signInError
      
      return { data, error: null }
    } catch (err: any) {
      error.value = err.message
      return { data: null, error: err.message }
    }
  }
  
  // Sign in with OAuth provider
  const signInWithProvider = async (provider: 'github' | 'google' | 'gitlab') => {
    try {
      error.value = null
      const { data, error: providerError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (providerError) throw providerError
      
      return { data, error: null }
    } catch (err: any) {
      error.value = err.message
      return { data: null, error: err.message }
    }
  }
  
  // Sign out
  const signOut = async () => {
    try {
      error.value = null
      const { error: signOutError } = await supabase.auth.signOut()
      
      if (signOutError) throw signOutError
      
      await router.push('/')
      return { error: null }
    } catch (err: any) {
      error.value = err.message
      return { error: err.message }
    }
  }
  
  // Reset password
  const resetPassword = async (email: string) => {
    try {
      error.value = null
      const { data, error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })
      
      if (resetError) throw resetError
      
      return { data, error: null }
    } catch (err: any) {
      error.value = err.message
      return { data: null, error: err.message }
    }
  }
  
  // Update password
  const updatePassword = async (newPassword: string) => {
    try {
      error.value = null
      const { data, error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      })
      
      if (updateError) throw updateError
      
      return { data, error: null }
    } catch (err: any) {
      error.value = err.message
      return { data: null, error: err.message }
    }
  }
  
  // Update user profile
  const updateProfile = async (updates: Record<string, any>) => {
    try {
      error.value = null
      
      if (!currentUser.value) {
        throw new Error('No user logged in')
      }
      
      // Update auth metadata
      const { data: authData, error: authError } = await supabase.auth.updateUser({
        data: updates
      })
      
      if (authError) throw authError
      
      // Update users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .update(updates)
        .eq('id', currentUser.value.id)
        .select()
        .single()
      
      if (userError) throw userError
      
      return { data: userData, error: null }
    } catch (err: any) {
      error.value = err.message
      return { data: null, error: err.message }
    }
  }
  
  // Get user profile from database
  const getUserProfile = async () => {
    try {
      if (!currentUser.value) return { data: null, error: 'No user logged in' }
      
      const { data, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', currentUser.value.id)
        .single()
      
      if (profileError) throw profileError
      
      return { data, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  }
  
  // Check if user needs onboarding
  const needsOnboarding = async () => {
    const { data: profile } = await getUserProfile()
    return profile && !profile.onboarding_completed
  }
  
  // Complete onboarding
  const completeOnboarding = async (profileData: Record<string, any>) => {
    return updateProfile({
      ...profileData,
      onboarding_completed: true
    })
  }
  
  return {
    // State
    user,
    session,
    isAuthenticated,
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    
    // Methods
    signUp,
    signIn,
    signInWithProvider,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    getUserProfile,
    needsOnboarding,
    completeOnboarding
  }
}