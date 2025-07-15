import type { Ref } from 'vue'

export interface PersistOptions {
  storage?: 'local' | 'session' | 'cookie'
  ttl?: number // Time to live in milliseconds
  syncAcrossTabs?: boolean
}

export function usePersistentState<T>(
  key: string,
  defaultValue: T,
  options: PersistOptions = {}
): [Ref<T>, (value: T) => void, () => void] {
  const {
    storage = 'local',
    ttl,
    syncAcrossTabs = true
  } = options
  
  const nuxtApp = useNuxtApp()
  const cookie = useCookie<T>(key, {
    httpOnly: false,
    secure: true,
    sameSite: 'lax',
    maxAge: ttl ? ttl / 1000 : undefined
  })
  
  // Initialize state
  const state = useState<T>(key, () => {
    if (storage === 'cookie') {
      return cookie.value ?? defaultValue
    }
    
    if (process.client) {
      try {
        const store = storage === 'local' ? localStorage : sessionStorage
        const stored = store.getItem(key)
        
        if (stored) {
          const parsed = JSON.parse(stored)
          
          // Check TTL if set
          if (ttl && parsed.timestamp) {
            const age = Date.now() - parsed.timestamp
            if (age > ttl) {
              store.removeItem(key)
              return defaultValue
            }
          }
          
          return parsed.value ?? defaultValue
        }
      } catch (err) {
        console.error(`Error reading ${storage} storage:`, err)
      }
    }
    
    return defaultValue
  })
  
  // Set value with persistence
  const setValue = (value: T) => {
    state.value = value
    
    if (storage === 'cookie') {
      cookie.value = value
    } else if (process.client) {
      try {
        const store = storage === 'local' ? localStorage : sessionStorage
        const data = ttl
          ? { value, timestamp: Date.now() }
          : { value }
        
        store.setItem(key, JSON.stringify(data))
      } catch (err) {
        console.error(`Error writing to ${storage} storage:`, err)
      }
    }
  }
  
  // Clear value
  const clearValue = () => {
    state.value = defaultValue
    
    if (storage === 'cookie') {
      cookie.value = null as any
    } else if (process.client) {
      const store = storage === 'local' ? localStorage : sessionStorage
      store.removeItem(key)
    }
  }
  
  // Sync across tabs (client-side only)
  if (process.client && syncAcrossTabs && storage === 'local') {
    window.addEventListener('storage', (e) => {
      if (e.key === key && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue)
          state.value = parsed.value ?? defaultValue
        } catch (err) {
          console.error('Error syncing state:', err)
        }
      }
    })
  }
  
  return [state, setValue, clearValue]
}

// Specialized composables for common use cases
export function useLocalStorage<T>(key: string, defaultValue: T) {
  return usePersistentState(key, defaultValue, { storage: 'local' })
}

export function useSessionStorage<T>(key: string, defaultValue: T) {
  return usePersistentState(key, defaultValue, { storage: 'session' })
}

export function useCookieState<T>(key: string, defaultValue: T, ttl?: number) {
  return usePersistentState(key, defaultValue, { storage: 'cookie', ttl })
}
