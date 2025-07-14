// Vision Document Type Definitions
// For real-time collaborative vision building in Focus mode

export interface VisionDocument {
  id: string
  project_id: string
  version: number
  last_updated: string
  
  // Core Vision
  elevator_pitch?: string
  problem_statement?: string
  solution_overview?: string
  
  // Discovery Insights
  target_users: UserPersona[]
  pain_points: PainPoint[]
  opportunities: Opportunity[]
  
  // Feature Ideas
  core_features: Feature[]
  nice_to_haves: Feature[]
  future_ideas: Feature[]
  
  // Design Direction
  design_principles: string[]
  inspiration_references: Reference[]
  emotional_goals: string[]
  
  // Technical Hints
  platform_preferences?: string[]
  performance_needs?: string[]
  integration_requirements?: string[]
  
  // Business Thinking
  value_proposition?: string
  monetization_ideas?: string[]
  success_metrics?: string[]
  
  // Meta
  discovered_themes: Theme[]
  conversation_highlights: Highlight[]
  confidence_scores: {
    problem_understanding: number
    solution_clarity: number
    user_definition: number
    feature_completeness: number
  }
}

export interface UserPersona {
  id: string
  name?: string
  description: string
  needs: string[]
  frustrations: string[]
  quote?: string
  discovered_at: string
}

export interface PainPoint {
  id: string
  description: string
  severity: 'mild' | 'moderate' | 'severe'
  frequency: 'rare' | 'occasional' | 'frequent' | 'constant'
  quote?: string
  discovered_at: string
}

export interface Opportunity {
  id: string
  description: string
  impact: 'low' | 'medium' | 'high'
  discovered_at: string
}

export interface Feature {
  id: string
  name: string
  description: string
  user_value: string
  priority?: 'must-have' | 'should-have' | 'nice-to-have'
  discovered_at: string
  related_pain_points: string[]
}

export interface Reference {
  id: string
  name: string
  type: 'app' | 'website' | 'experience' | 'feeling'
  what_we_like: string
  discovered_at: string
}

export interface Theme {
  id: string
  name: string
  mentions: number
  first_mentioned: string
  related_quotes: string[]
}

export interface Highlight {
  id: string
  quote: string
  insight: string
  timestamp: string
  impact: 'low' | 'medium' | 'high'
}

// Real-time update events
export interface VisionUpdate {
  type: VisionUpdateType
  path: string
  value: any
  metadata: {
    quote?: string
    confidence?: number
    source_message_id?: string
  }
}

export type VisionUpdateType = 
  | 'set'      // Set a single field
  | 'append'   // Add to an array
  | 'update'   // Update existing item
  | 'remove'   // Remove from array
  | 'increment' // Increase counter
