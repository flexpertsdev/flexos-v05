import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import type { Database } from '~/types/database'

interface RealtimeOptions {
  table: string
  filter?: Record<string, any>
  events?: ('INSERT' | 'UPDATE' | 'DELETE')[]
}

interface OptimisticUpdate<T> {
  id: string
  type: 'INSERT' | 'UPDATE' | 'DELETE'
  data: T
  timestamp: number
}

export function useRealtimeData<T extends { id: string | number }>(
  options: RealtimeOptions
) {
  const supabase = useSupabaseClient<Database>()
  
  // State
  const data = useState<T[]>(`realtime.${options.table}`, () => [])
  const loading = useState(`realtime.${options.table}.loading`, () => false)
  const error = useState<string | null>(`realtime.${options.table}.error`, () => null)
  const isConnected = useState(`realtime.${options.table}.connected`, () => false)
  
  // Optimistic updates queue
  const optimisticUpdates = useState<OptimisticUpdate<T>[]>(
    `realtime.${options.table}.optimistic`,
    () => []
  )
  
  let channel: RealtimeChannel | null = null
  
  // Apply optimistic update
  const applyOptimisticUpdate = (update: OptimisticUpdate<T>) => {
    optimisticUpdates.value = [...optimisticUpdates.value, update]
    
    // Apply to local data
    switch (update.type) {
      case 'INSERT':
        data.value = [update.data, ...data.value]
        break
      case 'UPDATE':
        data.value = data.value.map(item =>
          item.id === update.data.id ? update.data : item
        )
        break
      case 'DELETE':
        data.value = data.value.filter(item => item.id !== update.data.id)
        break
    }
  }
  
  // Remove optimistic update when confirmed
  const removeOptimisticUpdate = (id: string) => {
    optimisticUpdates.value = optimisticUpdates.value.filter(
      update => update.id !== id
    )
  }
  
  // Rollback optimistic update on error
  const rollbackOptimisticUpdate = (id: string) => {
    const update = optimisticUpdates.value.find(u => u.id === id)
    if (!update) return
    
    // Reverse the update
    switch (update.type) {
      case 'INSERT':
        data.value = data.value.filter(item => item.id !== update.data.id)
        break
      case 'UPDATE':
        // Would need original data to properly rollback
        // For now, just remove the update from queue
        break
      case 'DELETE':
        data.value = [...data.value, update.data]
        break
    }
    
    removeOptimisticUpdate(id)
  }
  
  // Handle realtime payload
  const handleRealtimePayload = (
    payload: RealtimePostgresChangesPayload<T>
  ) => {
    const { eventType, new: newRecord, old: oldRecord } = payload
    
    switch (eventType) {
      case 'INSERT':
        if (newRecord) {
          // Check if this confirms an optimistic update
          const optimistic = optimisticUpdates.value.find(
            u => u.type === 'INSERT' && u.data.id === newRecord.id
          )
          if (optimistic) {
            removeOptimisticUpdate(optimistic.id)
          } else {
            data.value = [newRecord as T, ...data.value]
          }
        }
        break
        
      case 'UPDATE':
        if (newRecord) {
          const optimistic = optimisticUpdates.value.find(
            u => u.type === 'UPDATE' && u.data.id === newRecord.id
          )
          if (optimistic) {
            removeOptimisticUpdate(optimistic.id)
          }
          data.value = data.value.map(item =>
            item.id === newRecord.id ? newRecord as T : item
          )
        }
        break
        
      case 'DELETE':
        if (oldRecord) {
          const optimistic = optimisticUpdates.value.find(
            u => u.type === 'DELETE' && u.data.id === oldRecord.id
          )
          if (optimistic) {
            removeOptimisticUpdate(optimistic.id)
          } else {
            data.value = data.value.filter(item => item.id !== oldRecord.id)
          }
        }
        break
    }
  }
  
  // Subscribe to changes
  const subscribe = async () => {
    if (channel) return
    
    loading.value = true
    error.value = null
    
    try {
      // Initial data fetch
      let query = supabase.from(options.table).select('*')
      
      if (options.filter) {
        Object.entries(options.filter).forEach(([key, value]) => {
          query = query.eq(key, value)
        })
      }
      
      const { data: initialData, error: fetchError } = await query
      
      if (fetchError) throw fetchError
      
      data.value = initialData as T[] || []
      
      // Set up realtime subscription
      const channelName = `${options.table}-${JSON.stringify(options.filter || {})}`
      channel = supabase.channel(channelName)
      
      const events = options.events || ['INSERT', 'UPDATE', 'DELETE']
      
      events.forEach(event => {
        channel!.on(
          'postgres_changes' as any,
          {
            event,
            schema: 'public',
            table: options.table,
            filter: options.filter
              ? Object.entries(options.filter)
                  .map(([key, value]) => `${key}=eq.${value}`)
                  .join('&')
              : undefined
          },
          handleRealtimePayload
        )
      })
      
      channel
        .on('presence', { event: 'sync' }, () => {
          isConnected.value = true
        })
        .on('presence', { event: 'leave' }, () => {
          isConnected.value = false
        })
        .subscribe((status) => {
          isConnected.value = status === 'SUBSCRIBED'
        })
      
    } catch (err: any) {
      error.value = err.message
      console.error('Realtime subscription error:', err)
    } finally {
      loading.value = false
    }
  }
  
  // Unsubscribe
  const unsubscribe = () => {
    if (channel) {
      supabase.removeChannel(channel)
      channel = null
      isConnected.value = false
    }
  }
  
  // Auto cleanup
  if (getCurrentInstance()) {
    onMounted(() => {
      subscribe()
    })
    
    onUnmounted(() => {
      unsubscribe()
    })
  }
  
  return {
    // State
    data: computed(() => data.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    isConnected: computed(() => isConnected.value),
    hasOptimisticUpdates: computed(() => optimisticUpdates.value.length > 0),
    
    // Methods
    subscribe,
    unsubscribe,
    applyOptimisticUpdate,
    rollbackOptimisticUpdate,
    
    // Utilities
    refresh: async () => {
      const query = supabase.from(options.table).select('*')
      
      if (options.filter) {
        Object.entries(options.filter).forEach(([key, value]) => {
          query.eq(key, value)
        })
      }
      
      const { data: refreshedData } = await query
      if (refreshedData) {
        data.value = refreshedData as T[]
      }
    }
  }
}
