import type { Database } from '~/types/database'
import type { RealtimeChannel } from '@supabase/supabase-js'

type Tables = Database['public']['Tables']
type TableName = keyof Tables

// Generic CRUD composable with real-time updates
export function useSupabaseCrud<T extends TableName>(
  tableName: T,
  options?: {
    realtime?: boolean
    realtimeEvent?: 'INSERT' | 'UPDATE' | 'DELETE' | '*'
    orderBy?: keyof Tables[T]['Row']
    orderAscending?: boolean
  }
) {
  type Row = Tables[T]['Row']
  type Insert = Tables[T]['Insert']
  type Update = Tables[T]['Update']
  
  const supabase = useSupabaseClient<Database>()
  
  // State management with SSR support
  const items = useState<Row[]>(`${tableName}.items`, () => [])
  const loading = useState(`${tableName}.loading`, () => false)
  const error = useState<string | null>(`${tableName}.error`, () => null)
  
  // Pagination state
  const page = useState(`${tableName}.page`, () => 1)
  const pageSize = useState(`${tableName}.pageSize`, () => 10)
  const totalCount = useState(`${tableName}.totalCount`, () => 0)
  
  // Real-time subscription
  let realtimeChannel: RealtimeChannel | null = null
  
  // Fetch items with pagination
  const fetchItems = async (
    filters?: Record<string, any>,
    options?: {
      page?: number
      pageSize?: number
    }
  ) => {
    loading.value = true
    error.value = null
    
    try {
      let query = supabase.from(tableName).select('*', { count: 'exact' })
      
      // Apply filters
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value)
          }
        })
      }
      
      // Apply ordering
      if (options?.orderBy) {
        query = query.order(
          options.orderBy as string,
          { ascending: options.orderAscending ?? true }
        )
      }
      
      // Apply pagination
      const currentPage = options?.page ?? page.value
      const currentPageSize = options?.pageSize ?? pageSize.value
      const from = (currentPage - 1) * currentPageSize
      const to = from + currentPageSize - 1
      
      query = query.range(from, to)
      
      const { data, error: fetchError, count } = await query
      
      if (fetchError) throw fetchError
      
      items.value = data || []
      totalCount.value = count || 0
      
      if (options?.page) page.value = options.page
      if (options?.pageSize) pageSize.value = options.pageSize
      
      return { data, error: null }
    } catch (err: any) {
      error.value = err.message
      return { data: null, error: err.message }
    } finally {
      loading.value = false
    }
  }
  
  // Get single item
  const getItem = async (id: string | number) => {
    loading.value = true
    error.value = null
    
    try {
      const { data, error: fetchError } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', id)
        .single()
      
      if (fetchError) throw fetchError
      
      return { data, error: null }
    } catch (err: any) {
      error.value = err.message
      return { data: null, error: err.message }
    } finally {
      loading.value = false
    }
  }
  
  // Create item
  const createItem = async (item: Insert) => {
    loading.value = true
    error.value = null
    
    try {
      const { data, error: insertError } = await supabase
        .from(tableName)
        .insert(item)
        .select()
        .single()
      
      if (insertError) throw insertError
      
      // Optimistically add to local state if not using realtime
      if (!options?.realtime && data) {
        items.value = [data, ...items.value]
        totalCount.value += 1
      }
      
      return { data, error: null }
    } catch (err: any) {
      error.value = err.message
      return { data: null, error: err.message }
    } finally {
      loading.value = false
    }
  }
  
  // Update item
  const updateItem = async (id: string | number, updates: Update) => {
    loading.value = true
    error.value = null
    
    try {
      const { data, error: updateError } = await supabase
        .from(tableName)
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (updateError) throw updateError
      
      // Optimistically update local state if not using realtime
      if (!options?.realtime && data) {
        const index = items.value.findIndex(item => (item as any).id === id)
        if (index !== -1) {
          items.value[index] = data
        }
      }
      
      return { data, error: null }
    } catch (err: any) {
      error.value = err.message
      return { data: null, error: err.message }
    } finally {
      loading.value = false
    }
  }
  
  // Delete item
  const deleteItem = async (id: string | number) => {
    loading.value = true
    error.value = null
    
    try {
      const { error: deleteError } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id)
      
      if (deleteError) throw deleteError
      
      // Optimistically remove from local state if not using realtime
      if (!options?.realtime) {
        items.value = items.value.filter(item => (item as any).id !== id)
        totalCount.value -= 1
      }
      
      return { error: null }
    } catch (err: any) {
      error.value = err.message
      return { error: err.message }
    } finally {
      loading.value = false
    }
  }
  
  // Batch operations
  const createMany = async (items: Insert[]) => {
    loading.value = true
    error.value = null
    
    try {
      const { data, error: insertError } = await supabase
        .from(tableName)
        .insert(items)
        .select()
      
      if (insertError) throw insertError
      
      return { data, error: null }
    } catch (err: any) {
      error.value = err.message
      return { data: null, error: err.message }
    } finally {
      loading.value = false
    }
  }
  
  const deleteMany = async (ids: (string | number)[]) => {
    loading.value = true
    error.value = null
    
    try {
      const { error: deleteError } = await supabase
        .from(tableName)
        .delete()
        .in('id', ids)
      
      if (deleteError) throw deleteError
      
      // Optimistically remove from local state
      if (!options?.realtime) {
        items.value = items.value.filter(
          item => !ids.includes((item as any).id)
        )
        totalCount.value -= ids.length
      }
      
      return { error: null }
    } catch (err: any) {
      error.value = err.message
      return { error: err.message }
    } finally {
      loading.value = false
    }
  }
  
  // Setup real-time subscription
  const subscribeToChanges = (
    filters?: Record<string, any>,
    onUpdate?: (payload: any) => void
  ) => {
    if (!options?.realtime) return
    
    // Build channel name with filters
    let channelName = `${tableName}-changes`
    if (filters) {
      channelName += `-${JSON.stringify(filters)}`
    }
    
    // Set up the subscription
    realtimeChannel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: options.realtimeEvent || '*',
          schema: 'public',
          table: tableName,
          filter: filters ? Object.entries(filters)
            .map(([key, value]) => `${key}=eq.${value}`)
            .join('&') : undefined
        },
        (payload) => {
          // Handle real-time updates
          if (payload.eventType === 'INSERT' && payload.new) {
            items.value = [payload.new as Row, ...items.value]
            totalCount.value += 1
          } else if (payload.eventType === 'UPDATE' && payload.new) {
            const index = items.value.findIndex(
              item => (item as any).id === payload.old?.id
            )
            if (index !== -1) {
              items.value[index] = payload.new as Row
            }
          } else if (payload.eventType === 'DELETE' && payload.old) {
            items.value = items.value.filter(
              item => (item as any).id !== payload.old?.id
            )
            totalCount.value -= 1
          }
          
          // Call custom handler if provided
          if (onUpdate) {
            onUpdate(payload)
          }
        }
      )
      .subscribe()
  }
  
  // Cleanup subscription
  const unsubscribe = () => {
    if (realtimeChannel) {
      supabase.removeChannel(realtimeChannel)
      realtimeChannel = null
    }
  }
  
  // Auto-cleanup on component unmount
  if (getCurrentInstance()) {
    onUnmounted(() => {
      unsubscribe()
    })
  }
  
  return {
    // State
    items: computed(() => items.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    page: computed(() => page.value),
    pageSize: computed(() => pageSize.value),
    totalCount: computed(() => totalCount.value),
    totalPages: computed(() => Math.ceil(totalCount.value / pageSize.value)),
    
    // Methods
    fetchItems,
    getItem,
    createItem,
    updateItem,
    deleteItem,
    createMany,
    deleteMany,
    subscribeToChanges,
    unsubscribe,
    
    // Utilities
    refresh: () => fetchItems(),
    reset: () => {
      items.value = []
      page.value = 1
      totalCount.value = 0
      error.value = null
    }
  }
}
