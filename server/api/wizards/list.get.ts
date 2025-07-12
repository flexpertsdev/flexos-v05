import { defineEventHandler } from 'h3'
import { getWizardList } from '~/server/utils/wizard-loader'

export default defineEventHandler(async (event) => {
  try {
    const wizards = await getWizardList()
    
    return {
      success: true,
      data: wizards
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to load wizards'
    }
  }
})