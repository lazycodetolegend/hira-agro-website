import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    const handleKey = (e) => { if (e.key === 'Escape') setIsOpen(false); };
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKey);
    };
  }, [isOpen]);

  // On homepage before scroll: transparent with white text
  // After scroll or on other pages: cream bg with ink text
  const isTransparent = isHome && !scrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isTransparent
          ? 'bg-transparent'
          : 'bg-cream/95 backdrop-blur-md border-b border-stone/10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group" aria-label="Home">
            <span className={`font-heading text-2xl transition-colors duration-300 ${
              isTransparent ? 'text-cream' : 'text-ink'
            }`}>
              Hira Agro
            </span>
            <span className={`text-[10px] tracking-[0.15em] font-medium uppercase mt-1 transition-colors duration-300 ${
              isTransparent ? 'text-gold' : 'text-gold'
            }`}>
              Industry
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10" aria-label="Main">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative text-sm font-medium transition-colors duration-300 hover-underline ${
                  isTransparent
                    ? isActive(link.path) ? 'text-cream' : 'text-cream/70 hover:text-cream'
                    : isActive(link.path) ? 'text-ink' : 'text-stone hover:text-ink'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Staff / Dashboard link */}
            <Link
              to={user ? (user.role === 'admin' ? '/admin' : '/manager') : '/login'}
              className={`ml-4 text-xs font-semibold uppercase tracking-widest px-6 py-2.5 rounded-full transition-all duration-300 shadow-xs hover:shadow-md hover:scale-[1.02] active:scale-[0.98] ${
                isTransparent
                  ? 'border border-gold/80 text-gold bg-gold/10 hover:bg-gold hover:text-forest'
                  : 'bg-forest text-gold border border-gold/40 hover:bg-primary-light hover:border-gold'
              }`}
            >
              {user ? 'Dashboard' : 'Staff Login'}
            </Link>
          </nav>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 transition-colors ${
              isTransparent ? 'text-cream' : 'text-ink'
            }`}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? <HiOutlineX className="w-6 h-6" /> : <HiOutlineMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Full-screen Mobile Menu */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-forest flex flex-col md:hidden"
          onClick={() => setIsOpen(false)}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-6 h-20" onClick={(e) => e.stopPropagation()}>
            <span className="font-heading text-2xl text-cream">Hira Agro</span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-cream/70 hover:text-cream"
              aria-label="Close menu"
            >
              <HiOutlineX className="w-6 h-6" />
            </button>
          </div>

          {/* Links */}
          <div className="flex-1 flex flex-col justify-center px-12 space-y-8" onClick={(e) => e.stopPropagation()}>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`font-heading text-5xl transition-colors ${
                  isActive(link.path) ? 'text-gold' : 'text-cream/60 hover:text-cream'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="px-12 pb-12" onClick={(e) => e.stopPropagation()}>
            <Link
              to={user ? (user.role === 'admin' ? '/admin' : '/manager') : '/login'}
              onClick={() => setIsOpen(false)}
              className="block w-full text-center py-4 border border-cream/20 text-cream rounded-full text-sm font-medium hover:bg-cream/10 transition-colors"
            >
              {user ? 'Dashboard' : 'Staff Login'}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
