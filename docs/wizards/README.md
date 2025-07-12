# 🧙 Interactive Scenarios (Wizards)

## What Are Scenarios?

Scenarios are **guided conversations** that help Claude extract detailed requirements from users through a structured dialogue. Think of them as interactive forms that adapt based on answers, ensuring we gather all necessary information BEFORE starting to build.

## Why Scenarios Matter

The biggest problem with AI-assisted development is **jumping into code too quickly**. Once Claude starts building, it's hard to course-correct without starting over. Scenarios solve this by:

- 📋 **Gathering complete requirements upfront**
- 🎯 **Identifying patterns and reusable components**
- 📱 **Ensuring mobile-first, responsive design**
- 🔄 **Preventing "going off the rails" during implementation**
- 🤝 **Making technical decisions accessible to non-technical users**

## Core Principles

### 1. One Question at a Time
```
❌ BAD: "Tell me about your project, tech stack, timeline, and budget"
✅ GOOD: "What type of project are you building?"
         → [Wait for answer]
         "What's your target audience?"
```

### 2. Human-Friendly Language
```
❌ BAD: "Define your component prop interface schema"
✅ GOOD: "Where will this component appear in your app?"
```

### 3. Show, Don't Tell
```
❌ BAD: "Describe your layout requirements"
✅ GOOD: "Here's what I understood:
         [Visual ASCII diagram]
         Is this correct?"
```

### 4. Progressive Disclosure
Start simple, get complex only when needed:
```
1. "Do you have mockups?" → Yes/No
2. [If Yes] "Can you share them?"
3. [Analyze] "I see these patterns..."
4. [If needed] "Let me clarify the mobile behavior..."
```

### 5. Always Validate Understanding
Before building anything:
```
"Let me confirm what we're building:
 - Page type: Dashboard
 - Layout: Sidebar + main content
 - Mobile: Collapsible sidebar
 - Components to reuse: UserCard, DataTable
 
Ready to proceed?"
```

## Available Scenarios

### 🎯 [Project Discovery Wizard](./project-discovery-wizard.md)
**Purpose**: Gather initial project requirements through conversational discovery  
**Use when**: Starting a brand new project  
**Output**: Complete project specification and documentation  
**Activation**: User says "start the wizard" or similar

### 🕵️‍♀️ [Workspace Wizard](./workspace-wizard.md)
**Purpose**: Smart pattern detection + brutal organization of workspace chaos  
**Use when**: Workspace is cluttered with ideas, screenshots, notes  
**Output**: Organized workspace and extracted actionable insights  
**Activation**: `@workspace-wizard` (with optional modes: detective, maid, update)

### 📄 [Page Generator Wizard](./page-generator-wizard.md)
**Purpose**: Create pages with correct layouts and responsive behavior  
**Use when**: Building new pages from mockups or specifications  
**Output**: Responsive, consistent page components with proper layouts  
**Key feature**: Prevents "going off the rails" during implementation

### 🧩 [Component Generator Wizard](./component-generator-wizard.md)
**Purpose**: Design truly reusable components that work across contexts  
**Use when**: Creating shared UI components  
**Output**: Flexible, well-documented components with variants  
**Key feature**: Ensures components handle all variations elegantly

### 🚀 [Feature Generator Wizard](./feature-generator-wizard.md)
**Purpose**: Transform feature ideas into complete implementations  
**Use when**: Adding new functionality (comments, uploads, search, etc.)  
**Output**: Full-stack feature with UI, API, database, tests, docs  
**Key feature**: Ensures nothing is missed in the implementation

### 🗄️ [Database Generator Wizard](./database-generator-wizard.md)
**Purpose**: Design complete database schemas from requirements  
**Use when**: Setting up database structure for your application  
**Output**: SQL schema, migrations, ORM models, TypeScript types  
**Key feature**: Translates non-technical needs into professional schemas

### 🎨 [Design System Generator Wizard](./design-system-generator-wizard.md)
**Purpose**: Create comprehensive, mobile-first design systems  
**Use when**: Establishing visual consistency for your app  
**Output**: Complete CSS framework with tokens, components, utilities  
**Key feature**: Translates high-level desires (e.g., "red WhatsApp") into complete systems

### 🔍 [Debug Wizard](./debug-wizard.md)
**Purpose**: Fix layout and responsive issues  
**Use when**: Things have "gone off the rails"  
**Output**: Working, responsive implementation

### 🪄 [Wizard Creation Wizard](./wizard-creation-wizard.md)
**Purpose**: Create custom wizards for specialized workflows  
**Use when**: Need a new guided conversation pattern  
**Output**: New wizard file following best practices

## How to Use Scenarios

### For Users

1. **Start the conversation**:
   ```
   "I need to create a new page"
   ```

2. **Claude activates the wizard**:
   ```
   "I'll help you create a page. Let me ask a few questions first..."
   ```

3. **Answer questions naturally**:
   - Short answers are fine
   - Say "I don't know" when unsure
   - Share files/mockups when asked

4. **Review and confirm**:
   - Claude summarizes understanding
   - You approve or correct
   - Only then does building begin

### For Claude

When a user request matches a scenario:

1. **Announce the wizard**:
   ```
   "I'll use the Page Generator Wizard to ensure we build this correctly."
   ```

2. **Follow the script**:
   - Ask questions in order
   - One question at a time
   - Adapt based on answers

3. **Validate before building**:
   - Show complete specification
   - Get explicit confirmation
   - Then generate code

## Creating New Scenarios

### Template Structure

```markdown
# [Scenario Name] Wizard

## Purpose
[What this wizard accomplishes]

## The [Process Name] Process

### Phase 1: [First Topic]
**Claude**: [Opening statement and context]

**[First Question]**
- [ ] Option 1
- [ ] Option 2
- [ ] Other: ___________

[Branching logic based on answer]

### Phase 2: [Second Topic]
[Continue pattern...]

### Pre-Build Validation
**Claude**: Based on our discussion, here's what I'll build:
[Complete specification]

**Ready to proceed?**
- [ ] Yes, this looks correct
- [ ] Let me adjust something
```

### Best Practices

1. **Start broad, get specific**
   - Project type → Features → Technical details

2. **Use visual aids**
   - ASCII diagrams for layouts
   - Code examples for patterns
   - Tables for comparisons

3. **Provide smart defaults**
   - Suggest common patterns
   - But allow customization

4. **Handle uncertainty**
   - "I don't know" is a valid answer
   - Provide guidance when users are unsure

5. **Keep context**
   - Reference previous answers
   - Build on what's already known

## Common Patterns

### Information Gathering
```
"What's your primary goal with this [feature]?"
→ Understand intent before implementation
```

### Option Presentation
```
"Based on your needs, I recommend:
Option A: [Simple solution] - Good for [use case]
Option B: [Complex solution] - Good for [use case]

Which fits better?"
```

### Incremental Refinement
```
"Here's a basic version:
[Show simple example]

Need any of these enhancements?
- [ ] Feature 1
- [ ] Feature 2
- [ ] Feature 3"
```

### Validation Loop
```
"I understood:
- Requirement 1: [details]
- Requirement 2: [details]

Correct? (yes/no/clarify)"
```

## Success Metrics

A good scenario:
- ✅ Prevents implementation restarts
- ✅ Captures all requirements upfront
- ✅ Produces consistent results
- ✅ Works for non-technical users
- ✅ Saves time overall

## Remember

> "The best code is the code you don't have to rewrite. Scenarios ensure we build it right the first time."

Scenarios are about **thinking before doing**. They force both the user and Claude to fully understand the requirements before any code is written. This upfront investment saves hours of debugging and refactoring later.