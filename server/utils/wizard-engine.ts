import type {
  WizardConfig,
  WizardPhase,
  WizardSession,
  WizardAnswers,
  WizardContext,
  WizardChatRequest,
  WizardChatResponse,
  AIMessage,
  BranchCondition,
  GeneratedFile
} from '~/types/wizard'
import { processAIChat, generatePhasePrompt, extractEntities } from './ai-service'
import { getWizardConfig } from './wizard-loader'

/**
 * Process a wizard chat interaction
 */
export async function processWizardChat(
  request: WizardChatRequest
): Promise<WizardChatResponse['data']> {
  const { wizardId, phaseId, message, context } = request
  
  // Load wizard configuration
  const wizard = await getWizardConfig(wizardId)
  if (!wizard) {
    throw new Error('Wizard not found')
  }
  
  // Find current phase
  const currentPhase = wizard.phases.find(p => p.id === phaseId)
  if (!currentPhase) {
    throw new Error('Phase not found')
  }
  
  // Process based on phase type
  let response: string
  let analysis: Record<string, any> = {}
  let suggestions: string[] = []
  
  if (currentPhase.aiConfig?.enabled) {
    // Use AI for this phase
    response = await processAIPhase(currentPhase, message, context)
    
    // Extract entities from user input
    if (context.aiContext) {
      context.aiContext.extractedEntities = extractEntities(
        message,
        context.aiContext.extractedEntities
      )
    }
  } else {
    // Use rule-based processing
    response = await processRuleBasedPhase(currentPhase, message, context)
  }
  
  // Generate suggestions based on phase type
  suggestions = await generateSuggestions(currentPhase, context)
  
  // Determine next phase
  const nextPhase = await determineNextPhase(
    wizard,
    currentPhase,
    message,
    context
  )
  
  return {
    response,
    nextPhase,
    suggestions,
    analysis
  }
}

/**
 * Process a phase using AI
 */
async function processAIPhase(
  phase: WizardPhase,
  userInput: string,
  context: WizardContext
): Promise<string> {
  const messages: AIMessage[] = []
  
  // Add system prompt
  const systemPrompt = generatePhasePrompt(phase, context.aiContext!)
  messages.push({
    role: 'system',
    content: systemPrompt,
    timestamp: new Date()
  })
  
  // Add conversation history
  if (context.aiContext?.conversationHistory) {
    messages.push(...context.aiContext.conversationHistory.slice(-5))
  }
  
  // Add current user input
  messages.push({
    role: 'user',
    content: userInput,
    timestamp: new Date()
  })
  
  // Process with AI
  const response = await processAIChat(messages, {
    model: phase.aiConfig?.model,
    temperature: phase.aiConfig?.temperature,
    maxTokens: phase.aiConfig?.maxTokens,
    streaming: phase.aiConfig?.streaming
  })
  
  // Update conversation history
  if (context.aiContext) {
    context.aiContext.conversationHistory.push(
      {
        role: 'user',
        content: userInput,
        timestamp: new Date()
      },
      {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }
    )
  }
  
  return response
}

/**
 * Process a phase using rules
 */
async function processRuleBasedPhase(
  phase: WizardPhase,
  userInput: string,
  context: WizardContext
): Promise<string> {
  // Validate input
  if (phase.validation) {
    const validationResult = validateInput(userInput, phase.validation)
    if (!validationResult.valid) {
      return validationResult.message || 'Invalid input. Please try again.'
    }
  }
  
  // Generate response based on phase type
  switch (phase.type) {
    case 'question':
      return `Thank you for your answer. ${phase.helpText || ''}`
    
    case 'selection':
      return 'Great choice! Let me process that for you.'
    
    case 'validation':
      return 'I\'ve validated your input. Everything looks good!'
    
    case 'review':
      return 'Here\'s a summary of what we\'ve discussed so far.'
    
    default:
      return 'Understood. Let\'s continue.'
  }
}

/**
 * Generate suggestions for the current phase
 */
async function generateSuggestions(
  phase: WizardPhase,
  context: WizardContext
): Promise<string[]> {
  const suggestions: string[] = []
  
  // Add quick options for certain input types
  switch (phase.inputType) {
    case 'text':
      if (phase.id === 'project-name') {
        suggestions.push('MyAwesomeApp', 'ProjectX', 'StartupName')
      }
      break
    
    case 'url':
      suggestions.push('https://example.com', 'Skip this step')
      break
    
    case 'radio':
    case 'select':
      // Add first 3 options as suggestions
      if (phase.options) {
        suggestions.push(...phase.options.slice(0, 3).map(o => o.label))
      }
      break
  }
  
  return suggestions
}

/**
 * Determine the next phase based on branching logic
 */
async function determineNextPhase(
  wizard: WizardConfig,
  currentPhase: WizardPhase,
  userInput: string,
  context: WizardContext
): Promise<string | undefined> {
  // Check if current phase has branching logic
  if (currentPhase.branching) {
    for (const condition of currentPhase.branching.conditions) {
      if (evaluateBranchCondition(condition, userInput, context)) {
        return condition.then
      }
    }
    
    // Use default branch if no conditions match
    if (currentPhase.branching.default) {
      return currentPhase.branching.default
    }
  }
  
  // Check if selected option has branchTo
  if (currentPhase.options) {
    const selectedOption = currentPhase.options.find(
      o => o.value === userInput || o.label === userInput
    )
    if (selectedOption?.branchTo) {
      return selectedOption.branchTo
    }
  }
  
  // Default to next phase in sequence
  const currentIndex = wizard.phases.findIndex(p => p.id === currentPhase.id)
  if (currentIndex < wizard.phases.length - 1) {
    return wizard.phases[currentIndex + 1].id
  }
  
  return undefined
}

/**
 * Evaluate a branch condition
 */
function evaluateBranchCondition(
  condition: BranchCondition,
  userInput: string,
  context: WizardContext
): boolean {
  const { phase, operator, value } = condition.if
  
  // Get the answer for the specified phase
  const phaseAnswer = context.metadata[phase] || userInput
  
  switch (operator) {
    case 'equals':
      return phaseAnswer === value
    
    case 'contains':
      return String(phaseAnswer).includes(String(value))
    
    case 'matches':
      return new RegExp(String(value)).test(String(phaseAnswer))
    
    case 'in':
      return Array.isArray(value) && value.includes(phaseAnswer)
    
    case 'not_in':
      return Array.isArray(value) && !value.includes(phaseAnswer)
    
    default:
      return false
  }
}

/**
 * Validate user input
 */
function validateInput(
  input: string,
  rules: any
): { valid: boolean; message?: string } {
  if (rules.required && !input.trim()) {
    return {
      valid: false,
      message: rules.message || 'This field is required'
    }
  }
  
  if (rules.minLength && input.length < rules.minLength) {
    return {
      valid: false,
      message: rules.message || `Minimum length is ${rules.minLength}`
    }
  }
  
  if (rules.maxLength && input.length > rules.maxLength) {
    return {
      valid: false,
      message: rules.message || `Maximum length is ${rules.maxLength}`
    }
  }
  
  if (rules.pattern && !new RegExp(rules.pattern).test(input)) {
    return {
      valid: false,
      message: rules.message || 'Invalid format'
    }
  }
  
  if (rules.email && !/^[\w.-]+@[\w.-]+\.\w+$/.test(input)) {
    return {
      valid: false,
      message: rules.message || 'Invalid email address'
    }
  }
  
  if (rules.url && !/^https?:\/\/[^\s]+$/.test(input)) {
    return {
      valid: false,
      message: rules.message || 'Invalid URL'
    }
  }
  
  return { valid: true }
}

/**
 * Generate wizard output based on collected answers
 */
export async function generateWizardOutput(params: {
  wizardId: string
  answers: WizardAnswers
  outputType?: string
}): Promise<{ files: GeneratedFile[]; summary: string; nextSteps?: string[] }> {
  const { wizardId, answers, outputType } = params
  
  // Load wizard configuration
  const wizard = await getWizardConfig(wizardId)
  if (!wizard) {
    throw new Error('Wizard not found')
  }
  
  // Find output configuration
  const output = outputType
    ? wizard.outputs.find(o => o.id === outputType)
    : wizard.outputs[0]
  
  if (!output) {
    throw new Error('Output configuration not found')
  }
  
  const files: GeneratedFile[] = []
  
  // Generate files based on output configuration
  if (output.files) {
    for (const fileConfig of output.files) {
      const content = await generateFileContent(fileConfig, answers, wizard)
      files.push({
        path: fileConfig.path,
        content,
        language: detectLanguage(fileConfig.path),
        description: `Generated ${fileConfig.path}`
      })
    }
  }
  
  // Generate summary
  const summary = await generateSummary(wizard, answers, files)
  
  // Generate next steps
  const nextSteps = generateNextSteps(wizard, answers)
  
  return {
    files,
    summary,
    nextSteps
  }
}

/**
 * Generate content for a single file
 */
async function generateFileContent(
  fileConfig: any,
  answers: WizardAnswers,
  wizard: WizardConfig
): Promise<string> {
  // If custom generator is specified, use it
  if (fileConfig.generator) {
    // This would call a custom generator function
    // For now, we'll use template-based generation
  }
  
  // Use template if provided
  if (fileConfig.template) {
    return interpolateTemplate(fileConfig.template, answers)
  }
  
  // Generate content based on file type
  const ext = fileConfig.path.split('.').pop()
  switch (ext) {
    case 'vue':
      return generateVueComponent(answers)
    case 'ts':
      return generateTypeScript(answers)
    case 'md':
      return generateMarkdown(answers)
    default:
      return '// Generated file'
  }
}

/**
 * Simple template interpolation
 */
function interpolateTemplate(template: string, data: any): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return data[key] || match
  })
}

/**
 * Detect language from file extension
 */
function detectLanguage(path: string): string {
  const ext = path.split('.').pop()
  const languages: Record<string, string> = {
    'js': 'javascript',
    'ts': 'typescript',
    'vue': 'vue',
    'jsx': 'javascript',
    'tsx': 'typescript',
    'css': 'css',
    'scss': 'scss',
    'html': 'html',
    'json': 'json',
    'md': 'markdown',
    'yaml': 'yaml',
    'yml': 'yaml'
  }
  return languages[ext || ''] || 'text'
}

/**
 * Generate a summary of the wizard results
 */
async function generateSummary(
  wizard: WizardConfig,
  answers: WizardAnswers,
  files: GeneratedFile[]
): Promise<string> {
  const messages: AIMessage[] = [
    {
      role: 'system',
      content: 'Generate a concise summary of what was created based on the wizard answers and generated files.',
      timestamp: new Date()
    },
    {
      role: 'user',
      content: `Wizard: ${wizard.name}\nAnswers: ${JSON.stringify(answers)}\nFiles created: ${files.map(f => f.path).join(', ')}`,
      timestamp: new Date()
    }
  ]
  
  return await processAIChat(messages, {
    temperature: 0.5,
    maxTokens: 300
  })
}

/**
 * Generate next steps based on wizard completion
 */
function generateNextSteps(
  wizard: WizardConfig,
  answers: WizardAnswers
): string[] {
  const steps: string[] = []
  
  // Add wizard-specific next steps
  switch (wizard.id) {
    case 'project-discovery':
      steps.push(
        'Run npm install to install dependencies',
        'Start the development server with npm run dev',
        'Open http://localhost:3000 to see your project'
      )
      break
    
    case 'component-generator':
      steps.push(
        'Import the component in your pages',
        'Add the component to your design system',
        'Write tests for the component'
      )
      break
    
    case 'feature-generator':
      steps.push(
        'Run database migrations',
        'Test the API endpoints',
        'Update the documentation'
      )
      break
  }
  
  return steps
}

// Placeholder functions for content generation
function generateVueComponent(answers: any): string {
  return `<template>
  <div class="${answers.componentName || 'component'}">
    <!-- Generated component -->
  </div>
</template>

<script setup lang="ts">
// Generated component logic
</script>

<style scoped>
/* Generated styles */
</style>`
}

function generateTypeScript(answers: any): string {
  return `// Generated TypeScript file
export interface ${answers.interfaceName || 'Generated'} {
  // Add properties here
}

export function ${answers.functionName || 'generated'}() {
  // Implementation
}`
}

function generateMarkdown(answers: any): string {
  return `# ${answers.projectName || 'Generated Project'}

## Description
${answers.description || 'Project description'}

## Installation
\`\`\`bash
npm install
\`\`\`

## Usage
Generated by FlexOS Wizard System
`
}