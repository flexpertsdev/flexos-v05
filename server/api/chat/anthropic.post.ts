import { defineEventHandler, readBody, createError } from 'h3'
import Anthropic from '@anthropic-ai/sdk'

interface SimpleMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  try {
    const body = await readBody<{ message: string; history?: SimpleMessage[] }>(event)
    
    if (!body.message) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Message is required'
      })
    }
    
    // Check if API key is configured
    if (!config.anthropicApiKey) {
      // Return a mock response for testing
      return {
        content: `I received your message: "${body.message}". However, the Anthropic API key is not configured. Please set ANTHROPIC_API_KEY in your environment variables to get real AI responses.`,
        mock: true
      }
    }
    
    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: config.anthropicApiKey
    })
    
    // Build messages array for Anthropic
    const systemPrompt = 'You are a helpful AI assistant for FlexOS, a Vue 3/Nuxt application builder. Keep responses concise and helpful.'
    
    // Convert history format - Anthropic doesn't use system messages in the messages array
    const messages: Array<{ role: 'user' | 'assistant'; content: string }> = []
    
    if (body.history) {
      body.history.forEach(msg => {
        if (msg.role !== 'system') {
          messages.push({
            role: msg.role as 'user' | 'assistant',
            content: msg.content
          })
        }
      })
    }
    
    messages.push({ role: 'user', content: body.message })
    
    // Make API call
    const response = await anthropic.messages.create({
      model: config.anthropicModel || 'claude-3-sonnet-20240229',
      max_tokens: 2048,
      temperature: 0.7,
      system: systemPrompt,
      messages
    })
    
    const content = response.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type')
    }
    
    return {
      content: content.text,
      usage: response.usage
    }
    
  } catch (error: any) {
    console.error('Anthropic chat error:', error)
    
    // Return friendly error messages
    if (error.message?.includes('API key')) {
      return {
        content: 'API key error. Please configure your Anthropic API key.',
        error: true
      }
    }
    
    if (error.message?.includes('rate limit')) {
      return {
        content: 'Rate limit reached. Please try again later.',
        error: true
      }
    }
    
    if (error.status === 401) {
      return {
        content: 'Invalid API key. Please check your Anthropic API key configuration.',
        error: true
      }
    }
    
    return {
      content: `Error: ${error.message || 'Something went wrong'}`,
      error: true
    }
  }
})