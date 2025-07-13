import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

export const useSupabase = () => {
  const config = useRuntimeConfig()
  
  if (!config.public.supabaseUrl || !config.public.supabaseAnonKey) {
    console.warn('Supabase environment variables are not set')
  }
  
  const supabase = createClient<Database>(
    config.public.supabaseUrl || '',
    config.public.supabaseAnonKey || '',
    {
      auth: {
        persistSession: true,
        detectSessionInUrl: true,
        autoRefreshToken: true,
        storage: typeof window !== 'undefined' ? window.localStorage : undefined
      }
    }
  )
  
  return supabase
}