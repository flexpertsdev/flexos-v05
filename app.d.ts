/// <reference types="@nuxtjs/supabase" />

import type { Database } from './types/database'

declare module '#supabase/database' {
  interface Database extends import('./types/database').Database {}
}

// Make the Database type available globally for Supabase client
declare module '@supabase/supabase-js' {
  interface Database extends import('./types/database').Database {}
}