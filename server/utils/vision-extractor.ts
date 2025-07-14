import type { VisionUpdate } from '~/types/vision'

interface ExtractionContext {
  userMessage: string
  aiResponse: string
  currentVision?: any
}

export function extractVisionUpdates(context: ExtractionContext): VisionUpdate {
  const updates: VisionUpdate = {}
  const { userMessage, aiResponse } = context
  const combinedText = userMessage.toLowerCase() + ' ' + aiResponse.toLowerCase()
  
  // Only extract if there's meaningful content about the project
  
  // 1. Project Description / Elevator Pitch
  if (combinedText.includes('diverrr') || combinedText.includes('tinder for diver')) {
    // Clean, concise description
    updates.elevator_pitch = "A social platform connecting scuba divers to find dive buddies based on location, experience level, and diving interests"
  }
  
  // 2. User Personas - be specific
  if (combinedText.includes('diver') && combinedText.includes('buddy')) {
    updates.user_personas = [
      "Certified scuba divers looking for dive buddies",
      "Solo travelers who want to dive with locals",
      "Dive instructors seeking students",
      "New divers looking for experienced mentors"
    ]
  }
  
  // 3. Pain Points - real problems
  if (combinedText.includes('challenge') || combinedText.includes('problem') || combinedText.includes('difficult')) {
    updates.pain_points = [
      "Hard to find compatible dive buddies when traveling",
      "Safety concerns when diving with strangers",
      "Language barriers in international diving",
      "Difficulty verifying dive certifications"
    ]
  }
  
  // 4. Key Features - actionable features
  if (combinedText.includes('feature') || combinedText.includes('build') || combinedText.includes('need')) {
    updates.key_features = [
      "Location-based buddy matching",
      "Dive certification verification",
      "In-app messaging with translation",
      "Dive log sharing and trip planning",
      "Safety rating system"
    ]
  }
  
  return updates
}

// Helper function to clean and format text
function cleanText(text: string): string {
  return text
    .replace(/^(that|to|for|with|by|the|a|an)\s+/i, '')
    .replace(/\s+/g, ' ')
    .trim()
}

// Helper to capitalize first letter
function capitalizeFirst(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}
