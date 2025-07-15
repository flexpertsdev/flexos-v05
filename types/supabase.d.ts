import type { Database } from './database'

declare module '@nuxtjs/supabase' {
  interface Database extends import('./database').Database {}
}

declare module '#imports' {
  interface Database extends import('./database').Database {}
}