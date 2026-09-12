import { readFileSync } from 'node:fs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  agentConfigFixtureDTOSchema,
  agentConfigFixtureSchema,
  configReducer,
  configView,
  initialConfig,
  projectAgentConfigScenario,
  type AgentConfigFixtureDTO,
} from '../demos/agent-config';
import { projectLocalFixture } from '../evidence';
import { agentConfig, resolveAgentConfigPage } from '../projects/agent-config';
import { projectDevelopmentCaseStudyShell } from '../public-content';
import { resolvePublicProjectView } from '../publication';

const brief: AgentConfigFixtureDTO['scenarios'][number] = {
  id: 'brief',
  label: 'Brief',
  fragment: {
    heading: 'Response style',
    content: 'Lead with the result. Keep routine answers concise.',
  },
  outputs: {
    claudeCode: {
      variant: 'brief',
      content: 'Response style\nLead with the result.\nKeep routine answers concise.',
      highlight: 'Keep routine answers concise.',
    },
    codex: {
      variant: 'brief',
      content: 'Lead with the result.\nKeep routine answers concise.',
      highlight: 'Keep routine answers concise.',
    },
  },
};

const detailed: AgentConfigFixtureDTO['scenarios'][number] = {
  id: 'detailed',
  label: 'Detailed',
  fragment: {
    heading: 'Response style',
    content: 'Lead with the result. State assumptions before implementation. Keep each action bounded.',
  },
  outputs: {
    claudeCode: {
      variant: 'detailed',
      content: 'Response style\nLead with the result.\nState assumptions before implementation.\nKeep each action bounded.',
      highlight: 'State assumptions before implementation.',
    },
    codex: {
      variant: 'detailed',
      content: 'Lead with the result.\nState assumptions before implementation.\nKeep each action bounded.',
      highlight: 'State assumptions before implementation.',
    },
  },
};

export const syntheticConfigFixture: AgentConfigFixtureDTO = {
  kind: 'agent-config',
  scenarios: [brief, detailed],
  provenance: { kind: 'local-synthetic', label: 'Local synthetic example. Unapproved for publication.' },
};

afterEach(() => vi.unstubAllEnvs());

describe('Agent Config compiler example transitions', () => {
  it('starts on Brief with both generated outputs current', () => {
    expect(initialConfig).toEqual({ variant: 'brief', stale: false });
    expect(configView(initialConfig, syntheticConfigFixture)).toMatchObject({
      fragment: brief.fragment,
      claudeCode: { variant: 'brief', status: 'Current' },
      codex: { variant: 'brief', status: 'Current' },
    });
  });

  it('shows the opposite Codex output as stale in both directions while Claude Code stays current', () => {
    const staleBrief = configReducer(initialConfig, { type: 'stale' });
    expect(configView(staleBrief, syntheticConfigFixture)).toMatchObject({
      fragment: brief.fragment,
      claudeCode: { variant: 'brief', status: 'Current' },
      codex: { variant: 'detailed', status: 'Out of date' },
    });

    const detailedState = configReducer(initialConfig, { type: 'variant', value: 'detailed' });
    const staleDetailed = configReducer(detailedState, { type: 'stale' });
    expect(configView(staleDetailed, syntheticConfigFixture)).toMatchObject({
      fragment: detailed.fragment,
      claudeCode: { variant: 'detailed', status: 'Current' },
      codex: { variant: 'brief', status: 'Out of date' },
    });
  });

  it('clears stale state whenever Brief or Detailed is selected', () => {
    const staleBrief = configReducer(initialConfig, { type: 'stale' });
    expect(configReducer(staleBrief, { type: 'variant', value: 'detailed' })).toEqual({ variant: 'detailed', stale: false });
    expect(configReducer({ variant: 'detailed', stale: true }, { type: 'variant', value: 'detailed' })).toEqual({ variant: 'detailed', stale: false });
    expect(configReducer({ variant: 'detailed', stale: true }, { type: 'variant', value: 'brief' })).toEqual(initialConfig);
  });

  it('makes repeated stale and regeneration requests deterministic', () => {
    const stale = configReducer(initialConfig, { type: 'stale' });
    expect(configReducer(stale, { type: 'stale' })).toBe(stale);
    const regenerated = configReducer(stale, { type: 'regenerate' });
    expect(regenerated).toEqual(initialConfig);
    expect(configReducer(regenerated, { type: 'regenerate' })).toBe(regenerated);
    expect(configView(regenerated, syntheticConfigFixture).codex).toMatchObject({ variant: 'brief', status: 'Current' });
  });

  it('Reset restores Brief and clears stale state from every valid state', () => {
    for (const variant of ['brief', 'detailed'] as const) {
      for (const stale of [false, true]) {
        expect(configReducer({ variant, stale }, { type: 'reset' })).toEqual(initialConfig);
      }
    }
  });

  it('derives all displayed strings from the supplied fixture', () => {
    const changed = structuredClone(syntheticConfigFixture);
    changed.scenarios[0].fragment.content = 'A different harmless fragment supplied by the caller.';
    changed.scenarios[0].outputs.codex.content = 'A different projected Codex output.';
    changed.scenarios[0].outputs.codex.highlight = 'different projected';
    const view = configView(initialConfig, changed);
    expect(view.fragment.content).toBe('A different harmless fragment supplied by the caller.');
    expect(view.codex.content).toBe('A different projected Codex output.');
  });
});

describe('Agent Config fixture and publication boundary', () => {
  it('accepts Brief and Detailed in order and explicitly projects every public field', () => {
    const source = { kind: 'agent-config' as const, scenarios: [brief, detailed] };
    const parsed = agentConfigFixtureSchema.parse(source);
    expect(parsed.scenarios.map(projectAgentConfigScenario)).toEqual(source.scenarios);
    expect(agentConfigFixtureDTOSchema.parse(syntheticConfigFixture)).toEqual(syntheticConfigFixture);
  });

  it('rejects missing variants, wrong order, mismatched outputs, nested extras, and private text', () => {
    const source = { kind: 'agent-config' as const, scenarios: [brief, detailed] };
    const poisoned: unknown[] = [
      { ...source, scenarios: [brief] },
      { ...source, scenarios: [detailed, brief] },
      { ...source, scenarios: [{ ...brief, outputs: { ...brief.outputs, codex: { ...brief.outputs.codex, variant: 'detailed' } } }, detailed] },
      { ...source, scenarios: [{ ...brief, fragment: { ...brief.fragment, internalPath: 'hidden' } }, detailed] },
      { ...source, scenarios: [{ ...brief, fragment: { ...brief.fragment, content: 'Read /Users/example/private' } }, detailed] },
      { ...source, scenarios: [{ ...brief, outputs: { ...brief.outputs, codex: { ...brief.outputs.codex, highlight: 'not in output' } } }, detailed] },
    ];
    for (const candidate of poisoned) expect(agentConfigFixtureSchema.safeParse(candidate).success).toBe(false);
  });

  it('projects one local fixture without approval metadata or unrelated fields', () => {
    vi.stubEnv('NODE_ENV', 'development');
    const source = { kind: 'agent-config' as const, scenarios: [brief, detailed] };
    const projected = projectLocalFixture(JSON.stringify(source), agentConfigFixtureSchema, projectAgentConfigScenario,
      { manifest: { version: 1, snapshots: [] }, readBytes: () => new Uint8Array() });
    expect(agentConfigFixtureDTOSchema.parse(projected)).toEqual(syntheticConfigFixture);
    expect(JSON.stringify(projected)).not.toMatch(/approval|checkedDate|sha256|sourceRevision|runId|workspace|provider|model/);
  });

  it('keeps the authored fixture illustrative, harmless, and server-only', () => {
    const source = readFileSync('lib/work/fixtures/agent-config.json', 'utf8');
    const parsed = agentConfigFixtureSchema.parse(JSON.parse(source));
    expect(parsed.scenarios.map(item => item.id)).toEqual(['brief', 'detailed']);
    expect(source).toMatch(/purpose-written illustrative output/i);
    expect(source).not.toMatch(/https?:|@|\/Users\/|\/home\/|\.internal|localhost|sk-[A-Za-z0-9]+|"(?:runId|workspace|provider|model|customer|sourcePath)"\s*:/);
  });

  it('renders the authored draft only in development and returns production not-found', () => {
    vi.stubEnv('NODE_ENV', 'development');
    const development = resolveAgentConfigPage(agentConfig);
    expect(development.view.kind).toBe('rich-draft');
    expect(projectDevelopmentCaseStudyShell(agentConfig)?.developmentLabel).toBe('Local synthetic example. Unapproved for publication.');
    expect(development.metadata?.title).toBe('Agent Config | Work | Caleb Bolden');
    vi.stubEnv('NODE_ENV', 'production');
    expect(resolveAgentConfigPage(agentConfig)).toEqual({ view: { kind: 'not-found' }, metadata: null });
    expect(resolvePublicProjectView(agentConfig)).toEqual({ kind: 'not-found' });
  });
});
