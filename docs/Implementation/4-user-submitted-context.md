
## 4. User Submitted Context

```markdown
# User Submitted Context Management

## Overview
User-submitted context represents the "soup" of inspiration, references, and materials that users provide throughout the project. This includes screenshots, URLs, text snippets, and files that may or may not be directly relevant but help establish the project's vision and aesthetic.

## Context Types and Storage

### 1. Screenshot Context

```sql
CREATE TABLE screenshot_contexts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  
  -- Storage
  storage_url TEXT NOT NULL, -- S3/Supabase storage URL
  thumbnail_url TEXT,
  file_size INTEGER,
  dimensions JSONB, -- {width: 1920, height: 1080}
  
  -- User context
  submitted_message TEXT, -- "I like this navigation style"
  conversation_context JSONB, -- Recent messages when submitted
  submission_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- AI Analysis
  ai_analysis JSONB DEFAULT '{}',
  /* Structure:
  {
    "detected_elements": [
      {
        "type": "navigation",
        "confidence": 0.85,
        "location": {x1: 0, y1: 0, x2: 1920, y2: 80},
        "description": "Top navigation bar with logo and menu"
      }
    ],
    "color_extraction": {
      "dominant": ["#1E40AF", "#F3F4F6", "#111827"],
      "accent": "#3B82F6",
      "palette_type": "professional"
    },
    "layout_analysis": {
      "type": "dashboard",
      "grid": "12-column",
      "sidebar": true,
      "responsive_hints": ["mobile-friendly", "tablet-optimized"]
    },
    "ui_patterns": ["card-based", "data-tables", "charts"],
    "style_classification": ["modern", "clean", "data-heavy"],
    "text_extraction": ["Dashboard", "Analytics", "Users"],
    "similar_to": ["admin-template", "analytics-dashboard"]
  }
  */
  
  -- Categorization
  auto_categories TEXT[], -- ['navigation', 'color-inspiration', 'layout']
  user_tags TEXT[],
  relevance_map JSONB DEFAULT '{}', -- Per-page/feature relevance scores
  
  -- Usage tracking
  times_referenced INTEGER DEFAULT 0,
  used_in_elements JSONB DEFAULT '[]', -- Where it influenced design
  influence_score FLOAT DEFAULT 0.0, -- How much it affected final design
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_screenshot_contexts_project ON screenshot_contexts(project_id);
CREATE INDEX idx_screenshot_contexts_categories ON screenshot_contexts USING GIN(auto_categories);
```

### 2. URL Context

```sql
CREATE TABLE url_contexts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  
  -- URL Information
  original_url TEXT NOT NULL,
  cleaned_url TEXT, -- Without tracking params
  domain TEXT,
  url_type VARCHAR(50), -- website|image|video|document
  
  -- Fetched content
  page_title TEXT,
  page_description TEXT,
  og_image_url TEXT,
  screenshot_url TEXT, -- Auto-captured screenshot
  
  -- User context
  submitted_message TEXT, -- "I want my app to feel like this"
  specific_elements TEXT[], -- ["hero section", "color scheme"]
  
  -- AI Analysis
  ai_analysis JSONB DEFAULT '{}',
  /* Structure:
  {
    "site_type": "portfolio|ecommerce|saas|blog",
    "design_characteristics": {
      "style": ["minimalist", "typography-focused"],
      "layout": "single-page",
      "interactions": ["smooth-scroll", "parallax"],
      "color_usage": "monochromatic"
    },
    "technical_observations": {
      "framework_hints": ["React", "Tailwind"],
      "performance": "fast",
      "responsive": true
    },
    "content_analysis": {
      "tone": "professional",
      "target_audience": "designers",
      "key_sections": ["hero", "portfolio", "contact"]
    },
    "inspiration_elements": [
      {
        "element": "hero-animation",
        "description": "Subtle fade-in with stagger",
        "applicability": 0.8
      }
    ]
  }
  */
  
  -- Categorization
  auto_categories TEXT[],
  competitor_analysis BOOLEAN DEFAULT FALSE,
  inspiration_type VARCHAR(50), -- overall|specific-element|competitor
  
  -- Processing status
  fetch_status VARCHAR(50) DEFAULT 'pending', -- pending|success|failed
  last_fetched_at TIMESTAMP WITH TIME ZONE,
  fetch_error TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. Text/Note Context

```sql
CREATE TABLE text_contexts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  
  -- Content
  content_type VARCHAR(50), -- note|code|copy|specification
  content TEXT NOT NULL,
  formatted_content JSONB, -- For rich text/markdown
  
  -- User context
  submitted_message TEXT,
  context_description TEXT, -- "Error message copy"
  
  -- AI Analysis
  ai_analysis JSONB DEFAULT '{}',
  /* Structure:
  {
    "content_type": "ui-copy|technical-spec|inspiration",
    "detected_intent": "error-handling|feature-description",
    "key_phrases": ["user-friendly", "clear feedback"],
    "tone_analysis": {
      "formality": 0.3,
      "technical_level": 0.2,
      "friendliness": 0.8
    },
    "applicable_to": ["error-messages", "help-text"],
    "suggestions": [
      "Use this tone for all user-facing messages",
      "Consider similar phrasing for related features"
    ]
  }
  */
  
  -- Relationships
  related_to_type VARCHAR(50), -- page|feature|component
  related_to_id UUID,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. File Context

```sql
CREATE TABLE file_contexts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  
  -- File information
  file_name TEXT NOT NULL,
  file_type VARCHAR(50), -- pdf|sketch|figma|doc|spreadsheet
  mime_type TEXT,
  file_size INTEGER,
  storage_url TEXT NOT NULL,
  
  -- Extracted content
  extracted_text TEXT,
  extracted_images JSONB DEFAULT '[]', -- URLs of extracted images
  parsed_data JSONB, -- Structured data from files
  
  -- AI Analysis
  ai_analysis JSONB DEFAULT '{}',
  /* Structure varies by file type:
  
  Design file (Sketch/Figma):
  {
    "design_system_extracted": {
      "colors": [...],
      "typography": {...},
      "components": [...]
    },
    "page_designs": [...],
    "asset_inventory": [...]
  }
  
  Document (PDF/Doc):
  {
    "document_type": "requirements|wireframes|brief",
    "key_sections": [...],
    "extracted_requirements": [...],
    "visual_elements": [...]
  }
  
  Spreadsheet:
  {
    "data_structure": {...},
    "identified_entities": [...],
    "sample_data": {...}
  }
  */
  
  -- Processing
  processing_status VARCHAR(50) DEFAULT 'pending',
  processed_at TIMESTAMP WITH TIME ZONE,
  processing_error TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Context Soup Management

### Automatic Categorization System

```typescript
class ContextCategorizer {
  async categorizeScreenshot(
    screenshot: ScreenshotContext,
    projectContext: ProjectContext
  ): Promise<CategorizedContext> {
    // 1. Visual analysis
    const elements = await detectUIElements(screenshot.storage_url);
    const colors = await extractColors(screenshot.storage_url);
    const layout = await analyzeLayout(screenshot.storage_url);
    
    // 2. Semantic analysis
    const userIntent = await analyzeUserMessage(screenshot.submitted_message);
    const projectRelevance = await calculateRelevance(
      elements,
      projectContext
    );
    
    // 3. Auto-categorization
    const categories = [];
    
    if (elements.some(e => e.type === 'navigation')) {
      categories.push('navigation-inspiration');
    }
    
    if (userIntent.includes('color') || userIntent.includes('palette')) {
      categories.push('color-reference');
    }
    
    if (layout.type === 'dashboard' && projectContext.type === 'web-app') {
      categories.push('layout-reference');
    }
    
    // 4. Relevance scoring per feature/page
    const relevanceMap = {};
    for (const page of projectContext.pages) {
      relevanceMap[page.id] = calculatePageRelevance(elements, page);
    }
    
    return {
      categories,
      relevanceMap,
      confidence: calculateConfidence(elements, userIntent)
    };
  }
}
```

### Context Retrieval System

```typescript
class ContextRetriever {
  async getRelevantContext(
    query: ContextQuery
  ): Promise<RelevantContext[]> {
    const contexts = [];
    
    // 1. Direct matches (user pointed to specific context)
    if (query.directReferences) {
      contexts.push(...await getDirectReferences(query.directReferences));
    }
    
    // 2. Category matches
    if (query.workingOn === 'navigation') {
      contexts.push(...await getByCategory(['navigation-inspiration']));
    }
    
    // 3. Semantic similarity
    const similar = await findSimilarContexts(query, {
      useEmbeddings: true,
      threshold: 0.7
    });
    contexts.push(...similar);
    
    // 4. Temporal relevance (recently referenced)
    if (query.includeRecent) {
      contexts.push(...await getRecentlyUsed(query.timeWindow));
    }
    
    // 5. Score and rank
    return rankContexts(contexts, query);
  }
}
```

### Context Soup UI

```vue
<template>
  <div class="context-soup-manager">
    <!-- Quick add panel -->
    <QuickAddContext>
      <DropZone 
        @drop="handleFileDrop"
        accept="image/*,application/pdf,.sketch,.fig"
      >
        <p>Drop images, URLs, or files here</p>
      </DropZone>
      
      <QuickActions>
        <button @click="captureScreenshot">
          <icon name="camera" /> Screenshot
        </button>
        <button @click="addURL">
          <icon name="link" /> Add URL
        </button>
        <button @click="addNote">
          <icon name="note" /> Add Note
        </button>
      </QuickActions>
    </QuickAddContext>
    
    <!-- Context browser -->
    <ContextBrowser>
      <!-- Filter bar -->
      <FilterBar>
        <select v-model="filterType">
          <option value="all">All Context</option>
          <option value="screenshots">Screenshots</option>
          <option value="urls">Links</option>
          <option value="files">Files</option>
          <option value="notes">Notes</option>
        </select>
        
        <TagFilter 
          :available-tags="allTags"
          v-model="selectedTags"
        />
        
        <SearchBox 
          v-model="searchQuery"
          placeholder="Search context..."
        />
      </FilterBar>
      
      <!-- Context grid -->
      <ContextGrid>
        <ContextCard
          v-for="item in filteredContext"
          :key="item.id"
          :context="item"
          @click="selectContext(item)"
          :selected="isSelected(item)"
        >
          <template #preview>
            <ScreenshotPreview 
              v-if="item.type === 'screenshot'"
              :url="item.thumbnail_url"
              :analysis="item.ai_analysis"
            />
            <URLPreview
              v-else-if="item.type === 'url'"
              :url="item.original_url"
              :title="item.page_title"
              :screenshot="item.screenshot_url"
            />
            <TextPreview
              v-else-if="item.type === 'text'"
              :content="item.content"
              :truncate="100"
            />
          </template>
          
          <template #metadata>
            <time>{{ formatDate(item.created_at) }}</time>
            <span class="usage-count">
              Used {{ item.times_referenced }}x
            </span>
            <RelevanceIndicator 
              :score="item.relevance_to_current"
            />
          </template>
          
          <template #actions>
            <button @click="useInCurrent(item)">
              Use This
            </button>
            <button @click="editTags(item)">
              Tag
            </button>
            <button @click="viewAnalysis(item)">
              AI Analysis
            </button>
          </template>
        </ContextCard>
      </ContextGrid>
    </ContextBrowser>
    
    <!-- AI Analysis Panel -->
    <AnalysisPanel v-if="selectedContext">
      <h3>AI Understanding</h3>
      <AnalysisSection 
        v-for="(value, key) in selectedContext.ai_analysis"
        :key="key"
        :title="formatKey(key)"
        :data="value"
      />
      
      <SuggestedApplications>
        <h4>Could be used for:</h4>
        <suggestion
          v-for="suggestion in getSuggestions(selectedContext)"
          :key="suggestion.id"
          @click="applySuggestion(suggestion)"
        >
          {{ suggestion.description }}
        </suggestion>
      </SuggestedApplications>
    </AnalysisPanel>
  </div>
</template>
```

## Context Recall Strategies

### 1. Explicit Recall
User directly references context:
```typescript
// User says: "Use the colors from that dashboard screenshot"
async function findReferencedContext(userMessage: string) {
  const references = extractReferences(userMessage);
  // "that dashboard screenshot" → most recent screenshot with dashboard
  
  return await db.query(`
    SELECT * FROM screenshot_contexts
    WHERE project_id = $1
      AND 'dashboard' = ANY(auto_categories)
    ORDER BY created_at DESC
    LIMIT 1
  `, [projectId]);
}
```

### 2. Implicit Recall
Context relevant to current work:
```typescript
// Working on navigation component
async function getImplicitContext(workContext: WorkContext) {
  const relevant = [];
  
  // Get navigation-related context
  if (workContext.type === 'component' && 
      workContext.name === 'navigation') {
    relevant.push(...await getNavigationContext());
  }
  
  // Get color context if discussing colors
  if (workContext.discussingColors) {
    relevant.push(...await getColorContext());
  }
  
  return rankByRelevance(relevant, workContext);
}
```

### 3. Temporal Recall
Recently used context:
```typescript
async function getTemporalContext(timeWindow: Duration) {
  return await db.query(`
    SELECT * FROM (
      SELECT *, 'screenshot' as type FROM screenshot_contexts
      UNION ALL
      SELECT *, 'url' as type FROM url_contexts
      UNION ALL
      SELECT *, 'text' as type FROM text_contexts
    ) contexts
    WHERE project_id = $1
      AND last_referenced_at > NOW() - $2::interval
    ORDER BY last_referenced_at DESC
    LIMIT 10
  `, [projectId, timeWindow]);
}
```

## Context Lifecycle

### 1. Submission
```typescript
async function handleContextSubmission(
  file: File,
  userMessage: string,
  conversationContext: Message[]
) {
  // 1. Upload file
  const storageUrl = await uploadToStorage(file);
  
  // 2. Create initial record
  const context = await createContextRecord({
    type: detectContextType(file),
    storage_url: storageUrl,
    submitted_message: userMessage,
    conversation_context: conversationContext
  });
  
  // 3. Queue for analysis
  await queueForAnalysis(context.id);
  
  // 4. Immediate acknowledgment
  return {
    message: "Got it! I'll analyze this and see how we can use it.",
    context_id: context.id
  };
}
```

### 2. Analysis
```typescript
async function analyzeContext(contextId: string) {
  const context = await loadContext(contextId);
  
  switch (context.type) {
    case 'screenshot':
      return await analyzeScreenshot(context);
    case 'url':
      return await analyzeURL(context);
    case 'text':
      return await analyzeText(context);
    case 'file':
      return await analyzeFile(context);
  }
}

async function analyzeScreenshot(context: ScreenshotContext) {
  // 1. Visual analysis
  const elements = await detectUIElements(context.storage_url);
  const colors = await extractColors(context.storage_url);
  const layout = await analyzeLayout(context.storage_url);
  const text = await extractText(context.storage_url);
  
  // 2. Style classification
  const style = await classifyDesignStyle({
    elements,
    colors,
    layout
  });
  
  // 3. Relevance calculation
  const relevance = await calculateProjectRelevance(
    { elements, colors, layout },
    context.project_id
  );
  
  // 4. Save analysis
  await updateContextAnalysis(context.id, {
    detected_elements: elements,
    color_extraction: colors,
    layout_analysis: layout,
    text_extraction: text,
    style_classification: style,
    relevance_scores: relevance
  });
}
```

### 3. Application
```typescript
async function applyContextToDesign(
  contextId: string,
  targetElement: DesignElement
) {
  const context = await loadContextWithAnalysis(contextId);
  
  // 1. Extract applicable patterns
  const patterns = extractApplicablePatterns(
    context.ai_analysis,
    targetElement.type
  );
  
  // 2. Apply patterns
  const updates = [];
  
  if (patterns.colors && targetElement.acceptsColors) {
    updates.push({
      type: 'color_scheme',
      values: patterns.colors,
      source: contextId
    });
  }
  
  if (patterns.layout && targetElement.acceptsLayout) {
    updates.push({
      type: 'layout',
      values: patterns.layout,
      source: contextId
    });
  }
  
  // 3. Track usage
  await incrementContextUsage(contextId, targetElement.id);
  
  return updates;
}
```

## Context Influence Tracking

```sql
-- Track how context influenced design
CREATE TABLE context_influences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  context_id UUID NOT NULL,
  context_type VARCHAR(50) NOT NULL,
  influenced_element_type VARCHAR(50), -- page|component|feature
  influenced_element_id UUID,
  influence_type VARCHAR(50), -- color|layout|interaction|content
  influence_details JSONB,
  confidence FLOAT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Query example: What influenced this page's design?
SELECT 
  ci.*,
  sc.submitted_message,
  sc.thumbnail_url
FROM context_influences ci
LEFT JOIN screenshot_contexts sc ON sc.id = ci.context_id
WHERE ci.influenced_element_id = $1
  AND ci.influenced_element_type = 'page'
ORDER BY ci.confidence DESC;
```

## Best Practices

1. **Lazy Analysis**: Don't analyze everything immediately, prioritize based on usage
2. **Relevance Decay**: Older unused context becomes less relevant over time
3. **User Control**: Let users manually tag and categorize for better recall
4. **Deduplication**: Detect and merge similar context items
5. **Privacy**: Allow users to delete context and its influences
6. **Storage Optimization**: Thumbnail generation, compression, and CDN usage
```


