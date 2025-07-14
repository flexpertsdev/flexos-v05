// API response types for Anthropic chat endpoint

export interface AnthropicChatResponse {
  content: string
  error?: boolean
  mock?: boolean
  usage?: {
    input_tokens: number
    output_tokens: number
  }
  visionUpdates?: any[]
}
