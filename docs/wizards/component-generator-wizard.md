# Component Generator Wizard 🧩

## Purpose
Create reusable components that handle variations elegantly without breaking layouts or creating inconsistencies. This wizard ensures components are flexible enough to work across different contexts while maintaining design system compliance.

## The Component Generation Process

### Phase 1: Component Discovery

**Claude**: Let's create a component that's truly reusable. First, help me understand what you're building.

**What type of component is this?**
- [ ] Layout component (defines structure)
- [ ] UI component (buttons, inputs, etc.)
- [ ] Feature component (complex functionality)
- [ ] Composite component (combines others)

**Do you have a mockup for this component?**
- [ ] Yes, in FlexOS mockup tool
- [ ] Yes, in another tool (Figma, etc.)
- [ ] No, but I can describe it
- [ ] I want to create a mockup first

**[If mockup exists in FlexOS tool]**
```bash
# Let me analyze your mockup
Path to mockup: /mockups/components/{{component-name}}.html

# Checking component usage tracking...
Tracked usage: window.getComponentUsage('{{ComponentName}}')
```

**Where will this component be used?**
Please list all known usage contexts:
```
1. Product listing page - as grid items
2. Search results - as list items  
3. Cart page - as summary cards
4. Homepage - as featured items
```

**Do similar components already exist?**
Let me check your codebase for patterns...
```
Found similar components:
- /components/ui/Card (basic card)
- /components/product/ProductTile (specific to products)
- /components/shared/MediaCard (image + text)

Should we extend one of these or create new?
```

### Phase 2: Variation Analysis

**Claude**: Now let's identify all the variations this component needs to support.

**Visual Variations**
Show me examples of how this component looks different in each context:

```typescript
// Variation mapping
const variations = {
  // Product listing: Vertical card with image
  listing: {
    layout: 'vertical',
    showImage: true,
    showPrice: true,
    showRating: true,
    imageSize: 'cover',
    aspectRatio: '4:3'
  },
  
  // Search results: Horizontal compact
  search: {
    layout: 'horizontal', 
    showImage: true,
    showPrice: true,
    showRating: false,
    imageSize: 'thumbnail',
    aspectRatio: '1:1'
  },
  
  // Cart: Minimal with actions
  cart: {
    layout: 'horizontal',
    showImage: true,
    showPrice: true,
    showQuantity: true,
    showActions: true,
    imageSize: 'small'
  }
};
```

**Size Variations**
- [ ] Small (compact, minimal info)
- [ ] Medium (standard, balanced)
- [ ] Large (detailed, expanded info)
- [ ] Responsive (changes with viewport)

### Phase 3: Props Architecture

**Claude**: Based on the variations, let's design a flexible props API.

```typescript
interface ComponentProps {
  // Layout control
  variant?: 'default' | 'compact' | 'detailed' | 'minimal';
  layout?: 'vertical' | 'horizontal' | 'grid';
  size?: 'sm' | 'md' | 'lg' | ResponsiveSize;
  
  // Content sections (all optional for flexibility)
  image?: {
    src: string;
    alt: string;
    aspectRatio?: '1:1' | '4:3' | '16:9';
    objectFit?: 'cover' | 'contain';
  };
  
  title: string;
  subtitle?: string;
  description?: string;
  
  // Feature flags for sections
  features?: {
    showImage?: boolean;
    showPrice?: boolean;
    showRating?: boolean;
    showActions?: boolean;
    showBadge?: boolean;
  };
  
  // Actions
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  }>;
  
  // Styling
  className?: string;
  bordered?: boolean;
  shadow?: boolean;
  
  // Responsive overrides
  responsive?: {
    sm?: Partial<ComponentProps>;
    md?: Partial<ComponentProps>;
    lg?: Partial<ComponentProps>;
  };
}
```

**Is this flexible enough for your needs?**
- [ ] Yes, covers all cases
- [ ] Need additional props: ___________
- [ ] Some props aren't needed

### Phase 4: Responsive Behavior

**Claude**: Let's define how this component adapts to different screen sizes.

**Default Responsive Strategy**
```css
/* Mobile First Approach */
.component {
  /* Base mobile styles */
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

/* Tablet and up */
@media (min-width: 768px) {
  .component[data-layout="horizontal"] {
    flex-direction: row;
    gap: var(--space-3);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .component[data-size="lg"] {
    gap: var(--space-4);
    /* Expanded layout */
  }
}
```

**Breakpoint Behaviors**
At what breakpoints should the component:
- Change layout? [ Always | 768px | 1024px | Never ]
- Hide/show elements? [ Description at <768px ]
- Adjust spacing? [ Increase at each breakpoint ]
- Change image size? [ Thumbnail → Medium → Large ]

### Phase 5: State Management

**Claude**: How should this component handle different states?

**Interactive States**
- [ ] Hover effects
- [ ] Focus states (keyboard navigation)
- [ ] Active/pressed states
- [ ] Selected state
- [ ] Disabled state
- [ ] Loading state
- [ ] Error state

**State Appearance**
```typescript
// State styling approach
const stateStyles = {
  hover: {
    transform: 'translateY(-2px)',
    shadow: 'elevated',
    borderColor: 'primary'
  },
  focus: {
    outline: '2px solid var(--primary)',
    outlineOffset: '2px'
  },
  selected: {
    borderColor: 'primary',
    background: 'primary-light'
  },
  disabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
    pointerEvents: 'none'
  }
};
```

### Phase 6: Composition Strategy

**Claude**: Let's design how this component can be composed and extended.

**Composition Pattern**
```typescript
// Base component with slots
export function Card({ children, ...props }) {
  return (
    <CardProvider value={props}>
      <div className={cardStyles(props)}>
        {children}
      </div>
    </CardProvider>
  );
}

// Composable sub-components
Card.Image = CardImage;
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Actions = CardActions;

// Usage example
<Card variant="horizontal" size="md">
  <Card.Image src={product.image} />
  <Card.Body>
    <Card.Header>{product.name}</Card.Header>
    <p>{product.description}</p>
  </Card.Body>
  <Card.Actions>
    <Button>Add to Cart</Button>
  </Card.Actions>
</Card>
```

**Extension Strategy**
- [ ] Props-based variants (current approach)
- [ ] Composition with sub-components
- [ ] Higher-order component wrapper
- [ ] Render props pattern

### Phase 7: Design System Integration

**Claude**: Let's ensure this component follows your design system perfectly.

**First, let's check token sync status:**
```bash
# Check if design tokens are synced
cd /mockups && npm run sync:from-vue

# Or if you've updated tokens in mockups:
npm run sync:to-vue
```

**Design Tokens Check**
```typescript
// Mapping to design system
const tokenMapping = {
  spacing: {
    sm: 'var(--space-2)',  // 8px
    md: 'var(--space-3)',  // 12px
    lg: 'var(--space-4)',  // 16px
  },
  
  borderRadius: {
    sm: 'var(--radius-sm)',  // 4px
    md: 'var(--radius-md)',  // 8px
    lg: 'var(--radius-lg)',  // 12px
  },
  
  shadows: {
    none: 'none',
    sm: 'var(--shadow-sm)',
    md: 'var(--shadow-md)',
    lg: 'var(--shadow-lg)',
  },
  
  colors: {
    border: 'var(--border-primary)',
    background: 'var(--background-primary)',
    text: 'var(--foreground-primary)',
    textSecondary: 'var(--foreground-secondary)',
  }
};
```

**Consistency Checklist**
- [ ] Uses only design system colors
- [ ] Follows spacing scale (4px base)
- [ ] Matches typography styles
- [ ] Respects motion/animation patterns
- [ ] Follows accessibility guidelines

### Phase 8: Mockup to Component Validation

**Claude**: Let's validate your mockup matches the component spec:

**Mockup Analysis:**
```javascript
// If component was prototyped in mockup tool
const mockupAnalysis = {
  htmlStructure: '{{analyzed_structure}}',
  classesUsed: ['btn', 'btn-primary', 'card', 'card-elevated'],
  responsiveClasses: ['col-12', 'col-md-6', 'hidden', 'sm:block'],
  customStyles: '{{any_custom_css}}'
};

// Component tracking from mockup
const trackedUsage = window.getTrackedComponents().filter(
  c => c.name === '{{ComponentName}}'
);
```

### Phase 9: Pre-Build Validation

**Claude**: Before building, let me validate the component design:

```yaml
Component: {{ComponentName}}
Type: {{ComponentType}}

API Summary:
  Required Props: {{required_props}}
  Optional Props: {{optional_props}}
  Variants: {{variant_count}}
  
Usage Contexts:
  {{#each contexts}}
  - {{this.page}}: {{this.usage}}
  {{/each}}
  
Responsive Strategy:
  Mobile: {{mobile_layout}}
  Tablet: {{tablet_layout}}
  Desktop: {{desktop_layout}}
  
Reusability Score: {{score}}/10
  - Flexibility: {{flexibility}}
  - Consistency: {{consistency}}
  - Maintainability: {{maintainability}}
```

**Potential Issues Found:**
- ⚠️ Similar to existing Card component (70% overlap)
- ⚠️ Complex props API might be hard to use
- ✅ Good responsive strategy
- ✅ Follows design system

**Proceed with generation?**
- [ ] Yes, generate the component
- [ ] Refactor the existing Card instead
- [ ] Simplify the API first

## Component Quality Checklist

The generated component will include:

### 1. TypeScript Definitions
```typescript
// Full type safety
export interface ComponentProps { ... }
export type ComponentVariant = 'default' | 'compact' | ...;
export type ComponentSize = 'sm' | 'md' | 'lg';
```

### 2. Storybook Stories
```typescript
// Visual testing for all variants
export default {
  title: 'Components/{{ComponentName}}',
  component: {{ComponentName}},
};

export const AllVariants = () => (
  <div className="grid gap-4">
    {variants.map(variant => (
      <{{ComponentName}} key={variant} variant={variant} {...props} />
    ))}
  </div>
);
```

### 3. Unit Tests
```typescript
// Behavior testing
describe('{{ComponentName}}', () => {
  it('renders all variants correctly', () => { ... });
  it('handles responsive props', () => { ... });
  it('maintains accessibility', () => { ... });
});
```

### 4. Documentation
```markdown
## {{ComponentName}}

### Usage
```tsx
import { {{ComponentName}} } from '@/components/ui';

<{{ComponentName}}
  variant="compact"
  title="Example"
  image={{ src: '/image.jpg', alt: 'Description' }}
/>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| ... | ... | ... | ... |
```

## Success Metrics

The component should:
- ✅ Work in ALL specified contexts
- ✅ Handle ALL variations elegantly  
- ✅ Maintain layout integrity
- ✅ Follow design system strictly
- ✅ Be genuinely reusable
- ✅ Have clear, simple API
- ✅ Perform efficiently