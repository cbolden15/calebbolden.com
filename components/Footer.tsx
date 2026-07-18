export default function Footer() {
  const titleBlockCells = [
    { label: 'project', value: 'The working wall', className: 'border-r border-b lg:border-b-0' },
    { label: 'drawn by', value: 'Caleb Bolden', className: 'border-b lg:border-r lg:border-b-0' },
    { label: 'sheet', value: '1 of 1', className: 'border-r border-b lg:border-b-0' },
    { label: 'scale', value: 'none', className: 'border-b lg:border-r lg:border-b-0' },
    { label: 'rev', value: 'B / 2026', className: 'col-span-2 lg:col-span-1' },
  ];

  return (
    <footer className="chat-offset" style={{ borderTop: '1px solid var(--color-hairline)' }}>
      <div className="mx-auto w-[90%] max-w-[1200px] py-8">
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
          <nav aria-label="Services" className="flex gap-5">
            {[
              { label: 'Work', href: '/work' },
              { label: 'Web development', href: '/services/web-development' },
              { label: 'SEO', href: '/services/seo' },
              { label: 'Marketing', href: '/services/marketing' },
              { label: 'Resources', href: '/resources' },
            ].map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="link-draw"
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
