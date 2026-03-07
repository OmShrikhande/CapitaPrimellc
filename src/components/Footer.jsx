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
    <div className="max-w-[1400px] mx-auto px-16 pt-20 pb-10">
      <div className="grid lg:grid-cols-5 gap-12 mb-16">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 flex items-center justify-center"
              style={{ border: '1px solid rgba(201,168,76,0.4)' }}
            >
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#C9A84C',
                }}
              >
                C
              </span>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '20px',
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
                    fontSize: '20px',
                    fontWeight: 400,
                    letterSpacing: '0.2em',
                    color: '#C9A84C',
                  }}
                >
                  PRIME
                </span>
              </div>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '9px',
                  letterSpacing: '0.2em',
                  color: 'rgba(255,255,255,0.3)',
                  marginTop: -2,
                }}
              >
                LLC — EST. DUBAI 2006
              </p>
            </div>
          </div>

          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '13.5px',
              fontWeight: 300,
              color: 'rgba(255,255,255,0.4)',
              lineHeight: 1.8,
              maxWidth: 320,
            }}
          >
            {"Dubai's most trusted land investment consultancy. RERA Certified. DLD Registered. Serving elite investors across 42 nationalities."}
          </p>

          <div className="flex gap-3">
            {['Li', 'Ig', 'X'].map(social => (
              <a
                key={social}
                href="#"
                aria-label={social}
                style={{
                  width: 36,
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(255,255,255,0.1)',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '10px',
                  color: 'rgba(255,255,255,0.4)',
                  transition: 'all 0.3s ease',
                  letterSpacing: '0.05em',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)';
                  e.currentTarget.style.color = '#C9A84C';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.4)';
                }}
              >
                {social}
              </a>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 grid grid-cols-3 gap-8">
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading} className="flex flex-col gap-4">
              <h4
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  color: '#C9A84C',
                  marginBottom: 4,
                }}
              >
                {heading}
              </h4>
              {links.map(link => (
                <a
                  key={link}
                  href="#"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '12.5px',
                    color: 'rgba(255,255,255,0.35)',
                    transition: 'color 0.3s ease',
                    lineHeight: 1,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; }}
                >
                  {link}
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="gold-line-h mb-8" />

      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '11px',
            color: 'rgba(255,255,255,0.25)',
            letterSpacing: '0.05em',
          }}
        >
          &copy; {new Date().getFullYear()} Capita Prime LLC. All rights reserved. Licensed by RERA &amp; DLD — Dubai, UAE.
        </p>
        <div className="flex items-center gap-2">
          <div
            style={{
              width: 6,
              height: 6,
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

