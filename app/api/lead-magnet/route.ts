import { z } from 'zod';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const leadMagnetSchema = z
  .object({
    magnet: z.enum([
      'ai-readiness',
      'revenue-leak',
      'process-audit-pdf',
      'website-checklist-pdf',
      'local-seo-pdf',
    ]),
    email: z.string().regex(emailPattern),
    name: z.string().optional(),
    payload: z.record(z.string(), z.unknown()).optional(),
  })
  .strict();

export async function POST(req: Request) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return Response.json({ success: false }, { status: 400 });
  }

  const result = leadMagnetSchema.safeParse(body);

  if (!result.success) {
    return Response.json({ success: false }, { status: 400 });
  }

  const { magnet, email, name, payload } = result.data;

  console.log('[lead-magnet]', JSON.stringify({ magnet, email, name, payload }));

  const text = [
    `Name: ${name || 'Not provided'}`,
    `Email: ${email}`,
    `Magnet: ${magnet}`,
    '',
    'Payload:',
    JSON.stringify(payload, null, 2),
  ].join('\n');

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error('Lead magnet email not sent: RESEND_API_KEY is not set');
  } else {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.LEAD_EMAIL_FROM || 'Caleb Bolden <onboarding@resend.dev>',
          to: [process.env.LEAD_EMAIL_TO || 'cbolden15@gmail.com'],
          subject: `Lead magnet: ${magnet} (${email})`,
          text,
        }),
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        console.error('Failed to send lead magnet email:', response.status, await response.text());
      }
    } catch (err) {
      console.error('Failed to send lead magnet email:', err);
    }
  }

  return Response.json({ success: true });
}
