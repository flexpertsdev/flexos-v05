# FlexOS Mockup Priority List

## 🎯 Critical Path Pages (Must Have)
These pages form the core user journey from landing to successful app creation.

### 1. **Landing Page** (`index.html`)
- Hero with value prop
- Live chat demo that triggers wizard
- Feature highlights
- Social proof
- CTA to start building

### 2. **Project Wizard** (`wizard.html`)
- Conversational interface
- Progress indicator
- Real-time mockup preview panel
- Question/answer flow
- Account creation prompt

### 3. **Dashboard** (`dashboard.html`)
- Project grid/list
- Create new project button
- Recent activity
- Quick stats
- User menu

### 4. **Builder Interface** (`builder.html`)
- Two-panel layout (chat + workspace)
- Tab navigation (Vision, Design, Features, Pages, etc.)
- Preview panel
- Responsive preview controls
- Save/deploy actions

### 5. **Sign Up** (`signup.html`)
- Simple form (email + password)
- No email verification UI
- Social login options
- Terms checkbox
- Continue to dashboard

### 6. **Sign In** (`signin.html`)
- Email/password form
- Remember me
- Forgot password link
- Social login options
- Sign up CTA

## 🚀 Essential Feature Pages (High Priority)

### 7. **Preview Mode** (`preview.html`)
- Full-screen app preview
- Device frame options
- Navigation between mockups
- Share button
- Exit to builder

### 8. **Focus Mode** (`focus-mode.html`)
- Minimal chat interface
- Thought-partnership UI
- Note-taking area
- Export conversations
- Return to builder

### 9. **Output/Export** (`export.html`)
- Package contents preview
- Download options
- Documentation list
- Mockup thumbnails
- Builder instructions preview

### 10. **Project Settings** (`project-settings.html`)
- General settings
- Team/sharing
- Custom domain
- Integrations
- Danger zone

## 📱 Responsive Variations (Same Priority)
Each critical page needs these viewport versions:
- Mobile (320px, 375px, 390px)
- Tablet (768px, 834px)
- Desktop (1280px, 1440px, 1920px)

## 🎨 Component States to Include

### Global Components (in every mockup)
- **Header/Navigation**
  - Logged out state
  - Logged in state
  - Mobile menu
  
- **Modals**
  - Account creation
  - Confirmation dialogs
  - Error messages
  
- **Loading States**
  - Page loading
  - Content loading
  - Saving indicator

### Interactive Elements
- **Buttons**: Default, hover, active, disabled
- **Forms**: Empty, filled, error, success
- **Cards**: Default, hover, selected
- **Tabs**: Active, inactive
- **Toggles**: On/off states

## 🎭 User Flow Mockups

### Wizard Flow States
1. **wizard-start.html** - Initial greeting
2. **wizard-questions.html** - Mid-conversation
3. **wizard-mockup-generating.html** - AI working
4. **wizard-review.html** - Review generated mockups
5. **wizard-complete.html** - Success state

### Builder Flow States
1. **builder-empty.html** - New project
2. **builder-active.html** - With content
3. **builder-preview.html** - Preview mode active
4. **builder-deploying.html** - Deployment process

## 📐 Design System Documentation

### Style Guide Mockup (`style-guide.html`)
- Color palette (light/dark)
- Typography scale
- Spacing system
- Component library
- Animation examples

## 🎬 Demo Content Scenarios

### Example Projects (for mockups)
1. **Website Refresh** - "Update my existing website" example
2. **SaaS Dashboard** - B2B app example
3. **E-commerce Store** - Consumer app example  
4. **Blog/Content Site** - Content example
5. **Portfolio** - Creative example

Each mockup should show realistic content for these scenarios.

## 📋 Mockup Checklist

### For Each Page Mockup:
- [ ] Desktop version (1280px)
- [ ] Mobile version (375px)
- [ ] Dark mode variant
- [ ] Loading states
- [ ] Error states
- [ ] Empty states
- [ ] Success states
- [ ] Interactive hover states
- [ ] Focus indicators
- [ ] Accessibility considerations

### Technical Requirements:
- [ ] Uses design system tokens
- [ ] Component tracking attributes
- [ ] Responsive classes
- [ ] Interactive elements marked
- [ ] Navigation links connected
- [ ] Meta viewport tag
- [ ] Print stylesheet considered

## 🏗️ Build Order Recommendation

### Phase 1: Core Flow
1. Landing page
2. Sign up/Sign in
3. Dashboard
4. Wizard
5. Builder

### Phase 2: Features
6. Preview mode
7. Focus mode
8. Export page
9. Settings
10. Style guide

### Phase 3: States & Variations
- All responsive versions
- All component states
- All error/success states
- All empty states

## 💡 Mockup Best Practices

1. **Consistency**: Use same components across pages
2. **Realism**: Use actual content, not lorem ipsum
3. **Completeness**: Include all states and edges
4. **Responsiveness**: Test at all breakpoints
5. **Accessibility**: Ensure proper contrast and sizing
6. **Performance**: Keep mockups lightweight
7. **Documentation**: Comment complex interactions

## 🎯 Success Criteria

A complete mockup set includes:
- ✅ All critical path pages
- ✅ Mobile and desktop versions
- ✅ Light and dark themes
- ✅ All interactive states
- ✅ Linked navigation
- ✅ Design system compliance
- ✅ Component tracking
- ✅ Realistic content
- ✅ Accessibility compliance