import type { 
  WizardChatRequest, 
  WizardAnalysisRequest, 
  WizardGenerateRequest 
} from '~/types/wizard'

interface ValidationResult {
  valid: boolean
  error?: string
}

/**
 * Validate chat request
 */
export function validateChatRequest(body: any): ValidationResult {
  if (!body) {
    return { valid: false, error: 'Request body is required' }
  }
  
  const { wizardId, phaseId, message, context } = body
  
  if (!wizardId || typeof wizardId !== 'string') {
    return { valid: false, error: 'Valid wizard ID is required' }
  }
  
  if (!phaseId || typeof phaseId !== 'string') {
    return { valid: false, error: 'Valid phase ID is required' }
  }
  
  if (!message || typeof message !== 'string') {
    return { valid: false, error: 'Message is required' }
  }
  
  if (!context || typeof context !== 'object') {
    return { valid: false, error: 'Context object is required' }
  }
  
  if (!context.sessionId) {
    return { valid: false, error: 'Session ID is required in context' }
  }
  
  return { valid: true }
}

/**
 * Validate analysis request
 */
export function validateAnalysisRequest(body: any): ValidationResult {
  if (!body) {
    return { valid: false, error: 'Request body is required' }
  }
  
  const { type, data } = body
  
  if (!type || typeof type !== 'string') {
    return { valid: false, error: 'Analysis type is required' }
  }
  
  const validTypes = ['website', 'code', 'requirements', 'design']
  if (!validTypes.includes(type)) {
    return { valid: false, error: `Invalid analysis type. Must be one of: ${validTypes.join(', ')}` }
  }
  
  if (!data) {
    return { valid: false, error: 'Analysis data is required' }
  }
  
  // Type-specific validation
  switch (type) {
    case 'website':
      if (!data.url || !isValidUrl(data.url)) {
        return { valid: false, error: 'Valid URL is required for website analysis' }
      }
      break
    
    case 'code':
      if (!data.code || typeof data.code !== 'string') {
        return { valid: false, error: 'Code string is required for code analysis' }
      }
      if (!data.language) {
        return { valid: false, error: 'Programming language is required for code analysis' }
      }
      break
    
    case 'requirements':
      if (!data.text || typeof data.text !== 'string') {
        return { valid: false, error: 'Requirements text is required' }
      }
      break
    
    case 'design':
      if (!data || typeof data !== 'object') {
        return { valid: false, error: 'Design data object is required' }
      }
      break
  }
  
  return { valid: true }
}

/**
 * Validate generate request
 */
export function validateGenerateRequest(body: any): ValidationResult {
  if (!body) {
    return { valid: false, error: 'Request body is required' }
  }
  
  const { wizardId, answers } = body
  
  if (!wizardId || typeof wizardId !== 'string') {
    return { valid: false, error: 'Valid wizard ID is required' }
  }
  
  if (!answers || typeof answers !== 'object') {
    return { valid: false, error: 'Answers object is required' }
  }
  
  if (Object.keys(answers).length === 0) {
    return { valid: false, error: 'At least one answer is required' }
  }
  
  return { valid: true }
}

/**
 * Validate URL format
 */
function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return ['http:', 'https:'].includes(parsed.protocol)
  } catch {
    return false
  }
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate project name format
 */
export function isValidProjectName(name: string): boolean {
  const projectNameRegex = /^[a-zA-Z0-9-_]+$/
  return projectNameRegex.test(name) && name.length >= 2 && name.length <= 50
}

/**
 * Validate component name format (PascalCase)
 */
export function isValidComponentName(name: string): boolean {
  const componentNameRegex = /^[A-Z][a-zA-Z0-9]*$/
  return componentNameRegex.test(name) && name.length >= 2 && name.length <= 50
}

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

/**
 * Validate file path
 */
export function isValidFilePath(path: string): boolean {
  // Prevent directory traversal
  if (path.includes('..') || path.includes('~')) {
    return false
  }
  
  // Check for valid characters
  const validPathRegex = /^[a-zA-Z0-9-_./]+$/
  return validPathRegex.test(path)
}

/**
 * Validate wizard phase input based on input type
 */
export function validatePhaseInput(
  value: any,
  inputType: string,
  validation?: any
): ValidationResult {
  // Type-specific validation
  switch (inputType) {
    case 'text':
    case 'textarea':
      if (typeof value !== 'string') {
        return { valid: false, error: 'Text input must be a string' }
      }
      break
    
    case 'number':
      if (typeof value !== 'number' && isNaN(Number(value))) {
        return { valid: false, error: 'Must be a valid number' }
      }
      break
    
    case 'email':
      if (!isValidEmail(value)) {
        return { valid: false, error: 'Must be a valid email address' }
      }
      break
    
    case 'url':
      if (!isValidUrl(value)) {
        return { valid: false, error: 'Must be a valid URL' }
      }
      break
    
    case 'checkbox':
      if (typeof value !== 'boolean') {
        return { valid: false, error: 'Checkbox must be true or false' }
      }
      break
    
    case 'checkboxes':
    case 'multiselect':
      if (!Array.isArray(value)) {
        return { valid: false, error: 'Multiple selection must be an array' }
      }
      break
    
    case 'radio':
    case 'select':
      if (!value) {
        return { valid: false, error: 'Selection is required' }
      }
      break
  }
  
  // Custom validation rules
  if (validation) {
    if (validation.required && !value) {
      return { 
        valid: false, 
        error: validation.message || 'This field is required' 
      }
    }
    
    if (validation.minLength && value.length < validation.minLength) {
      return { 
        valid: false, 
        error: validation.message || `Minimum length is ${validation.minLength}` 
      }
    }
    
    if (validation.maxLength && value.length > validation.maxLength) {
      return { 
        valid: false, 
        error: validation.message || `Maximum length is ${validation.maxLength}` 
      }
    }
    
    if (validation.min && Number(value) < validation.min) {
      return { 
        valid: false, 
        error: validation.message || `Minimum value is ${validation.min}` 
      }
    }
    
    if (validation.max && Number(value) > validation.max) {
      return { 
        valid: false, 
        error: validation.message || `Maximum value is ${validation.max}` 
      }
    }
    
    if (validation.pattern && !new RegExp(validation.pattern).test(value)) {
      return { 
        valid: false, 
        error: validation.message || 'Invalid format' 
      }
    }
  }
  
  return { valid: true }
}