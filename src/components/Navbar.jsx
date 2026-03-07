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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-700"
      style={{
        background: scrolled ? 'rgba(6,6,6,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(24px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(201,168,76,0.12)' : '1px solid transparent',
      }}
    >
      <div className="max-w-[1400px] mx-auto px-16 flex items-center justify-between h-20">
        <a href="#hero" className="flex items-center gap-3 group">
          <div
            className="w-8 h-8 flex items-center justify-center"
            style={{ border: '1px solid rgba(201,168,76,0.5)' }}
          >
            <span
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '16px',
                fontWeight: 700,
                color: '#C9A84C',
              }}
            >
              C
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '18px',
                fontWeight: 600,
                letterSpacing: '0.2em',
                color: '#ffffff',
              }}
            >
              CAPITA
            </span>
            <span
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '18px',
                fontWeight: 400,
                letterSpacing: '0.2em',
                color: '#C9A84C',
              }}
            >
              PRIME
            </span>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '9px',
                fontWeight: 500,
                letterSpacing: '0.15em',
                color: 'rgba(255,255,255,0.4)',
                marginLeft: '2px',
              }}
            >
              LLC
            </span>
          </div>
        </a>

        <div className="hidden lg:flex items-center gap-10">
          {NAV_LINKS.map(link => (
            <a key={link.label} href={link.href} className="nav-link-item">
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-6">
          <a href="#contact" className="btn-outline">
            <span>Schedule Consultation</span>
          </a>
        </div>

        <button
          className="lg:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <span
            className="block w-6 h-px bg-white transition-all duration-300"
            style={{
              transform: menuOpen ? 'translateY(6px) rotate(45deg)' : 'none',
              background: menuOpen ? '#C9A84C' : '#ffffff',
            }}
          />
          <span
            className="block w-6 h-px transition-all duration-300"
            style={{
              opacity: menuOpen ? 0 : 1,
              background: '#ffffff',
            }}
          />
          <span
            className="block w-6 h-px bg-white transition-all duration-300"
            style={{
              transform: menuOpen ? 'translateY(-6px) rotate(-45deg)' : 'none',
              background: menuOpen ? '#C9A84C' : '#ffffff',
            }}
          />
        </button>
      </div>

      <div
        className="lg:hidden overflow-hidden transition-all duration-500"
        style={{
          maxHeight: menuOpen ? '400px' : '0',
          background: 'rgba(6,6,6,0.97)',
          backdropFilter: 'blur(24px)',
          borderBottom: menuOpen ? '1px solid rgba(201,168,76,0.12)' : 'none',
        }}
      >
        <div className="px-8 py-6 flex flex-col gap-6">
          {NAV_LINKS.map(link => (
            <a
              key={link.label}
              href={link.href}
              className="nav-link-item text-base"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a href="#contact" className="btn-outline w-fit" onClick={() => setMenuOpen(false)}>
            <span>Schedule Consultation</span>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
