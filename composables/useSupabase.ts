// Re-export the Nuxt Supabase composables for consistency
export { 
  useSupabaseClient,
  useSupabaseUser,
  useSupabaseSession 
} from '#supabase/client'

// Convenience wrapper that maintains backwards compatibility
export const useSupabase = () => {
  return useSupabaseClient()
}