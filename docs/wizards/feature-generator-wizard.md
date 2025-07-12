# Feature Generator Wizard 🚀

## Purpose
Transform feature ideas into complete, production-ready implementations. This wizard ensures features are fully thought through, properly integrated, and include all necessary components (UI, API, database, tests, docs).

## The Feature Development Process

### Phase 1: Feature Discovery

**Claude**: Let's build a complete feature for your application. I'll help ensure we don't miss anything important.

**What feature do you want to add?**
```
Examples:
- "User comments on posts"
- "Export data to CSV"  
- "Dark mode toggle"
- "Email notifications"
- "Search functionality"
- "File upload"
```

**Why do you need this feature?**
Understanding the "why" helps me build the right solution:
- [ ] Users requested it
- [ ] Competitive advantage
- [ ] Solving a specific problem: ________
- [ ] Improving user experience
- [ ] Business requirement
- [ ] Other: ________

### Phase 2: User Story Definition

**Claude**: Let's define exactly what users can do with this feature.

**[For comments feature example]**
As a **[type of user]**, I want to **[do something]**, so that **[benefit]**

Here's what I understood:
```
As a logged-in user,
I want to comment on posts,
So that I can engage with content and other users

As a post author,
I want to see comments on my posts,
So that I can understand user feedback

As a moderator,
I want to manage comments,
So that I can maintain community standards
```

**Is this complete? Any other user types or actions?**
- [ ] Add anonymous commenting
- [ ] Add reply threads
- [ ] Add comment reactions/likes
- [ ] Add @mentions
- [ ] Other: ________

### Phase 3: Feature Boundaries

**Claude**: Let's define what's included and what's not (for now).

**Core functionality (MVP):**
✅ Create comments
✅ Display comments  
✅ Delete own comments
✅ Basic validation

**Nice to have (v2):**
- [ ] Edit comments
- [ ] Rich text formatting
- [ ] Image attachments
- [ ] Real-time updates
- [ ] Email notifications
- [ ] Spam detection

**Out of scope (v3+):**
- Nested threading beyond 1 level
- Comment history/versioning
- AI moderation

**Agree with this scope?**
- [ ] Yes, perfect
- [ ] Move something to core: ________
- [ ] Move something to later: ________

### Phase 4: Integration Points

**Claude**: Let's understand how this feature fits into your existing application.

**Where will this feature appear?**
- [ ] Multiple pages (list which)
- [ ] Single page: ________
- [ ] New dedicated page
- [ ] Modal/overlay
- [ ] Sidebar component

**What existing code does it need to work with?**
- [ ] User authentication system
- [ ] Current data models
- [ ] Notification system
- [ ] Permission system
- [ ] API structure
- [ ] Other: ________

**Show me relevant existing code:**
- Current post/item structure
- User model
- Authentication setup
- Where you want comments to appear

### Phase 5: Technical Design

**Claude**: Based on your application, here's the technical design:

**Data Model:**
```typescript
// New Comment model
interface Comment {
  id: string;
  postId: string;         // What it's attached to
  userId: string;         // Who wrote it
  content: string;        // The comment text
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;       // Soft delete
  
  // Relations
  user?: User;            // Author details
  post?: Post;            // Parent post
  reactions?: Reaction[]; // Future feature
}

// Update Post model
interface Post {
  // ... existing fields
  comments?: Comment[];
  commentCount: number;   // Denormalized for performance
}
```

**API Endpoints:**
```typescript
// Comments API
GET    /api/posts/:postId/comments     // List comments
POST   /api/posts/:postId/comments     // Create comment
DELETE /api/comments/:commentId        // Delete comment
GET    /api/comments/recent           // User's recent comments

// Permissions
- Create: Authenticated users only
- Read: Public (based on post visibility)
- Delete: Author only (or moderator)
```

**Is this structure correct?**
- [ ] Yes, matches our needs
- [ ] Need to adjust data model
- [ ] Different API approach needed
- [ ] Questions about: ________

### Phase 6: UI/UX Design

**Claude**: Let's design the user interface.

**Comment Display Style:**
```
Option A: Linear List
┌─────────────────────────┐
│ 👤 John Doe • 2h ago    │
│ Great article!          │
│ 💬 Reply  ❤️ 12         │
├─────────────────────────┤
│ 👤 Jane Smith • 1h ago  │
│ I disagree because...   │
│ 💬 Reply  ❤️ 3          │
└─────────────────────────┘

Option B: Card Style
┌─────────────────────────┐
│ ┌───┐                   │
│ │👤 │ John Doe          │
│ └───┘ 2 hours ago       │
│                         │
│ This is a great article!│
│ Thanks for sharing.     │
│                         │
│ 💬 5  ❤️ 12  🔗 Share   │
└─────────────────────────┘

Option C: Minimal Thread
  John Doe: Great article!
  └─ Jane: Thanks!
  └─ Bob: Agreed!
```

**Which style fits your app?**
- [ ] Option A - Clean list
- [ ] Option B - Rich cards  
- [ ] Option C - Minimal
- [ ] Custom design: ________

**Interaction patterns:**
- [ ] Inline comment form
- [ ] Modal for writing
- [ ] Expand/collapse threads
- [ ] Load more pagination
- [ ] Infinite scroll

### Phase 7: Component Architecture

**Claude**: Here's how I'll structure the components:

```typescript
// Component hierarchy
<CommentsSection postId={postId}>
  <CommentList>
    <Comment>
      <CommentHeader />
      <CommentBody />
      <CommentActions />
    </Comment>
  </CommentList>
  <CommentForm />
</CommentsSection>

// Key props flow
CommentsSection
  ├─ postId (to fetch comments)
  ├─ currentUser (for permissions)
  └─ onCommentAdded (callback)
```

**State management approach:**
- [ ] Local component state (simple)
- [ ] Context/Redux (if shared)
- [ ] React Query (for caching)
- [ ] Real-time (websockets)

**Component features:**
- Loading states
- Empty states
- Error handling
- Optimistic updates
- Form validation

### Phase 8: Implementation Checklist

**Claude**: Here's everything we'll build:

**Frontend Components:**
- [ ] CommentList component
- [ ] Comment component  
- [ ] CommentForm component
- [ ] CommentActions component
- [ ] Loading/Error states

**Backend Implementation:**
- [ ] Database migration
- [ ] Comment model
- [ ] API endpoints
- [ ] Validation rules
- [ ] Permission checks

**Integration Tasks:**
- [ ] Update post pages
- [ ] Add comment counts
- [ ] User dashboard section
- [ ] Admin moderation

**Testing:**
- [ ] Unit tests for API
- [ ] Component tests
- [ ] Integration tests
- [ ] Accessibility tests

**Documentation:**
- [ ] API documentation
- [ ] Component storybook
- [ ] Feature guide

### Phase 9: Rollout Strategy

**Claude**: How should we roll out this feature?

**Deployment approach:**
- [ ] All users immediately
- [ ] Feature flag (gradual rollout)
- [ ] Beta users first
- [ ] Specific posts/sections only

**Monitoring needs:**
- [ ] Comment creation rate
- [ ] Error tracking
- [ ] Performance metrics
- [ ] User engagement
- [ ] Moderation queue

**Success metrics:**
- Comments per post
- User engagement rate
- Time on page increase
- User satisfaction

**Ready to build?**
- [ ] Yes, generate all code
- [ ] Show me one component first
- [ ] Review API design again
- [ ] Adjust something: ________

## Generated Output

### 1. Database Changes
```sql
-- migrations/add_comments.sql
CREATE TABLE comments (
  id UUID PRIMARY KEY,
  post_id UUID REFERENCES posts(id),
  user_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
```

### 2. API Implementation
```typescript
// api/comments/route.ts
export async function GET(req: Request) {
  const { postId } = params;
  const comments = await getComments(postId);
  return NextResponse.json(comments);
}

export async function POST(req: Request) {
  const user = await requireAuth(req);
  const { content } = await req.json();
  const comment = await createComment({
    postId,
    userId: user.id,
    content
  });
  return NextResponse.json(comment);
}
```

### 3. React Components
```typescript
// components/comments/CommentSection.tsx
export function CommentSection({ postId }: Props) {
  const { data: comments, isLoading } = useComments(postId);
  const [showForm, setShowForm] = useState(false);
  
  if (isLoading) return <CommentSkeleton />;
  
  return (
    <div className="comment-section">
      <h3>Comments ({comments.length})</h3>
      <CommentList comments={comments} />
      <CommentForm postId={postId} />
    </div>
  );
}
```

### 4. Tests
```typescript
// __tests__/comments.test.ts
describe('Comments Feature', () => {
  it('displays comments for a post', async () => {
    // Test implementation
  });
  
  it('allows authenticated users to comment', async () => {
    // Test implementation
  });
  
  it('prevents spam comments', async () => {
    // Test implementation
  });
});
```

### 5. Documentation
```markdown
# Comments Feature

## Overview
Users can now comment on posts to increase engagement.

## Usage
Add `<CommentSection postId={id} />` to any post page.

## API Reference
- GET /api/posts/:id/comments
- POST /api/posts/:id/comments
- DELETE /api/comments/:id

## Moderation
Admins can remove inappropriate comments via...
```

## Common Feature Patterns

### Real-time Features
```typescript
// WebSocket integration
useEffect(() => {
  const ws = new WebSocket(wsUrl);
  ws.on('comment:new', (comment) => {
    addOptimisticComment(comment);
  });
  return () => ws.close();
}, []);
```

### Notification Integration
```typescript
// After comment creation
await notifyUser(post.authorId, {
  type: 'new_comment',
  message: `${user.name} commented on your post`,
  link: `/posts/${postId}#comment-${commentId}`
});
```

### Permission System
```typescript
// Permission checks
const canDelete = (comment: Comment, user: User) => {
  return comment.userId === user.id || 
         user.role === 'moderator' ||
         user.role === 'admin';
};
```

## Success Metrics

The feature implementation includes:
- ✅ Complete frontend components
- ✅ Robust API with validation
- ✅ Database schema and indexes
- ✅ Permission system
- ✅ Error handling
- ✅ Loading/empty states
- ✅ Mobile responsive
- ✅ Accessibility compliant
- ✅ Tests coverage
- ✅ Documentation