# Website Refresh Wizard 🔄

## Purpose
Help users modernize their existing website by extracting content, analyzing design patterns, and creating an updated version that preserves their content while improving design, performance, user experience, and ensuring **full compliance with the European Accessibility Act (EAA) 2025**.

## Key Driver: EAA 2025 Compliance
The European Accessibility Act comes into full force on June 28, 2025, requiring all businesses selling products or services in the EU (including non-EU businesses) to meet WCAG 2.2 AA standards. Non-compliance can result in fines up to €1,000,000 and removal from the European market.

## Activation Triggers
- "I want to update my website"
- "Make my website EAA compliant"
- "My website needs accessibility fixes"
- "Redesign my existing site"
- "Modernize my website"
- "Import my current website"

## The Website Refresh Process

### Phase 1: Current Website Analysis & Compliance Check

**Claude**: I'll help you modernize your website and ensure it meets the new European Accessibility Act requirements that come into force June 28, 2025. Let's start by analyzing what you have now.

**What's your current website URL?**
- URL: _____________

**[After URL provided - Using Firecrawl MCP]**
```bash
# Analyzing website with Firecrawl...
firecrawl_scrape(url, {
  formats: ["markdown", "html", "screenshot"],
  onlyMainContent: false,
  includeTags: ["img", "form", "button", "a"],
  waitFor: 3000
})

# Accessibility audit
Pages found: {{page_count}}
WCAG 2.2 AA violations: {{violation_count}}
EAA compliance status: {{compliant/non-compliant}}
Accessibility score: {{score}}/100

# Critical issues found:
- Missing alt text: {{count}} images
- Poor color contrast: {{count}} elements  
- Keyboard navigation issues: {{count}} pages
- Missing form labels: {{count}} forms
- Touch target size violations: {{count}} elements
```

**EAA Compliance Report:**
Based on WCAG 2.2 AA requirements, your site currently has:
- ❌ **{{violation_count}} accessibility violations** that must be fixed
- ⚠️ **{{warning_count}} warnings** that should be addressed
- ✅ **{{passed_count}} elements** that already meet standards

**Business Impact:**
- Your site must be compliant by June 28, 2025
- This applies even if you're outside the EU but sell to EU customers
- Potential fines up to €1,000,000 for non-compliance

**What do you like about your current website?**
- [ ] The content/messaging
- [ ] The color scheme
- [ ] The layout/structure
- [ ] The features/functionality
- [ ] The images/media
- [ ] Other: ___________

**What needs improvement?**
- [ ] Looks outdated
- [ ] Not mobile-friendly
- [ ] Slow loading
- [ ] Hard to navigate
- [ ] Doesn't convert visitors
- [ ] Missing modern features
- [ ] Other: ___________

### Phase 2: Content Extraction & Accessibility Fixes

**Claude**: I've analyzed your website and found content to preserve while identifying accessibility issues that need fixing.

```yaml
Content Extraction (via Firecrawl):
- Text content: ✓ Extracted and organized
- Images: ✓ Downloaded (need alt text for {{count}})
- Videos: {{video_count}} found (need captions)
- PDFs: {{pdf_count}} documents (need accessible versions)
- Forms: {{form_count}} forms (need proper labels)

Accessibility Requirements:
- Alt text needed: {{image_count}} images
- Form labels missing: {{form_field_count}} fields
- Heading structure: {{needs_fixing}}
- Keyboard navigation: {{needs_implementation}}
- Screen reader support: {{needs_improvement}}
```

**What's your primary goal for this refresh?**
- [ ] **EAA Compliance Focus** - Fix accessibility issues first
- [ ] **Complete Redesign** - New look with built-in accessibility
- [ ] **Quick Compliance** - Minimal changes to meet EAA requirements
- [ ] **Future-Proof Update** - Full modernization and compliance

### Phase 3: Design Vision

**Claude**: Now let's talk about the fresh new look for your site!

**What style direction appeals to you?**
- [ ] Modern & Minimalist (clean, lots of white space)
- [ ] Bold & Vibrant (strong colors, dynamic)
- [ ] Professional & Trustworthy (corporate, serious)
- [ ] Warm & Friendly (approachable, casual)
- [ ] Creative & Unique (artistic, distinctive)
- [ ] Tech & Innovative (futuristic, cutting-edge)

**[Show visual examples]**
```
Here are some modern design trends:

1. [Minimalist]     2. [Bold]         3. [Professional]
   □ □ □               ■ ■ ■             ▭ ▭ ▭
   Clean              Dynamic           Corporate
   
4. [Warm]          5. [Creative]     6. [Tech]
   ◯ ◯ ◯              ◢ ◣ ◤             ⬡ ⬡ ⬡
   Friendly          Artistic          Innovative
```

**Color scheme preference?**
- [ ] Keep my current colors ({{current_primary}}, {{current_secondary}})
- [ ] Refresh with similar tones
- [ ] Completely new palette
- [ ] Let me choose specific colors: ___________

### Phase 4: Modern Features

**Claude**: Let's add some modern features to make your site stand out!

**Which of these would enhance your website?**
- [ ] Animated hero section
- [ ] Parallax scrolling effects
- [ ] Interactive testimonials
- [ ] Before/after sliders
- [ ] Video backgrounds
- [ ] Chat widget
- [ ] Newsletter popup
- [ ] Social proof notifications
- [ ] Dark mode toggle
- [ ] Accessibility features

**What's the main action you want visitors to take?**
- [ ] Contact me/us
- [ ] Buy a product
- [ ] Book a consultation
- [ ] Download something
- [ ] Sign up for newsletter
- [ ] Learn more about services
- [ ] Other: ___________

### Phase 5: Accessibility-First Implementation

**Claude**: Let's ensure your site meets all EAA requirements while adding modern features.

**WCAG 2.2 AA Compliance Features (Automatic):**
```yaml
Visual Accessibility:
- ✓ Color contrast ratios (4.5:1 minimum)
- ✓ Focus indicators (2px minimum)
- ✓ Text resizing up to 200%
- ✓ No reliance on color alone
- ✓ Dark mode with accessible colors

Keyboard & Navigation:
- ✓ Full keyboard navigation
- ✓ Skip links for screen readers
- ✓ Logical tab order
- ✓ No keyboard traps
- ✓ Focus management

Touch & Mobile:
- ✓ Touch targets 44x44px minimum
- ✓ Spacing between targets
- ✓ Alternative to gestures
- ✓ No drag-only interactions
- ✓ Responsive to all viewports

Content & Forms:
- ✓ Alt text for all images
- ✓ Proper heading hierarchy
- ✓ Form labels and instructions
- ✓ Error identification
- ✓ Accessible authentication

Multimedia:
- ✓ Video captions
- ✓ Audio descriptions
- ✓ Transcript options
- ✓ Pause/stop controls
```

**Additional Modern Features:**
Which of these would enhance your accessible website?
- [ ] Voice navigation support
- [ ] Screen reader optimized content
- [ ] High contrast mode toggle
- [ ] Font size controls
- [ ] Reduced motion options
- [ ] Language selection
- [ ] Easy-read version
- [ ] Accessibility statement page

### Phase 6: Content Migration Mapping

**Claude**: Here's how I'll map your current content to the new design:

```yaml
Current Page → New Structure:

Home:
  - Hero: {{current_headline}} → Modern hero with CTA
  - Services: {{service_list}} → Interactive cards
  - About: {{about_blurb}} → Story section
  
About:
  - History: {{company_history}} → Timeline component
  - Team: {{team_section}} → Modern team grid
  - Values: {{value_props}} → Icon features
  
Services:
  - List: {{service_descriptions}} → Expandable accordions
  - Pricing: {{pricing_table}} → Modern pricing cards
  
Contact:
  - Form: {{contact_form}} → Multi-step form
  - Info: {{contact_details}} → Interactive map
```

**Does this structure make sense for your content?**
- [ ] Perfect, let's proceed
- [ ] I'd like to adjust the structure
- [ ] Show me alternatives

### Phase 7: Preview Generation

**Claude**: I'm now creating your refreshed website mockups using your content with modern design...

**[Real-time mockup generation]**
```
Generating mockups:
✓ Homepage - Modern hero, your content, new design
✓ About - Your story, fresh layout
✓ Services - Your offerings, interactive display
✓ Contact - Your info, improved UX
✓ Mobile versions - All responsive

Applying your design choices:
- Style: {{selected_style}}
- Colors: {{selected_colors}}
- Features: {{selected_features}}
```

**[Show side-by-side comparison]**
```
BEFORE:                    AFTER:
[Current site thumb]  →    [New mockup thumb]
- Dated design             - Modern & fresh
- Desktop only            - Fully responsive
- Slow loading            - Lightning fast
- Basic layout            - Engaging interactions
```

### Phase 8: EAA Compliance Verification

**Claude**: Let's verify your refreshed website meets all European Accessibility Act requirements.

**Compliance Testing Results:**
```yaml
WCAG 2.2 AA Conformance:
✅ Perceivable:
  - Alt text: 100% coverage
  - Color contrast: All pass (4.5:1+)
  - Text resizing: Works to 200%
  - Captions: All videos covered

✅ Operable:
  - Keyboard access: Full navigation
  - Touch targets: All 44px+ 
  - No time limits: Implemented
  - Skip navigation: Present

✅ Understandable:
  - Language declared: Yes
  - Error messages: Clear & helpful
  - Labels: All forms labeled
  - Consistent navigation: Yes

✅ Robust:
  - Valid HTML: Passed
  - ARIA usage: Correct
  - Works with screen readers: Yes
  - Future-proof code: Yes

Overall Score: {{score}}/100
EAA Compliance: ✅ FULLY COMPLIANT
```

**Legal Documentation Generated:**
- [ ] Accessibility Statement (required)
- [ ] Compliance Certificate  
- [ ] Testing Report
- [ ] Feedback Mechanism Instructions

### Phase 9: Implementation Plan

**Claude**: Perfect! Here's your website refresh package:

```yaml
Deliverables:
1. Mockups:
   - Desktop versions (all pages)
   - Mobile versions (all pages)
   - Tablet versions (key pages)
   
2. Content:
   - All text content organized
   - Images optimized and ready
   - SEO metadata preserved
   - New content sections
   
3. Technical:
   - Component library
   - Style guide
   - Performance optimizations
   - Deployment instructions
   
4. Migration:
   - Content mapping document
   - 301 redirect plan
   - SEO preservation strategy
   - Launch checklist
```

**Ready to proceed with building your refreshed website?**
- [ ] Yes, let's build it!
- [ ] I'd like to share this with my team first
- [ ] Can I download the mockups?
- [ ] What are the next steps?

## Wizard Intelligence

### Content Extraction Features
- Scrape all text content
- Download and optimize images
- Preserve SEO metadata
- Extract color schemes and fonts
- Analyze current performance
- Map site structure
- Identify conversion elements

### Smart Suggestions Based on Industry
```javascript
const industrySuggestions = {
  'restaurant': ['Online ordering', 'Menu showcase', 'Reservations'],
  'consultant': ['Booking calendar', 'Case studies', 'Testimonials'],
  'ecommerce': ['Product filters', 'Cart abandonment', 'Reviews'],
  'clinic': ['Appointment booking', 'Patient portal', 'Service details'],
  'agency': ['Portfolio showcase', 'Process timeline', 'Team highlights']
}
```

### Design Modernization Rules
1. **Typography**: Update to modern, web-safe fonts
2. **Spacing**: Increase whitespace for breathing room
3. **Colors**: Enhance contrast for accessibility
4. **Images**: Replace stock photos with modern alternatives
5. **Layout**: Convert to mobile-first grid system
6. **Interactions**: Add micro-animations and transitions

## Success Metrics

The refreshed website should:
- ✅ **100% EAA/WCAG 2.2 AA compliant**
- ✅ **Pass all automated accessibility tests**
- ✅ **Include accessibility statement**
- ✅ **Preserve all valuable content**
- ✅ **Improve performance scores by 50%+**
- ✅ **Work perfectly on all devices**
- ✅ **Maintain SEO rankings**
- ✅ **Score 90+ on accessibility audits**
- ✅ **Protect from legal liability**
- ✅ **Open to 135M+ disabled EU users**

## Key EAA Requirements Summary

**Who Must Comply:**
- All EU businesses with 10+ employees OR €2M+ revenue
- Non-EU businesses selling to EU customers
- Service providers (banking, e-commerce, etc.)

**Deadline:** June 28, 2025

**Penalties for Non-Compliance:**
- Fines up to €1,000,000
- Removal from EU market
- Legal action from users
- Reputational damage

**FlexOS Guarantee:**
Every website refreshed through FlexOS will be:
- Fully EAA compliant
- WCAG 2.2 AA certified
- Include all required documentation
- Future-proofed for upcoming standards

## Example Transformations

### Before → After Examples

**Local Business Site**
- Before: 2010-era design, desktop only, slow
- After: Modern, responsive, local SEO optimized

**Consultant Website**
- Before: Text-heavy, no clear CTAs, dated
- After: Clear value prop, booking system, professional

**Small E-commerce**
- Before: Basic product list, poor mobile UX
- After: Filterable catalog, smooth checkout, fast

## Integration with FlexOS

This wizard integrates with:
- **Design System Generator**: For consistent styling
- **Page Generator**: For building each page
- **Component Generator**: For reusable elements
- **SEO Optimizer**: For maintaining rankings
- **Performance Optimizer**: For speed improvements

## Notes for Implementation

1. **Respect Original Brand**: Modernize without losing identity
2. **Content First**: Preserve valuable content while improving presentation
3. **SEO Continuity**: Maintain rankings through proper redirects
4. **Progressive Enhancement**: Add modern features that degrade gracefully
5. **User Testing**: Validate improvements with target audience