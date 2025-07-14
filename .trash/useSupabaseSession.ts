export const useSupabaseSession = () => {
  const { $supabase } = useNuxtApp()
  const session = useState('supabase.session', () => null)

  onMounted(async () => {
    if ($supabase) {
      const { data } = await $supabase.auth.getSession()
      session.value = data.session

      $supabase.auth.onAuthStateChange((event, _session) => {
        session.value = _session
      })
    }
  })

  return session
}
