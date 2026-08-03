import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { POST } from '../subscribe/route';
import { __resetRateLimit } from '../../../lib/rate-limit';

function req(body: unknown, ip = '203.0.113.1') {
  return new Request('http://localhost/api/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': ip },
    body: JSON.stringify(body),
  });
}

function reqWithHeaders(body: unknown, headers: Record<string, string>) {
  return new Request('http://localhost/api/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.stubEnv('LISTMONK_LIST_ID_OWNERS', '3');
  vi.stubEnv('LISTMONK_LIST_ID_OPERATORS', '4');
  vi.stubEnv('LISTMONK_API_URL', 'http://listmonk.test');
  vi.stubEnv('LISTMONK_API_USER', 'user');
  vi.stubEnv('LISTMONK_API_TOKEN', 'token');
  __resetRateLimit();
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('POST /api/subscribe attribution', () => {
  it('sends source and band into Listmonk attribs', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    const res = await POST(
      req({ email: 'a@b.com', list: 'operators', source: 'ai-readiness', band: 'sequence' })
    );

    expect(res.status).toBe(200);
    const sent = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(sent.lists).toEqual([4]);
    expect(sent.attribs).toMatchObject({
      welcome_step: 0,
      source: 'ai-readiness',
      band: 'sequence',
    });
  });

  it('stamps assessment_at on the create path so the scorecard can window on it', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    await POST(req({ email: 'a@b.com', list: 'owners', source: 'ai-readiness', band: 'pilot' }));

    const sent = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(typeof sent.attribs.assessment_at).toBe('string');
    expect(Number.isNaN(Date.parse(sent.attribs.assessment_at))).toBe(false);
  });

  it('omits absent optional fields from attribs', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    const res = await POST(req({ email: 'a@b.com', list: 'owners' }));

    expect(res.status).toBe(200);
    const sent = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(sent.attribs).toEqual({ welcome_step: 0 });
  });

  it('rejects an unknown band', async () => {
    const res = await POST(req({ email: 'a@b.com', list: 'owners', band: 'nope' }));
    expect(res.status).toBe(400);
  });

  it('rejects an email past the RFC 5321 length limit', async () => {
    const tooLong = `${'a'.repeat(250)}@b.com`;
    const res = await POST(req({ email: tooLong, list: 'owners' }));
    expect(res.status).toBe(400);
  });
});

describe('POST /api/subscribe rate-limit key derivation', () => {
  // Cloudflare appends the connecting IP to a client-supplied X-Forwarded-For,
  // so the leftmost entry is attacker-controlled and must never key the limiter.
  it('prefers cf-connecting-ip over a forged x-forwarded-for', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    // Same real client, rotating the forgeable header on every request.
    for (let i = 0; i < 5; i += 1) {
      const ok = await POST(
        reqWithHeaders(
          { email: `a${i}@b.com`, list: 'owners' },
          { 'cf-connecting-ip': '198.51.100.20', 'x-forwarded-for': `1.2.3.${i}` }
        )
      );
      expect(ok.status).toBe(200);
    }

    const blocked = await POST(
      reqWithHeaders(
        { email: 'a6@b.com', list: 'owners' },
        { 'cf-connecting-ip': '198.51.100.20', 'x-forwarded-for': '1.2.3.99' }
      )
    );
    expect(blocked.status).toBe(429);
  });

  it('keys on the rightmost x-forwarded-for entry when cf-connecting-ip is absent', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    // Attacker rotates the leftmost (forged) entry; the appended real IP is last.
    for (let i = 0; i < 5; i += 1) {
      const ok = await POST(
        reqWithHeaders(
          { email: `a${i}@b.com`, list: 'owners' },
          { 'x-forwarded-for': `1.2.3.${i}, 198.51.100.21` }
        )
      );
      expect(ok.status).toBe(200);
    }

    const blocked = await POST(
      reqWithHeaders(
        { email: 'a6@b.com', list: 'owners' },
        { 'x-forwarded-for': '9.9.9.9, 198.51.100.21' }
      )
    );
    expect(blocked.status).toBe(429);
  });

  it('falls back to a single shared key when neither header is present', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    for (let i = 0; i < 5; i += 1) {
      const ok = await POST(reqWithHeaders({ email: `a${i}@b.com`, list: 'owners' }, {}));
      expect(ok.status).toBe(200);
    }

    const blocked = await POST(reqWithHeaders({ email: 'a6@b.com', list: 'owners' }, {}));
    expect(blocked.status).toBe(429);
  });
});

describe('POST /api/subscribe 409 cross-list', () => {
  it('adds an existing subscriber to the target list without sending a status', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response('conflict', { status: 409 }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ data: { results: [{ id: 77 }] } }), { status: 200 })
      )
      .mockResolvedValueOnce(new Response('{}', { status: 200 }))
      .mockResolvedValueOnce(new Response('{}', { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    const res = await POST(req({ email: 'a@b.com', list: 'operators' }));

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });

    const [listsUrl, listsInit] = fetchMock.mock.calls[2];
    expect(listsUrl).toContain('/api/subscribers/lists');
    expect(listsInit.method).toBe('PUT');
    const sent = JSON.parse(listsInit.body);
    expect(sent).toEqual({
      ids: [77],
      action: 'add',
      target_list_ids: [4],
    });
    // No `status` key: Listmonk's ON CONFLICT clause only overwrites an
    // existing subscriber_lists.status when $3 != '', so sending an explicit
    // status here would downgrade an already-confirmed membership back to
    // unconfirmed. Omitting the key leaves existing rows alone while new
    // rows still default to unconfirmed.
    expect('status' in sent).toBe(false);
  });

  // Listmonk v6.2.0's PUT /api/subscribers/lists is a bare SQL upsert
  // (core.AddSubscriptions) with no opt-in hook, so the confirmation has to be
  // asked for explicitly or the subscriber stays unconfirmed forever.
  it('sends the opt-in confirmation after the list add', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response('conflict', { status: 409 }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ data: { results: [{ id: 77 }] } }), { status: 200 })
      )
      .mockResolvedValueOnce(new Response('{}', { status: 200 }))
      .mockResolvedValueOnce(new Response('{}', { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    const res = await POST(req({ email: 'a@b.com', list: 'operators' }));
    expect(res.status).toBe(200);

    const [optinUrl, optinInit] = fetchMock.mock.calls[3];
    expect(optinUrl).toBe('http://listmonk.test/api/subscribers/77/optin');
    expect(optinInit.method).toBe('POST');
    expect(optinInit.body).toBeUndefined();
  });

  it('returns 502 when the opt-in confirmation send fails', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response('conflict', { status: 409 }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ data: { results: [{ id: 77 }] } }), { status: 200 })
      )
      .mockResolvedValueOnce(new Response('{}', { status: 200 }))
      .mockResolvedValueOnce(new Response('smtp down', { status: 500 }));
    vi.stubGlobal('fetch', fetchMock);

    const res = await POST(req({ email: 'a@b.com', list: 'operators' }));
    expect(res.status).toBe(502);
  });

  it('merges attribution into existing attribs without clobbering welcome_step', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response('conflict', { status: 409 }))
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            data: { results: [{ id: 77, attribs: { welcome_step: 2, welcome_last_at: 'x' } }] },
          }),
          { status: 200 }
        )
      )
      .mockResolvedValueOnce(new Response('{}', { status: 200 }))
      .mockResolvedValueOnce(new Response('{}', { status: 200 }))
      .mockResolvedValueOnce(new Response('{}', { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    const res = await POST(
      req({ email: 'a@b.com', list: 'operators', source: 'ai-readiness', band: 'sequence' })
    );
    expect(res.status).toBe(200);

    const [patchUrl, patchInit] = fetchMock.mock.calls[2];
    expect(patchUrl).toBe('http://listmonk.test/api/subscribers/77');
    // PATCH, not PUT: PUT deletes subscriptions absent from the body's `lists`.
    expect(patchInit.method).toBe('PATCH');

    const sent = JSON.parse(patchInit.body);
    expect(sent.lists).toBeUndefined();
    expect(sent.attribs).toMatchObject({
      welcome_step: 2,
      welcome_last_at: 'x',
      source: 'ai-readiness',
      band: 'sequence',
    });
    expect(typeof sent.attribs.assessment_at).toBe('string');

    // The attribution merge must run before the list add, so the PATCH's own
    // opt-in hook cannot fire on the list this request is about to add.
    expect(fetchMock.mock.calls[3][0]).toContain('/api/subscribers/lists');
    expect(fetchMock.mock.calls[4][0]).toContain('/optin');
  });

  it('returns 502 when the attribution merge fails', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response('conflict', { status: 409 }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ data: { results: [{ id: 77, attribs: {} }] } }), {
          status: 200,
        })
      )
      .mockResolvedValueOnce(new Response('nope', { status: 500 }));
    vi.stubGlobal('fetch', fetchMock);

    const res = await POST(
      req({ email: 'a@b.com', list: 'operators', source: 'ai-readiness', band: 'pilot' })
    );
    expect(res.status).toBe(502);
  });

  it('skips the attribution merge when there is nothing to attribute', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response('conflict', { status: 409 }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ data: { results: [{ id: 77 }] } }), { status: 200 })
      )
      .mockResolvedValueOnce(new Response('{}', { status: 200 }))
      .mockResolvedValueOnce(new Response('{}', { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    await POST(req({ email: 'a@b.com', list: 'operators' }));

    expect(fetchMock).toHaveBeenCalledTimes(4);
    expect(fetchMock.mock.calls.some(([, init]) => init?.method === 'PATCH')).toBe(false);
  });

  it('returns 502 when the subscriber lookup itself fails', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response('conflict', { status: 409 }))
      .mockResolvedValueOnce(new Response('forbidden', { status: 403 }));
    vi.stubGlobal('fetch', fetchMock);

    const res = await POST(req({ email: 'a@b.com', list: 'operators' }));
    expect(res.status).toBe(502);
  });

  it('returns 502 when the subscriber lookup finds nobody', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response('conflict', { status: 409 }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ data: { results: [] } }), { status: 200 })
      );
    vi.stubGlobal('fetch', fetchMock);

    const res = await POST(req({ email: 'a@b.com', list: 'operators' }));
    expect(res.status).toBe(502);
  });
});

describe('POST /api/subscribe rate limiting', () => {
  it('returns 429 after 5 requests from one IP', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    for (let i = 0; i < 5; i += 1) {
      const ok = await POST(req({ email: `a${i}@b.com`, list: 'owners' }, '198.51.100.7'));
      expect(ok.status).toBe(200);
    }

    const blocked = await POST(req({ email: 'a6@b.com', list: 'owners' }, '198.51.100.7'));
    expect(blocked.status).toBe(429);
  });

  it('does not limit a different IP', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    for (let i = 0; i < 5; i += 1) {
      await POST(req({ email: `c${i}@b.com`, list: 'owners' }, '198.51.100.8'));
    }

    const other = await POST(req({ email: 'd@b.com', list: 'owners' }, '198.51.100.9'));
    expect(other.status).toBe(200);
  });
});
