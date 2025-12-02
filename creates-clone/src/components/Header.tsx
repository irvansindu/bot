import Link from 'next/link';

const Header = () => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-7 w-7 rounded-md bg-gradient-to-br from-purple-600 to-indigo-500 flex items-center justify-center text-xs font-semibold text-white">
              CR
            </div>
            <span className="text-sm font-semibold tracking-wide text-gray-900">CREATES</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 text-sm">
            <Link href="/izin-cover-lagu" className="text-gray-700 hover:text-purple-600 transition-colors">
              Coverto Master
            </Link>
            <Link href="/rilis-musik" className="text-gray-700 hover:text-purple-600 transition-colors">
              Digital Music Distribution
            </Link>
            <Link href="/ragam-insight" className="text-gray-700 hover:text-purple-600 transition-colors">
              Ragam & Insight
            </Link>
          </nav>

          {/* Auth / dashboard button */}
          <div className="hidden md:flex items-center space-x-3 text-sm">
            <Link
              href="/login"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              Masuk
            </Link>
            <Link
              href="/daftar"
              className="rounded-full bg-purple-600 px-4 py-1.5 font-medium text-white shadow-sm hover:bg-purple-700 transition-colors"
            >
              Daftar Gratis
            </Link>
          </div>

          {/* Mobile menu button (dummy, hanya icon) */}
          <button className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 6h16" />
              <path d="M4 12h16" />
              <path d="M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
