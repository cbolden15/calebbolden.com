export default function Footer() {
  const titleBlockCells = [
    { label: 'drawn by', value: 'Caleb Bolden', className: 'border-r border-b lg:border-b-0' },
    { label: 'based in', value: 'Dallas-Fort Worth', className: 'border-b lg:border-r lg:border-b-0' },
    { label: 'the work', value: 'AI systems for small businesses', className: 'border-r border-b lg:border-b-0' },
    { label: 'start with', value: 'A 2-3 week audit', className: 'border-b lg:border-r lg:border-b-0' },
    { label: 'email', value: 'caleb@calebbolden.com', className: 'col-span-2 lg:col-span-1' },
  ];

  const navLinks: { label: string; href: string; external?: boolean }[] = [
    { label: 'Work', href: '/work' },
    { label: 'Results', href: '/results' },
    { label: 'Web development', href: '/services/web-development' },
    { label: 'SEO', href: '/services/seo' },
    { label: 'Marketing', href: '/services/marketing' },
    { label: 'Resources', href: '/resources' },
    { label: 'The Missed Call · newsletter for owners', href: '/owners' },
    { label: 'The Workflow Brief · newsletter for operators', href: '/operators' },
    { label: 'For bookkeepers, CPAs, and MSPs', href: '/partners' },
    { label: 'GitHub · the code I ship', href: 'https://github.com/cbolden15', external: true },
    { label: 'LinkedIn · the work history', href: 'https://www.linkedin.com/in/calebbolden', external: true },
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
  ];

  return (
    <footer className="chat-offset" style={{ borderTop: '1px solid var(--color-hairline)' }}>
      <div className="mx-auto w-[90%] max-w-[1200px] pt-8 pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-8">
        <div
          className="grid grid-cols-2 lg:grid-cols-5"
          style={{ border: '1px solid var(--color-hairline)' }}
        >
          {titleBlockCells.map((cell) => (
            <div
              key={cell.label}
              className={`min-h-[72px] p-3 ${cell.className}`}
              style={{ borderColor: 'var(--color-hairline)' }}
            >
              <div className="anno">{cell.label}</div>
              <div style={{ fontSize: 13, color: 'var(--color-ink-muted)' }}>{cell.value}</div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2 pt-3 sm:flex-row sm:items-baseline sm:justify-between">
          <span style={{ fontSize: 13, color: 'var(--color-ink-faint)' }}>
            &copy; 2026 Caleb Bolden. Services provided by Vora Technologies LLC.
          </span>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-1">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="link-draw whitespace-nowrap"
                style={{ fontSize: 13, color: 'var(--color-ink-faint)' }}
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
