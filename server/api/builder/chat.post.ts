import { defineEventHandler, readBody, createError } from 'h3'
import Anthropic from '@anthropic-ai/sdk'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface ChatRequest {
  messages: ChatMessage[]
  context?: string[]
}

export default defineEventHandler(async (event) => {
  // Get runtime config
  const config = useRuntimeConfig()
  
  try {
    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: config.anthropicApiKey || ''
    })
    
    const body = await readBody<ChatRequest>(event)
    const { messages, context } = body
    
    if (!messages || messages.length === 0) {
      throw new Error('No messages provided')
    }
    
    // Build system prompt with context
    let systemPrompt = `You are FlexOS Builder, an AI assistant that helps users build web applications using Vue 3, Nuxt, and modern web technologies. 
    
You have access to the user's project context and can help them:
- Create new pages and components
- Add features and functionality
- Debug issues
- Suggest improvements
- Write code following best practices

Always write clean, maintainable code that follows Vue 3 composition API patterns and TypeScript best practices.`
    
    if (context && context.length > 0) {
      systemPrompt += `\n\nActive project context includes: ${context.join(', ')}`
    }
    
    // Convert messages to Anthropic format
    const anthropicMessages = messages.map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content
    }))
    
    // Make API call to Anthropic
    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 4096,
      temperature: 0.7,
      system: systemPrompt,
      messages: anthropicMessages
    })
    
    // Extract the response content
    const responseContent = response.content[0]
    if (responseContent.type !== 'text') {
      throw new Error('Unexpected response type from Anthropic')
    }
    
    return {
      content: responseContent.text,
      usage: {
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens
      }
    }
    
  } catch (error: any) {
    console.error('Builder chat error:', error)
    
    // Handle specific error types
    if (!config.anthropicApiKey || error.message?.includes('API key')) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Anthropic API key not configured. Please set ANTHROPIC_API_KEY environment variable.'
      })
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to process chat request'
    })
  }
})