import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

// Get environment variables
const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not set')
}

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    detectSessionInUrl: true,
    autoRefreshToken: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined
  }
})