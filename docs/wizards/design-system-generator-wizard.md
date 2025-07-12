# Design System Generator Wizard 🎨

## Purpose
Create a comprehensive, mobile-first design system based on user preferences, ensuring consistent and responsive applications. This wizard translates high-level desires like "I want red WhatsApp" into complete design specifications.

## The Design System Creation Process

### Phase 1: Design Inspiration

**Claude**: Let's create a design system that ensures your app looks great on all devices. First, help me understand your vision.

**What's your design inspiration?**
- [ ] An existing app (WhatsApp, Instagram, Notion, etc.)
- [ ] A brand/company style
- [ ] A design mood (minimal, playful, professional)
- [ ] I have specific colors/fonts in mind
- [ ] I'm open to suggestions

**[If existing app]**
Which app inspires you? And what do you like about it?
```
Examples:
- "WhatsApp" → Clean, message-focused, green accent
- "Notion" → Minimal, flexible, good typography  
- "Instagram" → Bold, image-first, engaging
- "Stripe" → Professional, precise, trustworthy
```

**[If specific colors]**
What's your primary brand color?
- Hex code: #_______
- Or describe: "Navy blue", "Bright red", etc.

### Phase 2: Visual Personality

**Claude**: Now let's define the personality of your design.

**How should your app feel?**
```
Formal ←→ Casual
[1]  [2]  [3]  [4]  [5]

Serious ←→ Playful  
[1]  [2]  [3]  [4]  [5]

Minimal ←→ Expressive
[1]  [2]  [3]  [4]  [5]

Tech-focused ←→ Human-focused
[1]  [2]  [3]  [4]  [5]
```

**What's most important in your design?**
- [ ] Clarity and simplicity
- [ ] Visual appeal and delight
- [ ] Information density
- [ ] Brand expression
- [ ] Accessibility

### Phase 3: Color System

**Claude**: Based on your inputs, I'll create a color palette. 

**[Generates initial palette]**
```css
:root {
  /* Primary Colors */
  --primary: #[calculated];        /* Main brand color */
  --primary-dark: #[calculated];   /* Hover/active states */
  --primary-light: #[calculated];  /* Backgrounds */
  
  /* Neutral Colors */
  --gray-50: #fafafa;   /* Lightest backgrounds */
  --gray-100: #f5f5f5;  /* Light backgrounds */
  --gray-200: #e5e5e5;  /* Borders */
  --gray-300: #d4d4d4;  /* Disabled borders */
  --gray-400: #a3a3a3;  /* Placeholder text */
  --gray-500: #737373;  /* Secondary text */
  --gray-600: #525252;  /* Primary text */
  --gray-700: #404040;  /* Headings */
  --gray-800: #262626;  /* Dark backgrounds */
  --gray-900: #171717;  /* Darkest backgrounds */
  
  /* Semantic Colors */
  --success: #10b981;   /* Green */
  --warning: #f59e0b;   /* Amber */
  --error: #ef4444;     /* Red */
  --info: #3b82f6;      /* Blue */
}
```

**How does this palette look?**
- [ ] Perfect!
- [ ] Too bright/dark
- [ ] Wrong primary color
- [ ] Need different accent colors

### Phase 4: Typography

**Claude**: Let's choose fonts that match your design personality.

**Font preference:**
- [ ] System fonts (fastest, most familiar)
- [ ] Google Fonts (free, lots of choice)
- [ ] Premium fonts (I'll provide)
- [ ] Let me suggest based on your style

**[Generates typography scale]**
```css
:root {
  /* Font Families */
  --font-sans: system-ui, -apple-system, sans-serif;
  --font-display: 'Plus Jakarta Sans', var(--font-sans);
  --font-mono: 'Fira Code', monospace;
  
  /* Font Sizes - Mobile First */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px - prevents iOS zoom */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */
  
  /* Line Heights */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;
  
  /* Font Weights */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}

/* Responsive Typography */
@media (min-width: 768px) {
  :root {
    --text-base: 1.125rem;  /* 18px on desktop */
    --text-lg: 1.25rem;     /* Scale up */
    --text-xl: 1.5rem;
    --text-2xl: 1.875rem;
    --text-3xl: 2.25rem;
    --text-4xl: 3rem;
  }
}
```

### Phase 5: Spacing & Layout

**Claude**: Now for spacing - this ensures consistent layouts.

**How spacious should your design be?**
- [ ] Compact (information-dense)
- [ ] Balanced (default)
- [ ] Spacious (breathing room)
- [ ] Custom values

**[Generates spacing system]**
```css
:root {
  /* Base unit: 4px */
  --space-px: 1px;
  --space-0: 0;
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  --space-24: 6rem;     /* 96px */
  
  /* Container */
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1280px;
  --container-2xl: 1536px;
  
  /* Border Radius */
  --radius-none: 0;
  --radius-sm: 0.125rem;   /* 2px */
  --radius-md: 0.375rem;   /* 6px */
  --radius-lg: 0.5rem;     /* 8px */
  --radius-xl: 0.75rem;    /* 12px */
  --radius-2xl: 1rem;      /* 16px */
  --radius-full: 9999px;   /* Pills */
}
```

### Phase 6: Interactive Elements

**Claude**: Let's define how interactive elements behave.

**Interaction style:**
- [ ] Subtle (minimal feedback)
- [ ] Responsive (clear feedback)
- [ ] Playful (animated feedback)
- [ ] Custom preferences

**[Generates interaction patterns]**
```css
:root {
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1);
  
  /* Transitions */
  --transition-fast: 150ms ease-in-out;
  --transition-base: 200ms ease-in-out;
  --transition-slow: 300ms ease-in-out;
  
  /* Animation curves */
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
}

/* Button Example */
.button {
  /* Minimum touch target */
  min-height: 44px;
  min-width: 44px;
  
  /* Transitions */
  transition: all var(--transition-base);
  
  /* States */
  &:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: var(--shadow-sm);
  }
  
  &:focus-visible {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
  }
}
```

### Phase 7: Mobile-First Patterns

**Claude**: Finally, let's ensure perfect mobile experience.

**Mobile navigation preference:**
- [ ] Bottom tabs (iOS style)
- [ ] Hamburger menu (classic)
- [ ] Hybrid (tabs + menu)
- [ ] Custom pattern

**Mobile-specific considerations:**
```css
/* Safe areas for modern phones */
:root {
  --safe-area-inset-top: env(safe-area-inset-top);
  --safe-area-inset-bottom: env(safe-area-inset-bottom);
  --safe-area-inset-left: env(safe-area-inset-left);
  --safe-area-inset-right: env(safe-area-inset-right);
}

/* Prevent iOS zoom on inputs */
input, select, textarea {
  font-size: 16px; /* Magic number for iOS */
}

/* Touch-friendly spacing */
.touch-target {
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: -8px;
    right: -8px;
    bottom: -8px;
    left: -8px;
  }
}
```

### Phase 8: Complete Design System

**Claude**: Here's your complete design system:

```yaml
Design System Summary:
  Name: [Your App] Design System
  Personality: [Description based on choices]
  
  Colors:
    Primary: [Selected color]
    Style: [Light/Dark/Auto]
    
  Typography:
    Font: [Selected fonts]
    Scale: [Compact/Normal/Large]
    
  Spacing:
    Base: 4px grid
    Style: [Compact/Balanced/Spacious]
    
  Components:
    Buttons: [Style description]
    Cards: [Style description]
    Forms: [Style description]
    
  Mobile:
    Navigation: [Pattern]
    Breakpoints: Mobile-first
    Touch targets: 44px minimum
```

**Ready to generate the complete system?**
- [ ] Yes, create all files
- [ ] Let me adjust something
- [ ] Show me example components first

## Generated Output

The wizard creates:

### 1. CSS Variables File
```css
/* design-system/tokens.css */
:root {
  /* All design tokens */
}

[data-theme="dark"] {
  /* Dark mode overrides */
}
```

### 2. Component Styles
```css
/* design-system/components.css */
.btn { }
.card { }
.input { }
/* etc... */
```

### 3. Utility Classes
```css
/* design-system/utilities.css */
.text-primary { }
.bg-surface { }
.p-4 { }
/* etc... */
```

### 4. Documentation
```markdown
# Design System Documentation
- Color usage guidelines
- Typography patterns  
- Component examples
- Mobile considerations
```

### 5. Implementation Guide
```markdown
# How to Use This Design System
1. Import the CSS files
2. Use semantic color names
3. Follow spacing grid
4. Test on real devices
```

## Success Criteria

The generated design system:
- ✅ Works perfectly on mobile (no zoom, no overflow)
- ✅ Maintains consistency across all components
- ✅ Includes dark mode support
- ✅ Follows accessibility guidelines
- ✅ Performs well (no layout shifts)
- ✅ Matches the user's vision
- ✅ Is easy to implement