import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  initialPrism,
  prismFixtureDTOSchema,
  prismFixtureSchema,
  prismReducer,
  prismView,
  projectPrismScenario,
  type PrismFixtureDTO,
  type PrismState,
} from '../demos/prism';
import { prism, resolvePrismPage } from '../projects/prism';
import { projectApprovedFixture, projectLocalFixture } from '../evidence';
import { projectDevelopmentCaseStudyShell } from '../public-content';
import { resolvePublicProjectView } from '../publication';
import { prismContractFixtureSchema } from '../prism-contract.server';

const scenario: PrismFixtureDTO['scenarios'][number] = {
  id: 'word-count',
  prompt: 'Count the words in: one two three',
  events: [
    { type: 'goal.accepted', label: 'Goal accepted', description: 'The bounded coordinator accepts the fixed goal.' },
    { type: 'provider.tool-requested', label: 'Tool requested', description: 'The scripted provider requests the text tool.' },
    { type: 'policy.allowed', label: 'Policy allowed', description: 'The policy admits the exact tool request.' },
    { type: 'tool.completed', label: 'Tool completed', description: 'The text tool counts three words.' },
    { type: 'provider.finalized', label: 'Provider finalized', description: 'The provider formats the tool result.' },
    { type: 'run.completed', label: 'Run completed', description: 'The coordinator records successful completion.' },
  ],
  result: '3 words',
  receipt: {
    recordVersion: 1,
    limits: { providerTurns: 2, toolCalls: 1 },
    terminal: { status: 'completed', answer: '3 words' },
  },
  lifecycleContract: {
    label: 'Lower-level lifecycle contract asserted by pinned source tests.',
    plugins: [
      { pluginId: 'local-scripted', confirmedAbsent: true, cleanupErrors: [], exitCode: 0, oomKilled: false },
      { pluginId: 'allow-text-stats', confirmedAbsent: true, cleanupErrors: [], exitCode: 0, oomKilled: false },
      { pluginId: 'text-stats', confirmedAbsent: true, cleanupErrors: [], exitCode: 0, oomKilled: false },
      { pluginId: 'local-scripted', confirmedAbsent: true, cleanupErrors: [], exitCode: 0, oomKilled: false },
    ],
  },
};

const fixture: PrismFixtureDTO = {
  kind: 'prism', scenarios: [scenario],
  provenance: { kind: 'local-synthetic', label: 'Local synthetic example. Unapproved for publication.' },
};

const approvedAllowedFields = [
  'kind', 'scenarios', 'scenarios.id', 'scenarios.prompt', 'scenarios.events',
  'scenarios.events.type', 'scenarios.events.label', 'scenarios.events.description', 'scenarios.result',
  'scenarios.receipt', 'scenarios.receipt.recordVersion', 'scenarios.receipt.limits',
  'scenarios.receipt.limits.providerTurns', 'scenarios.receipt.limits.toolCalls',
  'scenarios.receipt.terminal', 'scenarios.receipt.terminal.status', 'scenarios.receipt.terminal.answer',
  'scenarios.lifecycleContract', 'scenarios.lifecycleContract.label', 'scenarios.lifecycleContract.plugins',
  'scenarios.lifecycleContract.plugins.pluginId', 'scenarios.lifecycleContract.plugins.confirmedAbsent',
  'scenarios.lifecycleContract.plugins.cleanupErrors', 'scenarios.lifecycleContract.plugins.exitCode',
  'scenarios.lifecycleContract.plugins.oomKilled',
];

function approvedProjectionOptions(sourceScenario: PrismFixtureDTO['scenarios'][number] = scenario) {
  const content = Buffer.from(JSON.stringify({ kind: 'prism', scenarios: [sourceScenario] }));
  const poster = Buffer.from('synthetic poster bytes for projection testing');
  const digest = (bytes: Uint8Array) => createHash('sha256').update(bytes).digest('hex');
  const manifest = {
    version: 1 as const,
    snapshots: [{
      id: 'prism-public-contract', approval: 'approved' as const, derivation: 'contract-derived' as const,
      checkedDate: '2026-09-11', disclosure: 'Contract-derived test fixture with no captured identifiers.',
      version: '0.1.0', sourceRevision: 'fcad9afece7a7c12395946f9dd3305de0250bc1c',
      fixtures: [{ path: 'lib/work/fixtures/prism.json' as const, sha256: digest(content), mediaType: 'application/json' as const, allowedFields: [...approvedAllowedFields] }],
      media: [{ path: 'public/work/prism/overview.webp', sha256: digest(poster), mediaType: 'image/webp' as const, width: 1200, height: 800 }],
    }],
  };
  return {
    manifest, snapshotId: 'prism-public-contract', fixturePath: 'lib/work/fixtures/prism.json' as const,
    schema: prismContractFixtureSchema, projectScenario: projectPrismScenario,
    readBytes: (path: string) => path === 'lib/work/fixtures/prism.json' ? content : poster,
  };
}

afterEach(() => vi.unstubAllEnvs());

describe('Prism trace transitions', () => {
  it('keeps Next, Previous, and receipt inspection inert before Start', () => {
    expect(prismReducer(initialPrism, { type: 'next' })).toBe(initialPrism);
    expect(prismReducer(initialPrism, { type: 'previous' })).toBe(initialPrism);
    expect(prismReducer(initialPrism, { type: 'inspect-receipt' })).toBe(initialPrism);
    expect(prismReducer(initialPrism, { type: 'close-receipt' })).toBe(initialPrism);
    expect(prismView(initialPrism, fixture)).toMatchObject({
      activeEvent: undefined, result: undefined, receipt: undefined, receiptEligible: false,
      disabled: { start: false, previous: true, next: true, inspectReceipt: true },
    });
  });

  it('walks all six events, exposes the terminal result and receipt, then walks backward', () => {
    let state = prismReducer(initialPrism, { type: 'start' });
    expect(state).toEqual({ eventIndex: 0, receiptOpen: false });
    expect(prismReducer(state, { type: 'start' })).toBe(state);
    for (let index = 0; index < scenario.events.length; index += 1) {
      const view = prismView(state, fixture);
      expect(view.activeEvent).toEqual(scenario.events[index]);
      expect(view.result).toBe(index === 5 ? '3 words' : undefined);
      expect(view.receiptEligible).toBe(index === 5);
      if (index < 5) state = prismReducer(state, { type: 'next' });
    }
    expect(prismView(state, fixture).disabled.next).toBe(true);
    expect(prismReducer(state, { type: 'next' })).toBe(state);
    state = prismReducer(state, { type: 'inspect-receipt' });
    expect(prismView(state, fixture).receipt).toEqual(scenario.receipt);
    expect(prismReducer(state, { type: 'inspect-receipt' })).toBe(state);
    const earlier = prismReducer(state, { type: 'previous' });
    expect(earlier).toEqual({ eventIndex: 4, receiptOpen: false });
    expect(prismView(earlier, fixture).result).toBeUndefined();
    expect(prismView(earlier, fixture).receipt).toBeUndefined();
    expect(prismReducer(earlier, { type: 'reset' })).toEqual(initialPrism);
  });

  it('bounds Previous at event zero and Reset restores every valid state', () => {
    const first = prismReducer(initialPrism, { type: 'start' });
    expect(prismReducer(first, { type: 'previous' })).toBe(first);
    for (let eventIndex = -1; eventIndex < 6; eventIndex += 1) {
      for (const receiptOpen of [false, true]) {
        const state: PrismState = { eventIndex, receiptOpen };
        expect(prismReducer(state, { type: 'reset' })).toEqual(initialPrism);
      }
    }
  });
});

describe('Prism fixture and publication boundary', () => {
  it('accepts the strict six-event DTO and explicitly projects every public field', () => {
    const content = { kind: 'prism' as const, scenarios: [scenario] };
    const parsed = prismFixtureSchema.parse(content);
    expect(parsed.scenarios.map(projectPrismScenario)).toEqual(content.scenarios);
    expect(prismFixtureDTOSchema.parse(fixture)).toEqual(fixture);
  });

  it('rejects malformed event counts, nested extras, private text, and receipt overclaims', () => {
    const content = { kind: 'prism' as const, scenarios: [scenario] };
    for (const poisoned of [
      { ...content, internalNotes: 'extra' },
      { ...content, scenarios: [{ ...scenario, events: scenario.events.slice(0, 5) }] },
      { ...content, scenarios: [{ ...scenario, events: scenario.events.map((event, index) => index === 2 ? { ...event, raw: 'extra' } : event) }] },
      { ...content, scenarios: [{ ...scenario, prompt: 'Read /Users/example/private' }] },
      { ...content, scenarios: [{ ...scenario, receipt: { ...scenario.receipt, usage: { providerTurns: 2 } } }] },
      { ...content, scenarios: [{ ...scenario, receipt: { ...scenario.receipt, cleanup: [] } }] },
      { ...content, scenarios: [scenario, scenario] },
    ]) expect(prismFixtureSchema.safeParse(poisoned).success).toBe(false);
  });

  it('projects the selected local fixture without approval metadata or unrelated fields', () => {
    vi.stubEnv('NODE_ENV', 'development');
    const content = { kind: 'prism' as const, scenarios: [scenario] };
    const projected = projectLocalFixture(JSON.stringify(content), prismContractFixtureSchema, projectPrismScenario,
      { manifest: { version: 1, snapshots: [] }, readBytes: () => new Uint8Array() });
    expect(prismFixtureDTOSchema.parse(projected)).toEqual(fixture);
    expect(JSON.stringify(projected)).not.toMatch(/approval|checkedDate|sourceRevision|sha256|runId|workspace|containerId/);
  });

  it('projects approved provenance only from a versioned, revision-pinned manifest snapshot', () => {
    const options = approvedProjectionOptions();
    const projected = prismFixtureDTOSchema.parse(projectApprovedFixture(options));
    expect(projected.provenance).toEqual({
      kind: 'approved', id: 'prism-public-contract', derivation: 'contract-derived', checkedDate: '2026-09-11',
      disclosure: 'Contract-derived test fixture with no captured identifiers.', version: '0.1.0',
      sourceRevision: 'fcad9afece7a7c12395946f9dd3305de0250bc1c',
    });
    options.manifest.snapshots[0].fixtures[0].allowedFields = approvedAllowedFields.filter(field => field !== 'scenarios.receipt.terminal.answer');
    expect(() => projectApprovedFixture(options)).toThrow(/not approved/i);
  });

  it('rejects semantically changed bytes through the approved projection path even with a matching digest', () => {
    const changed = structuredClone(scenario);
    changed.prompt = 'Count the words in: one two';
    expect(() => projectApprovedFixture(approvedProjectionOptions(changed))).toThrow(/Prism v0\.1\.0 contract/i);
  });

  it('renders an explicit draft only in development and returns production not-found', () => {
    const draft = { ...prism, publication: 'draft' as const, caseStudy: {
      publication: 'draft' as const, story: prism.caseStudy?.story,
      localFixture: { kind: 'prism' as const, path: 'lib/work/fixtures/prism.json' },
    } };
    vi.stubEnv('NODE_ENV', 'development');
    const development = resolvePrismPage(draft);
    expect(development.view.kind).toBe('rich-draft');
    expect(projectDevelopmentCaseStudyShell(draft)?.developmentLabel).toBe('Local synthetic example. Unapproved for publication.');
    expect(development.metadata?.title).toBe('Prism | Work | Caleb Bolden');
    vi.stubEnv('NODE_ENV', 'production');
    const production = resolvePrismPage(draft);
    expect(production).toEqual({ view: { kind: 'not-found' }, metadata: null });
    expect(resolvePublicProjectView(draft)).toEqual({ kind: 'not-found' });
  });

  it('keeps the authored fixture server-side and aligned to the pinned contract', () => {
    const source = readFileSync('lib/work/fixtures/prism.json', 'utf8');
    const parsed = prismContractFixtureSchema.parse(JSON.parse(source));
    expect(parsed.scenarios[0]).toMatchObject({
      prompt: 'Count the words in: one two three', result: '3 words',
      receipt: { recordVersion: 1, limits: { providerTurns: 2, toolCalls: 1 }, terminal: { status: 'completed', answer: '3 words' } },
    });
    expect(parsed.scenarios[0].events.map(event => event.type)).toEqual([
      'goal.accepted', 'provider.tool-requested', 'policy.allowed', 'tool.completed', 'provider.finalized', 'run.completed',
    ]);
    expect(parsed.scenarios[0].lifecycleContract.plugins).toEqual([
      { pluginId: 'local-scripted', confirmedAbsent: true, cleanupErrors: [], exitCode: 0, oomKilled: false },
      { pluginId: 'allow-text-stats', confirmedAbsent: true, cleanupErrors: [], exitCode: 0, oomKilled: false },
      { pluginId: 'text-stats', confirmedAbsent: true, cleanupErrors: [], exitCode: 0, oomKilled: false },
      { pluginId: 'local-scripted', confirmedAbsent: true, cleanupErrors: [], exitCode: 0, oomKilled: false },
    ]);
    expect(source).not.toMatch(/https?:|@|\/Users\/|\.internal|sk-[A-Za-z0-9]+|runId|workspace|containerId|hardDeadlineAtMs|daemonState|settledAtMs/);
  });
});

describe('Prism pinned server contract', () => {
  const content = () => ({ kind: 'prism' as const, scenarios: [structuredClone(scenario)] });
  const rejectedByActualProjection = (candidate: ReturnType<typeof content>) => {
    vi.stubEnv('NODE_ENV', 'development');
    expect(() => projectLocalFixture(JSON.stringify(candidate), prismContractFixtureSchema, projectPrismScenario,
      { manifest: { version: 1, snapshots: [] }, readBytes: () => new Uint8Array() })).toThrow(/Prism v0\.1\.0 contract/i);
  };

  it('rejects changed prompt, result, or terminal answer on the route projection schema', () => {
    const changedPrompt = content();
    changedPrompt.scenarios[0].prompt = 'Count the words in: one two';
    rejectedByActualProjection(changedPrompt);
    const changedResult = content();
    changedResult.scenarios[0].result = '2 words';
    rejectedByActualProjection(changedResult);
    const changedTerminal = content();
    changedTerminal.scenarios[0].receipt.terminal.answer = '2 words';
    rejectedByActualProjection(changedTerminal);
  });

  it('rejects swapped, repeated, or invented event identifiers', () => {
    const swapped = content();
    [swapped.scenarios[0].events[1], swapped.scenarios[0].events[2]] = [swapped.scenarios[0].events[2], swapped.scenarios[0].events[1]];
    rejectedByActualProjection(swapped);
    const repeated = content();
    repeated.scenarios[0].events[1].type = repeated.scenarios[0].events[0].type;
    rejectedByActualProjection(repeated);
    const invented = content();
    invented.scenarios[0].events[4].type = 'provider.invented';
    rejectedByActualProjection(invented);
  });

  it('rejects altered fixed limits', () => {
    for (const [field, value] of [['providerTurns', 3], ['toolCalls', 2]] as const) {
      const changed = content();
      changed.scenarios[0].receipt.limits[field] = value;
      rejectedByActualProjection(changed);
    }
  });

  it('rejects missing, reordered, repeated, or arbitrary lifecycle plugin identities', () => {
    const missing = content();
    missing.scenarios[0].lifecycleContract.plugins.pop();
    rejectedByActualProjection(missing);
    const reordered = content();
    [reordered.scenarios[0].lifecycleContract.plugins[0], reordered.scenarios[0].lifecycleContract.plugins[1]] =
      [reordered.scenarios[0].lifecycleContract.plugins[1], reordered.scenarios[0].lifecycleContract.plugins[0]];
    rejectedByActualProjection(reordered);
    const repeated = content();
    repeated.scenarios[0].lifecycleContract.plugins[1].pluginId = 'local-scripted';
    rejectedByActualProjection(repeated);
    const arbitrary = content();
    arbitrary.scenarios[0].lifecycleContract.plugins[2].pluginId = 'arbitrary-tool';
    rejectedByActualProjection(arbitrary);
  });

  it('rejects every failed lifecycle invariant', () => {
    const absence = content();
    absence.scenarios[0].lifecycleContract.plugins[0].confirmedAbsent = false;
    rejectedByActualProjection(absence);
    const cleanup = content();
    cleanup.scenarios[0].lifecycleContract.plugins[1].cleanupErrors = ['cleanup failed'];
    rejectedByActualProjection(cleanup);
    for (const exitCode of [null, 1]) {
      const exit = content();
      exit.scenarios[0].lifecycleContract.plugins[2].exitCode = exitCode;
      rejectedByActualProjection(exit);
    }
    const oom = content();
    oom.scenarios[0].lifecycleContract.plugins[3].oomKilled = true;
    rejectedByActualProjection(oom);
  });
});
