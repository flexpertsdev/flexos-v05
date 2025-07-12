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
        :quick-actions="currentQuickActions"
        :reply-context="replyContext"
        :subtitle="'Website Refresh Wizard'"
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
import { ref, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
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

const route = useRoute()

// State
const messages = ref<Message[]>([])
const isTyping = ref(false)
const userInput = ref('')
const replyContext = ref<ReplyContext | null>(null)
const activeTab = ref<'chat' | 'magic'>('chat')
const chatRef = ref<InstanceType<typeof WizardChat>>()
const progress = ref(0)
const currentQuickActions = ref<string[]>([])

// Website data
const websiteData = ref({
  url: '',
  currentIssues: [] as string[],
  improvements: [] as string[],
  colorScheme: '',
  modernDesign: ''
})

// Process sections for magic panel
const processSections = ref<any[]>([])

// Methods
const addMessage = (type: 'ai' | 'user', content: string) => {
  messages.value.push({ type, content })
}

const handleSend = async (message: string) => {
  addMessage('user', message)
  processResponse(message)
}

const handleQuickAction = (action: string) => {
  userInput.value = action
  handleSend(action)
}

const processResponse = async (userInput: string) => {
  isTyping.value = true
  currentQuickActions.value = []
  
  // Simulate different stages of analysis
  setTimeout(() => {
    isTyping.value = false
    
    if (progress.value === 0) {
      // Initial analysis
      addMessage('ai', "I'm analyzing your website now... This will take just a moment! 🔍")
      startWebsiteAnalysis()
    } else if (progress.value === 25) {
      // Show issues
      addMessage('ai', "I've identified several areas we can improve. Would you like to see the full report or jump straight to solutions?")
      currentQuickActions.value = ['Show full report', 'Jump to solutions']
      progress.value = 50
    } else if (progress.value === 50) {
      // Design options
      addMessage('ai', "Great! I have some modern design options for you. Which style appeals to you most?")
      showDesignOptions()
      progress.value = 75
    } else {
      // Final
      completeAnalysis()
    }
  }, 2000)
}

const startWebsiteAnalysis = () => {
  progress.value = 25
  
  processSections.value = [{
    title: 'ANALYZING WEBSITE',
    loading: true,
    items: [
      { icon: '🌐', text: 'Fetching website content...', status: 'complete' },
      { icon: '📱', text: 'Testing mobile responsiveness...', status: 'complete' },
      { icon: '⚡', text: 'Measuring page speed...', status: 'processing' },
      { icon: '♿', text: 'Checking accessibility...', status: 'processing' }
    ]
  }]
  
  setTimeout(() => {
    processSections.value[0].items[2].status = 'complete'
    processSections.value[0].items[3].status = 'complete'
    
    processSections.value.push({
      title: 'ISSUES FOUND',
      items: [
        { icon: '🐌', text: 'Page load time: 4.2s (should be < 2s)', status: 'pending' },
        { icon: '📱', text: 'Not mobile optimized', status: 'pending' },
        { icon: '♿', text: 'Missing alt texts on 12 images', status: 'pending' },
        { icon: '🎨', text: 'Outdated design (last updated 2019)', status: 'pending' }
      ]
    })
    
    websiteData.value.currentIssues = [
      'Slow page load',
      'Not mobile friendly',
      'Accessibility issues',
      'Outdated design'
    ]
    
    addMessage('ai', "Analysis complete! I found some areas that need attention, especially for the upcoming EU accessibility requirements. Let me show you what I discovered.")
  }, 3000)
}

const showDesignOptions = () => {
  processSections.value = [{
    title: 'MODERN DESIGN OPTIONS',
    layout: 'page-grid',
    items: [
      { icon: '🌊', text: 'Clean Minimal', id: 'minimal', selected: false },
      { icon: '🎨', text: 'Bold & Vibrant', id: 'vibrant', selected: false },
      { icon: '💼', text: 'Professional', id: 'professional', selected: false },
      { icon: '🌈', text: 'Creative & Fun', id: 'creative', selected: false }
    ]
  }]
  
  setTimeout(() => {
    processSections.value.push({
      title: 'COLOR SCHEMES',
      items: [
        { icon: '🎨', text: 'Choose your brand colors', status: 'pending' }
      ],
      colorPalette: [
        { hex: '#16C181', name: 'Fresh Green', selected: true },
        { hex: '#3B82F6', name: 'Trust Blue' },
        { hex: '#8B5CF6', name: 'Creative Purple' },
        { hex: '#EC4899', name: 'Energetic Pink' },
        { hex: '#F59E0B', name: 'Warm Orange' }
      ]
    })
  }, 500)
}

const handleItemClick = ({ section, item }: { section: number; item: number }) => {
  const sectionData = processSections.value[section]
  const itemData = sectionData.items[item]
  
  if (sectionData.layout === 'page-grid') {
    // Clear other selections
    sectionData.items.forEach((i: any) => i.selected = false)
    itemData.selected = true
    
    websiteData.value.modernDesign = itemData.id
    
    replyContext.value = {
      title: `Design: ${itemData.text}`,
      description: `Selected ${itemData.text} style`
    }
    
    if (window.innerWidth <= 768) {
      activeTab.value = 'chat'
    }
    
    setTimeout(() => {
      addMessage('ai', `Excellent choice! The ${itemData.text} style will give your site a fresh, modern look. Would you like to see a preview?`)
      currentQuickActions.value = ['Show preview', 'Continue with this style']
      chatRef.value?.focus()
    }, 300)
  }
}

const handleColorSelect = ({ section, color }: { section: number; color: number }) => {
  const sectionData = processSections.value[section]
  const colorData = sectionData.colorPalette[color]
  
  sectionData.colorPalette.forEach((c: any) => c.selected = false)
  colorData.selected = true
  
  websiteData.value.colorScheme = colorData.hex
  
  replyContext.value = {
    title: `Color: ${colorData.name}`,
    description: `Selected ${colorData.hex}`
  }
  
  if (window.innerWidth <= 768) {
    activeTab.value = 'chat'
  }
  
  setTimeout(() => {
    addMessage('ai', `Great choice! ${colorData.name} will give your site a ${colorData.name.toLowerCase().includes('green') ? 'fresh and modern' : 'professional'} feel.`)
    chatRef.value?.focus()
  }, 300)
}

const completeAnalysis = () => {
  progress.value = 100
  
  addMessage('ai', "🎉 Perfect! I have everything I need to refresh your website. Here's what I'll do:\n\n• Implement mobile-first responsive design\n• Ensure WCAG 2.1 AA compliance\n• Optimize for Core Web Vitals\n• Apply your chosen design style\n\nReady to see the transformation?")
  
  processSections.value = [{
    title: '✅ REFRESH PLAN READY',
    items: [
      { icon: '📱', text: 'Mobile-first design', status: 'complete' },
      { icon: '♿', text: 'Full accessibility', status: 'complete' },
      { icon: '⚡', text: 'Performance optimized', status: 'complete' },
      { icon: '🎨', text: 'Modern UI/UX', status: 'complete' }
    ]
  }]
  
  currentQuickActions.value = ['Start Refresh', 'Download Report']
}

// Initialize
onMounted(async () => {
  const websiteUrl = route.query.url as string
  
  if (websiteUrl) {
    websiteData.value.url = websiteUrl
    addMessage('ai', `Hi! I'll help you refresh "${websiteUrl}" to meet modern standards and the upcoming EU accessibility requirements. 🌟\n\nLet me analyze your current site first.`)
    
    await nextTick()
    chatRef.value?.scrollToBottom()
    
    setTimeout(() => {
      startWebsiteAnalysis()
    }, 1500)
  } else {
    addMessage('ai', "Hi! I'm here to help refresh your website. Please provide your website URL to get started.")
  }
})
</script>