import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { POST } from '../subscribe/route';

function req(body: unknown, ip = '203.0.113.1') {
  return new Request('http://localhost/api/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': ip },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.stubEnv('LISTMONK_LIST_ID_OWNERS', '3');
  vi.stubEnv('LISTMONK_LIST_ID_OPERATORS', '4');
  vi.stubEnv('LISTMONK_API_URL', 'http://listmonk.test');
  vi.stubEnv('LISTMONK_API_USER', 'user');
  vi.stubEnv('LISTMONK_API_TOKEN', 'token');
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
    expect(sent.attribs).toEqual({ welcome_step: 0, source: 'ai-readiness', band: 'sequence' });
  });

  it('omits absent optional fields from attribs', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    await POST(req({ email: 'a@b.com', list: 'owners' }));

    const sent = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(sent.attribs).toEqual({ welcome_step: 0 });
  });

  it('rejects an unknown band', async () => {
    const res = await POST(req({ email: 'a@b.com', list: 'owners', band: 'nope' }));
    expect(res.status).toBe(400);
  });
});

describe('POST /api/subscribe 409 cross-list', () => {
  it('adds an existing subscriber to the target list as unconfirmed', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response('conflict', { status: 409 }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ data: { results: [{ id: 77 }] } }), { status: 200 })
      )
      .mockResolvedValueOnce(new Response('{}', { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    const res = await POST(req({ email: 'a@b.com', list: 'operators' }));

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });

    const [listsUrl, listsInit] = fetchMock.mock.calls[2];
    expect(listsUrl).toContain('/api/subscribers/lists');
    expect(listsInit.method).toBe('PUT');
    expect(JSON.parse(listsInit.body)).toEqual({
      ids: [77],
      action: 'add',
      target_list_ids: [4],
      status: 'unconfirmed',
    });
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
