import { tool } from 'ai';
import { z } from 'zod';

export const chatTools = {
  scrapeWebsite: tool({
    description:
      'Fetch and analyze a business website URL. Returns the page title, meta description, headings, contact methods found (phone, email, forms), social links, and a text summary of the page content. Use this when the user provides a website URL.',
    inputSchema: z.object({
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
        const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
        const title = titleMatch ? titleMatch[1].trim() : '';

        // Extract meta description
        const metaDescMatch = html.match(
          /<meta[^>]*name=["']description["'][^>]*content=["']([\s\S]*?)["']/i
        );
        const metaDescription = metaDescMatch ? metaDescMatch[1].trim() : '';

        // Extract headings
        const headings: string[] = [];
        const headingRegex = /<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi;
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
    inputSchema: z.object({
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
