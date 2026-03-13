# Chatbot Redesign: URL Analysis + Conversational Lead Capture

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebuild the chatbot to lead with a website URL analysis flow that scrapes a prospect's site, identifies their business and gaps, then delivers personalized AI service recommendations. Free conversation is the fallback path.

**Architecture:** Add a server-side `scrapeWebsite` tool to the Vercel AI SDK `streamText` call so Gemini can invoke it when a user provides a URL. Rewrite the system prompt to position as a business consultant (not a personal portfolio assistant). Redesign the chat UI to match the Electric Blue design language and prompt for URL input. Add a `captureContact` tool for lead handoff that notifies Caleb.

**Tech Stack:** Next.js 16, Vercel AI SDK v6 (tool calling), Google Gemini 2.0 Flash, Tailwind CSS 4

---

## Task 1: Add the `scrapeWebsite` server-side tool

**Files:**
- Create: `lib/chat/tools.ts`
- Modify: `app/api/chat/route.ts`

**Step 1: Create `lib/chat/tools.ts`**

This file defines the tools the AI can call. The `scrapeWebsite` tool fetches a URL, extracts the HTML, and parses out business-relevant data (business name, industry, services, contact methods, social links, booking presence).

```ts
import { tool } from 'ai';
import { z } from 'zod';

export const chatTools = {
  scrapeWebsite: tool({
    description:
      'Fetch and analyze a business website URL. Returns the page title, meta description, headings, contact methods found (phone, email, forms), social links, and a text summary of the page content. Use this when the user provides a website URL.',
    parameters: z.object({
      url: z.string().describe('The full URL to scrape, e.g. https://example.com'),
    }),
    execute: async ({ url }) => {
      try {
        // Normalize URL
        let normalizedUrl = url.trim();
        if (!normalizedUrl.startsWith('http')) {
          normalizedUrl = 'https://' + normalizedUrl;
        }

        const response = await fetch(normalizedUrl, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (compatible; CalebBoldenBot/1.0; +https://calebbolden.com)',
          },
          signal: AbortSignal.timeout(10000),
        });

        if (!response.ok) {
          return { error: `Could not reach the site (HTTP ${response.status})` };
        }

        const html = await response.text();

        // Extract title
        const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/is);
        const title = titleMatch ? titleMatch[1].trim() : '';

        // Extract meta description
        const metaDescMatch = html.match(
          /<meta[^>]*name=["']description["'][^>]*content=["'](.*?)["']/is
        );
        const metaDescription = metaDescMatch ? metaDescMatch[1].trim() : '';

        // Extract headings
        const headings: string[] = [];
        const headingRegex = /<h[1-3][^>]*>(.*?)<\/h[1-3]>/gis;
        let hMatch;
        while ((hMatch = headingRegex.exec(html)) !== null && headings.length < 15) {
          const text = hMatch[1].replace(/<[^>]*>/g, '').trim();
          if (text) headings.push(text);
        }

        // Detect contact methods
        const hasPhone = /tel:|(\(\d{3}\)|\d{3})[-.\s]?\d{3}[-.\s]?\d{4}/.test(html);
        const hasEmail = /mailto:|[\w.+-]+@[\w-]+\.[\w.-]+/.test(html);
        const hasContactForm = /<form/i.test(html);
        const hasChat =
          /livechat|tawk|intercom|drift|crisp|hubspot.*chat|zendesk.*chat/i.test(html);

        // Detect booking/scheduling
        const hasBooking =
          /calendly|acuity|booksy|schedulicity|book\s*(now|online|appointment)|schedule/i.test(
            html
          );

        // Extract social links
        const socialPatterns = [
          { name: 'Facebook', pattern: /facebook\.com\/[^\s"'<>]+/i },
          { name: 'Instagram', pattern: /instagram\.com\/[^\s"'<>]+/i },
          { name: 'LinkedIn', pattern: /linkedin\.com\/[^\s"'<>]+/i },
          { name: 'Twitter/X', pattern: /(twitter|x)\.com\/[^\s"'<>]+/i },
          { name: 'YouTube', pattern: /youtube\.com\/[^\s"'<>]+/i },
          { name: 'TikTok', pattern: /tiktok\.com\/[^\s"'<>]+/i },
          { name: 'Yelp', pattern: /yelp\.com\/[^\s"'<>]+/i },
          { name: 'Google Business', pattern: /google\.com\/maps|g\.page/i },
        ];
        const socialLinks = socialPatterns
          .filter((s) => s.pattern.test(html))
          .map((s) => s.name);

        // Extract visible text (strip tags, limit length)
        const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        const bodyText = bodyMatch
          ? bodyMatch[1]
              .replace(/<script[\s\S]*?<\/script>/gi, '')
              .replace(/<style[\s\S]*?<\/style>/gi, '')
              .replace(/<[^>]*>/g, ' ')
              .replace(/\s+/g, ' ')
              .trim()
              .slice(0, 3000)
          : '';

        return {
          url: normalizedUrl,
          title,
          metaDescription,
          headings,
          contactMethods: {
            phone: hasPhone,
            email: hasEmail,
            contactForm: hasContactForm,
            liveChat: hasChat,
            onlineBooking: hasBooking,
          },
          socialLinks,
          pageContent: bodyText,
        };
      } catch (err) {
        return {
          error: `Failed to analyze the site: ${err instanceof Error ? err.message : 'Unknown error'}`,
        };
      }
    },
  }),

  captureContact: tool({
    description:
      'Capture the lead contact information when the user provides their name, email, or phone number. Call this tool whenever the user shares contact details so Caleb can follow up.',
    parameters: z.object({
      name: z.string().optional().describe('The contact name'),
      email: z.string().optional().describe('The contact email'),
      phone: z.string().optional().describe('The contact phone number'),
      businessName: z.string().optional().describe('Their business name'),
      websiteUrl: z.string().optional().describe('Their website URL if provided'),
      summary: z
        .string()
        .describe('Brief summary of what the user needs and what was recommended'),
    }),
    execute: async ({ name, email, phone, businessName, websiteUrl, summary }) => {
      // Send notification to Caleb (webhook, email, etc.)
      // For now, log it server-side. Replace with actual notification later.
      console.log('=== NEW LEAD CAPTURED ===');
      console.log(JSON.stringify({ name, email, phone, businessName, websiteUrl, summary }, null, 2));

      // TODO: Replace with actual notification (n8n webhook, email API, etc.)
      // Example: await fetch('https://your-n8n-webhook-url', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ name, email, phone, businessName, websiteUrl, summary }),
      // });

      return { success: true, message: 'Contact information saved. Caleb will follow up shortly.' };
    },
  }),
};
```

**Step 2: Install zod dependency**

Run: `cd ~/Projects/calebbolden.com && npm install zod`

**Step 3: Update `app/api/chat/route.ts` to use tools**

```ts
import { google } from '@ai-sdk/google';
import { streamText, convertToModelMessages } from 'ai';
import { getSystemPrompt } from '@/lib/chat/system-prompt';
import { chatTools } from '@/lib/chat/tools';

export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const systemPrompt = getSystemPrompt();

  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: google('gemini-2.0-flash'),
    system: systemPrompt,
    messages: modelMessages,
    tools: chatTools,
    maxSteps: 3,
  });

  return result.toUIMessageStreamResponse();
}
```

Note: `maxSteps: 3` allows the model to call a tool, get the result, then generate a response (and optionally call another tool). The `context` parameter is removed since the new system prompt is unified.

**Step 4: Verify the build compiles**

Run: `cd ~/Projects/calebbolden.com && npm run build`
Expected: Build succeeds with no type errors.

**Step 5: Commit**

```bash
git add lib/chat/tools.ts app/api/chat/route.ts package.json package-lock.json
git commit -m "feat: add scrapeWebsite and captureContact tools for chatbot"
```

---

## Task 2: Rewrite the system prompt

**Files:**
- Modify: `lib/chat/system-prompt.ts`

**Step 1: Replace the system prompt**

The new prompt repositions Caleb as an AI Solutions Consultant for small businesses. It removes the hiring context, removes the personal portfolio framing, and adds detailed instructions for the URL analysis flow, free conversation flow, and lead capture behavior.

```ts
const SYSTEM_PROMPT = `You are the AI assistant on Caleb Bolden's website (calebbolden.com). Caleb is an AI Solutions Consultant who builds AI systems for small businesses. Your job is to understand the visitor's business and show them exactly how AI can help.

## Your Personality
- Confident, direct, and conversational. Not salesy.
- Use short paragraphs. No walls of text.
- Never say "As an AI" or "I'm just a chatbot." You are a business assistant.
- Match the visitor's tone. Casual if they're casual, professional if they're formal.
- Use no dashes or hyphens as punctuation. Use commas, periods, or restructure sentences instead.

## Caleb's Services (Your Knowledge Base)

**AI Voice Agents:** Answer every call 24/7, book appointments, handle FAQs, route emergencies. Best for businesses that rely on phone calls (salons, healthcare, home services, property management).

**Lead Capture & Smart CRM:** Instant lead scoring, automated follow-up sequences within 60 seconds, pipeline tracking, customer insights. Eliminates the "leads going cold" problem.

**AI Employees:** Virtual staff for front desk, social media management, collections, customer service. Work 24/7 at roughly 10% the cost of a human hire.

**Marketing Engine:** AI-generated content, social media posting, email/SMS campaigns, SEO, blog writing. Runs continuously without the business owner lifting a finger.

**Workflow Automation:** Connect existing tools, automate invoicing, scheduling, data entry. Eliminates repetitive admin work.

**Conversational AI:** Website chatbots, SMS assistants, WhatsApp/Telegram bots. For businesses that need always-on customer communication.

## Industries Caleb Serves
Home Services, Salon & Spa, Fitness & Gym, Healthcare, Pet Services, Property Management, Interior Design, Professional Services, and General/Other.

## Conversation Flow

### Path A: URL Analysis (Primary)
When the visitor provides a website URL:
1. Call the \`scrapeWebsite\` tool immediately.
2. Present what you found: business name, industry, services they offer, and their current contact/booking setup. Frame it as "Here's what I found about [Business Name]:" Keep it to 3 to 4 sentences. Ask "Did I get that right?"
3. After they confirm (or correct), ask ONE targeted qualifying question based on the gaps you identified. For example, if they have no online booking, ask how clients currently book. If no after-hours presence, ask what happens when someone calls after 5 PM.
4. Deliver 3 personalized recommendations ranked by impact. Each must reference something specific from their site. Use this format for each recommendation:
   - Bold service name + "(highest impact)" for the top one
   - One sentence explaining what it does for THEIR specific situation
   - One sentence with a concrete outcome ("Businesses like yours typically recover $X/month in missed leads")
5. After recommendations, ask: "Want me to put together a specific plan for your business? I just need your name and the best way to reach you."
6. When they provide contact info, call the \`captureContact\` tool with their details and a summary of the conversation. Then confirm: "Got it. Caleb will reach out within 24 hours with a custom plan."

### Path B: Free Conversation (Fallback)
When the visitor describes their business without a URL:
1. Acknowledge their industry/situation in one sentence.
2. Ask discovery questions ONE AT A TIME (never more than one question per message):
   - "How many clients do you see per week, roughly?" (scale)
   - "What takes up most of your time outside the actual work?" (pain discovery)
   - "How do new clients typically find you?" (marketing/lead gen)
3. After 2 to 3 questions, deliver recommendations in the same format as Path A.
4. Same lead capture flow.

### If the visitor asks general questions
Answer them helpfully using your knowledge of Caleb's services. Always try to steer back toward understanding their specific situation so you can give tailored recommendations.

## Important Rules
- Never make up pricing. If asked about cost, say: "It depends on which systems you need. That's exactly what the custom plan covers. Want me to have Caleb put one together for you?"
- Never promise specific ROI numbers you can't back up. Use ranges and qualifiers like "typically" or "businesses like yours often see."
- If the scrapeWebsite tool fails or returns an error, gracefully fall back: "I wasn't able to pull up your site, but no problem. Tell me a bit about your business and I'll work with that."
- When capturing contact info, call the captureContact tool immediately. Do not wait.
- Keep responses under 200 words unless delivering the full recommendation set.`;

export function getSystemPrompt(): string {
  return SYSTEM_PROMPT;
}
```

**Step 2: Remove the old `ChatContext` type export**

The new prompt is unified. No more `ChatContext` type, no more `hiring` vs `automation` contexts.

**Step 3: Verify the build compiles**

Run: `cd ~/Projects/calebbolden.com && npm run build`
Expected: Build succeeds. Any imports of `ChatContext` will fail here, which we fix in the next task.

**Step 4: Commit**

```bash
git add lib/chat/system-prompt.ts
git commit -m "feat: rewrite system prompt for URL analysis and lead capture flow"
```

---

## Task 3: Redesign the chat UI component

**Files:**
- Modify: `components/AIChat.tsx`

**Step 1: Rewrite `AIChat.tsx`**

The new component:
- Removes the `ChatContext` dependency and custom event listener
- Removes suggested question chips
- Replaces the opening state with a URL input prompt + "no website" fallback text
- Updates styling to match the Electric Blue design (dark bg, blue accents, Inter + Jakarta Sans fonts)
- Handles tool call result parts in message rendering (the scrape/capture tools return results that appear in the message stream)

```tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useChat } from '@ai-sdk/react';
import type { UIMessage } from 'ai';

function getMessageText(message: UIMessage): string {
  return message.parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map((p) => p.text)
    .join('');
}

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, error } = useChat();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, status]);

  const isLoading = status === 'submitted' || status === 'streaming';

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const inputEl = form.elements.namedItem('chat-input') as HTMLInputElement;
    const value = inputEl.value.trim();
    if (!value || isLoading) return;
    sendMessage({ text: value });
    inputEl.value = '';
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const inputEl = form.elements.namedItem('url-input') as HTMLInputElement;
    const value = inputEl.value.trim();
    if (!value || isLoading) return;
    sendMessage({ text: value });
    inputEl.value = '';
  };

  const hasMessages = messages.length > 0;

  return (
    <>
      {/* Mobile FAB */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center z-50"
        style={{
          background: 'linear-gradient(135deg, #2563EB, #60A5FA)',
          boxShadow: '0 0 24px rgba(37,99,235,0.4)',
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
        <div
          className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2"
          style={{ background: '#22C55E', borderColor: '#030712' }}
        />
      </button>

      {/* Chat Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-screen w-full md:w-[360px] flex flex-col z-[200] transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
        }`}
        style={{
          background: 'rgba(3,7,18,0.97)',
          backdropFilter: 'blur(24px)',
          borderLeft: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Header */}
        <div
          className="p-5 flex items-center gap-3"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div
            className="w-9 h-9 rounded-[10px] flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #2563EB, #60A5FA)',
              boxShadow: '0 0 16px rgba(37,99,235,0.3)',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="text-[15px] font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              AI Assistant
            </div>
            <div className="text-xs flex items-center gap-1.5" style={{ color: '#22C55E' }}>
              <span
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{ background: '#22C55E', animation: 'pulse 2s infinite' }}
              />
              Online
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-gray-500 hover:text-white text-lg"
          >
            ✕
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-5">
          {!hasMessages ? (
            /* Empty State: URL Input */
            <div className="flex flex-col justify-center h-full">
              <div className="text-center mb-8">
                <p className="text-[15px] font-semibold text-white mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  What kind of business do you run?
                </p>
                <p className="text-[13px]" style={{ color: '#9CA3AF' }}>
                  Drop your website URL and I'll analyze where AI can save you time.
                </p>
              </div>

              <form onSubmit={handleUrlSubmit} className="mb-4">
                <input
                  type="text"
                  name="url-input"
                  placeholder="yourcompany.com"
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-[10px] text-sm text-white outline-none disabled:opacity-50"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(37,99,235,0.2)',
                    fontFamily: "'Inter', sans-serif",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(37,99,235,0.4)';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.08)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(37,99,235,0.2)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-3 py-2.5 rounded-[10px] text-sm font-semibold text-white disabled:opacity-50 cursor-pointer"
                  style={{
                    background: 'linear-gradient(135deg, #2563EB, #60A5FA)',
                    boxShadow: '0 0 16px rgba(37,99,235,0.2)',
                  }}
                >
                  Analyze My Business
                </button>
              </form>

              <p className="text-center text-[12px]" style={{ color: '#6B7280' }}>
                No website?{' '}
                <button
                  type="button"
                  onClick={() => {
                    sendMessage({ text: "I don't have a website. Let me tell you about my business." });
                  }}
                  className="underline cursor-pointer"
                  style={{ color: '#60A5FA' }}
                >
                  Just tell me about your business
                </button>
              </p>
            </div>
          ) : (
            /* Message List */
            <div className="space-y-3">
              {messages.map((message) => {
                const text = getMessageText(message);
                if (!text) return null;
                return (
                  <div
                    key={message.id}
                    className={`p-3.5 rounded-xl text-[13px] leading-relaxed whitespace-pre-wrap ${
                      message.role === 'user' ? 'ml-8' : ''
                    }`}
                    style={{
                      background:
                        message.role === 'user'
                          ? 'rgba(37,99,235,0.1)'
                          : 'rgba(255,255,255,0.03)',
                      border:
                        message.role === 'user'
                          ? '1px solid rgba(37,99,235,0.15)'
                          : '1px solid rgba(255,255,255,0.06)',
                      color: message.role === 'user' ? '#F9FAFB' : '#D1D5DB',
                    }}
                  >
                    {text}
                  </div>
                );
              })}
              {status === 'submitted' && (
                <div
                  className="p-3.5 rounded-xl text-[13px]"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    color: '#6B7280',
                  }}
                >
                  Analyzing...
                </div>
              )}
              {error && (
                <div
                  className="p-3.5 rounded-xl text-[13px]"
                  style={{
                    background: 'rgba(239,68,68,0.08)',
                    border: '1px solid rgba(239,68,68,0.15)',
                    color: '#F87171',
                  }}
                >
                  Something went wrong. Please try again.
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input (visible after conversation starts) */}
        {hasMessages && (
          <form
            onSubmit={handleFormSubmit}
            className="p-4"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            <input
              type="text"
              name="chat-input"
              placeholder="Tell me more about your business..."
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-[10px] text-sm text-white outline-none disabled:opacity-50"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                fontFamily: "'Inter', sans-serif",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'rgba(37,99,235,0.3)';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.08)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </form>
        )}
      </aside>

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </>
  );
}
```

**Step 2: Remove ChatContext import from any remaining files**

The `Header.tsx` dispatches `open-chat` events with context. Those event listeners are removed from the new `AIChat.tsx`. The Header CTA buttons should be updated to simply open the chat (or link to it). If the Header still references `ChatContext`, that import needs to be removed too, but the Header buttons can stay as-is since the event listener is gone and they'll just do nothing. Clean this up by having both buttons just open the chat without context:

In `Header.tsx`, change the button click handlers from dispatching custom events with context to just dispatching a simple open event, or link to the chat section. Since the new AIChat no longer listens for `open-chat`, the Header buttons will need a different approach. The simplest: have the buttons scroll the page or just do nothing (the chat is always visible on desktop). For mobile, dispatch a simpler event.

Update `Header.tsx` CTA buttons to dispatch a generic `open-chat` event (no context):

```tsx
// Change both button onClick handlers to:
onClick={() => window.dispatchEvent(new CustomEvent('open-chat'))}
```

And add back a simple listener in `AIChat.tsx`:

Add this `useEffect` inside the component:

```tsx
useEffect(() => {
  function handleOpenChat() {
    setIsOpen(true);
  }
  window.addEventListener('open-chat', handleOpenChat);
  return () => window.removeEventListener('open-chat', handleOpenChat);
}, []);
```

**Step 3: Update `layout.tsx` metadata**

Update the site metadata to reflect the new positioning:

```tsx
export const metadata: Metadata = {
  title: "Caleb Bolden | AI Solutions for Small Business",
  description: "I build AI systems that give small businesses their time back. Voice agents, CRM automation, marketing engines, and AI employees tailored to your industry.",
  keywords: ["AI consultant", "small business automation", "AI voice agents", "CRM automation", "AI employees"],
  authors: [{ name: "Caleb Bolden" }],
  openGraph: {
    title: "Caleb Bolden | AI Solutions for Small Business",
    description: "I build AI systems that give small businesses their time back.",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "Caleb Bolden",
    locale: "en_US",
    type: "website",
  },
};
```

**Step 4: Verify the build compiles**

Run: `cd ~/Projects/calebbolden.com && npm run build`
Expected: Build succeeds with no type errors.

**Step 5: Commit**

```bash
git add components/AIChat.tsx components/Header.tsx app/layout.tsx
git commit -m "feat: redesign chat UI with URL analysis flow and Electric Blue styling"
```

---

## Task 4: Manual testing and polish

**Step 1: Start the dev server**

Run: `cd ~/Projects/calebbolden.com && npm run dev`

**Step 2: Test Path A (URL flow)**

1. Open `http://localhost:3000` in the browser
2. In the chat sidebar, paste a real business website URL (e.g. a local plumber, salon, or dentist)
3. Verify: the bot calls `scrapeWebsite`, presents findings, asks a qualifying question
4. Answer the question
5. Verify: the bot delivers 3 personalized recommendations
6. Verify: the bot asks for contact info
7. Provide a fake name/email
8. Verify: the bot calls `captureContact` and confirms

**Step 3: Test Path B (free conversation)**

1. Refresh the page
2. Click "Just tell me about your business"
3. Type "I run a dog grooming business with 2 groomers"
4. Verify: the bot asks ONE discovery question
5. Answer it
6. Verify: the bot delivers tailored recommendations

**Step 4: Test error handling**

1. Refresh and paste an invalid URL like `notarealsite12345.com`
2. Verify: the bot gracefully falls back to free conversation

**Step 5: Check mobile**

1. Open dev tools, toggle mobile viewport
2. Verify: FAB appears, clicking it opens full-screen chat
3. Verify: URL input and conversation flow work on mobile

**Step 6: Fix any issues found during testing**

Address any UI bugs, prompt issues, or tool failures.

**Step 7: Commit**

```bash
git add -A
git commit -m "fix: polish chatbot after manual testing"
```

---

## Task 5: Wire up lead notifications (placeholder)

**Files:**
- Modify: `lib/chat/tools.ts`

The `captureContact` tool currently just logs to console. This task is to decide on and wire up the actual notification method.

**Options (pick one later):**
- **n8n webhook:** POST to an n8n workflow that sends an email/Telegram/Slack notification
- **Email API:** Use Resend or SendGrid to email Caleb directly
- **Telegram:** POST to a Telegram bot API

For now, the `console.log` placeholder is sufficient for testing. Wire up the real notification when you're ready.

**No commit needed for this task.** It's a reminder for follow-up.

---

## Summary

| Task | What it does | Files |
|------|-------------|-------|
| 1 | Add scrapeWebsite + captureContact tools | `lib/chat/tools.ts`, `app/api/chat/route.ts` |
| 2 | Rewrite system prompt for consultant positioning | `lib/chat/system-prompt.ts` |
| 3 | Redesign chat UI with URL input flow | `components/AIChat.tsx`, `components/Header.tsx`, `app/layout.tsx` |
| 4 | Manual testing across both paths + mobile | All files |
| 5 | Wire up real lead notifications | `lib/chat/tools.ts` |
