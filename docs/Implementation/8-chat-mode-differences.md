## 8. Chat Mode Differences

```markdown
# Chat Mode Differences Documentation

## Overview
FlexOS features three distinct chat modes - Vision/Focus Chat, Wizard Chat, and Builder Chat - each optimized for different stages of the development process and user needs. Understanding these differences is crucial for providing the right experience at the right time.

## Vision/Focus Chat

### Purpose
Vision Chat is the exploratory, dream-building mode where users articulate their ideas without technical constraints. It's about discovering what they want to build, not how to build it.

### UI/UX Characteristics

```vue
<template>
  <div class="vision-chat-container">
    <!-- Full screen, distraction-free -->
    <div class="vision-chat">
      <!-- Minimal header -->
      <VisionHeader>
        <h1>Let's bring your idea to life</h1>
        <button @click="exitVision" class="subtle">
          Save and continue building →
        </button>
      </VisionHeader>
      
      <!-- Conversational area -->
      <MessageFlow>
        <WelcomeMessage v-if="isFirstMessage">
          <h2>Hi! I'm excited to hear about your project idea.</h2>
          <p>Tell me what you want to build - dream big!</p>
          
          <InspirationPrompts>
            <prompt>I want to build an app that...</prompt>
            <prompt>It's like [existing app] but for...</prompt>
            <prompt>The problem I'm solving is...</prompt>
          </InspirationPrompts>
        </WelcomeMessage>
        
        <ConversationMessage
          v-for="message in messages"
          :key="message.id"
          :message="message"
          :show-enthusiasm="true"
        />
      </MessageFlow>
      
      <!-- Input area - spacious and inviting -->
      <VisionInput>
        <textarea
          v-model="userMessage"
          placeholder="Describe your vision..."
          :rows="4"
          @keydown.enter.shift="sendMessage"
        />
        
        <InputHelpers>
          <button @click="attachInspiration">
            <icon name="image" /> Add inspiration
          </button>
          <button @click="voiceInput" v-if="hasVoice">
            <icon name="mic" /> Speak your idea
          </button>
        </InputHelpers>
      </VisionInput>
    </div>
    
    <!-- Hidden: Question queue for AI -->
    <HiddenQuestionQueue :questions="aiQuestions" />
  </div>
</template>

<style scoped>
.vision-chat-container {
  height: 100vh;
  background: var(--gradient-inspire);
  display: flex;
  align-items: center;
  justify-content: center;
}

.vision-chat {
  max-width: 800px;
  width: 90%;
  background: var(--surface-elevated);
  border-radius: 20px;
  padding: 40px;
  box-shadow: var(--shadow-dream);
}

.vision-input textarea {
  width: 100%;
  border: none;
  background: var(--input-vision);
  border-radius: 12px;
  padding: 20px;
  font-size: 18px;
  line-height: 1.6;
}
</style>
```

### AI System Prompt

```typescript
const VISION_CHAT_PROMPT = `
You are an enthusiastic friend helping someone dream up their perfect app. 
Your personality:
- Genuinely excited about their ideas
- Ask questions that spark imagination
- Never mention technical details unless they do first
- Use analogies they'll understand
- Build on their enthusiasm

Your hidden agenda (never mention this):
${context.questionQueue.map(q => `- Find out: ${q.question}`).join('\n')}

Weave these questions naturally into conversation. One at a time.

Example responses:
"Oh wow, a recipe sharing app for families! That's so sweet. I can imagine 
grandma's secret cookie recipe finally getting passed down! 😊 How do you 
picture family members adding their recipes?"

"That's brilliant! Kind of like Pinterest but for lesson plans? Teachers 
would love that. What made you think of this idea?"

Never say:
- "What's your target audience?"
- "What features do you need?"
- "What's your tech stack?"
- "Have you considered the database schema?"

Always:
- Match their energy
- Ask follow-up questions that feel natural
- Paint pictures with words
- Get specific through stories, not specifications
`;
```

### Context Requirements

```typescript
interface VisionChatContext {
  // Minimal project context
  project: {
    id: string;
    name?: string;
    type?: string;
  };
  
  // AI's hidden question queue
  questionQueue: VisionQuestion[];
  
  // Conversation memory
  conversationHistory: Message[];
  
  // Discovered information
  discoveredContext: {
    vision?: string;
    target_users?: string[];
    inspiration_sources?: string[];
    key_problems?: string[];
    desired_feeling?: string;
    success_looks_like?: string;
  };
  
  // No technical context needed
  technical: null;
}
```

### Example Conversation Flow

```typescript
// User: "I want to build something for teachers"

// AI (with hidden question about target users):
{
  response: `Teachers! Yes! 💡 They work so hard and deserve great tools. 
  Are you thinking about elementary school teachers with their colorful 
  classrooms, or maybe high school teachers managing tons of essays? 
  Or something else entirely?`,
  
  hiddenIntent: 'discover_specific_user_segment',
  questionProgress: {
    'target_users': 0.3 // Partially answered
  }
}

// User: "Elementary teachers - my mom is one and she's always making worksheets"

// AI (question answered, moving to next):
{
  response: `Aww, that's wonderful that you're thinking of your mom! I bet 
  she spends hours on those worksheets. 😊 What's the most frustrating 
  part for her - is it creating them from scratch, or organizing all the 
  ones she's made, or something else?`,
  
  hiddenIntent: 'discover_core_problem',
  questionProgress: {
    'target_users': 1.0, // Fully answered
    'core_problem': 0.2  // Starting to explore
  }
}
```

## Wizard Chat

### Purpose
Wizard Chat is a focused, guided conversation for creating specific elements. It's like having an expert designer sitting next to you, walking you through decisions step by step.

### UI/UX Characteristics

```vue
<template>
  <div class="wizard-chat-container">
    <SplitPanel :ratio="45:55">
      <!-- Left: Guided conversation -->
      <template #left>
        <WizardPanel>
          <!-- Progress indicator -->
          <WizardProgress>
            <MilestoneBar 
              :milestones="wizard.milestones"
              :current="currentMilestone"
              :completed="completedMilestones"
            />
          </WizardProgress>
          
          <!-- Focused chat -->
          <WizardMessages>
            <WizardMessage
              v-for="message in messages"
              :key="message.id"
              :message="message"
              :milestone="message.milestone"
            />
          </WizardMessages>
          
          <!-- Rich inputs based on context -->
          <WizardInputArea>
            <!-- Dynamic components -->
            <component 
              :is="currentInputComponent"
              v-bind="currentInputProps"
              @input="handleRichInput"
            />
            
            <!-- Examples: -->
            <ColorPalettePicker 
              v-if="discussing === 'colors'"
              :suggestions="colorSuggestions"
              @select="selectColors"
            />
            
            <LayoutGrid 
              v-if="discussing === 'layout'"
              :options="layoutOptions"
              @choose="chooseLayout"
            />
            
            <ComponentGallery
              v-if="discussing === 'components'"
              :components="relevantComponents"
              @select="selectComponents"
            />
            
            <!-- Always-present text input -->
            <ChatInput 
              v-model="userInput"
              :placeholder="contextualPlaceholder"
              :suggestions="currentSuggestions"
            />
          </WizardInputArea>
        </WizardPanel>
      </template>
      
      <!-- Right: Live preview -->
      <template #right>
        <WizardPreview>
          <!-- Thinking chain -->
          <ThinkingChain 
            v-if="showThinking"
            :thoughts="aiThoughts"
            :interactive="true"
            @correct="correctThought"
          />
          
          <!-- Live preview based on wizard type -->
          <PageMockup 
            v-if="wizard.type === 'page-creator'"
            :html="currentMockup.html"
            :css="currentMockup.css"
            :device="previewDevice"
            :live-updates="true"
          />
          
          <DesignSystemPreview
            v-if="wizard.type === 'design-system'"
            :tokens="currentTokens"
            :examples="tokenExamples"
          />
          
          <FeatureFlowPreview
            v-if="wizard.type === 'feature-builder'"
            :flow="currentFeatureFlow"
            :interactive="true"
          />
        </WizardPreview>
      </template>
    </SplitPanel>
  </div>
</template>
```

### AI System Prompt

```typescript
const WIZARD_CHAT_PROMPT = `
You are guiding the user through creating a ${wizard.type}. Be friendly 
but focused on the task at hand.

Current milestone: ${currentMilestone.name}
Goal: ${currentMilestone.goal}

Your approach:
- Ask one thing at a time
- Show visual examples when possible
- Provide sensible defaults
- Explain implications of choices simply
- Keep technical terms minimal
- Gently redirect if user goes off-topic

For this milestone, explore:
${currentMilestone.explorationGoals.join('\n')}

If user seems stuck, offer the simplest good option:
"How about we start with [specific suggestion]? We can always change it later."

When showing options, explain the trade-offs:
"The centered layout is great for forms and focused content. The sidebar 
layout works better if you have lots of navigation options. Which feels 
right for your ${contextItem}?"

Always relate choices back to their vision:
"Since you mentioned this is for ${userContext.targetUsers}, 
${contextualSuggestion}"
`;
```

### Context Requirements

```typescript
interface WizardChatContext {
  // Wizard state
  wizard: {
    type: string;
    currentMilestone: string;
    completedMilestones: string[];
    decisions: Decision[];
  };
  
  // What we're building
  targetItem: {
    type: 'page' | 'feature' | 'design-system';
    id: string;
    currentState: any;
  };
  
  // Project context (filtered to relevant parts)
  projectContext: {
    vision: string;
    designPatterns: Pattern[];
    existingPages?: Page[]; // Only if relevant
    existingFeatures?: Feature[]; // Only if relevant
  };
  
  // Conversation state
  conversationState: {
    messagesInMilestone: Message[];
    richInputsProvided: RichInput[];
    currentFocus: string;
  };
}
```

### Wizard-Specific Interactions

```typescript
class WizardInteractionHandler {
  // Handle rich inputs
  async handleColorSelection(colors: ColorSelection) {
    // Update preview immediately
    this.updateLivePreview({ colors });
    
    // Generate contextual response
    const response = await this.generateResponse({
      type: 'color_selected',
      context: colors,
      milestone: this.currentMilestone
    });
    
    // Check milestone progress
    this.updateMilestoneProgress('colors', 1.0);
  }
  
  // Handle layout choice
  async handleLayoutSelection(layout: Layout) {
    // Show in preview
    this.applyLayoutToPreview(layout);
    
    // Ask follow-up if needed
    if (layout.requiresConfiguration) {
      this.askLayoutConfiguration(layout);
    } else {
      this.confirmLayoutChoice(layout);
    }
  }
  
  // Keep focused on current task
  async handleOffTopicMessage(message: string) {
    const response = `That's interesting! Let's save that thought for later. 
    Right now, we're figuring out ${this.currentMilestone.friendlyName}. 
    ${this.getRefocusQuestion()}`;
    
    return response;
  }
}
```

## Builder Chat

### Purpose
Builder Chat is the everyday working mode - minimal, efficient, and context-aware. It's like having a smart assistant who knows exactly what you're working on.

### UI/UX Characteristics

```vue
<template>
  <div class="builder-chat">
    <!-- Minimal, efficient interface -->
    <div class="chat-container">
      <!-- Context indicator - always visible -->
      <ContextBar>
        <ContextPill 
          v-for="ctx in activeContexts"
          :key="ctx.id"
          :type="ctx.type"
          :label="ctx.label"
          removable
          @remove="removeContext(ctx)"
        />
      </ContextBar>
      
      <!-- Compact message list -->
      <MessageList :compact="true">
        <BuilderMessage
          v-for="message in recentMessages"
          :key="message.id"
          :message="message"
          :compact="true"
        />
      </MessageList>
      
      <!-- Smart suggestions -->
      <SuggestionChips v-if="suggestions.length">
        <chip 
          v-for="suggestion in suggestions"
          :key="suggestion.id"
          @click="applySuggestion(suggestion)"
        >
          {{ suggestion.label }}
        </chip>
      </SuggestionChips>
      
      <!-- Minimal input -->
      <BuilderInput>
        <input
          v-model="userInput"
          :placeholder="dynamicPlaceholder"
          @keydown.enter="sendMessage"
          @keydown.cmd.k="showCommandPalette"
        />
        
        <QuickActions>
          <button @click="attachContext" title="Attach context (⌘+A)">
            <icon name="paperclip" size="16" />
          </button>
          <button @click="captureElement" title="Point to element (⌘+P)">
            <icon name="pointer" size="16" />
          </button>
        </QuickActions>
      </BuilderInput>
    </div>
  </div>
</template>

<style scoped>
.builder-chat {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
}

/* Compact, efficient styling */
.builder-message {
  padding: 8px 12px;
  border-radius: 8px;
}

.suggestion-chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.builder-input input {
  flex: 1;
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 14px;
}
</style>
```

### AI System Prompt

```typescript
const BUILDER_CHAT_PROMPT = `
You are a helpful, efficient assistant in builder mode. The user is actively 
building their app and needs quick, actionable help.

Current context:
- Viewing: ${context.activeTab} tab
- Selected: ${context.selection?.name || 'nothing'}
- Recent action: ${context.recentAction}

Your approach:
- Be concise and action-oriented
- Understand context without asking
- Provide specific, implementable suggestions
- Reference existing patterns in their project
- Assume they know what they want

Response style:
- Short, clear sentences
- No unnecessary enthusiasm
- Technical terms OK if they've used them
- Direct answers, no philosophical questions

Examples:
User: "add a header"
You: "I'll add a header to ${context.currentPage}. Fixed or sticky?"

User: "make it blue"
You: "Updated to primary blue (#1E40AF). [shows preview]"

User: "need user profiles"
You: "I'll create placeholder pages for user profiles. Create the 'View Profile' 
page now, or see all profile-related pages I've planned?"

Never ask:
- "What kind of header do you envision?"
- "How does this align with your vision?"
- "What problem does this solve?"

Always:
- Infer from context
- Act quickly
- Show results immediately
- Offer next logical step
`;
```

### Context Requirements

```typescript
interface BuilderChatContext {
  // Current state
  activeTab: string;
  selection: {
    type: string;
    id: string;
    name: string;
    metadata: any;
  } | null;
  
  // Visual context
  viewingContext: {
    visibleElements: string[];
    scrollPosition: number;
    zoomLevel: number;
  };
  
  // Recent activity
  recentActions: Action[];
  recentMessages: Message[];
  
  // Attached context
  attachments: Attachment[];
  pointingAt: Element | null;
  
  // Project state (efficient subset)
  project: {
    pages: PageSummary[];
    features: FeatureSummary[];
    designSystem: DesignSystemSummary;
    patterns: Pattern[];
  };
  
  // Smart suggestions
  availableActions: Action[];
  predictedIntents: Intent[];
}
```

## Key Differences Summary

### 1. Conversation Style

| Aspect | Vision Chat | Wizard Chat | Builder Chat |
|--------|-------------|-------------|--------------|
| Tone | Enthusiastic, dreamy | Friendly, guiding | Efficient, direct |
| Questions | Open-ended, exploratory | Specific, choice-based | Minimal, confirmatory |
| Responses | Story-like, expansive | Explanatory, educational | Action-oriented, brief |
| Technical Language | Never unless user initiates | Simplified explanations | Normal, as user expects |

### 2. UI/UX Differences

| Element | Vision Chat | Wizard Chat | Builder Chat |
|---------|-------------|-------------|--------------|
| Layout | Full screen, centered | Split panel | Embedded panel |
| Input | Large textarea | Rich inputs + text | Single line input |
| Visual Feedback | Minimal | Live preview | Immediate changes |
| Progress Indicators | Hidden | Milestone bar | None needed |
| Suggestions | Inspiration prompts | Choice options | Action chips |

### 3. Context Management

```typescript
// Vision Chat - Minimal context, maximum discovery
class VisionContextManager {
  getContext(): VisionContext {
    return {
      projectBasics: this.getProjectBasics(),
      hiddenQuestions: this.getQuestionQueue(),
      discoveredInfo: this.getDiscoveredInfo(),
      // No technical context
    };
  }
}

// Wizard Chat - Focused context for specific task
class WizardContextManager {
  getContext(): WizardContext {
    return {
      wizardState: this.getWizardState(),
      relevantProjectContext: this.filterRelevantContext(),
      currentDecisions: this.getDecisionsInWizard(),
      livePreviewState: this.getPreviewState()
    };
  }
}

// Builder Chat - Full context, efficiently accessed
class BuilderContextManager {
  getContext(): BuilderContext {
    return {
      immediateContext: this.getImmediateContext(),
      recentActivity: this.getRecentActivity(),
      projectSnapshot: this.getProjectSnapshot(),
      predictions: this.getPredictedIntents()
    };
  }
}
```

### 4. Input Handling

```typescript
// Vision Chat - Natural language processing
async function handleVisionInput(input: string) {
  const intent = await this.extractEmotionalIntent(input);
  const hiddenQuestions = await this.checkQuestionProgress(input);
  const response = await this.generateDreamyResponse(intent, hiddenQuestions);
  return response;
}

// Wizard Chat - Structured input processing
async function handleWizardInput(input: string | RichInput) {
  const progress = await this.updateMilestoneProgress(input);
  const preview = await this.updateLivePreview(input);
  const response = await this.generateGuidedResponse(progress);
  return { response, preview, progress };
}

// Builder Chat - Command-like processing
async function handleBuilderInput(input: string) {
  const command = await this.parseAsCommand(input);
  const action = await this.executeAction(command);
  const result = await this.showResult(action);
  const nextSuggestions = await this.predictNextActions(action);
  return { result, suggestions: nextSuggestions };
}
```

### 5. Error Handling

```typescript
// Vision Chat - Gentle redirection
handleVisionError(error: any) {
  return `Oh, let me think about that differently! 
          Tell me more about what you're imagining...`;
}

// Wizard Chat - Educational recovery
handleWizardError(error: any) {
  return `Hmm, that didn't work as expected. This usually happens when 
          ${this.explainError(error)}. How about we try ${this.suggestAlternative()}?`;
}

// Builder Chat - Direct problem solving
handleBuilderError(error: any) {
  return `Can't ${error.action} because ${error.reason}. 
          Try: ${this.getWorkingSolution(error)}`;
}
```

## Mode Transitions

### Vision → Builder
```typescript
function transitionFromVisionToBuilder() {
  // Save discovered context
  const visionContext = saveVisionDiscoveries();
  
  // Generate initial project structure
  const projectScaffold = generateFromVision(visionContext);
  
  // Prepare builder mode
  initializeBuilder({
    mode: 'fresh-from-vision',
    context: projectScaffold,
    suggestions: getStartingSuggestions(visionContext)
  });
  
  // Smooth transition message
  showTransition({
    message: "Great! I've set up your project structure. Let's start building!",
    highlights: projectScaffold.keyElements
  });
}
```

### Builder → Wizard
```typescript
function transitionToWizard(wizardType: string, trigger: any) {
  // Determine embed vs full screen
  const displayMode = this.getWizardDisplayMode(wizardType);
  
  if (displayMode === 'embedded') {
    // Stay in builder, show wizard in panel
    this.showEmbeddedWizard(wizardType, {
      context: this.getCurrentBuilderContext(),
      trigger: trigger
    });
  } else {
    // Full wizard experience
    this.navigateToWizard(wizardType, {
      returnTo: 'builder',
      context: this.packageRelevantContext(wizardType)
    });
  }
}
```

### Wizard → Builder
```typescript
function completeWizardAndReturn(wizardOutput: any) {
  // Integrate wizard output
  this.integrateWizardOutput(wizardOutput);
  
  // Return to builder with context
  this.returnToBuilder({
    highlight: wizardOutput.created,
    suggestions: this.getPostWizardSuggestions(wizardOutput),
    message: `Created ${wizardOutput.summary}! What's next?`
  });
}
```

## Best Practices by Mode

### Vision Chat
1. Never rush the user
2. Extract information through stories
3. Hide complexity completely
4. Build enthusiasm and confidence
5. Make them feel heard and understood

### Wizard Chat
1. One decision at a time
2. Always show impact of choices
3. Provide escape hatches
4. Celebrate progress
5. Keep focused but friendly

### Builder Chat
1. Respond instantly
2. Infer from context
3. Show, don't tell
4. Anticipate next actions
5. Stay out of the way

## Performance Considerations

```typescript
// Vision Chat - Can be slower, more thoughtful
const VISION_CHAT_SETTINGS = {
  responseDelay: 500, // Feels more conversational
  typingIndicator: true,
  streamResponse: true,
  maxTokens: 2000 // Longer responses OK
};

// Wizard Chat - Balanced performance
const WIZARD_CHAT_SETTINGS = {
  responseDelay: 200,
  typingIndicator: true,
  streamResponse: true,
  maxTokens: 1000,
  prioritizePreviews: true // Update preview before response
};

// Builder Chat - Maximum speed
const BUILDER_CHAT_SETTINGS = {
  responseDelay: 0, // Instant
  typingIndicator: false, // Too distracting
  streamResponse: false, // Show all at once
  maxTokens: 500, // Keep it brief
  cacheAggressively: true,
  predictiveLoading: true
};
```