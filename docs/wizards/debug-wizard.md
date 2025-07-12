# Debug Wizard 🔍

## Purpose
Systematically diagnose and fix layout issues, responsive problems, and component inconsistencies. This wizard helps recover when things have "gone off the rails" during development.

## The Debug Process

### Phase 1: Problem Identification

**Claude**: I'll help you debug the layout issues. Let's start by understanding what's wrong.

**What type of issue are you experiencing?**
- [ ] Layout breaking at certain screen sizes
- [ ] Components not aligning properly
- [ ] Unexpected scrollbars appearing
- [ ] Content overflowing containers
- [ ] Inconsistent spacing/sizing
- [ ] Components looking different on different pages
- [ ] Responsive behavior not working
- [ ] Other: _______________

**Where is the issue occurring?**
- Page/Route: _______________
- Component: _______________
- Breakpoint: [ Mobile / Tablet / Desktop / All ]
- Browser: [ Chrome / Safari / Firefox / All ]

### Phase 2: Visual Analysis

**Claude**: Let me analyze the current implementation.

**Can you share:**
1. Screenshot of the issue
2. Screenshot of expected behavior (mockup)
3. Current component/page code
4. Browser DevTools console errors (if any)

**Initial Analysis:**
```
Issues detected:
1. ❌ Fixed height calculation: height: calc(100vh - 128px)
2. ❌ Absolute positioning without container context
3. ❌ Missing overflow handling
4. ⚠️ Inconsistent spacing units (px mixed with rem)
5. ⚠️ Media queries not matching design system breakpoints
```

### Phase 3: Root Cause Analysis

**Claude**: Let's trace the root cause of these issues.

**Layout Structure Check**
```
Current structure:
App
└── Layout (height: 100vh, overflow: hidden)
    ├── Header (height: 64px, position: fixed)
    ├── Main (height: calc(100vh - 128px), overflow: auto)
    │   └── Content (min-height: 100%, padding issues)
    └── Footer (height: 64px, position: fixed)

Problems:
- Main height breaks when header/footer size changes
- Fixed positioning causes stacking context issues
- No accommodation for mobile viewport changes
```

**CSS Cascade Issues**
```css
/* Found conflicting styles: */
.container { 
  max-width: 1200px;  /* From global.css */
  max-width: 100%;    /* From component.module.css */
  max-width: 1400px;  /* From inline style */
}

/* Specificity war detected */
```

### Phase 4: Component Audit

**Claude**: Let me check how this component is used elsewhere.

**Cross-Reference Analysis:**
```typescript
// Found 5 instances of similar component
const usageAnalysis = {
  '/products': {
    layout: 'grid',
    containerWidth: '1200px',
    spacing: 'consistent',
    responsive: 'working'
  },
  '/dashboard': {
    layout: 'grid',  
    containerWidth: '100%', // ⚠️ Different!
    spacing: 'inconsistent', // ⚠️ Problem!
    responsive: 'broken' // ❌ Issue!
  },
  // ... more pages
};

// Divergence point: Commit a3f4b2c - "Quick fix for dashboard"
```

### Phase 5: Solution Strategy

**Claude**: Based on my analysis, here's how we'll fix this:

**Immediate Fixes** (Stop the bleeding)
```css
/* Replace fixed heights with flexbox/grid */
.layout {
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh; /* Better than height */
}

/* Fix overflow issues */
.main {
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch; /* iOS smooth scroll */
}

/* Remove conflicting styles */
.container {
  max-width: var(--container-max-width, 1200px);
  width: 100%;
  margin: 0 auto;
  padding: 0 var(--container-padding);
}
```

**Structural Refactor** (Permanent fix)
```typescript
// Create consistent layout component
export function PageLayout({ 
  children, 
  variant = 'default',
  maxWidth = '1200px',
  sidebar = false 
}) {
  return (
    <div className={styles.layout} data-variant={variant}>
      <Header />
      <main className={styles.main}>
        <div 
          className={styles.container}
          style={{ '--max-width': maxWidth }}
        >
          {sidebar ? (
            <div className={styles.withSidebar}>
              <Sidebar />
              <div className={styles.content}>{children}</div>
            </div>
          ) : children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
```

### Phase 6: Responsive Debug

**Claude**: Let's fix the responsive issues systematically.

**Breakpoint Testing**
```javascript
// Test at each breakpoint
const breakpointTests = {
  '320px': {
    issue: 'Content cut off',
    cause: 'Fixed width sidebar',
    fix: 'Hide sidebar, show menu'
  },
  '768px': {
    issue: 'Layout jump',
    cause: 'Media query mismatch',
    fix: 'Align with design system breakpoints'
  },
  '1024px': {
    issue: 'Unexpected scroll',
    cause: 'Container exceeds viewport',
    fix: 'Add max-width constraint'
  }
};
```

**Progressive Enhancement Fix**
```css
/* Mobile first approach */
.component {
  /* Base mobile styles */
  display: block;
  width: 100%;
}

/* Enhance for larger screens */
@media (min-width: 768px) {
  .component {
    display: grid;
    grid-template-columns: 250px 1fr;
  }
}

/* Prevent desktop styles from breaking mobile */
@container (max-width: 767px) {
  .component {
    grid-template-columns: 1fr !important;
  }
}
```

### Phase 7: Component Consistency

**Claude**: Let's ensure all instances of this component behave consistently.

**Consolidation Plan**
```typescript
// Step 1: Create source of truth
// components/shared/ProductCard/ProductCard.tsx
export const ProductCard = forwardRef<HTMLDivElement, ProductCardProps>(
  (props, ref) => {
    // Single implementation
  }
);

// Step 2: Replace all variations
const filesToUpdate = [
  '/pages/products/ProductItem.tsx',
  '/pages/search/SearchResult.tsx', 
  '/components/cart/CartItem.tsx'
];

// Step 3: Add deprecation warnings
export const OldProductCard = () => {
  console.warn('OldProductCard is deprecated. Use ProductCard from @/components/shared');
  return <ProductCard {...props} />;
};
```

### Phase 8: Testing & Validation

**Claude**: Let's verify our fixes work correctly.

**Visual Regression Tests**
```typescript
// Create visual tests for each breakpoint
describe('Layout Fixes', () => {
  const viewports = [
    { width: 320, height: 568 },   // Mobile
    { width: 768, height: 1024 },  // Tablet
    { width: 1440, height: 900 }   // Desktop
  ];
  
  viewports.forEach(({ width, height }) => {
    it(`should render correctly at ${width}x${height}`, () => {
      cy.viewport(width, height);
      cy.visit('/problematic-page');
      cy.get('[data-testid="layout"]').should('not.have.css', 'overflow-x', 'scroll');
      cy.matchImageSnapshot(`layout-${width}x${height}`);
    });
  });
});
```

**Manual Testing Checklist**
- [ ] Test on real devices (not just browser resize)
- [ ] Check with browser zoom (75%, 100%, 125%)
- [ ] Verify with dynamic content (long text, many items)
- [ ] Test with keyboard navigation
- [ ] Validate in Safari (flexbox quirks)
- [ ] Check with mobile viewport meta tag

### Phase 9: Prevention Strategy

**Claude**: Here's how to prevent these issues in the future:

**Layout Rules to Follow**
```markdown
## ✅ DO:
1. Use CSS Grid for page layouts
2. Use Flexbox for component layouts
3. Use CSS custom properties for dynamic values
4. Test at exact breakpoint boundaries
5. Use container queries for component responsiveness

## ❌ DON'T:
1. Calculate heights with calc(100vh - XXpx)
2. Use fixed positioning for layout components
3. Mix positioning contexts (absolute in flex)
4. Assume viewport units work everywhere
5. Override design system breakpoints
```

**Pre-Build Checklist**
```yaml
Before building any layout:
  - [ ] Review existing layout components
  - [ ] Check design system grid documentation  
  - [ ] Identify all breakpoint behaviors
  - [ ] Plan for content overflow
  - [ ] Consider viewport variations
  - [ ] Test plan for responsive behavior
```

## Debug Utilities

**Claude will generate these debug helpers:**

### 1. Layout Debugger Component
```typescript
export function LayoutDebugger({ children }) {
  if (process.env.NODE_ENV !== 'development') {
    return children;
  }
  
  return (
    <div className="relative">
      {children}
      <div className="fixed bottom-4 right-4 bg-black text-white p-2 text-xs">
        <div>Viewport: {window.innerWidth}x{window.innerHeight}</div>
        <div>Breakpoint: {getCurrentBreakpoint()}</div>
        <div>Container: {getContainerWidth()}</div>
      </div>
    </div>
  );
}
```

### 2. CSS Debug Utilities
```css
/* debug.css - Include in development only */
.debug-grid {
  background-image: 
    repeating-linear-gradient(0deg, rgba(255,0,0,0.1), rgba(255,0,0,0.1) 1px, transparent 1px, transparent var(--space-4)),
    repeating-linear-gradient(90deg, rgba(255,0,0,0.1), rgba(255,0,0,0.1) 1px, transparent 1px, transparent var(--space-4));
}

.debug-outline * {
  outline: 1px solid rgba(255,0,0,0.3);
}

.debug-spacing {
  > * {
    position: relative;
    &::before {
      content: attr(data-spacing);
      position: absolute;
      top: 0;
      right: 0;
      background: red;
      color: white;
      font-size: 10px;
      padding: 2px;
    }
  }
}
```

### 3. Console Helpers
```javascript
// Add to window for debugging
window.layoutDebug = {
  showGrid: () => document.body.classList.add('debug-grid'),
  showOutlines: () => document.body.classList.add('debug-outline'),
  showSpacing: () => document.body.classList.add('debug-spacing'),
  checkOverflow: () => {
    const elements = document.querySelectorAll('*');
    elements.forEach(el => {
      if (el.scrollWidth > el.clientWidth) {
        console.warn('Horizontal overflow:', el);
        el.style.outline = '2px solid red';
      }
    });
  },
  reset: () => {
    document.body.className = '';
    document.querySelectorAll('[style]').forEach(el => {
      el.removeAttribute('style');
    });
  }
};
```

## Success Metrics

After debugging, the layout should:
- ✅ Work at ALL screen sizes
- ✅ No horizontal scroll (unless intended)
- ✅ Consistent behavior across pages
- ✅ Match the original mockups
- ✅ Pass visual regression tests
- ✅ No console errors
- ✅ Perform smoothly on mobile