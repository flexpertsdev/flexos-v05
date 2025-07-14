import type { VisionDocument } from '~/types/vision'

interface ExtractedConcept {
  pages?: string[]
  features?: string[]
  user_journeys?: string[]
  design_elements?: string[]
}

// Extract actionable concepts from vision document
export function extractConceptsFromVision(vision: VisionDocument): ExtractedConcept {
  const concepts: ExtractedConcept = {
    pages: [],
    features: [],
    user_journeys: [],
    design_elements: []
  }
  
  // Extract pages from features
  if (vision.key_features?.length) {
    // Dashboard is usually needed
    concepts.pages?.push('Dashboard')
    
    // Extract pages from features
    vision.key_features.forEach(feature => {
      const lower = feature.toLowerCase()
      
      // User management
      if (lower.includes('user') || lower.includes('auth') || lower.includes('login')) {
        concepts.pages?.push('Login', 'Register', 'Profile')
      }
      
      // Settings
      if (lower.includes('setting') || lower.includes('config')) {
        concepts.pages?.push('Settings')
      }
      
      // Analytics
      if (lower.includes('analytic') || lower.includes('report')) {
        concepts.pages?.push('Analytics')
      }
      
      // Messaging
      if (lower.includes('message') || lower.includes('chat')) {
        concepts.pages?.push('Messages')
      }
      
      // Marketplace
      if (lower.includes('marketplace') || lower.includes('shop')) {
        concepts.pages?.push('Marketplace', 'Product Details')
      }
    })
  }
  
  // Extract user journeys from personas and pain points
  if (vision.user_personas?.length && vision.pain_points?.length) {
    // Create journeys based on solving pain points
    vision.pain_points.forEach((pain, index) => {
      const journey = `User discovers solution for: ${pain}`
      concepts.user_journeys?.push(journey)
    })
    
    // Onboarding journey
    concepts.user_journeys?.push('First-time user onboarding')
  }
  
  // Extract design elements based on the vibe
  if (vision.elevator_pitch) {
    const pitch = vision.elevator_pitch.toLowerCase()
    
    // Professional/Enterprise
    if (pitch.includes('enterprise') || pitch.includes('professional')) {
      concepts.design_elements?.push('Clean layouts', 'Data tables', 'Charts', 'Professional color scheme')
    }
    
    // Social/Community
    if (pitch.includes('social') || pitch.includes('community')) {
      concepts.design_elements?.push('User avatars', 'Activity feeds', 'Comments', 'Reactions')
    }
    
    // Creative/Fun
    if (pitch.includes('creative') || pitch.includes('fun')) {
      concepts.design_elements?.push('Playful animations', 'Bright colors', 'Interactive elements')
    }
  }
  
  // Remove duplicates
  concepts.pages = [...new Set(concepts.pages)]
  concepts.features = [...new Set(concepts.features)]
  concepts.user_journeys = [...new Set(concepts.user_journeys)]
  concepts.design_elements = [...new Set(concepts.design_elements)]
  
  return concepts
}

// Generate initial mockups based on vision
export async function generateMockupsFromVision(
  projectId: string,
  vision: VisionDocument,
  supabase: any
) {
  const concepts = extractConceptsFromVision(vision)
  
  // Create pages
  if (concepts.pages?.length) {
    for (const pageName of concepts.pages) {
      await supabase.from('pages').insert({
        project_id: projectId,
        name: pageName,
        path: `/${pageName.toLowerCase().replace(/\s+/g, '-')}`,
        is_generated: true
      })
    }
  }
  
  // Create features
  if (concepts.features?.length) {
    for (const featureName of concepts.features) {
      await supabase.from('features').insert({
        project_id: projectId,
        name: featureName,
        description: `Auto-generated from vision`,
        status: 'planned',
        is_generated: true
      })
    }
  }
  
  // Create user journeys
  if (concepts.user_journeys?.length) {
    for (const journeyName of concepts.user_journeys) {
      await supabase.from('user_journeys').insert({
        project_id: projectId,
        name: journeyName,
        description: `Auto-generated from vision`,
        is_generated: true
      })
    }
  }
  
  return concepts
}
