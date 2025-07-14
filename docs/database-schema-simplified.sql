-- Simplified FlexOS Database Schema
-- All tables linked to projects with clear separation of concerns

-- =====================================================
-- CORE TABLES
-- =====================================================

-- Users (already exists, keep as is)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE,
  full_name VARCHAR(255),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects (simplified)
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  type VARCHAR(50) DEFAULT 'web-app', -- web-app, mobile-app, etc
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- PROJECT CONTENT TABLES
-- =====================================================

-- Vision (project goals and vision)
CREATE TABLE project_vision (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  vision_statement TEXT,
  target_audience TEXT,
  key_features TEXT[],
  success_metrics TEXT[],
  inspiration_apps TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id)
);

-- Pages (simplified)
CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  path VARCHAR(500) NOT NULL, -- /home, /dashboard, etc
  description TEXT,
  type VARCHAR(50) DEFAULT 'page', -- page, layout, modal
  status VARCHAR(50) DEFAULT 'draft', -- draft, designed, built
  parent_id UUID REFERENCES pages(id),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, path)
);

-- Mockups (separate table for large HTML/CSS content)
CREATE TABLE mockups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
  version INTEGER NOT NULL DEFAULT 1,
  html_content TEXT NOT NULL,
  css_content TEXT,
  javascript_content TEXT,
  description TEXT,
  is_current BOOLEAN DEFAULT TRUE,
  created_by VARCHAR(50) DEFAULT 'user', -- user, ai, wizard
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(page_id, version)
);

-- Features
CREATE TABLE features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100), -- auth, payments, social, etc
  status VARCHAR(50) DEFAULT 'planned', -- planned, building, completed
  priority VARCHAR(50) DEFAULT 'medium', -- low, medium, high
  requirements TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Journeys (user flows)
CREATE TABLE journeys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  persona VARCHAR(100), -- visitor, user, admin
  entry_point VARCHAR(255), -- where journey starts
  goal VARCHAR(255), -- what user wants to achieve
  steps JSONB DEFAULT '[]', -- array of steps with page references
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Design System
CREATE TABLE design_system (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  colors JSONB DEFAULT '{}', -- primary, secondary, etc with hex values
  typography JSONB DEFAULT '{}', -- fonts, sizes, weights
  spacing JSONB DEFAULT '{}', -- spacing scale
  components JSONB DEFAULT '{}', -- button styles, card styles, etc
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id)
);

-- Database Schema
CREATE TABLE project_schema (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  models JSONB DEFAULT '{}', -- data models and relationships
  version INTEGER DEFAULT 1,
  is_current BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workspace (user uploads and attachments)
CREATE TABLE workspace_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL, -- image, document, url, text
  original_name VARCHAR(255),
  mime_type VARCHAR(100),
  size_bytes INTEGER,
  storage_path TEXT, -- S3 or local path
  content_text TEXT, -- for text/url items or extracted text
  ai_analysis JSONB DEFAULT '{}', -- AI's understanding of the item
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CHAT AND AI INTERACTION
-- =====================================================

-- Chat Sessions
CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  title VARCHAR(255),
  context_mode VARCHAR(50) DEFAULT 'general', -- general, page, feature, design
  context_id UUID, -- reference to page_id, feature_id, etc
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat Messages
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL, -- user, assistant, system
  content TEXT NOT NULL,
  message_type VARCHAR(50) DEFAULT 'text', -- text, code, design, action
  metadata JSONB DEFAULT '{}', -- any additional data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Actions (track what AI created/modified)
CREATE TABLE ai_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID REFERENCES chat_messages(id),
  action_type VARCHAR(50) NOT NULL, -- created_page, updated_feature, etc
  entity_type VARCHAR(50) NOT NULL, -- page, feature, mockup, etc
  entity_id UUID NOT NULL,
  changes JSONB DEFAULT '{}', -- what was changed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_pages_project_id ON pages(project_id);
CREATE INDEX idx_mockups_page_id ON mockups(page_id);
CREATE INDEX idx_features_project_id ON features(project_id);
CREATE INDEX idx_journeys_project_id ON journeys(project_id);
CREATE INDEX idx_workspace_project_id ON workspace_items(project_id);
CREATE INDEX idx_chat_sessions_project_id ON chat_sessions(project_id);
CREATE INDEX idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX idx_ai_actions_entity ON ai_actions(entity_type, entity_id);

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to get current mockup for a page
CREATE OR REPLACE FUNCTION get_current_mockup(page_id UUID)
RETURNS TABLE (
  id UUID,
  html_content TEXT,
  css_content TEXT,
  javascript_content TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT m.id, m.html_content, m.css_content, m.javascript_content
  FROM mockups m
  WHERE m.page_id = get_current_mockup.page_id
    AND m.is_current = TRUE
  ORDER BY m.version DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Function to archive old mockups when creating new one
CREATE OR REPLACE FUNCTION archive_old_mockups()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_current = TRUE THEN
    UPDATE mockups
    SET is_current = FALSE
    WHERE page_id = NEW.page_id
      AND id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER archive_mockups_trigger
AFTER INSERT OR UPDATE ON mockups
FOR EACH ROW
EXECUTE FUNCTION archive_old_mockups();
