import { useEffect, useRef, useState } from 'react';
import { useCMS } from '../context/useCMS';
import { submitInquiry } from '../context/api';

const STORAGE_KEY = 'capita-prime-popup-submitted';

const INVESTMENT_OPTIONS = [
  { value: '', label: 'Select interest', disabled: true },
  { value: 'buy', label: 'Buying Land' },
  { value: 'sell', label: 'Selling Land' },
  { value: 'invest', label: 'Investment Advisory' },
  { value: 'valuation', label: 'Property Valuation' },
  { value: 'other', label: 'Other' },
];

const BUDGET_OPTIONS = [
  { value: '', label: 'Select budget range', disabled: true },
  { value: 'under5m', label: 'Under 5 Million' },
  { value: '5-10m', label: '5 - 10 Million' },
  { value: '10-25m', label: '10 - 25 Million' },
  { value: '25-50m', label: '25 - 50 Million' },
  { value: '50m+', label: '50 Million+' },
];

const FORM_FIELDS = [
  { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Your full name', required: true },
  { name: 'email', label: 'Email Address', type: 'email', placeholder: 'your@email.com', required: true },
  { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+971 XX XXX XXXX' },
];

const labelStyle = {
  fontFamily: "'Inter', sans-serif",
  fontWeight: 600,
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.4)',
};

const overlayStyle = {
  background: 'rgba(6,6,6,0.72)',
  backdropFilter: 'blur(18px)',
};

const panelStyle = {
  background: 'linear-gradient(180deg, rgba(12,12,12,0.98) 0%, rgba(7,7,7,0.98) 100%)',
  border: '1px solid rgba(255,255,255,0.08)',
  boxShadow: '0 32px 120px rgba(0, 0, 0, 0.65)',
};

const getDelaySchedule = (popupSettings) => {
  const configuredDelays = Array.isArray(popupSettings?.delaysInSeconds)
    ? popupSettings.delaysInSeconds
    : [0, 60, 120];

  const normalizedDelays = configuredDelays
    .slice(0, 3)
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value) && value >= 0)
    .sort((a, b) => a - b);

  return normalizedDelays.length > 0 ? normalizedDelays.map((value) => value * 1000) : [0, 60000, 120000];
};

const TimedInquiryPopup = ({ enabled }) => {
  const { data } = useCMS();
  const [isOpen, setIsOpen] = useState(false);
  const [queueCount, setQueueCount] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [formError, setFormError] = useState('');
  const [shouldStayHidden, setShouldStayHidden] = useState(false);
  const timersRef = useRef([]);
  const initializedRef = useRef(false);
  const isOpenRef = useRef(false);
  const popupSettings = data?.popupSettings;
  const popupEnabled = popupSettings?.enabled !== false;
  const popupDelays = getDelaySchedule(popupSettings);
  const popupDelayKey = popupDelays.join(',');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setShouldStayHidden(window.sessionStorage.getItem(STORAGE_KEY) === 'true');
  }, []);

  useEffect(() => {
    initializedRef.current = false;
  }, [popupDelayKey, popupEnabled]);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    if (!enabled || !popupEnabled || shouldStayHidden || initializedRef.current) return undefined;

    initializedRef.current = true;

    const schedulePopup = (delay) => {
      const timerId = window.setTimeout(() => {
        setQueueCount((currentQueue) => {
          if (!isOpenRef.current && currentQueue === 0) {
            setIsOpen(true);
            return 0;
          }

          return currentQueue + 1;
        });
      }, delay);

      timersRef.current.push(timerId);
    };

    popupDelays.forEach(schedulePopup);

    return () => {
      timersRef.current.forEach(window.clearTimeout);
      timersRef.current = [];
    };
  }, [enabled, popupDelayKey, popupEnabled, shouldStayHidden]);

  useEffect(() => {
    if (!enabled || !popupEnabled || !isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [enabled, isOpen]);

  const closePopup = () => {
    setIsOpen(false);
    setSubmitted(false);
    setFormError('');

    setQueueCount((currentQueue) => {
      if (currentQueue > 0) {
        window.setTimeout(() => setIsOpen(true), 180);
        return currentQueue - 1;
      }

      return 0;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSending(true);
    setFormError('');

    try {
      const formData = new FormData(event.target);
      const payload = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        type: formData.get('type'),
        budget: formData.get('budget'),
        message: formData.get('message'),
        source: 'popup',
        hp_field: formData.get('hp_field'),
      };
      await submitInquiry(payload);

      setSubmitted(true);
      window.sessionStorage.setItem(STORAGE_KEY, 'true');
      setShouldStayHidden(true);
      timersRef.current.forEach(window.clearTimeout);
      timersRef.current = [];
      setQueueCount(0);
    } catch (err) {
      setFormError(err.message || 'Could not send. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (!enabled || !popupEnabled || !isOpen || (shouldStayHidden && !submitted)) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center px-4 py-6 sm:px-6"
      style={overlayStyle}
      role="dialog"
      aria-modal="true"
      aria-labelledby="timed-inquiry-title"
      onClick={closePopup}
    >
      <div
        className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto custom-scrollbar"
        style={panelStyle}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center border border-white/10 text-white/60 transition hover:border-gold/40 hover:text-gold"
          onClick={closePopup}
          aria-label="Close inquiry popup"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div className="px-5 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10">
          {submitted ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center gap-6 text-center">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/30 bg-gold/10"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div>
                <h2
                  id="timed-inquiry-title"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 'clamp(30px, 4vw, 42px)',
                    fontWeight: 600,
                    color: '#ffffff',
                    marginBottom: 10,
                  }}
                >
                  Inquiry Received
                </h2>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '14px',
                    color: 'rgba(255,255,255,0.52)',
                  }}
                >
                  Our advisory team will connect with you shortly.
                </p>
              </div>
              <button type="button" className="btn-primary justify-center px-10" onClick={closePopup}>
                <span>Close</span>
              </button>
            </div>
          ) : (
            <>
              <div className="mb-8 pr-12">
                <div className="mb-4 flex items-center gap-4">
                  <div className="gold-line-h w-10" />
                  <span className="section-label text-[10px]">Private Consultation</span>
                </div>
                <h2
                  id="timed-inquiry-title"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 'clamp(30px, 4vw, 48px)',
                    fontWeight: 600,
                    lineHeight: 1.05,
                    color: '#ffffff',
                    marginBottom: 14,
                  }}
                >
                  Start Your Land Investment Conversation
                </h2>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '14px',
                    lineHeight: 1.75,
                    color: 'rgba(255,255,255,0.5)',
                    maxWidth: '720px',
                  }}
                >
                  Share your requirements and we will match you with the right advisory path, opportunities, and next steps.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <input
                  type="text"
                  name="hp_field"
                  tabIndex={-1}
                  autoComplete="off"
                  className="absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0"
                  style={{ clip: 'rect(0,0,0,0)' }}
                  aria-hidden="true"
                />

                {formError ? (
                  <div
                    className="text-sm px-4 py-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-300/90"
                    role="alert"
                  >
                    {formError}
                  </div>
                ) : null}

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {FORM_FIELDS.slice(0, 2).map((field) => (
                    <div key={field.name} className="flex flex-col gap-2">
                      <label className="text-[9px] lg:text-[10px]" style={labelStyle}>
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        name={field.name}
                        required={field.required}
                        placeholder={field.placeholder}
                        className="form-input popup-form-input"
                      />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] lg:text-[10px]" style={labelStyle}>
                      {FORM_FIELDS[2].label}
                    </label>
                    <input
                      type={FORM_FIELDS[2].type}
                      name={FORM_FIELDS[2].name}
                      placeholder={FORM_FIELDS[2].placeholder}
                      className="form-input popup-form-input"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] lg:text-[10px]" style={labelStyle}>
                      Investment Type
                    </label>
                    <select name="type" defaultValue="" className="form-input popup-form-input">
                      {INVESTMENT_OPTIONS.map((option) => (
                        <option key={option.value || 'placeholder'} value={option.value} disabled={option.disabled}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[9px] lg:text-[10px]" style={labelStyle}>
                    Budget Range (AED)
                  </label>
                  <select name="budget" defaultValue="" className="form-input popup-form-input">
                    {BUDGET_OPTIONS.map((option) => (
                      <option key={option.value || 'placeholder'} value={option.value} disabled={option.disabled}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[9px] lg:text-[10px]" style={labelStyle}>
                    Message
                  </label>
                  <textarea
                    name="message"
                    rows={5}
                    required
                    placeholder="Tell us about your land investment goals..."
                    className="form-input popup-form-input text-sm lg:text-base"
                    style={{ resize: 'none' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="btn-primary mt-2 w-full justify-center py-4"
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimedInquiryPopup;
