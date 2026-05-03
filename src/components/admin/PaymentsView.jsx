import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../context/api';

const formatDate = (v) => {
  if (!v) return '—';
  try {
    if (typeof v.toDate === 'function') return v.toDate().toLocaleString();
    if (v instanceof Date) return v.toLocaleString();
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? '—' : d.toLocaleString();
  } catch {
    return '—';
  }
};

const formatMoney = (amount, currency) => {
  if (amount == null) return '—';
  const cur = (currency || 'aed').toUpperCase();
  const n = Number(amount) / 100;
  if (!Number.isFinite(n)) return '—';
  return `${cur} ${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const PaymentsView = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [payments, setPayments] = useState([]);
  const [assetUnlocks, setAssetUnlocks] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const res = await adminAPI.getStripeActivity();
        if (cancelled) return;
        if (res.success && res.data) {
          setPayments(res.data.payments || []);
          setAssetUnlocks(res.data.assetUnlocks || []);
        } else {
          setError(res.message || 'Could not load activity.');
        }
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Request failed.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-10 w-full max-w-7xl mx-auto pb-20">
      <div className="px-2">
        <h3 className="text-4xl font-serif font-bold tracking-tight mb-2">Stripe activity</h3>
        <p className="text-[11px] text-gray-500 font-black uppercase tracking-[0.4em] opacity-60">Checkout records from your webhook</p>
      </div>

      <div className="bg-[#0a0a0a]/80 border border-white/10 rounded-[2rem] p-8 lg:p-10 space-y-4 text-sm text-gray-400 leading-relaxed">
        <p className="text-white font-bold text-xs uppercase tracking-widest text-gold/90">Who paid without user logins?</p>
        <p>
          This site does not create accounts. <strong className="text-white/90">Stripe</strong> is the source of truth: each checkout has a{' '}
          <strong className="text-white/90">session id</strong> (<code className="text-gold/90 text-xs">cs_…</code>) and, when the customer completes billing, an{' '}
          <strong className="text-white/90">email</strong> on the session. After payment, the buyer is returned to your site with{' '}
          <code className="text-gold/90 text-xs">unlock_session=cs_…</code> in the URL; the <strong className="text-white/90">backend verifies that id with Stripe</strong> before returning full listing
          details. Anyone who has that exact link could see the same unlocked view until you treat the link as confidential (same as a magic link).
        </p>
        <p>
          Rows below appear when <strong className="text-white/90">Stripe → Webhooks</strong> successfully posts <code className="text-gold/90 text-xs">checkout.session.completed</code> to your server and{' '}
          <code className="text-gold/90 text-xs">STRIPE_WEBHOOK_SECRET</code> is configured. You can always match a payment in the{' '}
          <a href="https://dashboard.stripe.com/test/payments" className="text-gold underline-offset-2 hover:underline" target="_blank" rel="noreferrer">
            Stripe Dashboard
          </a>{' '}
          by session id or customer email.
        </p>
      </div>

      {loading ? (
        <p className="text-gray-500 text-sm px-2">Loading…</p>
      ) : error ? (
        <p className="text-red-400/90 text-sm px-2" role="alert">
          {error}
        </p>
      ) : null}

      <div className="space-y-4">
        <h4 className="text-lg font-serif text-white px-2">Listing access payments</h4>
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-left text-xs min-w-[720px]">
            <thead className="bg-white/[0.04] text-gray-500 uppercase tracking-widest">
              <tr>
                <th className="p-4">Session</th>
                <th className="p-4">Asset</th>
                <th className="p-4">Email</th>
                <th className="p-4">When</th>
              </tr>
            </thead>
            <tbody>
              {assetUnlocks.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-gray-500 text-center">
                    No unlock records yet. Complete a test payment with webhook configured, or check Firebase <code className="text-gold/80">assetUnlocks</code>.
                  </td>
                </tr>
              ) : (
                assetUnlocks.map((row) => (
                  <tr key={row.sessionId || row.id} className="border-t border-white/5 hover:bg-white/[0.02]">
                    <td className="p-4 font-mono text-gold/90 break-all">{row.sessionId || row.id}</td>
                    <td className="p-4 text-white/80">{row.assetId || '—'}</td>
                    <td className="p-4">{row.customerEmail || '—'}</td>
                    <td className="p-4 text-gray-500 whitespace-nowrap">{formatDate(row.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-serif text-white px-2">All checkout sessions (webhook)</h4>
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-left text-xs min-w-[900px]">
            <thead className="bg-white/[0.04] text-gray-500 uppercase tracking-widest">
              <tr>
                <th className="p-4">Session</th>
                <th className="p-4">Kind</th>
                <th className="p-4">Email</th>
                <th className="p-4">Amount</th>
                <th className="p-4">When</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-gray-500 text-center">
                    No payment documents yet. Webhook must reach your API and write to <code className="text-gold/80">payments</code>.
                  </td>
                </tr>
              ) : (
                payments.map((row) => (
                  <tr key={row.id} className="border-t border-white/5 hover:bg-white/[0.02]">
                    <td className="p-4 font-mono text-gold/90 break-all">{row.id}</td>
                    <td className="p-4 text-white/80">{row.checkoutKind || '—'}</td>
                    <td className="p-4">{row.customerEmail || '—'}</td>
                    <td className="p-4">{formatMoney(row.amountTotal, row.currency)}</td>
                    <td className="p-4 text-gray-500 whitespace-nowrap">{formatDate(row.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentsView;
