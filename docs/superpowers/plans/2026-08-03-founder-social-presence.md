# Founder Social Presence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up four social accounts under the Caleb Bolden name, wire the AI-readiness assessment to route respondents into the correct Listmonk list by band, and publish through Vora's own social layer.

**Architecture:** Three code changes to `calebbolden.com` (harden `/api/subscribe`, add attribution passthrough, wire the band router in `ReadinessScorecard`), plus two committed artifacts (an 18-week syllabus and a founder-executed setup runbook), plus one n8n scorecard change. Test infrastructure is added first because the repository currently has none and this plan touches a live mail path.

**Tech Stack:** Next.js 15 App Router, TypeScript, Zod, Vitest (new), Listmonk HTTP API, n8n, Vora social layer (Ayrshare).

**Spec:** `docs/superpowers/specs/2026-08-03-founder-social-presence-design.md`

## Global Constraints

- Display name is `Caleb Bolden` on all four platforms. Handle convention `@calebbolden`, falling back to `@calebboldenai`.
- House-of-brands hygiene: "Vora Technologies, LLC" and "Vora Technologies Consulting" appear only in the LinkedIn experience section. Never in the three video feeds.
- Vora stays 80% of founder hours. No paid ads. The builders/X audience stays parked.
- Total ongoing cost target: ~32 min/week (30 min monthly filming batch, 15 min weekly essay, 10 min weekly comment approval).
- Tracked metrics are exactly two: assessment completions per week (band-tagged) and follower count per channel (monthly). Views, likes, impressions, and engagement rate are explicitly not tracked and must not be added to the scorecard.
- The brand-voice profile is authored from scratch. Never inherit `industry-presets.ts`, which is tuned for local service SMBs.
- Listmonk runs double opt-in. Any subscriber added to a new list must land as `unconfirmed` so Listmonk sends its confirmation mail.
- Band-to-list mapping is fixed: `foundations` → owners, `pilot` → owners, `sequence` → operators.

## File Structure

| File | Responsibility | Task |
|---|---|---|
| `vitest.config.ts` | Test runner config | 1 |
| `.claude/test-command` | Opt into the post-edit test hook | 1 |
| `lib/rate-limit.ts` | Fixed-window in-memory limiter, injectable clock | 4 |
| `lib/social/band-list.ts` | Pure band-to-list mapping | 5 |
| `app/api/subscribe/route.ts` | Listmonk subscribe: attribution, 409 cross-list, rate limit | 2, 3, 4 |
| `components/tools/ReadinessScorecard.tsx` | Calls subscribe with band-derived list | 5 |
| `consulting/social/syllabus.md` | 18-week content schedule | 6 |
| `consulting/social/account-setup.md` | Founder-executed setup runbook | 7 |
| `infra/listmonk/n8n-scorecard-flow.md` | Two new scorecard lines | 8 |

---

### Task 1: Test infrastructure

The repository has no test runner, no test files, and no `test` script. Tasks 2 through 5 cannot be written test-first until this exists.

**Files:**
- Create: `vitest.config.ts`
- Create: `.claude/test-command`
- Create: `lib/__tests__/smoke.test.ts`
- Modify: `package.json` (scripts block)

**Interfaces:**
- Consumes: nothing
- Produces: `npm test` runs Vitest in Node environment over `**/*.test.ts`. All later tasks depend on this command.

- [ ] **Step 1: Install Vitest**

```bash
cd /Users/calebbolden/Projects/calebbolden.com
npm install --save-dev vitest@^3
```

- [ ] **Step 2: Create the Vitest config**

Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['**/*.test.ts'],
    exclude: ['node_modules/**', '.next/**', '.claude/**', 'infra/**'],
  },
});
```

- [ ] **Step 3: Add the test script**

In `package.json`, add to the `scripts` object, leaving `build`, `dev`, `start`, and `lint` untouched:

```json
"test": "vitest run"
```

- [ ] **Step 4: Write a smoke test**

Create `lib/__tests__/smoke.test.ts`:

```ts
import { describe, it, expect } from 'vitest';

describe('test harness', () => {
  it('runs', () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 5: Run the tests**

Run: `npm test`
Expected: PASS, 1 test passed.

- [ ] **Step 6: Opt into the post-edit test hook**

Create `.claude/test-command` containing exactly one line:

```
npm test
```

- [ ] **Step 7: Commit**

```bash
git add vitest.config.ts package.json package-lock.json lib/__tests__/smoke.test.ts .claude/test-command
git commit -m "test: add vitest harness"
```

---

### Task 2: Subscribe route accepts attribution, and reads env at call time

Two changes. First, `LISTS` is a module-level constant evaluated at import, so tests cannot stub the env vars; it becomes a function. Second, the route accepts optional `source` and `band` and writes them into Listmonk `attribs`, which is what makes assessment completions countable in Task 8 without adding a datastore.

**Files:**
- Modify: `app/api/subscribe/route.ts:5-15` (schema and LISTS), `:32-37` (lookup), `:48-54` (body)
- Create: `app/api/__tests__/subscribe.test.ts`

**Interfaces:**
- Consumes: `npm test` from Task 1
- Produces: `POST /api/subscribe` accepts `{email: string, list: 'owners'|'operators', source?: string, band?: 'foundations'|'pilot'|'sequence'}`. Listmonk `attribs` becomes `{welcome_step: 0, source?, band?}`. Task 5 sends these fields; Task 8 queries them.

- [ ] **Step 1: Write the failing tests**

Create `app/api/__tests__/subscribe.test.ts`:

```ts
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
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- subscribe`
Expected: FAIL. The strict schema rejects `source`/`band`, so the first test gets 400 rather than 200.

- [ ] **Step 3: Implement**

In `app/api/subscribe/route.ts`, replace lines 5 through 15 with:

```ts
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
```

Replace lines 32 and 33 (`const { email, list } = ...` and `const listId = LISTS[list];`) with:

```ts
  const { email, list, source, band } = result.data;
  const listId = listIdFor(list);
```

Replace the `attribs` line inside the fetch body with:

```ts
        attribs: {
          welcome_step: 0,
          ...(source ? { source } : {}),
          ...(band ? { band } : {}),
        },
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test -- subscribe`
Expected: PASS, 3 tests.

- [ ] **Step 5: Commit**

```bash
git add app/api/subscribe/route.ts app/api/__tests__/subscribe.test.ts
git commit -m "feat(subscribe): accept source and band attribution"
```

---

### Task 3: Resolve the 409 cross-list no-op

The live bug. Listmonk returns 409 when the email already exists; the route treats that as success and does nothing, so an existing owners subscriber who later scores `sequence` never reaches the operators list. This is the band router's main path and must be fixed before Task 5 sends traffic.

On 409: look the subscriber up by email, then add them to the target list as `unconfirmed` so double opt-in still fires.

**Files:**
- Modify: `app/api/subscribe/route.ts:62-68` (the 409 branch)
- Modify: `app/api/__tests__/subscribe.test.ts` (add a describe block)

**Interfaces:**
- Consumes: `listIdFor` from Task 2
- Produces: `POST /api/subscribe` returns `{ok: true}` after genuinely adding an existing subscriber to the target list. Task 5 relies on this.

- [ ] **Step 1: Write the failing tests**

Append to `app/api/__tests__/subscribe.test.ts`:

```ts
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
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- subscribe`
Expected: FAIL. Only one fetch call is made, so `fetchMock.mock.calls[2]` is undefined.

- [ ] **Step 3: Implement**

In `app/api/subscribe/route.ts`, replace the block at lines 62 through 68 with:

```ts
  if (res.status === 409) {
    const added = await addExistingSubscriberToList(email, Number(listId), auth);
    if (!added) {
      return Response.json({ ok: false, error: 'upstream' }, { status: 502 });
    }
    return Response.json({ ok: true });
  }

  if (!res.ok) {
    console.error('Listmonk subscribe failed:', res.status, await res.text());
    return Response.json({ ok: false, error: 'upstream' }, { status: 502 });
  }

  return Response.json({ ok: true });
}

async function addExistingSubscriberToList(
  email: string,
  listId: number,
  auth: string
): Promise<boolean> {
  const base = process.env.LISTMONK_API_URL;
  const headers = { 'Content-Type': 'application/json', Authorization: `Basic ${auth}` };

  try {
    const query = encodeURIComponent(`subscribers.email='${email.replace(/'/g, "''")}'`);
    const lookup = await fetch(`${base}/api/subscribers?query=${query}&per_page=1`, {
      headers,
      signal: AbortSignal.timeout(10000),
    });
    if (!lookup.ok) return false;

    const found = await lookup.json();
    const id = found?.data?.results?.[0]?.id;
    if (typeof id !== 'number') return false;

    const update = await fetch(`${base}/api/subscribers/lists`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        ids: [id],
        action: 'add',
        target_list_ids: [listId],
        status: 'unconfirmed',
      }),
      signal: AbortSignal.timeout(10000),
    });
    return update.ok;
  } catch (err) {
    console.error('Failed to add existing subscriber to list:', err);
    return false;
  }
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test -- subscribe`
Expected: PASS, 5 tests.

- [ ] **Step 5: Verify the Listmonk API contract against the live instance**

The two endpoints above are taken from the Listmonk HTTP API. Confirm the shapes before trusting them in production:

```bash
source ~/.dev-secrets.env
curl -s -u "$LISTMONK_API_USER:$LISTMONK_API_TOKEN" \
  "https://lists.calebbolden.com/api/subscribers?query=subscribers.email='nobody@example.com'&per_page=1" | head -c 400
```

Expected: JSON containing `data.results` as an array. If the response shape differs, correct `addExistingSubscriberToList` and its test together, then rerun `npm test -- subscribe`.

- [ ] **Step 6: Commit**

```bash
git add app/api/subscribe/route.ts app/api/__tests__/subscribe.test.ts
git commit -m "fix(subscribe): add existing subscribers to the target list on 409"
```

---

### Task 4: Rate limit the subscribe route

Second half of the `harden-subscribe-route` chip. The route posts to a live mail system and is publicly reachable. A fixed-window in-memory limiter is correct here because the site runs as a single Node process behind Caddy on Hetzner. It resets on deploy, which is acceptable and documented.

**Files:**
- Create: `lib/rate-limit.ts`
- Create: `lib/__tests__/rate-limit.test.ts`
- Modify: `app/api/subscribe/route.ts` (top of `POST`)
- Modify: `app/api/__tests__/subscribe.test.ts` (add a describe block)

**Interfaces:**
- Consumes: nothing
- Produces: `rateLimit(key: string, limit: number, windowMs: number, now?: number): {allowed: boolean; remaining: number}` and `__resetRateLimit(): void`.

- [ ] **Step 1: Write the failing limiter test**

Create `lib/__tests__/rate-limit.test.ts`:

```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { rateLimit, __resetRateLimit } from '../rate-limit';

beforeEach(() => __resetRateLimit());

describe('rateLimit', () => {
  it('allows up to the limit within a window', () => {
    expect(rateLimit('k', 3, 1000, 0).allowed).toBe(true);
    expect(rateLimit('k', 3, 1000, 100).allowed).toBe(true);
    expect(rateLimit('k', 3, 1000, 200).allowed).toBe(true);
  });

  it('blocks past the limit within a window', () => {
    rateLimit('k', 2, 1000, 0);
    rateLimit('k', 2, 1000, 10);
    expect(rateLimit('k', 2, 1000, 20)).toEqual({ allowed: false, remaining: 0 });
  });

  it('resets after the window elapses', () => {
    rateLimit('k', 1, 1000, 0);
    expect(rateLimit('k', 1, 1000, 500).allowed).toBe(false);
    expect(rateLimit('k', 1, 1000, 1000).allowed).toBe(true);
  });

  it('tracks keys independently', () => {
    rateLimit('a', 1, 1000, 0);
    expect(rateLimit('b', 1, 1000, 0).allowed).toBe(true);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- rate-limit`
Expected: FAIL, cannot resolve `../rate-limit`.

- [ ] **Step 3: Implement the limiter**

Create `lib/rate-limit.ts`:

```ts
type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
  now: number = Date.now()
): { allowed: boolean; remaining: number } {
  const bucket = buckets.get(key);

  if (!bucket || now >= bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (bucket.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  bucket.count += 1;
  return { allowed: true, remaining: limit - bucket.count };
}

export function __resetRateLimit(): void {
  buckets.clear();
}
```

- [ ] **Step 4: Run it to verify it passes**

Run: `npm test -- rate-limit`
Expected: PASS, 4 tests.

- [ ] **Step 5: Write the failing route test**

Append to `app/api/__tests__/subscribe.test.ts`, and add `import { __resetRateLimit } from '../../../lib/rate-limit';` to the imports plus `__resetRateLimit();` inside the existing `beforeEach`:

```ts
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
```

- [ ] **Step 6: Run it to verify it fails**

Run: `npm test -- subscribe`
Expected: FAIL, the sixth request returns 200 rather than 429.

- [ ] **Step 7: Wire the limiter into the route**

In `app/api/subscribe/route.ts`, add the import at the top:

```ts
import { rateLimit } from '@/lib/rate-limit';
```

Then insert at the very start of `POST`, before `let body: unknown;`:

```ts
  const ip = (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown';

  if (!rateLimit(`subscribe:${ip}`, 5, 10 * 60 * 1000).allowed) {
    return Response.json({ ok: false, error: 'rate limited' }, { status: 429 });
  }
```

If the `@/` alias fails to resolve under Vitest, change the import to a relative path (`../../../lib/rate-limit`) rather than adding a Vite path plugin.

- [ ] **Step 8: Run the full suite**

Run: `npm test`
Expected: PASS, 12 tests across 3 files.

- [ ] **Step 9: Commit**

```bash
git add lib/rate-limit.ts lib/__tests__/rate-limit.test.ts app/api/subscribe/route.ts app/api/__tests__/subscribe.test.ts
git commit -m "feat(subscribe): rate limit to 5 requests per IP per 10 minutes"
```

---

### Task 5: Band router in the readiness scorecard

Wires the assessment to the list. The decision logic is extracted into a pure module so it is unit-testable without adding jsdom and React Testing Library. The three-line `fetch` wiring itself is verified by build and by the manual round trip in Step 7, an accepted trade to keep the dependency footprint small.

**Files:**
- Create: `lib/social/band-list.ts`
- Create: `lib/social/__tests__/band-list.test.ts`
- Modify: `components/tools/ReadinessScorecard.tsx:142-167` (`handleGateSubmit`)

**Interfaces:**
- Consumes: `POST /api/subscribe` accepting `source` and `band` (Task 2), 409 cross-list resolution (Task 3)
- Produces: `bandToList(band: 'foundations'|'pilot'|'sequence'): 'owners'|'operators'`

- [ ] **Step 1: Write the failing test**

Create `lib/social/__tests__/band-list.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { bandToList } from '../band-list';

describe('bandToList', () => {
  it('routes foundations to owners', () => {
    expect(bandToList('foundations')).toBe('owners');
  });

  it('routes pilot to owners', () => {
    expect(bandToList('pilot')).toBe('owners');
  });

  it('routes sequence to operators', () => {
    expect(bandToList('sequence')).toBe('operators');
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- band-list`
Expected: FAIL, cannot resolve `../band-list`.

- [ ] **Step 3: Implement**

Create `lib/social/band-list.ts`:

```ts
export type BandKey = 'foundations' | 'pilot' | 'sequence';
export type ListName = 'owners' | 'operators';

/**
 * Readiness band determines which newsletter a respondent joins.
 * Foundations and pilot respondents are owner-shaped; sequence respondents
 * are operator-shaped. See the 2026-08-03 founder social presence spec.
 */
export function bandToList(band: BandKey): ListName {
  return band === 'sequence' ? 'operators' : 'owners';
}
```

- [ ] **Step 4: Run it to verify it passes**

Run: `npm test -- band-list`
Expected: PASS, 3 tests.

- [ ] **Step 5: Wire it into the component**

In `components/tools/ReadinessScorecard.tsx`, add to the imports:

```ts
import { bandToList } from '@/lib/social/band-list';
```

In `handleGateSubmit`, inside the existing `try` block and immediately after the `/api/lead-magnet` call's `if (!response.ok)` check, add:

```ts
      const subscribeResponse = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          list: bandToList(getBand(total)),
          source: 'ai-readiness',
          band: getBand(total),
        }),
      });

      if (!subscribeResponse.ok) {
        console.error('List subscribe failed:', subscribeResponse.status);
      }
```

A failed subscribe must not block lead-magnet delivery, which is why it logs rather than throws. The existing `finally` block still runs `setShowGuidance(true)`.

- [ ] **Step 6: Verify the build and the full suite**

Run: `npm run build && npm test`
Expected: build succeeds with no type errors; 15 tests pass across 4 files.

- [ ] **Step 7: Manual round trip against dev**

```bash
npm run dev
```

Open `http://localhost:3000/tools/ai-readiness`, answer all 18 questions choosing top-scoring answers to land in `sequence`, submit the email gate with a real address you control, then confirm:

1. The browser network tab shows `POST /api/subscribe` returning 200
2. Listmonk shows the address on the operators list with status `unconfirmed`
3. A confirmation email arrives

- [ ] **Step 8: Commit**

```bash
git add lib/social/band-list.ts lib/social/__tests__/band-list.test.ts components/tools/ReadinessScorecard.tsx
git commit -m "feat(readiness): route respondents to a list by readiness band"
```

---

### Task 6: The 18-week syllabus

The editorial spine as a committed artifact. Source of truth for the questions is `ReadinessScorecard.tsx`, which defines exactly 18 (`allAnswered = answeredCount === 18`).

**Files:**
- Create: `consulting/social/syllabus.md`
- Create: `consulting/social/__tests__/syllabus.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces: a schedule Task 7's runbook references

- [ ] **Step 1: Extract the real questions**

Read `components/tools/ReadinessScorecard.tsx` and transcribe all 18 question `text` values verbatim, grouped under their five section `title` values (`data and systems`, `process documentation`, `repetition and volume`, `team and buy-in`, `budget and focus`). Do not paraphrase and do not invent questions to reach 18. If the count read is not 18, stop and reconcile against `allAnswered` before continuing.

- [ ] **Step 2: Write the failing structural test**

Create `consulting/social/__tests__/syllabus.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const syllabus = readFileSync(join(process.cwd(), 'consulting/social/syllabus.md'), 'utf8');

describe('syllabus', () => {
  it('has exactly 18 weekly units', () => {
    const weeks = syllabus.match(/^### Week \d+:/gm) ?? [];
    expect(weeks).toHaveLength(18);
  });

  it('numbers the weeks 1 through 18 in order', () => {
    const numbers = [...syllabus.matchAll(/^### Week (\d+):/gm)].map((m) => Number(m[1]));
    expect(numbers).toEqual(Array.from({ length: 18 }, (_, i) => i + 1));
  });

  it('gives every week both a clip angle and an essay angle', () => {
    const clips = syllabus.match(/^\*\*Clip:\*\*/gm) ?? [];
    const essays = syllabus.match(/^\*\*Essay:\*\*/gm) ?? [];
    expect(clips).toHaveLength(18);
    expect(essays).toHaveLength(18);
  });

  it('never names the LLC in feed-facing copy', () => {
    expect(syllabus).not.toMatch(/Vora Technologies/i);
  });
});
```

- [ ] **Step 3: Run it to verify it fails**

Run: `npm test -- syllabus`
Expected: FAIL, cannot read `consulting/social/syllabus.md`.

- [ ] **Step 4: Write the syllabus**

Create `consulting/social/syllabus.md`. Open with a short header giving the source (`components/tools/ReadinessScorecard.tsx`), the cadence (one question per week, filmed one dimension per monthly batch), and the fixed call to action (take the assessment at `/tools/ai-readiness`).

Then one section per week in this exact shape, using the transcribed question from Step 1:

```markdown
### Week 1: Could you pull a clean list of your last 12 months of customers in under 10 minutes?

**Dimension:** data and systems

**Clip:** 45 to 75 seconds, owner-facing. Open on the question as asked. Show the failure concretely: the customer list living across a phone, a notebook, and one spreadsheet nobody else opens. Close on what becomes possible once it is one list, then the assessment CTA.

**Essay:** 200 to 300 words, operator-facing. Same question at 40 people rather than 4: the list exists, but three departments each keep their own version and none reconciles. Name the specific cost, which is that nobody can answer a churn question without a week of manual work.
```

Group the 18 weeks so that all questions from one dimension run consecutively, giving five monthly filming batches.

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npm test -- syllabus`
Expected: PASS, 4 tests.

- [ ] **Step 6: Commit**

```bash
git add consulting/social/syllabus.md consulting/social/__tests__/syllabus.test.ts
git commit -m "docs(social): 18-week readiness curriculum syllabus"
```

---

### Task 7: Founder setup runbook

Account creation and Vora tenant setup need a phone, four logins, and production access. They cannot be automated. This task produces the ordered runbook the founder executes.

**Files:**
- Create: `consulting/social/account-setup.md`

**Interfaces:**
- Consumes: `consulting/social/syllabus.md` (Task 6)
- Produces: nothing consumed by later tasks

- [ ] **Step 1: Write the runbook**

Create `consulting/social/account-setup.md` with these sections, in order:

**1. Handle availability.** Check `@calebbolden` on all four platforms first, before creating anything. If it is taken on any one of them, use `@calebboldenai` everywhere instead. Consistency across platforms outranks getting the preferred handle on three of four.

**2. LinkedIn (reposition, do not create).** LinkedIn permits one profile per person. Rewrite the headline, About, and Featured sections toward the operators audience. Add "Vora Technologies Consulting" under Experience; this is the only surface in this plan where the LLC name appears.

**3. YouTube.** Create a Brand Account under the existing Google account, named `Caleb Bolden`. This owns both the Shorts feed and the evergreen clinic recordings.

**4. Instagram.** Create a new account. Instagram permits multiple accounts per login, so this does not endanger the personal account.

**5. Facebook.** Create a Page off the existing personal account. Do not create a second personal account; that risks a ban on the account the Page depends on.

**6. Vora tenant.** Create an org for the consulting business on production. Connect all four accounts through `social/sync-accounts`.

**7. Brand voice.** Author a profile from scratch in `social/brand-voice`. Do not inherit `industry-presets.ts`. Record in the runbook that the presets are tuned for local service SMBs and will flatten the operators voice if inherited.

**8. Guardrails and approvals.** Enable guardrails so nothing auto-publishes unreviewed. Enable comment classification with the Telegram approval path, which is what collapses four comment inboxes into one phone prompt.

**9. First batch.** Film the `data and systems` dimension, which is weeks 1 through 3 of the syllabus, in one 30-minute session.

Close with a checklist of the two facts that must be recorded once known: the handle actually used, and the Vora org ID.

- [ ] **Step 2: Verify the runbook is complete**

Run: `grep -c '^\*\*[0-9]' consulting/social/account-setup.md`
Expected: `9`

- [ ] **Step 3: Commit**

```bash
git add consulting/social/account-setup.md
git commit -m "docs(social): founder account and Vora tenant setup runbook"
```

---

### Task 8: Scorecard additions

Two new lines on the existing Monday scorecard, and no more. Assessment completions come from Listmonk `attribs.source`, which Task 2 populates, so no new datastore is needed.

**Files:**
- Modify: `infra/listmonk/n8n-scorecard-flow.md`

**Interfaces:**
- Consumes: `attribs.source = 'ai-readiness'` and `attribs.band` written by Tasks 2 and 5
- Produces: nothing

- [ ] **Step 1: Read the existing flow**

Read `infra/listmonk/n8n-scorecard-flow.md` in full and match its existing structure and query style. Do not restructure it; add to it.

- [ ] **Step 2: Verify the attribs query works against live Listmonk**

```bash
source ~/.dev-secrets.env
curl -s -u "$LISTMONK_API_USER:$LISTMONK_API_TOKEN" \
  --data-urlencode "query=subscribers.attribs->>'source' = 'ai-readiness'" \
  -G "https://lists.calebbolden.com/api/subscribers?per_page=1" | head -c 300
```

Expected: JSON with a `data.total` field. Record the exact working query string; if the JSONB operator differs on this Listmonk version, adjust and record what actually worked.

- [ ] **Step 3: Add the two lines**

Append to the flow document, using the query confirmed in Step 2:

- **Assessment completions, last 7 days** — count of subscribers where `attribs->>'source' = 'ai-readiness'` created in the trailing week, broken out by `attribs->>'band'`
- **Follower count per channel** — pulled from Vora `social/analytics`, reported monthly rather than weekly

Add an explicit note that views, likes, impressions, and engagement rate are deliberately excluded, so a future editor does not add them back as an improvement.

- [ ] **Step 4: Record the gates next to the metrics**

The gates are only enforceable if they sit beside the numbers that trigger them. Append a "Gates" subsection to the same document:

- A channel earns continued investment at 10 or more assessment completions per month for two consecutive months.
- A channel producing fewer than 3 per month for three consecutive months is dropped, not optimized. Instagram is the likeliest casualty and dropping it is a success condition, not a failure.
- Whole-effort kill criterion: if the monthly filming batch is skipped four or more times in the first three months, cut to LinkedIn text-only rather than sustaining a missed cadence.
- Pressure valve: when a Vora sprint week overloads, video drops first and the LinkedIn essay is last to cut.

- [ ] **Step 5: Commit**

```bash
git add infra/listmonk/n8n-scorecard-flow.md
git commit -m "docs(scorecard): add assessment completions and follower count"
```

---

## Deferred

Not in this plan, recorded so they are not silently lost:

- **Site changes** (link-in-bio page, social links on `/owners` and `/operators`, social proof modules). The spec sequences these after accounts exist and have something to link to.
- **Back-publishing prior clinic recordings** to the new YouTube channel. Open item 5 in the spec; needs the channel to exist first.
- **Spine upgrade from curriculum to proof-of-work** as real installs accumulate. Explicitly designed to need no new plan.
