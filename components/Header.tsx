'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <nav style={{ padding: '20px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="max-w-[1100px] mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="text-[22px] font-extrabold tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          CALEB <span style={{ fontWeight: 500, color: '#60A5FA' }}>BOLDEN</span>
        </Link>
        <ul className="hidden md:flex gap-7 list-none">
          <li><Link href="#services" className="text-sm font-medium text-gray-400 hover:text-[#93C5FD] transition-colors">Services</Link></li>
          <li><Link href="#industries" className="text-sm font-medium text-gray-400 hover:text-[#93C5FD] transition-colors">Industries</Link></li>
          <li><Link href="/blog" className="text-sm font-medium text-gray-400 hover:text-[#93C5FD] transition-colors">Blog</Link></li>
        </ul>
      </div>
    </nav>
  );
}
