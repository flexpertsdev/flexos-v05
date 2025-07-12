import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event: any) => {
  try {
    // Check if OpenAI API key is configured
    const apiKey = process.env.OPENAI_API_KEY
    const isConfigured = apiKey && apiKey !== 'your_openai_api_key'
    
    return {
      available: isConfigured,
      message: isConfigured 
        ? 'AI service is available' 
        : 'AI service not configured - running in demo mode'
    }
  } catch (error) {
    return {
      available: false,
      message: 'Failed to check AI status'
    }
  }
})