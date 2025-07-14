import { ref, computed, watch } from 'vue'
import type {
  WizardConfig,
  WizardPhase,
  WizardAnswers,
  WizardContext,
  AIMessage,
  WizardChatResponse,
  WizardAnalysisResponse,
  WizardGenerateResponse
} from '~/types/wizard'

interface ProcessingStep {
  id: string
  title: string
  status: 'pending' | 'processing' | 'complete'
  items: ProcessingItem[]
}

interface ProcessingItem {
  id: string
  icon: string
  text: string
  status: 'pending' | 'processing' | 'complete'
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  isTyping?: boolean
}

export function useWizard() {
  // State
  const wizard = ref<WizardConfig | null>(null)
  const currentPhaseId = ref<string>('')
  const messages = ref<Message[]>([])
  const answers = ref<WizardAnswers>({})
  const isProcessing = ref(false)
  const processingSteps = ref<ProcessingStep[]>([])
  const sessionId = ref<string>('')
  const aiContext = ref<AIMessage[]>([])

  // Computed
  const currentPhase = computed(() => {
    if (!wizard.value || !currentPhaseId.value) return null
    return wizard.value.phases.find(p => p.id === currentPhaseId.value) || null
  })

  const progress = computed(() => {
    if (!wizard.value) return 0
    const totalPhases = wizard.value.phases.length
    const completedPhases = Object.keys(answers.value).length
    return Math.round((completedPhases / totalPhases) * 100)
  })

  const context = computed((): WizardContext => ({
    sessionId: sessionId.value,
    previousPhases: Object.keys(answers.value),
    metadata: answers.value,
    aiContext: {
      conversationHistory: aiContext.value,
      extractedEntities: {},
      userPreferences: {}
    }
  }))

  // Methods
  async function loadWizard(wizardId: string) {
    try {
      isProcessing.value = true
      
      // Generate session ID
      sessionId.value = generateSessionId()
      
      // Fetch wizard configuration
      const response = await $fetch<{ success: boolean; data?: WizardConfig; error?: string }>(`/api/wizards/${wizardId}`)
      
      if (response.success && response.data) {
        wizard.value = response.data
        
        // Start with first phase
        if (wizard.value.phases.length > 0) {
          currentPhaseId.value = wizard.value.phases[0].id
          
          // Add initial message
          addAssistantMessage(wizard.value.phases[0].prompt)
          
          // Check if AI is available
          const aiStatus = await checkAIStatus()
          if (!aiStatus.available) {
            addAssistantMessage('⚠️ Note: AI features are currently in demo mode. Configure an OpenAI API key for full functionality.')
          }
        }
      } else {
        throw new Error(response.error || 'Failed to load wizard')
      }
    } catch (error) {
      console.error('Failed to load wizard:', error)
      
      // More helpful error messages
      if (error instanceof Error && error.message.includes('404')) {
        addAssistantMessage(`Sorry, I couldn't find the wizard "${wizardId}". Please check the URL and try again.`)
      } else {
        addAssistantMessage('Sorry, I couldn\'t load the wizard. Please try refreshing the page.')
      }
    } finally {
      isProcessing.value = false
    }
  }

  async function sendMessage(message: string) {
    if (!wizard.value || !currentPhase.value || isProcessing.value) return
    
    // Add user message
    addUserMessage(message)
    
    // Store answer
    answers.value[currentPhaseId.value] = message
    
    // Process based on phase type
    if (currentPhase.value.type === 'analysis') {
      await performAnalysis(message)
    } else {
      await processPhaseResponse(message)
    }
  }

  async function submitPhaseInput(value: any) {
    if (!wizard.value || !currentPhase.value || isProcessing.value) return
    
    // Store answer
    answers.value[currentPhaseId.value] = value
    
    // Add user message based on input type
    if (typeof value === 'string') {
      addUserMessage(value)
    } else if (Array.isArray(value)) {
      addUserMessage(`Selected: ${value.join(', ')}`)
    } else if (typeof value === 'object') {
      addUserMessage(`Selected: ${JSON.stringify(value)}`)
    } else {
      addUserMessage(String(value))
    }
    
    // Process response
    await processPhaseResponse(value)
  }

  async function processPhaseResponse(value: any) {
    if (!wizard.value || !currentPhase.value) return
    
    isProcessing.value = true
    
    // Show typing indicator
    const typingMessage = addAssistantMessage('', true)
    
    try {
      // Add processing steps visualization
      showProcessingSteps()
      
      // Call chat API if AI is enabled for this phase
      if (currentPhase.value.aiConfig?.enabled) {
        const response = await $fetch<WizardChatResponse>('/api/wizards/chat', {
          method: 'POST',
          body: {
            wizardId: wizard.value.id,
            phaseId: currentPhaseId.value,
            message: String(value),
            context: context.value
          }
        })
        
        if (response.success && response.data) {
          // Remove typing indicator
          messages.value = messages.value.filter(m => m.id !== typingMessage.id)
          
          // Add AI response
          addAssistantMessage(response.data.response)
          
          // Update AI context
          aiContext.value.push(
            { role: 'user', content: String(value), timestamp: new Date() },
            { role: 'assistant', content: response.data.response, timestamp: new Date() }
          )
          
          // Move to next phase if specified
          if (response.data.nextPhase) {
            await moveToPhase(response.data.nextPhase)
          } else {
            // Default to next phase
            await moveToNextPhase()
          }
        }
      } else {
        // Simulate processing for non-AI phases
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Remove typing indicator
        messages.value = messages.value.filter(m => m.id !== typingMessage.id)
        
        // Add response based on phase type
        const responseMessage = getPhaseResponseMessage(currentPhase.value, value)
        addAssistantMessage(responseMessage)
        
        // Move to next phase
        await moveToNextPhase()
      }
      
      // Update processing steps to complete
      completeProcessingSteps()
    } catch (error) {
      console.error('Failed to process response:', error)
      messages.value = messages.value.filter(m => m.id !== typingMessage.id)
      addAssistantMessage('Sorry, something went wrong. Please try again.')
    } finally {
      isProcessing.value = false
    }
  }

  async function performAnalysis(url: string) {
    if (!wizard.value || !currentPhase.value) return
    
    isProcessing.value = true
    const typingMessage = addAssistantMessage('', true)
    
    try {
      // Show analysis steps
      showAnalysisSteps()
      
      // Call analysis API
      const response = await $fetch<WizardAnalysisResponse>('/api/wizards/analyze', {
        method: 'POST',
        body: {
          type: currentPhase.value.aiConfig?.analysisType || 'website',
          data: { url },
          context: context.value
        }
      })
      
      if (response.success && response.data) {
        // Remove typing indicator
        messages.value = messages.value.filter(m => m.id !== typingMessage.id)
        
        // Format and add analysis results
        const analysisMessage = formatAnalysisResults(response.data)
        addAssistantMessage(analysisMessage)
        
        // Store analysis in context
        answers.value[`${currentPhaseId.value}_analysis`] = response.data
        
        // Move to next phase
        await moveToNextPhase()
      }
      
      completeProcessingSteps()
    } catch (error) {
      console.error('Analysis failed:', error)
      messages.value = messages.value.filter(m => m.id !== typingMessage.id)
      addAssistantMessage('Sorry, I couldn\'t analyze the website. Please check the URL and try again.')
    } finally {
      isProcessing.value = false
    }
  }

  async function moveToNextPhase() {
    if (!wizard.value) return
    
    const currentIndex = wizard.value.phases.findIndex(p => p.id === currentPhaseId.value)
    if (currentIndex < wizard.value.phases.length - 1) {
      const nextPhase = wizard.value.phases[currentIndex + 1]
      await moveToPhase(nextPhase.id)
    } else {
      // Wizard complete
      await completeWizard()
    }
  }

  async function moveToPhase(phaseId: string) {
    if (!wizard.value) return
    
    const phase = wizard.value.phases.find(p => p.id === phaseId)
    if (!phase) return
    
    currentPhaseId.value = phaseId
    
    // Add phase prompt after a short delay
    await new Promise(resolve => setTimeout(resolve, 500))
    addAssistantMessage(phase.prompt)
  }

  async function completeWizard() {
    if (!wizard.value) return
    
    isProcessing.value = true
    const typingMessage = addAssistantMessage('', true)
    
    try {
      // Special handling for project-discovery wizard
      if (wizard.value.id === 'project-discovery') {
        const router = useRouter()
        
        // Create project from wizard answers
        const response = await $fetch<{ project?: { name: string; slug: string } }>('/api/projects/create-from-wizard', {
          method: 'POST',
          body: {
            wizardAnswers: answers.value
          }
        })
        
        if (response.project) {
          messages.value = messages.value.filter(m => m.id !== typingMessage.id)
          
          // Add completion message
          const completionMessage = `🎉 Excellent! I've created your project "${response.project.name}".\n\nTaking you to Focus Mode to define your core vision...`
          addAssistantMessage(completionMessage)
          
          // Wait a moment then redirect to project with focus mode
          setTimeout(() => {
            if (response.project) {
              router.push(`/project/${response.project.slug}?mode=focus&initial=true`)
            }
          }, 2000)
          
          return
        }
      }
      
      // Default wizard completion behavior
      const response = await $fetch<WizardGenerateResponse>('/api/wizards/generate', {
        method: 'POST',
        body: {
          wizardId: wizard.value.id,
          answers: answers.value
        }
      })
      
      if (response.success && response.data) {
        messages.value = messages.value.filter(m => m.id !== typingMessage.id)
        
        // Add completion message
        const completionMessage = `🎉 ${response.data.summary}\n\nFiles generated:\n${
          response.data.files.map(f => `- ${f.path}`).join('\n')
        }\n\nNext steps:\n${
          response.data.nextSteps?.map(s => `- ${s}`).join('\n') || 'Your project is ready!'
        }`
        
        addAssistantMessage(completionMessage)
      }
    } catch (error) {
      console.error('Failed to generate output:', error)
      messages.value = messages.value.filter(m => m.id !== typingMessage.id)
      addAssistantMessage('Sorry, I couldn\'t generate the output. Please try again.')
    } finally {
      isProcessing.value = false
    }
  }

  // Helper methods
  function addUserMessage(content: string): Message {
    const message: Message = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date()
    }
    messages.value.push(message)
    return message
  }

  function addAssistantMessage(content: string, isTyping = false): Message {
    const message: Message = {
      id: generateId(),
      role: 'assistant',
      content,
      timestamp: new Date(),
      isTyping
    }
    messages.value.push(message)
    return message
  }

  function showProcessingSteps() {
    processingSteps.value = [
      {
        id: 'validate',
        title: 'VALIDATING INPUT',
        status: 'processing',
        items: [
          { id: '1', icon: '✓', text: 'Checking format...', status: 'complete' },
          { id: '2', icon: '🔍', text: 'Validating data...', status: 'processing' },
          { id: '3', icon: '📊', text: 'Processing...', status: 'pending' }
        ]
      }
    ]
    
    // Simulate progress
    setTimeout(() => {
      if (processingSteps.value[0]) {
        processingSteps.value[0].items[1].status = 'complete'
        processingSteps.value[0].items[2].status = 'processing'
      }
    }, 500)
  }

  function showAnalysisSteps() {
    processingSteps.value = [
      {
        id: 'fetch',
        title: 'FETCHING WEBSITE',
        status: 'processing',
        items: [
          { id: '1', icon: '🌐', text: 'Connecting to website...', status: 'processing' },
          { id: '2', icon: '📥', text: 'Loading content...', status: 'pending' },
          { id: '3', icon: '🔍', text: 'Parsing HTML...', status: 'pending' }
        ]
      },
      {
        id: 'analyze',
        title: 'ANALYZING COMPLIANCE',
        status: 'pending',
        items: [
          { id: '1', icon: '♿', text: 'Checking EAA/WCAG compliance...', status: 'pending' },
          { id: '2', icon: '📱', text: 'Testing mobile responsiveness...', status: 'pending' },
          { id: '3', icon: '🚀', text: 'Measuring performance...', status: 'pending' }
        ]
      }
    ]
    
    // Simulate progress
    let step = 0
    const interval = setInterval(() => {
      step++
      
      if (step === 1) {
        processingSteps.value[0].items[0].status = 'complete'
        processingSteps.value[0].items[1].status = 'processing'
      } else if (step === 2) {
        processingSteps.value[0].items[1].status = 'complete'
        processingSteps.value[0].items[2].status = 'processing'
      } else if (step === 3) {
        processingSteps.value[0].items[2].status = 'complete'
        processingSteps.value[0].status = 'complete'
        processingSteps.value[1].status = 'processing'
        processingSteps.value[1].items[0].status = 'processing'
      } else if (step === 4) {
        processingSteps.value[1].items[0].status = 'complete'
        processingSteps.value[1].items[1].status = 'processing'
      } else if (step === 5) {
        processingSteps.value[1].items[1].status = 'complete'
        processingSteps.value[1].items[2].status = 'processing'
      } else {
        clearInterval(interval)
      }
    }, 800)
  }

  function completeProcessingSteps() {
    processingSteps.value.forEach(step => {
      step.status = 'complete'
      step.items.forEach(item => {
        item.status = 'complete'
      })
    })
  }

  function getPhaseResponseMessage(phase: WizardPhase, value: any): string {
    switch (phase.type) {
      case 'question':
        return `Great! I've noted that down.`
      case 'selection':
        return `Excellent choice! Let me process that for you.`
      case 'validation':
        return `Perfect! Everything looks good.`
      case 'review':
        return `Thank you for reviewing. Let's continue.`
      default:
        return `Thank you for your input.`
    }
  }

  function formatAnalysisResults(data: WizardAnalysisResponse['data']): string {
    if (!data) return 'Analysis complete.'
    
    let message = '📊 **Analysis Complete!**\n\n'
    
    if (data.score !== undefined) {
      message += `**Overall Score:** ${data.score}/100\n\n`
    }
    
    if (data.issues && data.issues.length > 0) {
      message += `**Issues Found:** ${data.issues.length}\n`
      data.issues.slice(0, 5).forEach(issue => {
        message += `- ${issue}\n`
      })
      if (data.issues.length > 5) {
        message += `- ... and ${data.issues.length - 5} more\n`
      }
      message += '\n'
    }
    
    if (data.recommendations && data.recommendations.length > 0) {
      message += '**Top Recommendations:**\n'
      data.recommendations.slice(0, 5).forEach(rec => {
        message += `- ${rec}\n`
      })
    }
    
    return message
  }

  function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  function generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  // Helper functions
  async function checkAIStatus(): Promise<{ available: boolean; message?: string }> {
    try {
      const response = await $fetch('/api/wizards/ai-status')
      return response as { available: boolean; message?: string }
    } catch (error) {
      return { available: false, message: 'AI service unavailable' }
    }
  }

  return {
    // State
    wizard,
    currentPhase,
    messages,
    answers,
    progress,
    isProcessing,
    processingSteps,
    
    // Methods
    loadWizard,
    sendMessage,
    submitPhaseInput
  }
}