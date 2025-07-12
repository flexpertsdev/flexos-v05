/**
 * Wizard System Type Definitions
 */

export interface WizardConfig {
  id: string
  name: string
  description: string
  icon: string
  category: 'project' | 'feature' | 'component' | 'debug' | 'design'
  version: string
  phases: WizardPhase[]
  outputs: WizardOutput[]
  settings?: WizardSettings
}

export interface WizardPhase {
  id: string
  name: string
  type: 'question' | 'analysis' | 'selection' | 'validation' | 'review'
  prompt: string
  helpText?: string
  inputType: WizardInputType
  options?: WizardOption[]
  validation?: ValidationRules
  branching?: BranchingLogic
  aiConfig?: AIPhaseConfig
  dependencies?: string[] // Phase IDs this phase depends on
}

export type WizardInputType = 
  | 'text'
  | 'textarea'
  | 'url'
  | 'email'
  | 'number'
  | 'checkbox'
  | 'checkboxes'
  | 'radio'
  | 'select'
  | 'multiselect'
  | 'grid'
  | 'file'
  | 'code'
  | 'date'
  | 'color'
  | 'style-grid'

export interface WizardOption {
  id: string
  label: string
  value: string | number | boolean
  icon?: string
  description?: string
  metadata?: Record<string, any>
  branchTo?: string // Phase ID to branch to if selected
}

export interface ValidationRules {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: string
  min?: number
  max?: number
  email?: boolean
  url?: boolean
  custom?: string // Custom validation function name
  message?: string // Custom error message
}

export interface BranchingLogic {
  conditions: BranchCondition[]
  default?: string // Default phase ID if no conditions match
}

export interface BranchCondition {
  if: {
    phase: string
    operator: 'equals' | 'contains' | 'matches' | 'in' | 'not_in'
    value: any
  }
  then: string // Phase ID to go to
}

export interface AIPhaseConfig {
  enabled: boolean
  model?: 'gpt-4' | 'gpt-4-turbo-preview' | 'gpt-3.5-turbo' | 'claude-3'
  temperature?: number
  maxTokens?: number
  systemPrompt?: string
  analysisType?: 'website' | 'code' | 'requirements' | 'design'
  streaming?: boolean
}

export interface WizardOutput {
  id: string
  name: string
  type: 'code' | 'config' | 'documentation' | 'design' | 'plan'
  template?: string
  generator?: string // Function name for custom generation
  files?: OutputFile[]
}

export interface OutputFile {
  path: string
  content?: string
  template?: string
  generator?: string
}

export interface WizardSettings {
  allowBackNavigation?: boolean
  saveProgress?: boolean
  estimatedTime?: number // in minutes
  requiredPhases?: string[]
  theme?: 'default' | 'dark' | 'custom'
}

// Runtime types
export interface WizardSession {
  id: string
  wizardId: string
  userId?: string
  startedAt: Date
  updatedAt: Date
  currentPhase: string
  answers: WizardAnswers
  context: WizardContext
  status: 'active' | 'paused' | 'completed' | 'abandoned'
}

export interface WizardAnswers {
  [phaseId: string]: any
}

export interface WizardContext {
  sessionId: string
  previousPhases: string[]
  metadata: Record<string, any>
  aiContext?: AIContext
}

export interface AIContext {
  conversationHistory: AIMessage[]
  extractedEntities: Record<string, any>
  userPreferences: Record<string, any>
}

export interface AIMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
  timestamp: Date
  metadata?: Record<string, any>
}

// API Request/Response types
export interface WizardChatRequest {
  wizardId: string
  phaseId: string
  message: string
  context: WizardContext
}

export interface WizardChatResponse {
  success: boolean
  data?: {
    response: string
    nextPhase?: string
    suggestions?: string[]
    analysis?: Record<string, any>
  }
  error?: string
}

export interface WizardAnalysisRequest {
  type: 'website' | 'code' | 'requirements' | 'design'
  data: any
  context?: WizardContext
}

export interface WizardAnalysisResponse {
  success: boolean
  data?: {
    analysis: Record<string, any>
    recommendations: string[]
    issues?: string[]
    score?: number
  }
  error?: string
}

export interface WizardGenerateRequest {
  wizardId: string
  answers: WizardAnswers
  outputType?: string
}

export interface WizardGenerateResponse {
  success: boolean
  data?: {
    files: GeneratedFile[]
    summary: string
    nextSteps?: string[]
  }
  error?: string
}

export interface GeneratedFile {
  path: string
  content: string
  language?: string
  description?: string
}