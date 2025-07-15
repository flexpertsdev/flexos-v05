import { ref } from 'vue'

interface Toast {
  id: string
  title: string
  description?: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

const toasts = ref<Toast[]>([])

export const useToast = () => {
  const showToast = (options: Omit<Toast, 'id'>) => {
    const toast: Toast = {
      ...options,
      id: Date.now().toString(),
      duration: options.duration || 3000
    }
    
    toasts.value.push(toast)
    
    // Auto remove after duration
    if (toast.duration && toast.duration > 0) {
      setTimeout(() => {
        removeToast(toast.id)
      }, toast.duration)
    }
  }
  
  const removeToast = (id: string) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }
  
  // Helper methods for common toast types
  const success = (message: string, description?: string) => {
    showToast({
      title: message,
      description,
      type: 'success'
    })
  }

  const error = (message: string, description?: string) => {
    showToast({
      title: message,
      description,
      type: 'error'
    })
  }

  const info = (message: string, description?: string) => {
    showToast({
      title: message,
      description,
      type: 'info'
    })
  }

  const warning = (message: string, description?: string) => {
    showToast({
      title: message,
      description,
      type: 'warning'
    })
  }

  return {
    toasts: readonly(toasts),
    showToast,
    removeToast,
    success,
    error,
    info,
    warning
  }
}
