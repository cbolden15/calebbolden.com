import Link from 'next/link';
import MobileNav from './MobileNav';

// Hairline three-zone nav: brand / links / CTA. Built from rules, not chips
// (working-wall direction, DESIGN.md). Offset right for the chat sidebar.

// Hash links are rooted so they resolve from any route (/services/*, /blog).
const links = [
  { label: 'Services', href: '/#services' },
  { label: 'Method', href: '/#method' },
  { label: 'Packages', href: '/#packages' },
  { label: 'Resources', href: '/resources' },
  { label: 'Work', href: '/work' },
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
              className="link-draw transition-colors hover:text-[var(--color-blue)]"
              style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-ink-muted)' }}
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-3">
      <Link href="/contact" className="btn-ink btn-roll" style={{ padding: '8px 16px', fontSize: 14 }}>
        <span className="roll-box">
          <span className="roll-a">Let&apos;s talk</span>
          <span className="roll-b" aria-hidden="true">
            Let&apos;s talk
          </span>
        </span>
      </Link>
        <span className="anno hidden lg:block" style={{ color: 'var(--color-ink-faint)' }}>
          sht 1 / rev b
        </span>
        <MobileNav links={links} />
      </div>
    </nav>
  );
}
