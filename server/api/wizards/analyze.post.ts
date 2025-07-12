import { defineEventHandler, readBody } from 'h3'
import { analyzeUserInput } from '~/server/utils/ai-service'
import { validateAnalysisRequest } from '~/server/utils/validation'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    // Validate request
    const validation = validateAnalysisRequest(body)
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error
      }
    }
    
    const { type, data, context } = body
    
    // Perform AI analysis based on type
    const analysis = await analyzeUserInput({
      type,
      data,
      context
    })
    
    return {
      success: true,
      data: analysis
    }
  } catch (error) {
    console.error('Analysis error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to analyze input'
    }
  }
})