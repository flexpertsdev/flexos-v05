export interface VisionDocument {
  id?: string
  project_id: string
  elevator_pitch: string
  user_personas: string[]
  pain_points: string[]
  key_features: string[]
  created_at?: string
  updated_at?: string
}

export interface VisionUpdate {
  elevator_pitch?: string
  user_personas?: string[]
  pain_points?: string[]
  key_features?: string[]
}

// New structured vision document
export interface StructuredVisionDocument {
  id?: string
  project_id: string
  
  // Core Vision
  project_name: string
  tagline: string
  description: string
  
  // Key Objectives
  objectives: string[]
  
  // Target Audience
  target_users: {
    primary: string[]
    secondary: string[]
  }
  
  // Problem & Solution
  problems: string[]
  solutions: string[]
  
  // Features & Capabilities
  core_features: string[]
  nice_to_have_features: string[]
  
  // User Journeys
  user_journeys: {
    title: string
    description: string
    steps: string[]
  }[]
  
  // Design Principles
  design_principles: string[]
  brand_personality: string[]
  
  // Technical Considerations
  tech_stack: string[]
  integrations: string[]
  
  // Success Metrics
  success_metrics: string[]
  
  // Competitive Advantage
  unique_value_props: string[]
  
  created_at?: string
  updated_at?: string
}
