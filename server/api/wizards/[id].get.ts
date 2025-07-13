import { defineEventHandler, getRouterParam } from 'h3'
import { getWizardConfig } from '~/server/utils/wizard-loader'

export default defineEventHandler(async (event: any) => {
  const wizardId = getRouterParam(event, 'id')
  
  if (!wizardId) {
    return {
      success: false,
      error: 'Wizard ID is required'
    }
  }
  
  try {
    const wizard = await getWizardConfig(wizardId)
    
    if (!wizard) {
      return {
        success: false,
        error: 'Wizard not found'
      }
    }
    
    return {
      success: true,
      data: wizard
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to load wizard'
    }
  }
})