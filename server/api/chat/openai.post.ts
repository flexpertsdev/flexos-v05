import { defineEventHandler, readBody, createError } from 'h3'
import OpenAI from 'openai'

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
    if (!config.openaiApiKey) {
      // Return a mock response for testing
      return {
        content: `I received your message: "${body.message}". However, the OpenAI API key is not configured. Please set OPENAI_API_KEY in your environment variables to get real AI responses.`,
        mock: true
      }
    }
    
    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: config.openaiApiKey
    })
    
    // Build messages array
    const messages: SimpleMessage[] = [
      {
        role: 'system',
        content: 'You are a helpful AI assistant for FlexOS, a Vue 3/Nuxt application builder. Keep responses concise and helpful.'
      }
    ]
    
    if (body.history) {
      messages.push(...body.history)
    }
    messages.push({ role: 'user', content: body.message })
    
    // Make API call
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: messages,
      temperature: 0.7,
      max_tokens: 2048
    })
    
    const content = completion.choices[0]?.message?.content
    
    if (!content) {
      throw new Error('No response from OpenAI')
    }
    
    return {
      content,
      usage: completion.usage
    }
    
  } catch (error: any) {
    console.error('OpenAI chat error:', error)
    
    // Return friendly error messages
    if (error.message?.includes('API key')) {
      return {
        content: 'API key error. Please configure your OpenAI API key.',
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
        content: 'Invalid API key. Please check your OpenAI API key configuration.',
        error: true
      }
    }
    
    return {
      content: `Error: ${error.message || 'Something went wrong'}`,
      error: true
    }
  }
})