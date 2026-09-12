import Link from 'next/link';
import ProjectMedia from './ProjectMedia';
import styles from './Showcase.module.css';
import type { ReactNode } from 'react';
import type { CaseStudyShell } from '@/lib/work/public-content';

interface CaseStudySectionsProps {
  project: CaseStudyShell;
  demonstration: ReactNode;
  reloadHref: string;
}

function formatCheckedDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'long',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`));
}

const sectionStyle = { borderTop: '1px solid var(--color-hairline)' };
const bodyStyle = { fontSize: 17, lineHeight: 1.65, color: 'var(--color-ink-muted)' };

export default function CaseStudySections({ project, demonstration, reloadHref }: CaseStudySectionsProps) {
  const primaryEvidence = project.evidence[0];
  const demonstrationLabel = project.interaction?.label ?? 'Development demonstration';
  const demonstrationCaption = project.interaction?.caption ?? primaryEvidence?.caption ?? project.developmentLabel;

  return (
    <>
      <section className="graph-field py-16 lg:py-24" data-case-study-section="introduction">
        <div className={styles.content}>
          <Link href="/work" className="link-draw inline-block text-sm text-[var(--color-blue)]">
            ← Back to Work
          </Link>
          {project.developmentLabel && (
            <p className="sticky-note anno mt-8 px-3 py-2">{project.developmentLabel}</p>
          )}
          <h1 className="type-display mt-7 max-w-[16ch]" style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.25rem)' }}>
            {project.name}
          </h1>
          <p className="mt-6 max-w-[70ch]" style={bodyStyle}>{project.summary}</p>
          <dl className="mt-9 flex flex-wrap gap-5 border-t border-[var(--color-hairline)] pt-5">
            <div>
              <dt className="anno anno-blue">Contribution</dt>
              <dd className="mt-2 max-w-[70ch]" style={bodyStyle}>{project.contribution}</dd>
            </div>
            <div>
              <dt className="anno anno-blue">Maturity</dt>
              <dd className="mt-2" style={bodyStyle}>{project.maturity}</dd>
            </div>
          </dl>
          {project.links?.length ? (
            <div className="mt-7 flex flex-wrap gap-5">
              {project.links.map(link => (
                <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="link-draw text-sm text-[var(--color-blue)]">
                  {link.label}
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section className="py-14 lg:py-20" style={sectionStyle} aria-labelledby="primary-demonstration" data-case-study-section="demonstration">
        <div className={styles.content}>
          <p className="anno anno-blue">{demonstrationLabel}</p>
          <h2 id="primary-demonstration" className="type-display mt-3 text-3xl sm:text-4xl">Primary demonstration</h2>
          {demonstrationCaption && <p className="mt-4 max-w-[70ch]" style={bodyStyle}>{demonstrationCaption}</p>}
          <div data-demo-shell className="mt-8 min-w-0 border border-[var(--color-hairline)] bg-[var(--color-surface)]" style={{ borderRadius: 2 }}>
            {demonstration}
          </div>
          {primaryEvidence && (
            <div className="mt-6"><ProjectMedia media={primaryEvidence} primary /></div>
          )}
          <p className="mt-5 text-sm text-[var(--color-ink-muted)]">
            If the interactive example stops responding, <a href={reloadHref} data-demo-reload className="link-draw text-[var(--color-blue)]">Reload this example</a>.
          </p>
        </div>
      </section>

      <section className="py-14 lg:py-20" style={sectionStyle} aria-labelledby="problem-workflow" data-case-study-section="workflow">
        <div className={styles.content}>
          <h2 id="problem-workflow" className="type-display text-3xl sm:text-4xl">Problem and workflow</h2>
          <div className={`${styles.workflow} mt-9`}>
            <div className="min-w-0">
              <h3 className="anno anno-blue">The problem</h3>
              <p className="mt-3 max-w-[70ch]" style={bodyStyle}>{project.story.problem}</p>
            </div>
            <div className="min-w-0">
              <h3 className="anno anno-blue">The workflow</h3>
              <p className="mt-3 max-w-[70ch]" style={bodyStyle}>{project.story.workflow.introduction}</p>
              <div className="mt-8 space-y-8">
                {project.story.workflow.walkthroughs.map((walkthrough, walkthroughIndex) => (
                  <section key={walkthrough.id} aria-labelledby={`${project.slug}-${walkthrough.id}`} className="border-t border-[var(--color-hairline)] pt-5">
                    <h4 id={`${project.slug}-${walkthrough.id}`} className="type-display text-xl">
                      <span className="anno anno-blue mr-3">{String(walkthroughIndex + 1).padStart(2, '0')}</span>
                      {walkthrough.title}
                    </h4>
                    <ol className="mt-5 space-y-3" aria-label={`${walkthrough.title} walkthrough`}>
                      {walkthrough.steps.map((step, stepIndex) => (
                        <li key={`${walkthrough.id}-${stepIndex}`} className="grid grid-cols-[2.5rem_1fr] gap-3">
                          <span className="anno pt-1">{String(stepIndex + 1).padStart(2, '0')}</span>
                          <span style={bodyStyle}>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </section>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 lg:py-20" style={sectionStyle} aria-labelledby="engineering-evidence" data-case-study-section="engineering">
        <div className={styles.content}>
          <h2 id="engineering-evidence" className="type-display text-3xl sm:text-4xl">Engineering and evidence</h2>
          <ol className={`${styles.decisions} mt-9`}>
            {project.story.decisions.map((decision, index) => (
              <li key={`${decision.constraint}-${index}`} className="border-t border-[var(--color-hairline)] pt-5">
                <p className="anno anno-blue">Decision {String(index + 1).padStart(2, '0')}</p>
                <h3 className="type-display mt-3 text-xl">{decision.constraint}</h3>
                <dl className="mt-5 space-y-4">
                  <div>
                    <dt className="anno">Choice</dt>
                    <dd className="mt-1" style={bodyStyle}>{decision.choice}</dd>
                  </div>
                  <div>
                    <dt className="anno">Consequence</dt>
                    <dd className="mt-1" style={bodyStyle}>{decision.consequence}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ol>

          <div className={`${styles.workflow} mt-12 border-t border-[var(--color-hairline)] pt-8`}>
            <div className="min-w-0">
              <h3 className="type-display text-2xl">Contribution and credits</h3>
              <p className="mt-4 max-w-[70ch]" style={bodyStyle}>{project.contribution}</p>
              <ul className="mt-4 list-disc space-y-2 pl-5">
                {project.story.credits.map(credit => <li key={credit} style={bodyStyle}>{credit}</li>)}
              </ul>
            </div>
            <div className="min-w-0">
              <h3 className="type-display text-2xl">Current limits</h3>
              <ul className="mt-4 list-disc space-y-2 pl-5">
                {project.story.limits.map(limit => <li key={limit} style={bodyStyle}>{limit}</li>)}
              </ul>
            </div>
          </div>

          {project.evidence.length > 1 && (
            <div className="mt-12 space-y-8">
              {project.evidence.slice(1).map(media => <ProjectMedia key={media.src} media={media} />)}
            </div>
          )}

          <div className="mt-12 max-w-[70ch] border-t border-[var(--color-hairline)] pt-8">
            <h3 className="type-display text-2xl">About this example</h3>
            <p className="mt-4" style={bodyStyle}>{project.story.about}</p>
            {project.snapshots.length ? (
              <p className="anno anno-blue mt-5">
                {project.snapshots.map(snapshot => `Checked ${formatCheckedDate(snapshot.checkedDate)}`).join(' · ')}
              </p>
            ) : (
              <p className="anno anno-blue mt-5">Evidence review pending · {project.developmentLabel}</p>
            )}
            {project.snapshots.length ? (
              <details className="mt-6 border-t border-[var(--color-hairline)] pt-4">
                <summary className="min-h-11 cursor-pointer py-2 font-medium">Evidence details</summary>
                <div className="mt-3 space-y-4 pb-2">
                  {project.snapshots.map(snapshot => (
                    <div key={snapshot.id}>
                      <p style={bodyStyle}>{snapshot.disclosure}</p>
                      <p className="anno mt-2">
                        {snapshot.derivation}
                        {snapshot.version ? ` · version ${snapshot.version}` : ''}
                        {snapshot.sourceRevision ? ` · revision ${snapshot.sourceRevision}` : ''}
                      </p>
                    </div>
                  ))}
                </div>
              </details>
            ) : null}
          </div>
        </div>
      </section>

      <section className="py-14 lg:py-20" style={sectionStyle} aria-labelledby="continue" data-case-study-section="continue">
        <div className={styles.content}>
          <h2 id="continue" className="type-display text-3xl sm:text-4xl">Continue</h2>
          {project.related.length ? (
            <ul className={`${styles.row} mt-8`}>
              {project.related.map(related => (
                <li key={related.slug} className="border-t border-[var(--color-hairline)] pt-5">
                  <Link href={related.destination} className="link-draw type-display text-xl text-[var(--color-blue)]">
                    Explore {related.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
          <div className="mt-7 flex flex-wrap gap-4">
            <Link href="/work" className="btn-hairline min-h-11">Back to Work</Link>
            <Link href="/contact" className="btn-ink min-h-11">Discuss a similar project</Link>
          </div>
        </div>
      </section>
    </>
  );
}
