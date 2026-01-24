import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-primary-cyan/10 mt-24 md:mr-[400px]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="text-2xl font-bold gradient-text mb-4">CB</div>
            <p className="text-gray-400 text-sm">
              Building intelligent systems that give people their time back.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-primary-cyan transition-colors text-sm">
                  About
                </Link>
              </li>
              <li>
                <Link href="/workflows" className="text-gray-400 hover:text-primary-cyan transition-colors text-sm">
                  Workflows
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-primary-cyan transition-colors text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-primary-cyan transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold text-white mb-4">Connect</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://linkedin.com/in/calebbolden"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary-cyan transition-colors text-sm"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/cbolden15"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary-cyan transition-colors text-sm"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="mailto:cbolden15@gmail.com"
                  className="text-gray-400 hover:text-primary-cyan transition-colors text-sm"
                >
                  Email
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-primary-cyan/10 text-center text-gray-500 text-sm">
          <p>&copy; {currentYear} Caleb Bolden. Built with Next.js, powered by AI.</p>
        </div>
      </div>
    </footer>
  );
}
