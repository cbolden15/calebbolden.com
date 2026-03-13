# Site Redesign: Electric Blue v2 Implementation

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the current calebbolden.com homepage with the Electric Blue v2 design from `design-samples/full-design-v2.html`. New sections: 3D dashboard hero, pain/solution rows, hub-spoke ecosystem, numbered process, industry pills, CTA.

**Architecture:** Replace existing homepage components (Hero, WorkflowDemo, CareerTimeline, BlogPreview) with new ones matching the v2 HTML mockup. Update the design system (globals.css) from cyan/blue to Electric Blue palette. Keep existing blog, about, contact, and workflows pages functional.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS 4, Plus Jakarta Sans + Inter fonts

---

## Task 1: Update the design system (globals.css + fonts)

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

**Step 1: Update `app/globals.css`**

Replace the entire file with the new Electric Blue design tokens. Keep the Tailwind import. Replace theme colors. Add new utility classes.

```css
@import "tailwindcss";

@theme {
  --color-accent: #2563EB;
  --color-accent-light: #60A5FA;
  --color-accent-bright: #93C5FD;
  --color-bg: #030712;
  --color-bg-card: rgba(255,255,255,0.03);
  --color-bg-card-hover: rgba(37,99,235,0.06);
  --color-border: rgba(255,255,255,0.06);
  --color-text: #F9FAFB;
  --color-text-muted: #9CA3AF;
  --color-text-dim: #6B7280;
  --font-heading: 'Plus Jakarta Sans', sans-serif;
  --font-body: 'Inter', sans-serif;
}

@layer base {
  body {
    background-color: var(--color-bg);
    color: var(--color-text);
    font-family: var(--font-body);
    line-height: 1.6;
    overflow-x: hidden;
  }
}

@layer utilities {
  .glass-icon {
    background: linear-gradient(135deg, rgba(37,99,235,0.15), rgba(96,165,250,0.05));
    border: 1px solid rgba(37,99,235,0.2);
    backdrop-filter: blur(8px);
    box-shadow: 0 0 20px rgba(37,99,235,0.08), inset 0 1px 0 rgba(255,255,255,0.05);
  }
  .glass-icon svg {
    stroke: var(--color-accent-bright);
    filter: drop-shadow(0 0 4px rgba(96,165,250,0.3));
  }
}
```

**Step 2: Add Google Fonts to `app/layout.tsx`**

Add Plus Jakarta Sans and Inter via `<link>` tags in the layout head. The layout already has metadata. Add the font links.

```tsx
// In the <html> tag, add:
<head>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet" />
</head>
```

Also update the sidebar width reference from 400px to 360px in the layout (if applicable).

**Step 3: Verify build**

Run: `cd ~/Projects/calebbolden.com && npm run build`

---

## Task 2: Rewrite the Header

**Files:**
- Modify: `components/Header.tsx`

Replace the current Header with the simpler Electric Blue nav. Logo left ("CALEB BOLDEN" with accent span), nav links right (Services, Industries, Blog). Remove the two CTA buttons. Keep the `open-chat` event dispatch if needed for mobile.

```tsx
'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <nav style={{ padding: '20px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="max-w-[1100px] mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="text-[22px] font-extrabold tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          CALEB <span style={{ fontWeight: 500, color: '#60A5FA' }}>BOLDEN</span>
        </Link>
        <ul className="hidden md:flex gap-7 list-none">
          <li><Link href="#services" className="text-sm font-medium text-gray-400 hover:text-[#93C5FD] transition-colors">Services</Link></li>
          <li><Link href="#industries" className="text-sm font-medium text-gray-400 hover:text-[#93C5FD] transition-colors">Industries</Link></li>
          <li><Link href="/blog" className="text-sm font-medium text-gray-400 hover:text-[#93C5FD] transition-colors">Blog</Link></li>
        </ul>
      </div>
    </nav>
  );
}
```

---

## Task 3: Create the Hero component with 3D dashboard

**Files:**
- Create: `components/Hero3D.tsx`

This is the most complex component. It has the left text column (badge, headline, subtext) and the right 3D floating dashboard scene with three animated cards.

Build this as a client component (animations need CSS keyframes). The 3D scene uses `perspective`, `rotateY`, `rotateX`, `translateZ` transforms with float animations.

Use inline styles for the 3D transforms and animations since Tailwind doesn't natively support these. Use Tailwind for layout and spacing.

Reference the exact HTML from `full-design-v2.html` hero section.

---

## Task 4: Create the PainSolution component

**Files:**
- Create: `components/PainSolution.tsx`

6 rows, each with a pain (left, red title), arrow (center), and solution (right, green title + blue service tag). No icons, just text. Uses CSS grid: `grid-template-columns: 1fr 40px 1fr`.

Reference the solutions section from `full-design-v2.html`.

---

## Task 5: Create the Ecosystem component (hub-spoke)

**Files:**
- Create: `components/Ecosystem.tsx`

The hub-spoke SVG diagram. Center hub ("Your Business"), 6 service spoke cards positioned absolutely, SVG connection lines, orbit ring, animated pulse on hub.

This is largely the same as the hub-spoke section from `full-design-v2.html`. Convert to React/JSX.

---

## Task 6: Create the Process component

**Files:**
- Create: `components/Process.tsx`

Simple 3-column layout with large faded numbers (CSS counter or hardcoded), heading, and one paragraph per step. No cards, no icons.

Reference the process section from `full-design-v2.html`.

---

## Task 7: Create the Industries component

**Files:**
- Create: `components/Industries.tsx`

Flowing row of rounded pill buttons. No icons, no cards. Simple `flex-wrap` layout with `border-radius: 100px` pills.

Reference the industries section from `full-design-v2.html`.

---

## Task 8: Create the CTA component

**Files:**
- Create: `components/CTA.tsx`

Centered block with gradient background, top light line, heading, and subtext.

Reference the CTA section from `full-design-v2.html`.

---

## Task 9: Update the Footer

**Files:**
- Modify: `components/Footer.tsx`

Simplify to match the v2 design: single line copyright, border top, centered.

---

## Task 10: Rewrite the homepage

**Files:**
- Modify: `app/page.tsx`

Replace the current component imports (Hero, WorkflowDemo, CareerTimeline, BlogPreview) with the new ones (Hero3D, PainSolution, Ecosystem, Process, Industries, CTA). Update the main content margin from `md:mr-[400px]` to `md:mr-[360px]` to match the new sidebar width.

```tsx
import Header from '@/components/Header';
import Hero3D from '@/components/Hero3D';
import PainSolution from '@/components/PainSolution';
import Ecosystem from '@/components/Ecosystem';
import Process from '@/components/Process';
import Industries from '@/components/Industries';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main className="md:mr-[360px]">
        <Hero3D />
        <PainSolution />
        <Ecosystem />
        <Process />
        <Industries />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
```

---

## Task 11: Build verification and fixes

**Step 1:** Run `npm run build` and fix any type errors or build failures.
**Step 2:** Run `npm run dev` and verify the page renders correctly.
**Step 3:** Fix any visual issues.

---

## Summary

| Task | What | Files |
|------|------|-------|
| 1 | Design system + fonts | `globals.css`, `layout.tsx` |
| 2 | Header rewrite | `Header.tsx` |
| 3 | Hero with 3D dashboard | `Hero3D.tsx` (new) |
| 4 | Pain/Solution section | `PainSolution.tsx` (new) |
| 5 | Hub-spoke ecosystem | `Ecosystem.tsx` (new) |
| 6 | Process section | `Process.tsx` (new) |
| 7 | Industries pills | `Industries.tsx` (new) |
| 8 | CTA block | `CTA.tsx` (new) |
| 9 | Footer simplify | `Footer.tsx` |
| 10 | Homepage assembly | `page.tsx` |
| 11 | Build + visual verification | All |
