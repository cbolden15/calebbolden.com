# calebbolden.com - Personal Website

A dual-audience personal website featuring AI chat, interactive workflow demos, and comprehensive content management.

## Features

- **AI Chat Panel**: Always-visible assistant powered by Gemini API, knows complete background and projects
- **Interactive Workflow Demos**: React Flow visualizations of automation workflows
- **Blog System**: MDX-based blog with Git-backed content management
- **Dark Futuristic Design**: Glassmorphism, gradient text, cyan accents
- **Responsive**: Parallel design approach (full desktop, streamlined mobile)

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4 + Typography plugin
- **AI**: Vercel AI SDK + Google Gemini API
- **Content**: MDX with gray-matter, TinaCMS (installed)
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

- Website: https://calebbolden.com
- LinkedIn: https://linkedin.com/in/calebbolden
- Email: cbolden15@gmail.com
