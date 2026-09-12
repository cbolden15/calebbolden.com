import Link from 'next/link';
import { getHomeProjects } from '@/lib/work/catalog';
import type { HomepageProof } from '@/lib/work/public-content';
import showcaseStyles from './work/Showcase.module.css';

function isFlagship(project: HomepageProof) {
  return project.badge === 'Implemented' || project.badge === 'Prototype' || project.badge === 'Developer preview';
}

function ProjectLinks({ project, detailLabel = `Explore ${project.name}` }: { project: HomepageProof; detailLabel?: string }) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
      {project.destination ? (
        <Link href={project.destination} className="link-draw inline-flex min-h-11 items-center text-sm font-medium text-[var(--color-blue)]">
          {detailLabel}
        </Link>
      ) : null}
      {project.links?.map(link => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="link-draw inline-flex min-h-11 items-center text-sm font-medium text-[var(--color-blue)]"
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}

export default function Proof() {
  const projects = getHomeProjects();
  const feature = projects.find(project => project.slug === 'vora');
  const developerTools = projects.filter(project => project !== feature && isFlagship(project));
  const secondary = projects.filter(project => project !== feature && !developerTools.includes(project));

  return (
    <section id="work" className={`${showcaseStyles.surface} py-20 lg:py-28`} data-home-proof>
      <div className={showcaseStyles.content}>
        <h2 className="type-display mb-4" style={{ fontSize: 'clamp(2.1rem, 4.2vw, 3.4rem)' }}>
          The systems I recommend are ones I build and run
        </h2>
        <p className="mb-10 max-w-2xl" style={{ fontSize: 16, lineHeight: 1.65, color: 'var(--color-ink-muted)' }}>
          I&apos;m a builder first. This work ranges from products I run day to day to prototypes and developer previews whose limits are stated beside the example.
        </p>

        {feature ? (
          <article className={`${showcaseStyles.feature} border-y border-[var(--color-hairline)] py-7`} data-home-project={feature.slug} data-home-feature>
            {feature.poster ? (
              <figure className={showcaseStyles.media}>
                {/* Reviewed local evidence uses native intrinsic sizing and failure behavior. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={feature.poster.src}
                  alt={feature.poster.alt}
                  width={feature.poster.width}
                  height={feature.poster.height}
                  loading="eager"
                  decoding="async"
                />
                <figcaption className="anno">image · {feature.poster.caption}</figcaption>
              </figure>
            ) : null}
            <div className="min-w-0 self-center">
              <p className="anno anno-blue mb-3">featured product</p>
              <h3 className="type-display" style={{ fontSize: 'clamp(1.7rem, 3vw, 2.4rem)' }}>{feature.name}</h3>
              <p className="anno mt-3">{feature.badge}</p>
              <p className="mt-5 max-w-[70ch]" style={{ fontSize: 16, lineHeight: 1.65, color: 'var(--color-ink-muted)' }}>
                {feature.summary}
              </p>
              <ProjectLinks project={feature} />
            </div>
          </article>
        ) : null}

        {developerTools.length ? (
          <div className="mt-12" data-home-group="developer-tools">
            <p className="anno anno-blue mb-3">developer tools</p>
            <div style={{ borderTop: '1px solid var(--color-hairline)' }}>
              {developerTools.map(project => (
                <article key={project.slug} className={`${showcaseStyles.row} py-5`} style={{ borderBottom: '1px solid var(--color-hairline)' }} data-home-project={project.slug}>
                  <div>
                    <h3 className="type-display text-xl">{project.name}</h3>
                    <p className="anno mt-2">{project.badge}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--color-ink-muted)' }}>{project.summary}</p>
                    <ProjectLinks project={project} />
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : null}

        {secondary.length ? (
          <div className="mt-12" data-home-group="secondary">
            <p className="anno anno-blue mb-3">more products and tools</p>
            <div style={{ borderTop: '1px solid var(--color-hairline)' }}>
              {secondary.map(project => (
                <article key={project.slug} className={`${showcaseStyles.row} py-5`} style={{ borderBottom: '1px solid var(--color-hairline)' }} data-home-project={project.slug}>
                  <div>
                    <h3 className="type-display text-xl">{project.name}</h3>
                    <p className="anno mt-2">{project.badge}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--color-ink-muted)' }}>{project.summary}</p>
                    <ProjectLinks project={project} detailLabel="Details" />
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
          <Link href="/work" className="link-draw inline-flex min-h-11 items-center text-sm font-medium text-[var(--color-blue)]">
            Explore the work
          </Link>
          <p className="max-w-xl" style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--color-ink)' }}>
            The chat assistant on this site is one of these systems. Open it and ask what AI could take off your plate.
          </p>
        </div>
      </div>
    </section>
  );
}
