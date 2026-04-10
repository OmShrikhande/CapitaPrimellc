import { useEffect, useMemo, useState } from 'react';
import { getCheckoutSessionStatus } from '../context/api';

const getSessionIdFromHash = () => {
  const hash = window.location.hash || '';
  const idx = hash.indexOf('?');
  if (idx < 0) return '';
  const query = hash.slice(idx + 1);
  const params = new URLSearchParams(query);
  return params.get('session_id') || '';
};

const PaymentConfirmation = ({ cancelled = false }) => {
  const [loading, setLoading] = useState(!cancelled);
  const [error, setError] = useState('');
  const [payment, setPayment] = useState(null);
  const sessionId = useMemo(() => (cancelled ? '' : getSessionIdFromHash()), [cancelled]);

  useEffect(() => {
    if (cancelled) return;

    if (!sessionId) {
      setError('Missing payment session id. Please try the payment flow again.');
      setLoading(false);
      return;
    }

    let mounted = true;
    const run = async () => {
      try {
        const response = await getCheckoutSessionStatus(sessionId);
        if (!mounted) return;
        setPayment(response?.data || null);
      } catch (e) {
        if (!mounted) return;
        setError(e?.message || 'Unable to verify payment status.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    run();
    return () => {
      mounted = false;
    };
  }, [cancelled, sessionId]);

  const isPaid = payment?.paymentStatus === 'paid';

  return (
    <section className="py-28 bg-void relative overflow-hidden">
      <div className="px-6 sm:px-10 lg:px-16 relative" style={{ zIndex: 2 }}>
        <div
          className="max-w-3xl mx-auto rounded-sm p-8 lg:p-10 text-center"
          style={{
            border: '1px solid rgba(201,168,76,0.25)',
            background: 'linear-gradient(165deg, rgba(201,168,76,0.08) 0%, rgba(201,168,76,0.02) 45%, rgba(255,255,255,0.02) 100%)',
          }}
        >
          {cancelled ? (
            <>
              <h2 className="text-gold-gradient" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(30px, 4vw, 42px)' }}>
                Payment Cancelled
              </h2>
              <p className="mt-4" style={{ color: 'rgba(255,255,255,0.7)' }}>
                No charge was made. You can go back and retry payment whenever you are ready.
              </p>
            </>
          ) : loading ? (
            <p style={{ color: 'rgba(255,255,255,0.75)' }}>Verifying your payment...</p>
          ) : error ? (
            <>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(30px, 4vw, 42px)', color: '#ffffff' }}>
                Payment Verification Failed
              </h2>
              <p className="mt-4" style={{ color: 'rgba(255,255,255,0.7)' }}>
                {error}
              </p>
            </>
          ) : isPaid ? (
            <>
              <h2 className="text-gold-gradient" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(30px, 4vw, 42px)' }}>
                Payment Confirmed
              </h2>
              <p className="mt-4" style={{ color: 'rgba(255,255,255,0.7)' }}>
                Thank you. Your site confirmation payment has been received successfully.
              </p>
            </>
          ) : (
            <>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(30px, 4vw, 42px)', color: '#ffffff' }}>
                Payment Pending
              </h2>
              <p className="mt-4" style={{ color: 'rgba(255,255,255,0.7)' }}>
                We received your checkout session, but payment is not marked paid yet.
              </p>
            </>
          )}
          <div className="mt-8">
            <a href="#contact" className="btn-primary inline-flex justify-center px-6 py-3">
              Return to Contact
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentConfirmation;
