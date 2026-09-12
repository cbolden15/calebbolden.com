import { renderToStaticMarkup } from 'react-dom/server';
import CaseStudySections from '../../components/work/CaseStudySections';
import ProjectMedia from '../../components/work/ProjectMedia';
import ProjectEntry from '../../components/work/ProjectEntry';
import styles from '../../components/work/Showcase.module.css';
import { richRecord } from '../../lib/work/__tests__/samples';
import type { CaseStudyShell, ProjectCard } from '../../lib/work/public-content';
import type { PublicMedia } from '../../lib/work/types';

// Test-only source fixture. It is never an app route, approval manifest or public asset.
export function renderFixture() {
  const record = richRecord('vora');
  if (record.caseStudy?.publication !== 'published') throw new Error('Expected synthetic story');
  const image: PublicMedia = { kind: 'image', snapshotId: 'test-only', src: '/work/test-only/poster.png', width: 32, height: 20, alt: 'A blue test frame', caption: 'Synthetic browser fixture.' };
  const video: PublicMedia = { kind: 'video', snapshotId: 'test-only', src: '/work/test-only/clip.webm', poster: image.src, width: 32, height: 20, alt: 'A blue test clip', caption: 'Synthetic browser video.', transcript: 'A blue frame stays visible.', captions: [{ start: 0, end: 1, text: 'A blue frame stays visible.' }] };
  const shell: CaseStudyShell = { publication: 'draft', slug: 'vora', name: 'Synthetic foundation fixture', summary: record.summary, contribution: record.contribution, maturity: record.maturity, destination: '/work/vora', story: record.caseStudy.story, evidence: [image], snapshots: [], related: [], developmentLabel: 'Local synthetic example. Unapproved for publication.' };
  const card: ProjectCard = { slug: 'vora', name: 'Synthetic entry', summary: record.summary, contribution: record.contribution, category: 'products', badge: 'Implemented', order: 0, destination: '/work/vora', poster: { src: image.src, width: 32, height: 20, alt: image.alt, caption: image.caption } };
  return renderToStaticMarkup(
    <div className={styles.surface} data-showcase-surface>
      <CaseStudySections project={shell} reloadHref="/work/vora" demonstration={<p data-demo-first-frame>First frame: inspect the synthetic input.</p>} />
      <div className={styles.content} data-fixture-content>
        <ProjectEntry project={card} featured />
        <ProjectEntry project={card} featured={false} />
        <ProjectMedia media={video} />
        <div className={styles.codePanel} aria-label="Synthetic code panel" tabIndex={0}><pre>{'a_long_identifier_'.repeat(80)}</pre></div>
        <div className={styles.enhancementControls} data-fixture-controls><button>Enhancement fixture control</button></div>
      </div>
    </div>,
  );
}
