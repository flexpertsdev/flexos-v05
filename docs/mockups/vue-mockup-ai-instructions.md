# AI Instructions for Vue Mockup Generation

## Core Principles

### 1. **Always Start Fresh**
- NEVER iterate on existing code
- ALWAYS use the base template as starting point
- Each request is a new prompt reformulation
- Previous attempts inform the new prompt, not the code

### 2. **Mobile-First Progressive Enhancement**
- Design for 320px width first
- Enhance layout at 640px (tablet)
- Optimize for 1024px+ (desktop)
- Every app MUST work beautifully on ALL viewports
- Ignore user requests for "desktop-only" or "mobile-only"

### 3. **Code Quality Standards**
- Clear, descriptive comments for each section
- Consistent naming conventions
- Logical component structure
- Performance-conscious implementations

## Responsive Design Requirements

### Viewport Units
```css
/* ALWAYS use dynamic viewport units */
height: 100vh;  /* ❌ NEVER */
height: 100dvh; /* ✅ ALWAYS */

min-height: 100vh;  /* ❌ NEVER */
min-height: 100dvh; /* ✅ ALWAYS */
```

### Breakpoint Strategy
```css
/* Mobile First Breakpoints */
/* Base: 0-779px (Mobile with bottom nav) */
/* md: 780px+ (Tablet/Small desktop - no bottom nav) */
/* lg: 1024px-1279px (Desktop - compact) */
/* xl: 1280px+ (Desktop - full sidebar) */

/* IMPORTANT: 
   - Below 780px: Use bottom navigation
   - 780px-1279px: Use top navigation only
   - 1280px+: Use sidebar navigation
   - NEVER add sidebars before 1280px */
```

## Icon System

### Heroicons (Recommended for Vue CDN)
```html
<!-- Option 1: Heroicons via CDN (Best for mockups) -->
<script src="https://unpkg.com/heroicons@2.0.18/24/outline/index.js"></script>
<script src="https://unpkg.com/heroicons@2.0.18/24/solid/index.js"></script>

<!-- Usage -->
<svg class="icon" v-html="heroicons.outline.menu"></svg>
<svg class="icon" v-html="heroicons.solid.heart"></svg>
```

### CSS.gg Icons (Pure CSS Alternative)
```html
<!-- Include CSS.gg -->
<link href='https://unpkg.com/css.gg@2.0.0/icons/css/all.css' rel='stylesheet'>

<!-- Usage -->
<i class="gg-menu"></i>
<i class="gg-heart"></i>
```

### Icon Component Pattern
```javascript
// Create reusable icon component
const Icon = {
  props: ['name', 'size'],
  template: `
    <svg 
      :width="size || 20" 
      :height="size || 20" 
      class="icon"
      v-html="getIcon(name)"
    ></svg>
  `,
  methods: {
    getIcon(name) {
      // Map common icons
      const icons = {
        menu: heroicons.outline.menu,
        close: heroicons.outline.x,
        plus: heroicons.outline.plus,
        heart: heroicons.outline.heart,
        // Add more as needed
      };
      return icons[name] || '';
    }
  }
};

// Usage
<Icon name="menu" :size="24" />
```

### Icon Guidelines
- Default size: 20x20 for UI icons
- Touch targets: Wrap in 44x44 button
- Use outline for actions, solid for states
- Ensure 1.5:1 contrast minimum

## Component Structure

### Section Comments
```javascript
// ========================================
// STATE MANAGEMENT
// ========================================
// All reactive data definitions

// ========================================
// COMPUTED PROPERTIES
// ========================================
// Derived state calculations

// ========================================
// METHODS
// ========================================
// User interactions and business logic

// ========================================
// LIFECYCLE
// ========================================
// Component initialization
```

### Naming Conventions
- **State**: camelCase, descriptive (e.g., `isModalOpen`, `userProfile`)
- **Methods**: verbNoun format (e.g., `handleSubmit`, `toggleSidebar`)
- **Components**: PascalCase sections (e.g., `HeaderSection`, `UserCard`)
- **CSS Classes**: kebab-case, BEM-inspired (e.g., `card__header--active`)

## Mobile-First UI Patterns

### NO Desktop Patterns on Mobile
```css
/* ❌ NEVER on mobile/tablet */
:hover { } /* No hover states unless explicitly requested */
.sidebar { } /* No sidebars before 1280px */
.dropdown { } /* Use bottom sheets instead */

/* ✅ ALWAYS on mobile */
:active { } /* Use active states for feedback */
.bottom-sheet { } /* Replace dropdowns */
.bottom-nav { } /* Navigation below 780px */
```

### Form Patterns
```html
<!-- ❌ AVOID on mobile -->
<select>...</select> <!-- Use bottom sheet picker -->
<input type="radio"> <!-- Use button group -->
<div class="form-row"> <!-- Don't put multiple inputs per row -->

<!-- ✅ PREFER on mobile -->
<button @click="openPicker">Select option</button>
<div class="button-group">
  <button :class="{ active: selected === 'a' }">Option A</button>
  <button :class="{ active: selected === 'b' }">Option B</button>
</div>
<input class="full-width"> <!-- Full width forms -->
```

### Mobile Interaction Patterns
```javascript
// Bottom sheets instead of dropdowns
const openBottomSheet = () => {
  bottomSheetVisible.value = true;
};

// Touch feedback without hover
.button:active {
  transform: scale(0.98);
  opacity: 0.9;
}

// Swipe gestures where appropriate
@touchstart="handleTouchStart"
@touchmove="handleTouchMove"
@touchend="handleTouchEnd"
```

### Navigation Patterns
```css
/* Mobile (0-779px): Bottom navigation */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  padding-bottom: env(safe-area-inset-bottom);
}

/* Tablet/Small Desktop (780px-1279px): Top nav only */
@media (min-width: 780px) {
  .bottom-nav { display: none; }
  .top-nav { display: flex; }
}

/* Large Desktop (1280px+): Sidebar */
@media (min-width: 1280px) {
  .sidebar { display: flex; width: 240px; }
  .main-content { margin-left: 240px; }
}
```

### Safe Area Handling
```css
/* Handle notches and system UI */
.header {
  padding-top: calc(1rem + env(safe-area-inset-top));
}

.bottom-nav {
  padding-bottom: calc(1rem + env(safe-area-inset-bottom));
}
```

## Performance Guidelines

### Image Handling
```html
<!-- Always specify dimensions -->
<img 
  src="..." 
  alt="Descriptive alt text"
  width="400"
  height="300"
  loading="lazy"
  class="responsive-image"
>
```

### List Rendering
```javascript
// Always use :key with unique values
<div v-for="item in items" :key="item.id">
  <!-- content -->
</div>
```

### Event Handling
```javascript
// Prevent unnecessary re-renders
<button @click.prevent="handleClick">
  Click me
</button>
```

## Accessibility Requirements

### ARIA Labels
```html
<!-- Interactive elements need labels -->
<button aria-label="Close modal" @click="closeModal">
  <svg>...</svg>
</button>
```

### Focus Management
```css
/* Visible focus indicators */
:focus {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

/* But hidden for mouse users */
:focus:not(:focus-visible) {
  outline: none;
}
```

### Color Contrast
- Text on background: minimum 4.5:1 ratio
- Large text: minimum 3:1 ratio
- Interactive elements: clear hover/active states

## Design System Integration

### CSS Variables (Provided by Context)
```css
:root {
  /* Colors */
  --primary: #3B82F6;
  --primary-hover: #2563EB;
  --surface: #1a1a1a;
  --surface-elevated: #2a2a2a;
  --text-primary: #ffffff;
  --text-secondary: #a0a0a0;
  
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  /* Radii */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.2);
}
```

## Error States & Loading

### Loading States
```javascript
// Always show loading feedback
const loading = ref(false);
const error = ref(null);

const fetchData = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    // ... fetch logic
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
};
```

### Empty States
```html
<!-- Always handle empty data -->
<div v-if="items.length === 0" class="empty-state">
  <p>No items found</p>
  <button @click="addItem">Add your first item</button>
</div>
```

## Animation Guidelines

### Smooth Transitions
```css
/* Use CSS transitions for simple animations */
.element {
  transition: all 0.2s ease;
}

/* Respect motion preferences */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Vue Transitions
```html
<!-- Smooth list changes -->
<TransitionGroup name="list" tag="div">
  <div v-for="item in items" :key="item.id">
    <!-- content -->
  </div>
</TransitionGroup>
```

## Quality Checklist

Before delivering any mockup, ensure:

- [ ] Works perfectly on 320px width
- [ ] Touch targets are 44px minimum
- [ ] Uses dvh units for full-height layouts
- [ ] Handles safe areas for modern devices
- [ ] Loading states for all async operations
- [ ] Error states with recovery actions
- [ ] Empty states with clear CTAs
- [ ] Keyboard navigation works
- [ ] Focus indicators are visible
- [ ] Animations respect prefers-reduced-motion
- [ ] Comments explain complex logic
- [ ] No horizontal scroll on mobile
- [ ] Text remains readable when zoomed to 200%
- [ ] Interactive elements have hover/active states
- [ ] Forms have proper validation feedback

## Example Output Structure

```javascript
// Every mockup should follow this structure:

// 1. Clear page title and description
// 2. State definitions with comments
// 3. Computed properties for derived state
// 4. Methods grouped by feature
// 5. Lifecycle hooks at the end
// 6. Mobile-first CSS with clear breakpoints
// 7. Accessibility attributes on all interactions
```

Remember: The goal is to create mockups that are not just visually accurate, but production-ready in terms of structure, accessibility, and user experience across ALL devices.