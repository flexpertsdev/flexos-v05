interface FetchOptions extends RequestInit {
  params?: Record<string, any>
  timeout?: number
  retries?: number
  retryDelay?: number
  cache?: {
    ttl?: number
    key?: string
  }
}

interface ApiResponse<T> {
  data: T | null
  error: Error | null
  status: number | null
  headers: Headers | null
}

export function useApi(baseURL?: string) {
  const config = useRuntimeConfig()
  
  // Cache store
  const cache = new Map<string, { data: any; timestamp: number }>()
  
  // Build URL with params
  const buildURL = (endpoint: string, params?: Record<string, any>) => {
    const url = new URL(endpoint, baseURL || config.public.apiUrl || '/')
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value))
        }
      })
    }
    
    return url.toString()
  }
  
  // Check cache
  const checkCache = (key: string, ttl?: number): any | null => {
    const cached = cache.get(key)
    if (!cached) return null
    
    if (ttl && Date.now() - cached.timestamp > ttl) {
      cache.delete(key)
      return null
    }
    
    return cached.data
  }
  
  // Generic fetch wrapper
  const fetchWithRetry = async <T>(
    url: string,
    options: FetchOptions = {}
  ): Promise<ApiResponse<T>> => {
    const {
      params,
      timeout = 30000,
      retries = 3,
      retryDelay = 1000,
      cache: cacheOptions,
      ...fetchOptions
    } = options
    
    // Check cache first
    if (cacheOptions && fetchOptions.method === 'GET') {
      const cacheKey = cacheOptions.key || url
      const cached = checkCache(cacheKey, cacheOptions.ttl)
      if (cached) {
        return {
          data: cached,
          error: null,
          status: 200,
          headers: null
        }
      }
    }
    
    let lastError: Error | null = null
    
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        // Create abort controller for timeout
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), timeout)
        
        const response = await fetch(url, {
          ...fetchOptions,
          signal: controller.signal
        })
        
        clearTimeout(timeoutId)
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        const data = await response.json()
        
        // Cache successful GET requests
        if (cacheOptions && fetchOptions.method === 'GET') {
          const cacheKey = cacheOptions.key || url
          cache.set(cacheKey, {
            data,
            timestamp: Date.now()
          })
        }
        
        return {
          data,
          error: null,
          status: response.status,
          headers: response.headers
        }
      } catch (error: any) {
        lastError = error
        
        // Don't retry on client errors (4xx)
        if (error.message.includes('HTTP 4')) {
          break
        }
        
        // Wait before retrying
        if (attempt < retries) {
          await new Promise(resolve => 
            setTimeout(resolve, retryDelay * (attempt + 1))
          )
        }
      }
    }
    
    return {
      data: null,
      error: lastError,
      status: null,
      headers: null
    }
  }
  
  // HTTP methods
  const get = async <T>(
    endpoint: string,
    options?: FetchOptions
  ): Promise<ApiResponse<T>> => {
    const url = buildURL(endpoint, options?.params)
    return fetchWithRetry<T>(url, {
      ...options,
      method: 'GET'
    })
  }
  
  const post = async <T>(
    endpoint: string,
    body?: any,
    options?: FetchOptions
  ): Promise<ApiResponse<T>> => {
    const url = buildURL(endpoint, options?.params)
    return fetchWithRetry<T>(url, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      },
      body: body ? JSON.stringify(body) : undefined
    })
  }
  
  const put = async <T>(
    endpoint: string,
    body?: any,
    options?: FetchOptions
  ): Promise<ApiResponse<T>> => {
    const url = buildURL(endpoint, options?.params)
    return fetchWithRetry<T>(url, {
      ...options,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      },
      body: body ? JSON.stringify(body) : undefined
    })
  }
  
  const patch = async <T>(
    endpoint: string,
    body?: any,
    options?: FetchOptions
  ): Promise<ApiResponse<T>> => {
    const url = buildURL(endpoint, options?.params)
    return fetchWithRetry<T>(url, {
      ...options,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      },
      body: body ? JSON.stringify(body) : undefined
    })
  }
  
  const del = async <T>(
    endpoint: string,
    options?: FetchOptions
  ): Promise<ApiResponse<T>> => {
    const url = buildURL(endpoint, options?.params)
    return fetchWithRetry<T>(url, {
      ...options,
      method: 'DELETE'
    })
  }
  
  // Clear cache
  const clearCache = (key?: string) => {
    if (key) {
      cache.delete(key)
    } else {
      cache.clear()
    }
  }
  
  return {
    get,
    post,
    put,
    patch,
    delete: del,
    clearCache
  }
}

// Specialized composable for async state management
export function useApiAsync<T>(
  key: string,
  fetcher: () => Promise<T>,
  options?: {
    immediate?: boolean
    watch?: any[]
    cache?: boolean
    ttl?: number
  }
) {
  const data = useState<T | null>(`async.${key}`, () => null)
  const pending = useState(`async.${key}.pending`, () => false)
  const error = useState<Error | null>(`async.${key}.error`, () => null)
  
  const execute = async () => {
    pending.value = true
    error.value = null
    
    try {
      data.value = await fetcher()
    } catch (err: any) {
      error.value = err
      console.error(`AsyncData error for ${key}:`, err)
    } finally {
      pending.value = false
    }
  }
  
  // Execute immediately if requested
  if (options?.immediate !== false) {
    execute()
  }
  
  // Watch for changes
  if (options?.watch) {
    watch(options.watch, () => {
      execute()
    })
  }
  
  return {
    data: computed(() => data.value),
    pending: computed(() => pending.value),
    error: computed(() => error.value),
    execute,
    refresh: execute
  }
}
