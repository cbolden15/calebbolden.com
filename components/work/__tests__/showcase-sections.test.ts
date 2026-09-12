import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { chapterhq, siteAssistant } from '../../../lib/work/projects/secondary';
import { projectProjectCard } from '../../../lib/work/public-content';
import type { CaseStudyShell, ProjectCard } from '../../../lib/work/public-content';
import CaseStudySections from '../CaseStudySections';
import ProjectEntry from '../ProjectEntry';
import WorkDetail from '../../WorkDetail';

const project: CaseStudyShell = {
  publication: 'published',
  slug: 'prism',
  name: 'Prism',
  summary: 'A compiler trace that makes each transformation inspectable while keeping source order, output state, and the receipt connected for people reviewing generated work.',
  contribution: 'I designed and built the compiler trace.',
  maturity: 'Developer preview',
  destination: '/work/prism',
  story: {
    problem: 'Generated changes become difficult to trust when the source, intermediate decisions, and final output appear as separate artifacts. Reviewers need one readable account of what changed and why before they can approve the result.',
    workflow: {
      introduction: 'The example follows a source request through compilation and into a receipt that records the completed work.',
      walkthroughs: [
        { id: 'accepted', title: 'Accepted change', steps: ['Read the source request.', 'Inspect the compiled result.', 'Open the completion receipt.'] },
        { id: 'blocked', title: 'Blocked change', steps: ['Read the source request.', 'Stop on the unsupported instruction.'] },
      ],
    },
    decisions: [
      { constraint: 'The event order must remain authentic.', choice: 'Keep the trace in source order.', consequence: 'A reviewer can follow each transformation without reconstructing the sequence.' },
      { constraint: 'A completion claim needs evidence.', choice: 'Attach a receipt only after the final event.', consequence: 'The interface cannot imply completion while work is still in progress.' },
    ],
    credits: ['Built with the public Prism compiler contracts.'],
    limits: ['This example covers one bounded compilation path.'],
    about: 'This example uses reviewed sample data to show the public compiler flow.',
  },
  evidence: [{
    kind: 'image', snapshotId: 'prism-sample', src: '/work/prism/overview.webp',
    alt: 'A compiler trace with ordered events', caption: 'The selected trace from source request to receipt.', width: 1200, height: 750,
  }],
  interaction: { kind: 'prism', snapshotId: 'prism-sample', label: 'Interactive compiler trace', caption: 'Choose an event to inspect its input and output.' },
  snapshots: [{
    kind: 'approved', id: 'prism-sample', derivation: 'contract-derived', checkedDate: '2026-09-11',
    disclosure: 'Reviewed against the public compiler contract.', version: '0.8.0', sourceRevision: 'abc123',
  }],
  related: [{ slug: 'chapterhq', name: 'ChapterHQ', destination: '/work/chapterhq' }],
  links: [{ label: 'View Prism source', href: 'https://github.com/example/prism' }],
};

afterEach(() => vi.unstubAllEnvs());

describe('case-study server shell', () => {
  it('renders one H1 and the complete story in meaningful order before technical detail', () => {
    const html = renderToStaticMarkup(createElement(CaseStudySections, {
      project,
      demonstration: createElement('div', { 'data-example-frame': true }, 'Server-visible first frame'),
      reloadHref: '/work/prism',
    }));

    expect(html.match(/<h1/g)).toHaveLength(1);
    const orderedText = [
      'Prism',
      'Interactive compiler trace',
      'Server-visible first frame',
      'Problem and workflow',
      'Accepted change',
      'Open the completion receipt.',
      'Blocked change',
      'Stop on the unsupported instruction.',
      'Engineering and evidence',
      'About this example',
      'Continue',
      'Explore ChapterHQ',
    ];
    let previous = -1;
    for (const text of orderedText) {
      const position = html.indexOf(text);
      expect(position, `${text} should be present after the preceding content`).toBeGreaterThan(previous);
      previous = position;
    }
    expect(html).toContain('I designed and built the compiler trace.');
    expect(html).toContain('Developer preview');
    expect(html).toContain('Checked September 11, 2026');
    expect(html).toContain('<details');
  });

  it('keeps recovery and continuation links available in static HTML', () => {
    const html = renderToStaticMarkup(createElement(CaseStudySections, {
      project,
      demonstration: createElement('div', null, 'Initial frame'),
      reloadHref: '/work/prism',
    }));

    expect(html).toMatch(/<a href="\/work\/prism"[^>]*>Reload this example<\/a>/);
    expect(html).toContain('href="/work"');
    expect(html).toContain('href="/contact"');
    expect(html).toContain('href="https://github.com/example/prism"');
    expect(html).toContain('target="_blank"');
  });
});

describe('compatible WorkDetail branches', () => {
  it('server-renders the rich shell through the shared page frame', () => {
    const html = renderToStaticMarkup(createElement(WorkDetail, {
      project,
      demonstration: createElement('div', null, 'Rich first frame'),
      reloadHref: '/work/prism',
    }));

    expect(html.match(/<h1/g)).toHaveLength(1);
    expect(html).toContain('Rich first frame');
    expect(html).toContain('class="chat-offset"');
  });

  it('retains the complete legacy prop surface and optional media', () => {
    const html = renderToStaticMarkup(createElement(WorkDetail, {
      name: 'Legacy project',
      status: 'running',
      whatItIs: 'The retained project summary.',
      whoUsesIt: 'The retained audience.',
      aiInside: 'The retained implementation explanation.',
      techBands: [{ label: 'app', value: 'Existing stack' }],
      stackLine: 'Existing stack line',
      href: 'https://example.com',
      sheet: 'work / legacy',
      media: createElement('div', null, 'Retained media body'),
    }));

    for (const text of ['The retained project summary.', 'The retained audience.', 'The retained implementation explanation.', 'Existing stack line', 'Retained media body']) {
      expect(html).toContain(text);
    }
  });
});

describe('project entries', () => {
  it('uses the validated native destinations for both retained secondary projects', () => {
    const chapterCard = projectProjectCard(chapterhq)!;
    const assistantCard = projectProjectCard(siteAssistant)!;
    const chapterHtml = renderToStaticMarkup(createElement(ProjectEntry, { project: chapterCard, featured: true }));
    const assistantHtml = renderToStaticMarkup(createElement(ProjectEntry, { project: assistantCard, featured: false }));

    expect(chapterHtml).toContain('href="/work/chapterhq"');
    expect(chapterHtml).toContain('Explore ChapterHQ');
    expect(assistantHtml).toContain('href="/work/site-assistant"');
    expect(assistantHtml).toContain('Explore Site assistant');
    expect(assistantHtml).not.toContain('target="_blank"');
  });

  it('labels missing media only in development and omits empty source controls', () => {
    const card: ProjectCard = {
      slug: 'site-assistant', name: 'Site assistant', category: 'products',
      summary: 'A site assistant that answers questions from public content and helps visitors identify where a bounded automation could remove repetitive work from their day.',
      contribution: 'I built the assistant and its typed tools.', badge: 'live', order: 6, destination: '/work/site-assistant',
    };
    vi.stubEnv('NODE_ENV', 'development');
    const developmentHtml = renderToStaticMarkup(createElement(ProjectEntry, { project: card, featured: false }));
    expect(developmentHtml).toContain('Development placeholder');
    expect(developmentHtml).not.toContain('Visit source');

    vi.stubEnv('NODE_ENV', 'production');
    const productionHtml = renderToStaticMarkup(createElement(ProjectEntry, { project: card, featured: false }));
    expect(productionHtml).not.toContain('Development placeholder');
  });
});
