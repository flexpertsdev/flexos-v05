# Database Generator Wizard 🗄️

## Purpose
Design and generate a complete database schema based on application requirements, ensuring proper relationships, performance, and scalability. This wizard helps non-technical users create professional database structures.

## The Database Design Process

### Phase 1: Understanding Your Data

**Claude**: Let's design a database that perfectly fits your application. I'll ask some questions to understand what information you need to store.

**What's the main purpose of your application?**
- [ ] E-commerce (products, orders, customers)
- [ ] Social platform (users, posts, connections)
- [ ] SaaS/Business tool (workspaces, projects, tasks)
- [ ] Content management (articles, media, categories)
- [ ] Educational (courses, students, progress)
- [ ] Other: _______________

**Do you have any existing documentation?**
- [ ] User stories or requirements
- [ ] Mockups showing data
- [ ] Spreadsheets with sample data
- [ ] API documentation
- [ ] No, let's start from scratch

### Phase 2: Core Entities

**Claude**: Based on your [app type], let's identify the main things you need to track.

**[For e-commerce example]**
Here are the core entities I've identified:
```
📦 Products
- Name, description, price
- Images, categories
- Inventory/stock

👤 Users/Customers  
- Profile information
- Authentication details
- Preferences

🛒 Orders
- Items, quantities
- Payment info
- Shipping details

💳 Payments
- Transaction records
- Payment methods
- Refunds
```

**What else do you need to track?**
- [ ] Reviews/Ratings
- [ ] Wishlists/Favorites
- [ ] Coupons/Discounts
- [ ] Shipping zones
- [ ] Analytics/Metrics
- [ ] Other: ___________

### Phase 3: Entity Details

**Claude**: Let's detail each entity. I'll start with the most important one.

**For [Users] entity, what information do you need?**

Basic fields (always recommended):
- ✅ ID (unique identifier)
- ✅ Created at (timestamp)
- ✅ Updated at (timestamp)

Profile information:
- [ ] Email (required for login?)
- [ ] Username (unique?)
- [ ] Full name (first/last or single field?)
- [ ] Avatar/Profile picture
- [ ] Phone number
- [ ] Date of birth
- [ ] Bio/Description

Authentication:
- [ ] Password (hashed)
- [ ] Email verified?
- [ ] Two-factor auth?
- [ ] Social login IDs
- [ ] Password reset tokens

Preferences/Settings:
- [ ] Language
- [ ] Timezone
- [ ] Email preferences
- [ ] Theme preference
- [ ] Other: __________

**Any calculated or special fields?**
Examples: "Full name from first+last", "Age from DOB", "Member since"

### Phase 4: Relationships

**Claude**: Now let's connect your entities. I'll show you the relationships I've identified.

**[Showing detected relationships]**
```
Users ←→ Orders
- One user can have many orders
- Each order belongs to one user

Products ←→ Orders  
- Many-to-many (through OrderItems)
- Products can be in many orders
- Orders can have many products

Categories ←→ Products
- One category has many products
- Products might have multiple categories?
```

**Are these relationships correct?**
- [ ] Yes, exactly right
- [ ] Mostly, but... [explain]
- [ ] No, let me clarify

**Special relationship rules?**
- Can users have multiple addresses?
- Can products belong to multiple categories?
- Are there user roles/permissions?
- Any hierarchical data (like nested categories)?

### Phase 5: Performance Considerations

**Claude**: Let's optimize for your usage patterns.

**How will your app primarily use this data?**
- [ ] Lots of reads, few writes (content site)
- [ ] Balanced reads and writes (typical app)
- [ ] Heavy writes (analytics, logs)
- [ ] Complex queries (reporting, search)
- [ ] Real-time updates (chat, collaboration)

**Expected scale?**
- [ ] Small (< 1K users)
- [ ] Medium (1K - 100K users)
- [ ] Large (100K - 1M users)
- [ ] Massive (1M+ users)
- [ ] Not sure yet

**Critical queries?**
What operations need to be fastest?
- [ ] User login/profile loading
- [ ] Product search/filtering
- [ ] Order history
- [ ] Real-time updates
- [ ] Analytics/reporting
- [ ] Other: __________

### Phase 6: Database Choice

**Claude**: Based on your needs, let me recommend a database.

**[Recommendation based on requirements]**

For your use case, I recommend:
```
PostgreSQL because:
- Complex relationships ✓
- ACID compliance ✓  
- Full-text search ✓
- JSON support for flexible fields ✓
- Proven scalability ✓

Other options:
- MySQL: Also good, slightly faster for simple queries
- MongoDB: If you need very flexible schemas
- Supabase: PostgreSQL with built-in auth/realtime
- Firebase: If you need real-time sync
```

**Database preference?**
- [ ] Go with your recommendation
- [ ] I prefer: __________
- [ ] Tell me more about options
- [ ] What's easiest to deploy?

### Phase 7: Schema Generation

**Claude**: Here's your complete database schema:

**[PostgreSQL Example]**
```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  avatar_url TEXT,
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table  
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  stock_quantity INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  subtotal DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) DEFAULT 0,
  shipping DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order items (junction table)
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price_at_time DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- Updated at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- Repeat for other tables...
```

### Phase 8: Additional Features

**Claude**: Would you like any of these advanced features?

**Data integrity & security:**
- [ ] Row-level security (RLS)
- [ ] Audit trails (who changed what)
- [ ] Soft deletes (archive instead of delete)
- [ ] Data encryption at rest
- [ ] Field-level permissions

**Performance features:**
- [ ] Caching layer (Redis)
- [ ] Read replicas
- [ ] Partitioning for large tables
- [ ] Full-text search indexes
- [ ] Materialized views

**Developer features:**
- [ ] Database migrations setup
- [ ] Seed data scripts
- [ ] TypeScript types
- [ ] ORM models (Prisma/TypeORM)
- [ ] GraphQL schema

### Phase 9: Implementation Plan

**Claude**: Here's your complete database package:

```yaml
Database Implementation:
  Type: PostgreSQL
  Tables: 7 (users, products, orders, etc.)
  Relationships: 12 defined
  Indexes: 8 for performance
  
Files Generated:
  1. schema.sql - Complete DDL
  2. migrations/ - Version control
  3. seeds/ - Sample data
  4. models/ - ORM definitions
  5. types/ - TypeScript interfaces
  6. docs/ - Relationship diagrams
  
Next Steps:
  1. Create database
  2. Run migrations  
  3. Seed sample data
  4. Test queries
  5. Set up backups
```

**Ready to generate all files?**
- [ ] Yes, create everything
- [ ] Show me the ER diagram first
- [ ] Let me adjust the schema
- [ ] Explain the indexing strategy

## Generated Outputs

### 1. SQL Schema Files
```
/database
├── schema.sql          # Complete schema
├── indexes.sql         # Performance indexes
├── constraints.sql     # Foreign keys, checks
└── functions.sql       # Triggers, procedures
```

### 2. Migration Files
```
/migrations
├── 001_create_users.sql
├── 002_create_products.sql
├── 003_create_orders.sql
└── ...
```

### 3. ORM Models
```typescript
// Prisma example
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  orders    Order[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 4. TypeScript Types
```typescript
export interface User {
  id: string;
  email: string;
  username?: string;
  fullName?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### 5. Documentation
```markdown
# Database Schema Documentation

## Entity Relationship Diagram
[Mermaid diagram]

## Table Descriptions
[Detailed field documentation]

## Query Examples
[Common query patterns]
```

## Common Patterns

### Multi-tenancy
```sql
-- Add tenant isolation
ALTER TABLE users ADD COLUMN tenant_id UUID NOT NULL;
ALTER TABLE products ADD COLUMN tenant_id UUID NOT NULL;
-- Add to all tables...

-- Row-level security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON users
  USING (tenant_id = current_setting('app.tenant_id')::uuid);
```

### Audit Trail
```sql
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name VARCHAR(50) NOT NULL,
  record_id UUID NOT NULL,
  action VARCHAR(10) NOT NULL,
  changed_by UUID REFERENCES users(id),
  changed_at TIMESTAMPTZ DEFAULT NOW(),
  old_values JSONB,
  new_values JSONB
);
```

### Soft Deletes
```sql
-- Add to all tables
ALTER TABLE users ADD COLUMN deleted_at TIMESTAMPTZ;

-- Filter in queries
CREATE VIEW active_users AS
  SELECT * FROM users WHERE deleted_at IS NULL;
```

## Success Metrics

The generated database:
- ✅ Handles all application requirements
- ✅ Maintains referential integrity
- ✅ Performs well at expected scale
- ✅ Easy to query and maintain
- ✅ Includes proper indexes
- ✅ Has migration strategy
- ✅ Follows naming conventions