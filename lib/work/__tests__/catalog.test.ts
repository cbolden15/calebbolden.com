import { describe, expect, it, vi } from 'vitest';
import { existsSync, readdirSync } from 'node:fs';
import { projectRecords, getCatalog } from '../catalog';
import { projectRecordSchema, knownRichRoutes, knownLegacyRoutes } from '../types';
import { collectRequiredShowcaseAssets, getPublishedWorkPaths, resolveDevelopmentProjectView, resolvePublicProjectView, validateProjectGraph } from '../publication';
import { normalizeCategory, projectMetadata, projectRelatedLinks } from '../public-content';
import { releaseRecords, releaseManifest, richRecord } from './samples';

describe('catalog publication boundary', () => {
  it('retains the current three production entries and four new drafts', () => {
    expect(getCatalog('all').count).toBe(3);
    expect(projectRecords.filter(r => r.kind !== 'collection' && r.kind !== 'homepage-only').map(r => r.slug))
      .toEqual(['vora', 'prism', 'agent-team', 'agent-config', 'control-center', 'chapterhq', 'site-assistant']);
    expect(getPublishedWorkPaths(projectRecords)).toEqual(['/work/vora', '/work/chapterhq', '/work/site-assistant']);
    expect(collectRequiredShowcaseAssets(projectRecords, { version: 1, snapshots: [] })).toEqual([]);
    const actualRoutes = readdirSync('app/work', { withFileTypes: true }).filter(entry => entry.isDirectory() && existsSync(`app/work/${entry.name}/page.tsx`)).map(entry => `/work/${entry.name}`);
    expect(() => validateProjectGraph(projectRecords, { version: 1, snapshots: [] }, actualRoutes)).not.toThrow();
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
    const draft = projectRecords.find(r => r.slug === 'prism')!;
    expect(resolvePublicProjectView(draft).kind).toBe('not-found');
    expect(projectMetadata(draft)).toBeNull();
    const vora = { ...richRecord('vora'), related: ['prism', 'chapterhq'] };
    expect(projectRelatedLinks(vora, projectRecords).map(r => r.slug)).toEqual(['chapterhq']);
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
