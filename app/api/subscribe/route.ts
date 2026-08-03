import { z } from 'zod';
import { rateLimit } from '../../../lib/rate-limit';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const subscribeSchema = z
  .object({
    // 254 is the RFC 5321 ceiling for a forward path. The value is later
    // interpolated into a Listmonk SQL expression, so it must be bounded.
    email: z.string().max(254).regex(emailPattern),
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

/**
 * Cloudflare *appends* the connecting IP to any client-supplied
 * X-Forwarded-For rather than replacing it, so the leftmost entry is whatever
 * the caller sent and is useless as a limiter key. CF-Connecting-IP is
 * overwritten by Cloudflare on every request and cannot be forged; the
 * rightmost X-Forwarded-For entry is the one appended closest to us.
 */
function clientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for') ?? '';
  return (
    req.headers.get('cf-connecting-ip')?.trim() || xff.split(',').pop()?.trim() || 'unknown'
  );
}

export async function POST(req: Request) {
  const ip = clientIp(req);

  if (!rateLimit(`subscribe:${ip}`, 5, 10 * 60 * 1000).allowed) {
    return Response.json({ ok: false, error: 'rate limited' }, { status: 429 });
  }

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

  // `assessment_at` records when the attribution was written, so the scorecard
  // can window on completion time instead of subscriber creation time. Only a
  // caller that identifies itself with `source` is countable, so the timestamp
  // rides along with it. Written identically on both the create and the
  // cross-list path so the two are counted the same way.
  const attribution: Record<string, string> = {
    ...(source ? { source, assessment_at: new Date().toISOString() } : {}),
    ...(band ? { band } : {}),
  };

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
          ...attribution,
        },
      }),
      signal: AbortSignal.timeout(10000),
    });
  } catch (err) {
    console.error('Failed to reach Listmonk:', err);
    return Response.json({ ok: false, error: 'upstream' }, { status: 502 });
  }

  if (res.status === 409) {
    const added = await addExistingSubscriberToList(email, Number(listId), auth, attribution);
    if (!added) {
      return Response.json({ ok: false, error: 'upstream' }, { status: 502 });
    }
    logSubscribed(list, listId, source, band, 'cross-listed');
    return Response.json({ ok: true });
  }

  if (!res.ok) {
    console.error('Listmonk subscribe failed:', res.status, await res.text());
    return Response.json({ ok: false, error: 'upstream' }, { status: 502 });
  }

  logSubscribed(list, listId, source, band, 'created');
  return Response.json({ ok: true });
}

/**
 * One greppable line per successful subscribe. The quiz renders its success
 * state regardless of what this route returned, so this is the only signal
 * that the band router is routing anything at all. Deliberately excludes the
 * email address.
 */
function logSubscribed(
  list: string,
  listId: string,
  source: string | undefined,
  band: string | undefined,
  path: 'created' | 'cross-listed'
): void {
  console.info(
    `subscribe ok path=${path} list=${list} list_id=${listId} source=${source ?? 'none'} band=${band ?? 'none'}`
  );
}

async function addExistingSubscriberToList(
  email: string,
  listId: number,
  auth: string,
  attribution: Record<string, string>
): Promise<boolean> {
  const base = process.env.LISTMONK_API_URL;
  const headers = { 'Content-Type': 'application/json', Authorization: `Basic ${auth}` };

  try {
    const query = encodeURIComponent(`subscribers.email='${email.replace(/'/g, "''")}'`);
    const lookup = await fetch(`${base}/api/subscribers?query=${query}&per_page=1`, {
      headers,
      signal: AbortSignal.timeout(10000),
    });
    if (!lookup.ok) {
      console.error('Listmonk subscriber lookup failed:', lookup.status, await lookup.text());
      return false;
    }

    const found = await lookup.json();
    const subscriber = found?.data?.results?.[0];
    const id = subscriber?.id;
    if (typeof id !== 'number') {
      console.error('Listmonk subscriber lookup returned no matching subscriber for', email);
      return false;
    }

    // Merge attribution into the subscriber's existing attribs. `welcome_step`
    // (owned by the n8n welcome sequence) and anything else already there must
    // survive, so the existing object is spread underneath.
    //
    // PATCH, not PUT: PUT /api/subscribers/{id} deletes every subscription
    // absent from the body's `lists` array, which would drop the very
    // memberships this path exists to preserve. PATCH with no `lists` key
    // leaves subscriptions untouched.
    //
    // Ordered before the list add on purpose. PATCH runs Listmonk's own opt-in
    // hook over the subscriber's *already* unconfirmed double opt-in lists;
    // running it first means the list added below is not yet visible to it, so
    // the explicit opt-in call at the end is the single confirmation sent.
    if (Object.keys(attribution).length > 0) {
      const merged = { ...(subscriber?.attribs ?? {}), ...attribution };
      const patch = await fetch(`${base}/api/subscribers/${id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ attribs: merged }),
        signal: AbortSignal.timeout(10000),
      });
      if (!patch.ok) {
        console.error('Listmonk attribution merge failed:', patch.status, await patch.text());
        return false;
      }
    }

    const update = await fetch(`${base}/api/subscribers/lists`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        ids: [id],
        action: 'add',
        target_list_ids: [listId],
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!update.ok) {
      console.error('Listmonk add existing subscriber to list failed:', update.status, await update.text());
      return false;
    }

    // Adding a list membership sends no mail. PUT /api/subscribers/lists is a
    // bare SQL upsert (core.AddSubscriptions in Listmonk v6.2.0) with no
    // opt-in hook on any code path, so without this call the subscriber sits
    // `unconfirmed` forever, the welcome sequence (which gates on `confirmed`)
    // skips them, and they receive nothing. POST /api/subscribers/{id}/optin
    // takes no body and mails one confirmation covering every unconfirmed
    // double opt-in list the subscriber has.
    const optin = await fetch(`${base}/api/subscribers/${id}/optin`, {
      method: 'POST',
      headers,
      signal: AbortSignal.timeout(10000),
    });
    if (!optin.ok) {
      console.error('Listmonk opt-in confirmation send failed:', optin.status, await optin.text());
      return false;
    }

    return true;
  } catch (err) {
    console.error('Failed to add existing subscriber to list:', err);
    return false;
  }
}
