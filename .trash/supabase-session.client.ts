// This plugin provides the useSupabaseSession composable that the @nuxtjs/supabase module expects
export default defineNuxtPlugin(() => {
  const { $supabase } = useNuxtApp()
  
  const useSupabaseSession = () => {
    const session = useState('supabase-session', () => null)
    
    if (process.client && $supabase) {
      $supabase.auth.getSession().then(({ data }) => {
        session.value = data.session
      })
      
      $supabase.auth.onAuthStateChange((event, _session) => {
        session.value = _session
      })
    }
    
    return session
  }
  
  return {
    provide: {
      useSupabaseSession
    }
  }
})
