# FlexOS Pages Structure

## Public Pages

### 1. Landing Page (`/`)
**Purpose**: Convert visitors into users
- Hero section with value proposition
- Interactive chat demo
- Feature showcase
- Pricing preview
- Social proof (testimonials, stats)
- Footer with links

### 2. About Page (`/about`)
**Purpose**: Build trust and credibility
- Company story
- Team introduction
- Mission and values
- Press mentions
- Contact information

### 3. Pricing Page (`/pricing`)
**Purpose**: Clear pricing and plan comparison
- Plan comparison table
- Feature breakdown
- FAQ section
- Enterprise contact
- Money-back guarantee

### 4. Features Page (`/features`)
**Purpose**: Detailed feature exploration
- Feature categories
- Interactive demos
- Use case examples
- Video tutorials
- Comparison with competitors

### 5. Templates Page (`/templates`)
**Purpose**: Showcase possibilities
- Template gallery
- Category filters
- Live previews
- Template details
- "Use this template" CTA

### 6. Documentation (`/docs`)
**Purpose**: Help users succeed
- Getting started guide
- Feature documentation
- API reference
- Video tutorials
- FAQ section

### 7. Blog (`/blog`)
**Purpose**: SEO and thought leadership
- Article listing
- Category filters
- Search functionality
- Author profiles
- Newsletter signup

### 8. Contact Page (`/contact`)
**Purpose**: Support and sales inquiries
- Contact form
- Support options
- Sales contact
- Office locations
- Response time expectations

## Authentication Pages

### 9. Sign In (`/auth/signin`)
**Purpose**: User authentication
- Email/password form
- Social login options
- "Remember me" option
- Forgot password link
- Sign up CTA

### 10. Sign Up (`/auth/signup`)
**Purpose**: New user registration
- Registration form
- Social signup options
- Terms acceptance
- Email verification
- Welcome flow trigger

### 11. Forgot Password (`/auth/forgot-password`)
**Purpose**: Password recovery
- Email input
- Success message
- Resend option
- Support contact
- Return to login

### 12. Reset Password (`/auth/reset-password`)
**Purpose**: Set new password
- New password form
- Password requirements
- Success redirect
- Security tips
- Auto-login option

## Application Pages

### 13. Dashboard (`/app/dashboard`)
**Purpose**: Project overview
- Project cards
- Recent activity
- Quick actions
- Usage statistics
- Announcements

### 14. Project Wizard (`/app/wizard`)
**Purpose**: Guided project creation
- Multi-step form
- Progress indicator
- Context preservation
- Skip options
- Save and continue

### 15. Builder (`/app/project/:id`)
**Purpose**: Main building interface
- Chat panel
- Workspace tabs
- Preview panel
- Toolbar
- Settings access

### 16. Project Settings (`/app/project/:id/settings`)
**Purpose**: Project configuration
- General settings
- Team management
- Integrations
- Danger zone
- Activity log

### 17. Templates Gallery (`/app/templates`)
**Purpose**: Starting points
- Template browser
- Categories
- Search/filter
- Preview modal
- "Start with template"

### 18. Media Library (`/app/media`)
**Purpose**: Asset management
- File upload
- Organization folders
- Search functionality
- Usage tracking
- Quick embed

## User Account Pages

### 19. Profile Settings (`/account/profile`)
**Purpose**: User preferences
- Profile information
- Avatar upload
- Timezone settings
- Language preference
- Email preferences

### 20. Billing (`/account/billing`)
**Purpose**: Subscription management
- Current plan
- Usage statistics
- Payment methods
- Invoice history
- Plan upgrade/downgrade

### 21. API Keys (`/account/api`)
**Purpose**: Developer access
- API key management
- Usage statistics
- Rate limits
- Documentation links
- Webhook configuration

### 22. Team Management (`/account/teams`)
**Purpose**: Collaboration setup
- Team listing
- Member management
- Role assignment
- Invitations
- Activity log

### 23. Notifications (`/account/notifications`)
**Purpose**: Communication preferences
- Notification settings
- Email preferences
- In-app preferences
- Digest options
- Unsubscribe options

## Admin Pages

### 24. Admin Dashboard (`/admin`)
**Purpose**: Platform overview
- User statistics
- Revenue metrics
- System health
- Recent signups
- Support tickets

### 25. User Management (`/admin/users`)
**Purpose**: User administration
- User search
- Account details
- Activity logs
- Account actions
- Support notes

### 26. Content Management (`/admin/content`)
**Purpose**: Platform content
- Blog posts
- Documentation
- Templates
- Announcements
- Email templates

## Special Pages

### 27. Onboarding Flow (`/onboarding`)
**Purpose**: New user success
- Welcome message
- Profile completion
- First project
- Feature tour
- Success celebration

### 28. Focus Mode (`/focus/:id`)
**Purpose**: Distraction-free planning
- Minimal UI
- Project overview
- Quick notes
- Export options
- Return to builder

### 29. Preview Mode (`/preview/:id`)
**Purpose**: Stakeholder review
- Full-screen preview
- Device switcher
- Comments system
- Share options
- Approval workflow

### 30. Export Page (`/export/:id`)
**Purpose**: Code download
- Export options
- File structure
- README generation
- Deployment guide
- Support resources

## Error Pages

### 31. 404 Page
**Purpose**: Handle missing pages
- Friendly message
- Search option
- Popular pages
- Support contact
- Return home

### 32. 500 Page
**Purpose**: Handle server errors
- Error message
- Status page link
- Support contact
- Recent incidents
- Auto-refresh option

### 33. Maintenance Page
**Purpose**: Planned downtime
- Maintenance message
- Expected duration
- Progress updates
- Status page
- Email notification signup