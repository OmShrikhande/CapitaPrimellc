import { useState, useEffect } from 'react';

const NAV_LINKS = [
  { label: 'Properties', href: '#properties' },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Testimonials', href: '#testimonials' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isListingsPage = window.location.hash === '#listings';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-700"
      style={{
        background: scrolled || isListingsPage || menuOpen ? 'rgba(6,6,6,0.95)' : 'transparent',
        backdropFilter: scrolled || isListingsPage || menuOpen ? 'blur(24px)' : 'none',
        borderBottom: scrolled || isListingsPage || menuOpen ? '1px solid rgba(201,168,76,0.15)' : '1px solid transparent',
        padding: "0% 1% 0% 1% "
      }}
    >
      <div className="px-6 sm:px-10 lg:px-16 flex items-center justify-between h-20 lg:h-24 transition-all duration-500">
        <a href="#hero" className="flex items-center gap-3 group" onClick={() => { window.location.hash = ''; setMenuOpen(false); }}>
          <img src="/logo.png" alt="Capita Prime Logo" className="h-14 sm:h-16 lg:h-18 w-auto transition-transform duration-500 group-hover:scale-105" />
        </a>

        <div className="hidden lg:flex items-center gap-10">
          {isListingsPage ? (
            <a href="#" className="nav-link-item" onClick={(e) => {
              e.preventDefault();
              window.location.hash = '';
            }}>
              Back to Home
            </a>
          ) : (
            NAV_LINKS.map(link => (
              <a key={link.label} href={link.href} className="nav-link-item text-[12px]">
                {link.label}
              </a>
            ))
          )}
        </div>

        <button
          className="lg:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-1.5 focus:outline-none m-10"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <span
            className="block w-6 h-0.5 transition-all duration-300 ease-in-out"
            style={{
              transform: menuOpen ? 'translateY(8px) rotate(45deg)' : 'none',
              background: '#C9A84C',
            }}
          />
          <span
            className="block w-6 h-0.5 transition-all duration-300 ease-in-out"
            style={{
              opacity: menuOpen ? 0 : 1,
              width: menuOpen ? '0' : '24px',
              background: '#C9A84C',
            }}
          />
          <span
            className="block w-6 h-0.5 transition-all duration-300 ease-in-out"
            style={{
              transform: menuOpen ? 'translateY(-8px) rotate(-45deg)' : 'none',
              background: '#C9A84C',
            }}
          />
        </button>
      </div>

      <div
        className="lg:hidden overflow-hidden transition-all duration-500 ease-in-out"
        style={{
          maxHeight: menuOpen ? '450px' : '0',
          background: 'rgba(6,6,6,0.98)',
          backdropFilter: 'blur(30px)',
          borderBottom: menuOpen ? '1px solid rgba(201,168,76,0.2)' : 'none',
          opacity: menuOpen ? 1 : 0,
        }}
      >
        <div className="px-10 py-12 flex flex-col gap-10 items-center text-center">
          {isListingsPage ? (
            <a
              href="#"
              className="nav-link-item text-lg tracking-[0.4em]"
              style={{
                transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
                opacity: menuOpen ? 1 : 0,
                transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.1s',
              }}
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = '';
                setMenuOpen(false);
              }}
            >
              Back to Home
            </a>
          ) : (
            NAV_LINKS.map((link, index) => (
              <a
                key={link.label}
                href={link.href}
                className="nav-link-item text-lg tracking-[0.4em]"
                style={{
                  transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
                  opacity: menuOpen ? 1 : 0,
                  transition: `all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${0.1 + index * 0.05}s`,
                }}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
