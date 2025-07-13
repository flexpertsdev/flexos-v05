## 2. Project Database Schema

```markdown
# Project Database Schema

## Overview
The FlexOS database schema is designed to support iterative, visual-first development while maintaining relationships between all project elements. It uses PostgreSQL with JSONB fields for flexibility.

## Core Tables

### Projects and Users

```sql
-- Users table (base authentication)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE,
  full_name VARCHAR(255),
  avatar_url TEXT,
  role VARCHAR(50) DEFAULT 'user',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL, -- web-app|mobile-app|pwa|api|fullstack
  status VARCHAR(50) DEFAULT 'active', -- active|archived|template
  
  -- Vision and goals
  vision_statement TEXT,
  target_feeling VARCHAR(100), -- professional|playful|minimal|bold
  reference_apps TEXT[], -- ["Pinterest", "Notion"]
  
  -- Visual identity
  icon VARCHAR(50),
  color VARCHAR(7), -- Hex color for project card
  
  -- Metadata
  settings JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_opened_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);
```

### Design System

```sql
-- Design systems (emerges from mockups)
CREATE TABLE design_systems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  generation_method VARCHAR(50), -- prescribed|emergent|hybrid
  
  -- Design tokens stored as JSONB
  tokens JSONB DEFAULT '{}',
  /* Structure:
  {
    "colors": {
      "primary": {"value": "#DC2626", "usage_count": 47, "contexts": ["buttons", "links"]},
      "surface": {"value": "#1E293B", "usage_count": 23}
    },
    "spacing": {
      "base": {"value": "8px", "confidence": 0.9},
      "scale": [8, 16, 24, 32, 48]
    },
    "typography": {
      "font_family": "Inter",
      "sizes": {"base": "16px", "lg": "18px"}
    }
  }
  */
  
  -- Component patterns detected
  component_patterns JSONB DEFAULT '{}',
  /* Structure:
  {
    "button": {
      "base_classes": "px-4 py-2 rounded-lg",
      "variants": ["primary", "secondary", "ghost"],
      "states": ["hover", "active", "disabled"]
    }
  }
  */
  
  -- Confidence and confirmations
  confidence_scores JSONB DEFAULT '{}',
  user_confirmations JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Pages and Mockups

```sql
-- Pages (screens in the app)
CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES pages(id), -- For nested pages
  
  -- Basic info
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  path VARCHAR(500), -- URL path like /dashboard/settings
  type VARCHAR(50) DEFAULT 'page', -- page|layout|component|modal
  
  -- Purpose and device
  purpose TEXT, -- "Users view their uploaded lessons"
  primary_device VARCHAR(50) DEFAULT 'responsive', -- mobile|tablet|desktop|responsive
  
  -- Current state
  current_mockup_id UUID,
  status VARCHAR(50) DEFAULT 'draft', -- draft|designed|approved|built
  
  -- Relationships
  key_elements JSONB DEFAULT '[]', -- ["header", "lesson-grid", "filters"]
  related_patterns JSONB DEFAULT '[]', -- Design patterns used
  usage_contexts JSONB DEFAULT '[]', -- Where/how this page is used
  
  -- Metadata
  sort_order INTEGER DEFAULT 0,
  is_placeholder BOOLEAN DEFAULT FALSE,
  wizard_generated BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(project_id, path)
);

CREATE INDEX idx_pages_project_id ON pages(project_id);
CREATE INDEX idx_pages_parent_id ON pages(parent_id);

-- Mockups (versioned HTML/CSS)
CREATE TABLE mockups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  
  -- Content
  html_content TEXT NOT NULL,
  css_content TEXT,
  javascript_content TEXT, -- For interactions demo
  
  -- Responsive rules
  responsive_rules JSONB DEFAULT '{}',
  /* Structure:
  {
    "breakpoints": {
      "mobile": {"max": 640, "layout": "single-column"},
      "tablet": {"min": 641, "max": 1024, "layout": "two-column"},
      "desktop": {"min": 1025, "layout": "grid"}
    }
  }
  */
  
  -- Extracted information
  extracted_patterns JSONB DEFAULT '{}',
  /* Structure:
  {
    "colors_used": ["#DC2626", "#1E293B"],
    "components_detected": ["card", "button", "nav"],
    "spacing_analysis": {"base_unit": 8, "consistent": true}
  }
  */
  
  -- Interactions and states
  interactions JSONB DEFAULT '[]',
  /* Structure:
  [
    {
      "trigger": "click",
      "selector": ".submit-btn",
      "action": "submit_form",
      "transition": "loading_state"
    }
  ]
  */
  
  -- Change tracking
  change_description TEXT,
  changed_by VARCHAR(50), -- user|ai|wizard
  parent_mockup_id UUID REFERENCES mockups(id),
  
  -- Feedback
  user_feedback JSONB DEFAULT '{}',
  ai_notes JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(page_id, version)
);

CREATE INDEX idx_mockups_page_id ON mockups(page_id);
```

### Features

```sql
-- Features (user-described functionality)
CREATE TABLE features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  
  -- Basic info
  name VARCHAR(255) NOT NULL,
  user_description TEXT, -- "Teachers can share lesson plans"
  category VARCHAR(100), -- auth|content|social|admin|payment
  status VARCHAR(50) DEFAULT 'planned', -- planned|in-progress|completed
  
  -- Implementation details
  affected_pages UUID[], -- Array of page IDs
  required_journeys UUID[], -- Array of journey IDs
  
  -- Data operations (CRUD)
  data_operations JSONB DEFAULT '{}',
  /* Structure:
  {
    "creates": ["Lesson", "Activity"],
    "reads": ["User", "Subject", "Grade"],
    "updates": ["Profile", "Settings"],
    "deletes": ["Draft"]
  }
  */
  
  -- Requirements
  ui_requirements JSONB DEFAULT '[]', -- ["share button", "form", "success message"]
  business_rules JSONB DEFAULT '[]', -- ["only verified teachers", "limit 10 per day"]
  technical_requirements JSONB DEFAULT '{}', -- {"needs": ["image_upload", "rich_text"]}
  
  -- Source
  detected_from_mockups BOOLEAN DEFAULT FALSE,
  wizard_generated BOOLEAN DEFAULT FALSE,
  visual_specifications JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_features_project_id ON features(project_id);
CREATE INDEX idx_features_category ON features(category);
```

### User Journeys and Flows

```sql
-- Journey flows (visual flows in VueFlow)
CREATE TABLE journey_flows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  
  -- Basic info
  name VARCHAR(255) NOT NULL,
  description TEXT,
  flow_type VARCHAR(50), -- user|admin|system|error
  is_primary BOOLEAN DEFAULT FALSE,
  
  -- VueFlow state
  canvas_state JSONB NOT NULL, -- Complete VueFlow save state
  viewport JSONB DEFAULT '{}', -- Camera position and zoom
  
  -- Filtering and display
  filters_applied JSONB DEFAULT '{}',
  display_settings JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Flow nodes (screens, decisions, annotations)
CREATE TABLE flow_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flow_id UUID REFERENCES journey_flows(id) ON DELETE CASCADE,
  
  -- Node info
  node_type VARCHAR(50) NOT NULL, -- screen|decision|annotation|database|action
  position JSONB NOT NULL, -- {x: 100, y: 200}
  size JSONB DEFAULT '{}', -- {width: 200, height: 150}
  
  -- Node data (varies by type)
  data JSONB NOT NULL,
  /* Structure varies by node_type:
  
  screen: {
    page_id: UUID,
    mockup_id: UUID,
    device_frame: "iphone",
    instance_context: {
      entry_from: ["login", "landing"],
      exits_to: ["dashboard", "error"],
      local_state: {"user_type": "teacher"}
    }
  }
  
  decision: {
    question: "Is user logged in?",
    branches: [
      {label: "Yes", target_node: "node-123", condition: "user.token"},
      {label: "No", target_node: "node-456"}
    ]
  }
  
  database: {
    operation: "CREATE",
    entity: "User",
    trigger: "form_submit",
    fields: ["email", "name", "password"]
  }
  */
  
  -- Connections
  connections JSONB DEFAULT '[]',
  /* Structure:
  [
    {
      target_node_id: UUID,
      trigger: "click",
      element: ".submit-btn",
      label: "On successful login"
    }
  ]
  */
  
  -- Metadata
  locked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_flow_nodes_flow_id ON flow_nodes(flow_id);
```

### Data Model and Entities

```sql
-- Inferred entities (detected from screens/features)
CREATE TABLE inferred_entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  
  -- Entity info
  entity_name VARCHAR(100) NOT NULL, -- User, Lesson, etc
  plural_name VARCHAR(100),
  description TEXT,
  
  -- Fields detected
  fields JSONB NOT NULL,
  /* Structure:
  {
    "id": {
      "type": "uuid",
      "required": true,
      "primary": true
    },
    "name": {
      "type": "string",
      "required": true,
      "max_length": 100,
      "inferred_from": ["profile-page", "user-card", "signup-form"],
      "confidence": 0.95,
      "validation": {"pattern": "^[a-zA-Z ]+$"}
    },
    "email": {
      "type": "email",
      "required": true,
      "unique": true,
      "inferred_from": ["login-form", "profile-page"]
    }
  }
  */
  
  -- Relationships
  relationships JSONB DEFAULT '[]',
  /* Structure:
  [
    {
      "type": "has_many",
      "target_entity": "Lesson",
      "foreign_key": "author_id",
      "inverse": "belongs_to"
    }
  ]
  */
  
  -- CRUD tracking
  crud_locations JSONB DEFAULT '{}',
  /* Structure:
  {
    "create": ["signup-page", "admin-users"],
    "read": ["profile", "user-list", "lesson-author"],
    "update": ["settings", "profile-edit"],
    "delete": ["admin-panel", "account-deletion"]
  }
  */
  
  -- Validation rules
  validation_rules JSONB DEFAULT '{}',
  business_rules JSONB DEFAULT '[]',
  
  -- Confidence
  confidence_score FLOAT DEFAULT 0.5,
  user_confirmed BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(project_id, entity_name)
);
```

### Wizard and AI Context

```sql
-- Wizard runs
CREATE TABLE wizard_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  project_id UUID REFERENCES projects(id),
  
  -- Wizard info
  wizard_type VARCHAR(100) NOT NULL, -- page-creator|feature-builder|design-system
  wizard_version VARCHAR(20),
  
  -- State
  status VARCHAR(50) DEFAULT 'in-progress', -- in-progress|completed|abandoned
  current_phase VARCHAR(100),
  phase_history JSONB DEFAULT '[]',
  
  -- User inputs and decisions
  answers JSONB DEFAULT '{}',
  decisions_made JSONB DEFAULT '[]',
  
  -- Context used
  context_snapshot JSONB DEFAULT '{}', -- Project state when started
  context_references UUID[], -- Context IDs used
  
  -- Outputs
  outputs JSONB DEFAULT '{}',
  /* Structure:
  {
    "created": ["page:home", "component:lesson-card"],
    "specifications": {...},
    "mockups": [mockup_ids]
  }
  */
  
  -- Timing
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER
);

-- AI thinking chain
CREATE TABLE ai_thinking_chain (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id),
  wizard_run_id UUID REFERENCES wizard_runs(id),
  
  -- Thought info
  thought_type VARCHAR(50), -- observation|assumption|decision|question|inference
  reasoning TEXT NOT NULL,
  confidence FLOAT DEFAULT 0.5,
  
  -- Source and dependencies
  source_description TEXT,
  depends_on UUID[], -- Previous thoughts this builds on
  leads_to UUID[], -- Subsequent thoughts influenced
  
  -- Interactivity
  is_assumption BOOLEAN DEFAULT FALSE,
  needs_answer BOOLEAN DEFAULT FALSE,
  has_alternatives BOOLEAN DEFAULT FALSE,
  alternatives JSONB DEFAULT '[]',
  
  -- Status
  status VARCHAR(50) DEFAULT 'active', -- active|revised|rejected|confirmed
  user_feedback TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User-submitted context soup
CREATE TABLE user_context_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  
  -- Item info
  item_type VARCHAR(50) NOT NULL, -- screenshot|url|text|file|mockup
  content_url TEXT, -- S3/storage URL for files
  content_text TEXT, -- For text/extracted content
  content_metadata JSONB DEFAULT '{}',
  
  -- Analysis
  ai_analysis JSONB DEFAULT '{}',
  /* Structure:
  {
    "detected_elements": ["navigation", "cards", "forms"],
    "color_palette": ["#1E40AF", "#F3F4F6"],
    "layout_type": "dashboard",
    "relevant_to": ["design", "layout", "components"]
  }
  */
  
  -- Categorization
  categories TEXT[], -- ['inspiration', 'competitor', 'style-guide']
  tags TEXT[],
  relevance_scores JSONB DEFAULT '{}', -- Per-feature relevance
  
  -- Usage tracking
  times_referenced INTEGER DEFAULT 0,
  last_referenced_at TIMESTAMP WITH TIME ZONE,
  referenced_in JSONB DEFAULT '[]', -- Where it was used
  
  -- Source
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  submitted_context TEXT, -- What user said when submitting
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_user_context_items_project ON user_context_items(project_id);
CREATE INDEX idx_user_context_items_type ON user_context_items(item_type);
```

### Indexes and Constraints

```sql
-- Performance indexes
CREATE INDEX idx_pages_current_mockup ON pages(current_mockup_id);
CREATE INDEX idx_mockups_version ON mockups(page_id, version DESC);
CREATE INDEX idx_features_affected_pages ON features USING GIN(affected_pages);
CREATE INDEX idx_entities_confidence ON inferred_entities(project_id, confidence_score DESC);

-- Full text search
CREATE INDEX idx_pages_search ON pages USING GIN(
  to_tsvector('english', name || ' ' || COALESCE(purpose, ''))
);
CREATE INDEX idx_features_search ON features USING GIN(
  to_tsvector('english', name || ' ' || COALESCE(user_description, ''))
);

-- JSONB indexes
CREATE INDEX idx_design_tokens ON design_systems USING GIN(tokens);
CREATE INDEX idx_entity_fields ON inferred_entities USING GIN(fields);
CREATE INDEX idx_node_data ON flow_nodes USING GIN(data);

-- Constraints
ALTER TABLE pages ADD CONSTRAINT valid_path 
  CHECK (path ~ '^/[a-z0-9-/]*$');
ALTER TABLE projects ADD CONSTRAINT valid_type 
  CHECK (type IN ('web-app', 'mobile-app', 'pwa', 'api', 'fullstack'));
```

## Usage Patterns

### Creating a New Page
```sql
-- Transaction for creating page with mockup
BEGIN;
  -- Create page
  INSERT INTO pages (project_id, name, slug, path, purpose)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING id INTO page_id;
  
  -- Create initial mockup
  INSERT INTO mockups (page_id, version, html_content, css_content)
  VALUES (page_id, 1, $6, $7)
  RETURNING id INTO mockup_id;
  
  -- Update page with mockup reference
  UPDATE pages SET current_mockup_id = mockup_id WHERE id = page_id;
COMMIT;
```

### Detecting Design Patterns
```sql
-- Aggregate color usage across mockups
SELECT 
  color,
  COUNT(*) as usage_count,
  array_agg(DISTINCT p.name) as used_in_pages
FROM mockups m
CROSS JOIN LATERAL jsonb_array_elements_text(
  m.extracted_patterns->'colors_used'
) as color
JOIN pages p ON p.id = m.page_id
WHERE p.project_id = $1
GROUP BY color
ORDER BY usage_count DESC;
```

### Finding Entity Relationships
```sql
-- Find entities that appear together
SELECT 
  e1.entity_name as entity1,
  e2.entity_name as entity2,
  COUNT(*) as co_occurrences
FROM pages p
CROSS JOIN LATERAL unnest(p.key_elements) as element
JOIN inferred_entities e1 ON element ? e1.entity_name
JOIN inferred_entities e2 ON element ? e2.entity_name
WHERE e1.id < e2.id
  AND p.project_id = $1
GROUP BY e1.entity_name, e2.entity_name
HAVING COUNT(*) > 1
ORDER BY co_occurrences DESC;
```
```













