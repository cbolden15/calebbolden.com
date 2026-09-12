'use client';

import type { MouseEvent } from 'react';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProjectEntry from './ProjectEntry';
import { normalizeCategory, selectCatalog, type ProjectCard } from '@/lib/work/public-content';
import type { CategoryFilter } from '@/lib/work/types';

const filters: readonly { value: CategoryFilter; label: string; href: string }[] = [
  { value: 'all', label: 'All', href: '/work' },
  { value: 'products', label: 'Products', href: '/work?category=products' },
  { value: 'developer-tools', label: 'Developer tools', href: '/work?category=developer-tools' },
];

function focusCategory(category: CategoryFilter) {
  requestAnimationFrame(() => {
    document.querySelector<HTMLAnchorElement>(`[data-work-filter="${category}"]`)?.focus();
  });
}

function categoryFromLocation(): CategoryFilter {
  const values = new URLSearchParams(window.location.search).getAll('category');
  return normalizeCategory(values.length === 1 ? values[0] : values);
}

function selectCategory(event: MouseEvent<HTMLAnchorElement>, category: CategoryFilter, href: string) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  window.history.pushState(null, '', href);
  focusCategory(category);
}

type CatalogSelection = ReturnType<typeof selectCatalog>;

function CatalogView({ catalog }: { catalog: CatalogSelection }) {
  return (
    <div data-work-catalog>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-hairline)] pb-5">
        <nav aria-label="Filter work" className="flex flex-wrap gap-2">
          {filters.map(filter => (
            <a
              key={filter.value}
              href={filter.href}
              data-work-filter={filter.value}
              aria-current={catalog.category === filter.value ? 'page' : undefined}
              onClick={event => selectCategory(event, filter.value, filter.href)}
              className="inline-flex min-h-11 items-center rounded-md border px-4 text-sm font-medium transition-colors"
              style={{
                borderColor: catalog.category === filter.value ? 'var(--color-blue)' : 'var(--color-hairline)',
                background: catalog.category === filter.value ? 'var(--color-blue-wash)' : 'var(--color-bg)',
                color: catalog.category === filter.value ? 'var(--color-blue-deep)' : 'var(--color-ink-muted)',
              }}
            >
              {filter.label}
            </a>
          ))}
        </nav>
        <p data-work-count role="status" aria-live="polite" aria-atomic="true" className="anno whitespace-nowrap">
          {catalog.count} {catalog.count === 1 ? 'project' : 'projects'}
        </p>
      </div>

      {catalog.featured ? (
        <div data-work-card={catalog.featured.slug} data-featured="true">
          <ProjectEntry project={catalog.featured} featured />
        </div>
      ) : null}
      {catalog.rows.map(project => (
        <div key={project.slug} data-work-card={project.slug} data-featured="false">
          <ProjectEntry project={project} featured={false} />
        </div>
      ))}
      {catalog.count === 0 ? (
        <p data-work-empty className="border-t border-[var(--color-hairline)] py-10 text-[var(--color-ink-muted)]">
          No published projects in this category yet. Open source work remains available below.
        </p>
      ) : null}
    </div>
  );
}

export default function WorkFilters({ cards }: { cards: readonly ProjectCard[] }) {
  const searchParams = useSearchParams();
  const categoryValues = searchParams.getAll('category');
  const selectedValue = categoryValues.length === 1 ? categoryValues[0] : categoryValues;
  const catalog = selectCatalog(cards, selectedValue);

  useEffect(() => {
    const restoreFilterFocus = () => focusCategory(categoryFromLocation());
    window.addEventListener('popstate', restoreFilterFocus);
    return () => window.removeEventListener('popstate', restoreFilterFocus);
  }, []);

  return <CatalogView catalog={catalog} />;
}
