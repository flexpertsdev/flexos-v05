import { OpenAI } from 'openai'
import type { 
  WizardAnalysisRequest, 
  WizardAnalysisResponse,
  AIMessage,
  AIContext 
} from '~/types/wizard'

// Initialize OpenAI client
let openaiClient: OpenAI | null = null

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = useRuntimeConfig().openaiApiKey
    
    if (!apiKey) {
      throw new Error('OpenAI API key is not configured')
    }
    
    openaiClient = new OpenAI({
      apiKey
    })
  }
  
  return openaiClient
}

/**
 * Process a chat message with AI
 */
export async function processAIChat(
  messages: AIMessage[],
  options: {
    model?: string
    temperature?: number
    maxTokens?: number
    streaming?: boolean
  } = {}
): Promise<string> {
  const client = getOpenAIClient()
  
  const {
    model = 'gpt-4-turbo-preview',
    temperature = 0.7,
    maxTokens = 1000,
    streaming = false
  } = options
  
  try {
    if (streaming) {
      // For streaming responses (implement later)
      throw new Error('Streaming not yet implemented')
    }
    
    const completion = await client.chat.completions.create({
      model,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      temperature,
      max_tokens: maxTokens
    })
    
    return completion.choices[0]?.message?.content || ''
  } catch (error) {
    console.error('AI chat error:', error)
    throw new Error('Failed to process AI chat')
  }
}

/**
 * Analyze user input based on type
 */
export async function analyzeUserInput(
  request: WizardAnalysisRequest
): Promise<WizardAnalysisResponse['data']> {
  const { type, data, context } = request
  
  switch (type) {
    case 'website':
      return await analyzeWebsite(data.url, context)
    
    case 'code':
      return await analyzeCode(data.code, data.language, context)
    
    case 'requirements':
      return await analyzeRequirements(data.text, context)
    
    case 'design':
      return await analyzeDesign(data, context)
    
    default:
      throw new Error(`Unknown analysis type: ${type}`)
  }
}

/**
 * Analyze a website for compliance and improvements
 */
async function analyzeWebsite(
  url: string, 
  context?: any
): Promise<WizardAnalysisResponse['data']> {
  const messages: AIMessage[] = [
    {
      role: 'system',
      content: `You are a web accessibility and compliance expert. Analyze the website and provide:
1. EAA/WCAG compliance issues
2. Performance problems
3. Mobile responsiveness issues
4. SEO problems
5. Design improvements

Format your response as JSON with these sections:
- compliance: array of compliance issues
- performance: array of performance issues
- mobile: array of mobile issues
- seo: array of SEO issues
- design: array of design suggestions
- score: overall score from 0-100`,
      timestamp: new Date()
    },
    {
      role: 'user',
      content: `Analyze this website: ${url}`,
      timestamp: new Date()
    }
  ]
  
  const response = await processAIChat(messages, {
    temperature: 0.3,
    maxTokens: 2000
  })
  
  try {
    const analysis = JSON.parse(response)
    
    return {
      analysis,
      recommendations: [
        ...analysis.compliance.slice(0, 3),
        ...analysis.performance.slice(0, 2),
        ...analysis.design.slice(0, 2)
      ],
      issues: [
        ...analysis.compliance,
        ...analysis.performance,
        ...analysis.mobile
      ],
      score: analysis.score
    }
  } catch (error) {
    // Fallback if JSON parsing fails
    return {
      analysis: { raw: response },
      recommendations: ['Unable to parse structured analysis'],
      issues: [],
      score: 0
    }
  }
}

/**
 * Analyze code for issues and improvements
 */
async function analyzeCode(
  code: string,
  language: string,
  context?: any
): Promise<WizardAnalysisResponse['data']> {
  const messages: AIMessage[] = [
    {
      role: 'system',
      content: `You are a senior ${language} developer. Analyze the code for:
1. Bugs and errors
2. Performance issues
3. Security vulnerabilities
4. Code style and best practices
5. Potential improvements

Format as JSON with sections: bugs, performance, security, style, improvements`,
      timestamp: new Date()
    },
    {
      role: 'user',
      content: `Analyze this ${language} code:\n\n${code}`,
      timestamp: new Date()
    }
  ]
  
  const response = await processAIChat(messages, {
    temperature: 0.3,
    maxTokens: 1500
  })
  
  try {
    const analysis = JSON.parse(response)
    
    return {
      analysis,
      recommendations: [
        ...analysis.bugs.map((b: any) => `Fix: ${b}`),
        ...analysis.improvements.slice(0, 3)
      ],
      issues: [
        ...analysis.bugs,
        ...analysis.security,
        ...analysis.performance
      ]
    }
  } catch (error) {
    return {
      analysis: { raw: response },
      recommendations: ['Unable to parse structured analysis'],
      issues: []
    }
  }
}

/**
 * Analyze requirements text
 */
async function analyzeRequirements(
  text: string,
  context?: any
): Promise<WizardAnalysisResponse['data']> {
  const messages: AIMessage[] = [
    {
      role: 'system',
      content: `You are a business analyst. Extract and analyze requirements from the text:
1. Functional requirements
2. Non-functional requirements
3. User stories
4. Acceptance criteria
5. Missing or unclear requirements

Format as JSON with clear structure.`,
      timestamp: new Date()
    },
    {
      role: 'user',
      content: `Analyze these requirements:\n\n${text}`,
      timestamp: new Date()
    }
  ]
  
  const response = await processAIChat(messages, {
    temperature: 0.3,
    maxTokens: 1500
  })
  
  try {
    const analysis = JSON.parse(response)
    
    return {
      analysis,
      recommendations: analysis.missing || [],
      issues: analysis.unclear || []
    }
  } catch (error) {
    return {
      analysis: { raw: response },
      recommendations: [],
      issues: []
    }
  }
}

/**
 * Analyze design choices
 */
async function analyzeDesign(
  data: any,
  context?: any
): Promise<WizardAnalysisResponse['data']> {
  const messages: AIMessage[] = [
    {
      role: 'system',
      content: `You are a UX/UI design expert. Analyze the design choices and provide recommendations for:
1. Color harmony and accessibility
2. Typography choices
3. Layout and spacing
4. User experience improvements
5. Mobile considerations`,
      timestamp: new Date()
    },
    {
      role: 'user',
      content: `Analyze these design choices: ${JSON.stringify(data)}`,
      timestamp: new Date()
    }
  ]
  
  const response = await processAIChat(messages, {
    temperature: 0.5,
    maxTokens: 1000
  })
  
  try {
    const analysis = JSON.parse(response)
    
    return {
      analysis,
      recommendations: analysis.improvements || [],
      issues: analysis.issues || []
    }
  } catch (error) {
    return {
      analysis: { raw: response },
      recommendations: ['Design analysis processed'],
      issues: []
    }
  }
}

/**
 * Generate a contextual AI prompt based on wizard phase
 */
export function generatePhasePrompt(
  phase: any,
  context: AIContext
): string {
  const basePrompt = phase.aiConfig?.systemPrompt || ''
  
  // Add context from previous conversations
  const contextPrompt = context.conversationHistory.length > 0
    ? '\n\nPrevious context: ' + context.conversationHistory
        .slice(-3)
        .map(msg => `${msg.role}: ${msg.content}`)
        .join('\n')
    : ''
  
  // Add extracted entities
  const entitiesPrompt = Object.keys(context.extractedEntities).length > 0
    ? '\n\nKnown information: ' + JSON.stringify(context.extractedEntities)
    : ''
  
  return basePrompt + contextPrompt + entitiesPrompt
}

/**
 * Extract entities and key information from user input
 */
export function extractEntities(
  input: string,
  existingEntities: Record<string, any> = {}
): Record<string, any> {
  const entities = { ...existingEntities }
  
  // Extract URLs
  const urlMatch = input.match(/https?:\/\/[^\s]+/g)
  if (urlMatch) {
    entities.urls = [...(entities.urls || []), ...urlMatch]
  }
  
  // Extract emails
  const emailMatch = input.match(/[\w.-]+@[\w.-]+\.\w+/g)
  if (emailMatch) {
    entities.emails = [...(entities.emails || []), ...emailMatch]
  }
  
  // Extract numbers
  const numberMatch = input.match(/\d+/g)
  if (numberMatch) {
    entities.numbers = [...(entities.numbers || []), ...numberMatch]
  }
  
  // Extract quoted strings
  const quotedMatch = input.match(/"([^"]+)"|'([^']+)'/g)
  if (quotedMatch) {
    entities.quoted = quotedMatch.map(q => q.slice(1, -1))
  }
  
  return entities
}