# Wizard Creation Wizard 🧙‍♂️

## Purpose
An interactive wizard to help you create custom conversation flows for any purpose. This meta-wizard guides you through designing your own structured dialogues.

## The Wizard Creation Process

### Phase 1: Purpose & Goals

**Claude**: Welcome! I'll help you create a custom wizard for your project. Let's start by understanding what you want to achieve.

**What's the primary purpose of your wizard?**
- [ ] Gather requirements/information
- [ ] Guide through a setup process  
- [ ] Make decisions/recommendations
- [ ] Troubleshoot problems
- [ ] Teach/onboard users
- [ ] Other: ___________

**What should users have at the end?**
- [ ] A completed configuration/setup
- [ ] A document/plan/specification
- [ ] Generated code/files
- [ ] A decision/recommendation
- [ ] New knowledge/skills
- [ ] Other: ___________

### Phase 2: User Journey Design

**Claude**: Great! Now let's design the conversation flow. 

**How should the wizard feel?**
- **Formal**: Professional, structured, business-focused
- **Friendly**: Conversational, encouraging, supportive  
- **Technical**: Direct, efficient, assumes expertise
- **Educational**: Patient, explanatory, teaching-focused

**What's the ideal conversation length?**
- **Quick** (3-5 exchanges): Get to the point fast
- **Moderate** (6-10 exchanges): Balance depth and efficiency
- **Thorough** (10+ exchanges): Comprehensive exploration

### Phase 3: Question Architecture

**Claude**: Let's structure your wizard's questions. I'll help you create effective prompts.

**For each major section of your wizard, I need:**
1. **Section Goal**: What information/decision is needed?
2. **Question Type**: 
   - Multiple choice (clear options)
   - Open-ended (creative input)
   - Yes/No (quick decisions)
   - Scale/Rating (measure preferences)
   - File/Code review (analyze existing work)

**Example Section Structure:**
```markdown
### Section: Project Type Identification
Goal: Understand what they're building
Questions:
1. "What type of project are you creating?" [Multiple choice]
   - Web application
   - Mobile app  
   - API/Backend service
   - Library/Package
   - Other

2. "Describe your project in one sentence:" [Open-ended]
   
3. "Do you have existing code?" [Yes/No]
   - If Yes → "Can you share your package.json?" [File review]
   - If No → "What's your experience level?" [Scale 1-5]
```

### Phase 4: Logic & Branching

**Claude**: Now let's add intelligence to your wizard. How should it adapt based on answers?

**Branching Strategies:**
```yaml
conditional_paths:
  - trigger: "User selects 'Enterprise'"
    action: "Add security & compliance questions"
    
  - trigger: "User indicates beginner level"
    action: "Provide more explanations and examples"
    
  - trigger: "User has existing code"
    action: "Analyze first, then suggest improvements"

dynamic_adaptations:
  - Learn user's terminology and mirror it
  - Adjust technical depth based on responses
  - Skip sections if enough info gathered
  - Offer shortcuts for experienced users
```

### Phase 5: Output Generation

**Claude**: What should your wizard produce? Let's design the outputs.

**Output Types:**
- **Configuration Files** (JSON, YAML, .env)
- **Documentation** (README, guides, specs)
- **Code Scaffolding** (boilerplate, templates)
- **Scripts** (setup, deployment, migration)
- **Checklists** (tasks, requirements, next steps)
- **Visualizations** (diagrams, flowcharts)

**Output Template Example:**
```markdown
# [Project Name] Setup Guide

Based on our conversation, here's your customized setup:

## Configuration
```json
{
  "projectType": "[from answers]",
  "features": ["selected", "features"],
  "preferences": { ... }
}
```

## Next Steps
1. [Personalized action items]
2. [Based on their situation]

## Resources
- [Relevant to their choices]
```

### Phase 6: Wizard Template Generation

**Claude**: Perfect! Based on everything you've told me, here's your custom wizard:

```markdown
# [Your Wizard Name]

## Purpose
[Your stated purpose]

## Conversation Flow

### Introduction
"[Your custom greeting based on tone]"

### Phase 1: [Your First Section]
**Question 1**: "[Your question]"
- [Option 1]
- [Option 2]
[Branching logic]

### Phase 2: [Your Second Section]
[Continues based on your design]

## Output Templates
[Your customized outputs]

## Usage Instructions
1. Copy this wizard to your project
2. Have Claude read it when starting the relevant task
3. Say "Let's run the [Wizard Name]"
```

## Meta-Wizard Examples

### Example 1: API Design Wizard
```
Purpose: Design REST/GraphQL APIs
Output: OpenAPI spec + implementation plan
Flow: Resources → Operations → Auth → Deployment
```

### Example 2: Component Library Wizard
```
Purpose: Plan component library architecture  
Output: Component inventory + Storybook setup
Flow: Design system → Components → Documentation → Publishing
```

### Example 3: Database Schema Wizard
```
Purpose: Design optimal database structure
Output: SQL migrations + ORM models
Flow: Entities → Relationships → Indexes → Scaling
```

## Advanced Wizard Features

### Memory & Context
```yaml
remember_across_sections:
  - User's technical level
  - Project constraints
  - Terminology preferences
  - Previous decisions

reference_in_questions:
  - "Earlier you mentioned [X]..."
  - "Given your choice of [Y]..."
  - "To clarify about [Z]..."
```

### Validation & Error Handling
```yaml
validate_inputs:
  - Check for contradictions
  - Ensure required info gathered
  - Verify technical feasibility
  - Flag potential issues

graceful_recovery:
  - "I didn't quite understand..."
  - "Let's try a different approach..."
  - "Can you provide an example?"
```

### Wizard Testing
Before finalizing, test your wizard for:
- **Completeness**: All scenarios covered?
- **Clarity**: Questions unambiguous?
- **Flow**: Natural progression?
- **Outputs**: Useful and actionable?
- **Edge cases**: Handles unusual inputs?

## Quick Start Wizard Templates

### 1. Simple Linear Wizard
```markdown
1. Ask main question
2. Gather details
3. Confirm understanding
4. Generate output
```

### 2. Branching Decision Tree
```markdown
1. Initial classification
2. Branch A or Branch B based on answer
3. Specialized questions per branch
4. Converge for common elements
5. Generate branch-specific output
```

### 3. Iterative Refinement
```markdown
1. Get rough idea
2. Generate initial version
3. Show and get feedback
4. Refine based on feedback
5. Repeat until satisfied
```

---

Ready to create your custom wizard? Just say "Let's create a wizard for [your purpose]" and I'll guide you through it!