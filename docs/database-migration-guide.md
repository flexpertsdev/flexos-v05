# Database Migration Guide: From Complex to Simple

## Overview
This guide helps migrate from the current complex schema to the simplified schema that focuses on core functionality.

## Key Changes

### 1. **Simplified Tables Structure**
- **Pages**: Now includes description field directly
- **Mockups**: Separated from pages table for better performance
- **Features**: Simplified with basic fields only
- **Journeys**: Simple structure with JSON steps
- **Design System**: Single record per project with JSON fields
- **Project Schema**: Versioned database models
- **Workspace Items**: Replaces complex attachments table

### 2. **Removed Complexity**
- No more deeply nested JSON fields
- Removed complex relationship tracking
- Simplified status fields
- Removed wizard-specific tables (can be tracked in chat context)

## Migration Steps

### Step 1: Backup Current Database
```bash
pg_dump -h [host] -U [user] -d [database] > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Step 2: Create New Tables
Run the SQL in `database-schema-simplified.sql`

### Step 3: Migrate Data

```sql
-- Migrate Projects (keep core fields only)
INSERT INTO projects (id, user_id, name, slug, description, type, status, created_at, updated_at)
SELECT id, user_id, name, slug, description, type, status, created_at, updated_at
FROM old_projects;

-- Migrate Pages (with description from meta)
INSERT INTO pages (id, project_id, name, path, description, type, status, parent_id, sort_order, created_at, updated_at)
SELECT 
  id, 
  project_id, 
  name, 
  path,
  COALESCE(meta->>'description', NULL) as description,
  type,
  COALESCE(meta->>'status', 'draft') as status,
  parent_id,
  order_index as sort_order,
  created_at,
  updated_at
FROM old_pages;

-- Create mockups from page content
INSERT INTO mockups (page_id, version, html_content, css_content, is_current, created_by)
SELECT 
  id as page_id,
  1 as version,
  COALESCE(content->>'vueTemplate', content->>'template', '<div>Empty</div>') as html_content,
  content->>'styles' as css_content,
  true as is_current,
  'migration' as created_by
FROM old_pages
WHERE content IS NOT NULL;

-- Migrate Features (simplified)
INSERT INTO features (id, project_id, name, description, category, status, priority, created_at, updated_at)
SELECT 
  id, 
  project_id, 
  name, 
  description, 
  category,
  status,
  priority,
  created_at,
  updated_at
FROM old_features;

-- Migrate Journeys
INSERT INTO journeys (id, project_id, name, description, persona, steps, created_at, updated_at)
SELECT 
  id, 
  project_id, 
  name, 
  description,
  persona,
  COALESCE(steps, '[]'::jsonb),
  created_at,
  updated_at
FROM old_journeys;

-- Migrate Workspace Items from attachments
INSERT INTO workspace_items (id, project_id, user_id, name, type, original_name, mime_type, size_bytes, storage_path, ai_analysis, created_at)
SELECT 
  id,
  project_id,
  user_id,
  name,
  attachment_type as type,
  original_name,
  mime_type,
  size_bytes,
  storage_path,
  COALESCE(metadata, '{}'::jsonb) as ai_analysis,
  created_at
FROM attachments
WHERE processing_status = 'completed';

-- Create chat sessions from ai_chats
INSERT INTO chat_sessions (id, project_id, user_id, title, status, created_at, updated_at)
SELECT 
  id,
  project_id,
  user_id,
  title,
  status,
  created_at,
  updated_at
FROM ai_chats;

-- Migrate chat messages (simplified)
INSERT INTO chat_messages (id, session_id, role, content, message_type, metadata, created_at)
SELECT 
  id,
  chat_id as session_id,
  role,
  COALESCE(content, '') as content,
  message_type,
  COALESCE(message_data, '{}'::jsonb) as metadata,
  created_at
FROM chat_messages;
```

### Step 4: Update Application Code

1. Update type imports:
```typescript
// Old
import type { Database } from '~/types/database'

// New
import type { Database } from '~/types/database-simplified'
```

2. Update component queries to use new structure
3. Remove references to removed tables

### Step 5: Test Everything
1. Test all CRUD operations
2. Verify chat functionality
3. Check that pages load with mockups
4. Ensure features and journeys display correctly

## Benefits of Simplified Schema

1. **Performance**: Mockups in separate table prevents large content from slowing queries
2. **Clarity**: Each table has a clear, single purpose
3. **Maintainability**: Less complex relationships to manage
4. **Flexibility**: JSON fields where truly needed, structured data elsewhere
5. **AI-Friendly**: Clear structure makes it easier for AI to understand and modify

## Rollback Plan

If issues arise:
```bash
# Restore from backup
psql -h [host] -U [user] -d [database] < backup_[timestamp].sql
```

## Next Steps

1. Run migration in development first
2. Test thoroughly
3. Update all TypeScript types
4. Migrate staging environment
5. Schedule production migration during low-traffic period
