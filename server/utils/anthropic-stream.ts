// Anthropic Stream Parser
// Handles parsing of special blocks in AI responses during streaming

import type { ThinkingStep, ActionConfig } from '~/types/chat'

interface StreamHandlers {
  onThinking?: (step: ThinkingStep) => void | Promise<void>
  onDataObject?: (obj: DataObject) => void | Promise<void>
  onAction?: (action: ActionSuggestion) => void | Promise<void>
  onRichMessage?: (message: RichMessage) => void | Promise<void>
  onText?: (text: string) => void | Promise<void>
  onError?: (error: Error) => void | Promise<void>
}

interface DataObject {
  type: string
  data: Record<string, any>
  id: string
}

interface ActionSuggestion {
  type: string
  label: string
  data: Record<string, any>
}

interface RichMessage {
  type: string
  content: any
}

export class AnthropicStreamParser {
  private buffer = ''
  private inThinkingBlock = false
  private inDataBlock = false
  private inRichMessageBlock = false
  private currentBlockType = ''
  private currentBlockContent = ''
  private thinkingStepCount = 0
  
  constructor(private handlers: StreamHandlers) {}
  
  async processChunk(text: string) {
    this.buffer += text
    
    // Process complete blocks
    await this.processCompleteBlocks()
    
    // Send remaining plain text
    if (this.buffer && !this.isInSpecialBlock()) {
      await this.handlers.onText?.(this.buffer)
      this.buffer = ''
    }
  }
  
  private async processCompleteBlocks() {
    // Parse thinking blocks
    await this.parseThinkingBlocks()
    
    // Parse entity creation blocks
    await this.parseEntityBlocks()
    
    // Parse action suggestions
    await this.parseActionBlocks()
    
    // Parse rich message blocks
    await this.parseRichMessageBlocks()
  }
  
  private async parseThinkingBlocks() {
    const thinkingRegex = /<thinking>([\s\S]*?)<\/thinking>/g
    let match
    
    while ((match = thinkingRegex.exec(this.buffer)) !== null) {
      const thinking = match[1].trim()
      const steps = this.parseThinkingSteps(thinking)
      
      for (const step of steps) {
        await this.handlers.onThinking?.(step)
      }
      
      // Remove thinking block from buffer
      this.buffer = this.buffer.replace(match[0], '')
      // Reset regex lastIndex after buffer modification
      thinkingRegex.lastIndex = 0
    }
  }
  
  private parseThinkingSteps(thinking: string): ThinkingStep[] {
    const steps: ThinkingStep[] = []
    const lines = thinking.split('\n').filter(line => line.trim())
    
    let currentStep: Partial<ThinkingStep> = {}
    let stepContent: string[] = []
    
    for (const line of lines) {
      // Check for step marker
      const stepMatch = line.match(/^Step (\d+):?\s*(.*)$/i)
      if (stepMatch) {
        // Save previous step if exists
        if (currentStep.number && stepContent.length > 0) {
          currentStep.content = stepContent.join('\n').trim()
          steps.push(this.finalizeThinkingStep(currentStep))
        }
        
        // Start new step
        currentStep = {
          number: parseInt(stepMatch[1]),
          type: 'analysis'
        }
        stepContent = stepMatch[2] ? [stepMatch[2]] : []
      }
      // Check for type indicator
      else if (line.match(/^Type:\s*(.+)$/i)) {
        const typeMatch = line.match(/^Type:\s*(.+)$/i)
        if (typeMatch) {
          const type = typeMatch[1].toLowerCase()
          if (['analysis', 'planning', 'decision', 'revision'].includes(type)) {
            currentStep.type = type as any
          }
        }
      }
      // Check for confidence indicator
      else if (line.match(/^Confidence:\s*(.+)$/i)) {
        const confMatch = line.match(/^Confidence:\s*(.+)$/i)
        if (confMatch) {
          const confidence = parseFloat(confMatch[1])
          if (!isNaN(confidence)) {
            currentStep.confidence = Math.min(1, Math.max(0, confidence))
          }
        }
      }
      // Check for revision indicator
      else if (line.toLowerCase().includes('revis')) {
        currentStep.isRevision = true
        stepContent.push(line)
      }
      // Regular content line
      else {
        stepContent.push(line)
      }
    }
    
    // Don't forget the last step
    if (currentStep.number && stepContent.length > 0) {
      currentStep.content = stepContent.join('\n').trim()
      steps.push(this.finalizeThinkingStep(currentStep))
    }
    
    // If no structured steps found, treat entire content as one step
    if (steps.length === 0 && thinking.trim()) {
      this.thinkingStepCount++
      steps.push({
        number: this.thinkingStepCount,
        type: 'analysis',
        content: thinking.trim()
      })
    }
    
    return steps
  }
  
  private finalizeThinkingStep(step: Partial<ThinkingStep>): ThinkingStep {
    return {
      number: step.number || 1,
      type: step.type || 'analysis',
      content: step.content || '',
      confidence: step.confidence,
      isRevision: step.isRevision
    }
  }
  
  private async parseEntityBlocks() {
    const entityRegex = /<CREATE_ENTITY\s+type="(\w+)">([\s\S]*?)<\/CREATE_ENTITY>/g
    let match
    
    while ((match = entityRegex.exec(this.buffer)) !== null) {
      const type = match[1]
      const dataStr = match[2].trim()
      
      try {
        const data = JSON.parse(dataStr)
        await this.handlers.onDataObject?.({
          type,
          data,
          id: this.generateId()
        })
      } catch (e) {
        console.error('Failed to parse entity data:', e)
        await this.handlers.onError?.(new Error(`Invalid entity data for type ${type}`))
      }
      
      this.buffer = this.buffer.replace(match[0], '')
      entityRegex.lastIndex = 0
    }
  }
  
  private async parseActionBlocks() {
    // Parse inline action suggestions
    const actionRegex = /<ACTION\s+type="(\w+)"\s+label="([^"]+)"(?:\s+data='([^']+)')?\/>/g
    let match
    
    while ((match = actionRegex.exec(this.buffer)) !== null) {
      const [_, type, label, dataStr] = match
      
      try {
        const data = dataStr ? JSON.parse(dataStr) : {}
        await this.handlers.onAction?.({
          type,
          label,
          data
        })
      } catch (e) {
        console.error('Failed to parse action data:', e)
      }
      
      this.buffer = this.buffer.replace(match[0], '')
      actionRegex.lastIndex = 0
    }
  }
  
  private async parseRichMessageBlocks() {
    const richMessageRegex = /<RICH_MESSAGE\s+type="(\w+)">([\s\S]*?)<\/RICH_MESSAGE>/g
    let match
    
    while ((match = richMessageRegex.exec(this.buffer)) !== null) {
      const type = match[1]
      const dataStr = match[2].trim()
      
      try {
        const content = JSON.parse(dataStr)
        await this.handlers.onRichMessage?.({
          type,
          content
        })
      } catch (e) {
        console.error('Failed to parse rich message data:', e)
        await this.handlers.onError?.(new Error(`Invalid rich message data for type ${type}`))
      }
      
      this.buffer = this.buffer.replace(match[0], '')
      richMessageRegex.lastIndex = 0
    }
  }
  
  private isInSpecialBlock(): boolean {
    // Check if we're currently inside an unclosed special block
    const openBlocks = [
      { open: '<thinking>', close: '</thinking>' },
      { open: '<CREATE_ENTITY', close: '</CREATE_ENTITY>' },
      { open: '<RICH_MESSAGE', close: '</RICH_MESSAGE>' }
    ]
    
    for (const block of openBlocks) {
      const openIndex = this.buffer.lastIndexOf(block.open)
      const closeIndex = this.buffer.lastIndexOf(block.close)
      
      if (openIndex > -1 && (closeIndex === -1 || openIndex > closeIndex)) {
        return true
      }
    }
    
    return false
  }
  
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
  
  // Finalize any remaining content
  async flush() {
    if (this.buffer) {
      // Try to process any remaining complete blocks
      await this.processCompleteBlocks()
      
      // Send any remaining text
      if (this.buffer) {
        await this.handlers.onText?.(this.buffer)
        this.buffer = ''
      }
    }
  }
}

// Helper function to extract text content from streaming response
export function extractPlainText(text: string): string {
  // Remove all special blocks
  return text
    .replace(/<thinking>[\s\S]*?<\/thinking>/g, '')
    .replace(/<CREATE_ENTITY[^>]*>[\s\S]*?<\/CREATE_ENTITY>/g, '')
    .replace(/<ACTION[^>]*\/>/g, '')
    .replace(/<RICH_MESSAGE[^>]*>[\s\S]*?<\/RICH_MESSAGE>/g, '')
    .trim()
}