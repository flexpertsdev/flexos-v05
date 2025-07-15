// Example: Project management with all patterns combined

import type { Database } from '~/types/database'

type Project = Database['public']['Tables']['projects']['Row']

export function useProjectManagement() {
  const user = useSupabaseUser()
  const toast = useToast()
  
  // 1. CRUD operations with Supabase
  const {
    items: projectsFromDB,
    loading: projectsLoading,
    error: projectsError,
    fetchItems: fetchProjects,
    createItem: createProject,
    updateItem: updateProject,
    deleteItem: deleteProject,
    subscribeToChanges
  } = useSupabaseCrud('projects', {
    realtime: true,
    orderBy: 'updated_at',
    orderAscending: false
  })
  
  // Local state for optimistic updates
  const optimisticProjects = ref<Project[]>([])
  const projects = computed(() => [...optimisticProjects.value, ...projectsFromDB.value])
  
  // 2. Local state with persistence
  const [selectedProjectId, setSelectedProjectId] = useLocalStorage<string | null>(
    'selectedProjectId',
    null
  )
  
  const [projectFilters, setProjectFilters] = usePersistentState(
    'projectFilters',
    {
      status: 'all',
      type: 'all',
      sortBy: 'updated_at'
    },
    { storage: 'session' }
  )
  
  // 3. Real-time collaboration state
  const {
    data: activeUsers,
    isConnected: presenceConnected
  } = useRealtimeData<{ id: string; user_id: string; project_id: string; last_seen: string }>({
    table: 'project_presence',
    filter: selectedProjectId.value ? { project_id: selectedProjectId.value } : undefined,
    events: ['INSERT', 'UPDATE', 'DELETE']
  })
  
  // 4. External API integration (e.g., AI service)
  const api = useApi('https://api.example.com')
  
  const generateProjectIdeas = async (description: string) => {
    const { data, error } = await api.post<{ ideas: string[] }>(
      '/ai/generate-ideas',
      { description },
      {
        cache: { ttl: 3600000, key: `ideas-${description}` },
        headers: {
          'Authorization': `Bearer ${useRuntimeConfig().public.aiApiKey}`
        }
      }
    )
    
    if (error) {
      toast.error('Failed to generate ideas')
      return []
    }
    
    return data?.ideas || []
  }
  
  // 5. Computed states
  const selectedProject = computed(() =>
    projects.value.find(p => p.id === selectedProjectId.value)
  )
  
  const filteredProjects = computed(() => {
    let filtered = [...projects.value]
    
    if (projectFilters.value.status !== 'all') {
      filtered = filtered.filter(p => p.status === projectFilters.value.status)
    }
    
    if (projectFilters.value.type !== 'all') {
      filtered = filtered.filter(p => p.type === projectFilters.value.type)
    }
    
    return filtered
  })
  
  const projectStats = computed(() => ({
    total: projects.value.length,
    active: projects.value.filter(p => p.status === 'active').length,
    archived: projects.value.filter(p => p.status === 'archived').length
  }))
  
  // 6. Actions with optimistic updates
  const createProjectWithAI = async (name: string, description: string) => {
    // Generate ideas using AI
    const ideas = await generateProjectIdeas(description)
    
    // Create project with optimistic update
    const tempId = `temp-${Date.now()}`
    const optimisticProject = {
      id: tempId,
      name,
      description,
      user_id: user.value?.id || '',
      status: 'active',
      ideas,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    // Apply optimistic update
    optimisticProjects.value = [optimisticProject as any]
    
    try {
      // Create actual project with required fields
      const { data, error } = await createProject({
        user_id: user.value!.id,
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description,
        status: 'active',
        metadata: { ideas }
      } as any)
      
      if (error) throw error
      
      // Remove optimistic update now that we have real data
      optimisticProjects.value = []
      
      toast.success('Project created successfully')
      return data
    } catch (error) {
      // Rollback optimistic update
      optimisticProjects.value = []
      toast.error('Failed to create project')
      throw error
    }
  }
  
  // 7. Initialize
  onMounted(async () => {
    if (user.value) {
      // Fetch user's projects
      await fetchProjects({ user_id: user.value.id })
      
      // Subscribe to real-time changes
      subscribeToChanges(
        { user_id: user.value.id },
        (payload) => {
          // Additional handling for specific events
          if (payload.eventType === 'INSERT') {
            toast.info('New project added')
          }
        }
      )
    }
  })
  
  return {
    // State
    projects: filteredProjects,
    selectedProject,
    projectStats,
    activeUsers,
    loading: projectsLoading,
    error: projectsError,
    
    // Filters
    filters: projectFilters,
    setFilters: setProjectFilters,
    
    // Actions
    createProject: createProjectWithAI,
    updateProject,
    deleteProject,
    selectProject: (id: string) => setSelectedProjectId(id),
    
    // Utilities
    refresh: fetchProjects,
    generateIdeas: generateProjectIdeas
  }
}
