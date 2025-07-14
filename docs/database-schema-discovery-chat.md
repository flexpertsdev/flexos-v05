# Discovery Chat Database Schema Documentation

## Overview

This document describes the database schema changes implemented for the FlexOS Discovery Chat system. The schema supports a context-aware AI chat system with three distinct modes (Focus, Builder, Wizard), rich message types, file attachments, and visual project mapping.

## Schema Architecture

### Core Principles

1. **Message Independence**: Each message is self-contained with explicit context
2. **Rich Content Support**: Messages can be text, thinking displays, selections, comparisons, etc.
3. **Streaming Support**: Real-time AI responses with incremental updates
4. **Context Awareness**: Multiple context types can be attached to messages
5. **Entity Creation**: AI can create actual database entities (features, pages, components)

## Table Descriptions

### 1. ai_chats (Modified)
Main conversation container that groups related messages.

**Key Changes:**
- Removed `messages` JSONB column (migrated to individual `chat_messages`)
- Added `title` for conversation naming
- Added `status` (active/archived)
- Added `model` to track AI model used
- Added `total_messages` counter

### 2. chat_messages (New)
Individual messages with rich content and context support.

**Key Features:**
- `role`: user, assistant, or system
- `context_mode`: Determines behavior (focus/builder/wizard)
- `message_type`: Support for various rich content types
- `contexts`: Array of attached context objects
- `created_entities`: Tracks entities created by this message
- `suggested_actions`: Interactive buttons/suggestions
- Streaming support with `is_streaming`, `stream_id`, `stream_completed`

### 3. message_outputs (New)
Tracks entities created by AI messages.

**Purpose:**
- Links AI messages to created database entities
- Maintains audit trail of AI-generated content
- Stores snapshot of created data

### 4. message_actions (New)
Interactive elements suggested by AI.

**Features:**
- Action types: button, suggestion, quick_reply
- Tracks usage with `was_used` and `used_at`
- Supports confirmation requirements
- Customizable styling

### 5. wizard_sessions (New)
Manages guided wizard experiences.

**Key Fields:**
- Progress tracking with steps
- Collected data storage
- Session expiration
- Status management

### 6. attachments (New)
File and context attachments for messages.

**Attachment Types:**
- `file`: Generic file uploads
- `image`: Screenshots, designs
- `document`: PDFs, docs
- `url`: External links
- `project_context`: Reference to project entities
- `selection`: UI element selections
- `component_reference`: Existing component references

**Features:**
- Async processing with status tracking
- AI-parsed content extraction
- Metadata storage

### 7. project_flows (New)
Visual project structure for Map mode.

**Structure:**
- VueFlow-compatible nodes and edges
- Viewport state persistence
- Layout algorithms support
- Version tracking

### 8. flow_node_templates (New)
Predefined node types for consistent visualization.

**Default Templates:**
- Page Node (green)
- Feature Node (blue)
- Component Node (purple)
- Journey Node (orange)
- API Endpoint (red)
- Database Table (emerald)

### 9. builder_states (New)
Persists UI state per user/project.

**Stores:**
- Current mode (builder/focus/map)
- Panel sizes and positions
- Mode-specific preferences
- Last activity tracking

## Context System

Messages can have multiple context types attached:

```typescript
interface Context {
  type: 'selection' | 'location' | 'attachment' | 'wizard' | 'reference'
  data: Record<string, any>
  metadata?: {
    source: string
    timestamp: string
    confidence?: number
  }
}
```

### Context Types

1. **Selection Context**: User-selected UI elements
2. **Location Context**: Current view/page in the application
3. **Attachment Context**: Uploaded files or URLs
4. **Wizard Context**: Active wizard session state
5. **Reference Context**: Explicit entity references

## Security

### Row Level Security (RLS)
All tables have RLS enabled with policies ensuring:
- Users can only access their own data
- Project collaborators have appropriate access
- System templates are admin-only

### Key Policies
- Users can view messages in their projects
- Only project owners/editors can create entities
- Attachment access follows project permissions
- Builder states are user-specific

## Performance Optimizations

### Indexes
Strategic indexes on:
- Foreign keys for fast joins
- Timestamp columns for sorting
- Status/type fields for filtering
- Composite indexes for common queries

### Triggers
- Automatic `updated_at` timestamps
- Message count maintenance
- Activity tracking

## Migration Strategy

### From Old to New Schema
1. Existing `ai_chats.messages` JSON arrays are migrated to individual `chat_messages` rows
2. Message counts are calculated and stored
3. Default context mode is set to 'builder' for historical messages
4. Original timestamps are preserved

### Rollback Plan
The migration creates a temporary backup table before modifying the schema, allowing for safe rollback if needed.

## Usage Examples

### Creating a Message with Context
```sql
INSERT INTO chat_messages (
  chat_id, project_id, user_id,
  role, content, context_mode,
  contexts
) VALUES (
  $1, $2, $3,
  'user', 'Create a login page', 'builder',
  '[{
    "type": "location",
    "data": {
      "currentView": "dashboard",
      "activeProject": "...",
      "activePage": "..."
    }
  }]'::jsonb
);
```

### Creating an Attachment
```sql
INSERT INTO attachments (
  project_id, user_id, message_id,
  attachment_type, name, mime_type,
  storage_path
) VALUES (
  $1, $2, $3,
  'image', 'mockup.png', 'image/png',
  'projects/{project_id}/attachments/{attachment_id}'
);
```

### Tracking Entity Creation
```sql
INSERT INTO message_outputs (
  message_id, output_type, entity_id,
  entity_table, entity_data
) VALUES (
  $1, 'feature', $2,
  'features', '{"name": "Authentication", ...}'::jsonb
);
```

## Best Practices

1. **Always include context** when creating messages
2. **Use appropriate message types** for rich content
3. **Track entity creation** through message_outputs
4. **Process attachments asynchronously** to avoid blocking
5. **Maintain builder state** for consistent UX
6. **Version project flows** for history
7. **Clean up expired wizard sessions** regularly

## Future Considerations

1. **Message Threading**: Optional parent_message_id for threaded conversations
2. **Attachment Thumbnails**: Generated previews for images
3. **Flow Templates**: Shareable project structure templates
4. **Context Templates**: Reusable context configurations
5. **Message Search**: Full-text search with context awareness