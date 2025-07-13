import { defineEventHandler, readBody } from 'h3'
import { processWizardChat } from '~/server/utils/wizard-engine'
import { validateChatRequest } from '~/server/utils/validation'

export default defineEventHandler(async (event: any) => {
  try {
    const body = await readBody(event)
    
    // Validate request
    const validation = validateChatRequest(body)
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error
      }
    }
    
    const { wizardId, phaseId, message, context } = body
    
    // Process chat interaction
    const response = await processWizardChat({
      wizardId,
      phaseId,
      message,
      context
    })
    
    return {
      success: true,
      data: response
    }
  } catch (error) {
    console.error('Wizard chat error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process chat'
    }
  }
})