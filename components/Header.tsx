'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 md:right-[400px] z-50 glass-morphic">
      <nav className="flex justify-between items-center px-6 md:px-12 py-6 max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold gradient-text">
          CB
        </Link>

        {/* Navigation Links */}
        <ul className="hidden md:flex gap-8">
          <li>
            <Link href="/about" className="text-gray-400 hover:text-primary-cyan transition-colors">
              About
            </Link>
          </li>
          <li>
            <Link href="/workflows" className="text-gray-400 hover:text-primary-cyan transition-colors">
              Workflows
            </Link>
          </li>
          <li>
            <Link href="/blog" className="text-gray-400 hover:text-primary-cyan transition-colors">
              Blog
            </Link>
          </li>
          <li>
            <Link href="/contact" className="text-gray-400 hover:text-primary-cyan transition-colors">
              Contact
            </Link>
          </li>
        </ul>

        {/* CTAs */}
        <div className="flex gap-4">
          <button
            className="px-6 py-3 border-2 border-primary-cyan text-primary-cyan rounded-lg hover:bg-primary-cyan/10 transition-all font-semibold"
            onClick={() => {
              // Will integrate with AI chat later
              console.log('Open chat with hiring context');
            }}
          >
            I'm Hiring
          </button>
          <button
            className="hidden md:block px-6 py-3 bg-gradient-to-r from-primary-cyan to-primary-blue text-white rounded-lg hover:shadow-lg hover:shadow-primary-cyan/30 hover:-translate-y-0.5 transition-all font-semibold"
            onClick={() => {
              // Will integrate with AI chat later
              console.log('Open chat with client context');
            }}
          >
            Need Automation?
          </button>
        </div>
      </nav>
    </header>
  );
}
