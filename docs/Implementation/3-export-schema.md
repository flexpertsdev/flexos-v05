## 3. Export Schema

```markdown
# FlexOS Export Schema

## Overview
The export system generates a comprehensive, AI-executable package containing all specifications, mockups, and documentation needed to build the application. The export is designed to be both human-readable and machine-parseable.

## Export Structure

```
flexos-export-{project-slug}-{timestamp}/
├── flexos.project.json          # Project manifest
├── README.md                    # Human-readable project overview
├── docs/                        # Documentation
│   ├── VISION.md               # Original vision and refined understanding
│   ├── ARCHITECTURE.md         # Technical decisions and stack
│   ├── FEATURES.md             # Detailed feature specifications
│   ├── API.md                  # API endpoint documentation
│   └── DEPLOYMENT.md           # Deployment instructions
├── specifications/              # Structured specifications
│   ├── pages/
│   │   ├── _manifest.json      # Page listing and metadata
│   │   ├── home.page.md        # Page specification
│   │   ├── home.page.json      # Machine-readable spec
│   │   └── ...
│   ├── features/
│   │   ├── _manifest.json
│   │   ├── authentication.feature.md
│   │   ├── authentication.feature.json
│   │   └── ...
│   ├── journeys/
│   │   ├── _manifest.json
│   │   ├── user-onboarding.journey.md
│   │   ├── user-onboarding.flow.json
│   │   └── ...
│   └── data-model/
│       ├── entities.schema.json
│       ├── relationships.json
│       ├── validation-rules.json
│       └── sample-data.json
├── mockups/                     # Visual mockups
│   ├── index.html              # Mockup browser/navigator
│   ├── pages/
│   │   ├── home.html           # Self-contained HTML+CSS
│   │   ├── home-mobile.html    # Device-specific versions
│   │   ├── home-tablet.html
│   │   └── ...
│   ├── components/              # Reusable component mockups
│   │   ├── nav-bar.html
│   │   ├── lesson-card.html
│   │   └── ...
│   └── assets/                 # Images and icons
│       ├── images/
│       ├── icons/
│       └── fonts/
├── design-system/               # Design specifications
│   ├── tokens.json             # Design tokens
│   ├── tokens.css              # CSS variables
│   ├── components.json         # Component registry
│   ├── patterns.json           # UI patterns
│   └── guidelines.md           # Usage guidelines
├── flows/                       # Visual flow diagrams
│   ├── _manifest.json          # Flow listing
│   ├── main-flow.vueflow.json  # VueFlow export
│   ├── main-flow.svg           # Visual representation
│   └── flow-images/            # Screenshots of flows
├── implementation/              # Build instructions
│   ├── build-order.json        # Sequence of implementation
│   ├── tech-stack.json         # Required technologies
│   ├── dependencies.json       # External dependencies
│   ├── file-structure.json     # Expected project structure
│   ├── test-scenarios.json     # Test specifications
│   └── ai-instructions.md      # Step-by-step for AI builders
└── validation/                  # Quality checks
    ├── completeness-check.json  # What's included/missing
    ├── consistency-report.json  # Cross-reference validation
    └── coverage-map.json        # Feature/page coverage
```

## Core Export Files

### 1. Project Manifest (`flexos.project.json`)

```json
{
  "version": "2.0",
  "export": {
    "timestamp": "2024-01-20T10:00:00Z",
    "flexos_version": "2.0.0",
    "export_format": "comprehensive-ai-executable"
  },
  "project": {
    "id": "uuid",
    "name": "TeacherShare",
    "slug": "teacher-share",
    "type": "web-app",
    "vision": "Pinterest for teachers to share lesson plans",
    "target_feeling": "professional yet approachable"
  },
  "contents": {
    "pages_count": 12,
    "features_count": 8,
    "journeys_count": 5,
    "entities_count": 6,
    "mockups_count": 15,
    "components_count": 24
  },
  "specifications": {
    "pages": "./specifications/pages/",
    "features": "./specifications/features/",
    "journeys": "./specifications/journeys/",
    "data_model": "./specifications/data-model/"
  },
  "design_system": "./design-system/tokens.json",
  "entry_points": {
    "mockup_browser": "./mockups/index.html",
    "documentation": "./README.md",
    "ai_instructions": "./implementation/ai-instructions.md"
  }
}
```

### 2. Page Specification Example

#### Markdown Format (`home.page.md`)
```markdown
# Home Page Specification

## Overview
- **Page Name**: Home / Discover Lessons
- **Path**: `/`
- **Purpose**: Browse and discover shared lesson plans
- **Primary Device**: Responsive (mobile-first)
- **Mockup**: [View Mockup](../../mockups/pages/home.html)

## Layout Structure

### Desktop (>1024px)
- 3-column masonry grid for lesson cards
- Sticky header with search
- Sidebar with filters
- Infinite scroll pagination

### Tablet (768-1024px)
- 2-column grid
- Collapsible filter panel
- Bottom navigation bar

### Mobile (<768px)
- Single column stack
- Fixed bottom navigation
- Pull-to-refresh
- Swipe gestures for filtering

## Components Used

| Component | Purpose | Props |
|-----------|---------|-------|
| NavigationBar | Top navigation | `user`, `notifications` |
| SearchBar | Filter lessons | `placeholder`, `filters` |
| LessonCard | Display lesson | `lesson`, `onLike`, `onShare` |
| FilterPanel | Refine results | `subjects`, `grades`, `tags` |
| LoadingSpinner | Loading state | `size`, `color` |

## Data Requirements

```json
{
  "on_mount": {
    "endpoint": "GET /api/lessons",
    "params": {
      "limit": 20,
      "sort": "recent",
      "include": ["author", "subject", "preview"]
    },
    "cache": "5 minutes"
  },
  "infinite_scroll": {
    "trigger": "80% scroll",
    "endpoint": "GET /api/lessons?cursor={last_id}"
  },
  "realtime": {
    "subscribe": "lessons:new",
    "update_strategy": "prepend"
  }
}
```

## User Interactions

### Click Handlers
- **Lesson Card Click**: Navigate to `/lesson/{id}` with slide transition
- **Like Button**: Toggle like, optimistic update, sync with server
- **Share Button**: Open share modal with native share API fallback
- **Filter Change**: Update URL params, fetch filtered results

### Gestures (Mobile)
- **Pull to Refresh**: Reload latest lessons
- **Swipe Right**: Open filter panel
- **Long Press**: Show quick actions (save, share, report)

## States

### Loading State
```html
<div class="lesson-grid">
  <!-- Skeleton cards with shimmer animation -->
  <div class="skeleton-card" v-for="i in 6">
    <div class="skeleton-image"></div>
    <div class="skeleton-text"></div>
  </div>
</div>
```

### Empty State
```html
<div class="empty-state">
  <img src="empty-illustration.svg" alt="No lessons">
  <h2>No lessons yet!</h2>
  <p>Be the first to share your knowledge</p>
  <button class="cta">Share a Lesson</button>
</div>
```

### Error State
```html
<div class="error-toast">
  <icon name="alert" />
  <span>Couldn't load lessons</span>
  <button onclick="retry()">Try Again</button>
</div>
```

## Performance Requirements
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Lighthouse Score: > 90
- Bundle Size: < 200KB initial
```

#### JSON Format (`home.page.json`)
```json
{
  "id": "page_home",
  "name": "Home",
  "path": "/",
  "meta": {
    "title": "Discover Lessons - TeacherShare",
    "description": "Browse and discover lesson plans shared by teachers",
    "og_image": "/og-home.png"
  },
  "layout": {
    "type": "responsive-grid",
    "breakpoints": {
      "mobile": {"columns": 1, "gap": 16},
      "tablet": {"columns": 2, "gap": 20},
      "desktop": {"columns": 3, "gap": 24}
    }
  },
  "components": [
    {
      "id": "nav-bar",
      "type": "NavigationBar",
      "props": {
        "fixed": true,
        "transparent": false
      }
    },
    {
      "id": "search",
      "type": "SearchBar",
      "props": {
        "placeholder": "Search lessons...",
        "autofocus": false
      }
    },
    {
      "id": "lesson-grid",
      "type": "DynamicGrid",
      "data_source": "lessons",
      "item_component": "LessonCard",
      "empty_component": "EmptyState",
      "loading_component": "SkeletonGrid"
    }
  ],
  "data": {
    "lessons": {
      "source": "api",
      "endpoint": "/api/lessons",
      "method": "GET",
      "params": {
        "limit": 20,
        "sort": "recent"
      },
      "transform": "normalizeLessons",
      "cache_ttl": 300
    }
  },
  "interactions": [
    {
      "trigger": "component:lesson-card:click",
      "action": "navigate",
      "params": {
        "to": "/lesson/{lesson.id}",
        "transition": "slide-left"
      }
    }
  ]
}
```

### 3. Design System Export

#### Design Tokens (`tokens.json`)
```json
{
  "version": "1.0",
  "name": "TeacherShare Design System",
  "generated_from": "emergent-patterns",
  "confidence_scores": {
    "colors": 0.95,
    "spacing": 0.9,
    "typography": 0.85
  },
  "tokens": {
    "color": {
      "primary": {
        "value": "#DC2626",
        "usage": "Primary actions, active states",
        "contrast": {
          "white": 4.54,
          "black": 4.61
        }
      },
      "surface": {
        "100": {"value": "#F8FAFC"},
        "200": {"value": "#F1F5F9"},
        "300": {"value": "#E2E8F0"},
        "800": {"value": "#1E293B"},
        "900": {"value": "#0F172A"}
      },
      "semantic": {
        "success": {"value": "#10B981"},
        "warning": {"value": "#F59E0B"},
        "error": {"value": "#EF4444"},
        "info": {"value": "#3B82F6"}
      }
    },
    "spacing": {
      "base": {"value": 8, "unit": "px"},
      "scale": [0, 8, 16, 24, 32, 48, 64, 96, 128],
      "usage": {
        "0": "No space",
        "1": "Tight spacing within components",
        "2": "Default spacing between elements",
        "3": "Section spacing",
        "4": "Large section gaps"
      }
    },
    "typography": {
      "fontFamily": {
        "base": "Inter, -apple-system, sans-serif",
        "mono": "JetBrains Mono, monospace"
      },
      "fontSize": {
        "xs": {"value": 12, "lineHeight": 16},
        "sm": {"value": 14, "lineHeight": 20},
        "base": {"value": 16, "lineHeight": 24},
        "lg": {"value": 18, "lineHeight": 28},
        "xl": {"value": 20, "lineHeight": 32},
        "2xl": {"value": 24, "lineHeight": 36},
        "3xl": {"value": 30, "lineHeight": 40}
      },
      "fontWeight": {
        "normal": 400,
        "medium": 500,
        "semibold": 600,
        "bold": 700
      }
    },
    "animation": {
      "duration": {
        "fast": "150ms",
        "base": "200ms",
        "slow": "300ms",
        "slower": "500ms"
      },
      "easing": {
        "default": "cubic-bezier(0.4, 0, 0.2, 1)",
        "in": "cubic-bezier(0.4, 0, 1, 1)",
        "out": "cubic-bezier(0, 0, 0.2, 1)",
        "bounce": "cubic-bezier(0.68, -0.55, 0.265, 1.55)"
      }
    }
  }
}
```

#### CSS Variables (`tokens.css`)
```css
:root {
  /* Colors */
  --color-primary: #DC2626;
  --color-surface-100: #F8FAFC;
  --color-surface-200: #F1F5F9;
  --color-surface-300: #E2E8F0;
  --color-surface-800: #1E293B;
  --color-surface-900: #0F172A;
  
  /* Spacing */
  --spacing-0: 0;
  --spacing-1: 8px;
  --spacing-2: 16px;
  --spacing-3: 24px;
  --spacing-4: 32px;
  --spacing-5: 48px;
  --spacing-6: 64px;
  --spacing-7: 96px;
  --spacing-8: 128px;
  
  /* Typography */
  --font-family-base: Inter, -apple-system, sans-serif;
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-base: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 20px;
  --font-size-2xl: 24px;
  --font-size-3xl: 30px;
  
  /* Animation */
  --duration-fast: 150ms;
  --duration-base: 200ms;
  --duration-slow: 300ms;
  --easing-default: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --color-surface-100: #0F172A;
    --color-surface-200: #1E293B;
    /* ... inverted scale */
  }
}
```

### 4. Implementation Instructions

#### AI Instructions (`ai-instructions.md`)
```markdown
# AI Implementation Instructions

## Overview
This document provides step-by-step instructions for implementing the TeacherShare application based on the FlexOS export.

## Prerequisites
- Node.js 18+ and npm/yarn
- Git for version control
- PostgreSQL or Supabase account
- Deployment platform account (Vercel/Netlify)

## Implementation Order

### Phase 1: Project Setup (30 minutes)
1. Initialize Vue 3 + Nuxt 3 project
2. Install dependencies from `dependencies.json`
3. Configure TypeScript with strict mode
4. Set up ESLint and Prettier with provided configs
5. Initialize git repository

### Phase 2: Design System (1 hour)
1. Copy `design-system/tokens.css` to `assets/css/`
2. Create component library structure
3. Implement base components from `design-system/components.json`
4. Set up Storybook for component development
5. Verify responsive behavior on all breakpoints

### Phase 3: Database Setup (1 hour)
1. Create database schema from `data-model/entities.schema.json`
2. Run migrations in order specified
3. Set up Supabase client with auth
4. Create Row Level Security policies
5. Seed with sample data from `data-model/sample-data.json`

### Phase 4: Page Implementation (4-6 hours)
Follow the order in `implementation/build-order.json`:

1. **Layout Components**
   - Implement NavigationBar with mobile menu
   - Create responsive layout wrapper
   - Add loading and error boundaries

2. **Home Page**
   - Copy structure from `mockups/pages/home.html`
   - Implement data fetching from specifications
   - Add infinite scroll with intersection observer
   - Ensure all states (loading, empty, error) work

3. **Authentication Pages**
   - Login with social providers
   - Signup with email verification
   - Password reset flow
   - Protected route middleware

4. **Feature Pages**
   For each page in `specifications/pages/`:
   - Follow the exact mockup
   - Implement specified interactions
   - Connect to appropriate API endpoints
   - Test on all device sizes

### Phase 5: User Journeys (2 hours)
1. Implement flows from `specifications/journeys/`
2. Add transition animations between pages
3. Ensure back button behavior is correct
4. Test complete flows end-to-end

### Phase 6: Testing (2 hours)
1. Unit tests for business logic
2. Component tests with Vue Test Utils
3. E2E tests for critical journeys
4. Performance testing against requirements
5. Accessibility audit with axe-core

### Phase 7: Deployment (1 hour)
1. Environment variable configuration
2. Build optimization
3. Deploy to Vercel/Netlify
4. Configure custom domain
5. Set up monitoring and analytics

## Critical Implementation Notes

### State Management
Use Pinia stores for:
- User authentication state
- Lesson data with optimistic updates
- UI preferences (theme, layout)
- Offline queue for sync

### API Integration
- Use composables for data fetching
- Implement proper error handling
- Add retry logic for failed requests
- Cache responses as specified

### Performance Optimizations
- Lazy load images with blur-up placeholders
- Code split by route
- Implement virtual scrolling for long lists
- Use web workers for heavy computations

### Mobile Considerations
- Touch targets minimum 48x48px
- Implement pull-to-refresh
- Add haptic feedback for interactions
- Ensure forms work with autofill

## Validation Checklist
- [ ] All pages match mockups exactly
- [ ] Design tokens applied consistently
- [ ] All user journeys completable
- [ ] Performance metrics met
- [ ] Accessibility standards passed
- [ ] Works offline for reading
- [ ] Responsive on all devices
```

### 5. Mockup Browser (`mockups/index.html`)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TeacherShare - Mockup Browser</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: Inter, -apple-system, sans-serif;
      background: #0F172A;
      color: #F8FAFC;
    }
    
    .browser {
      display: flex;
      height: 100vh;
    }
    
    .sidebar {
      width: 300px;
      background: #1E293B;
      padding: 24px;
      overflow-y: auto;
    }
    
    .preview {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #0F172A;
      position: relative;
    }
    
    .device-frame {
      background: white;
      border-radius: 8px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.4);
      overflow: hidden;
    }
    
    .device-frame.mobile {
      width: 375px;
      height: 812px;
      border-radius: 40px;
      padding: 10px;
    }
    
    .device-frame.tablet {
      width: 768px;
      height: 1024px;
    }
    
    .device-frame.desktop {
      width: 1200px;
      height: 800px;
    }
    
    iframe {
      width: 100%;
      height: 100%;
      border: none;
      border-radius: 30px;
    }
    
    .controls {
      position: absolute;
      top: 20px;
      right: 20px;
      display: flex;
      gap: 12px;
    }
    
    button {
      background: #1E293B;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
    }
    
    button:hover {
      background: #334155;
    }
    
    .page-list {
      list-style: none;
    }
    
    .page-item {
      padding: 12px;
      margin: 8px 0;
      background: #0F172A;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .page-item:hover {
      background: #334155;
      transform: translateX(4px);
    }
    
    .page-item.active {
      background: #DC2626;
    }
  </style>
</head>
<body>
  <div class="browser">
    <aside class="sidebar">
      <h1>Mockup Browser</h1>
      <h2>Pages</h2>
      <ul class="page-list" id="pageList"></ul>
      <h2>Components</h2>
      <ul class="page-list" id="componentList"></ul>
    </aside>
    
    <main class="preview">
      <div class="controls">
        <button onclick="setDevice('mobile')">Mobile</button>
        <button onclick="setDevice('tablet')">Tablet</button>
        <button onclick="setDevice('desktop')">Desktop</button>
      </div>
      
      <div class="device-frame mobile" id="deviceFrame">
        <iframe id="previewFrame" src="pages/home.html"></iframe>
      </div>
    </main>
  </div>
  
  <script>
    // Page and component data
    const pages = [
      {name: 'Home', file: 'pages/home.html'},
      {name: 'Login', file: 'pages/login.html'},
      {name: 'Dashboard', file: 'pages/dashboard.html'},
      // ... loaded from manifest
    ];
    
    const components = [
      {name: 'Navigation Bar', file: 'components/nav-bar.html'},
      {name: 'Lesson Card', file: 'components/lesson-card.html'},
      // ... loaded from manifest
    ];
    
    // Initialize page list
    const pageList = document.getElementById('pageList');
    pages.forEach((page, i) => {
      const li = document.createElement('li');
      li.className = 'page-item' + (i === 0 ? ' active' : '');
      li.textContent = page.name;
      li.onclick = () => loadPage(page.file, li);
      pageList.appendChild(li);
    });
    
    // Initialize component list
    const componentList = document.getElementById('componentList');
    components.forEach(comp => {
      const li = document.createElement('li');
      li.className = 'page-item';
      li.textContent = comp.name;
      li.onclick = () => loadPage(comp.file, li);
      componentList.appendChild(li);
    });
    
    // Load page in iframe
    function loadPage(file, element) {
      document.getElementById('previewFrame').src = file;
      document.querySelectorAll('.page-item').forEach(el => {
        el.classList.remove('active');
      });
      element.classList.add('active');
    }
    
    // Change device frame
    function setDevice(device) {
      const frame = document.getElementById('deviceFrame');
      frame.className = `device-frame ${device}`;
    }
  </script>
</body>
</html>
```

## Generation Process

### From Database to Export

```typescript
class ExportGenerator {
  async generateExport(projectId: string): Promise<ExportPackage> {
    // 1. Load project data
    const project = await loadProject(projectId);
    const pages = await loadPages(projectId);
    const features = await loadFeatures(projectId);
    const designSystem = await loadDesignSystem(projectId);
    const entities = await loadEntities(projectId);
    const flows = await loadFlows(projectId);
    
    // 2. Generate specifications
    const specs = {
      pages: await generatePageSpecs(pages),
      features: await generateFeatureSpecs(features),
      journeys: await generateJourneySpecs(flows),
      dataModel: await generateDataModel(entities)
    };
    
    // 3. Process mockups
    const mockups = await processMockups(pages, designSystem);
    
    // 4. Extract design system
    const tokens = await extractDesignTokens(designSystem);
    
    // 5. Generate documentation
    const docs = await generateDocumentation(project, specs);
    
    // 6. Create implementation guide
    const implementation = await generateImplementationGuide(
      specs,
      flows,
      entities
    );
    
    // 7. Package everything
    return packageExport({
      project,
      specs,
      mockups,
      tokens,
      docs,
      implementation
    });
  }
}
```

### Specification Templates

```typescript
// Page specification generator
function generatePageSpec(page: Page): PageSpecification {
  return {
    markdown: renderPageMarkdown(page),
    json: {
      id: page.id,
      name: page.name,
      path: page.path,
      layout: extractLayout(page.current_mockup),
      components: extractComponents(page.current_mockup),
      data: extractDataRequirements(page),
      interactions: extractInteractions(page),
      states: extractStates(page),
      responsive: extractResponsiveRules(page)
    }
  };
}

// Feature specification generator
function generateFeatureSpec(feature: Feature): FeatureSpecification {
  return {
    markdown: renderFeatureMarkdown(feature),
    json: {
      id: feature.id,
      name: feature.name,
      description: feature.user_description,
      user_stories: generateUserStories(feature),
      acceptance_criteria: generateAcceptanceCriteria(feature),
      technical_requirements: feature.technical_requirements,
      affected_pages: feature.affected_pages,
      data_operations: feature.data_operations,
      test_scenarios: generateTestScenarios(feature)
    }
  };
}
```

## Validation System

### Export Validation

```typescript
class ExportValidator {
  async validate(exportPath: string): Promise<ValidationReport> {
    const report = {
      completeness: await checkCompleteness(exportPath),
      consistency: await checkConsistency(exportPath),
      coverage: await checkCoverage(exportPath),
      implementability: await checkImplementability(exportPath)
    };
    
    return report;
  }
  
  async checkCompleteness(path: string): Promise<CompletenessCheck> {
    // Verify all required files exist
    // Check all pages have mockups
    // Ensure all features are specified
    // Validate all entities have schemas
  }
  
  async checkConsistency(path: string): Promise<ConsistencyCheck> {
    // Cross-reference page specs with mockups
    // Verify component usage matches definitions
    // Check data model relationships
    // Validate design token usage
  }
  
  async checkCoverage(path: string): Promise<CoverageCheck> {
    // Ensure all user journeys are complete
    // Check CRUD operations coverage
    // Verify error states for all pages
    // Validate responsive rules
  }
}
```

## Export Formats

### 1. Full Export (Default)
Everything described above - complete package for building from scratch

### 2. Incremental Export
Only changed files since last export, with manifest of changes

### 3. Specification-Only Export
Just the specs without mockups, for documentation purposes

### 4. Developer Export
Includes additional technical documentation and integration guides

### 5. Designer Export
Focuses on mockups, design system, and visual specifications
```



