import { useState } from 'react';
import useReveal from '../hooks/useReveal';

const CONTACT_INFO = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    label: 'Office',
    value: 'Burj Khalifa District, Downtown Dubai, UAE',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.06 6.06l1.98-1.98a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    label: 'Phone',
    value: '+971 4 XXX XXXX',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    label: 'Email',
    value: 'invest@capitaprimellc.com',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    label: 'Hours',
    value: 'Sun – Thu: 9:00 AM – 6:00 PM GST',
  },
];

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const leftRef = useReveal('animate-on-scroll-left');
  const rightRef = useReveal('animate-on-scroll-right');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const formData = new FormData(e.target);
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString(),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="py-32 bg-void relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(201,168,76,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="px-16 relative" style={{zIndex: 2, padding: '100px 60px 80px' }}>
        <div className="grid lg:grid-cols-5 gap-16 items-start">
          <div ref={leftRef} className="lg:col-span-2 flex flex-col gap-8">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="gold-line-h w-12" />
                <span className="section-label">Get in Touch</span>
              </div>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 'clamp(36px, 4vw, 52px)',
                  fontWeight: 600,
                  lineHeight: 1.1,
                  color: '#ffffff',
                  marginBottom: 20,
                }}
              >
                Begin Your Dubai Land
                <span className="text-gold-gradient"> Investment Journey</span>
              </h2>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '14px',
                  fontWeight: 300,
                  color: 'rgba(255,255,255,0.45)',
                  lineHeight: 1.8,
                }}
              >
                Our advisory team is available for confidential consultations. Whether you are buying, selling, or evaluating — we provide unparalleled insight.
              </p>
            </div>

            <div className="flex flex-col gap-5">
              {CONTACT_INFO.map(info => (
                <div key={info.label} className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 w-10 h-10 flex items-center justify-center"
                    style={{
                      background: 'rgba(201,168,76,0.08)',
                      border: '1px solid rgba(201,168,76,0.2)',
                    }}
                  >
                    {info.icon}
                  </div>
                  <div>
                    <p
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: '#C9A84C',
                        marginBottom: 3,
                      }}
                    >
                      {info.label}
                    </p>
                    <p
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '13px',
                        color: 'rgba(255,255,255,0.55)',
                      }}
                    >
                      {info.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div ref={rightRef} className="lg:col-span-3">
            {submitted ? (
              <div
                className="flex flex-col items-center justify-center text-center gap-6 py-20"
                style={{
                  border: '1px solid rgba(201,168,76,0.2)',
                  background: 'rgba(201,168,76,0.03)',
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: 'rgba(201,168,76,0.1)',
                    border: '1px solid rgba(201,168,76,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <h3
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: '32px',
                      fontWeight: 600,
                      color: '#ffffff',
                      marginBottom: 8,
                    }}
                  >
                    Message Received
                  </h3>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '14px',
                      color: 'rgba(255,255,255,0.45)',
                    }}
                  >
                    Our senior advisory team will contact you within 24 hours.
                  </p>
                </div>
              </div>
            ) : (
              <form
                name="contact"
                method="POST"
                data-netlify="true"
                onSubmit={handleSubmit}
                className="flex flex-col gap-5"
                style={{
                  padding: '48px',
                  border: '1px solid rgba(255,255,255,0.07)',
                  background: 'rgba(255,255,255,0.02)',
                }}
              >
                <input type="hidden" name="form-name" value="contact" />

                <div className="grid md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.4)',
                      }}
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Your full name"
                      className="form-input"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.4)',
                      }}
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="your@email.com"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.4)',
                      }}
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+971 XX XXX XXXX"
                      className="form-input"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.4)',
                      }}
                    >
                      Investment Type
                    </label>
                    <select name="type" className="form-input" defaultValue="">
                      <option value="" disabled>Select interest</option>
                      <option value="buy">Buying Land</option>
                      <option value="sell">Selling Land</option>
                      <option value="invest">Investment Advisory</option>
                      <option value="valuation">Property Valuation</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '10px',
                      fontWeight: 600,
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.4)',
                    }}
                  >
                    Budget Range (AED)
                  </label>
                  <select name="budget" className="form-input" defaultValue="">
                    <option value="" disabled>Select budget range</option>
                    <option value="under5m">Under 5 Million</option>
                    <option value="5-10m">5 – 10 Million</option>
                    <option value="10-25m">10 – 25 Million</option>
                    <option value="25-50m">25 – 50 Million</option>
                    <option value="50m+">50 Million+</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '10px',
                      fontWeight: 600,
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.4)',
                    }}
                  >
                    Message
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    required
                    placeholder="Tell us about your land investment goals..."
                    className="form-input"
                    style={{ resize: 'none' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="btn-primary w-full justify-center mt-2"
                  style={{ opacity: sending ? 0.7 : 1 }}
                >
                  <span>{sending ? 'Sending...' : 'Submit Inquiry'}</span>
                  {!sending && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
