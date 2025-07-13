
## 1. Context Storage and Management

```markdown
# Context Storage and Management System

## Overview
Context in FlexOS is hierarchical, moving from immediate (what user is pointing at) to global (project vision). Each API request includes relevant context to ensure AI responses are grounded in the user's actual project.

## Context Hierarchy

### 1. Immediate Context (Real-time)
**Storage**: Browser memory + session storage
**Lifetime**: Current interaction

```typescript
interface ImmediateContext {
  pointing_at: {
    type: 'element' | 'screen' | 'feature' | 'flow'
    id: string
    selector?: string // CSS selector if element
    coordinates?: {x: number, y: number} // Click position
    screenshot?: string // Base64 region screenshot
  }
  recent_actions: Action[] // Last 5-10 user actions
  viewport_state: {
    active_tab: string
    scroll_position: number
    zoom_level: number
  }
}
```

### 2. Local Context (Session)
**Storage**: IndexedDB + session state
**Lifetime**: Current work session

```typescript
interface LocalContext {
  active_mode: 'chat' | 'wizard' | 'iteration'
  active_wizard?: {
    type: string
    phase: string
    decisions: Decision[]
  }
  conversation_history: Message[] // Last 20 messages
  pending_changes: Change[] // Uncommitted modifications
  working_mockup?: {
    page_id: string
    version: number
    unsaved_changes: boolean
  }
}
```

### 3. Project Context (Persistent)
**Storage**: PostgreSQL database
**Lifetime**: Project lifetime

```sql
-- Context storage in database
ai_contexts
├── id (UUID, PK)
├── project_id (FK → projects)
├── context_type (pattern|decision|preference|assumption)
├── category (design|behavior|technical|business)
├── content (JSONB)
│   ├── description: "User prefers minimal designs"
│   ├── evidence: ["chose clean layout", "rejected busy option"]
│   ├── confidence: 0.85
│   └── last_confirmed: timestamp
├── embeddings (vector[1536]) -- For semantic search
├── usage_count (integer)
├── last_accessed (timestamp)
└── relevance_decay (float) -- How quickly this ages

-- Context relationships
context_links
├── context_id (FK → ai_contexts)
├── linked_to_type (page|feature|journey|component)
├── linked_to_id (UUID)
└── relationship_strength (float)
```

## UX Selection and Updates

### Visual Context Selector
```vue
<template>
  <ContextManager>
    <!-- Active contexts display -->
    <ActiveContexts>
      <ContextPill 
        v-for="ctx in activeContexts"
        :key="ctx.id"
        @remove="removeContext(ctx)"
        @edit="editContext(ctx)"
      >
        <icon :name="ctx.icon" />
        {{ ctx.label }}
      </ContextPill>
    </ActiveContexts>
    
    <!-- Context browser -->
    <ContextBrowser v-if="showBrowser">
      <ContextCategory 
        v-for="category in contextCategories"
        :key="category.name"
        :expanded="category.expanded"
      >
        <h4>{{ category.name }}</h4>
        <ContextItem 
          v-for="item in category.items"
          @click="attachContext(item)"
          :selected="isSelected(item)"
        >
          {{ item.description }}
          <confidence>{{ item.confidence }}%</confidence>
        </ContextItem>
      </ContextCategory>
    </ContextBrowser>
    
    <!-- Quick context actions -->
    <QuickActions>
      <button @click="captureScreenRegion">
        <icon name="screenshot" /> Point to element
      </button>
      <button @click="attachCurrentView">
        <icon name="link" /> Attach current view
      </button>
    </QuickActions>
  </ContextManager>
</template>
```

### Context Capture Methods

1. **Point and Click**
```typescript
async function captureElementContext(event: ClickEvent) {
  const element = document.elementFromPoint(event.x, event.y);
  const context = {
    type: 'element',
    selector: generateSelector(element),
    screenshot: await captureElementScreenshot(element),
    computed_styles: getComputedStyles(element),
    semantic_role: inferElementRole(element),
    page_context: getCurrentPageContext()
  };
  return context;
}
```

2. **Manual Attachment**
```typescript
interface ContextAttachment {
  source: 'manual' | 'automatic' | 'inferred'
  attached_by: 'user' | 'ai'
  relevance_score: number
  expires_after?: number // Actions until irrelevant
}
```

## API Request Context Injection

### Context Assembly for API Requests

```typescript
class ContextAssembler {
  async buildRequestContext(
    userMessage: string,
    mode: InteractionMode
  ): Promise<RequestContext> {
    // 1. Gather all context layers
    const immediate = this.getImmediateContext();
    const local = this.getLocalContext();
    const project = await this.getProjectContext();
    const vision = await this.getVisionContext();
    
    // 2. Score relevance based on message
    const scoredContexts = await this.scoreContextRelevance(
      userMessage,
      [...immediate, ...local, ...project, ...vision]
    );
    
    // 3. Filter and limit by token budget
    const filtered = this.filterByRelevance(scoredContexts, {
      maxTokens: 4000,
      minRelevance: 0.3
    });
    
    // 4. Structure for API
    return {
      mode: mode,
      message: userMessage,
      context: {
        immediate: filtered.immediate,
        conversation: this.getRecentConversation(10),
        project: {
          patterns: filtered.patterns.slice(0, 5),
          decisions: filtered.decisions.slice(0, 5),
          vision: this.getVisionSummary()
        }
      },
      metadata: {
        timestamp: new Date(),
        session_id: this.sessionId,
        context_version: '2.0'
      }
    };
  }
}
```

### API Request Format

```typescript
interface FlexOSAPIRequest {
  // User input
  message: string
  
  // Context package
  context: {
    // What user is looking at/pointing to
    immediate: {
      viewing?: { type: string, id: string, element?: string }
      attachments?: Array<{
        type: 'screenshot' | 'url' | 'text' | 'mockup'
        content: string
        metadata: any
      }>
    }
    
    // Recent conversation
    conversation: {
      recent_messages: Array<{
        role: 'user' | 'assistant'
        content: string
        context_used?: string[]
      }>
      mode: 'vision' | 'wizard' | 'builder'
      current_wizard?: string
    }
    
    // Project knowledge
    project: {
      vision_summary: string
      design_patterns: Pattern[]
      confirmed_decisions: Decision[]
      inferred_entities: Entity[]
      current_stats: {
        pages_count: number
        features_count: number
        mockups_created: number
      }
    }
  }
  
  // Request metadata
  metadata: {
    request_id: string
    session_id: string
    timestamp: string
    expected_response_type: 'conversation' | 'mockup' | 'specification'
  }
}
```

## Context Lifecycle

### 1. Context Creation
```typescript
// Automatic context creation
onMockupChange(change: MockupChange) {
  createContext({
    type: 'pattern',
    category: 'design',
    content: {
      description: `User chose ${change.description}`,
      evidence: [change.id],
      element_affected: change.selector
    },
    confidence: 0.7,
    source: 'user_action'
  });
}

// Manual context creation
onUserFeedback(feedback: Feedback) {
  createContext({
    type: 'preference',
    category: feedback.category,
    content: {
      description: feedback.text,
      strong_preference: feedback.intensity > 0.8
    },
    confidence: 0.95,
    source: 'explicit_feedback'
  });
}
```

### 2. Context Aging and Relevance

```sql
-- Relevance calculation
CREATE FUNCTION calculate_context_relevance(
  context_id UUID,
  current_focus VARCHAR,
  time_since_access INTERVAL
) RETURNS FLOAT AS $$
  DECLARE
    base_relevance FLOAT;
    time_decay FLOAT;
    usage_boost FLOAT;
  BEGIN
    -- Base relevance from embeddings similarity
    base_relevance := cosine_similarity(
      context_embeddings,
      current_focus_embeddings
    );
    
    -- Time decay
    time_decay := EXP(-EXTRACT(EPOCH FROM time_since_access) / 86400);
    
    -- Usage boost
    usage_boost := LOG(usage_count + 1) * 0.1;
    
    RETURN LEAST(base_relevance * time_decay + usage_boost, 1.0);
  END;
$$ LANGUAGE plpgsql;
```

### 3. Context Cleanup

```typescript
// Periodic context cleanup
async function cleanupOldContext() {
  // Archive low-relevance contexts
  await db.query(`
    UPDATE ai_contexts 
    SET archived = true 
    WHERE relevance_decay < 0.1 
    AND last_accessed < NOW() - INTERVAL '30 days'
  `);
  
  // Merge similar contexts
  const similar = await findSimilarContexts();
  for (const group of similar) {
    await mergeContexts(group);
  }
}
```

## Context Usage Examples

### 1. Design Decision Context
```json
{
  "type": "pattern",
  "category": "design",
  "content": {
    "description": "User consistently chooses rounded corners",
    "evidence": [
      "Selected rounded button style",
      "Changed cards to have border-radius",
      "Picked rounded input fields"
    ],
    "pattern": {
      "css_property": "border-radius",
      "preferred_values": ["8px", "12px", "16px"],
      "avoid_values": ["0px", "4px"]
    }
  },
  "confidence": 0.9,
  "applies_to": ["all_components"]
}
```

### 2. Business Logic Context
```json
{
  "type": "decision",
  "category": "business",
  "content": {
    "description": "Only verified teachers can share lessons",
    "source": "vision_conversation",
    "implications": [
      "Need verification flow",
      "Add verified badge to profiles",
      "Restrict share button for unverified"
    ],
    "related_features": ["auth", "user_profiles", "lesson_sharing"]
  },
  "confidence": 1.0,
  "confirmed_by_user": true
}
```

## Best Practices

1. **Context Limits**: Keep immediate context under 1000 tokens
2. **Relevance Scoring**: Always score context before including
3. **User Control**: Let users see and modify active context
4. **Privacy**: Never store sensitive data in context
5. **Cleanup**: Archive old context to maintain performance
```




