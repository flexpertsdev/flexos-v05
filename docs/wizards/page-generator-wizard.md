# Page Generator Wizard 📄

## Purpose
Gather comprehensive requirements BEFORE building any page to ensure correct layout, responsive behavior, and component reuse. This wizard prevents the common problem of going "off the rails" during implementation.

## The Page Generation Process

### Phase 1: Mockup Analysis

**Claude**: I'll help you create a page that's consistent with your design system. Let's start by understanding what we're building.

**Do you have mockups or reference designs?**
- [ ] Yes, in FlexOS mockup tool
- [ ] Yes, in another tool (Figma/Sketch/Images)
- [ ] Yes, I have similar pages already built
- [ ] No, but I can describe what I need
- [ ] I want to create a mockup first

**[If FlexOS mockup exists]**
```bash
# Analyzing your mockup...
Mockup path: /mockups/pages/{{page-name}}.html

# Checking component tracking
const usage = window.exportComponentUsage();
console.log('Components used:', usage);

# Checking responsive behavior
Tested breakpoints: [320, 480, 640, 768, 1024, 1280, 1536, 1920, 2560, 3840]
```

**[If external mockups exist]**
Please share the mockup files. I'll help you:
1. Convert them to FlexOS mockup format first
2. Test responsive behavior
3. Track component usage
4. Then convert to Vue

**[Creating mockup from description]**
Let's use the FlexOS mockup tool to prototype:
```bash
cd /mockups
cp template.html pages/{{page-name}}.html
# Now we'll build it together
```

**[After analyzing mockups]**
I've identified these patterns in your mockup:
```
Layout Structure:
- Header: Fixed height with navigation
- Main: Scrollable content area
- Sidebar: Collapsible on mobile
- Footer: Sticky on desktop

Components Found:
- Navigation bar (matches existing)
- Card grid (new variant needed)
- Filter sidebar (can reuse with modifications)
- Action buttons (matches design system)
```

### Phase 2: Layout Requirements

**Claude**: Now let's clarify the layout behavior across different screen sizes.

**Desktop Layout (1200px+)**
```
┌─────────────────────────────────┐
│          Header (64px)          │
├────┬────────────────────────────┤
│Side│                            │
│bar │      Main Content          │
│250 │      (fluid width)         │
│ px │                            │
├────┴────────────────────────────┤
│          Footer (80px)          │
└─────────────────────────────────┘
```

Is this correct? Any adjustments needed?

**Tablet Layout (768px - 1199px)**
- [ ] Same as desktop but narrower sidebar
- [ ] Sidebar becomes collapsible
- [ ] Sidebar moves to top as horizontal nav
- [ ] Other: _____________

**Mobile Layout (<768px)**
- [ ] Stack all sections vertically
- [ ] Hide sidebar, show menu button
- [ ] Bottom navigation pattern
- [ ] Other: _____________

### Phase 3: Component Identification

**Claude**: Let's identify shared components to ensure consistency.

**From your mockups, I see these potential reusable components:**

1. **PageLayout** - The overall structure
   - Variants: `with-sidebar`, `full-width`, `centered`
   - Props: `showSidebar`, `sidebarPosition`, `maxWidth`

2. **ContentGrid** - The main content area
   - Variants: `cards`, `list`, `masonry`
   - Props: `columns`, `gap`, `responsive`

3. **FilterPanel** - The filtering sidebar
   - Can be used in: Products, Users, Reports pages
   - Props: `filters`, `onFilterChange`, `collapsible`

**Do any of these already exist in your codebase?**
- [ ] Check existing components first
- [ ] Create new ones as needed
- [ ] Extend existing components

### Phase 4: Responsive Behavior Details

**Claude**: Let's nail down the responsive behavior to avoid issues later.

**Breakpoint System**
```javascript
// Your current breakpoints:
const breakpoints = {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Wide desktop
  '2xl': '1536px' // Ultra wide
};
```

**Content Reflow Strategy**
At which breakpoint should:
- Sidebar collapse? [ md / lg / xl ]
- Grid change columns? [ sm: 1, md: 2, lg: 3 ]
- Navigation change to mobile? [ md / lg ]
- Spacing reduce? [ Below md / Below lg ]

**Scroll Behavior**
- Desktop: [ Fixed header/sidebar, scrollable main ]
- Mobile: [ Everything scrolls / Fixed header only ]
- Overflow handling: [ Hidden / Scroll / Auto ]

### Phase 5: State & Interactions

**Claude**: Now let's define the interactive elements and state management.

**Page State Requirements**
- [ ] Filtering/searching data
- [ ] Pagination or infinite scroll
- [ ] Sorting capabilities
- [ ] Selection/multi-select
- [ ] Expandable sections
- [ ] Loading states
- [ ] Empty states
- [ ] Error states

**Data Flow**
Where does the data come from?
- [ ] Static props
- [ ] API endpoint: ________________
- [ ] Global state (Redux/Zustand)
- [ ] Local component state
- [ ] Server-side rendered

### Phase 6: Pre-Build Checklist

**Claude**: Before I start building, let me confirm our complete specification:

**Design System Sync Check:**
```bash
# Ensure tokens are current
cd /mockups && npm run sync:from-vue

# If design changed in mockup:
npm run sync:to-vue
```

```yaml
Page: {{PageName}}
Route: {{/path/to/page}}

Layout:
  type: with-sidebar
  sidebar: 
    position: left
    collapsible: true
    breakpoint: md
  
Components to reuse:
  - AppLayout (from /components/layout)
  - CardGrid (from /components/ui)
  - FilterPanel (needs modification)
  
Components to create:
  - PageSpecificHeader
  - DataTable variant
  
Responsive behavior:
  - Mobile: Stack vertical, hide filters
  - Tablet: Collapsible sidebar
  - Desktop: Fixed sidebar
  
State management:
  - Filters: URL params
  - Data: React Query
  - UI state: Local state
  
Performance:
  - Virtualize long lists
  - Lazy load images
  - Code split route
```

**Ready to proceed?**
- [ ] Yes, this looks correct
- [ ] Let me adjust something first

### Phase 7: Component Structure Generation

**Claude**: Based on our mockup analysis, here's the component structure I'll create:

**From mockup HTML to Vue components:**
```html
<!-- Mockup HTML -->
<div class="card card-elevated">
  <div class="card-header">Title</div>
  <div class="card-body">Content</div>
</div>

<!-- Converts to Vue -->
<Card elevated>
  <template #header>Title</template>
  <template #body>Content</template>
</Card>
```

```typescript
// pages/{{PageName}}/index.tsx
import { AppLayout } from '@/components/layout/AppLayout';
import { FilterPanel } from '@/components/shared/FilterPanel';
import { {{ContentComponent}} } from './components/{{ContentComponent}}';
import { use{{PageName}}Data } from './hooks/use{{PageName}}Data';
import { use{{PageName}}Filters } from './hooks/use{{PageName}}Filters';

export function {{PageName}}Page() {
  const { filters, updateFilters } = use{{PageName}}Filters();
  const { data, isLoading, error } = use{{PageName}}Data(filters);
  
  return (
    <AppLayout
      sidebar={
        <FilterPanel
          filters={filters}
          onChange={updateFilters}
          collapsible
        />
      }
    >
      <{{ContentComponent}}
        data={data}
        isLoading={isLoading}
        error={error}
      />
    </AppLayout>
  );
}
```

## Anti-Patterns to Avoid

**Claude will check for these common mistakes:**

1. **Hardcoded Heights**
   ```css
   /* ❌ Avoid */
   height: calc(100vh - 64px - 80px);
   
   /* ✅ Use */
   grid-template-rows: auto 1fr auto;
   ```

2. **Inconsistent Spacing**
   ```css
   /* ❌ Avoid */
   margin: 12px; /* Random value */
   
   /* ✅ Use */
   margin: var(--space-3); /* Design token */
   ```

3. **Non-Responsive Components**
   ```tsx
   /* ❌ Avoid */
   <Grid columns={3}>
   
   /* ✅ Use */
   <Grid columns={{ sm: 1, md: 2, lg: 3 }}>
   ```

## Success Metrics

The generated page should:
- ✅ Match the mockup exactly
- ✅ Reuse existing components
- ✅ Work on all screen sizes
- ✅ Handle all states (loading, empty, error)
- ✅ Follow the design system
- ✅ Be consistent with other pages
- ✅ Load performantly

## Example Usage

```
User: "I need to build a products listing page based on these mockups"

Claude: [Runs through the wizard, gathering all requirements]

Claude: Based on our discussion, I'll create:
1. ProductsPage using AppLayout with filters
2. Reuse ProductCard from existing components  
3. Create new ProductFilters extending FilterPanel
4. Implement responsive grid (1/2/3/4 columns)
5. Add loading skeletons and empty states

Shall I proceed with this implementation?
```