import Link from 'next/link';
import styles from './Showcase.module.css';
import type { ProjectCard } from '@/lib/work/public-content';

interface ProjectEntryProps {
  project: ProjectCard;
  featured: boolean;
}

export default function ProjectEntry({ project, featured }: ProjectEntryProps) {
  const showDevelopmentPlaceholder = !project.poster && process.env.NODE_ENV === 'development';

  return (
    <article className="border-t border-[var(--color-hairline)] py-8 sm:py-10">
      <div className={featured ? styles.feature : styles.row}>
        {project.poster ? (
          <figure className={styles.media}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.poster.src}
              alt={project.poster.alt}
              width={project.poster.width}
              height={project.poster.height}
              loading={featured ? 'eager' : 'lazy'}
              className="h-auto w-full border border-[var(--color-hairline)] object-cover"
              style={{ borderRadius: 2 }}
            />
            <figcaption className="anno mt-3 max-w-[70ch]">{project.poster.caption}</figcaption>
          </figure>
        ) : showDevelopmentPlaceholder ? (
          <div className="flex min-h-52 items-center justify-center border border-dashed border-[var(--color-blue)] bg-[var(--color-blue-wash)] p-6 text-center" style={{ borderRadius: 2 }}>
            <p className="anno anno-blue">Development placeholder · media pending review</p>
          </div>
        ) : null}

        <div className="min-w-0">
          <p className="anno anno-blue">{project.badge}</p>
          <h2 className={`type-display mt-3 ${featured ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'}`}>{project.name}</h2>
          <p className="mt-4 max-w-[70ch]" style={{ fontSize: 17, lineHeight: 1.65, color: 'var(--color-ink-muted)' }}>{project.summary}</p>
          <p className="mt-4 max-w-[70ch] text-sm font-medium text-[var(--color-ink)]">{project.contribution}</p>
          <div className="mt-7 flex flex-wrap items-center gap-5">
            <Link href={project.destination} className="btn-ink min-h-11">Explore {project.name}</Link>
            {project.links?.map(link => (
              <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="link-draw text-sm text-[var(--color-blue)]">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
