import React, { useState, useEffect } from 'react';
import Globe from './Globe';
import StatCard from './StatCard';
import FeedItem from './FeedItem';
import { adminAPI } from '../../context/api';

const formatFeedTime = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
};

const DashboardView = ({ data, setActiveTab, resetData }) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [live, setLive] = useState({
    loading: true,
    assetsTotal: null,
    assetsVisible: null,
    inquiriesTotal: null,
    inquirySample: [],
  });

  const getLength = (val) => {
    if (!val) return 0;
    if (Array.isArray(val)) return val.length;
    if (val.items && Array.isArray(val.items)) return val.items.length;
    return 0;
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [assetsRes, inqRes] = await Promise.all([
          adminAPI.assets.getAllAuthenticated(),
          adminAPI.inquiries.list(),
        ]);
        if (cancelled) return;
        const rows = assetsRes.success && Array.isArray(assetsRes.data) ? assetsRes.data : [];
        const inqRows = inqRes.success && Array.isArray(inqRes.data) ? inqRes.data : [];
        setLive({
          loading: false,
          assetsTotal: rows.length,
          assetsVisible: rows.filter((r) => r.isVisible !== false).length,
          inquiriesTotal: inqRows.length,
          inquirySample: inqRows.slice(0, 14),
        });
      } catch {
        if (!cancelled) {
          setLive({
            loading: false,
            assetsTotal: null,
            assetsVisible: null,
            inquiriesTotal: null,
            inquirySample: [],
          });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleResetConfirm = async () => {
    try {
      setIsResetting(true);
      const result = await resetData();
      if (result.success) {
        setShowResetConfirm(false);
        console.log('All data has been reset to default state');
      }
    } catch (error) {
      console.error('Reset failed:', error);
    } finally {
      setIsResetting(false);
    }
  };

  const visibleOffers = Array.isArray(data?.offers?.items)
    ? data.offers.items.filter((o) => o.isVisible).length
    : 0;

  const serviceCount = getLength(data.services);
  const testimonialCount = getLength(data.testimonials);
  const featuredProps = getLength(data.properties);

  const listPct =
    live.assetsTotal > 0
      ? Math.min(100, Math.round((live.assetsVisible / live.assetsTotal) * 100))
    : 0;

  const statDisplay = (n) => {
    if (live.loading) return '…';
    if (n == null) return '—';
    return n;
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-700 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-10">
        <StatCard
          label="Inventory assets"
          value={statDisplay(live.assetsTotal)}
          color="gold"
          icon="📦"
          trend={live.loading ? '…' : `${live.assetsVisible ?? 0} visible`}
        />
        <StatCard
          label="Inquiries"
          value={statDisplay(live.inquiriesTotal)}
          color="gold"
          icon="✉️"
          trend="Inbox"
        />
        <StatCard
          label="Service nodes"
          value={serviceCount}
          color="gold"
          icon="⚡"
          trend={`${testimonialCount} testimonials`}
        />
        <StatCard
          label="Offers live"
          value={visibleOffers}
          color="gold"
          icon="🏷️"
          trend={`${featuredProps} featured CMS`}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        <div className="xl:col-span-8 bg-white/[0.02] border border-white/5 rounded-[3rem] p-12 relative overflow-hidden group hover:border-gold/20 transition-all shadow-2xl min-h-[600px]">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute top-0 right-0 p-12 z-20 text-right">
            <h3 className="text-4xl font-serif font-bold text-white mb-2 tracking-tighter uppercase">Nexus Network</h3>
            <p className="text-gold/60 text-[11px] font-black tracking-[0.4em] uppercase opacity-80">Operations overview</p>
            <div className="mt-10 flex justify-end items-center gap-4">
              <span className="text-[11px] text-gray-600 font-black uppercase tracking-widest">Firebase + Stripe</span>
              <div className="w-3 h-3 bg-gold rounded-full animate-pulse shadow-[0_0_15px_#c5a059]" />
            </div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center scale-[1.2] pointer-events-none group-hover:scale-[1.25] transition-transform duration-1000 z-0">
            <Globe />
          </div>

          <div className="absolute bottom-12 left-12 right-12 flex flex-col sm:flex-row justify-between items-center gap-8 z-20">
            <div className="flex gap-6 w-full sm:w-auto">
              <div className="bg-black/90 backdrop-blur-3xl border border-white/10 p-8 rounded-3xl shadow-2xl flex-1 sm:flex-none min-w-[180px]">
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-3 opacity-60">Inquiries total</p>
                <p className="text-3xl font-bold font-mono tracking-tighter text-white">{statDisplay(live.inquiriesTotal)}</p>
              </div>
              <div className="bg-black/90 backdrop-blur-3xl border border-white/10 p-8 rounded-3xl shadow-2xl flex-1 sm:flex-none min-w-[180px]">
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-3 opacity-60">Visible listings</p>
                <p className="text-3xl font-bold font-mono tracking-tighter text-gold">{statDisplay(live.assetsVisible)}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('assets')}
              className="w-full sm:w-auto bg-gold text-black px-12 py-6 rounded-2xl text-[11px] font-black tracking-[0.4em] uppercase hover:bg-white transition-all shadow-2xl font-sans"
            >
              Asset inventory
            </button>
          </div>
        </div>

        <div className="xl:col-span-4 bg-white/[0.02] border border-white/5 rounded-[3rem] p-12 flex flex-col h-full hover:border-gold/20 transition-all shadow-2xl">
          <div className="flex justify-between items-center mb-12">
            <h3 className="text-2xl font-serif font-bold tracking-tight text-white">Inquiry feed</h3>
            <button
              type="button"
              onClick={() => setActiveTab('inquiries')}
              className="text-[10px] font-black text-gold bg-gold/5 px-4 py-2 rounded-full tracking-widest uppercase border border-gold/10 hover:bg-gold/10 transition-colors"
            >
              Open inbox
            </button>
          </div>

          <div className="flex-1 space-y-10 font-mono text-[11px] opacity-80 text-gray-300 min-h-[280px]">
            {live.loading ? (
              <p className="text-gray-500">Loading activity…</p>
            ) : live.inquirySample.length === 0 ? (
              <p className="text-gray-500 leading-relaxed">No inquiries yet. Submissions from the site contact form and pop-up will appear here.</p>
            ) : (
              live.inquirySample.map((row) => (
                <FeedItem
                  key={row.id}
                  time={formatFeedTime(row.createdAt)}
                  msg={`${row.name || row.email || 'Lead'} — ${String(row.message || row.type || '').slice(0, 96)}${String(row.message || '').length > 96 ? '…' : ''}`}
                  type="info"
                />
              ))
            )}
          </div>

          <div className="mt-12 pt-10 border-t border-white/5">
            <div className="flex justify-between items-center mb-6">
              <span className="text-[11px] text-gray-500 font-black uppercase tracking-widest opacity-60">Visible share of inventory</span>
              <span className="text-sm text-gold font-mono font-bold">{live.loading ? '…' : `${listPct}%`}</span>
            </div>
            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gold h-full rounded-full shadow-[0_0_20px_#c5a059] transition-all duration-500"
                style={{ width: `${listPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-black border border-white/10 rounded-3xl p-8 max-w-md w-full mx-4 animate-in scale-in duration-300 shadow-2xl">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-2xl font-serif font-bold text-white mb-4">Reset All Data?</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                This action will reset all changes and restore the system to its default state. This cannot be undone.
              </p>
            </div>

            <div className="space-y-4">
              <button
                type="button"
                onClick={handleResetConfirm}
                disabled={isResetting}
                className="w-full bg-red-500/10 hover:bg-red-500/20 disabled:bg-red-500/5 text-red-500 font-bold py-3 px-4 rounded-xl transition-all border border-red-500/20 text-[11px] tracking-widest uppercase"
              >
                {isResetting ? 'Resetting...' : 'Confirm Reset'}
              </button>
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                disabled={isResetting}
                className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-3 px-4 rounded-xl transition-all border border-white/10 text-[11px] tracking-widest uppercase"
              >
                Cancel
              </button>
            </div>

            <p className="text-[9px] text-gray-600 text-center mt-6 tracking-widest uppercase">All content will be restored to default state</p>
          </div>
        </div>
      )}

      <div className="flex justify-center mt-12">
        <button
          type="button"
          onClick={() => setShowResetConfirm(true)}
          className="bg-red-500/10 hover:bg-red-500/20 text-red-500/80 hover:text-red-500 px-8 py-4 rounded-2xl text-[11px] font-black tracking-[0.4em] uppercase border border-red-500/20 hover:border-red-500/40 transition-all shadow-lg"
        >
          System Reset
        </button>
      </div>
    </div>
  );
};

export default DashboardView;
