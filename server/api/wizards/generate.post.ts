import { defineEventHandler, readBody } from 'h3'
import { generateWizardOutput } from '~/server/utils/wizard-engine'
import { validateGenerateRequest } from '~/server/utils/validation'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    // Validate request
    const validation = validateGenerateRequest(body)
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error
      }
    }
    
    const { wizardId, answers, outputType } = body
    
    // Generate output based on wizard answers
    const output = await generateWizardOutput({
      wizardId,
      answers,
      outputType
    })
    
    return {
      success: true,
      data: output
    }
  } catch (error) {
    console.error('Generation error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate output'
    }
  }
})