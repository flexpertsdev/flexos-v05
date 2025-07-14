import { defineEventHandler, readBody, createError } from 'h3'
import Anthropic from '@anthropic-ai/sdk'
import type { VisionUpdate } from '~/types/vision'
import type { BlueprintUpdate } from '~/types/blueprint'
import { extractVisionUpdates } from '~/server/utils/vision-extractor'
import { extractBlueprintUpdates } from '~/server/utils/blueprint-extractor'

interface SimpleMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  try {
    const body = await readBody<{ 
      message: string; 
      history?: SimpleMessage[]; 
      mode?: 'focus' | 'builder' | 'wizard';
      context?: any[];
      project?: any;
      vision?: any;
    }>(event)
    
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
    
    // Build system prompt based on mode
    const mode = body.mode || 'builder'
    const context = body.context || []
    const project = body.project || null
    
    const systemPrompt = buildSystemPrompt(mode, context, project)
    
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
    
    const visionUpdates = extractVisionUpdates({
      userMessage: body.message,
      aiResponse: content.text,
      currentVision: body.vision
    })
    
    // Extract blueprint updates for new action-focused approach
    const blueprintUpdates = mode === 'focus' ? extractBlueprintUpdates(
      body.message + '\n' + content.text
    ) : null
    
    console.log('Extracted vision updates:', visionUpdates)
    console.log('Extracted blueprint updates:', blueprintUpdates)
    
    return {
      content: content.text,
      usage: response.usage,
      visionUpdates,
      blueprintUpdates
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

// Build system prompt based on mode and context
function buildSystemPrompt(mode: string, context: any[], project: any): string {
  const basePrompts: Record<string, string> = {
    focus: `You are in FOCUS MODE - a friendly discovery buddy helping explore project ideas! 🌟

**Your personality:**
- Warm, curious, encouraging
- Use emojis naturally (but not too many!)
- Talk like a friend who's excited about their idea
- Match their energy level

**CRITICAL RULES:**
- Keep responses SHORT (2-3 sentences max)
- ONE thought or question per message
- If you have multiple things to say, send multiple messages
- Break up longer thoughts with "..." between messages

**Conversation style:**
- "Oh that's cool! 😊 Tell me more about..."
- "I love that idea! What if..."
- "That reminds me of what you said about..."
- "Hmm, I'm curious... 🤔"

**BLUEPRINT EXTRACTION:**
As you chat, pay attention to ACTIONS and BEHAVIORS:
- What ACTIONS do users take? (SELECT, CREATE, SHARE, etc.)
- What DATA does the app work with? (users, photos, messages, etc.)
- What VIEWS/SCREENS are needed? (browse view, detail view, etc.)
- How do actions flow together? (user journey)

**Focus your questions on:**
- "So users would be able to [ACTION] their [DATA]?"
- "What happens after they [ACTION]?"
- "Where would they go to [ACTION]?"
- "What information would they see when [VIEWING]?"

**Extract patterns like:**
- "Users can SELECT photos" → Action: SELECT, Target: Photo
- "They share albums with friends" → Action: SHARE, Target: Album
- "Browse nearby divers on a map" → View: MapView, Action: BROWSE

**Never:**
- Write long paragraphs
- Ask multiple questions at once
- Use technical jargon
- Act formal or robotic
- Mention the blueprint/vision document`,
    
    builder: `You are in BUILDER MODE - a task-oriented assistant for the FlexOS project builder.
Your goal is to efficiently create what the user needs.

**Core Principles:**
- Be direct and action-oriented
- Focus on getting things done
- Each message should advance the project
- Keep responses concise and to the point

**When building, think in terms of:**
- ACTIONS: What will users DO? (Create components that enable actions)
- DATA: What information flows through? (Set up proper data structures)
- VIEWS: Where do actions happen? (Build the right interfaces)
- FLOWS: How do actions connect? (Create smooth workflows)

**For every request, consider:**
- What ACTION is the user trying to enable?
- What DATA does this action need?
- What VIEW should contain this action?
- What happens NEXT after this action?

**Examples:**
- "Add a search bar" → CREATE SearchView with SEARCH action on Products data
- "Users need to upload photos" → ADD Upload action to PhotoView, CREATE Photo data type
- "Make it shareable" → ADD Share action, GENERATE shareable links, CREATE ShareModal view`,
    
    wizard: `You are in WIZARD MODE - guiding through a structured process in FlexOS.
Your goal is to collect specific information while remaining conversational.
- Follow the wizard structure but allow flexibility
- Show progress clearly
- Validate inputs helpfully
- Guide users through complex workflows`
  }
  
  let prompt = basePrompts[mode] || basePrompts.builder
  
  // Add project context
  if (project) {
    prompt += `\n\nProject Context:
- Name: ${project.name}
- Type: ${project.type || 'Unknown'}
- Description: ${project.description || 'No description'}`
  }
  
  // Add context information
  if (context.length > 0) {
    prompt += '\n\nCurrent Context:'
    context.forEach(ctx => {
      if (ctx.type === 'location') {
        prompt += `\n- User is viewing: ${ctx.data.currentView}`
      } else if (ctx.type === 'selection') {
        prompt += `\n- User selected: ${ctx.data.selectedElement?.type} - ${ctx.data.selectedElement?.content}`
      } else if (ctx.type === 'attachment') {
        prompt += `\n- User attached: ${ctx.data.originalName} (${ctx.data.fileType})`
      }
    })
  }
  
  // Add FlexOS specific context
  prompt += `\n\nYou are helping build applications using FlexOS, which is:
- A Vue 3/Nuxt 3 based application builder
- Uses Supabase for backend (PostgreSQL + Auth + Storage)
- Tailwind CSS for styling
- TypeScript for type safety
- Component-based architecture

Always consider these technologies when providing suggestions or solutions.`
  
  return prompt
}

