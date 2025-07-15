// Typed Supabase client composable
import type { Database } from '~/types/database'

export const useSupabaseTyped = () => {
  return useSupabaseClient<Database>()
}