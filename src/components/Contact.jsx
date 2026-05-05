import { useState, useCallback, useId } from 'react';
import useReveal from '../hooks/useReveal';

import { useCMS } from '../context/useCMS';
import { createSiteConfirmationCheckout, submitInquiry } from '../context/api';

const ICON_MAP = {
  location: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  phone: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.06 6.06l1.98-1.98a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  mail: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  clock: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
};

function getInquiryErrorMessage(error) {
  if (error == null) return 'Something went wrong. Please try again.';
  if (typeof error === 'string') return error;
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === 'object' && typeof error.message === 'string') return error.message;
  return 'Something went wrong. Please try again.';
}

const Contact = () => {
  const { data } = useCMS();
  const contact = data?.contact;
  const formErrorId = useId();

  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [formError, setFormError] = useState('');
  const leftRef = useReveal('animate-on-scroll-left');
  const rightRef = useReveal('animate-on-scroll-right');

  const clearFormError = useCallback(() => {
    setFormError('');
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!(form instanceof HTMLFormElement)) return;

    setSending(true);
    setFormError('');

    try {
      const formData = new FormData(form);

      const name = String(formData.get('name') ?? '').trim();
      const email = String(formData.get('email') ?? '').trim();
      const message = String(formData.get('message') ?? '').trim();

      if (!name || !email || !message) {
        setFormError('Please fill in your name, email, and message.');
        return;
      }

      const payload = {
        name,
        email,
        phone: String(formData.get('phone') ?? '').trim(),
        type: String(formData.get('type') ?? '').trim(),
        budget: String(formData.get('budget') ?? '').trim(),
        message,
        source: 'contact',
      };

      await submitInquiry(payload);
      setSubmitted(true);
      form.reset();
    } catch (err) {
      setFormError(getInquiryErrorMessage(err));
    } finally {
      setSending(false);
    }
  }, []);

  const handlePaymentStart = useCallback(async () => {
    setStartingPayment(true);
    setPaymentError('');
    try {
      const response = await createSiteConfirmationCheckout({
        source: 'contact',
      });
      const checkoutUrl = response?.data?.url;
      if (!checkoutUrl) {
        throw new Error('Payment session was not created. Please try again.');
      }
      window.location.assign(checkoutUrl);
    } catch (error) {
      setPaymentError(getInquiryErrorMessage(error));
      setStartingPayment(false);
    }
  }, []);

  if (!contact) return null;

  return (
    <section id="contact" className="py-28 bg-void relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(201,168,76,0.04) 0%, transparent 70%)',
        }}
      />

      <div
        className="px-6 sm:px-10 lg:px-16 relative"
        style={{ zIndex: 2, padding: 'clamp(60px, 10vh, 100px) clamp(20px, 5vw, 60px) 80px' }}
      >
        <div className="flex flex-col lg:grid lg:grid-cols-5 gap-12 lg:gap-16 items-start">
          <div ref={leftRef} className="lg:col-span-2 flex flex-col gap-8">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="gold-line-h w-8 lg:w-12 animate-[expand-x_0.8s_ease-out_forwards] origin-left" />
                <span className="section-label text-[9px] lg:text-[10px]">{contact.label}</span>
              </div>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 'clamp(32px, 5vw, 52px)',
                  fontWeight: 600,
                  lineHeight: 1.1,
                  color: '#ffffff',
                  marginBottom: 20,
                }}
              >
                {contact.titleLine1}
                <br className="sm:hidden" />
                <span className="text-gold-gradient"> {contact.titleLine2}</span>
              </h2>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 'clamp(14px, 2vw, 15px)',
                  fontWeight: 300,
                  color: 'rgba(255,255,255,0.45)',
                  lineHeight: 1.8,
                }}
              >
                {contact.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-5">
              {contact.info?.map((info, idx) => (
                <div
                  key={info.label}
                  className="flex items-start gap-4 transition-transform duration-300 hover:translate-x-1"
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  <div
                    className="flex-shrink-0 w-10 h-10 flex items-center justify-center transition-all duration-300 hover:border-gold/40 hover:shadow-[0_0_20px_rgba(201,168,76,0.12)]"
                    style={{
                      background: 'rgba(201,168,76,0.08)',
                      border: '1px solid rgba(201,168,76,0.2)',
                    }}
                  >
                    {ICON_MAP[info.icon] || ICON_MAP.location}
                  </div>
                  <div>
                    <p
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '9px',
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
                        fontSize: '12px',
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

          <div ref={rightRef} className="lg:col-span-3 w-full">
            {submitted ? (
              <div
                className="contact-success-card flex flex-col items-center justify-center text-center gap-6 py-16 lg:py-20 rounded-sm"
                style={{
                  border: '1px solid rgba(201,168,76,0.25)',
                  background: 'linear-gradient(165deg, rgba(201,168,76,0.08) 0%, rgba(201,168,76,0.02) 45%, rgba(255,255,255,0.02) 100%)',
                  boxShadow: '0 24px 80px rgba(0,0,0,0.35), 0 0 60px rgba(201,168,76,0.06)',
                }}
              >
                <div className="relative flex items-center justify-center">
                  <span
                    className="contact-success-icon-ring absolute w-20 h-20 rounded-full border border-gold/25 pointer-events-none"
                    aria-hidden
                  />
                  <div
                    className="relative flex items-center justify-center w-16 h-16 rounded-full"
                    style={{
                      background: 'rgba(201,168,76,0.12)',
                      border: '1px solid rgba(201,168,76,0.35)',
                      boxShadow: '0 0 40px rgba(201,168,76,0.2)',
                    }}
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 'clamp(28px, 4vw, 32px)',
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
                onSubmit={handleSubmit}
                noValidate
                className="contact-form-panel flex flex-col gap-5 w-full rounded-sm"
                style={{
                  padding: 'clamp(24px, 5vw, 48px)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.02)',
                }}
                aria-describedby={formError ? formErrorId : undefined}
              >
                <div className="contact-form-inner flex flex-col gap-5">
                  {formError ? (
                    <div
                      id={formErrorId}
                      className="contact-alert-banner text-sm px-4 py-3 rounded-sm border border-red-500/35 bg-red-950/40 text-red-200/95 backdrop-blur-sm"
                      role="alert"
                      aria-live="assertive"
                    >
                      {formError}
                    </div>
                  ) : null}

                  <div
                    className="grid grid-cols-1 sm:grid-cols-2 gap-5"
                    onInput={clearFormError}
                    onChange={clearFormError}
                  >
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="contact-name"
                        className="text-[9px] lg:text-[10px]"
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 600,
                          letterSpacing: '0.2em',
                          textTransform: 'uppercase',
                          color: 'rgba(255,255,255,0.4)',
                        }}
                      >
                        Full Name
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        name="name"
                        required
                        placeholder="Your full name"
                        className="form-input transition-[border-color,background,box-shadow] duration-300"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="contact-email"
                        className="text-[9px] lg:text-[10px]"
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 600,
                          letterSpacing: '0.2em',
                          textTransform: 'uppercase',
                          color: 'rgba(255,255,255,0.4)',
                        }}
                      >
                        Email Address
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        name="email"
                        required
                        autoComplete="email"
                        placeholder="your@email.com"
                        className="form-input transition-[border-color,background,box-shadow] duration-300"
                      />
                    </div>
                  </div>

                  <div
                    className="grid grid-cols-1 sm:grid-cols-2 gap-5"
                    onInput={clearFormError}
                    onChange={clearFormError}
                  >
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="contact-phone"
                        className="text-[9px] lg:text-[10px]"
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 600,
                          letterSpacing: '0.2em',
                          textTransform: 'uppercase',
                          color: 'rgba(255,255,255,0.4)',
                        }}
                      >
                        Phone Number
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        name="phone"
                        autoComplete="tel"
                        placeholder="+971 56 902 7445"
                        className="form-input transition-[border-color,background,box-shadow] duration-300"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="contact-type"
                        className="text-[9px] lg:text-[10px]"
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 600,
                          letterSpacing: '0.2em',
                          textTransform: 'uppercase',
                          color: 'rgba(255,255,255,0.4)',
                        }}
                      >
                        Investment Type
                      </label>
                      <select
                        id="contact-type"
                        name="type"
                        className="form-input transition-[border-color,background,box-shadow] duration-300"
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Select interest
                        </option>
                        <option value="buy">Buying Land</option>
                        <option value="sell">Selling Land</option>
                        <option value="invest">Investment Advisory</option>
                        <option value="valuation">Property Valuation</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2" onInput={clearFormError} onChange={clearFormError}>
                    <label
                      htmlFor="contact-budget"
                      className="text-[9px] lg:text-[10px]"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 600,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.4)',
                      }}
                    >
                      Budget Range (AED)
                    </label>
                    <select
                      id="contact-budget"
                      name="budget"
                      className="form-input transition-[border-color,background,box-shadow] duration-300"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select budget range
                      </option>
                      <option value="under5m">Under 5 Million</option>
                      <option value="5-10m">5 – 10 Million</option>
                      <option value="10-25m">10 – 25 Million</option>
                      <option value="25-50m">25 – 50 Million</option>
                      <option value="50m+">50 Million+</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2" onInput={clearFormError} onChange={clearFormError}>
                    <label
                      htmlFor="contact-message"
                      className="text-[9px] lg:text-[10px]"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 600,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.4)',
                      }}
                    >
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={4}
                      required
                      placeholder="Tell us about your land investment goals..."
                      className="form-input text-sm lg:text-base transition-[border-color,background,box-shadow] duration-300"
                      style={{ resize: 'none' }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="btn-primary w-full justify-center mt-2 py-3 lg:py-4 relative overflow-hidden group"
                    style={{ opacity: sending ? 0.85 : 1 }}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {sending ? (
                        <>
                          <span
                            className="inline-block w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"
                            aria-hidden
                          />
                          Sending…
                        </>
                      ) : (
                        <>
                          Submit Inquiry
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </>
                      )}
                    </span>
                    {!sending ? (
                      <span
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"
                        aria-hidden
                      />
                    ) : null}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
