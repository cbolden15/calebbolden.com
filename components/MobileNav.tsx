'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';

type NavLink = { label: string; href: string };

// Full-screen working-wall menu behind a hamburger, shown below lg (1024px).
// Header stays a server component; all interactive state lives here.
export default function MobileNav({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // While open: lock body scroll, move focus into the overlay, close on Esc.
  // On close/unmount: restore scroll and return focus to the trigger.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
      triggerRef.current?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-nav-overlay"
        onClick={() => setOpen(true)}
        className="-mr-2 flex h-11 w-11 items-center justify-center lg:hidden"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink)" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      {/* Portal to body: escapes the header's z-20 stacking context so the
          overlay (z-[300]) clears the chat FAB (z-50) and chat surfaces (z-[190]/z-[200]). */}
      {open && createPortal(
        <div
          id="mobile-nav-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="graph-field fixed inset-0 z-[300] flex flex-col overflow-y-auto lg:hidden"
          style={{ background: 'var(--color-bg)' }}
        >
          <div
            className="flex h-16 shrink-0 items-center justify-between px-5 sm:px-8"
            style={{ borderBottom: '1px solid var(--color-hairline)' }}
          >
            <span className="type-display" style={{ fontSize: 15, fontWeight: 700, letterSpacing: '0.01em' }}>
              Caleb Bolden
            </span>
            <button
              ref={closeRef}
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="-mr-2 flex h-11 w-11 items-center justify-center"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink)" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <nav aria-label="Primary" className="flex flex-1 flex-col px-5 pt-2 sm:px-8">
            {links.map((l, i) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex items-baseline justify-between py-5"
                style={{ borderBottom: '1px solid var(--color-hairline)' }}
              >
                <span className="type-display" style={{ fontSize: 34 }}>
                  {l.label}
                </span>
                <span className="anno" style={{ color: 'var(--color-ink-faint)' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
              </Link>
            ))}
          </nav>

          <div className="px-5 pt-6 pb-[calc(2rem+env(safe-area-inset-bottom))] sm:px-8">
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="btn-ink w-full"
              style={{ padding: '14px 22px', fontSize: 15 }}
            >
              Let&apos;s talk
            </Link>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
