<template>
  <WizardLayout 
    :progress="progress" 
    :active-tab="activeTab"
    @tab-change="activeTab = $event"
  >
    <template #chat>
      <WizardChat
        ref="chatRef"
        v-model="userInput"
        :messages="messages"
        :is-typing="isTyping"
        :quick-actions="currentStep?.quickActions || []"
        :reply-context="replyContext"
        :subtitle="currentStep?.subtitle || 'Project Setup'"
        @send="handleSend"
        @quick-action="handleQuickAction"
        @clear-context="replyContext = null"
      />
    </template>

    <template #magic>
      <WizardMagic
        :sections="processSections"
        @item-click="handleItemClick"
        @color-select="handleColorSelect"
      />
    </template>
  </WizardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import WizardLayout from '@/components/wizard/WizardLayout.vue'
import WizardChat from '@/components/wizard/WizardChat.vue'
import WizardMagic from '@/components/wizard/WizardMagic.vue'

interface Message {
  type: 'ai' | 'user'
  content: string
}

interface ReplyContext {
  title: string
  description: string
}

interface WizardStep {
  question: string
  subtitle: string
  quickActions?: string[]
}

const route = useRoute()
const router = useRouter()

// State
const currentStepIndex = ref(0)
const messages = ref<Message[]>([])
const isTyping = ref(false)
const userInput = ref('')
const replyContext = ref<ReplyContext | null>(null)
const activeTab = ref<'chat' | 'magic'>('chat')
const chatRef = ref<InstanceType<typeof WizardChat>>()

// Project data
const projectData = ref({
  initialPrompt: '',
  name: '',
  type: '',
  description: '',
  colors: [] as string[],
  pages: [] as string[],
  features: [] as string[]
})

// Wizard steps
const wizardSteps: WizardStep[] = [
  {
    question: "Great! Let's start by giving your project a name. What would you like to call it?",
    subtitle: "Project Setup",
    quickActions: ['My Awesome App', 'Project X', 'StartupName']
  },
  {
    question: "Perfect name! Now, what type of application best describes your project?",
    subtitle: "Choosing Template",
    quickActions: ['E-commerce', 'SaaS Platform', 'Social App', 'Blog/Content']
  },
  {
    question: "Excellent choice! 🎯\n\nCan you describe your vision in a few sentences? What problem does it solve?",
    subtitle: "Understanding Vision",
    quickActions: []
  }
]

// Computed
const currentStep = computed(() => wizardSteps[currentStepIndex.value])
const progress = computed(() => ((currentStepIndex.value + 1) / wizardSteps.length) * 100)

// Process sections for magic panel
const processSections = ref<any[]>([])

// Methods
const addMessage = (type: 'ai' | 'user', content: string) => {
  messages.value.push({ type, content })
}

const handleSend = async (message: string) => {
  addMessage('user', message)
  processStep(message)
}

const handleQuickAction = (action: string) => {
  userInput.value = action
  handleSend(action)
}

const processStep = async (userInput: string) => {
  isTyping.value = true
  
  // Update project data based on step
  if (currentStepIndex.value === 0) {
    projectData.value.name = userInput
    showProjectSetup()
  } else if (currentStepIndex.value === 1) {
    projectData.value.type = userInput
    showProjectTypeAnalysis()
  } else if (currentStepIndex.value === 2) {
    projectData.value.description = userInput
    showVisionAnalysis()
  }

  // Simulate AI response
  setTimeout(() => {
    isTyping.value = false
    currentStepIndex.value++
    
    if (currentStepIndex.value < wizardSteps.length) {
      addMessage('ai', currentStep.value.question)
    } else {
      completeWizard()
    }
  }, 2000)
}

const showProjectSetup = () => {
  processSections.value = []
  
  setTimeout(() => {
    processSections.value.push({
      title: 'PROJECT SETUP',
      loading: true,
      items: [
        { icon: '📝', text: 'Validating project name...', status: 'complete' },
        { icon: '🔍', text: 'Checking availability...', status: 'complete' },
        { icon: '✅', text: 'Project initialized', status: 'complete' }
      ]
    })
  }, 300)
}

const showProjectTypeAnalysis = () => {
  processSections.value = []
  
  setTimeout(() => {
    processSections.value.push({
      title: 'ANALYZING PROJECT TYPE',
      loading: true,
      items: [
        { icon: '🏪', text: `${projectData.value.type} platform detected`, status: 'complete' },
        { icon: '📦', text: 'Loading components...', status: 'processing' },
        { icon: '🛒', text: 'Preparing system...', status: 'processing' }
      ]
    })
  }, 300)
  
  setTimeout(() => {
    const pages = projectData.value.type.toLowerCase().includes('commerce') 
      ? [
          { icon: '🏠', text: 'Homepage', id: 'homepage' },
          { icon: '📱', text: 'Products', id: 'products' },
          { icon: '🛒', text: 'Cart', id: 'cart' },
          { icon: '💳', text: 'Checkout', id: 'checkout' },
          { icon: '👤', text: 'Account', id: 'account' },
          { icon: '📦', text: 'Orders', id: 'orders' }
        ]
      : [
          { icon: '🏠', text: 'Homepage', id: 'homepage' },
          { icon: '📊', text: 'Dashboard', id: 'dashboard' },
          { icon: '👤', text: 'Profile', id: 'profile' },
          { icon: '⚙️', text: 'Settings', id: 'settings' }
        ]
    
    processSections.value.push({
      title: 'SUGGESTED PAGES',
      layout: 'page-grid',
      items: pages.map(p => ({ ...p, selected: true }))
    })
    
    projectData.value.pages = pages.map(p => p.id)
  }, 800)
}

const showVisionAnalysis = () => {
  processSections.value = []
  
  setTimeout(() => {
    processSections.value.push({
      title: 'UNDERSTANDING YOUR VISION',
      loading: true,
      items: [
        { icon: '🧠', text: 'Analyzing requirements...', status: 'complete' },
        { icon: '🎯', text: 'Identifying audience...', status: 'processing' },
        { icon: '💡', text: 'Generating features...', status: 'pending' }
      ]
    })
  }, 300)
  
  setTimeout(() => {
    processSections.value.push({
      title: 'DESIGN SYSTEM',
      loading: true,
      items: [
        { icon: '🎨', text: 'Creating color palette...', status: 'processing' }
      ],
      colorPalette: [
        { hex: '#16C181', name: 'Primary Green' },
        { hex: '#8B5CF6', name: 'Purple Accent' },
        { hex: '#3B82F6', name: 'Blue' },
        { hex: '#EC4899', name: 'Pink' },
        { hex: '#F59E0B', name: 'Orange' }
      ]
    })
  }, 1000)
  
  setTimeout(() => {
    const features = projectData.value.type.toLowerCase().includes('commerce')
      ? [
          { icon: '🔐', text: 'User Authentication', id: 'auth' },
          { icon: '🔍', text: 'Search & Filters', id: 'search' },
          { icon: '💳', text: 'Payment Processing', id: 'payment' },
          { icon: '📊', text: 'Analytics', id: 'analytics' },
          { icon: '📧', text: 'Email System', id: 'email' }
        ]
      : [
          { icon: '🔐', text: 'User Authentication', id: 'auth' },
          { icon: '📊', text: 'Analytics Dashboard', id: 'analytics' },
          { icon: '🔔', text: 'Notifications', id: 'notifications' },
          { icon: '🌐', text: 'API Integration', id: 'api' }
        ]
    
    processSections.value.push({
      title: 'CORE FEATURES',
      layout: 'feature-list',
      items: features
    })
    
    projectData.value.features = features.map(f => f.id)
  }, 1500)
}

const handleItemClick = ({ section, item }: { section: number; item: number }) => {
  const sectionData = processSections.value[section]
  const itemData = sectionData.items[item]
  
  if (sectionData.layout === 'page-grid') {
    // Toggle page selection
    itemData.selected = !itemData.selected
    
    if (itemData.selected) {
      projectData.value.pages.push(itemData.id)
    } else {
      projectData.value.pages = projectData.value.pages.filter(p => p !== itemData.id)
    }
    
    // Set reply context
    replyContext.value = {
      title: `Page: ${itemData.text}`,
      description: `Customizing ${itemData.text} page`
    }
    
    // Switch to chat tab on mobile
    if (window.innerWidth <= 768) {
      activeTab.value = 'chat'
    }
    
    // Add AI message
    setTimeout(() => {
      addMessage('ai', `Tell me more about what you'd like on the ${itemData.text} page. Any specific features or layout preferences?`)
      chatRef.value?.focus()
    }, 300)
  } else if (sectionData.layout === 'feature-list') {
    replyContext.value = {
      title: `Feature: ${itemData.text}`,
      description: `Discussing ${itemData.text}`
    }
    
    if (window.innerWidth <= 768) {
      activeTab.value = 'chat'
    }
    
    setTimeout(() => {
      addMessage('ai', `How do you envision the "${itemData.text}" working in your app? Any specific requirements?`)
      chatRef.value?.focus()
    }, 300)
  }
}

const handleColorSelect = ({ section, color }: { section: number; color: number }) => {
  const sectionData = processSections.value[section]
  const colorData = sectionData.colorPalette[color]
  
  // Clear other selections
  sectionData.colorPalette.forEach((c: any) => c.selected = false)
  colorData.selected = true
  
  projectData.value.colors = [colorData.hex]
  
  replyContext.value = {
    title: `Color: ${colorData.name}`,
    description: `Selected ${colorData.hex}`
  }
  
  if (window.innerWidth <= 768) {
    activeTab.value = 'chat'
  }
  
  setTimeout(() => {
    addMessage('ai', `I see you're interested in ${colorData.name}. Would you like this as your primary brand color?`)
    chatRef.value?.focus()
  }, 300)
}

const completeWizard = () => {
  addMessage('ai', "🎉 Amazing! I've got everything I need. Your app blueprint is ready!\n\nClick 'Start Building' below to see your vision come to life!")
  
  setTimeout(() => {
    processSections.value = [{
      title: '✅ READY TO BUILD',
      items: [
        { icon: '📐', text: 'Architecture planned', status: 'complete' },
        { icon: '🎨', text: 'Design system ready', status: 'complete' },
        { icon: '📱', text: 'Mobile optimized', status: 'complete' },
        { icon: '🚀', text: 'Ready to launch!', status: 'complete' }
      ]
    }]
  }, 500)
  
  // TODO: Add start building button that navigates to the actual builder
}

// Initialize
onMounted(async () => {
  // Get initial project prompt from query
  const projectPrompt = route.query.project as string
  if (projectPrompt) {
    projectData.value.initialPrompt = projectPrompt
    
    // Add initial messages
    addMessage('ai', `Hi! I see you want to build: "${projectPrompt}"\n\nI'm excited to help you bring this to life! 🚀`)
    
    await nextTick()
    chatRef.value?.scrollToBottom()
    
    setTimeout(() => {
      addMessage('ai', currentStep.value.question)
    }, 1500)
  } else {
    // No project prompt, start with default
    addMessage('ai', "Hi! I'm excited to help you build something amazing today! 🚀\n\nWhat would you like to name your project?")
  }
})
</script>