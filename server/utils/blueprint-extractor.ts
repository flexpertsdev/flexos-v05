import type { 
  BlueprintUpdate, 
  ExtractedAction, 
  ExtractedDataType, 
  ExtractedView,
  ActionVerb,
  DataCategory,
  DataOperation 
} from '~/types/blueprint'

// Common action verbs in app descriptions
const ACTION_VERBS: Record<string, ActionVerb> = {
  // Creation
  'create': 'CREATE', 'add': 'ADD', 'upload': 'UPLOAD', 'post': 'CREATE',
  'submit': 'CREATE', 'generate': 'CREATE', 'make': 'CREATE',
  
  // Selection/Viewing
  'select': 'SELECT', 'choose': 'SELECT', 'pick': 'SELECT', 'tap': 'SELECT',
  'click': 'SELECT', 'view': 'VIEW', 'see': 'VIEW', 'browse': 'VIEW',
  'look': 'VIEW', 'check': 'VIEW', 'open': 'VIEW',
  
  // Modification
  'edit': 'EDIT', 'update': 'UPDATE', 'change': 'UPDATE', 'modify': 'UPDATE',
  'delete': 'DELETE', 'remove': 'DELETE', 'cancel': 'DELETE',
  
  // Sharing/Communication
  'share': 'SHARE', 'send': 'SEND', 'invite': 'INVITE', 'message': 'SEND',
  'email': 'SEND', 'notify': 'SEND', 'copy': 'COPY',
  
  // Social
  'like': 'LIKE', 'favorite': 'LIKE', 'comment': 'COMMENT', 'rate': 'RATE',
  'follow': 'FOLLOW', 'connect': 'CONNECT', 'friend': 'CONNECT',
  
  // Navigation/Flow
  'search': 'SEARCH', 'filter': 'FILTER', 'sort': 'SORT', 'find': 'SEARCH',
  'discover': 'SEARCH', 'explore': 'VIEW',
  
  // Transactions
  'buy': 'CREATE', 'purchase': 'CREATE', 'pay': 'SEND', 'order': 'CREATE',
  'book': 'CREATE', 'reserve': 'CREATE',
  
  // Authentication
  'login': 'CONNECT', 'logout': 'DISCONNECT', 'signin': 'CONNECT', 
  'signup': 'CREATE', 'register': 'CREATE'
}

// Data type indicators
const DATA_INDICATORS = {
  stored: ['user', 'profile', 'account', 'post', 'item', 'product', 'order', 
           'message', 'comment', 'review', 'photo', 'video', 'document'],
  computed: ['score', 'ranking', 'recommendation', 'suggestion', 'analysis',
             'summary', 'preview', 'thumbnail', 'statistics'],
  external: ['payment', 'weather', 'map', 'location', 'email', 'sms',
             'notification', 'verification', 'authentication'],
  static: ['category', 'type', 'status', 'role', 'permission', 'setting',
           'configuration', 'option', 'preference'],
  state: ['selected', 'active', 'current', 'mode', 'filter', 'sort',
          'view', 'tab', 'step', 'progress']
}

// View type indicators
const VIEW_INDICATORS = {
  'full-page': ['page', 'screen', 'view', 'dashboard', 'home', 'profile'],
  'modal': ['popup', 'dialog', 'modal', 'overlay', 'confirmation'],
  'bottom-sheet': ['sheet', 'drawer', 'panel', 'options', 'actions'],
  'tab-content': ['tab', 'section', 'category'],
  'list': ['list', 'feed', 'timeline', 'history', 'results'],
  'grid': ['grid', 'gallery', 'collection', 'catalog'],
  'form': ['form', 'input', 'editor', 'creator', 'wizard']
}

export function extractActionsFromText(text: string): ExtractedAction[] {
  const actions: ExtractedAction[] = []
  const sentences = text.toLowerCase().split(/[.!?]+/)
  
  for (const sentence of sentences) {
    // Look for action verbs
    for (const [word, verb] of Object.entries(ACTION_VERBS)) {
      if (sentence.includes(word)) {
        // Try to find what the action targets
        const target = extractActionTarget(sentence, word)
        if (target) {
          actions.push({
            verb,
            target,
            context: extractContext(sentence),
            raw: sentence.trim()
          })
        }
      }
    }
  }
  
  return deduplicateActions(actions)
}

export function extractDataTypesFromText(text: string): ExtractedDataType[] {
  const dataTypes: ExtractedDataType[] = []
  const words = text.toLowerCase().split(/\s+/)
  
  // Look for data indicators
  for (const [category, indicators] of Object.entries(DATA_INDICATORS)) {
    for (const indicator of indicators) {
      if (text.toLowerCase().includes(indicator)) {
        // Extract the full data type name
        const name = extractDataTypeName(text, indicator)
        if (name) {
          dataTypes.push({
            name: capitalizeWords(name),
            category: category as DataCategory,
            operations: inferOperations(name, category as DataCategory),
            raw: indicator
          })
        }
      }
    }
  }
  
  return deduplicateDataTypes(dataTypes)
}

export function extractViewsFromText(text: string): ExtractedView[] {
  const views: ExtractedView[] = []
  const sentences = text.toLowerCase().split(/[.!?]+/)
  
  for (const sentence of sentences) {
    // Look for view indicators
    for (const [flexVue, indicators] of Object.entries(VIEW_INDICATORS)) {
      for (const indicator of indicators) {
        if (sentence.includes(indicator)) {
          const name = extractViewName(sentence, indicator)
          if (name) {
            views.push({
              name: createViewName(name),
              purpose: sentence.trim(),
              flexVue: flexVue as any,
              raw: sentence.trim()
            })
          }
        }
      }
    }
  }
  
  return deduplicateViews(views)
}

// Helper functions
function extractActionTarget(sentence: string, verb: string): string | null {
  // Common patterns: "verb a/an/the target", "verb targets"
  const patterns = [
    new RegExp(`${verb}\\s+(?:a|an|the)\\s+(\\w+)`, 'i'),
    new RegExp(`${verb}\\s+(\\w+)s?`, 'i'),
    new RegExp(`${verb}\\s+(?:new|multiple|their)\\s+(\\w+)`, 'i')
  ]
  
  for (const pattern of patterns) {
    const match = sentence.match(pattern)
    if (match && match[1]) {
      return capitalizeWords(match[1])
    }
  }
  
  return null
}

function extractContext(sentence: string): string | undefined {
  // Look for context clues like "in the", "on the", "from"
  const contextPattern = /(?:in|on|from|at|within)\s+(?:the|a|an)?\s*([\w\s]+?)(?:\s+(?:to|and|or|when)|$)/i
  const match = sentence.match(contextPattern)
  return match ? match[1].trim() : undefined
}

function extractDataTypeName(text: string, indicator: string): string | null {
  // Look for the indicator with surrounding context
  const pattern = new RegExp(`(\\w+\\s+)?${indicator}(\\s+\\w+)?`, 'i')
  const match = text.match(pattern)
  if (match) {
    const before = match[1]?.trim()
    const after = match[2]?.trim()
    
    // Prefer compound names like "user profile" or "product review"
    if (before && isDescriptive(before)) {
      return `${before} ${indicator}`
    } else if (after && isDescriptive(after)) {
      return `${indicator} ${after}`
    }
    return indicator
  }
  return null
}

function extractViewName(sentence: string, indicator: string): string | null {
  // Extract descriptive name around the indicator
  const words = sentence.split(/\s+/)
  const index = words.findIndex(w => w.includes(indicator))
  
  if (index >= 0) {
    // Look for descriptive words before the indicator
    if (index > 0 && isDescriptive(words[index - 1])) {
      return `${words[index - 1]} ${indicator}`
    }
    // Or just use the indicator
    return indicator
  }
  
  return null
}

function createViewName(base: string): string {
  // Convert to PascalCase and add "View" suffix if needed
  const name = capitalizeWords(base).replace(/\s+/g, '')
  return name.endsWith('View') ? name : `${name}View`
}

function inferOperations(dataType: string, category: DataCategory): DataOperation[] {
  switch (category) {
    case 'stored':
      return ['create', 'read', 'update', 'delete', 'query']
    case 'computed':
      return ['read', 'query']
    case 'external':
      return ['read', 'create']
    case 'static':
      return ['read']
    case 'state':
      return ['read', 'update']
    default:
      return ['read']
  }
}

function isDescriptive(word: string): boolean {
  // Check if word is descriptive (not a common word)
  const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for']
  return !commonWords.includes(word.toLowerCase()) && word.length > 2
}

function capitalizeWords(text: string): string {
  return text.split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function deduplicateActions(actions: ExtractedAction[]): ExtractedAction[] {
  const seen = new Set<string>()
  return actions.filter(action => {
    const key = `${action.verb}-${action.target}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function deduplicateDataTypes(dataTypes: ExtractedDataType[]): ExtractedDataType[] {
  const seen = new Set<string>()
  return dataTypes.filter(dt => {
    if (seen.has(dt.name)) return false
    seen.add(dt.name)
    return true
  })
}

function deduplicateViews(views: ExtractedView[]): ExtractedView[] {
  const seen = new Set<string>()
  return views.filter(view => {
    if (seen.has(view.name)) return false
    seen.add(view.name)
    return true
  })
}

// Main extraction function for real-time updates
export function extractBlueprintUpdates(text: string): BlueprintUpdate {
  const actions = extractActionsFromText(text)
  const dataTypes = extractDataTypesFromText(text)
  const views = extractViewsFromText(text)
  
  return {
    actions: actions.map(a => ({
      verb: a.verb,
      target: a.target,
      description: `${a.verb} ${a.target}`,
      contexts: a.context ? [a.context] : []
    })),
    
    dataTypes: dataTypes.map(dt => ({
      name: dt.name,
      category: dt.category,
      operations: dt.operations as DataOperation[]
    })),
    
    views: views.map(v => ({
      name: v.name,
      purpose: v.purpose,
      flexVue: v.flexVue
    }))
  }
}