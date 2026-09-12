import { describe, expect, it, vi } from 'vitest';
import { existsSync, readdirSync } from 'node:fs';
import { getCatalog, getHomeProjects, getMethodProjects, getPublishedCaseStudyPaths, getRelatedProjects, projectRecords, evidenceManifest } from '../catalog';
import { projectRecordSchema, knownRichRoutes, knownLegacyRoutes } from '../types';
import { collectRequiredShowcaseAssets, getPublishedWorkPaths, resolveDevelopmentProjectView, resolvePublicProjectView, validateProjectGraph } from '../publication';
import { normalizeCategory, projectMetadata, projectRelatedLinks } from '../public-content';
import { releaseRecords, releaseManifest, richRecord } from './samples';

describe('catalog publication boundary', () => {
  it('publishes the exact reviewed seven-entry catalog and required assets', () => {
    expect(getCatalog('all').count).toBe(7);
    expect(getCatalog('all').featured?.slug).toBe('vora');
    expect(getCatalog('all').rows.map(record => record.slug)).toEqual(['prism', 'agent-team', 'agent-config', 'control-center', 'chapterhq', 'site-assistant']);
    expect(getCatalog('products').count).toBe(3);
    expect(getCatalog('developer-tools').count).toBe(4);
    expect(projectRecords.filter(r => r.kind !== 'collection' && r.kind !== 'homepage-only').map(r => r.slug))
      .toEqual(['vora', 'prism', 'agent-team', 'agent-config', 'control-center', 'chapterhq', 'site-assistant']);
    expect(getPublishedWorkPaths(projectRecords)).toEqual(['/work/vora', '/work/prism', '/work/agent-team', '/work/agent-config', '/work/control-center', '/work/chapterhq', '/work/site-assistant']);
    expect(collectRequiredShowcaseAssets(projectRecords, evidenceManifest).map(asset => asset.path)).toEqual([
      'lib/work/fixtures/agent-config.json', 'lib/work/fixtures/agent-team.json', 'lib/work/fixtures/control-center.json', 'lib/work/fixtures/prism.json', 'lib/work/fixtures/vora.json',
      'public/work/agent-config/overview.webp', 'public/work/agent-team/overview.webp', 'public/work/control-center/overview.webp', 'public/work/prism/overview.webp', 'public/work/vora/overview.webp',
    ]);
    const actualRoutes = readdirSync('app/work', { withFileTypes: true }).filter(entry => entry.isDirectory() && existsSync(`app/work/${entry.name}/page.tsx`)).map(entry => `/work/${entry.name}`);
    expect(() => validateProjectGraph(projectRecords, evidenceManifest, actualRoutes)).not.toThrow();
  });

  it('derives current home, method, related and case-study surfaces from resolved public views', () => {
    expect(getHomeProjects().map(project => project.slug)).toEqual([
      'vora', 'prism', 'agent-team', 'agent-config', 'control-center', 'chapterhq', 'site-assistant', 'open-source', 'real-estate-maite',
    ]);
    expect(getMethodProjects().map(({ slug, label, order, poster }) => ({ slug, label, order, src: poster.src }))).toEqual([
      { slug: 'agent-config', label: 'Shared instructions and tool outputs', order: 0, src: '/work/agent-config/overview.webp' },
      { slug: 'agent-team', label: 'Review, retry, and blocked work', order: 1, src: '/work/agent-team/overview.webp' },
      { slug: 'control-center', label: 'Operator attention and sample records', order: 2, src: '/work/control-center/overview.webp' },
      { slug: 'prism', label: 'Event trace and terminal record', order: 3, src: '/work/prism/overview.webp' },
    ]);
    expect(getRelatedProjects('vora')).toEqual([
      { slug: 'chapterhq', name: 'ChapterHQ', destination: '/work/chapterhq' },
      { slug: 'agent-team', name: 'Agent Team', destination: '/work/agent-team' },
    ]);
    expect(getRelatedProjects('missing')).toEqual([]);
    expect(getPublishedCaseStudyPaths()).toEqual([
      '/work/vora', '/work/prism', '/work/agent-team', '/work/agent-config', '/work/control-center', '/work/chapterhq', '/work/site-assistant',
    ]);
  });

  it('removes a draft project from every public integration projection', () => {
    const responsibilityOrder = new Map([
      ['agent-config', 0],
      ['agent-team', 1],
      ['control-center', 2],
      ['prism', 3],
    ]);
    const integratedRelease = releaseRecords.map(record => {
      const order = responsibilityOrder.get(record.slug);
      if (record.kind !== 'flagship' || order === undefined) return record;
      return projectRecordSchema.parse({
        ...record,
        placements: [...new Set([...record.placements, 'home', 'how-i-build'])],
        responsibility: {
          label: `Responsibility ${record.name}`,
          order,
          snapshotId: `${record.slug}-sample`,
          caption: `Evidence for ${record.name}`,
        },
      });
    });
    const agentTeamDraft = integratedRelease.map(record => record.slug === 'agent-team'
      ? projectRecordSchema.parse({ ...record, publication: 'draft' })
      : record);

    expect(getHomeProjects(integratedRelease, releaseManifest).map(project => project.slug)).toContain('agent-team');
    expect(getMethodProjects(integratedRelease, releaseManifest).map(project => project.slug))
      .toEqual(['agent-config', 'agent-team', 'control-center', 'prism']);
    expect(getRelatedProjects('prism', integratedRelease).map(project => project.slug)).toEqual(['agent-team']);
    expect(getPublishedCaseStudyPaths(integratedRelease)).toContain('/work/agent-team');

    expect(getHomeProjects(agentTeamDraft, releaseManifest).map(project => project.slug)).not.toContain('agent-team');
    expect(getMethodProjects(agentTeamDraft, releaseManifest).map(project => project.slug)).not.toContain('agent-team');
    expect(getRelatedProjects('prism', agentTeamDraft)).toEqual([]);
    expect(getPublishedCaseStudyPaths(agentTeamDraft)).not.toContain('/work/agent-team');
  });

  it('drops unresolved related candidates and excludes non-case-study records from case-study paths', () => {
    const withMissingRelated = projectRecords.map(record => record.slug === 'vora'
      ? projectRecordSchema.parse({ ...record, related: ['missing'] })
      : record);

    expect(getRelatedProjects('vora', withMissingRelated)).toEqual([]);
    const homeOnlyPrism = projectRecordSchema.parse({ ...richRecord('prism'), placements: ['home'] });
    const withHomeOnlyRelated = projectRecords.map(record => record.slug === 'vora'
      ? projectRecordSchema.parse({ ...record, related: ['prism'] })
      : record.slug === 'prism' ? homeOnlyPrism : record);
    expect(resolvePublicProjectView(homeOnlyPrism).kind).toBe('rich');
    expect(getRelatedProjects('vora', withHomeOnlyRelated)).toEqual([]);
    expect(getPublishedCaseStudyPaths()).not.toContain('/work/open-source');
    expect(getPublishedCaseStudyPaths()).not.toContain('/work/real-estate-maite');
  });

  it('has exact release filters, a single feature, and a separate collection', () => {
    expect(normalizeCategory(['products', 'developer-tools'])).toBe('all');
    expect(normalizeCategory(['products'])).toBe('all');
    expect(normalizeCategory('unknown')).toBe('all');
    const all = getCatalog('all', releaseRecords, releaseManifest);
    expect(all.count).toBe(7);
    expect(all.featured?.slug).toBe('vora');
    expect(all.rows.map(p => p.slug)).not.toContain('vora');
    expect(getCatalog('products', releaseRecords, releaseManifest).count).toBe(3);
    const dev = getCatalog('developer-tools', releaseRecords, releaseManifest);
    expect(dev.featured?.slug).toBe('prism');
    expect(dev.rows.map(p => p.slug)).toEqual(['agent-team', 'agent-config', 'control-center']);
    expect(dev.count).toBe(4);
    expect(dev.collection?.destination).toBe('/work/open-source');
  });

  it('accepts secondary without story/demo and home-only without an invented route', () => {
    for (const record of projectRecords) expect(projectRecordSchema.safeParse(record).success).toBe(true);
    const maite = projectRecords.find(r => r.slug === 'real-estate-maite')!;
    expect('destination' in maite).toBe(false);
    expect(projectRecordSchema.safeParse({ ...maite, placements: ['case-study'] }).success).toBe(false);
    expect(projectRecordSchema.safeParse({ ...maite, destination: '/work/real-estate-maite' }).success).toBe(false);
  });

  it('derives all Vora states and both rollbacks from the same body', () => {
    const legacy = { ...projectRecords.find(r => r.slug === 'vora')!, caseStudy: undefined };
    const draft = { ...legacy, caseStudy: { publication: 'draft' as const } };
    const rich = richRecord('vora');
    expect(resolvePublicProjectView(legacy)).toMatchObject({ kind: 'legacy', state: 'legacy', destination: '/work/vora' });
    expect(resolvePublicProjectView(draft)).toMatchObject({ kind: 'legacy', state: 'rich-draft-with-legacy-fallback' });
    expect(resolvePublicProjectView(rich)).toMatchObject({ kind: 'rich', state: 'rich-published' });
    expect(collectRequiredShowcaseAssets([rich], releaseManifest).length).toBe(2);
    expect(collectRequiredShowcaseAssets([draft], releaseManifest)).toEqual([]);
    expect(collectRequiredShowcaseAssets([legacy], releaseManifest)).toEqual([]);
    expect(projectMetadata(rich)?.description).toBe(rich.caseStudy?.publication === 'published' ? rich.caseStudy.story.about : '');
    expect(projectMetadata(draft)).toEqual(projectMetadata(legacy));
    expect(getPublishedWorkPaths([legacy, draft, rich])).toEqual(['/work/vora']);
  });

  it('new rich drafts are 404 and never become metadata or related links', () => {
    const draft = projectRecordSchema.parse({ ...projectRecords.find(r => r.slug === 'prism')!, publication: 'draft', caseStudy: { publication: 'draft' } });
    const draftRecords = projectRecords.map(record => record.slug === 'prism' ? draft : record);
    expect(resolvePublicProjectView(draft).kind).toBe('not-found');
    expect(projectMetadata(draft)).toBeNull();
    const vora = { ...richRecord('vora'), related: ['prism', 'chapterhq'] };
    expect(projectRelatedLinks(vora, draftRecords).map(r => r.slug)).toEqual(['chapterhq']);
  });

  it('checks explicit route membership, related identity and complete published body', () => {
    const routes = [...knownRichRoutes, ...knownLegacyRoutes, '/work/open-source'];
    expect(() => validateProjectGraph(releaseRecords, releaseManifest, routes)).not.toThrow();
    expect(() => validateProjectGraph(releaseRecords, releaseManifest, ['/work/vora'])).toThrow(/route/i);
    expect(() => validateProjectGraph([{ ...richRecord('vora'), related: ['missing'] }], releaseManifest, routes)).toThrow(/related/i);
    expect(() => resolvePublicProjectView({ ...richRecord('prism'), destination: undefined })).toThrow();
    expect(() => resolvePublicProjectView({ ...richRecord('prism'), caseStudy: { publication: 'published' } })).toThrow();
    expect(() => validateProjectGraph(releaseRecords, { version: 1, snapshots: [] }, routes)).toThrow(/snapshot/i);
  });

  it('local previews have no deployed override and keep production fallback/404', () => {
    const draft = { ...richRecord('prism'), publication: 'draft' as const, caseStudy: {
      publication: 'draft' as const,
      localFixture: { kind: 'prism' as const, path: 'lib/work/fixtures/prism.json' },
    } };
    try {
      vi.stubEnv('NODE_ENV', 'development');
      expect(resolveDevelopmentProjectView(draft)).toMatchObject({ kind: 'rich-draft', label: 'Local synthetic example. Unapproved for publication.' });
      expect(resolvePublicProjectView(draft).kind).toBe('not-found');
      const voraDraft = { ...projectRecords.find(r => r.slug === 'vora')!, caseStudy: { publication: 'draft' as const, localFixture: { kind: 'vora' as const, path: 'lib/work/fixtures/vora.json' } } };
      expect(resolveDevelopmentProjectView(voraDraft).kind).toBe('rich-draft');
      expect(resolvePublicProjectView(voraDraft)).toMatchObject({ kind: 'legacy', state: 'rich-draft-with-legacy-fallback' });
      expect(collectRequiredShowcaseAssets([draft, voraDraft], { version: 1, snapshots: [] })).toEqual([]);
      vi.stubEnv('NODE_ENV', 'production');
      expect(resolveDevelopmentProjectView(draft).kind).toBe('not-found');
    } finally { vi.unstubAllEnvs(); }
  });
});
