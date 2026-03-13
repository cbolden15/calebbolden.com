# Homelab Deployment with Cloudflare Tunnel

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Move calebbolden.com from Vercel to the homelab as a Docker container behind a Cloudflare Tunnel, and wire the captureContact tool to send lead notification emails via the gws CLI.

**Architecture:** Next.js standalone build in a Docker container on port 3010. A second cloudflared container in the same compose file creates an outbound tunnel to Cloudflare, routing `calebbolden.com` traffic to the app without exposing the home IP. The gws binary and credentials are volume-mounted into the app container so the captureContact tool can send emails via `child_process.exec`.

**Tech Stack:** Next.js 16 (standalone), Docker multi-stage build (Node 22 Alpine), Cloudflare Tunnel (free tier), gws CLI v0.11.1

---

## Task 1: Add standalone output to Next.js config

**Files:**
- Modify: `next.config.ts`

**Step 1: Update next.config.ts**

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
};

export default nextConfig;
```

**Step 2: Verify build**

Run: `cd ~/Projects/calebbolden.com && npm run build`
Expected: Build succeeds, `.next/standalone/` directory is created.

**Step 3: Commit**

```bash
git add next.config.ts
git commit -m "feat: enable standalone output for Docker deployment"
```

---

## Task 2: Create the Dockerfile

**Files:**
- Create: `Dockerfile`

**Step 1: Write the Dockerfile**

```dockerfile
FROM node:22-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Build the app
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
```

**Step 2: Create `.dockerignore`**

```
node_modules
.next
.git
*.md
design-samples
docs
```

**Step 3: Test Docker build locally**

Run: `cd ~/Projects/calebbolden.com && docker build -t calebbolden-site .`
Expected: Build completes successfully.

**Step 4: Commit**

```bash
git add Dockerfile .dockerignore
git commit -m "feat: add Dockerfile for standalone Next.js build"
```

---

## Task 3: Create docker-compose.yml

**Files:**
- Create: `docker-compose.yml`

**Step 1: Write docker-compose.yml**

```yaml
services:
  web:
    build: .
    container_name: calebbolden-site
    restart: unless-stopped
    ports:
      - "3010:3000"
    environment:
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    volumes:
      - /home/cbolden15/.npm-global/lib/node_modules/@googleworkspace/cli:/opt/gws:ro
      - /home/cbolden15/.config/gws:/opt/gws-config:ro

  tunnel:
    image: cloudflare/cloudflared:latest
    container_name: calebbolden-tunnel
    restart: unless-stopped
    command: tunnel run
    environment:
      - TUNNEL_TOKEN=${CLOUDFLARE_TUNNEL_TOKEN}
    depends_on:
      - web
```

The tunnel container routes external traffic from Cloudflare to `http://web:3000` inside the Docker network.

**Step 2: Create `.env.example`**

```
GEMINI_API_KEY=your-gemini-api-key
CLOUDFLARE_TUNNEL_TOKEN=your-tunnel-token
```

**Step 3: Add `.env` to `.gitignore` (if not already there)**

Check `.gitignore` for `.env` entry. Add it if missing.

**Step 4: Commit**

```bash
git add docker-compose.yml .env.example
git commit -m "feat: add docker-compose with cloudflared tunnel"
```

---

## Task 4: Wire captureContact to send email via gws

**Files:**
- Modify: `lib/chat/tools.ts`

**Step 1: Update the captureContact execute function**

Replace the `console.log` placeholder with a gws email send. The gws binary is mounted at `/opt/gws/run-gws.js` and credentials at `/opt/gws-config/`.

```ts
import { execSync } from 'child_process';

// Inside captureContact execute:
execute: async ({ name, email, phone, businessName, websiteUrl, summary }) => {
  const lines = [
    `New lead from calebbolden.com chatbot`,
    ``,
    `Name: ${name || 'Not provided'}`,
    `Email: ${email || 'Not provided'}`,
    `Phone: ${phone || 'Not provided'}`,
    `Business: ${businessName || 'Not provided'}`,
    `Website: ${websiteUrl || 'Not provided'}`,
    ``,
    `Summary:`,
    summary,
  ];
  const body = lines.join('\n');

  try {
    const subject = `New Lead: ${name || businessName || 'Website Visitor'}`;
    const cmd = [
      'node', '/opt/gws/run-gws.js',
      'gmail', 'messages', 'send',
      '--to', 'cbolden15@gmail.com',
      '--subject', JSON.stringify(subject),
      '--body', JSON.stringify(body),
    ].join(' ');

    execSync(cmd, {
      timeout: 15000,
      env: {
        ...process.env,
        GWS_CONFIG_DIR: '/opt/gws-config',
        HOME: '/opt/gws-config',
      },
    });
  } catch (err) {
    console.error('Failed to send lead email:', err);
  }

  return { success: true, message: 'Contact information saved. Caleb will follow up shortly.' };
},
```

Note: The `execSync` import goes at the top of the file with the other imports. The gws CLI reads credentials from `GWS_CONFIG_DIR`. If gws uses `HOME` to find `.config/gws/`, we set `HOME` to `/opt/gws-config` as a fallback. Test and adjust the env vars after deployment.

**Step 2: Verify build**

Run: `cd ~/Projects/calebbolden.com && npm run build`
Expected: Build succeeds (execSync is a Node.js built-in, no new deps).

**Step 3: Commit**

```bash
git add lib/chat/tools.ts
git commit -m "feat: wire captureContact to send email via gws CLI"
```

---

## Task 5: Set up Cloudflare account and tunnel

This task is manual (browser + CLI). Follow these steps on the homelab.

**Step 1: Create Cloudflare account**

Go to https://dash.cloudflare.com/sign-up and create a free account (if you don't have one).

**Step 2: Add calebbolden.com to Cloudflare**

1. In the Cloudflare dashboard, click "Add a site"
2. Enter `calebbolden.com`
3. Select the Free plan
4. Cloudflare will scan existing DNS records
5. Note the two Cloudflare nameservers provided (e.g., `ns1.cloudflare.com`, `ns2.cloudflare.com`)

**Step 3: Update nameservers at Vercel**

1. Go to Vercel dashboard > Domains > calebbolden.com
2. Change the nameservers to the Cloudflare ones
3. Wait for propagation (can take up to 24 hours, usually faster)

**Step 4: Create a Cloudflare Tunnel**

1. In Cloudflare dashboard: Zero Trust > Networks > Tunnels
2. Click "Create a tunnel"
3. Choose "Cloudflared" connector
4. Name it `calebbolden-site`
5. Copy the tunnel token
6. Add a public hostname: `calebbolden.com` -> `http://web:3000`
7. Also add `www.calebbolden.com` -> `http://web:3000`

**Step 5: Save the tunnel token**

On the homelab, create the `.env` file:

```bash
ssh cbolden15@homelab
cd ~/Projects/calebbolden.com
cp .env.example .env
# Edit .env and add GEMINI_API_KEY and CLOUDFLARE_TUNNEL_TOKEN
```

---

## Task 6: Deploy to homelab

**Step 1: Clone repo on homelab (if not already there)**

```bash
ssh cbolden15@homelab
cd ~/Projects
git clone <repo-url> calebbolden.com  # or git pull if already cloned
cd calebbolden.com
```

**Step 2: Create .env file**

```bash
cp .env.example .env
nano .env
# Set GEMINI_API_KEY and CLOUDFLARE_TUNNEL_TOKEN
```

**Step 3: Build and start**

```bash
docker compose up -d --build
```

**Step 4: Verify containers are running**

```bash
docker compose ps
# Both calebbolden-site and calebbolden-tunnel should be "Up"
```

**Step 5: Test locally on homelab**

```bash
curl http://localhost:3010
# Should return the HTML of the homepage
```

**Step 6: Test via Cloudflare**

Once nameservers have propagated, visit https://calebbolden.com in a browser. The site should load through the Cloudflare Tunnel.

**Step 7: Test gws email**

Use the chatbot on the live site. Provide a name and email. Check cbolden15@gmail.com for the lead notification email.

---

## Task 7: Verify and fix

**Step 1:** Check Docker logs for any errors:
```bash
docker compose logs web --tail 50
docker compose logs tunnel --tail 50
```

**Step 2:** If gws email fails, SSH into the container and test manually:
```bash
docker exec -it calebbolden-site sh
node /opt/gws/run-gws.js gmail messages send --to cbolden15@gmail.com --subject "Test" --body "Test from container"
```

**Step 3:** Adjust volume mounts or env vars as needed based on gws behavior inside the container.

---

## Summary

| Task | What | Files |
|------|------|-------|
| 1 | Standalone output | `next.config.ts` |
| 2 | Dockerfile | `Dockerfile`, `.dockerignore` |
| 3 | Docker Compose + tunnel | `docker-compose.yml`, `.env.example` |
| 4 | Wire gws email | `lib/chat/tools.ts` |
| 5 | Cloudflare setup | Manual (browser + CLI) |
| 6 | Deploy to homelab | Manual (SSH + docker compose) |
| 7 | Verify and fix | Debugging |
