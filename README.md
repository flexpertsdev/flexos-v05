# FlexOS v0.5 - AI-Powered App Builder

## 🚀 Quick Start with Claude Code

### 1. Install Dependencies
```bash
cd /Users/jos/Developer/Projects/flexos-v0.5
npm install
```

### 2. Set Up Environment
```bash
cp .env.example .env
# Edit .env with your Supabase and OpenAI credentials
```

### 3. Start Building Pages

The project follows a **"Ship First, Perfect Later"** philosophy. We convert mockups to Vue pages one by one.

#### Available Mockups:
- `flexos-landing-page.html` → Landing page
- `flexos-wizard-responsive.html` → Project wizard

#### Build your first page:
```bash
# Build the landing page
npm run build:page landing

# Build the wizard page  
npm run build:page wizard
```

### 4. Start Development Server
```bash
npm run dev
```

Visit http://localhost:3000 to see your app!

### 5. View Mockups (in another terminal)
```bash
npm run mockups
```

Visit http://localhost:3001 to see the original mockups for reference.

## 📁 Project Structure

```
flexos-v0.5/
├── Mockups/                    # HTML mockups (source of truth)
├── docs/                       # All documentation
│   └── wizards/               # Wizard system docs
├── src/                       # Nuxt 3 application
│   ├── pages/                 # Vue pages (built from mockups)
│   ├── components/            # Reusable components
│   ├── layouts/               # Page layouts
│   ├── composables/           # Vue composables
│   └── assets/css/            # Styles
├── scripts/                   # Build tools
│   └── build-page.js         # Mockup → Vue converter
└── package.json              # Dependencies
```

## 🛠️ Development Workflow

### Phase 1: Static Pages (Current)
1. Run `npm run build:page [name]` for each mockup
2. Pages are created as simple Vue components
3. Focus on pixel-perfect visual match

### Phase 2: Add Interactivity
1. Add Supabase authentication
2. Wire up forms and buttons
3. Add basic state management

### Phase 3: Implement Wizards
1. Build the wizard system
2. Add conversational UI
3. Connect to AI

### Phase 4: Polish
1. Add real AI integration
2. Performance optimization
3. Deploy to production

## 💡 Using Claude Code

When working with Claude Code, follow these patterns:

### Converting a Mockup
```
I need to convert the landing page mockup to a Vue component.
The mockup is at: Mockups/flexos-landing-page.html
Output should be: src/pages/index.vue
Keep it pixel-perfect, use Tailwind classes directly.
```

### Adding Interactivity
```
Add click handlers to the navigation menu in src/pages/index.vue
Use Vue 3 script setup syntax
Keep it simple - just console.log for now
```

### Creating Components
```
Extract the header from src/pages/index.vue into a component
Create: src/components/AppHeader.vue
Make it reusable across all pages
```

## 🎯 Current Status

- [x] Project structure created
- [x] Nuxt 3 configured
- [x] Build tools ready
- [ ] Landing page built
- [ ] Wizard page built
- [ ] Authentication added
- [ ] Database connected
- [ ] Wizards implemented
- [ ] AI integrated

## 📚 Resources

- [Project Vision](docs/flexos-vision.md)
- [Features List](docs/flexos-features.md) 
- [Tech Stack](docs/flexos-tech-stack.md)
- [Wizard System](docs/wizards/README.md)
- [Master README](docs/flexos-master-readme.md)

---

**Remember**: Ship first, perfect later! 🚀
