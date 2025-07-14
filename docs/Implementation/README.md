# FlexOS Implementation Guide

## Overview

FlexOS is a visual-first, AI-powered application builder that transforms ideas into fully-specified, production-ready applications through natural conversation and visual manipulation. This guide details the complete implementation architecture for developers and AI systems building FlexOS.

## Documentation Structure

This implementation guide consists of 8 detailed documentation files:

1. **[1-context-storage-and-management.md](./1-context-storage-and-management.md)** - Hierarchical context system from immediate UI interactions to project vision
2. **[2-project-database-schema.md](./2-project-database-schema.md)** - PostgreSQL schema supporting iterative, visual-first development  
3. **[3-export-schema.md](./3-export-schema.md)** - Comprehensive AI-executable export format for application generation
4. **[4-user-submitted-context.md](./4-user-submitted-context.md)** - "Context soup" management for inspiration and reference materials
5. **[5-visual-vueflow-overview.md](./5-visual-vueflow-overview.md)** - Multiple visual perspectives of the project structure
6. **[6-wizards.md](./6-wizards.md)** - Focused, conversational interfaces for creating specific elements
7. **[7-core-builder-mode.md](./7-core-builder-mode.md)** - Primary two-panel interface for everyday building
8. **[8-chat-mode-differences.md](./8-chat-mode-differences.md)** - Three distinct chat modes optimized for different phases

## System Components

### 1. Context Storage and Management

**File**: `1-context-storage-and-management.md`

**Purpose**: Maintains hierarchical context from immediate UI state to project vision, ensuring AI responses are always grounded in the user's actual project.

**What You'll Find**:
- Context hierarchy definitions (Immediate → Local → Project → Vision)
- TypeScript interfaces for each context level
- API request context assembly (lines 168-266)
- Context lifecycle management (lines 268-353)
- UX selection and update patterns (lines 85-163)
- Context usage examples for design decisions and business logic (lines 356-399)

**Key Code Examples**:
- `ImmediateContext` interface (lines 16-32)
- `ContextAssembler.buildRequestContext()` (lines 169-211)
- `FlexOSAPIRequest` interface (lines 217-266)
- Context capture methods (lines 139-152)

### 2. Project Database Schema

**File**: `2-project-database-schema.md`

**Purpose**: PostgreSQL schema designed for iterative, visual-first development with full relationship tracking.

**What You'll Find**:
- Complete SQL schema definitions
- Core tables: users, projects, design_systems, pages, mockups, features
- Journey flows and VueFlow state storage (lines 261-346)
- Inferred entities and data model (lines 348-425)
- Wizard runs and AI thinking chain (lines 427-536)
- User context items storage (lines 499-536)
- Performance indexes and constraints (lines 541-568)
- Usage pattern examples (lines 573-625)

**Key Tables**:
- `projects` - Base project info and vision (lines 28-57)
- `design_systems` - Emergent design tokens (lines 61-106)
- `pages` & `mockups` - Screen definitions with versions (lines 110-211)
- `features` - User-described functionality (lines 215-258)
- `journey_flows` & `flow_nodes` - Visual flow storage (lines 263-344)
- `inferred_entities` - Detected data model (lines 350-424)

### 3. Export Schema

**File**: `3-export-schema.md`

**Purpose**: Generates comprehensive, AI-executable packages containing all specifications, mockups, and documentation needed to build the application.

**What You'll Find**:
- Complete export directory structure (lines 10-79)
- Project manifest format (lines 84-121)
- Page specification examples (Markdown + JSON) (lines 125-311)
- Design system export format (lines 315-447)
- AI implementation instructions template (lines 452-569)
- Mockup browser implementation (lines 571-759)
- Export generation process (lines 763-851)
- Validation system (lines 855-891)
- Multiple export format options (lines 895-909)

**Key Exports**:
- `flexos.project.json` - Main manifest
- Page specs with responsive layouts and data requirements
- Design tokens with confidence scores
- Step-by-step AI implementation guide
- Interactive mockup browser

### 4. User Submitted Context

**File**: `4-user-submitted-context.md`

**Purpose**: Manages the "soup" of inspiration materials users provide - screenshots, URLs, text snippets, and files.

**What You'll Find**:
- Screenshot context storage and AI analysis (lines 12-75)
- URL context fetching and analysis (lines 79-143)
- Text/note context with tone analysis (lines 147-187)
- File context parsing (PDF, Sketch, Figma) (lines 191-246)
- Automatic categorization system (lines 251-298)
- Context retrieval strategies (lines 302-335)
- Context soup UI implementation (lines 339-463)
- Recall strategies (explicit, implicit, temporal) (lines 467-525)
- Context lifecycle management (lines 529-645)
- Influence tracking system (lines 649-683)

**Key Features**:
- AI analysis of visual elements, colors, layouts
- Semantic categorization and relevance scoring
- Multiple retrieval strategies
- Full influence tracking on final design

### 5. Visual VueFlow Overview

**File**: `5-visual-vueflow-overview.md`

**Purpose**: Multiple visual perspectives using VueFlow for manipulating application structure.

**What You'll Find**:
- Journey flow view implementation (lines 15-131)
- Screen grid view (Figma-style) (lines 135-260)
- Feature/database relationship view (lines 264-323)
- Custom node components (Screen, Decision, Database) (lines 327-491)
- Interaction handlers for visual editing (lines 495-577)
- AI-assisted flow editing (lines 581-666)
- View filtering and synchronization (lines 670-745)
- Export options (lines 749-771)
- Performance optimizations (lines 775-833)

**Key Components**:
- `ScreenNode` with device frames and CRUD badges
- `DecisionNode` with branching logic
- Connection drawing and navigation
- AI flow optimization

### 6. Wizards

**File**: `6-wizards.md`

**Purpose**: Focused conversational interfaces that guide users through creating specific elements step-by-step.

**What You'll Find**:
- Core wizard architecture (lines 13-56)
- Wizard types enumeration (lines 60-87)
- Split panel UI implementation (lines 91-178)
- Rich input components (color, layout selectors) (lines 182-269)
- Database schema for wizard runs (lines 273-399)
- Wizard trigger mechanisms (lines 403-523)
- Conversation management system (lines 527-619)
- Output specifications by wizard type (lines 623-706)
- Complete wizard examples (Page Creator, Feature Builder) (lines 710-920)
- Success metrics and quality tracking (lines 954-1031)
- Best practices and error recovery (lines 1035-1154)

**Key Wizards**:
- Page Creator with 5 milestones
- Feature Builder with user flow mapping
- Design System Creator with visual tools

### 7. Core Builder Mode

**File**: `7-core-builder-mode.md`

**Purpose**: Primary interface for everyday building with intelligent chat on left, multi-tabbed content viewer on right.

**What You'll Find**:
- Overall layout structure (lines 13-59)
- Builder chat implementation (lines 64-197)
- Content viewer with tabs (lines 202-498)
- Context capture system (lines 504-579)
- Attachment management (lines 583-672)
- Tab state management (lines 676-727)
- Smart tab badges system (lines 731-775)
- Visual connection indicators (lines 779-934)
- Real-time suggestion engine (lines 938-1018)
- Smart action chips UI (lines 1022-1076)
- Performance optimizations (lines 1080-1171)
- Integration with other modes (lines 1175-1240)
- Keyboard shortcuts (lines 1244-1298)

**Key Features**:
- Point-and-click context capture
- Dynamic suggestions based on context
- Cross-tab element connections
- Predictive action system

### 8. Chat Mode Differences

**File**: `8-chat-mode-differences.md`

**Purpose**: Three distinct chat modes optimized for different phases of development.

**What You'll Find**:
- Vision/Focus Chat implementation (lines 10-209)
  - Full-screen UI (lines 16-102)
  - Enthusiastic AI prompt (lines 107-141)
  - Hidden question queue system
  - Natural conversation examples
- Wizard Chat implementation (lines 211-432)
  - Split panel with live preview (lines 218-317)
  - Guided AI prompt (lines 322-352)
  - Rich input handling
  - Milestone-based flow
- Builder Chat implementation (lines 434-628)
  - Minimal embedded UI (lines 438-536)
  - Direct action-oriented AI prompt (lines 541-586)
  - Full context awareness
  - Command-like processing
- Comparison tables (lines 632-689)
  - Conversation style differences
  - UI/UX differences
  - Context management approaches
- Mode transition handling (lines 742-803)
- Performance settings by mode (lines 830-857)

**Key Differences**:
- Vision: Exploratory, enthusiastic, minimal context
- Wizard: Guided, educational, focused context
- Builder: Direct, efficient, full context

## Implementation Best Practices

### For AI Systems Implementing FlexOS

1. **Start with Context**: Always read `1-context-storage-and-management.md` first to understand how context flows through the system

2. **Database First**: Set up the schema from `2-project-database-schema.md` before implementing features

3. **Follow UI Patterns**: Each mode has specific UI requirements - don't mix Vision Chat's expansive style with Builder Chat's efficiency

4. **Use Provided Examples**: Each file contains working code examples - use them as templates

5. **Respect Mode Boundaries**: The three chat modes serve different purposes - maintain their distinct personalities

6. **Test Export Format**: Validate against `3-export-schema.md` to ensure generated apps can be built

7. **Handle Context Soup**: User-submitted context needs the full pipeline from `4-user-submitted-context.md`

8. **Implement Visual First**: The VueFlow system is core to the experience - not an add-on

## Key Integration Points

### Context Flow
```
User Action → Immediate Context → API Request Assembly → AI Response → UI Update
```

### Mode Transitions
```
Vision Chat → Project Scaffold → Builder Mode ↔ Wizards → Export
```

### Data Flow
```
Mockups → Pattern Extraction → Design System → Component Generation
```

### Visual Connections
```
Pages ↔ Features ↔ Entities ↔ User Journeys
```

## Performance Considerations

- **Lazy Loading**: Tabs load on demand (see `7-core-builder-mode.md` lines 1080-1127)
- **Context Limits**: Keep under 4000 tokens (see `1-context-storage-and-management.md` line 189)
- **Virtual Rendering**: Large flows use virtualization (see `5-visual-vueflow-overview.md` lines 779-804)
- **Caching Strategy**: TTL-based with predictive loading (see `7-core-builder-mode.md` lines 1131-1171)

## Where to Start

1. **For Frontend**: Start with `7-core-builder-mode.md` and `8-chat-mode-differences.md`
2. **For Backend**: Start with `2-project-database-schema.md` and `1-context-storage-and-management.md`
3. **For AI Integration**: Start with `3-export-schema.md` and `6-wizards.md`
4. **For Visual Tools**: Start with `5-visual-vueflow-overview.md`

This implementation creates a revolutionary building experience where users can naturally express ideas and see them transformed into real applications through the synergy of conversational AI and visual manipulation.