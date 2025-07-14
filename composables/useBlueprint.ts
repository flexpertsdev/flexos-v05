import type { BlueprintUpdate, AppBlueprint } from '~/types/blueprint'

export const useBlueprint = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  
  // Current blueprint state
  const blueprint = useState<AppBlueprint | null>('blueprint', () => null)
  const isLoading = useState<boolean>('blueprint-loading', () => false)
  const lastUpdate = useState<Date | null>('blueprint-last-update', () => null)
  
  // Load blueprint for a project
  const loadBlueprint = async (projectId: string) => {
    if (!user.value) return
    
    isLoading.value = true
    try {
      const { data, error } = await supabase
        .from('vision_documents')
        .select('*')
        .eq('project_id', projectId)
        .single()
      
      if (error) {
        console.error('Failed to load blueprint:', error)
        return
      }
      
      // Transform database format to blueprint format
      blueprint.value = transformToBlueprint(data)
      lastUpdate.value = new Date(data.last_extracted || data.updated_at)
      
    } catch (error) {
      console.error('Blueprint load error:', error)
    } finally {
      isLoading.value = false
    }
  }
  
  // Apply blueprint updates in real-time
  const applyBlueprintUpdate = async (projectId: string, update: BlueprintUpdate) => {
    if (!user.value || !update) return
    
    try {
      // Merge updates with existing blueprint
      if (blueprint.value) {
        // Update actions
        if (update.actions) {
          blueprint.value.actions = mergeActions(
            blueprint.value.actions || [],
            update.actions
          )
        }
        
        // Update data types
        if (update.dataTypes) {
          blueprint.value.dataTypes = mergeDataTypes(
            blueprint.value.dataTypes || [],
            update.dataTypes
          )
        }
        
        // Update views
        if (update.views) {
          blueprint.value.views = mergeViews(
            blueprint.value.views || [],
            update.views
          )
        }
        
        // Update workflows
        if (update.workflows) {
          blueprint.value.workflows = mergeWorkflows(
            blueprint.value.workflows || [],
            update.workflows
          )
        }
      }
      
      // Save to database using the merge function
      const { error } = await supabase.rpc('merge_blueprint_update', {
        doc_id: projectId,
        new_actions: update.actions || [],
        new_data: update.dataTypes || [],
        new_views: update.views || [],
        new_workflows: update.workflows || [],
        new_features: update.features || []
      })
      
      if (error) {
        console.error('Failed to save blueprint update:', error)
      } else {
        lastUpdate.value = new Date()
      }
      
    } catch (error) {
      console.error('Blueprint update error:', error)
    }
  }
  
  // Watch for real-time updates
  const watchBlueprintUpdates = (projectId: string) => {
    const channel = supabase
      .channel(`blueprint-${projectId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'vision_documents',
          filter: `project_id=eq.${projectId}`
        },
        (payload) => {
          console.log('Blueprint update received:', payload)
          if (payload.new) {
            blueprint.value = transformToBlueprint(payload.new)
            lastUpdate.value = new Date()
          }
        }
      )
      .subscribe()
    
    // Cleanup on unmount
    onUnmounted(() => {
      channel.unsubscribe()
    })
  }
  
  // Calculate blueprint completeness
  const completeness = computed(() => {
    if (!blueprint.value) return 0
    
    const scores = {
      identity: calculateIdentityScore(blueprint.value),
      data: Math.min((blueprint.value.dataTypes?.length || 0) * 20, 100),
      actions: Math.min((blueprint.value.actions?.length || 0) * 10, 100),
      views: Math.min((blueprint.value.views?.length || 0) * 17, 100),
      features: Math.min((blueprint.value.features?.length || 0) * 25, 100)
    }
    
    return Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / 5)
  })
  
  // Get suggested next actions based on blueprint state
  const suggestedActions = computed(() => {
    const suggestions = []
    
    if (!blueprint.value) {
      suggestions.push({
        label: 'Start a conversation',
        description: 'Tell me about your app idea',
        action: 'start-focus-mode'
      })
      return suggestions
    }
    
    // Suggest based on what's missing
    if (!blueprint.value.name || !blueprint.value.description) {
      suggestions.push({
        label: 'Define your app',
        description: 'What is your app and what does it do?',
        action: 'define-identity'
      })
    }
    
    if ((blueprint.value.actions?.length || 0) < 5) {
      suggestions.push({
        label: 'Add more actions',
        description: 'What else can users do in your app?',
        action: 'add-actions'
      })
    }
    
    if ((blueprint.value.dataTypes?.length || 0) < 3) {
      suggestions.push({
        label: 'Define your data',
        description: 'What information does your app work with?',
        action: 'define-data'
      })
    }
    
    if ((blueprint.value.views?.length || 0) < 3) {
      suggestions.push({
        label: 'Design your views',
        description: 'What screens do users need?',
        action: 'design-views'
      })
    }
    
    if (completeness.value > 70) {
      suggestions.push({
        label: 'Start building',
        description: 'Your blueprint is ready!',
        action: 'switch-to-builder'
      })
    }
    
    return suggestions
  })
  
  return {
    blueprint: readonly(blueprint),
    isLoading: readonly(isLoading),
    lastUpdate: readonly(lastUpdate),
    completeness,
    suggestedActions,
    loadBlueprint,
    applyBlueprintUpdate,
    watchBlueprintUpdates
  }
}

// Helper functions
function transformToBlueprint(data: any): AppBlueprint {
  return {
    name: data.app_name || data.project_name || '',
    tagline: data.app_tagline || data.tagline || '',
    description: data.app_description || data.description || '',
    dna: data.app_dna || [],
    similarTo: data.similar_apps || [],
    
    dataTypes: data.blueprint_data || [],
    actions: data.blueprint_actions || [],
    views: data.blueprint_views || [],
    workflows: data.blueprint_workflows || [],
    features: data.blueprint_features || [],
    
    integrations: data.blueprint_integrations || [],
    performance: {
      loadTime: '2s',
      offline: false,
      realtime: [],
      caching: []
    },
    
    metrics: data.blueprint_metrics || [],
    
    version: '1.0',
    lastUpdated: data.last_extracted || data.updated_at,
    completeness: data.blueprint_completeness || {
      overall: 0,
      identity: 0,
      data: 0,
      actions: 0,
      views: 0,
      features: 0
    }
  }
}

function calculateIdentityScore(blueprint: AppBlueprint): number {
  let score = 0
  if (blueprint.name) score += 25
  if (blueprint.tagline) score += 25
  if (blueprint.description) score += 25
  if (blueprint.dna.length > 0) score += 25
  return score
}

function mergeActions(existing: any[], updates: any[]): any[] {
  const merged = [...existing]
  
  updates.forEach(update => {
    const existingIndex = merged.findIndex(
      a => a.verb === update.verb && a.target === update.target
    )
    
    if (existingIndex >= 0) {
      // Update existing action
      merged[existingIndex] = { ...merged[existingIndex], ...update }
    } else {
      // Add new action
      merged.push({
        id: `${update.verb}-${update.target}`.toLowerCase(),
        ...update
      })
    }
  })
  
  return merged
}

function mergeDataTypes(existing: any[], updates: any[]): any[] {
  const merged = [...existing]
  
  updates.forEach(update => {
    const existingIndex = merged.findIndex(d => d.name === update.name)
    
    if (existingIndex >= 0) {
      merged[existingIndex] = { ...merged[existingIndex], ...update }
    } else {
      merged.push(update)
    }
  })
  
  return merged
}

function mergeViews(existing: any[], updates: any[]): any[] {
  const merged = [...existing]
  
  updates.forEach(update => {
    const existingIndex = merged.findIndex(v => v.name === update.name)
    
    if (existingIndex >= 0) {
      merged[existingIndex] = { ...merged[existingIndex], ...update }
    } else {
      merged.push({
        id: update.name.toLowerCase().replace(/\s+/g, '-'),
        ...update
      })
    }
  })
  
  return merged
}

function mergeWorkflows(existing: any[], updates: any[]): any[] {
  const merged = [...existing]
  
  updates.forEach(update => {
    const existingIndex = merged.findIndex(w => w.name === update.name)
    
    if (existingIndex >= 0) {
      merged[existingIndex] = { ...merged[existingIndex], ...update }
    } else {
      merged.push(update)
    }
  })
  
  return merged
}