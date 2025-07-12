# FlexOS Technical Architecture

## Tech Stack

### Frontend
- **Framework**: Nuxt 3 (Vue 3)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + CSS Variables
- **State Management**: Pinia
- **UI Components**: Custom component library
- **Animations**: CSS animations + Framer Motion
- **Icons**: Lucide Icons
- **Forms**: VeeValidate + Zod
- **Real-time**: WebSockets (Socket.io)

### Backend
- **Framework**: Nuxt Nitro (Server routes)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **Real-time**: Supabase Realtime
- **Queue**: BullMQ (Redis)
- **Email**: Resend
- **Payments**: Stripe

### AI/ML
- **LLM**: OpenAI GPT-4
- **Embeddings**: OpenAI Embeddings
- **Vector DB**: Supabase pgvector
- **Code Generation**: Custom templates
- **Image Generation**: DALL-E 3

### Infrastructure
- **Hosting**: Vercel
- **CDN**: Vercel Edge Network
- **Database**: Supabase Cloud
- **Redis**: Upstash
- **Monitoring**: Sentry
- **Analytics**: PostHog
- **DNS**: Cloudflare

### Development
- **Package Manager**: pnpm
- **Build Tool**: Vite
- **Testing**: Vitest + Playwright
- **Linting**: ESLint + Prettier
- **Git Hooks**: Husky + lint-staged
- **CI/CD**: GitHub Actions

## File Tree Structure

```
flexos/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
├── assets/
│   ├── css/
│   │   ├── main.css
│   │   └── themes/
│   │       ├── dark.css
│   │       └── light.css
│   └── images/
│       └── logo.svg
├── components/
│   ├── app/
│   │   ├── AppHeader.vue
│   │   ├── AppSidebar.vue
│   │   └── AppFooter.vue
│   ├── builder/
│   │   ├── BuilderChat.vue
│   │   ├── BuilderWorkspace.vue
│   │   ├── BuilderPreview.vue
│   │   └── BuilderTabs/
│   │       ├── TabVision.vue
│   │       ├── TabDesign.vue
│   │       ├── TabFeatures.vue
│   │       ├── TabPages.vue
│   │       ├── TabJourneys.vue
│   │       └── TabDatabase.vue
│   ├── chat/
│   │   ├── ChatMessage.vue
│   │   ├── ChatInput.vue
│   │   ├── ChatTyping.vue
│   │   └── ChatSuggestions.vue
│   ├── common/
│   │   ├── BaseButton.vue
│   │   ├── BaseInput.vue
│   │   ├── BaseCard.vue
│   │   ├── BaseModal.vue
│   │   └── BaseToast.vue
│   └── landing/
│       ├── LandingHero.vue
│       ├── LandingFeatures.vue
│       └── LandingChatDemo.vue
├── composables/
│   ├── useAuth.ts
│   ├── useChat.ts
│   ├── useProject.ts
│   ├── useBuilder.ts
│   ├── useAI.ts
│   ├── useResponsive.ts
│   ├── useTheme.ts
│   └── useRealtime.ts
├── layouts/
│   ├── default.vue
│   ├── app.vue
│   ├── auth.vue
│   └── focus.vue
├── middleware/
│   ├── auth.ts
│   ├── guest.ts
│   └── subscription.ts
├── pages/
│   ├── index.vue
│   ├── about.vue
│   ├── pricing.vue
│   ├── app/
│   │   ├── dashboard.vue
│   │   ├── wizard.vue
│   │   └── project/
│   │       └── [id].vue
│   ├── auth/
│   │   ├── signin.vue
│   │   ├── signup.vue
│   │   └── forgot-password.vue
│   └── account/
│       ├── profile.vue
│       └── billing.vue
├── plugins/
│   ├── supabase.client.ts
│   ├── vue-toastification.ts
│   └── error-handler.ts
├── public/
│   ├── favicon.ico
│   └── robots.txt
├── server/
│   ├── api/
│   │   ├── auth/
│   │   ├── projects/
│   │   ├── ai/
│   │   └── webhooks/
│   ├── middleware/
│   │   └── cors.ts
│   └── utils/
│       ├── auth.ts
│       ├── db.ts
│       └── ai.ts
├── stores/
│   ├── auth.ts
│   ├── project.ts
│   ├── builder.ts
│   ├── chat.ts
│   └── ui.ts
├── types/
│   ├── api.ts
│   ├── database.ts
│   ├── project.ts
│   └── chat.ts
├── utils/
│   ├── constants.ts
│   ├── helpers.ts
│   └── validators.ts
├── .env.example
├── .eslintrc.json
├── .prettierrc
├── nuxt.config.ts
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

## Wizard System Architecture

### Wizard Engine
```typescript
// Core wizard system that powers conversational development
export interface WizardSystem {
  wizards: {
    'project-discovery': ProjectDiscoveryWizard,
    'page-generator': PageGeneratorWizard,
    'component-generator': ComponentGeneratorWizard,
    'feature-generator': FeatureGeneratorWizard,
    'database-generator': DatabaseGeneratorWizard,
    'design-system': DesignSystemWizard,
    'workspace': WorkspaceWizard,
    'focus-mode': FocusModeWizard
  },
  engine: WizardEngine,
  state: WizardStateManager,
  mockupGenerator: MockupGenerationService,
  outputGenerator: OutputPackageService
}
```

### Mockup Tool Integration
```typescript
// Mockup generation and tracking system
export interface MockupSystem {
  generator: HTMLMockupGenerator,
  tracker: ComponentUsageTracker,
  linker: PageNavigationLinker,
  responsive: ResponsiveValidator,
  exporter: MockupExporter
}
```

### Output Package Structure
```typescript
export interface FlexOSOutput {
  documentation: {
    vision: string,
    designSystem: string,
    features: string,
    pages: PageDocumentation[],
    userJourneys: string,
    technicalSpec: string
  },
  mockups: {
    html: MockupFile[],
    linked: boolean,
    responsive: BreakpointData,
    components: TrackedComponent[]
  },
  builderInstructions: {
    setup: string,
    pageByPage: BuildInstruction[],
    deployment: string,
    claudeCodeScript: string
  }
}
```
```

### useChat.ts
```typescript
export const useChat = (projectId?: string) => {
  const messages = useState<Message[]>('chat.messages', () => [])
  const isTyping = useState<boolean>('chat.typing', () => false)
  const context = useState<ChatContext | null>('chat.context', () => null)
  
  const sendMessage = async (content: string, attachments?: File[]) => {
    // Implementation
  }
  
  const clearChat = () => {
    // Implementation
  }
  
  const setContext = (newContext: ChatContext) => {
    // Implementation
  }
  
  return {
    messages: readonly(messages),
    isTyping: readonly(isTyping),
    context: readonly(context),
    sendMessage,
    clearChat,
    setContext
  }
}
```

### useBuilder.ts
```typescript
export const useBuilder = () => {
  const activeTab = useState<BuilderTab>('builder.tab', () => 'vision')
  const splitRatio = useState<number>('builder.split', () => 0.4)
  const focusMode = useState<boolean>('builder.focus', () => false)
  
  const switchTab = (tab: BuilderTab) => {
    // Implementation
  }
  
  const toggleFocusMode = () => {
    // Implementation
  }
  
  const updateSplitRatio = (ratio: number) => {
    // Implementation
  }
  
  return {
    activeTab: readonly(activeTab),
    splitRatio: readonly(splitRatio),
    focusMode: readonly(focusMode),
    switchTab,
    toggleFocusMode,
    updateSplitRatio
  }
}
```

## Supabase Schema

### Tables

```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  company TEXT,
  role TEXT,
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL, -- 'ecommerce', 'saas', 'social', 'blog', etc.
  status TEXT DEFAULT 'draft', -- 'draft', 'building', 'deployed'
  settings JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deployed_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ
);

-- Project collaborators
CREATE TABLE project_collaborators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) NOT NULL,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  role TEXT NOT NULL, -- 'owner', 'editor', 'viewer'
  invited_by UUID REFERENCES profiles(id),
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

-- Chat messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) NOT NULL,
  user_id UUID REFERENCES profiles(id),
  role TEXT NOT NULL, -- 'user', 'assistant', 'system'
  content TEXT NOT NULL,
  attachments JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project features
CREATE TABLE project_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'planned', -- 'planned', 'building', 'completed'
  priority INTEGER DEFAULT 0,
  dependencies JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project pages
CREATE TABLE project_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) NOT NULL,
  name TEXT NOT NULL,
  path TEXT NOT NULL,
  template TEXT,
  content JSONB DEFAULT '{}',
  seo JSONB DEFAULT '{}',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Design system
CREATE TABLE design_systems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) NOT NULL UNIQUE,
  colors JSONB DEFAULT '{}',
  typography JSONB DEFAULT '{}',
  spacing JSONB DEFAULT '{}',
  components JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Database schema
CREATE TABLE project_schemas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) NOT NULL,
  name TEXT NOT NULL,
  tables JSONB DEFAULT '[]',
  relationships JSONB DEFAULT '[]',
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User journeys
CREATE TABLE user_journeys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  steps JSONB DEFAULT '[]',
  metrics JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Deployments
CREATE TABLE deployments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) NOT NULL,
  version TEXT NOT NULL,
  url TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'building', 'deployed', 'failed'
  build_logs TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Templates
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  thumbnail_url TEXT,
  config JSONB NOT NULL,
  is_public BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI context embeddings
CREATE TABLE ai_contexts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) NOT NULL,
  content TEXT NOT NULL,
  embedding vector(1536),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_messages_project_id ON messages(project_id);
CREATE INDEX idx_project_features_project_id ON project_features(project_id);
CREATE INDEX idx_project_pages_project_id ON project_pages(project_id);
CREATE INDEX idx_deployments_project_id ON deployments(project_id);
CREATE INDEX idx_ai_contexts_project_id ON ai_contexts(project_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE design_systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_schemas ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_contexts ENABLE ROW LEVEL SECURITY;
```

### TypeScript Types

```typescript
// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'id'>>
      }
      projects: {
        Row: Project
        Insert: Omit<Project, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Project, 'id'>>
      }
      messages: {
        Row: Message
        Insert: Omit<Message, 'id' | 'created_at'>
        Update: Partial<Omit<Message, 'id'>>
      }
      // ... other tables
    }
  }
}

// Entity types
export interface Profile {
  id: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  bio: string | null
  company: string | null
  role: string | null
  onboarding_completed: boolean
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  user_id: string
  name: string
  description: string | null
  type: ProjectType
  status: ProjectStatus
  settings: ProjectSettings
  metadata: Record<string, any>
  created_at: string
  updated_at: string
  deployed_at: string | null
  deleted_at: string | null
}

export interface Message {
  id: string
  project_id: string
  user_id: string | null
  role: 'user' | 'assistant' | 'system'
  content: string
  attachments: Attachment[]
  metadata: Record<string, any>
  created_at: string
}

// Enums
export type ProjectType = 'ecommerce' | 'saas' | 'social' | 'blog' | 'portfolio' | 'other'
export type ProjectStatus = 'draft' | 'building' | 'deployed'
export type BuilderTab = 'vision' | 'design' | 'features' | 'pages' | 'journeys' | 'database'

// Helper types
export interface Attachment {
  id: string
  name: string
  type: string
  size: number
  url: string
}

export interface ProjectSettings {
  theme: 'light' | 'dark' | 'auto'
  primaryColor: string
  fontFamily: string
  // ... other settings
}
```

## API Routes

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Sign in user
- `POST /api/auth/signout` - Sign out user
- `GET /api/auth/session` - Get current session
- `POST /api/auth/forgot-password` - Send reset email
- `POST /api/auth/reset-password` - Reset password

### Projects
- `GET /api/projects` - List user projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/deploy` - Deploy project

### AI/Chat
- `POST /api/ai/chat` - Send chat message
- `POST /api/ai/generate` - Generate content
- `POST /api/ai/analyze` - Analyze requirements
- `POST /api/ai/suggest` - Get suggestions

### Builder
- `GET /api/builder/:projectId/preview` - Get preview
- `POST /api/builder/:projectId/save` - Save changes
- `POST /api/builder/:projectId/export` - Export code