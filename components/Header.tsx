import Link from 'next/link';

// Hairline three-zone nav: brand / links / CTA. Built from rules, not chips
// (working-wall direction, DESIGN.md). Offset right for the chat sidebar.

const links = [
  { label: 'Services', href: '#services' },
  { label: 'Method', href: '#method' },
  { label: 'Packages', href: '#packages' },
  { label: 'Work', href: '#work' },
  { label: 'Blog', href: '/blog' },
];

export default function Header() {
  return (
    <nav
      className="chat-offset relative z-20 flex h-16 items-center justify-between gap-6 px-5 sm:px-8"
      style={{ borderBottom: '1px solid var(--color-hairline)' }}
    >
      <Link
        href="/"
        className="type-display transition-opacity hover:opacity-60"
        style={{ fontSize: 15, fontWeight: 700, letterSpacing: '0.01em' }}
      >
        Caleb Bolden
      </Link>

      <ul className="hidden list-none items-center gap-7 lg:flex">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="transition-colors hover:text-[var(--color-blue)]"
              style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-ink-muted)' }}
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>

      <Link href="/contact" className="btn-ink" style={{ padding: '8px 16px', fontSize: 14 }}>
        Let&apos;s talk
      </Link>
    </nav>
  );
}
