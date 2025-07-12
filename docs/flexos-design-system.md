# FlexOS Design System

## Color Palette

### Dark Mode (Default)
```css
/* Background Colors */
--bg-primary: #0F1419;      /* Main background */
--bg-secondary: #1A1F26;    /* Card/Panel background */
--bg-tertiary: #242B33;     /* Elevated elements */
--bg-quaternary: #2D3440;   /* Hover states */

/* Text Colors */
--text-primary: #F7F9FA;    /* Main text */
--text-secondary: #D1D9E0;  /* Secondary text */
--text-tertiary: #8B949E;   /* Muted text */
--text-muted: #6E7681;      /* Disabled/hint text */

/* Border Colors */
--border-primary: #30363D;  /* Main borders */
--border-secondary: #3A4046; /* Hover borders */

/* Brand Colors */
--primary-400: #34D399;     /* Primary light */
--primary-500: #16C181;     /* Primary default */
--primary-600: #10A574;     /* Primary dark */

/* Accent Colors */
--blue-400: #60A5FA;        /* Info light */
--blue-500: #3B82F6;        /* Info default */
--blue-600: #2563EB;        /* Info dark */

--yellow-400: #FCD34D;      /* Warning light */
--yellow-500: #F59E0B;      /* Warning default */
--yellow-600: #D97706;      /* Warning dark */

--red-400: #FB7185;         /* Error light */
--red-500: #EF4444;         /* Error default */
--red-600: #DC2626;         /* Error dark */

/* Semantic Colors */
--success: var(--primary-500);
--warning: var(--yellow-500);
--error: var(--red-500);
--info: var(--blue-500);
```

### Light Mode
```css
/* Background Colors */
--bg-primary: #FFFFFF;      /* Main background */
--bg-secondary: #F9FAFB;    /* Card/Panel background */
--bg-tertiary: #F3F4F6;     /* Elevated elements */
--bg-quaternary: #E5E7EB;   /* Hover states */

/* Text Colors */
--text-primary: #111827;    /* Main text */
--text-secondary: #374151;  /* Secondary text */
--text-tertiary: #6B7280;   /* Muted text */
--text-muted: #9CA3AF;      /* Disabled/hint text */

/* Border Colors */
--border-primary: #E5E7EB;  /* Main borders */
--border-secondary: #D1D5DB; /* Hover borders */

/* Brand colors remain the same */
```

## Typography

### Font Family
```css
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'JetBrains Mono', 'SF Mono', Consolas, monospace;
```

### Font Sizes
```css
--text-xs: 0.75rem;     /* 12px */
--text-sm: 0.875rem;    /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg: 1.125rem;    /* 18px */
--text-xl: 1.25rem;     /* 20px */
--text-2xl: 1.5rem;     /* 24px */
--text-3xl: 1.875rem;   /* 30px */
--text-4xl: 2.25rem;    /* 36px */
--text-5xl: 3rem;       /* 48px */
```

### Font Weights
```css
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;
```

### Line Heights
```css
--leading-tight: 1.25;
--leading-snug: 1.375;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
--leading-loose: 2;
```

## Spacing System

### Base Unit: 4px
```css
--space-0: 0;           /* 0px */
--space-1: 0.25rem;     /* 4px */
--space-2: 0.5rem;      /* 8px */
--space-3: 0.75rem;     /* 12px */
--space-4: 1rem;        /* 16px */
--space-5: 1.25rem;     /* 20px */
--space-6: 1.5rem;      /* 24px */
--space-8: 2rem;        /* 32px */
--space-10: 2.5rem;     /* 40px */
--space-12: 3rem;       /* 48px */
--space-16: 4rem;       /* 64px */
--space-20: 5rem;       /* 80px */
--space-24: 6rem;       /* 96px */
```

## Border Radius
```css
--radius-none: 0;
--radius-sm: 0.125rem;  /* 2px */
--radius-base: 0.25rem; /* 4px */
--radius-md: 0.375rem;  /* 6px */
--radius-lg: 0.5rem;    /* 8px */
--radius-xl: 0.75rem;   /* 12px */
--radius-2xl: 1rem;     /* 16px */
--radius-3xl: 1.5rem;   /* 24px */
--radius-full: 9999px;  /* Pill shape */
```

## Shadows
```css
--shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
```

## Common Components

### Buttons
```css
/* Primary Button */
.btn-primary {
  background: var(--primary-500);
  color: white;
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-xl);
  font-weight: var(--font-semibold);
  transition: all 0.2s;
}

/* Secondary Button */
.btn-secondary {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-primary);
}

/* Sizes */
.btn-sm { padding: var(--space-2) var(--space-4); font-size: var(--text-sm); }
.btn-md { padding: var(--space-3) var(--space-6); font-size: var(--text-base); }
.btn-lg { padding: var(--space-4) var(--space-8); font-size: var(--text-lg); }
```

### Cards
```css
.card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  transition: all 0.2s;
}

.card:hover {
  border-color: var(--border-secondary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
```

### Input Fields
```css
.input {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-3) var(--space-4);
  color: var(--text-primary);
  font-size: var(--text-base);
  transition: all 0.2s;
}

.input:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px rgba(22, 193, 129, 0.1);
}
```

## Animation System

### Transitions
```css
--transition-fast: 150ms;
--transition-base: 200ms;
--transition-slow: 300ms;
--transition-slower: 500ms;
```

### Easing Functions
```css
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

## Responsive Breakpoints
```css
--screen-sm: 640px;   /* Mobile landscape */
--screen-md: 768px;   /* Tablet */
--screen-lg: 1024px;  /* Desktop */
--screen-xl: 1280px;  /* Large desktop */
--screen-2xl: 1536px; /* Extra large */
```

## Z-Index Scale
```css
--z-0: 0;
--z-10: 10;      /* Dropdowns */
--z-20: 20;      /* Sticky elements */
--z-30: 30;      /* Fixed headers */
--z-40: 40;      /* Overlays */
--z-50: 50;      /* Modals */
--z-60: 60;      /* Popovers */
--z-70: 70;      /* Tooltips */
--z-80: 80;      /* Toasts */
--z-90: 90;      /* Loading */
--z-100: 100;    /* Critical */
```