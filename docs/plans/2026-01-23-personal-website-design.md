# Personal Website Design - calebbolden.us

**Date:** 2026-01-23
**Status:** Approved
**Implementation Scope:** Full Featured Launch

---

## Executive Summary

A dual-audience personal website targeting both potential employers and automation clients. Features an always-visible AI chat panel, interactive workflow demos, dark futuristic aesthetic, and comprehensive content management. Built with Next.js 14, TypeScript, Tailwind CSS, and deployed on Vercel.

**Key Differentiators:**
- AI chat panel that qualifies leads and answers questions about background/services
- Interactive workflow visualizations using React Flow
- Parallel design approach (full desktop experience, streamlined mobile)
- Git-backed content management with TinaCMS

---

## Architecture Overview

### Tech Stack

**Framework & Language:**
- Next.js 14+ with App Router (React Server Components by default)
- TypeScript with strict mode
- React 18

**Styling & UI:**
- Tailwind CSS for utility-first styling
- Headless UI for accessible primitives
- Custom components (no pre-built theme)

**Key Features:**
- **AI Chat:** Vercel AI SDK + Gemini API
- **Workflow Demos:** React Flow library
- **Content Management:** TinaCMS (Git-backed, self-hosted)
- **Deployment:** Vercel with automatic GitHub deployments
- **Analytics:** Vercel Analytics (privacy-friendly, built-in)

### Data Flow

- **Static Generation:** Homepage, about, career timeline (build time)
- **Dynamic API Routes:** AI chat endpoint (`/api/chat`)
- **Incremental Static Regeneration:** Blog posts, workflow pages (revalidate on content change)
- **Client Components:** AI chat panel, workflow demos (interactive features)
- **Server Components:** Everything else (minimal JavaScript)

---

## Page Structure & Components

### Pages (App Router)

```
/                      # Homepage (hero, workflow demos, career, blog preview)
/about                 # Expanded background, philosophy, personal details
/workflows             # Portfolio grid with filter by industry/use-case
/workflows/[slug]      # Detailed case study (results, tech stack, before/after)
/blog                  # Blog listing with category filter, search, pagination
/blog/[slug]           # Individual blog post (MDX rendering)
/contact               # Direct contact fallback (if AI chat fails)
/admin                 # TinaCMS editor (password protected)
```

### Core Components

**Layout Components:**
- `Header` - Glassmorphic nav with logo, links, dual CTAs
- `AIChat` - Fixed sidebar (desktop) / modal (mobile) with streaming responses
- `Footer` - Links, social, copyright

**Homepage Sections:**
- `Hero` - Headline, tagline chips, stats bar, gradient background
- `WorkflowDemo` - React Flow canvas with tabs (3 workflows)
- `CareerTimeline` - 3 cards (Blockdaemon current, US Bank, TSYS)
- `BlogPreview` - 3-column grid with category tags, dates, excerpts

**Reusable Components:**
- `WorkflowCard` - Portfolio item with preview image, description, tech stack
- `BlogCard` - Post preview with category, date, title, excerpt
- `ContactForm` - Validation, submission, error states

### Responsive Strategy

**Desktop (1024px+):**
- AI chat sidebar always visible (400px width, right side)
- Full workflow demos with interactive zoom/pan
- Three-column blog grid
- All animations and glassmorphism effects

**Mobile (<1024px):**
- AI chat as floating button (bottom right) → opens modal
- Simplified workflow displays (step-by-step lists)
- Single-column stacked sections
- Reduced animations (performance)

---

## AI Chat Implementation

### Architecture

**API Route:** `/api/chat` (POST endpoint)
- Vercel AI SDK `streamText()` with Gemini API
- Streaming responses for real-time UX
- Rate limiting on client side (prevent spam)

**System Prompt:**
- Static content file: `/lib/chat/system-prompt.ts`
- Contains: Resume, project descriptions, workflow examples, philosophy
- **Context Switching** based on CTA clicked:
  - "I'm Hiring" → Employment focus (skills, availability, experience)
  - "Need Automation?" → Client focus (services, pricing, case studies)

### Client Component (`components/AIChat.tsx`)

**Desktop Layout:**
- Fixed sidebar (400px width, right side)
- Always visible, no toggle
- Green online indicator (pulsing animation)
- Suggested questions (4-5 curated)
- Message history persisted in session storage

**Mobile Layout:**
- Floating action button (bottom right, cyan gradient)
- Opens full-screen modal with backdrop
- Same features as desktop
- Swipe down to close

### Conversation Flow

**For "Need Automation?" Visitors:**
```
1. User clicks "Need Automation?" CTA
2. Chat opens with: "I see you're interested in automation services. What processes are eating up your time?"
3. Chat qualifies: budget range, timeline, pain points
4. AI responds with relevant case study or workflow example
5. AI offers: "Based on what you've shared, I'd recommend scheduling a 30-min consultation. Here's my Calendly link: [link]"
```

**For "I'm Hiring" Visitors:**
```
1. User clicks "I'm Hiring" CTA
2. Chat opens with: "Thanks for your interest! What role are you hiring for?"
3. Chat highlights relevant experience from resume
4. AI provides: "Here's my LinkedIn profile and resume download link. I'd love to discuss the opportunity."
```

### Error Handling

- **API Failures:** "Something went wrong. Try the contact form instead: [link]"
- **Rate Limits:** "Let's slow down a bit. Take your time with your questions."
- **Context Overflow:** Summarize conversation, continue with fresh context

---

## Content Management & Blog System

### TinaCMS Integration

**Setup:**
- Self-hosted TinaCMS (free tier, no external service required)
- Admin UI at `/admin` route
- Protected by environment variable password (`TINA_ADMIN_PASSWORD`)
- All edits commit directly to Git repository

**Content Storage:**
```
/content/
  /blog/
    /2026-01-15-ai-agents-2026.md
    /2026-01-10-beyond-rpa.md
  /workflows/
    lead-enrichment.md
    content-repurposing.md
    meeting-notes.md
  /pages/
    about.md
```

### Blog Post Schema (Frontmatter)

```yaml
---
title: "The State of AI Agents in 2026"
date: "2026-01-15"
category: "AI Trends"  # AI Trends | Automation | Blockchain | Process Improvement
excerpt: "Analyzing the shift from chatbots to autonomous agents..."
featured: true
tags: ["AI", "automation", "agents", "2026"]
---
```

### MDX Features

- **Embedded Components:** Charts, interactive demos, workflow diagrams
- **Code Highlighting:** Prism syntax highlighting
- **Auto TOC:** Table of contents generation for long posts
- **Reading Time:** Calculated from word count

### Blog Pages

**Listing Page (`/blog`):**
- Category filter (tabs or dropdown)
- Search functionality (client-side filtering)
- Pagination (10 posts per page)
- Featured posts at top

**Post Page (`/blog/[slug]`):**
- Full MDX rendering
- Related posts section (same category)
- Share buttons (Twitter, LinkedIn)
- Reading time estimate

**Additional Features:**
- RSS feed auto-generated at `/feed.xml`
- Sitemap includes all blog posts

### Workflow Portfolio

**Listing Page (`/workflows`):**
- Portfolio grid (3 columns desktop, 1 mobile)
- Filter by: Industry (SaaS, E-commerce, Finance) or Use-Case (Lead Gen, Content, Operations)
- Each card shows: Preview image, title, one-line description, tech stack icons

**Detail Page (`/workflows/[slug]`):**
- **Hero:** Workflow name, one-line value prop, key metrics
- **Problem:** What manual process this solves
- **Solution:** How the workflow works (step-by-step with React Flow diagram)
- **Results:** Before/after metrics, time saved, cost reduction
- **Tech Stack:** Tools used (n8n, Gemini, APIs, etc.)
- **CTA:** "Want something similar? Book a consultation"

---

## Deployment & Configuration

### Environment Variables

```bash
# AI Chat
GOOGLE_GENERATIVE_AI_API_KEY=<your-gemini-key>

# TinaCMS Admin
TINA_ADMIN_PASSWORD=<secure-password>

# Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS=true

# Site Config
NEXT_PUBLIC_SITE_URL=https://calebbolden.us
NEXT_PUBLIC_CALENDLY_HIRING_URL=<calendly-link-employers>
NEXT_PUBLIC_CALENDLY_CLIENT_URL=<calendly-link-clients>
```

### Vercel Deployment

**Setup:**
- GitHub repository → Vercel project
- Auto-deploy on push to `main` branch
- Preview deployments for all pull requests
- Custom domain: `calebbolden.us` (configured in Vercel dashboard)

**Build Configuration:**
- Static generation for all pages except `/api/*` and `/admin`
- Edge Functions for API routes (low latency, global distribution)
- Image optimization with Next.js Image component
- Security headers: CSP, X-Frame-Options, HSTS

**Performance Optimizations:**
- React Server Components by default (smaller bundles)
- Dynamic imports for heavy components (React Flow, TinaCMS editor)
- Font optimization (local fonts, no external requests)
- Vercel Analytics for Core Web Vitals tracking

### Git Workflow

- `main` branch → production (`calebbolden.us`)
- Feature branches → preview deployments
- All TinaCMS content changes committed to Git
- Pull requests require passing tests (CI)

---

## Project Structure

```
calebbolden.com/
├── app/
│   ├── layout.tsx              # Root layout with AI chat, Header, Footer
│   ├── page.tsx                # Homepage (Hero, Workflows, Timeline, Blog)
│   ├── about/page.tsx          # About page
│   ├── workflows/
│   │   ├── page.tsx            # Portfolio listing with filters
│   │   └── [slug]/page.tsx     # Case study detail
│   ├── blog/
│   │   ├── page.tsx            # Blog listing with category filter
│   │   └── [slug]/page.tsx     # Blog post (MDX rendering)
│   ├── contact/page.tsx        # Contact form fallback
│   ├── admin/                  # TinaCMS routes (auto-generated)
│   └── api/
│       └── chat/route.ts       # AI chat endpoint (streaming)
├── components/
│   ├── AIChat.tsx              # Chat sidebar/modal with streaming
│   ├── Header.tsx              # Glassmorphic nav with dual CTAs
│   ├── Hero.tsx                # Homepage hero section
│   ├── WorkflowDemo.tsx        # React Flow tabbed demos
│   ├── CareerTimeline.tsx      # 3 career cards
│   ├── BlogPreview.tsx         # 3-column blog grid
│   ├── WorkflowCard.tsx        # Portfolio item card
│   ├── BlogCard.tsx            # Blog post preview card
│   ├── ContactForm.tsx         # Contact form with validation
│   ├── Footer.tsx              # Footer links and social
│   └── ui/                     # Headless UI wrappers (Dialog, Menu, etc.)
├── content/
│   ├── blog/                   # Markdown blog posts
│   ├── workflows/              # Workflow case studies (Markdown)
│   └── pages/                  # Static pages (about.md)
├── lib/
│   ├── chat/
│   │   ├── system-prompt.ts    # AI system prompt (resume, projects)
│   │   └── config.ts           # Chat configuration
│   ├── blog/
│   │   ├── getBlogPosts.ts     # Load and parse blog posts
│   │   └── mdx.ts              # MDX rendering utilities
│   └── workflows/
│       └── getWorkflows.ts     # Load workflow case studies
├── public/
│   ├── images/                 # Optimized images (WebP)
│   ├── fonts/                  # Local fonts (preloaded)
│   └── resume.pdf              # Downloadable resume
├── styles/
│   └── globals.css             # Tailwind imports, custom CSS
├── __tests__/
│   ├── api/
│   │   └── chat.test.ts        # API route tests
│   ├── lib/
│   │   ├── blog.test.ts        # Blog data loading tests
│   │   └── workflows.test.ts   # Workflow data loading tests
│   └── components/
│       ├── AIChat.test.tsx     # Chat component integration tests
│       └── ContactForm.test.tsx # Form validation tests
├── docs/
│   └── plans/
│       └── 2026-01-23-personal-website-design.md  # This document
├── next.config.js              # Next.js configuration
├── tailwind.config.js          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies
└── .env.local                  # Local environment variables (gitignored)
```

---

## Dependencies

### Core Dependencies

```json
{
  "dependencies": {
    "next": "^14.1.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.3.0",
    "@ai-sdk/google": "^0.0.x",
    "ai": "^3.0.0",
    "reactflow": "^11.10.0",
    "tinacms": "^1.6.0",
    "@headlessui/react": "^1.7.0",
    "tailwindcss": "^3.4.0",
    "next-mdx-remote": "^4.4.0",
    "gray-matter": "^4.0.3",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "jest": "^29.7.0",
    "@testing-library/react": "^14.1.0",
    "@testing-library/jest-dom": "^6.1.0",
    "eslint": "^8.56.0",
    "eslint-config-next": "^14.1.0"
  }
}
```

### TypeScript Configuration

- **Strict mode:** Enabled
- **Path aliases:** `@/components`, `@/lib`, `@/content`, `@/app`
- **Type definitions:** Blog posts, workflows, chat messages, API responses

---

## Testing Strategy (Pragmatic)

### What We Test

**Critical Paths:**
1. **AI Chat API (`/api/chat`)**
   - Valid requests return streaming responses
   - Invalid API keys fail gracefully with error message
   - Rate limiting prevents spam
   - System prompt loads correctly

2. **Contact/Conversion Forms**
   - Form validation (email format, required fields)
   - Successful submission shows confirmation
   - Error states display properly
   - Calendly links work

3. **Blog/Workflow Data Loading**
   - Markdown parsing works correctly
   - Frontmatter extraction (title, date, category)
   - Slug generation is consistent
   - 404 handling for non-existent posts

### What We Don't Test

- Purely presentational components (Hero, Timeline, Footer)
- Tailwind styling/layout
- Animation effects
- Static page renders

### Testing Tools

- **Jest** - Unit tests for utilities (markdown parsing, slug generation)
- **React Testing Library** - Integration tests for forms, chat interface
- **Playwright** (optional/later) - E2E smoke tests for critical user flows

### CI Integration

- Tests run on PR creation (GitHub Actions)
- Must pass before merge to `main`
- Runs: Type checking + ESLint + Jest tests

---

## SEO & Performance

### SEO Strategy

**Meta Tags (Dynamic per page):**
```tsx
// Example for blog post
export const metadata = {
  title: "The State of AI Agents in 2026 | Caleb Bolden",
  description: "Analyzing the shift from chatbots to autonomous agents...",
  openGraph: {
    title: "The State of AI Agents in 2026",
    description: "Analyzing the shift from chatbots to autonomous agents...",
    images: ["/og-image-ai-agents.png"]
  }
}
```

**Structured Data (JSON-LD):**
- **Person Schema:** Homepage (Caleb's profile for Google Knowledge Graph)
- **BlogPosting Schema:** Each blog post (rich snippets in search results)
- **Organization Schema:** Footer (business info)

**Additional SEO:**
- Sitemap auto-generated at `/sitemap.xml` (includes all blog posts, workflows)
- `robots.txt` allows all crawlers, points to sitemap
- Semantic HTML (proper `<h1>`, `<h2>` hierarchy)
- ARIA labels for accessibility and SEO

**Target Keywords:**
- "n8n automation consultant"
- "AI workflow automation"
- "product operations specialist"
- "blockchain product manager"
- "process improvement automation"

**Blog SEO Tactics:**
- URL structure: `/blog/descriptive-slug-with-keywords`
- Auto-generated meta descriptions from excerpts (truncated to 160 chars)
- Internal linking between related posts
- Category pages for topic clustering (authority building)

### Performance Targets (Core Web Vitals)

**Goals:**
- **LCP** (Largest Contentful Paint) - < 2.5s
- **FID** (First Input Delay) - < 100ms
- **CLS** (Cumulative Layout Shift) - < 0.1
- **Time to Interactive** - < 3.5s

**Tactics:**
- React Server Components reduce JavaScript bundle size
- Dynamic imports for chat panel (not needed on initial page load)
- Image optimization (Next.js Image, WebP format, proper sizing)
- Font preloading (local fonts, no external requests)
- Minimal third-party scripts (only Vercel Analytics)

**Monitoring:**
- Vercel Analytics for real-user metrics (RUM)
- Lighthouse CI on every deployment
- Bundle size monitoring (warn if bundle exceeds 250KB)

---

## Accessibility (WCAG 2.1 AA)

### Requirements

**Keyboard Navigation:**
- All interactive elements accessible via Tab/Shift+Tab
- Enter/Space activate buttons and links
- Escape closes modals (chat on mobile)
- Arrow keys navigate tabs (workflow demos)

**Screen Reader Support:**
- Proper ARIA labels on all interactive elements
- ARIA live regions for chat messages
- Semantic HTML (`<header>`, `<nav>`, `<main>`, `<footer>`)
- Skip to main content link for screen readers

**Color Contrast:**
- All text meets 4.5:1 ratio minimum
- Light text (#e5e7eb) on dark background (#0a0a0f) = 15.5:1 ratio ✓
- Cyan accent (#06b6d4) on dark background = 7.2:1 ratio ✓

**Focus Indicators:**
- Visible focus states on all interactive elements
- Cyan outline (2px solid #06b6d4) on focus
- Never `outline: none` without custom replacement

**Other Considerations:**
- Alt text for all images (descriptive, not decorative)
- Video captions (if videos added in Phase 2)
- Form labels properly associated with inputs

### Headless UI Accessibility

- **Dialog/Modal** (chat on mobile) - Focus trap, Escape to close, focus restoration
- **Tabs** (workflow demos) - Arrow key navigation, roving tabindex
- **Menu** (mobile nav) - Screen reader announcements, keyboard navigation

### Browser Support

**Modern Browsers (last 2 versions):**
- Chrome, Firefox, Safari, Edge

**Mobile:**
- iOS Safari 14+
- Chrome Android

**Graceful Degradation:**
- Core content accessible without JavaScript
- Chat panel shows "Enable JavaScript to chat" message if JS disabled

---

## Success Criteria

### For Employers (Job Search)

**Goals:**
- Resume/background easily discoverable via AI chat or About page
- Career timeline clearly shows progression and credibility
- Professional presentation builds trust
- Easy path to contact (LinkedIn, email, Calendly)

**Indicators:**
- AI chat queries about experience get accurate responses
- Career timeline loads < 1s
- Download resume link works
- Calendly booking completes successfully

### For Automation Clients (Lead Generation)

**Goals:**
- Workflow demos communicate value immediately (< 10 seconds to understand)
- AI chat qualifies leads effectively (budget, timeline, pain points)
- Clear CTA to book consultation
- Case studies show real, quantifiable results

**Indicators:**
- Workflow demos are interactive (zoom, pan, explore)
- AI chat asks qualifying questions within 2 interactions
- Calendly link conversion rate > 5% (of chat users)
- Case studies show metrics (hours saved, cost reduced)

### Metrics to Track (Post-Launch)

**Engagement:**
- AI chat interaction rate (% of visitors who send a message)
- Average chat session length
- Suggested question click rate

**Conversion:**
- CTA click-through rate ("Need Automation?" vs "I'm Hiring")
- Calendly booking conversion rate
- Contact form submission rate

**Content:**
- Time on site (target: 2+ minutes for engaged visitors)
- Blog traffic (organic search growth month-over-month)
- Workflow portfolio views

**Performance:**
- Core Web Vitals (monitored via Vercel Analytics)
- API response times (chat endpoint < 200ms first byte)
- Build times (< 2 minutes for full build)

---

## Future Enhancements (Phase 2 - Not MVP)

**Content Additions:**
- Testimonials/reviews section (client quotes with photos)
- Video demos of workflows (screen recordings with voiceover)
- Interactive ROI calculator ("Calculate your automation savings")
- Case study deep-dives with client logos (with permission)

**Features:**
- Newsletter signup (email capture for thought leadership content)
- Downloadable resources (workflow templates, process improvement guides)
- Webinar/event calendar (speaking engagements, workshops)
- Client portal (for active automation projects)

**Integrations:**
- Zapier/Make.com webhook for lead notifications
- Slack notification when high-value lead engages with chat
- HubSpot/CRM integration for lead tracking

**Analytics Upgrades:**
- Google Analytics 4 (more detailed funnel analysis)
- Hotjar/session recording (understand user behavior)
- A/B testing platform (optimize CTAs, headlines)

---

## Visual Design Reference

See standalone HTML previews for visual mockups:
- `preview-desktop.html` - Desktop layout with AI chat sidebar
- `preview-mobile.html` - Mobile layout with floating chat button

**Design System:**
- **Primary Color:** Electric Blue/Cyan (#06b6d4)
- **Secondary Color:** Blue (#3b82f6)
- **Background:** Very Dark (#0a0a0f)
- **Text:** Light Gray (#e5e7eb)
- **Accents:** Glassmorphism (backdrop blur), gradient orbs, pulsing animations

---

## Implementation Notes

### Placeholder Content Strategy

**Resume/Background:**
- Use real job titles, companies, dates
- Write realistic (but brief) descriptions for each role
- Include actual skills, certifications

**Workflow Demos:**
- Three real workflows from design rationale (Lead Enrichment, Content Repurposing, Meeting Notes)
- Create React Flow diagrams with 4-5 nodes each
- Write one-paragraph descriptions

**Blog Posts:**
- Create 3 placeholder posts (one per category: AI Trends, Automation, Blockchain)
- Use realistic titles and excerpts from design rationale
- ~500 words per post (enough to test layout)

**About Page:**
- Professional bio (2-3 paragraphs)
- Philosophy on automation ("give people their time back")
- Personal interests (optional, keeps it human)

### Development Phases

**Phase 1: Foundation (Week 1)**
- Initialize Next.js project with TypeScript
- Set up Tailwind CSS and design system
- Create basic page structure (all routes)
- Deploy to Vercel (preview environment)

**Phase 2: Core Features (Weeks 2-3)**
- Implement AI chat with Gemini API
- Build workflow demos with React Flow
- Create blog system with Markdown parsing
- Add TinaCMS for content management

**Phase 3: Polish & Testing (Week 4)**
- Responsive design refinement
- Accessibility audit and fixes
- Performance optimization
- Write and run tests

**Phase 4: Content & Launch (Weeks 5-6)**
- Add placeholder content (workflows, blog, about)
- SEO optimization (meta tags, sitemap, structured data)
- Final QA and bug fixes
- Production deployment with custom domain

---

## Conclusion

This design delivers a unique, dual-audience personal website that serves both job search and client acquisition goals. The always-visible AI chat differentiates it from typical portfolios, while the dark futuristic aesthetic and interactive workflow demos communicate technical sophistication.

By using placeholder content initially, we can focus on building robust functionality. Real content can be swapped in progressively through TinaCMS without code changes.

**Ready for implementation planning.**
