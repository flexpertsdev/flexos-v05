// App Blueprint Type System - The practical blueprint for building apps

// Data Categories
export type DataCategory = 'stored' | 'computed' | 'external' | 'static' | 'state'
export type DataSource = 'supabase' | 'api' | 'constants' | 'memory' | 'cache'
export type DataOperation = 'create' | 'read' | 'update' | 'delete' | 'query' | 'subscribe'

// Data Type Definition
export interface DataType {
  name: string                    // e.g., "User", "Photo", "PaymentIntent"
  category: DataCategory
  source: DataSource
  description?: string
  
  // For stored data
  tableName?: string              // Supabase table
  operations?: DataOperation[]    // Allowed operations
  indexes?: string[]              // Indexed fields
  relationships?: DataRelation[]  // FK relationships
  
  // For external data
  service?: string                // e.g., "Stripe", "OpenWeather"
  endpoint?: string               // API endpoint
  direction?: 'outbound' | 'inbound'
  
  // For computed data
  dependencies?: string[]         // Other data types it depends on
  
  // For static data
  values?: any                    // Actual constant values
  
  // For state data
  scope?: 'global' | 'view' | 'component'
  persistence?: 'none' | 'session' | 'local'
}

export interface DataRelation {
  type: 'one-to-one' | 'one-to-many' | 'many-to-many'
  target: string                  // Target data type name
  through?: string                // Junction table for many-to-many
  onDelete?: 'cascade' | 'restrict' | 'set-null'
}

// Action System
export type ActionVerb = 
  | 'SELECT' | 'CREATE' | 'UPDATE' | 'DELETE' 
  | 'VIEW' | 'EDIT' | 'SHARE' | 'COPY'
  | 'ADD' | 'REMOVE' | 'UPLOAD' | 'DOWNLOAD'
  | 'SEND' | 'RECEIVE' | 'ACCEPT' | 'REJECT'
  | 'START' | 'STOP' | 'PAUSE' | 'RESUME'
  | 'SEARCH' | 'FILTER' | 'SORT' | 'GROUP'
  | 'LIKE' | 'COMMENT' | 'RATE' | 'FOLLOW'
  | 'CONNECT' | 'DISCONNECT' | 'INVITE' | 'JOIN'
  | string // Allow custom verbs

export type TriggerType = 'click' | 'tap' | 'swipe' | 'long-press' | 'keyboard' | 'voice' | 'auto'

export interface Action {
  id: string                      // Unique identifier
  verb: ActionVerb                // What the action does
  target: string                  // Data type it acts on
  label?: string                  // UI label
  description?: string            // Detailed description
  
  // Where and how
  contexts: string[]              // View names where available
  triggers: TriggerType[]         // How it's triggered
  
  // What happens
  effects: ActionEffect[]         // Results of the action
  validations?: Validation[]      // Pre-conditions
  
  // Who can do it
  permissions: Permission[]       // Access control
  
  // UI hints
  icon?: string                   // Icon to display
  variant?: 'primary' | 'secondary' | 'danger' | 'success'
  confirmation?: string           // Confirmation message
}

export interface ActionEffect {
  type: 'data-change' | 'navigation' | 'notification' | 'external-call' | 'state-change'
  description: string
  target?: string                 // What changes
  details?: any                   // Effect-specific data
}

export interface Validation {
  type: 'required-field' | 'data-exists' | 'permission' | 'business-rule'
  message: string
  condition?: string              // Validation logic
}

export interface Permission {
  role: 'owner' | 'admin' | 'member' | 'guest' | 'public'
  condition?: string              // Additional conditions
}

// Action Chains (Workflows)
export interface ActionChain {
  id: string
  name: string                    // e.g., "Photo Sharing Flow"
  description: string
  steps: ActionStep[]
  entryPoints: string[]           // Which views can start this
}

export interface ActionStep {
  action: string                  // Action ID
  next?: string[]                 // Possible next actions
  condition?: string              // When this path is taken
  optional?: boolean              // Can be skipped
}

// View System
export type FlexVueType = 
  | 'full-page'                   // Standard page view
  | 'modal'                       // Centered overlay
  | 'bottom-sheet'                // Slides from bottom
  | 'side-panel'                  // Slides from side
  | 'popover'                     // Small overlay
  | 'tab-content'                 // Part of tab view
  | 'split-view'                  // Side-by-side
  | 'inline'                      // Embedded in another view

export interface View {
  id: string
  name: string                    // e.g., "ProfileView"
  purpose: string                 // What it's for
  
  // Data requirements
  data: DataRequirement[]         // What data it needs
  
  // Available actions
  actions: string[]               // Action IDs available here
  
  // View variations
  variants: ViewVariant[]         // Different states/modes
  
  // Presentation
  flexVue: FlexVueType | FlexVueType[]  // How it can be displayed
  layout?: 'list' | 'grid' | 'form' | 'detail' | 'custom'
  
  // Navigation
  routes?: RouteConfig[]          // URL patterns
  parentViews?: string[]          // Can be child of these views
}

export interface DataRequirement {
  dataType: string                // Data type name
  alias?: string                  // Local name in view
  filters?: any                   // Query filters
  required: boolean               // Must load before render
  realtime?: boolean              // Subscribe to changes
}

export interface ViewVariant {
  id: string
  name: string                    // e.g., "EditMode"
  description: string
  dataOverrides?: Partial<DataRequirement>[]
  actionOverrides?: string[]      // Different actions available
  condition?: string              // When this variant is active
}

export interface RouteConfig {
  path: string                    // URL pattern
  params?: string[]               // URL parameters
  guards?: string[]               // Route guards to apply
}

// Feature Definition
export interface Feature {
  id: string
  name: string                    // e.g., "Photo Sharing"
  description: string
  category: string                // Feature category
  
  // What makes up this feature
  actions: string[]               // Action IDs
  views: string[]                 // View IDs
  data: string[]                  // Data type names
  workflows: string[]             // ActionChain IDs
  
  // Dependencies
  dependencies?: string[]         // Other features required
  
  // Business value
  userValue: string               // Why users want this
  businessValue?: string          // Why business wants this
  priority: 'core' | 'important' | 'nice-to-have'
}

// Complete App Blueprint
export interface AppBlueprint {
  // Core Identity
  name: string
  tagline: string
  description: string
  dna: string[]                   // Core principles
  similarTo?: string[]            // Reference apps
  
  // Data Architecture
  dataTypes: DataType[]
  
  // Action System
  actions: Action[]
  workflows: ActionChain[]
  
  // View System
  views: View[]
  navigation: NavigationStructure
  
  // Features
  features: Feature[]
  
  // Technical Specs
  integrations: Integration[]
  performance: PerformanceRequirements
  
  // Success Metrics
  metrics: SuccessMetric[]
  
  // Metadata
  version: string
  lastUpdated: string
  completeness: BlueprintCompleteness
}

export interface NavigationStructure {
  primary: string[]               // Main navigation items
  secondary?: string[]            // Secondary nav
  userFlows: UserFlow[]          // Key user journeys
}

export interface UserFlow {
  name: string
  startView: string
  steps: FlowStep[]
  goal: string
}

export interface FlowStep {
  view: string
  action?: string
  decision?: string
  next: string | string[]
}

export interface Integration {
  name: string
  type: 'payment' | 'auth' | 'storage' | 'email' | 'analytics' | 'api'
  service: string
  purpose: string
  dataFlow: 'outbound' | 'inbound' | 'bidirectional'
}

export interface PerformanceRequirements {
  loadTime: string                // Target load time
  offline: boolean                // Offline capability
  realtime: string[]              // Features needing realtime
  caching: string[]               // What to cache
}

export interface SuccessMetric {
  name: string
  type: 'usage' | 'business' | 'performance' | 'quality'
  target: string | number
  measurement: string
}

export interface BlueprintCompleteness {
  overall: number                 // 0-100
  identity: number
  data: number
  actions: number
  views: number
  features: number
}

// Helper Types for AI Extraction
export interface ExtractedAction {
  verb: string
  target: string
  context?: string
  raw: string                     // Original text
}

export interface ExtractedDataType {
  name: string
  category: DataCategory
  operations?: string[]
  raw: string
}

export interface ExtractedView {
  name: string
  purpose: string
  actions?: string[]
  flexVue?: FlexVueType
  raw: string
}

// Blueprint Update Types
export interface BlueprintUpdate {
  actions?: Partial<Action>[]
  dataTypes?: Partial<DataType>[]
  views?: Partial<View>[]
  features?: Partial<Feature>[]
  workflows?: Partial<ActionChain>[]
}

export interface BlueprintAnalysis {
  strengths: string[]
  gaps: string[]
  suggestions: string[]
  readiness: number               // 0-100
  nextSteps: string[]
}