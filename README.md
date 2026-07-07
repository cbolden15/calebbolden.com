# calebbolden.com

Next.js site for Caleb Bolden's AI consulting work with local small businesses.

## Features

- AI chat assistant using Google Gemini through the Vercel AI SDK.
- MDX blog backed by files in `content/blog/`.
- Service pages for web development, SEO, and marketing.
- Lead capture with optional Resend email notifications.
- Light working wall visual system: white background, blueprint-blue accents, graph paper fields, and Archivo, Schibsted Grotesk, and Martian Mono type.

## Tech stack

- Framework: Next.js 16.1.4 with App Router.
- Language: TypeScript.
- Styling: Tailwind CSS 4 with Typography plugin.
- AI: Vercel AI SDK, `@ai-sdk/google`, and Google Gemini `gemini-3.5-flash`.
- Content: MDX with `next-mdx-remote` and `gray-matter`.
- Runtime: Docker image based on Node.js 22 Alpine.

## Scripts

- `npm run dev`: start the local Next.js server.
- `npm run build`: build the production app.
- `npm run start`: start the production server.
- `npm run lint`: run the configured Next.js lint command.

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a local environment file with the needed values.

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:3000.

## Project structure

```
calebbolden.com/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with fonts and AI chat
│   ├── page.tsx           # Homepage
│   ├── about/             # About page
│   ├── blog/              # Blog listing and posts
│   ├── contact/           # Contact page
│   ├── services/          # Web development, SEO, and marketing pages
│   └── api/
│       └── chat/          # AI chat endpoint
├── components/            # React components
│   ├── AIChat.tsx
│   ├── CTA.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── Industries.tsx
│   ├── NowStrip.tsx
│   ├── OpenChatButton.tsx
│   ├── Packages.tsx
│   ├── PainSolution.tsx
│   ├── Process.tsx
│   ├── Proof.tsx
│   ├── Reveal.tsx
│   └── ServicePage.tsx
├── content/               # Markdown content
│   ├── blog/             # Blog posts
│   └── pages/            # Static page content
├── lib/                   # Utilities
│   ├── blog/             # Blog data loading
│   └── chat/             # AI chat configuration
└── public/               # Static assets
```

## Deployment

Production runs on a Hetzner server at `5.78.121.71`.

The app lives in `/opt/calebbolden`:

- `docker-compose.yml`
- `.env`
- `./repo`, a plain source copy, not a git clone

A shared Caddy reverse proxy at `/opt/caddy` routes `calebbolden.com` to the `calebbolden-site` container on port `3000`.

Deploy from the local repo:

```bash
git archive <commit> | ssh root@5.78.121.71 'tar -x -C /opt/calebbolden/repo.new'
```

On the server, swap `repo.new` into place, keep a dated backup of the old `repo` directory, then rebuild and restart:

```bash
cd /opt/calebbolden
docker compose up -d --build
```

A secondary Docker and Cloudflare Tunnel stack exists on the homelab server. It receives no production traffic.

## Environment variables

- `GOOGLE_GENERATIVE_AI_API_KEY`: Gemini chat key.
- `RESEND_API_KEY`: Resend key for lead notification emails.
- `LEAD_EMAIL_TO`: optional lead email recipient.
- `LEAD_EMAIL_FROM`: optional lead email sender.
- `NEXT_PUBLIC_CALENDLY_CLIENT_URL`: optional booking link.

## Content management

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
