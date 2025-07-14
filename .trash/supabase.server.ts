import { createServerClient, parseCookieHeader } from '@supabase/ssr'
import type { Database } from '~/types/database'

export default defineNuxtPlugin({
  name: 'supabase-server',
  enforce: 'pre',
  async setup(nuxtApp) {
    const config = useRuntimeConfig()
    const event = useRequestEvent()

    const supabase = createServerClient<Database>(
      config.public.supabaseUrl,
      config.public.supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return parseCookieHeader(event?.headers.cookie ?? '')
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              setCookie(event, name, value, options)
            })
          },
        },
      }
    )

    return {
      provide: {
        supabase
      }
    }
  }
})
