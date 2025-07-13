
## 6. Wizards

```markdown
# Wizard System Documentation

## Overview
Wizards are focused, conversational interfaces that guide users through creating specific elements of their application. They maintain the chat interface but with enhanced interactivity and a clear goal.

## Wizard Architecture

### Core Wizard Structure

```typescript
interface Wizard {
  id: string;
  type: WizardType;
  metadata: {
    name: string;
    description: string;
    icon: string;
    estimatedTime: number; // minutes
    difficulty: 'beginner' | 'intermediate' | 'advanced';
  };
  
  settings: {
    allowBackNavigation: boolean;
    saveProgress: boolean;
    showProgressIndicator: boolean;
    requiresContext: string[]; // Required context types
  };
  
  milestones: Milestone[];
  interactions: InteractionType[];
  outputs: OutputSpecification[];
}

interface Milestone {
  id: string;
  name: string;
  description: string;
  required: boolean;
  
  // Flexible achievement conditions
  completion: {
    type: 'user_input' | 'ai_analysis' | 'user_confirmation';
    conditions: CompletionCondition[];
  };
  
  // What to explore
  explorationGoals: string[];
  
  // How to explore it
  conversationStrategies: ConversationStrategy[];
}
```

### Wizard Types

```typescript
enum WizardType {
  // Page Creation
  PAGE_CREATOR = 'page-creator',
  PAGE_ENHANCER = 'page-enhancer',
  
  // Feature Building  
  FEATURE_BUILDER = 'feature-builder',
  API_DESIGNER = 'api-designer',
  
  // Design System
  DESIGN_SYSTEM_CREATOR = 'design-system-creator',
  DESIGN_SYSTEM_REFINER = 'design-system-refiner',
  
  // User Journeys
  JOURNEY_MAPPER = 'journey-mapper',
  FLOW_OPTIMIZER = 'flow-optimizer',
  
  // Data Modeling
  ENTITY_DESIGNER = 'entity-designer',
  RELATIONSHIP_MAPPER = 'relationship-mapper',
  
  // Enhancement
  ACCESSIBILITY_WIZARD = 'accessibility-wizard',
  PERFORMANCE_WIZARD = 'performance-wizard',
  MOBILE_OPTIMIZER = 'mobile-optimizer'
}
```

## Wizard UI Components

### Split Panel Layout

```vue
<template>
  <div class="wizard-container">
    <SplitView :ratio="wizardViewRatio">
      <!-- Left: Conversational Interface -->
      <template #left>
        <WizardChat>
          <!-- Progress indicator -->
          <WizardProgress
            :milestones="wizard.milestones"
            :completed="completedMilestones"
            :current="currentMilestone"
          />
          
          <!-- Chat messages -->
          <MessageList
            :messages="messages"
            :thinking="aiThinking"
          />
          
          <!-- Rich input area -->
          <WizardInputArea>
            <!-- Dynamic input based on context -->
            <component
              :is="currentInputComponent"
              v-bind="currentInputProps"
              @input="handleUserInput"
            />
            
            <!-- Always available text input -->
            <ChatInput
              v-model="userMessage"
              :placeholder="inputPlaceholder"
              :suggestions="currentSuggestions"
              @submit="sendMessage"
            />
            
            <!-- Context attachments -->
            <AttachmentBar>
              <button @click="attachScreenshot">
                <icon name="camera" /> Screenshot
              </button>
              <button @click="attachURL">
                <icon name="link" /> URL
              </button>
              <button @click="attachFile">
                <icon name="file" /> File
              </button>
            </AttachmentBar>
          </WizardInputArea>
        </WizardChat>
      </template>
      
      <!-- Right: Live Preview/Output -->
      <template #right>
        <WizardOutput>
          <!-- Thinking chain (collapsible) -->
          <ThinkingChain
            v-if="showThinking"
            :thoughts="aiThoughts"
            @revisit="revisitThought"
            @correct="correctAssumption"
          />
          
          <!-- Main output area -->
          <component
            :is="outputComponent"
            :data="currentOutput"
            :preview-mode="previewMode"
            @interact="handleOutputInteraction"
          />
          
          <!-- Output controls -->
          <OutputControls>
            <button @click="toggleDevice" v-if="hasDevicePreview">
              <icon :name="currentDevice" />
            </button>
            <button @click="toggleThinking">
              <icon name="brain" /> Thinking
            </button>
            <button @click="compareVersions" v-if="hasVersions">
              <icon name="compare" /> Compare
            </button>
          </OutputControls>
        </WizardOutput>
      </template>
    </SplitView>
  </div>
</template>
```

### Rich Input Components

#### Color Palette Builder
```vue
<template>
  <div class="color-palette-builder">
    <h4>Let's build your color palette</h4>
    
    <!-- Inspiration sources -->
    <InspirationRow>
      <ColorExtractor
        v-if="recentScreenshot"
        :image="recentScreenshot"
        @colors-extracted="suggestColors"
      />
      
      <ColorSuggestions
        :based-on="projectContext"
        @select="addColor"
      />
    </InspirationRow>
    
    <!-- Current palette -->
    <ColorPalette>
      <ColorSwatch
        v-for="(color, name) in currentColors"
        :key="name"
        :color="color"
        :name="name"
        @click="editColor(name)"
        @remove="removeColor(name)"
      >
        <ContrastChecker :color="color" />
      </ColorSwatch>
      
      <AddColorButton @click="showColorPicker">
        <icon name="plus" /> Add Color
      </AddColorButton>
    </ColorPalette>
    
    <!-- Smart suggestions -->
    <AISuggestions v-if="currentColors.primary">
      <p>Based on your primary color, these might work well:</p>
      <ColorSuggestionGrid
        :suggestions="aiColorSuggestions"
        @select="addSuggestedColor"
      />
    </AISuggestions>
  </div>
</template>
```

#### Layout Selector
```vue
<template>
  <div class="layout-selector">
    <h4>Choose a layout structure</h4>
    
    <!-- Visual layout options -->
    <LayoutGrid>
      <LayoutOption
        v-for="layout in layoutOptions"
        :key="layout.id"
        :selected="selectedLayout === layout.id"
        @click="selectLayout(layout)"
      >
        <LayoutPreview
          :structure="layout.structure"
          :device="currentDevice"
        />
        <h5>{{ layout.name }}</h5>
        <p>{{ layout.description }}</p>
      </LayoutOption>
    </LayoutGrid>
    
    <!-- Custom layout builder -->
    <details>
      <summary>Create custom layout</summary>
      <GridBuilder
        @update="updateCustomLayout"
        :initial="customLayout"
      />
    </details>
  </div>
</template>
```

## Wizard Database Schema

```sql
-- Wizard definitions (could be in code/config)
CREATE TABLE wizard_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wizard_type VARCHAR(50) NOT NULL,
  version VARCHAR(20) NOT NULL,
  definition JSONB NOT NULL, -- Full wizard configuration
  
  -- Metadata
  name VARCHAR(255) NOT NULL,
  description TEXT,
  tags TEXT[],
  
  -- Usage stats
  times_used INTEGER DEFAULT 0,
  avg_completion_time INTEGER, -- seconds
  completion_rate FLOAT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wizard runs (instances)
CREATE TABLE wizard_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  wizard_type VARCHAR(50) NOT NULL,
  wizard_version VARCHAR(20),
  
  -- State
  status VARCHAR(50) DEFAULT 'in_progress', -- in_progress|completed|abandoned
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  abandoned_at TIMESTAMP WITH TIME ZONE,
  
  -- Progress
  current_milestone VARCHAR(100),
  completed_milestones JSONB DEFAULT '[]',
  milestone_data JSONB DEFAULT '{}', -- Data collected per milestone
  
  -- Conversation
  messages JSONB DEFAULT '[]',
  /* Structure:
  [
    {
      "role": "assistant|user",
      "content": "message text",
      "type": "text|rich",
      "rich_content": {...}, // For rich inputs
      "milestone": "milestone_id",
      "timestamp": "2024-01-20T10:00:00Z"
    }
  ]
  */
  
  -- Context and decisions
  initial_context JSONB DEFAULT '{}', -- Context when started
  decisions_made JSONB DEFAULT '[]',
  /* Structure:
  [
    {
      "milestone": "milestone_id",
      "decision_type": "color_choice|layout_selection",
      "value": {...},
      "confidence": 0.9,
      "timestamp": "2024-01-20T10:00:00Z"
    }
  ]
  */
  
  -- Thinking chain
  ai_thoughts JSONB DEFAULT '[]',
  /* Structure:
  [
    {
      "id": "thought_123",
      "type": "observation|assumption|decision|question",
      "thought": "User seems to prefer minimal designs",
      "evidence": ["chose clean layout", "rejected busy option"],
      "confidence": 0.85,
      "milestone": "design_preferences",
      "status": "active|revised|rejected",
      "revisions": []
    }
  ]
  */
  
  -- Outputs
  outputs JSONB DEFAULT '{}',
  /* Structure:
  {
    "mockups": ["mockup_id_1", "mockup_id_2"],
    "pages_created": ["page_id_1"],
    "design_tokens": {...},
    "specifications": {...}
  }
  */
  
  -- Analytics
  interaction_count INTEGER DEFAULT 0,
  backtrack_count INTEGER DEFAULT 0,
  revision_count INTEGER DEFAULT 0
);

CREATE INDEX idx_wizard_runs_project ON wizard_runs(project_id);
CREATE INDEX idx_wizard_runs_status ON wizard_runs(status);
CREATE INDEX idx_wizard_runs_type ON wizard_runs(wizard_type);

-- Wizard outputs (what was created)
CREATE TABLE wizard_outputs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wizard_run_id UUID REFERENCES wizard_runs(id) ON DELETE CASCADE,
  output_type VARCHAR(50), -- page|mockup|design_system|feature|journey
  output_id UUID, -- Reference to created item
  
  -- Creation context
  milestone VARCHAR(100), -- Which milestone created this
  creation_method VARCHAR(50), -- ai_generated|user_provided|hybrid
  confidence_score FLOAT,
  
  -- Modifications
  user_modified BOOLEAN DEFAULT FALSE,
  modification_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Wizard Triggers

### 1. Direct Button Triggers
```vue
<template>
  <div class="page-actions">
    <button 
      @click="startWizard('page-creator')"
      class="primary-action"
    >
      <icon name="sparkle" /> Create New Page
    </button>
  </div>
</template>

<script setup>
async function startWizard(wizardType: string, context?: any) {
  // Check if wizard is appropriate
  const canStart = await checkWizardPrerequisites(wizardType);
  
  if (!canStart.success) {
    showMessage(canStart.message);
    return;
  }
  
  // Prepare context
  const wizardContext = {
    project_id: currentProject.id,
    starting_context: {
      ...getCurrentContext(),
      ...context
    },
    entry_point: 'button_click'
  };
  
  // Navigate to wizard
  await router.push({
    name: 'wizard',
    params: { type: wizardType },
    state: { context: wizardContext }
  });
}
</script>
```

### 2. AI-Suggested Triggers
```typescript
class WizardSuggestionEngine {
  // Analyze user intent and suggest wizard
  async suggestWizard(userMessage: string, context: Context) {
    const intent = await this.analyzeIntent(userMessage);
    
    // Single page request → Page Creator Wizard
    if (intent.type === 'create_single_page') {
      return {
        wizard: 'page-creator',
        confidence: 0.9,
        message: "Let's design this page properly! I'll guide you through it.",
        context: {
          page_name: intent.extracted.pageName,
          page_type: intent.extracted.pageType
        }
      };
    }
    
    // Design system request → Design System Wizard
    if (intent.type === 'design_system' && !context.hasDesignSystem) {
      return {
        wizard: 'design-system-creator',
        confidence: 0.85,
        message: "Perfect timing! Let's set up your design system.",
        context: {
          inspiration: context.recentScreenshots
        }
      };
    }
    
    // Feature request → Feature Builder
    if (intent.type === 'add_feature') {
      return {
        wizard: 'feature-builder',
        confidence: 0.8,
        message: "This sounds like a great feature. Let's flesh it out!",
        context: {
          feature_description: userMessage,
          affected_areas: this.identifyAffectedAreas(intent)
        }
      };
    }
    
    return null;
  }
}
```

### 3. Contextual Triggers
```vue
<template>
  <PlaceholderCard 
    v-for="placeholder in placeholders"
    :key="placeholder.id"
  >
    <div class="placeholder-content">
      <icon name="layout" size="48" />
      <h3>{{ placeholder.name }}</h3>
      <p>{{ placeholder.inferred_purpose }}</p>
    </div>
    
    <div class="placeholder-actions">
      <button 
        @click="startPageWizard(placeholder)"
        class="primary"
      >
        <icon name="sparkle" /> Create this page
      </button>
      <button @click="quickEdit(placeholder)">
        Quick edit
      </button>
    </div>
  </PlaceholderCard>
</template>
```

## Wizard Conversation Management

### Milestone-Based Conversation Flow

```typescript
class WizardConversationManager {
  private wizard: Wizard;
  private currentMilestone: Milestone;
  private conversationState: ConversationState;
  
  async processUserMessage(message: string, richData?: any) {
    // 1. Update conversation
    this.addMessage('user', message, richData);
    
    // 2. Check if milestone is satisfied
    const milestoneProgress = await this.checkMilestoneProgress(
      message,
      richData
    );
    
    if (milestoneProgress.completed) {
      // Move to next milestone
      await this.completeCurrentMilestone();
      this.currentMilestone = this.getNextMilestone();
      
      // Transition message
      const transition = this.generateTransitionMessage();
      this.addMessage('assistant', transition);
    }
    
    // 3. Generate contextual response
    const response = await this.generateResponse(message, {
      milestone: this.currentMilestone,
      progress: milestoneProgress,
      richData: richData
    });
    
    // 4. Update outputs if needed
    if (response.hasOutputUpdate) {
      await this.updateOutput(response.outputUpdate);
    }
    
    return response;
  }
  
  // Natural exploration strategies
  private async exploreGoal(goal: string): Promise<string> {
    const strategies = this.currentMilestone.conversationStrategies;
    const context = this.conversationState;
    
    // Pick appropriate strategy
    const strategy = this.selectStrategy(strategies, context);
    
    // Generate natural question
    return await this.generateNaturalQuestion(goal, strategy);
  }
}
```

### Rich Interactions

```typescript
interface RichInteraction {
  type: 'color_selection' | 'layout_choice' | 'component_selection' | 'text_input';
  
  // Color selection
  colorSelection?: {
    selected: Color[];
    source: 'picker' | 'extraction' | 'suggestion';
    context: 'primary' | 'palette' | 'specific_element';
  };

  // Layout choice
  layoutChoice?: {
    selected: LayoutOption;
    customModifications?: LayoutModification[];
    device: 'mobile' | 'tablet' | 'desktop';
  };
  
  // Component selection
  componentSelection?: {
    components: ComponentChoice[];
    arrangement: 'grid' | 'list' | 'custom';
    interactions: InteractionMapping[];
  };
  
  // File/URL attachment
  attachment?: {
    type: 'screenshot' | 'url' | 'file';
    content: any;
    annotation?: string;
    specificElements?: string[];
  };
}
```

## Wizard Output Specifications

### Output Types by Wizard

```typescript
interface WizardOutput {
  wizard_type: WizardType;
  wizard_run_id: string;
  version: string;
  
  // Core outputs
  primary_output: PrimaryOutput;
  secondary_outputs: SecondaryOutput[];
  
  // Specifications generated
  specifications: {
    markdown: string;
    json: any;
    implementation_notes: string[];
  };
  
  // Context for future use
  context_generated: {
    patterns: Pattern[];
    decisions: Decision[];
    assumptions: Assumption[];
  };
}

// Page Creator Output
interface PageCreatorOutput extends WizardOutput {
  primary_output: {
    page: {
      id: string;
      name: string;
      path: string;
      mockup_id: string;
    };
    mockup: {
      html: string;
      css: string;
      responsive_rules: ResponsiveRules;
      interactions: Interaction[];
    };
  };
  
  secondary_outputs: [
    {
      type: 'design_tokens_extracted';
      tokens: DesignToken[];
    },
    {
      type: 'components_identified';
      components: Component[];
    }
  ];
}

// Design System Creator Output
interface DesignSystemOutput extends WizardOutput {
  primary_output: {
    design_system: {
      id: string;
      tokens: {
        colors: ColorSystem;
        typography: TypographySystem;
        spacing: SpacingSystem;
        shadows: ShadowSystem;
        animations: AnimationSystem;
      };
      components: ComponentDefinition[];
    };
  };
  
  secondary_outputs: [
    {
      type: 'usage_guidelines';
      guidelines: Guidelines;
    },
    {
      type: 'example_applications';
      examples: Example[];
    }
  ];
}
```

## Wizard Examples

### 1. Page Creator Wizard Flow

```typescript
const PAGE_CREATOR_WIZARD: WizardDefinition = {
  id: 'page-creator',
  metadata: {
    name: 'Page Creator',
    icon: '✨',
    estimatedTime: 10,
    difficulty: 'beginner'
  },
  
  milestones: [
    {
      id: 'understand_purpose',
      name: 'Page Purpose',
      explorationGoals: [
        'What this page is for',
        'Who will use it',
        'What users should accomplish'
      ],
      conversationStrategies: [
        {
          approach: 'concrete_examples',
          prompts: [
            "What will people do on this page?",
            "Is this like a dashboard, a form, a list...?",
            "Show me a page that has the vibe you want"
          ]
        }
      ]
    },
    
    {
      id: 'layout_structure',
      name: 'Layout & Structure',
      explorationGoals: [
        'Overall layout pattern',
        'Key sections needed',
        'Mobile vs desktop priorities'
      ],
      conversationStrategies: [
        {
          approach: 'visual_selection',
          component: 'LayoutSelector',
          prompts: [
            "Which layout feels right?",
            "Should mobile and desktop be different?"
          ]
        }
      ]
    },
    
    {
      id: 'visual_design',
      name: 'Visual Design',
      explorationGoals: [
        'Colors and theme',
        'Typography choices',
        'Spacing and density'
      ],
      conversationStrategies: [
        {
          approach: 'extraction_from_context',
          prompts: [
            "I noticed you liked [reference], should we use similar colors?",
            "Dense with info or breathing room?"
          ]
        }
      ]
    },
    
    {
      id: 'interactions',
      name: 'Interactions & Behavior',
      explorationGoals: [
        'What happens on click/tap',
        'Loading and error states',
        'Transitions and feedback'
      ],
      conversationStrategies: [
        {
          approach: 'scenario_exploration',
          prompts: [
            "When someone clicks [element], what happens?",
            "What if something goes wrong?",
            "Should things animate or just appear?"
          ]
        }
      ]
    },
    
    {
      id: 'review_refine',
      name: 'Review & Refine',
      explorationGoals: [
        'Final adjustments',
        'Confirmation of decisions',
        'Missing elements'
      ],
      conversationStrategies: [
        {
          approach: 'iterative_refinement',
          prompts: [
            "Here's what we've created. What should we tweak?",
            "Anything missing?",
            "Want to try a different [color/layout/style]?"
          ]
        }
      ]
    }
  ]
};
```

### 2. Feature Builder Wizard Flow

```typescript
const FEATURE_BUILDER_WIZARD: WizardDefinition = {
  id: 'feature-builder',
  metadata: {
    name: 'Feature Builder',
    icon: '🛠️',
    estimatedTime: 15,
    difficulty: 'intermediate'
  },
  
  milestones: [
    {
      id: 'feature_discovery',
      name: 'Understanding the Feature',
      explorationGoals: [
        'Core functionality needed',
        'User problems it solves',
        'Success criteria'
      ],
      conversationStrategies: [
        {
          approach: 'story_telling',
          prompts: [
            "Walk me through how someone would use this",
            "What problem does this solve?",
            "When would someone need this?"
          ]
        }
      ]
    },
    
    {
      id: 'user_flow',
      name: 'User Flow',
      explorationGoals: [
        'Entry points',
        'Step by step process',
        'Success and error paths'
      ],
      conversationStrategies: [
        {
          approach: 'journey_mapping',
          component: 'FlowBuilder',
          prompts: [
            "Where does the user start?",
            "What happens at each step?",
            "What if they make a mistake?"
          ]
        }
      ]
    },
    
    {
      id: 'data_requirements',
      name: 'Data & Logic',
      explorationGoals: [
        'What data is needed',
        'Validation rules',
        'Business logic'
      ],
      conversationStrategies: [
        {
          approach: 'concrete_examples',
          prompts: [
            "What information do we need from the user?",
            "Give me an example of valid data",
            "What shouldn't be allowed?"
          ]
        }
      ]
    },
    
    {
      id: 'ui_components',
      name: 'Interface Design',
      explorationGoals: [
        'Which screens are affected',
        'New components needed',
        'Integration with existing UI'
      ],
      conversationStrategies: [
        {
          approach: 'visual_building',
          prompts: [
            "Which pages need updates?",
            "Should this be a modal, new page, or inline?",
            "How prominent should this feature be?"
          ]
        }
      ]
    }
  ]
};
```

### 3. Design System Wizard Example Conversation

```
WIZARD: Hey! Let's create a design system that'll make your app feel cohesive and 
        professional. First, tell me about the personality you want - is it more 
        playful or serious? Modern or classic?

USER: Modern and professional, but not cold. Like Stripe but warmer.

WIZARD: Perfect! Stripe's clean aesthetic with more warmth. I love it. 
        [Shows color extraction panel]
        I see you uploaded that dashboard screenshot earlier - those blues look 
        great. Want to use that as a starting point?

USER: Yes! But maybe a bit darker for better contrast.

WIZARD: [Updates color in real-time]
        How's this? I've darkened it to #1E40AF. Great contrast with white text!
        
        Now, what about an accent color? Something to draw attention to important
        actions?

USER: [Selects a green from the color picker] This green?

WIZARD: Nice choice! That green (#10B981) gives a fresh, positive feel. 
        [Shows color harmony suggestions]
        Based on these two, here are some supporting colors that would work well...

[Conversation continues naturally through typography, spacing, components...]
```

## Wizard Success Metrics

### Completion Metrics
```sql
-- Track wizard effectiveness
CREATE VIEW wizard_analytics AS
SELECT 
  wizard_type,
  COUNT(*) as total_starts,
  COUNT(*) FILTER (WHERE status = 'completed') as completions,
  COUNT(*) FILTER (WHERE status = 'abandoned') as abandonments,
  ROUND(
    COUNT(*) FILTER (WHERE status = 'completed')::numeric / 
    COUNT(*)::numeric * 100, 
    2
  ) as completion_rate,
  
  -- Time metrics
  AVG(
    EXTRACT(EPOCH FROM (completed_at - started_at))
  ) FILTER (WHERE status = 'completed') as avg_completion_seconds,
  
  -- Interaction metrics
  AVG(interaction_count) as avg_interactions,
  AVG(backtrack_count) as avg_backtracks,
  AVG(revision_count) as avg_revisions,
  
  -- Output quality (from user feedback)
  AVG(output_satisfaction_score) as avg_satisfaction

FROM wizard_runs
GROUP BY wizard_type;

-- Milestone-level analytics
CREATE VIEW milestone_analytics AS
SELECT
  wizard_type,
  milestone_id,
  COUNT(*) as times_reached,
  AVG(time_spent_seconds) as avg_time_spent,
  AVG(interactions_in_milestone) as avg_interactions,
  
  -- Completion funnel
  COUNT(*) FILTER (WHERE completed) as completions,
  COUNT(*) FILTER (WHERE skipped) as skips,
  COUNT(*) FILTER (WHERE abandoned_at) as abandonment_point

FROM wizard_milestone_tracking
GROUP BY wizard_type, milestone_id;
```

### Quality Metrics
```typescript
interface WizardQualityMetrics {
  // Output quality
  outputMetrics: {
    specificityScore: number; // How detailed/specific the output
    completenessScore: number; // All aspects covered
    consistencyScore: number; // Alignment with project patterns
    innovationScore: number; // New ideas introduced
  };
  
  // Conversation quality
  conversationMetrics: {
    naturalness: number; // How conversational vs robotic
    relevance: number; // Staying on topic
    helpfulness: number; // Useful suggestions/questions
    clarity: number; // Easy to understand
  };
  
  // User experience
  experienceMetrics: {
    confidenceBuilding: number; // User felt guided
    controlMaintained: number; // User felt in charge
    progressClarity: number; // User knew where they were
    satisfactionScore: number; // Overall happiness
  };
}
```

## Wizard Best Practices

### 1. Conversation Design
```typescript
// Good: Natural, encouraging, specific
const GOOD_PROMPTS = [
  "I love the clean look! What happens when someone clicks 'Save'?",
  "Should this work on phones too, or just desktop?",
  "That blue is perfect. Want to see how it looks with different button styles?"
];

// Bad: Technical, vague, overwhelming
const BAD_PROMPTS = [
  "Define the onClick handler functionality",
  "What do you want?",
  "Choose: responsive grid, flexbox, CSS grid, absolute positioning, or table layout?"
];
```

### 2. Milestone Design
- **Flexible Achievement**: Users can satisfy milestones in different ways
- **Natural Flow**: Milestones feel like a conversation, not a form
- **Skip When Obvious**: Don't ask about things already evident from context
- **Allow Revision**: Users can always go back and change their mind

### 3. Output Generation
```typescript
class WizardOutputGenerator {
  // Generate outputs progressively
  async generateOutput(wizardRun: WizardRun) {
    const output = {
      immediate: await this.generateImmediateOutput(wizardRun),
      refined: null,
      final: null
    };
    
    // Show something quickly
    await this.showOutput(output.immediate);
    
    // Refine based on complete context
    output.refined = await this.refineOutput(
      output.immediate,
      wizardRun.getAllDecisions()
    );
    
    // Final polish with all patterns applied
    output.final = await this.finalizeOutput(
      output.refined,
      wizardRun.getProjectContext()
    );
    
    return output;
  }
}
```

### 4. Context Awareness
```typescript
class WizardContextManager {
  // Skip questions already answered by context
  shouldAskQuestion(question: Question, context: Context): boolean {
    // Check if answer exists in context
    if (this.hasAnswerInContext(question, context)) {
      return false;
    }
    
    // Check if answer can be inferred
    if (this.canInferAnswer(question, context)) {
      this.addInferredAnswer(question, context);
      return false;
    }
    
    return true;
  }
  
  // Use context to provide better suggestions
  enhanceSuggestions(
    baseSuggestions: Suggestion[],
    context: Context
  ): Suggestion[] {
    return baseSuggestions.map(suggestion => ({
      ...suggestion,
      relevance: this.calculateRelevance(suggestion, context),
      customized: this.customizeForContext(suggestion, context)
    })).sort((a, b) => b.relevance - a.relevance);
  }
}
```

### 5. Error Recovery
```typescript
class WizardErrorRecovery {
  // Handle user confusion
  async handleConfusion(indicator: ConfusionIndicator) {
    switch (indicator.type) {
      case 'repeated_unclear_responses':
        return this.offerClarification();
        
      case 'requests_help':
        return this.provideGuidance();
        
      case 'wants_to_skip':
        return this.allowSkipWithDefaults();
        
      case 'contradictory_inputs':
        return this.seekClarification();
    }
  }
  
  // Graceful abandonment
  async handleAbandonment(wizardRun: WizardRun) {
    // Save progress
    await this.saveProgress(wizardRun);
    
    // Create useful output from partial data
    const partialOutput = await this.generatePartialOutput(wizardRun);
    
    // Offer to resume later
    await this.offerResumption(wizardRun, partialOutput);
  }
}
```

## Wizard Integration Points

### 1. With Visual Flow Builder
- Wizards can add nodes to flows
- Flow selections can trigger wizards
- Wizard outputs appear in appropriate flow views

### 2. With Context System
- Wizards consume project context
- Wizard decisions become new context
- Patterns detected feed back into project

### 3. With Export System
- Wizard outputs included in export
- Specifications generated during wizards
- Decision rationale preserved
```

