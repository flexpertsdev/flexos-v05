# Mockup Creation & Iteration Wizard 🎨

## Purpose
Guide users through creating, iterating, and converting mockups using the FlexOS Mockup Tool. This wizard ensures mockups are production-ready and properly synced with the design system.

## Activation
When user mentions: "create mockup", "design a page", "iterate on design", or "mockup to Vue"

## The Mockup Creation Process

### Phase 1: Starting Point Assessment

**Claude**: Let's create a mockup that can be seamlessly converted to production Vue code. First, let me understand where you're starting from.

**What's your starting point?**
- [ ] Blank canvas - I need to design from scratch
- [ ] I have sketches/wireframes to implement
- [ ] I want to modify an existing mockup
- [ ] I have a design in another tool (Figma, etc.)
- [ ] I want to combine elements from multiple mockups

**Do you have the FlexOS mockup tool set up?**
```bash
# Check if mockup tool is accessible
cd /Users/jos/Developer/mockups
npm install  # If not already done
npm run serve
```

**Is your design system synced?**
- [ ] Yes, tokens are up to date
- [ ] No, need to sync from Vue project
- [ ] I've made changes in mockups to sync back
- [ ] Not sure, let's check

### Phase 2: Design System Sync Check

**Claude**: Before we start designing, let's ensure your design tokens are synchronized.

**Checking token freshness...**
```javascript
// Last sync timestamp from design-system.css
Last synced: {{timestamp}}
Source: {{vue_project_path}}

Token summary:
- Colors: {{color_count}} tokens
- Spacing: {{spacing_count}} tokens  
- Typography: {{type_count}} tokens
```

**Need to sync?**
```bash
# Sync from Vue to Mockups
npm run sync:from-vue

# Or sync from Mockups to Vue
npm run sync:to-vue
```

### Phase 3: Design Requirements Gathering

**Claude**: Now let's understand what you're building. I'll help ensure it works across all FlexOS breakpoints.

**What type of page/component are you designing?**
- [ ] Landing page
- [ ] Dashboard
- [ ] Form/Input heavy page
- [ ] Content page (blog, article)
- [ ] E-commerce (products, cart)
- [ ] User profile/settings
- [ ] Data table/list view
- [ ] Other: ___________

**Primary user context?**
- Mobile first (320px+)
- Desktop first (1024px+)
- Equal priority
- Specific device: ___________

**Key sections needed:**
```yaml
Header:
  - [ ] Logo/brand
  - [ ] Navigation
  - [ ] User menu
  - [ ] Search

Main Content:
  - [ ] Hero/banner
  - [ ] Content grid
  - [ ] Sidebar
  - [ ] Forms
  - [ ] Tables
  - [ ] Cards

Footer:
  - [ ] Links
  - [ ] Copyright
  - [ ] Social
```

### Phase 4: Component Selection

**Claude**: Let's identify FlexOS components for your mockup. I'll ensure we use existing components for easy Vue conversion.

**Available in mockup tool:**
```html
<!-- Layout Components -->
<div class="container-xl">
<div class="row">
<div class="col-12 col-md-6">
<div class="grid grid-cols-1 md:grid-cols-3">

<!-- UI Components -->
<button class="btn btn-primary">
<div class="card card-elevated">
<div class="alert alert-info">
<span class="badge badge-success">

<!-- Form Components -->
<input class="input" />
<select class="select">
<textarea class="textarea">
<label class="checkbox">
```

**Need custom components?**
Let's identify patterns that don't exist yet:
- Component name: ___________
- Used where: ___________
- Similar to: ___________

### Phase 5: Responsive Strategy

**Claude**: Let's plan how your design adapts across all 10 FlexOS breakpoints.

**Breakpoint behavior mapping:**
```javascript
// FlexOS Breakpoints
const breakpoints = {
  'xxs': 320,   // Smart watches
  'xs': 480,    // Phones
  'sm': 640,    // Large phones
  'md': 768,    // Tablets
  'lg': 1024,   // Laptops
  'xl': 1280,   // Desktops
  '2xl': 1536,  // Large screens
  '3xl': 1920,  // Full HD
  '4xl': 2560,  // 2K
  '5xl': 3840   // 4K
};
```

**Content reflow rules:**
- Mobile (xxs-sm): ___________
- Tablet (md-lg): ___________
- Desktop (xl+): ___________

**Elements to hide/show:**
```css
/* Example responsive utilities */
.hidden.sm:block  /* Hidden mobile, visible tablet+ */
.lg:hidden        /* Visible until desktop */
```

### Phase 6: Creating the Mockup

**Claude**: Now let's build your mockup step by step.

**Starting template:**
```bash
# Copy the template
cp template.html pages/your-page-name.html
```

**Basic structure I'll help you create:**
```html
<!DOCTYPE html>
<html>
<head>
    <title>{{PageName}} - FlexOS Mockup</title>
    <link rel="stylesheet" href="../shared/design-system.css">
    <link rel="stylesheet" href="../shared/flexos-core.css">
</head>
<body>
    <!-- Theme toggle -->
    <button class="btn btn-ghost btn-sm" data-theme-toggle>🌓</button>
    
    <!-- Header -->
    <header class="sticky-header">
        <!-- We'll build this together -->
    </header>
    
    <!-- Main content -->
    <main>
        <!-- Your design here -->
    </main>
    
    <!-- Scripts -->
    <script src="../shared/interactions.js"></script>
</body>
</html>
```

### Phase 7: Interactive Elements

**Claude**: Let's add interactions to make your mockup feel real.

**Available interactions:**
```javascript
// Built-in interactions
- Theme toggle (dark/light)
- Dropdown menus
- Modals
- Tabs
- Accordions
- Basic form validation

// Custom interactions we can add:
- Page transitions
- Button states
- Loading states
- Tooltips
```

**For user journey testing:**
```javascript
// Link between mockup pages
<a href="page2.html" class="btn btn-primary">Next Step</a>

// Store state for flows
localStorage.setItem('mockupFlow', JSON.stringify({
  step: 2,
  selections: ['option1', 'option2']
}));
```

### Phase 8: Component Usage Tracking

**Claude**: Let's track component usage for accurate Vue conversion.

**Automatic tracking setup:**
```javascript
// Track every component used
document.querySelectorAll('[class*="btn"]').forEach(btn => {
  window.trackComponent(btn, 'Button', {
    variant: btn.className.match(/btn-(\w+)/)?.[1] || 'default',
    size: btn.className.match(/btn-(xs|sm|lg|xl)/)?.[1] || 'md'
  });
});

// Export usage report
window.exportComponentUsage();
```

**Manual tracking for custom patterns:**
```javascript
window.trackComponent(element, 'CustomCard', {
  layout: 'horizontal',
  features: ['image', 'title', 'actions']
});
```

### Phase 9: Testing & Validation

**Claude**: Let's test your mockup across all devices and scenarios.

**Viewport testing checklist:**
- [ ] Test all 10 breakpoints
- [ ] Check portrait/landscape orientation
- [ ] Verify text readability at all sizes
- [ ] Ensure touch targets are 44px minimum
- [ ] Test with content overflow
- [ ] Check empty states
- [ ] Verify dark mode

**Use viewport tester:**
```
Open: http://localhost:3000/test/viewport.html
Target: ../pages/your-page.html
```

### Phase 10: Prepare for Vue Conversion

**Claude**: Your mockup is ready! Let's prepare it for conversion to Vue.

**Pre-conversion checklist:**
```yaml
✓ Design tokens synced
✓ All components tracked
✓ Responsive behavior documented
✓ Interactions identified
✓ Dark mode tested
✓ Accessibility checked
```

**Generate conversion spec:**
```javascript
// Mockup metadata for AI conversion
const mockupSpec = {
  page: 'your-page-name',
  components: window.getTrackedComponents(),
  breakpoints: {
    mobile: 'Stack vertical, hide filters',
    tablet: 'Two column, collapsible sidebar',
    desktop: 'Three column with fixed sidebar'
  },
  interactions: [
    'Filter panel toggles',
    'Modal on button click',
    'Tab navigation'
  ],
  customPatterns: [
    // Document any non-standard patterns
  ]
};
```

**Conversion prompt template:**
```
I have a FlexOS mockup at /mockups/pages/{{page}}.html

Component usage: {{mockupSpec.components}}
Responsive rules: {{mockupSpec.breakpoints}}
Interactions: {{mockupSpec.interactions}}

Please convert to Vue following FlexOS patterns:
1. Use FlexOS Vue components, not HTML classes
2. Make responsive with ResponsiveValue<T>
3. Add TypeScript types
4. Include all tracked interactions
```

## Mockup Iteration Workflow

### Quick Design Changes

**Claude**: Need to iterate on your design? Here's the fast workflow:

1. **Edit HTML directly** - Changes visible on refresh
2. **Update design tokens** - Run sync if needed
3. **Test immediately** - Use viewport preview
4. **Track new components** - Update tracking
5. **Document changes** - Note what changed for Vue team

### Design System Updates

**When updating tokens in mockup:**
```bash
# Edit: /mockups/shared/design-system.css
# Then sync to Vue:
npm run sync:to-vue

# Commit both systems together
git add -A
git commit -m "Update design tokens: [what changed]"
```

### Component Variations

**Testing new component variants:**
```html
<!-- Try variations in mockup first -->
<button class="btn btn-primary btn-xl">Large Primary</button>
<button class="btn btn-gradient">New Gradient Style</button>

<!-- Document successful patterns -->
<!-- TODO: Add btn-gradient to Vue components -->
```

## Export Features

### Export as Images

**Claude**: Need to share mockups as images? Here's how:

```javascript
// Add to mockup page
async function exportToImage() {
  const html2canvas = await import('html2canvas');
  const canvas = await html2canvas.default(document.body);
  
  // Download as PNG
  const link = document.createElement('a');
  link.download = 'mockup-{{pageName}}.png';
  link.href = canvas.toDataURL();
  link.click();
}

// Export all pages to PDF
async function exportAllToPDF() {
  // Implementation using jsPDF
}
```

### Export for Presentation

**Creating a design presentation:**
```javascript
// Generate PDF with all mockups
const presentation = {
  title: 'FlexOS Design Review',
  pages: [
    { name: 'Homepage', file: 'home.html', notes: '...' },
    { name: 'Dashboard', file: 'dashboard.html', notes: '...' }
  ],
  componentUsage: window.getAllComponentUsage(),
  responsiveNotes: 'Tested on all 10 breakpoints'
};
```

## Success Metrics

Your mockup should:
- ✅ Use only FlexOS components and utilities
- ✅ Work at all 10 breakpoints
- ✅ Have tracked component usage
- ✅ Include dark mode styles
- ✅ Be ready for Vue conversion
- ✅ Feel interactive and real
- ✅ Load quickly for rapid iteration

## Common Patterns Library

**Claude**: Here are proven patterns you can copy:

### Hero Section
```html
<section class="hero-section py-20 bg-primary-50">
  <div class="container-xl text-center">
    <h1 class="text-5xl font-bold mb-4">Welcome</h1>
    <p class="text-xl text-muted mb-8">Subtitle here</p>
    <button class="btn btn-primary btn-lg">CTA</button>
  </div>
</section>
```

### Responsive Card Grid
```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div class="card"><!-- Card content --></div>
  <div class="card"><!-- Card content --></div>
  <div class="card"><!-- Card content --></div>
</div>
```

### Mobile-First Navigation
```html
<nav class="hidden md:flex gap-6">
  <!-- Desktop nav -->
</nav>
<button class="md:hidden btn btn-ghost">☰</button>
```

---

**Remember**: The mockup tool is your design playground. Iterate quickly, test everything, and when you're happy, the conversion to Vue is seamless!
