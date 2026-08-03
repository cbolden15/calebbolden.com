import { z } from 'zod';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const subscribeSchema = z
  .object({
    email: z.string().regex(emailPattern),
    list: z.enum(['owners', 'operators']),
    source: z.string().max(64).optional(),
    band: z.enum(['foundations', 'pilot', 'sequence']).optional(),
  })
  .strict();

function listIdFor(list: 'owners' | 'operators'): string | undefined {
  return list === 'owners'
    ? process.env.LISTMONK_LIST_ID_OWNERS
    : process.env.LISTMONK_LIST_ID_OPERATORS;
}

export async function POST(req: Request) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: 'bad json' }, { status: 400 });
  }

  const result = subscribeSchema.safeParse(body);

  if (!result.success) {
    return Response.json({ ok: false, error: 'invalid request' }, { status: 400 });
  }

  const { email, list, source, band } = result.data;
  const listId = listIdFor(list);

  if (!listId) {
    return Response.json({ ok: false, error: 'unknown list' }, { status: 400 });
  }

  const auth = Buffer.from(`${process.env.LISTMONK_API_USER}:${process.env.LISTMONK_API_TOKEN}`).toString(
    'base64'
  );

  let res: Response;
  try {
    res = await fetch(`${process.env.LISTMONK_API_URL}/api/subscribers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Basic ${auth}` },
      body: JSON.stringify({
        email,
        name: '',
        status: 'enabled',
        lists: [Number(listId)],
        attribs: {
          welcome_step: 0,
          ...(source ? { source } : {}),
          ...(band ? { band } : {}),
        },
      }),
      signal: AbortSignal.timeout(10000),
    });
  } catch (err) {
    console.error('Failed to reach Listmonk:', err);
    return Response.json({ ok: false, error: 'upstream' }, { status: 502 });
  }

  // 409 = already subscribed: treat as success (idempotent signup)
  if (!res.ok && res.status !== 409) {
    console.error('Listmonk subscribe failed:', res.status, await res.text());
    return Response.json({ ok: false, error: 'upstream' }, { status: 502 });
  }

  return Response.json({ ok: true });
}
