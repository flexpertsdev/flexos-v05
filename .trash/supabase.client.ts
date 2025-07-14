import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '~/types/database'

export default defineNuxtPlugin({
  name: 'supabase-client',
  enforce: 'pre',
  async setup(nuxtApp) {
    const config = useRuntimeConfig()

    const supabase = createBrowserClient<Database>(
      config.public.supabaseUrl,
      config.public.supabaseAnonKey
    )

    return {
      provide: {
        supabase
      }
    }
  }
})
