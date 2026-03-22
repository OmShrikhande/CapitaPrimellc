import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../context/api';

const InquiriesView = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError('');
        const res = await adminAPI.inquiries.list();
        if (!cancelled && res.success) setItems(res.data || []);
        else if (!cancelled) setError(res.message || 'Could not load inquiries');
      } catch (e) {
        if (!cancelled) setError(e.message || 'Could not load inquiries');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-white/50">
        <div className="w-10 h-10 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
        <p className="text-xs font-bold tracking-widest uppercase">Loading inquiry stream…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center text-red-400/90 text-sm">
        {error}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-16 text-center space-y-4">
        <p className="text-4xl opacity-40">📭</p>
        <p className="text-white/50 text-sm font-medium">No inquiries yet. Submissions from the site and popup will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-black tracking-[0.35em] text-gold/80 uppercase mb-2">Lead relay</p>
          <h3 className="text-2xl font-serif text-white">Inquiry inbox</h3>
          <p className="text-xs text-white/40 mt-1">{items.length} total</p>
        </div>
      </div>

      <div className="grid gap-4">
        {items.map((row) => (
          <article
            key={row.id}
            className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent p-6 lg:p-8 hover:border-gold/20 transition-colors"
          >
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <h4 className="text-lg font-serif text-white tracking-tight">{row.name}</h4>
                <a href={`mailto:${row.email}`} className="text-sm text-gold/90 hover:text-gold transition-colors">
                  {row.email}
                </a>
                {row.phone ? (
                  <p className="text-xs text-white/45 mt-1">{row.phone}</p>
                ) : null}
              </div>
              <div className="text-right text-[10px] font-bold tracking-widest uppercase text-white/35 space-y-1">
                <span className="inline-block px-3 py-1 rounded-full bg-gold/10 text-gold border border-gold/20">
                  {row.source || 'contact'}
                </span>
                <p className="pt-2">
                  {row.createdAt
                    ? new Date(row.createdAt).toLocaleString(undefined, {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })
                    : '—'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-4 text-[11px]">
              {row.type ? (
                <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-white/70">
                  Interest: {row.type}
                </span>
              ) : null}
              {row.budget ? (
                <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-white/70">
                  Budget: {row.budget}
                </span>
              ) : null}
            </div>

            <p className="text-sm text-white/55 leading-relaxed whitespace-pre-wrap border-t border-white/5 pt-4">
              {row.message}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
};

export default InquiriesView;
