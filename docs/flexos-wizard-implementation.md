# FlexOS Wizard Integration & Implementation Guide

## 1. Architecture Overview

### Wizard Engine Core
```typescript
// types/wizard.ts
export interface WizardDefinition {
  id: string
  name: string
  trigger: string[] // activation phrases
  phases: WizardPhase[]
  output: WizardOutput[]
}

export interface WizardPhase {
  id: string
  name: string
  questions: Question[]
  transitions: Transition[]
}

export interface WizardState {
  currentWizard: string | null
  currentPhase: number
  answers: Record<string, any>
  context: Record<string, any>
  mockups: GeneratedMockup[]
}

// composables/useWizard.ts
export const useWizard = () => {
  const state = useState<WizardState>('wizard', () => ({
    currentWizard: null,
    currentPhase: 0,
    answers: {},
    context: {},
    mockups: []
  }))

  const activateWizard = (wizardId: string) => {
    // Load wizard definition
    // Initialize state
    // Send first question
  }

  const processAnswer = (answer: string) => {
    // Store answer
    // Determine next question
    // Check for phase transition
    // Generate mockups if needed
  }

  const generateOutput = () => {
    // Create documentation
    // Generate mockups
    // Create builder instructions
  }

  return { state, activateWizard, processAnswer, generateOutput }
}
```

## 2. Chat Integration

### Landing Page Implementation
```vue
<!-- components/landing/LandingChatDemo.vue -->
<template>
  <div class="landing-chat">
    <div class="chat-messages">
      <ChatMessage 
        v-for="message in messages" 
        :key="message.id"
        :message="message"
      />
    </div>
    
    <ChatInput 
      @send="handleSend"
      :placeholder="currentPlaceholder"
    />
    
    <!-- Seamless transition to wizard -->
    <Transition name="expand">
      <WizardInterface 
        v-if="showWizard"
        :initial-messages="messages"
      />
    </Transition>
  </div>
</template>

<script setup>
const { activateWizard, state } = useWizard()
const showWizard = ref(false)

const handleSend = async (message: string) => {
  // Check for wizard triggers
  if (shouldActivateWizard(message)) {
    showWizard.value = true
    await activateWizard('project-discovery')
    // Animate expansion to full wizard
  }
}

const shouldActivateWizard = (message: string) => {
  const triggers = [
    'start the wizard',
    'help me build',
    'create an app',
    'i have an idea'
  ]
  return triggers.some(t => message.toLowerCase().includes(t))
}
</script>
```

### Wizard Interface Component
```vue
<!-- components/wizard/WizardInterface.vue -->
<template>
  <div class="wizard-container">
    <!-- Progress indicator -->
    <WizardProgress 
      :phases="currentWizard.phases"
      :current="state.currentPhase"
    />
    
    <!-- Chat continues here -->
    <div class="wizard-chat">
      <ChatMessage 
        v-for="message in allMessages" 
        :key="message.id"
        :message="message"
      />
      
      <WizardQuestion 
        v-if="currentQuestion"
        :question="currentQuestion"
        @answer="handleAnswer"
      />
    </div>
    
    <!-- Live mockup preview -->
    <div class="wizard-preview" v-if="state.mockups.length">
      <MockupPreview 
        :mockups="state.mockups"
        :viewport="selectedViewport"
      />
    </div>
    
    <!-- Account creation prompt -->
    <AccountCreationPrompt 
      v-if="showAccountPrompt"
      :context="state"
      @created="continueWithAccount"
    />
  </div>
</template>
```

## 3. Wizard Definitions

### Project Discovery Wizard
```typescript
// server/wizards/project-discovery.ts
export const projectDiscoveryWizard: WizardDefinition = {
  id: 'project-discovery',
  name: 'Project Discovery Wizard',
  trigger: ['start the wizard', 'help me build'],
  phases: [
    {
      id: 'introduction',
      name: 'Getting to Know You',
      questions: [
        {
          id: 'name',
          text: "Hi there! I'm here to help bring your idea to life. First, I'd love to know your name - what should I call you?",
          type: 'text',
          validation: 'required'
        },
        {
          id: 'excitement',
          text: "Great to meet you, {name}! I'm excited to learn about your project. What's got you excited about starting this?",
          type: 'text',
          followUp: true
        }
      ]
    },
    {
      id: 'vision',
      name: 'Understanding Your Vision',
      questions: [
        {
          id: 'future-success',
          text: "So {name}, imagine it's a year from now and your project is a huge success. What does that look like?",
          type: 'text',
          generateMockup: 'vision-board'
        }
      ]
    }
    // ... more phases
  ],
  output: [
    {
      type: 'documentation',
      template: 'project-vision',
      format: 'markdown'
    },
    {
      type: 'mockups',
      pages: ['landing', 'dashboard', 'feature-1', 'settings'],
      linked: true
    },
    {
      type: 'builder-instructions',
      format: 'claude-code'
    }
  ]
}
```

## 4. Mockup Generation System

### Real-time Mockup Generation
```typescript
// server/services/mockupGenerator.ts
export class MockupGenerator {
  async generateFromAnswers(answers: WizardAnswers): Promise<Mockup[]> {
    // Extract design preferences
    const design = this.extractDesignSystem(answers)
    
    // Determine page types needed
    const pageTypes = this.determinePageTypes(answers)
    
    // Generate HTML mockups
    const mockups = await Promise.all(
      pageTypes.map(type => this.generatePage(type, design, answers))
    )
    
    // Link mockups together
    return this.linkMockups(mockups)
  }
  
  private async generatePage(
    type: PageType, 
    design: DesignSystem,
    context: WizardAnswers
  ): Promise<Mockup> {
    // Use AI to generate appropriate content
    const content = await this.ai.generatePageContent(type, context)
    
    // Apply design system
    const styled = this.applyDesignSystem(content, design)
    
    // Make responsive
    const responsive = this.makeResponsive(styled)
    
    // Add interactions
    return this.addInteractions(responsive)
  }
  
  private makeResponsive(mockup: Mockup): Mockup {
    // Apply FlexOS breakpoint system
    const breakpoints = [320, 480, 640, 768, 1024, 1280, 1536, 1920, 2560, 3840]
    
    // Add responsive classes
    // Test layout at each breakpoint
    // Adjust as needed
    
    return mockup
  }
}
```

### Mockup Preview Component
```vue
<!-- components/wizard/MockupPreview.vue -->
<template>
  <div class="mockup-preview">
    <!-- Viewport controls -->
    <ViewportSelector 
      v-model="viewport"
      :options="viewportOptions"
    />
    
    <!-- Device frame -->
    <div :class="deviceFrameClass">
      <iframe 
        :src="currentMockupUrl"
        :style="iframeStyle"
        @load="onMockupLoad"
      />
    </div>
    
    <!-- Navigation between mockups -->
    <MockupNavigation 
      :mockups="mockups"
      v-model="currentMockup"
    />
    
    <!-- Quick actions -->
    <div class="mockup-actions">
      <button @click="enterFullscreen">
        <IconFullscreen /> Full Preview
      </button>
      <button @click="sharePreview">
        <IconShare /> Share
      </button>
    </div>
  </div>
</template>

<script setup>
const viewport = ref('desktop')
const currentMockup = ref(0)

const viewportOptions = [
  { label: 'Mobile', value: 'mobile', width: 375 },
  { label: 'Tablet', value: 'tablet', width: 768 },
  { label: 'Desktop', value: 'desktop', width: 1280 },
  { label: 'Custom', value: 'custom', width: null }
]

const enterFullscreen = () => {
  // Launch full preview mode
  navigateTo(`/preview/${props.mockups[0].id}?fullscreen=true`)
}
</script>
```

## 5. Account Creation Flow

### Seamless Signup
```vue
<!-- components/wizard/AccountCreationPrompt.vue -->
<template>
  <div class="account-prompt" v-if="show">
    <div class="account-card">
      <h3>Save Your Progress</h3>
      <p>Create an account to save your project and continue building</p>
      
      <form @submit.prevent="createAccount">
        <input 
          v-model="email"
          type="email"
          placeholder="Email address"
          required
        />
        
        <input 
          v-model="password"
          type="password"
          placeholder="Choose a password"
          required
        />
        
        <button type="submit" :disabled="loading">
          Create Account & Continue
        </button>
      </form>
      
      <p class="note">
        ✓ No email verification needed<br>
        ✓ All your progress will be saved<br>
        ✓ Continue exactly where you left off
      </p>
    </div>
  </div>
</template>

<script setup>
const { createAccount } = useAuth()
const { saveWizardState } = useWizard()

const handleCreateAccount = async () => {
  // Create account
  const user = await createAccount(email.value, password.value)
  
  // Save wizard state to user's account
  await saveWizardState(user.id)
  
  // Continue seamlessly
  emit('created')
}
</script>
```

## 6. Focus Mode Implementation

### Focus Mode Chat
```typescript
// composables/useFocusMode.ts
export const useFocusMode = () => {
  const conversation = useState<FocusConversation>('focus', () => ({
    messages: [],
    insights: [],
    specifications: []
  }))
  
  const askThoughtfulQuestion = async (context: string) => {
    // Generate exploratory questions
    const questions = [
      "Have you considered how this might work when...",
      "What would happen if a user...",
      "I'm curious about the edge case where...",
      "This reminds me to ask about..."
    ]
    
    // AI generates contextual question
    return await ai.generateExploratoryQuestion(context, questions)
  }
  
  const extractSpecification = (conversation: Message[]) => {
    // Convert natural conversation to specs
    return {
      requirements: extractRequirements(conversation),
      edgeCases: extractEdgeCases(conversation),
      assumptions: extractAssumptions(conversation),
      decisions: extractDecisions(conversation)
    }
  }
}
```

## 7. Output Generation

### Complete Package Generator
```typescript
// server/services/outputGenerator.ts
export class OutputGenerator {
  async generatePackage(wizardState: WizardState): Promise<OutputPackage> {
    const package = {
      documentation: await this.generateDocs(wizardState),
      mockups: await this.finalizeMockups(wizardState),
      builderInstructions: await this.generateInstructions(wizardState),
      metadata: this.generateMetadata(wizardState)
    }
    
    // Create downloadable package
    return this.packageForDownload(package)
  }
  
  private async generateDocs(state: WizardState) {
    const docs = []
    
    // Vision document
    docs.push({
      name: 'vision.md',
      content: await this.generateVisionDoc(state)
    })
    
    // Page-specific docs
    for (const mockup of state.mockups) {
      docs.push({
        name: `pages/${mockup.name}.md`,
        content: await this.generatePageDoc(mockup, state)
      })
    }
    
    return docs
  }
  
  private async generateInstructions(state: WizardState) {
    // Generate Claude Code compatible instructions
    return {
      setup: this.generateSetupScript(state),
      components: this.generateComponentInstructions(state),
      implementation: this.generateImplementationSteps(state)
    }
  }
}
```

## 8. Implementation Timeline

### Phase 1: Core Wizard Engine
- [ ] Wizard state management
- [ ] Question flow engine
- [ ] Answer processing
- [ ] Context preservation

### Phase 2: Chat Integration
- [ ] Landing page chat
- [ ] Wizard activation
- [ ] Seamless transitions
- [ ] Progress tracking

### Phase 3: Mockup Generation
- [ ] AI-powered generation
- [ ] Design system application
- [ ] Responsive behavior
- [ ] Linking system

### Phase 4: Account & Persistence
- [ ] Seamless signup
- [ ] State preservation
- [ ] Project creation
- [ ] Resume capability

### Phase 5: Output Generation
- [ ] Documentation generation
- [ ] Mockup finalization
- [ ] Builder instructions
- [ ] Download packages

### Phase 6: Polish & Testing
- [ ] User testing
- [ ] Performance optimization
- [ ] Error handling
- [ ] Edge cases

## 9. Database Schema Updates

```sql
-- Wizard sessions
CREATE TABLE wizard_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  wizard_type TEXT NOT NULL,
  state JSONB NOT NULL,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  output_generated BOOLEAN DEFAULT false
);

-- Wizard answers
CREATE TABLE wizard_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES wizard_sessions(id),
  phase TEXT NOT NULL,
  question_id TEXT NOT NULL,
  answer JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Generated mockups
CREATE TABLE wizard_mockups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES wizard_sessions(id),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  html_content TEXT NOT NULL,
  design_tokens JSONB NOT NULL,
  linked_pages JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 10. Success Metrics

### User Experience
- Time to first mockup: < 2 minutes
- Wizard completion rate: > 80%
- Account creation conversion: > 90%
- User satisfaction: > 4.5/5

### Technical Performance
- Question response time: < 500ms
- Mockup generation: < 5 seconds
- Full package generation: < 30 seconds
- State preservation: 100% reliable

### Business Impact
- Projects started: 10x increase
- Time to working prototype: 90% reduction
- User activation: 70%+ complete a project
- Viral coefficient: Users share previews