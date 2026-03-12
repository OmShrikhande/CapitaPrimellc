const FOOTER_LINKS = {
  Services: ['Land Acquisition', 'Investment Strategy', 'Legal & Compliance', 'Market Intelligence', 'Property Valuation'],
  Locations: ['Palm Jumeirah', 'Emirates Hills', 'Downtown Dubai', 'Business Bay', 'Creek Harbour', 'MBR City'],
  Company: ['About Us', 'Our Team', 'Press', 'Careers', 'Privacy Policy'],
};

const Footer = () => (
  <footer
    style={{
      background: '#050505',
      borderTop: '1px solid rgba(201,168,76,0.12)',
    }}
  >
    <div className="px-6 sm:px-10 lg:px-16 pt-16 lg:pt-20 pb-10" style={{zIndex: 2, padding: 'clamp(60px, 8vh, 80px) clamp(20px, 5vw, 60px) 60px' }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
        <div className="sm:col-span-2 lg:col-span-2 flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Capita Prime Logo" className="h-12 lg:h-16 w-auto object-contain" />
          </div>

          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 'clamp(13px, 1.8vw, 14px)',
              fontWeight: 300,
              color: 'rgba(255,255,255,0.4)',
              lineHeight: 1.7,
              maxWidth: 320,
            }}
          >
            {"Dubai's most trusted land investment consultancy. RERA Certified. DLD Registered. Serving elite investors across 42 nationalities."}
          </p>

          <div className="flex gap-4 mt-2">
            {[
              { label: 'LinkedIn', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg> },
              { label: 'Instagram', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg> },
              { label: 'Twitter', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg> }
            ].map(social => (
              <a
                key={social.label}
                href="#"
                aria-label={social.label}
                style={{
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.02)',
                  color: 'rgba(255,255,255,0.4)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)';
                  e.currentTarget.style.color = '#C9A84C';
                  e.currentTarget.style.background = 'rgba(201,168,76,0.05)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.4)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                }}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        <div className="sm:col-span-2 lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-8">
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading} className="flex flex-col gap-4">
              <h4
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '9px',
                  fontWeight: 700,
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  color: '#C9A84C',
                  marginBottom: 2,
                }}
              >
                {heading}
              </h4>
              <div className="flex flex-col gap-3">
                {links.map(link => (
                  <a
                    key={link}
                    href="#"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '11px',
                      color: 'rgba(255,255,255,0.35)',
                      transition: 'color 0.3s ease',
                      lineHeight: 1.2,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; }}
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="gold-line-h mb-8 opacity-30" />

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '10px',
            color: 'rgba(255,255,255,0.25)',
            letterSpacing: '0.05em',
            maxWidth: 500,
          }}
        >
          &copy; {new Date().getFullYear()} Capita Prime LLC. All rights reserved. Licensed by RERA &amp; DLD — Dubai, UAE.
        </p>
        <div className="flex items-center gap-2">
          <div
            style={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: '#22c55e',
              boxShadow: '0 0 8px #22c55e',
            }}
          />
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '10px',
              color: 'rgba(255,255,255,0.3)',
              letterSpacing: '0.1em',
            }}
          >
            All systems operational
          </span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;

