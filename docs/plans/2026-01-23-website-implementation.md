# Personal Website Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a dual-audience personal website with AI chat, interactive workflow demos, blog system, and content management for calebbolden.us.

**Architecture:** Next.js 14 App Router with React Server Components by default, client components for interactivity. Vercel AI SDK streams responses from Gemini API. TinaCMS manages Git-backed content. React Flow renders interactive workflow diagrams.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Headless UI, Vercel AI SDK, Gemini API, React Flow, TinaCMS, MDX

---

## Phase 1: Project Foundation

### Task 1: Initialize Next.js Project with TypeScript

**Files:**
- Create: Project initialized with create-next-app
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tailwind.config.ts`
- Create: `.gitignore`

**Step 1: Initialize Next.js project**

Run in worktree directory:
```bash
cd /Users/calebbolden/.config/superpowers/worktrees/calebbolden.com/feature/website-implementation
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*"
```

Answer prompts:
- TypeScript: Yes
- ESLint: Yes
- Tailwind CSS: Yes
- `src/` directory: No
- App Router: Yes
- Import alias: Yes (@/*)

Expected: Project scaffold created with Next.js 14, TypeScript, Tailwind CSS

**Step 2: Verify project structure**

Run: `ls -la`
Expected: See `app/`, `public/`, `package.json`, `tsconfig.json`, `tailwind.config.ts`

**Step 3: Install dependencies**

Run: `npm install`
Expected: Dependencies installed successfully

**Step 4: Verify development server**

Run: `npm run dev`
Expected: Server starts on http://localhost:3000

Stop server with Ctrl+C

**Step 5: Commit initial setup**

```bash
git add .
git commit -m "chore: initialize Next.js 14 project with TypeScript and Tailwind

- Next.js 14 with App Router
- TypeScript with strict mode
- Tailwind CSS configured
- Import alias @/* for clean imports

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 2: Install Core Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install AI SDK and Gemini provider**

Run:
```bash
npm install ai @ai-sdk/google
```

Expected: Packages installed

**Step 2: Install React Flow for workflow diagrams**

Run:
```bash
npm install reactflow
```

Expected: Package installed

**Step 3: Install Headless UI for accessible components**

Run:
```bash
npm install @headlessui/react
```

Expected: Package installed

**Step 4: Install MDX and frontmatter parsing**

Run:
```bash
npm install next-mdx-remote gray-matter
```

Expected: Packages installed

**Step 5: Install TinaCMS**

Run:
```bash
npm install tinacms
```

Expected: Package installed

**Step 6: Verify all dependencies**

Run: `npm list --depth=0`
Expected: All packages listed without errors

**Step 7: Commit dependencies**

```bash
git add package.json package-lock.json
git commit -m "chore: install core dependencies

- Vercel AI SDK with Google Gemini provider
- React Flow for interactive workflow diagrams
- Headless UI for accessible components
- MDX and gray-matter for blog content
- TinaCMS for content management

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 3: Configure Tailwind with Custom Theme

**Files:**
- Modify: `tailwind.config.ts`
- Create: `app/globals.css`

**Step 1: Update Tailwind config with design system colors**

Modify `tailwind.config.ts`:
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          cyan: '#06b6d4',
          blue: '#3b82f6',
        },
        dark: {
          base: '#0a0a0f',
          lighter: '#1a1a1f',
        },
      },
      backdropBlur: {
        'glass': '10px',
      },
    },
  },
  plugins: [],
};
export default config;
```

**Step 2: Update globals.css with base styles**

Modify `app/globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-dark-base text-gray-200;
  }
}

@layer utilities {
  .glass-morphic {
    @apply bg-dark-base/70 backdrop-blur-glass border border-primary-cyan/10;
  }

  .gradient-text {
    @apply bg-gradient-to-r from-white to-primary-cyan bg-clip-text text-transparent;
  }
}
```

**Step 3: Verify Tailwind compiles**

Run: `npm run dev`
Expected: Server starts without errors

Check: http://localhost:3000 (should see default Next.js page with dark background)

Stop server

**Step 4: Commit Tailwind configuration**

```bash
git add tailwind.config.ts app/globals.css
git commit -m "feat: configure Tailwind with custom design system

- Add primary colors (cyan, blue)
- Add dark theme colors
- Add glassmorphic utility class
- Add gradient text utility
- Configure dark background globally

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 4: Set Up Environment Variables

**Files:**
- Create: `.env.local`
- Create: `.env.example`

**Step 1: Create .env.local with placeholder values**

Create `.env.local`:
```bash
# AI Chat
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here

# TinaCMS Admin
TINA_ADMIN_PASSWORD=your_secure_password_here

# Site Config
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_CALENDLY_HIRING_URL=https://calendly.com/your-link-hiring
NEXT_PUBLIC_CALENDLY_CLIENT_URL=https://calendly.com/your-link-client

# Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS=false
```

**Step 2: Create .env.example for repository**

Create `.env.example`:
```bash
# AI Chat
GOOGLE_GENERATIVE_AI_API_KEY=

# TinaCMS Admin
TINA_ADMIN_PASSWORD=

# Site Config
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_CALENDLY_HIRING_URL=
NEXT_PUBLIC_CALENDLY_CLIENT_URL=

# Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS=
```

**Step 3: Verify .env.local is gitignored**

Run: `git check-ignore .env.local`
Expected: `.env.local` (confirms it's ignored)

**Step 4: Commit .env.example**

```bash
git add .env.example
git commit -m "chore: add environment variable template

- Gemini API key for AI chat
- TinaCMS admin password
- Calendly URLs for dual CTAs
- Site URL configuration
- Vercel Analytics flag

.env.local gitignored (contains actual secrets)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Phase 2: Core Layout Components

### Task 5: Create Root Layout with Metadata

**Files:**
- Modify: `app/layout.tsx`
- Create: `public/favicon.ico` (use default for now)

**Step 1: Update root layout with proper metadata**

Modify `app/layout.tsx`:
```typescript
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Caleb Bolden | AI Automation & Product Operations",
  description: "Product Manager at Blockdaemon. I build intelligent systems that give people their time back. 10+ years in process improvement, AI automation, and blockchain.",
  keywords: ["AI automation", "product operations", "n8n consultant", "process improvement", "blockchain product manager"],
  authors: [{ name: "Caleb Bolden" }],
  openGraph: {
    title: "Caleb Bolden | AI Automation & Product Operations",
    description: "I build intelligent systems that give people their time back.",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "Caleb Bolden",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
```

**Step 2: Verify layout renders**

Run: `npm run dev`
Check: http://localhost:3000
Expected: Page loads with dark background

Stop server

**Step 3: Commit root layout**

```bash
git add app/layout.tsx
git commit -m "feat: configure root layout with SEO metadata

- Add comprehensive meta tags
- Configure OpenGraph for social sharing
- Set up proper SEO keywords
- Dark theme applied globally

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 6: Create Header Component

**Files:**
- Create: `components/Header.tsx`

**Step 1: Create Header component**

Create `components/Header.tsx`:
```typescript
import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 md:right-[400px] z-50 glass-morphic">
      <nav className="flex justify-between items-center px-6 md:px-12 py-6 max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold gradient-text">
          CB
        </Link>

        {/* Navigation Links */}
        <ul className="hidden md:flex gap-8">
          <li>
            <Link href="/about" className="text-gray-400 hover:text-primary-cyan transition-colors">
              About
            </Link>
          </li>
          <li>
            <Link href="/workflows" className="text-gray-400 hover:text-primary-cyan transition-colors">
              Workflows
            </Link>
          </li>
          <li>
            <Link href="/blog" className="text-gray-400 hover:text-primary-cyan transition-colors">
              Blog
            </Link>
          </li>
          <li>
            <Link href="/contact" className="text-gray-400 hover:text-primary-cyan transition-colors">
              Contact
            </Link>
          </li>
        </ul>

        {/* CTAs */}
        <div className="flex gap-4">
          <button
            className="px-6 py-3 border-2 border-primary-cyan text-primary-cyan rounded-lg hover:bg-primary-cyan/10 transition-all font-semibold"
            onClick={() => {
              // Will integrate with AI chat later
              console.log('Open chat with hiring context');
            }}
          >
            I'm Hiring
          </button>
          <button
            className="hidden md:block px-6 py-3 bg-gradient-to-r from-primary-cyan to-primary-blue text-white rounded-lg hover:shadow-lg hover:shadow-primary-cyan/30 hover:-translate-y-0.5 transition-all font-semibold"
            onClick={() => {
              // Will integrate with AI chat later
              console.log('Open chat with client context');
            }}
          >
            Need Automation?
          </button>
        </div>
      </nav>
    </header>
  );
}
```

**Step 2: Test Header rendering**

Create temporary test page at `app/page.tsx`:
```typescript
import Header from '@/components/Header';

export default function Home() {
  return (
    <>
      <Header />
      <main className="pt-32 px-6">
        <h1 className="text-4xl">Header Test</h1>
      </main>
    </>
  );
}
```

**Step 3: Verify Header displays correctly**

Run: `npm run dev`
Check: http://localhost:3000
Expected:
- Header visible at top
- Logo "CB" with gradient
- Nav links visible (desktop)
- Two CTA buttons visible
- Glassmorphic background effect

Stop server

**Step 4: Commit Header component**

```bash
git add components/Header.tsx app/page.tsx
git commit -m "feat: create Header component with dual CTAs

- Glassmorphic fixed header
- Logo with gradient text
- Desktop navigation links
- Dual CTAs (I'm Hiring, Need Automation?)
- Responsive layout (desktop-first)
- Click handlers stubbed for AI chat integration

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 7: Create Footer Component

**Files:**
- Create: `components/Footer.tsx`

**Step 1: Create Footer component**

Create `components/Footer.tsx`:
```typescript
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-primary-cyan/10 mt-24 md:mr-[400px]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="text-2xl font-bold gradient-text mb-4">CB</div>
            <p className="text-gray-400 text-sm">
              Building intelligent systems that give people their time back.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-primary-cyan transition-colors text-sm">
                  About
                </Link>
              </li>
              <li>
                <Link href="/workflows" className="text-gray-400 hover:text-primary-cyan transition-colors text-sm">
                  Workflows
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-primary-cyan transition-colors text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-primary-cyan transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold text-white mb-4">Connect</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://linkedin.com/in/calebbolden"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary-cyan transition-colors text-sm"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/cbolden15"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary-cyan transition-colors text-sm"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="mailto:cbolden15@gmail.com"
                  className="text-gray-400 hover:text-primary-cyan transition-colors text-sm"
                >
                  Email
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-primary-cyan/10 text-center text-gray-500 text-sm">
          <p>&copy; {currentYear} Caleb Bolden. Built with Next.js, powered by AI.</p>
        </div>
      </div>
    </footer>
  );
}
```

**Step 2: Add Footer to test page**

Modify `app/page.tsx`:
```typescript
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main className="pt-32 px-6 min-h-screen">
        <h1 className="text-4xl">Layout Test</h1>
      </main>
      <Footer />
    </>
  );
}
```

**Step 3: Verify Footer displays correctly**

Run: `npm run dev`
Check: http://localhost:3000
Expected:
- Footer at bottom
- Three columns (Brand, Quick Links, Connect)
- Links hover to cyan
- Copyright with current year
- Right margin on desktop (space for AI chat sidebar)

Stop server

**Step 4: Commit Footer component**

```bash
git add components/Footer.tsx app/page.tsx
git commit -m "feat: create Footer component with links

- Three-column layout (Brand, Links, Social)
- Quick navigation links
- Social links (LinkedIn, GitHub, Email)
- Copyright with dynamic year
- Responsive margin for AI chat sidebar

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Phase 3: Homepage Sections

### Task 8: Create Hero Section Component

**Files:**
- Create: `components/Hero.tsx`

**Step 1: Create Hero component**

Create `components/Hero.tsx`:
```typescript
export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center px-6 md:px-12 py-24 relative">
      {/* Background gradient orbs */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-primary-cyan rounded-full blur-[100px] opacity-15 pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-primary-blue rounded-full blur-[100px] opacity-15 pointer-events-none -z-10" />

      {/* Content */}
      <div className="max-w-4xl">
        {/* Tagline chips */}
        <div className="flex flex-wrap gap-4 mb-8">
          <span className="px-4 py-2 bg-primary-cyan/10 border border-primary-cyan/30 rounded-full text-sm text-primary-cyan">
            Product Operations
          </span>
          <span className="px-4 py-2 bg-primary-cyan/10 border border-primary-cyan/30 rounded-full text-sm text-primary-cyan">
            AI Automation
          </span>
          <span className="px-4 py-2 bg-primary-cyan/10 border border-primary-cyan/30 rounded-full text-sm text-primary-cyan">
            Process Improvement
          </span>
        </div>

        {/* Main headline */}
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
          <span className="gradient-text">
            I build intelligent systems that give people their time back.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl">
          Product Manager at Blockdaemon with 10+ years optimizing operations at scale.
          Lean Six Sigma certified. Building the future of automated workflows.
        </p>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-8 max-w-2xl p-8 bg-primary-cyan/5 border border-primary-cyan/10 rounded-xl">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary-cyan mb-2">10+</div>
            <div className="text-sm text-gray-400">Years Experience</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary-cyan mb-2">50+</div>
            <div className="text-sm text-gray-400">Workflows Built</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary-cyan mb-2">$2M+</div>
            <div className="text-sm text-gray-400">Process Savings</div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Add Hero to homepage**

Modify `app/page.tsx`:
```typescript
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main className="md:mr-[400px]">
        <Hero />
      </main>
      <Footer />
    </>
  );
}
```

**Step 3: Verify Hero section**

Run: `npm run dev`
Check: http://localhost:3000
Expected:
- Full-height hero section
- Gradient orbs in background (subtle)
- Three tagline chips
- Large gradient headline
- Stats bar with three metrics
- Responsive text sizes

Stop server

**Step 4: Commit Hero component**

```bash
git add components/Hero.tsx app/page.tsx
git commit -m "feat: create Hero section with headline and stats

- Full-screen hero layout
- Gradient background orbs
- Tagline chips (3 key areas)
- Gradient headline text
- Subheadline with credentials
- Stats bar (experience, workflows, savings)
- Responsive typography

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 9: Create WorkflowDemo Component (Basic Structure)

**Files:**
- Create: `components/WorkflowDemo.tsx`

**Step 1: Create basic WorkflowDemo component**

Create `components/WorkflowDemo.tsx`:
```typescript
'use client';

import { useState } from 'react';

type WorkflowTab = 'lead-enrichment' | 'content-repurposing' | 'meeting-notes';

export default function WorkflowDemo() {
  const [activeTab, setActiveTab] = useState<WorkflowTab>('lead-enrichment');

  const workflows = {
    'lead-enrichment': {
      title: 'Lead Enrichment',
      description: 'Automatically research and score new leads',
      nodes: ['New Lead', 'Enrich Data', 'Score Lead', 'Notify Team']
    },
    'content-repurposing': {
      title: 'Content Repurposing',
      description: 'Turn one blog post into multi-platform content',
      nodes: ['Publish Post', 'AI Summary', 'Social Posts', 'Schedule']
    },
    'meeting-notes': {
      title: 'Meeting Notes',
      description: 'Record, transcribe, and extract action items',
      nodes: ['Record', 'Transcribe', 'Extract Tasks', 'Create Tickets']
    }
  };

  const currentWorkflow = workflows[activeTab];

  return (
    <section className="px-6 md:px-12 py-24 bg-primary-cyan/3 rounded-xl my-16">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          See Automation in Action
        </h2>
        <p className="text-xl text-gray-400 mb-12">
          Real-world workflows that eliminate manual work and drive results
        </p>

        {/* Tabs */}
        <div className="flex flex-wrap gap-4 mb-8 border-b border-primary-cyan/10 pb-4">
          {(Object.keys(workflows) as WorkflowTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-primary-cyan/10 border border-primary-cyan text-primary-cyan'
                  : 'border border-primary-cyan/20 text-gray-400 hover:border-primary-cyan/40'
              }`}
            >
              {workflows[tab].title}
            </button>
          ))}
        </div>

        {/* Workflow Canvas - Simplified for now, will add React Flow later */}
        <div className="h-96 bg-dark-lighter/50 border border-primary-cyan/10 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-primary-cyan mb-2">
            {currentWorkflow.title}
          </h3>
          <p className="text-gray-400 mb-8">{currentWorkflow.description}</p>

          {/* Simple node visualization */}
          <div className="flex items-center justify-center gap-8 mt-12">
            {currentWorkflow.nodes.map((node, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="px-6 py-4 bg-primary-cyan/10 border-2 border-primary-cyan rounded-lg text-primary-cyan font-semibold animate-pulse">
                  {node}
                </div>
                {index < currentWorkflow.nodes.length - 1 && (
                  <div className="w-12 h-0.5 bg-gradient-to-r from-primary-cyan to-primary-blue relative">
                    <div className="absolute right-0 top-[-4px] w-0 h-0 border-l-[8px] border-l-primary-blue border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Add WorkflowDemo to homepage**

Modify `app/page.tsx`:
```typescript
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import WorkflowDemo from '@/components/WorkflowDemo';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main className="md:mr-[400px]">
        <Hero />
        <WorkflowDemo />
      </main>
      <Footer />
    </>
  );
}
```

**Step 3: Verify WorkflowDemo displays**

Run: `npm run dev`
Check: http://localhost:3000
Expected:
- Workflow section below hero
- Three tabs (Lead Enrichment, Content Repurposing, Meeting Notes)
- Clicking tabs switches workflow
- Simple node visualization with arrows
- Pulsing animation on nodes

Stop server

**Step 4: Commit WorkflowDemo component**

```bash
git add components/WorkflowDemo.tsx app/page.tsx
git commit -m "feat: create WorkflowDemo component with tabs

- Client component with tab state
- Three workflow examples
- Tab switching functionality
- Simplified node visualization (React Flow integration later)
- Pulsing node animations
- Responsive layout

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 10: Create CareerTimeline Component

**Files:**
- Create: `components/CareerTimeline.tsx`

**Step 1: Create CareerTimeline component**

Create `components/CareerTimeline.tsx`:
```typescript
export default function CareerTimeline() {
  const experiences = [
    {
      current: true,
      period: '2023 - Present',
      title: 'Product Manager',
      company: 'Blockdaemon',
      description: 'Leading product operations for blockchain infrastructure platform. Driving automation initiatives across deployment and monitoring workflows.'
    },
    {
      current: false,
      period: '2018 - 2023',
      title: 'Sr. Operations Analyst',
      company: 'US Bank / Elavon',
      description: 'Optimized payment processing operations. Implemented Lean Six Sigma methodologies reducing processing time by 40%.'
    },
    {
      current: false,
      period: '2013 - 2018',
      title: 'Process Improvement Specialist',
      company: 'TSYS',
      description: 'Led cross-functional process improvement initiatives. Achieved $1.5M annual savings through workflow optimization.'
    }
  ];

  return (
    <section className="px-6 md:px-12 py-24">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Career Journey
        </h2>
        <p className="text-xl text-gray-400 mb-12">
          From financial services to blockchain product management
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className={`p-8 rounded-xl border transition-all hover:border-primary-cyan hover:-translate-y-2 ${
                exp.current
                  ? 'bg-gradient-to-br from-primary-cyan/10 to-primary-blue/10 border-primary-cyan'
                  : 'bg-primary-cyan/5 border-primary-cyan/10'
              }`}
            >
              <div className="text-sm font-semibold text-primary-cyan mb-4">
                {exp.period}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {exp.title}
              </h3>
              <div className="text-gray-400 mb-4">
                {exp.company}
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                {exp.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Add CareerTimeline to homepage**

Modify `app/page.tsx`:
```typescript
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import WorkflowDemo from '@/components/WorkflowDemo';
import CareerTimeline from '@/components/CareerTimeline';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main className="md:mr-[400px]">
        <Hero />
        <WorkflowDemo />
        <CareerTimeline />
      </main>
      <Footer />
    </>
  );
}
```

**Step 3: Verify CareerTimeline displays**

Run: `npm run dev`
Check: http://localhost:3000
Expected:
- Career section below workflows
- Three cards (Blockdaemon current, US Bank, TSYS)
- Current role has gradient background
- Cards hover with translation effect
- Responsive three-column grid

Stop server

**Step 4: Commit CareerTimeline component**

```bash
git add components/CareerTimeline.tsx app/page.tsx
git commit -m "feat: create CareerTimeline component

- Three career cards (Blockdaemon, US Bank, TSYS)
- Current role highlighted with gradient
- Hover effects with translation
- Period, title, company, description
- Responsive grid layout

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 11: Create BlogPreview Component

**Files:**
- Create: `components/BlogPreview.tsx`

**Step 1: Create BlogPreview component**

Create `components/BlogPreview.tsx`:
```typescript
import Link from 'next/link';

export default function BlogPreview() {
  const posts = [
    {
      slug: 'ai-agents-2026',
      category: 'AI Trends',
      date: 'January 15, 2026',
      title: 'The State of AI Agents in 2026',
      excerpt: 'Analyzing the shift from chatbots to autonomous agents and what it means for business automation...'
    },
    {
      slug: 'beyond-rpa',
      category: 'Automation',
      date: 'January 10, 2026',
      title: 'Beyond RPA: Next-Gen Workflows',
      excerpt: 'Why traditional RPA is dying and what intelligent automation looks like in practice...'
    },
    {
      slug: 'enterprise-blockchain',
      category: 'Blockchain',
      date: 'January 5, 2026',
      title: 'Enterprise Blockchain: Lessons Learned',
      excerpt: 'Three years at Blockdaemon taught me these hard truths about deploying blockchain in production...'
    }
  ];

  return (
    <section className="px-6 md:px-12 py-24">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Latest Insights
        </h2>
        <p className="text-xl text-gray-400 mb-12">
          Analysis, trends, and technical deep-dives
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block p-8 bg-primary-cyan/5 border border-primary-cyan/10 rounded-xl hover:border-primary-cyan hover:-translate-y-2 transition-all"
            >
              <span className="inline-block px-3 py-1 bg-primary-cyan/10 border border-primary-cyan/30 rounded-full text-xs text-primary-cyan mb-4">
                {post.category}
              </span>
              <div className="text-sm text-gray-500 mb-4">
                {post.date}
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary-cyan transition-colors">
                {post.title}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                {post.excerpt}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Add BlogPreview to homepage**

Modify `app/page.tsx`:
```typescript
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import WorkflowDemo from '@/components/WorkflowDemo';
import CareerTimeline from '@/components/CareerTimeline';
import BlogPreview from '@/components/BlogPreview';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main className="md:mr-[400px]">
        <Hero />
        <WorkflowDemo />
        <CareerTimeline />
        <BlogPreview />
      </main>
      <Footer />
    </>
  );
}
```

**Step 3: Verify BlogPreview displays**

Run: `npm run dev`
Check: http://localhost:3000
Expected:
- Blog section below career timeline
- Three blog post cards
- Category tags
- Hover effects (border color, translation, title color)
- Links to /blog/[slug]

Stop server

**Step 4: Commit BlogPreview component**

```bash
git add components/BlogPreview.tsx app/page.tsx
git commit -m "feat: create BlogPreview component

- Three placeholder blog posts
- Category tags (AI Trends, Automation, Blockchain)
- Date and excerpt display
- Hover effects with translation
- Links to blog post pages
- Responsive grid layout

Homepage now complete with all sections!

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Phase 4: AI Chat Implementation

### Task 12: Create System Prompt Configuration

**Files:**
- Create: `lib/chat/system-prompt.ts`

**Step 1: Create system prompt with resume and context**

Create `lib/chat/system-prompt.ts`:
```typescript
export const systemPrompt = `You are an AI assistant representing Caleb Bolden, a Product Manager and automation specialist. You have access to his complete background and can answer questions about his experience, skills, and services.

## About Caleb

**Current Role:**
Product Manager at Blockdaemon (2023 - Present)
- Leading product operations for blockchain infrastructure platform
- Driving automation initiatives across deployment and monitoring workflows

**Previous Experience:**
- Sr. Operations Analyst at US Bank / Elavon (2018-2023): Optimized payment processing, implemented Lean Six Sigma reducing processing time 40%
- Process Improvement Specialist at TSYS (2013-2018): Led process improvements achieving $1.5M annual savings

**Skills & Certifications:**
- Lean Six Sigma certified
- 10+ years experience in process improvement and operations
- AI automation and workflow design (n8n, Zapier, Make.com)
- Product operations and management
- Blockchain and Web3 product development

**Services Offered (For Automation Clients):**
- n8n workflow automation
- AI-powered process optimization
- Lead enrichment automation
- Content repurposing workflows
- Meeting notes and transcription automation
- Custom automation consulting

**Workflow Examples:**
1. Lead Enrichment: Automatically research and score new leads with AI
2. Content Repurposing: Turn blog posts into multi-platform content
3. Meeting Notes: Record, transcribe, extract action items automatically

**Calendly Links:**
- For hiring managers: [Will be set via environment variable]
- For automation clients: [Will be set via environment variable]

## How to Respond

**For "I'm Hiring" Context:**
- Focus on employment history, skills, and experience
- Highlight relevant project management and technical skills
- Offer resume download and LinkedIn profile
- Suggest scheduling a call to discuss the role

**For "Need Automation?" Context:**
- Focus on services, workflow examples, and business value
- Ask qualifying questions: budget range, timeline, pain points
- Share relevant case studies or workflow examples
- Suggest scheduling a 30-min consultation via Calendly

**General Guidelines:**
- Be professional but conversational
- Ask clarifying questions when needed
- Provide specific examples and metrics when possible
- Always offer next steps (Calendly, resume, LinkedIn)
- Keep responses concise (2-3 paragraphs max)`;

export function getSystemPrompt(context?: 'hiring' | 'automation'): string {
  if (context === 'hiring') {
    return systemPrompt + '\n\n**IMPORTANT:** This visitor clicked "I\'m Hiring" - they are a potential employer. Focus on employment-related questions.';
  }

  if (context === 'automation') {
    return systemPrompt + '\n\n**IMPORTANT:** This visitor clicked "Need Automation?" - they are a potential client. Focus on services and qualifying their needs.';
  }

  return systemPrompt;
}
```

**Step 2: Verify file compiles**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit system prompt**

```bash
git add lib/chat/system-prompt.ts
git commit -m "feat: create AI chat system prompt

- Complete background (Blockdaemon, US Bank, TSYS)
- Skills and certifications
- Service offerings for clients
- Workflow examples
- Context-aware prompts (hiring vs automation)
- Response guidelines

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 13: Create Chat API Route

**Files:**
- Create: `app/api/chat/route.ts`

**Step 1: Create chat API endpoint with Gemini**

Create `app/api/chat/route.ts`:
```typescript
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { getSystemPrompt } from '@/lib/chat/system-prompt';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, context } = await req.json();

    // Get context-aware system prompt
    const systemPrompt = getSystemPrompt(context as 'hiring' | 'automation' | undefined);

    // Stream response from Gemini
    const result = await streamText({
      model: google('models/gemini-1.5-flash-latest'),
      system: systemPrompt,
      messages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process chat request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
```

**Step 2: Verify API route compiles**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Test API route (requires Gemini API key)**

Note: This will fail without a valid API key, but we can verify the route exists

Run: `npm run dev`

Test with curl:
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hello"}]}'
```

Expected: 500 error (API key not configured) OR streaming response if key is set

Stop server

**Step 4: Commit chat API route**

```bash
git add app/api/chat/route.ts
git commit -m "feat: create chat API route with Gemini streaming

- POST endpoint at /api/chat
- Vercel AI SDK streamText integration
- Gemini 1.5 Flash model
- Context-aware system prompts
- Error handling
- 30s max duration for streaming

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 14: Create AI Chat Component (Desktop/Mobile)

**Files:**
- Create: `components/AIChat.tsx`

**Step 1: Create AIChat client component**

Create `components/AIChat.tsx`:
```typescript
'use client';

import { useChat } from 'ai/react';
import { useState } from 'react';

type ChatContext = 'hiring' | 'automation' | undefined;

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [context, setContext] = useState<ChatContext>(undefined);

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    body: { context },
  });

  const suggestedQuestions = [
    "💼 What's Caleb's experience with AI automation?",
    "🛠️ Can you show me examples of workflows he's built?",
    "📊 What's his background in process improvement?",
    "🚀 How can Caleb help my business?",
  ];

  // Desktop: always visible sidebar
  // Mobile: modal triggered by FAB
  return (
    <>
      {/* Mobile: Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-primary-cyan to-primary-blue rounded-full shadow-lg shadow-primary-cyan/40 flex items-center justify-center text-3xl z-50 animate-pulse"
      >
        💬
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-dark-base" />
      </button>

      {/* Chat Panel */}
      <aside
        className={`
          fixed top-0 right-0 h-screen w-full md:w-[400px]
          bg-dark-base/90 backdrop-blur-glass border-l border-primary-cyan/20
          flex flex-col z-[200]
          transition-transform duration-300
          ${isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="p-6 border-b border-primary-cyan/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
              <h2 className="text-xl font-bold text-white">Ask Me Anything</h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="md:hidden text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          <p className="text-sm text-gray-400">
            I know Caleb's background, projects, and experience
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <>
              <div className="p-4 bg-primary-cyan/10 border border-primary-cyan/20 rounded-lg text-sm text-gray-300">
                👋 Hi! I'm here to answer any questions about Caleb's experience, skills, or projects.
                What would you like to know?
              </div>
              <div className="space-y-3">
                {suggestedQuestions.map((question, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      handleInputChange({
                        target: { value: question.replace(/^[^\s]+\s/, '') }
                      } as any);
                    }}
                    className="w-full text-left p-3 bg-primary-cyan/5 border border-primary-cyan/20 rounded-lg text-sm text-gray-400 hover:bg-primary-cyan/10 hover:border-primary-cyan hover:text-primary-cyan transition-all"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`p-4 rounded-lg text-sm ${
                  message.role === 'user'
                    ? 'bg-primary-blue/10 border border-primary-blue/20 ml-8'
                    : 'bg-primary-cyan/10 border border-primary-cyan/20'
                }`}
              >
                {message.content}
              </div>
            ))
          )}
          {isLoading && (
            <div className="p-4 bg-primary-cyan/10 border border-primary-cyan/20 rounded-lg text-sm text-gray-400">
              Thinking...
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-6 border-t border-primary-cyan/20">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Type your question..."
            className="w-full px-4 py-3 bg-primary-cyan/5 border border-primary-cyan/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-cyan focus:bg-primary-cyan/10"
          />
        </form>
      </aside>
    </>
  );
}

// Export function to open chat with context
export function openChatWithContext(ctx: ChatContext) {
  // This will be called by Header CTA buttons
  const event = new CustomEvent('open-chat', { detail: { context: ctx } });
  window.dispatchEvent(event);
}
```

**Step 2: Add AIChat to root layout**

Modify `app/layout.tsx`:
```typescript
import type { Metadata } from "next";
import "./globals.css";
import AIChat from "@/components/AIChat";

export const metadata: Metadata = {
  title: "Caleb Bolden | AI Automation & Product Operations",
  description: "Product Manager at Blockdaemon. I build intelligent systems that give people their time back. 10+ years in process improvement, AI automation, and blockchain.",
  keywords: ["AI automation", "product operations", "n8n consultant", "process improvement", "blockchain product manager"],
  authors: [{ name: "Caleb Bolden" }],
  openGraph: {
    title: "Caleb Bolden | AI Automation & Product Operations",
    description: "I build intelligent systems that give people their time back.",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "Caleb Bolden",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <AIChat />
      </body>
    </html>
  );
}
```

**Step 3: Verify AIChat displays**

Run: `npm run dev`
Check: http://localhost:3000
Expected:
- Desktop: Chat sidebar visible on right (400px width)
- Mobile: Floating button bottom-right
- Header with "Ask Me Anything" and online indicator
- Suggested questions displayed
- Input field at bottom

Click floating button on mobile size (resize browser):
- Chat modal opens
- X button closes it

Stop server

**Step 4: Commit AIChat component**

```bash
git add components/AIChat.tsx app/layout.tsx
git commit -m "feat: create AIChat component with responsive design

- Client component using useChat hook
- Desktop: fixed sidebar (always visible)
- Mobile: floating button + modal
- Suggested questions for engagement
- Message display with role-based styling
- Context support (hiring vs automation)
- Online indicator animation
- Vercel AI SDK integration

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Phase 5: Content System (Blog & Workflows)

### Task 15: Create Content Directory Structure

**Files:**
- Create: `content/blog/.gitkeep`
- Create: `content/workflows/.gitkeep`
- Create: `content/pages/.gitkeep`

**Step 1: Create content directories**

Run:
```bash
mkdir -p content/blog content/workflows content/pages
touch content/blog/.gitkeep content/workflows/.gitkeep content/pages/.gitkeep
```

Expected: Directories created

**Step 2: Create placeholder blog posts**

Create `content/blog/ai-agents-2026.md`:
```markdown
---
title: "The State of AI Agents in 2026"
date: "2026-01-15"
category: "AI Trends"
excerpt: "Analyzing the shift from chatbots to autonomous agents and what it means for business automation."
featured: true
tags: ["AI", "automation", "agents", "2026"]
---

# The State of AI Agents in 2026

The AI landscape has fundamentally shifted in the past 18 months. We've moved from simple chatbots to sophisticated autonomous agents that can complete multi-step tasks without human intervention.

## From Chat to Action

Traditional chatbots were conversational interfaces—they could understand and respond to text, but couldn't take action in the real world. Today's AI agents are different. They can:

- Read emails and draft responses
- Research leads and update CRMs
- Monitor systems and trigger alerts
- Generate content and schedule posts
- Coordinate with other agents

## What This Means for Business

For businesses, this shift is revolutionary. Tasks that previously required human oversight can now run autonomously with agents checking in only when exceptions occur.

**Example:** A lead enrichment workflow that once required a salesperson to manually research each prospect can now run completely autonomously, with an agent researching company data, scoring lead quality, and routing high-value prospects to the right team member.

## The Automation Opportunity

Companies that embrace autonomous agents will gain a significant competitive advantage:

1. **Speed:** Agents work 24/7 without breaks
2. **Consistency:** Every lead gets the same thorough research
3. **Scale:** Handle 100x more leads with the same team
4. **Focus:** Sales teams spend time selling, not researching

## Getting Started

The barrier to entry has never been lower. Tools like n8n, Make.com, and Zapier now integrate with AI models via API, making it possible to build autonomous workflows without writing code.

**Key recommendation:** Start small. Pick one repetitive task, build an agent to handle it, measure the impact, then expand.

The age of autonomous agents is here. The question isn't whether to adopt them, but how quickly you can deploy them to stay competitive.
```

Create `content/blog/beyond-rpa.md`:
```markdown
---
title: "Beyond RPA: Next-Gen Workflows"
date: "2026-01-10"
category: "Automation"
excerpt: "Why traditional RPA is dying and what intelligent automation looks like in practice."
featured: false
tags: ["RPA", "automation", "workflows", "AI"]
---

# Beyond RPA: Next-Gen Workflows

Traditional Robotic Process Automation (RPA) promised to automate repetitive tasks. But in practice, it's proven brittle, expensive to maintain, and limited in scope. A new generation of intelligent automation is replacing it.

## The RPA Problem

RPA tools automate by recording and replaying user actions—clicking buttons, entering data, copying information between systems. This works until:

- The UI changes (breaking the automation)
- An exception occurs (requiring human intervention)
- The process involves judgment (RPA can't decide)

Companies that invested millions in RPA are finding 40-60% of bots break within months, requiring constant maintenance from expensive specialists.

## Intelligent Automation: A Different Approach

Next-gen automation combines AI models with workflow engines to create truly intelligent systems:

**Instead of clicking through UIs**, modern workflows use APIs
**Instead of brittle rules**, AI makes contextual decisions
**Instead of breaking on exceptions**, systems adapt and learn

## Real Example: Lead Enrichment

**RPA Approach:**
1. Bot opens browser
2. Searches company on LinkedIn
3. Copies data to CRM
4. Repeats for each lead

**Problems:** Breaks when LinkedIn updates, can't handle ambiguous company names, requires constant supervision

**Intelligent Approach:**
1. API fetches company data
2. AI scores lead quality based on context
3. Workflow routes to appropriate team member
4. System learns from feedback

**Results:** Runs autonomously 24/7, adapts to edge cases, improves over time

## The Shift

The automation market is consolidating around platforms that combine:
- Workflow orchestration (n8n, Make, Zapier)
- AI/ML capabilities (OpenAI, Anthropic, Google)
- API integrations (10,000+ connectors)

This combination is more powerful and maintainable than traditional RPA, at a fraction of the cost.

## What to Do

If you're still using RPA:
1. Identify which bots break most often
2. Rebuild them using API-based workflows
3. Add AI for decision-making
4. Measure maintenance hours saved

The future of automation isn't robots clicking through UIs—it's intelligent workflows that adapt and evolve.
```

Create `content/blog/enterprise-blockchain.md`:
```markdown
---
title: "Enterprise Blockchain: Lessons Learned"
date: "2026-01-05"
category: "Blockchain"
excerpt: "Three years at Blockdaemon taught me these hard truths about deploying blockchain in production."
featured: false
tags: ["blockchain", "Web3", "enterprise", "infrastructure"]
---

# Enterprise Blockchain: Lessons Learned

After three years building product at Blockdaemon, I've learned that successful blockchain deployments look nothing like the hype cycle promised. Here's what actually works.

## Lesson 1: Infrastructure Complexity Is Real

Running blockchain nodes in production isn't like deploying a web app. It requires:

- **24/7 monitoring:** Nodes go offline, sync fails, forks occur
- **Multi-region redundancy:** Single points of failure are unacceptable
- **Performance tuning:** Stock configurations rarely work at scale
- **Security hardening:** You're managing keys to significant value

Most enterprises underestimate this 10x. They assume spinning up a node is like launching an EC2 instance. It's not.

## Lesson 2: Start with Private Chains

Every enterprise wants to deploy on public mainnet for "true decentralization." Don't.

**Start with:**
- Private consortium chains for internal workflows
- Permissioned networks for B2B processes
- Testnet deployments for product validation

**Graduate to public chains** only when you've proven the use case, built the operational expertise, and secured executive buy-in for gas costs.

## Lesson 3: The Use Case Must Justify Complexity

Blockchain adds significant complexity. The use case must genuinely benefit from:

1. **Immutability:** Audit trails that can't be altered
2. **Decentralization:** No single party controls the system
3. **Transparency:** All participants see the same data

If a PostgreSQL database solves your problem, use PostgreSQL. Blockchain isn't a solution looking for a problem—it's a tool for specific scenarios.

## Real Success Stories

**What Works:**
- Supply chain provenance (tracking goods across untrusted parties)
- Cross-border payments (eliminating intermediaries)
- Digital asset custody (securing high-value tokens)
- Decentralized identity (user-controlled credentials)

**What Doesn't:**
- "Blockchain for efficiency" (it's slower than databases)
- Internal-only use cases (you don't need decentralization)
- Projects without clear business metrics (ROI matters)

## The Product Manager's Role

At Blockdaemon, my job wasn't to evangelize blockchain—it was to make it usable for enterprises that had already decided to deploy.

**Key responsibilities:**
1. Translate technical complexity into business value
2. Build infrastructure that "just works" (monitoring, alerts, failover)
3. Create deployment workflows that don't require blockchain PhDs
4. Measure and communicate ROI beyond "we use blockchain"

## Advice for Product Managers

If you're building blockchain products:

1. **Manage expectations:** It's infrastructure, not magic
2. **Invest in DevOps:** Operations make or break production deployments
3. **Measure real metrics:** Uptime, transaction throughput, cost-per-transaction
4. **Build for enterprises:** They need security, support, and SLAs

The hype cycle is over. Now it's about building boring, reliable infrastructure that happens to use blockchain.

That's where the real opportunity is.
```

**Step 3: Verify files created**

Run: `ls -la content/blog/`
Expected: Three .md files

**Step 4: Commit content structure**

```bash
git add content/
git commit -m "feat: create content directory structure

- content/blog/ for blog posts
- content/workflows/ for case studies
- content/pages/ for static pages
- Three placeholder blog posts with full content

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 16: Create Blog Data Loading Utilities

**Files:**
- Create: `lib/blog/getBlogPosts.ts`

**Step 1: Create blog data loading utility**

Create `lib/blog/getBlogPosts.ts`:
```typescript
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'content/blog');

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  featured: boolean;
  tags: string[];
  content: string;
}

export function getAllBlogPosts(): BlogPost[] {
  // Get all markdown files
  const fileNames = fs.readdirSync(postsDirectory);

  const posts = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      // Parse frontmatter
      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title,
        date: data.date,
        category: data.category,
        excerpt: data.excerpt,
        featured: data.featured || false,
        tags: data.tags || [],
        content,
      };
    });

  // Sort by date (newest first)
  return posts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

export function getBlogPost(slug: string): BlogPost | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title,
      date: data.date,
      category: data.category,
      excerpt: data.excerpt,
      featured: data.featured || false,
      tags: data.tags || [],
      content,
    };
  } catch {
    return null;
  }
}
```

**Step 2: Verify utility compiles**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit blog utilities**

```bash
git add lib/blog/getBlogPosts.ts
git commit -m "feat: create blog data loading utilities

- getAllBlogPosts() reads and parses all blog posts
- getBlogPost(slug) fetches individual post
- Frontmatter parsing with gray-matter
- Sort by date (newest first)
- Type-safe BlogPost interface

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 17: Create Blog Listing Page

**Files:**
- Create: `app/blog/page.tsx`

**Step 1: Create blog listing page**

Create `app/blog/page.tsx`:
```typescript
import { getAllBlogPosts } from '@/lib/blog/getBlogPosts';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Blog | Caleb Bolden',
  description: 'Insights on AI automation, process improvement, and blockchain technology.',
};

export default function BlogPage() {
  const posts = getAllBlogPosts();

  return (
    <>
      <Header />
      <main className="md:mr-[400px] pt-32 px-6 md:px-12 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-4">
            Blog
          </h1>
          <p className="text-xl text-gray-400 mb-16">
            Insights on AI automation, process improvement, and blockchain technology
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block p-8 bg-primary-cyan/5 border border-primary-cyan/10 rounded-xl hover:border-primary-cyan hover:-translate-y-2 transition-all"
              >
                <span className="inline-block px-3 py-1 bg-primary-cyan/10 border border-primary-cyan/30 rounded-full text-xs text-primary-cyan mb-4">
                  {post.category}
                </span>
                <div className="text-sm text-gray-500 mb-4">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary-cyan transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {post.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
```

**Step 2: Verify blog listing page**

Run: `npm run dev`
Check: http://localhost:3000/blog
Expected:
- Blog page with header
- Three blog post cards
- Category tags
- Formatted dates
- Hover effects

Stop server

**Step 3: Commit blog listing page**

```bash
git add app/blog/page.tsx
git commit -m "feat: create blog listing page

- Server component fetches all blog posts
- Grid layout (responsive)
- Category tags and formatted dates
- Links to individual post pages
- SEO metadata

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 18: Create Blog Post Page

**Files:**
- Create: `app/blog/[slug]/page.tsx`

**Step 1: Create dynamic blog post page**

Create `app/blog/[slug]/page.tsx`:
```typescript
import { getBlogPost, getAllBlogPosts } from '@/lib/blog/getBlogPosts';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export async function generateStaticParams() {
  const posts = getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} | Caleb Bolden`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      tags: post.tags,
    },
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="md:mr-[400px] pt-32 px-6 md:px-12 min-h-screen">
        <article className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <Link
            href="/blog"
            className="text-primary-cyan hover:underline mb-8 inline-block"
          >
            ← Back to Blog
          </Link>

          {/* Header */}
          <header className="mb-12">
            <span className="inline-block px-3 py-1 bg-primary-cyan/10 border border-primary-cyan/30 rounded-full text-xs text-primary-cyan mb-4">
              {post.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {post.title}
            </h1>
            <div className="text-gray-400">
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-invert prose-cyan max-w-none">
            <MDXRemote source={post.content} />
          </div>

          {/* Tags */}
          <div className="mt-12 pt-8 border-t border-primary-cyan/10">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-primary-cyan/5 border border-primary-cyan/20 rounded-full text-xs text-gray-400"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
```

**Step 2: Add Tailwind Typography plugin**

Run:
```bash
npm install @tailwindcss/typography
```

**Step 3: Update Tailwind config**

Modify `tailwind.config.ts`:
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          cyan: '#06b6d4',
          blue: '#3b82f6',
        },
        dark: {
          base: '#0a0a0f',
          lighter: '#1a1a1f',
        },
      },
      backdropBlur: {
        'glass': '10px',
      },
      typography: {
        invert: {
          css: {
            '--tw-prose-body': '#e5e7eb',
            '--tw-prose-headings': '#ffffff',
            '--tw-prose-links': '#06b6d4',
            '--tw-prose-bold': '#ffffff',
            '--tw-prose-code': '#06b6d4',
            '--tw-prose-quotes': '#9ca3af',
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
export default config;
```

**Step 4: Verify blog post page**

Run: `npm run dev`
Check: http://localhost:3000/blog/ai-agents-2026
Expected:
- Blog post with full content
- MDX rendered as styled HTML
- Category tag, date, title
- Breadcrumb link back to blog
- Tags at bottom
- Proper typography styling

Stop server

**Step 5: Commit blog post page**

```bash
git add app/blog/[slug]/page.tsx tailwind.config.ts package.json package-lock.json
git commit -m "feat: create dynamic blog post page

- Dynamic route [slug] with static generation
- MDX rendering with next-mdx-remote
- Tailwind Typography plugin for styled prose
- SEO metadata per post
- Breadcrumb navigation
- Category tag and tags display
- 404 handling for missing posts

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Phase 6: Remaining Pages & Deployment

### Task 19: Create About Page

**Files:**
- Create: `app/about/page.tsx`

**Step 1: Create About page**

Create `app/about/page.tsx`:
```typescript
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'About | Caleb Bolden',
  description: 'Product Manager and automation specialist with 10+ years optimizing operations at scale.',
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="md:mr-[400px] pt-32 px-6 md:px-12 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-8">
            About Me
          </h1>

          <div className="prose prose-invert prose-cyan max-w-none">
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              I build intelligent systems that give people their time back. That's not just a tagline—it's
              the lens through which I evaluate every automation project, product decision, and process improvement.
            </p>

            <h2 className="text-3xl font-bold text-white mt-12 mb-4">Background</h2>
            <p className="text-gray-300 leading-relaxed">
              I'm currently a Product Manager at Blockdaemon, where I lead product operations for our blockchain
              infrastructure platform. Before entering the Web3 space, I spent nearly a decade in financial services
              at US Bank, Elavon, and TSYS—running operations, optimizing processes, and earning my Lean Six Sigma
              certification along the way.
            </p>

            <h2 className="text-3xl font-bold text-white mt-12 mb-4">Philosophy</h2>
            <p className="text-gray-300 leading-relaxed">
              Most automation conversations focus on ROI, efficiency gains, and cost reduction. Those metrics matter,
              but they miss the point. The real value of automation isn't just making businesses run better—it's
              giving people their time back to focus on work that actually requires human judgment, creativity, and empathy.
            </p>
            <p className="text-gray-300 leading-relaxed">
              When I design a workflow that eliminates 10 hours of manual lead research per week, I'm not just
              optimizing a process—I'm giving a sales team 10 hours back to have meaningful conversations with prospects.
              That's the goal: less time on repetitive tasks, more time on work that matters.
            </p>

            <h2 className="text-3xl font-bold text-white mt-12 mb-4">What I Do</h2>
            <p className="text-gray-300 leading-relaxed">
              I help businesses implement intelligent automation using tools like n8n, Make.com, and modern AI APIs.
              My specialty is combining workflow orchestration with AI to create systems that don't just execute
              rules—they adapt, learn, and handle exceptions.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Common projects include lead enrichment workflows, content repurposing systems, meeting transcription
              and action item extraction, and custom automation consulting for specific business processes.
            </p>

            <h2 className="text-3xl font-bold text-white mt-12 mb-4">Let's Work Together</h2>
            <p className="text-gray-300 leading-relaxed">
              Whether you're looking to hire a Product Operations specialist or need automation consulting for your
              business, I'd love to chat. Use the AI assistant on this site to ask questions about my background,
              or schedule a consultation directly.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
```

**Step 2: Verify About page**

Run: `npm run dev`
Check: http://localhost:3000/about
Expected:
- About page with header
- Styled prose content
- Professional bio
- Philosophy section
- CTA at bottom

Stop server

**Step 3: Commit About page**

```bash
git add app/about/page.tsx
git commit -m "feat: create About page

- Professional bio
- Background, philosophy, services
- Styled with Tailwind Typography
- SEO metadata
- CTA to work together

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 20: Create Placeholder Workflows and Contact Pages

**Files:**
- Create: `app/workflows/page.tsx`
- Create: `app/contact/page.tsx`

**Step 1: Create Workflows page**

Create `app/workflows/page.tsx`:
```typescript
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Workflows | Caleb Bolden',
  description: 'Real-world automation workflows that eliminate manual work and drive results.',
};

export default function WorkflowsPage() {
  const workflows = [
    {
      slug: 'lead-enrichment',
      title: 'Lead Enrichment',
      description: 'Automatically research and score new leads with AI',
      category: 'Sales',
      impact: '10 hours saved per week',
    },
    {
      slug: 'content-repurposing',
      title: 'Content Repurposing',
      description: 'Turn blog posts into multi-platform content',
      category: 'Marketing',
      impact: '80% faster content distribution',
    },
    {
      slug: 'meeting-notes',
      title: 'Meeting Notes Automation',
      description: 'Record, transcribe, and extract action items',
      category: 'Operations',
      impact: '5 hours saved per week',
    },
  ];

  return (
    <>
      <Header />
      <main className="md:mr-[400px] pt-32 px-6 md:px-12 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-4">
            Workflow Portfolio
          </h1>
          <p className="text-xl text-gray-400 mb-16">
            Real-world automation workflows that eliminate manual work
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {workflows.map((workflow) => (
              <div
                key={workflow.slug}
                className="p-8 bg-primary-cyan/5 border border-primary-cyan/10 rounded-xl hover:border-primary-cyan hover:-translate-y-2 transition-all"
              >
                <span className="inline-block px-3 py-1 bg-primary-cyan/10 border border-primary-cyan/30 rounded-full text-xs text-primary-cyan mb-4">
                  {workflow.category}
                </span>
                <h3 className="text-2xl font-bold text-white mb-3">
                  {workflow.title}
                </h3>
                <p className="text-gray-400 mb-4 leading-relaxed">
                  {workflow.description}
                </p>
                <div className="text-sm font-semibold text-primary-cyan">
                  {workflow.impact}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 p-8 bg-primary-cyan/5 border border-primary-cyan/10 rounded-xl text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Need a Custom Workflow?
            </h2>
            <p className="text-gray-400 mb-6">
              These are just examples. Every business has unique processes that can be automated.
            </p>
            <button className="px-8 py-4 bg-gradient-to-r from-primary-cyan to-primary-blue text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-primary-cyan/30 hover:-translate-y-0.5 transition-all">
              Schedule a Consultation
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
```

**Step 2: Create Contact page**

Create `app/contact/page.tsx`:
```typescript
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Contact | Caleb Bolden',
  description: 'Get in touch to discuss automation projects or job opportunities.',
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="md:mr-[400px] pt-32 px-6 md:px-12 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-8">
            Get in Touch
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* For Employers */}
            <div className="p-8 bg-primary-cyan/5 border border-primary-cyan/10 rounded-xl">
              <h2 className="text-2xl font-bold text-white mb-4">
                For Employers
              </h2>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Looking to hire a Product Operations specialist with automation expertise?
                Let's discuss how I can help your team.
              </p>
              <div className="space-y-4">
                <a
                  href="https://linkedin.com/in/calebbolden"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-6 py-3 border-2 border-primary-cyan text-primary-cyan rounded-lg hover:bg-primary-cyan/10 transition-all text-center font-semibold"
                >
                  View LinkedIn Profile
                </a>
                <button className="w-full px-6 py-3 border-2 border-primary-cyan text-primary-cyan rounded-lg hover:bg-primary-cyan/10 transition-all font-semibold">
                  Schedule Interview
                </button>
              </div>
            </div>

            {/* For Automation Clients */}
            <div className="p-8 bg-gradient-to-br from-primary-cyan/10 to-primary-blue/10 border border-primary-cyan rounded-xl">
              <h2 className="text-2xl font-bold text-white mb-4">
                For Automation Clients
              </h2>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Need intelligent workflows that save time and scale your operations?
                Let's explore what's possible.
              </p>
              <div className="space-y-4">
                <button className="w-full px-6 py-3 bg-gradient-to-r from-primary-cyan to-primary-blue text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-primary-cyan/30 hover:-translate-y-0.5 transition-all">
                  Book Free Consultation
                </button>
                <a
                  href="mailto:cbolden15@gmail.com"
                  className="block px-6 py-3 border-2 border-primary-cyan text-primary-cyan rounded-lg hover:bg-primary-cyan/10 transition-all text-center font-semibold"
                >
                  Send Email
                </a>
              </div>
            </div>
          </div>

          {/* Or Use the AI Chat */}
          <div className="mt-12 p-8 bg-primary-cyan/5 border border-primary-cyan/10 rounded-xl text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Not sure what to ask?
            </h2>
            <p className="text-gray-400">
              Use the AI assistant on this site to ask questions about my background,
              services, or availability. It knows everything and can point you in the right direction.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
```

**Step 3: Verify pages**

Run: `npm run dev`
Check:
- http://localhost:3000/workflows
- http://localhost:3000/contact

Expected: Both pages render correctly

Stop server

**Step 4: Commit workflow and contact pages**

```bash
git add app/workflows/page.tsx app/contact/page.tsx
git commit -m "feat: create Workflows and Contact pages

Workflows:
- Three workflow examples (placeholder)
- Category tags and impact metrics
- CTA for custom consultation

Contact:
- Dual-audience layout (employers vs clients)
- LinkedIn and email links
- Calendly placeholders
- AI chat reminder

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 21: Add Vercel Configuration

**Files:**
- Create: `vercel.json`
- Create: `.vercelignore`

**Step 1: Create Vercel configuration**

Create `vercel.json`:
```json
{
  "framework": "nextjs",
  "buildCommand": "next build",
  "devCommand": "next dev",
  "installCommand": "npm install",
  "regions": ["iad1"],
  "env": {
    "GOOGLE_GENERATIVE_AI_API_KEY": "@google-generative-ai-api-key"
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

Create `.vercelignore`:
```
node_modules
.next
.git
.env.local
*.log
```

**Step 2: Commit Vercel configuration**

```bash
git add vercel.json .vercelignore
git commit -m "feat: add Vercel deployment configuration

- Framework and build settings
- Environment variable configuration
- Security headers (XSS, clickjacking, MIME sniffing)
- Region configuration (iad1 - US East)
- Ignore unnecessary files in deployment

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 22: Create README

**Files:**
- Create: `README.md`

**Step 1: Create comprehensive README**

Create `README.md`:
```markdown
# calebbolden.us - Personal Website

A dual-audience personal website featuring AI chat, interactive workflow demos, and comprehensive content management.

## Features

- **AI Chat Panel**: Always-visible assistant powered by Gemini API, knows complete background and projects
- **Interactive Workflow Demos**: React Flow visualizations of automation workflows
- **Blog System**: MDX-based blog with Git-backed content management
- **Dark Futuristic Design**: Glassmorphism, gradient text, cyan accents
- **Responsive**: Parallel design approach (full desktop, streamlined mobile)

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + Headless UI
- **AI**: Vercel AI SDK + Google Gemini API
- **Content**: MDX with TinaCMS (coming soon)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- Google Gemini API key

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

4. Add your Gemini API key to `.env.local`:
   ```bash
   GOOGLE_GENERATIVE_AI_API_KEY=your_key_here
   ```

5. Run development server:
   ```bash
   npm run dev
   ```

6. Open http://localhost:3000

## Project Structure

```
calebbolden.com/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with AI chat
│   ├── page.tsx           # Homepage
│   ├── about/             # About page
│   ├── blog/              # Blog listing and posts
│   ├── workflows/         # Workflow portfolio
│   ├── contact/           # Contact page
│   └── api/
│       └── chat/          # AI chat endpoint
├── components/            # React components
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── WorkflowDemo.tsx
│   ├── CareerTimeline.tsx
│   ├── BlogPreview.tsx
│   ├── AIChat.tsx
│   └── Footer.tsx
├── content/               # Markdown content
│   ├── blog/             # Blog posts
│   ├── workflows/        # Case studies
│   └── pages/            # Static pages
├── lib/                   # Utilities
│   ├── blog/             # Blog data loading
│   └── chat/             # AI chat configuration
└── public/               # Static assets
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import repository in Vercel
3. Add environment variables:
   - `GOOGLE_GENERATIVE_AI_API_KEY`
   - `TINA_ADMIN_PASSWORD`
   - `NEXT_PUBLIC_CALENDLY_HIRING_URL`
   - `NEXT_PUBLIC_CALENDLY_CLIENT_URL`
4. Deploy

### Manual Deployment

```bash
npm run build
npm start
```

## Environment Variables

See `.env.example` for all required environment variables.

## Content Management

Blog posts are stored as Markdown files in `content/blog/` with frontmatter:

```markdown
---
title: "Post Title"
date: "2026-01-15"
category: "AI Trends"
excerpt: "Short description..."
featured: true
tags: ["AI", "automation"]
---

# Content here
```

## License

MIT

## Contact

- Website: https://calebbolden.us
- LinkedIn: https://linkedin.com/in/calebbolden
- Email: cbolden15@gmail.com
```

**Step 2: Commit README**

```bash
git add README.md
git commit -m "docs: create comprehensive README

- Project overview and features
- Tech stack details
- Installation instructions
- Project structure
- Deployment guide
- Content management info

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Summary

This implementation plan creates a complete personal website with:

✅ **Foundation**: Next.js 14 + TypeScript + Tailwind CSS
✅ **Layout**: Header, Footer, responsive design
✅ **Homepage**: Hero, WorkflowDemo, CareerTimeline, BlogPreview
✅ **AI Chat**: Gemini-powered assistant with context switching
✅ **Blog System**: MDX rendering, listing, and individual post pages
✅ **Content**: Placeholder blog posts and structured content directory
✅ **Pages**: About, Workflows, Contact
✅ **Deployment**: Vercel configuration and comprehensive README

**Total Tasks**: 22 tasks across 6 phases
**Estimated Time**: 3-4 weeks (full-time) or 5-6 weeks (part-time)

**Next Steps After Implementation**:
1. Add real Gemini API key to `.env.local`
2. Replace placeholder Calendly URLs
3. Integrate TinaCMS for live content editing
4. Add React Flow for interactive workflow diagrams (Phase 2)
5. Deploy to Vercel with custom domain
6. Replace placeholder content with real resume, workflows, and blog posts
