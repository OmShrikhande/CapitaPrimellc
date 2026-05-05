import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useCMS } from '../context/useCMS';
import { createAssetViewingCheckout, fetchPublicAsset, getImageURL } from '../context/api';
import { useTheme } from '../context/ThemeContext';
import Navbar from './Navbar';
import Footer from './Footer';
import { PriceOfferDisplay } from './PriceOfferDisplay';
import { getStoredUnlockSession, rememberUnlockSession } from '../utils/assetUnlockStorage';

const formatAed = (n) => {
  if (n == null || n === '') return '—';
  const num = Number(n);
  if (!Number.isFinite(num)) return String(n);
  return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
};

const LISTING_DETAIL_ROWS = [
  ['marketingHeadline', 'Headline'],
  ['grossFloorAreaSqFt', 'GFA (SQ.FT.)'],
  ['floorAreaRatio', 'FAR'],
  ['totalBuiltUpAreaSqFt', 'Total built-up (SQ.FT.)'],
  ['buildingHeightDescription', 'Building height'],
  ['totalUnitsApproved', 'Units approved'],
  ['usageType', 'Usage'],
  ['jvInventorySplit', 'JV split'],
  ['jvUpfrontNote', 'Contribution / upfront'],
  ['commissionPercent', 'Commission'],
];

const LISTING_LONG_BLOCKS = [
  ['drawingsStatusNotes', 'Design & drawings'],
  ['titleDeedsFeesNotes', 'Title deed & fees'],
  ['paymentTermsNotes', 'Payment terms'],
  ['advantagesNotes', 'Advantages'],
  ['investmentNarrative', 'Investment narrative'],
  ['jvTermsRich', 'JV terms & full brief'],
];

const readAssetLongField = (asset, key) => {
  const chunks = asset?.[`${key}Chunks`];
  if (Array.isArray(chunks) && chunks.length > 0) {
    return chunks.map((part) => String(part || '')).join('');
  }
  const raw = asset?.[key];
  return raw == null ? '' : String(raw);
};

const PropertyDetails = ({ id, unlockSession }) => {
  const { data } = useCMS();
  const { theme } = useTheme();
  const cmsProperty = data?.properties?.items?.find((p) => p.id === id);

  const [apiAsset, setApiAsset] = useState(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [payLoading, setPayLoading] = useState(false);
  const [payError, setPayError] = useState('');

  const [activeIdx, setActiveIdx] = useState(0);
  const [fullViewImage, setFullViewImage] = useState(null);

  const effectiveUnlock = useMemo(() => {
    const fromProp = unlockSession != null && String(unlockSession).trim() !== '' ? String(unlockSession).trim() : null;
    return fromProp || getStoredUnlockSession(id);
  }, [id, unlockSession]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveIdx(0);
  }, [id, effectiveUnlock]);

  useEffect(() => {
    if (cmsProperty || !id) return;

    let cancelled = false;
    const load = async () => {
      setApiLoading(true);
      setApiError('');
      try {
        const res = await fetchPublicAsset(id, effectiveUnlock);
        if (cancelled) return;
        if (res.success && res.data) {
          setApiAsset(res.data);
          if (res.data.coverImageIndex != null) {
            setActiveIdx(Number(res.data.coverImageIndex) || 0);
          }
          if (res.data.locked === false) {
            const sid = res.data.unlockSessionId || effectiveUnlock;
            if (sid) rememberUnlockSession(id, sid);
          }
        } else {
          setApiError('Listing not found.');
        }
      } catch (e) {
        if (!cancelled) setApiError(e?.message || 'Failed to load listing.');
      } finally {
        if (!cancelled) setApiLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [id, effectiveUnlock, cmsProperty]);

  const handlePayToView = useCallback(async () => {
    if (!id) return;
    setPayLoading(true);
    setPayError('');
    try {
      const res = await createAssetViewingCheckout(id, { source: 'property-details' });
      const url = res?.data?.url;
      if (!url) throw new Error('Checkout could not be started.');
      window.location.assign(url);
    } catch (e) {
      setPayError(e?.message || 'Payment could not be started.');
      setPayLoading(false);
    }
  }, [id]);

  const resolveImg = (src) => getImageURL(src) || src;

  if (!id) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <h2 className="text-3xl font-serif">Property Not Found</h2>
      </div>
    );
  }

  if (cmsProperty) {
    const gallery = cmsProperty.gallery?.length ? cmsProperty.gallery : ['/flaw.png'];
    const resolvedGallery = gallery.map((g) => resolveImg(g));
    const activeImage = resolvedGallery[activeIdx] || resolvedGallery[0];

    return (
      <div className="min-h-screen" style={{ backgroundColor: theme.secondary, color: theme.accent }}>
        <Navbar />

        <main className="pt-32 pb-20 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-6">
              <div className="aspect-[9/16] rounded-3xl overflow-hidden border border-white/10 relative group cursor-pointer" onClick={() => setFullViewImage(activeImage)}>
                <img
                  src={activeImage}
                  alt={cmsProperty.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="eager"
                  decoding="async"
                  referrerPolicy="no-referrer-when-downgrade"
                  onContextMenu={(e) => e.preventDefault()}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                <div className="absolute top-6 left-6">
                  <span
                    className="px-4 py-2 bg-gold text-[10px] font-black tracking-widest uppercase rounded-full"
                    style={{ color: theme.secondary }}
                  >
                    {cmsProperty.badge}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                {gallery.map((img, idx) => (
                  <button
                    key={`${img}-${idx}`}
                    type="button"
                    onClick={() => setActiveIdx(idx)}
                    className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all ${activeIdx === idx ? 'border-gold' : 'border-transparent opacity-50 hover:opacity-100'}`}
                  >
                    <img
                      src={resolvedGallery[idx]}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer-when-downgrade"
                      onContextMenu={(e) => e.preventDefault()}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-10">
              <div>
                <div className="flex items-center gap-3 text-gold text-[11px] font-black tracking-[0.4em] uppercase mb-4">
                  <span className="w-8 h-[1px] bg-gold" />
                  {cmsProperty.category} Asset
                </div>
                <h1 className="text-5xl lg:text-6xl font-serif font-bold leading-tight mb-6">{cmsProperty.title}</h1>
                <p className="text-xl text-white/60 flex items-center gap-3">
                  <span className="text-gold">📍</span> {cmsProperty.location}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8 py-10 border-y border-white/10">
                <div className="text-left">
                  <PriceOfferDisplay
                    label="Asking Price"
                    saleDisplay={cmsProperty.price}
                    compareAtNumeric={cmsProperty.compareAtPrice}
                    variant="hero"
                    align="left"
                  />
                </div>
                <div>
                  <p className="text-[10px] text-white/30 font-black tracking-widest uppercase mb-2">Total Area</p>
                  <p className="text-3xl font-serif font-bold">
                    {cmsProperty.area} <span className="text-sm font-sans text-white/40">SQ.FT</span>
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                <h3 className="text-xl font-bold tracking-tight" style={{ color: theme.primary }}>
                  Technical Specifications
                </h3>
                <div className="grid grid-cols-2 gap-y-6">
                  {[
                    ['Zoning', cmsProperty.specs?.zoning],
                    ['Permit', cmsProperty.specs?.permit],
                    ['Coverage', cmsProperty.specs?.coverage],
                    ['Ownership', cmsProperty.specs?.ownership],
                  ].map(([label, val]) => (
                    <div key={label} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gold">🏗️</div>
                      <div>
                        <p className="text-[9px] text-white/30 font-black tracking-widest uppercase">{label}</p>
                        <p className="text-sm font-bold">{val || 'N/A'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-10">
                <a
                  href="#contact"
                  className="flex-1 bg-gold font-black py-6 rounded-2xl hover:bg-white transition-all tracking-[0.2em] uppercase text-xs shadow-2xl shadow-gold/20 text-center"
                  style={{ color: theme.secondary }}
                >
                  Book Consultation
                </a>
              </div>
            </div>
          </div>

          <div className="mt-32 grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2 space-y-10">
              <h2 className="text-3xl font-serif font-bold" style={{ color: theme.primary }}>
                Investment Narrative
              </h2>
              <p className="text-white/60 leading-relaxed text-lg">
                This exceptional {cmsProperty.category.toLowerCase()} plot in {cmsProperty.location} offers a rare
                opportunity for discerning investors.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {cmsProperty.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-4 p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <span className="text-gold">✦</span>
                    <span className="text-sm font-bold tracking-tight text-white/80">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gold/5 border border-gold/10 p-10 rounded-[3rem] space-y-8">
              <h3 className="text-xl font-bold tracking-tight text-gold">Ready for Next Steps?</h3>
              <p className="text-sm text-white/50 leading-relaxed">
                Our consultants are ready to provide detailed feasibility studies and site visits for this asset.
              </p>
              <a
                href="#contact"
                className="block w-full bg-white text-black font-black py-4 rounded-xl hover:bg-gold transition-all tracking-widest uppercase text-[10px] text-center"
              >
                Enquire for Asset
              </a>
            </div>
          </div>
        </main>

        <Footer />

        {fullViewImage && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50" onClick={() => setFullViewImage(null)}>
            <img src={fullViewImage} alt="" className="max-w-full max-h-full object-contain" onContextMenu={(e) => e.preventDefault()} />
          </div>
        )}
      </div>
    );
  }

  if (apiLoading && !apiAsset) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <p className="font-serif text-xl text-white/70">Loading listing…</p>
      </div>
    );
  }

  if (apiError && !apiAsset) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white gap-4">
        <h2 className="text-3xl font-serif">Listing Not Found</h2>
        <p className="text-white/50">{apiError}</p>
        <a href="#listings" className="text-gold underline">
          Back to listings
        </a>
      </div>
    );
  }

  if (!apiAsset) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <h2 className="text-3xl font-serif">Property Not Found</h2>
      </div>
    );
  }

  const locked = apiAsset.locked === true;
  const gallery = apiAsset.imageUrls?.length ? apiAsset.imageUrls : ['/flaw.png'];
  const resolvedGallery = gallery.map((g) => resolveImg(g));
  const activeImage = resolvedGallery[activeIdx] || resolvedGallery[0];
  const category = apiAsset.propertyType || apiAsset.type || 'Property';
  const featureList = Array.isArray(apiAsset.features) ? apiAsset.features : [];

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.secondary, color: theme.accent }}>
      <Navbar />

      <main className="pt-32 pb-20 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto">
        {locked ? (
          <div className="max-w-2xl mx-auto text-center space-y-8 py-12">
            <p className="text-gold text-[11px] font-black tracking-[0.35em] uppercase">Premium listing</p>
            <h1 className="text-4xl lg:text-5xl font-serif font-bold text-white">{apiAsset.name}</h1>
            <p className="text-white/60 flex items-center justify-center gap-2">
              <span className="text-gold">📍</span> {apiAsset.location || 'Dubai, UAE'}
            </p>
            <div className="rounded-3xl border border-gold/25 bg-gold/5 p-10 space-y-4">
              {apiAsset.price != null || apiAsset.compareAtPrice != null ? (
                <div className="pb-2 border-b border-white/10 mb-2 text-left">
                  <PriceOfferDisplay
                    label="Indicative pricing"
                    saleDisplay={
                      apiAsset.price != null && apiAsset.price !== ''
                        ? formatAed(apiAsset.price)
                        : 'Contact'
                    }
                    compareAtNumeric={apiAsset.compareAtPrice}
                    variant="modal"
                    align="left"
                  />
                </div>
              ) : null}
              <p className="text-white/70 text-sm leading-relaxed">
                Full specifications and media for this listing are available after a one-time access payment. The amount
                is set by your administrator and charged securely through Stripe on our server.
              </p>
              <p className="text-2xl font-serif text-gold">
                AED {formatAed(apiAsset.viewingFeeAed)}{' '}
                <span className="text-xs font-sans text-white/40 uppercase tracking-widest">access fee</span>
              </p>
              {payError ? (
                <p className="text-sm text-red-300" role="alert">
                  {payError}
                </p>
              ) : null}
              <button
                type="button"
                onClick={handlePayToView}
                disabled={payLoading}
                className="w-full bg-gold font-black py-5 rounded-2xl hover:bg-white transition-all tracking-[0.2em] uppercase text-xs disabled:opacity-70"
                style={{ color: theme.secondary }}
              >
                {payLoading ? 'Redirecting to secure checkout…' : 'Pay & unlock full details'}
              </button>
            </div>
            <a href="#listings" className="inline-block text-white/45 hover:text-gold text-sm">
              ← Back to all listings
            </a>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div className="space-y-6">
                <div className="aspect-[9/16] rounded-3xl overflow-hidden border border-white/10 relative group cursor-pointer" onClick={() => setFullViewImage(activeImage)}>
                  <img
                    src={activeImage}
                    alt={apiAsset.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="eager"
                    decoding="async"
                    referrerPolicy="no-referrer-when-downgrade"
                    onContextMenu={(e) => e.preventDefault()}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                  <div className="absolute top-6 left-6 flex gap-2 flex-wrap">
                    <span
                      className="px-4 py-2 bg-gold text-[10px] font-black tracking-widest uppercase rounded-full"
                      style={{ color: theme.secondary }}
                    >
                      {apiAsset.listingType || 'LISTING'}
                    </span>
                    {apiAsset.isSpecial ? (
                      <span className="px-4 py-2 bg-white/10 text-gold text-[10px] font-black tracking-widest uppercase rounded-full border border-gold/40">
                        Special
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  {gallery.map((img, idx) => (
                    <button
                      key={`${img}-${idx}`}
                      type="button"
                      onClick={() => setActiveIdx(idx)}
                      className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all ${activeIdx === idx ? 'border-gold' : 'border-transparent opacity-50 hover:opacity-100'}`}
                    >
                      <img
                        src={resolvedGallery[idx]}
                        alt=""
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer-when-downgrade"
                        onContextMenu={(e) => e.preventDefault()}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-10">
                <div>
                  <div className="flex items-center gap-3 text-gold text-[11px] font-black tracking-[0.4em] uppercase mb-4">
                    <span className="w-8 h-[1px] bg-gold" />
                    {category} Asset
                  </div>
                  <h1 className="text-5xl lg:text-6xl font-serif font-bold leading-tight mb-6">{apiAsset.name}</h1>
                  <p className="text-xl text-white/60 flex items-center gap-3">
                    <span className="text-gold">📍</span> {apiAsset.location || 'Dubai, UAE'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-8 py-10 border-y border-white/10">
                  <div className="text-left">
                    <PriceOfferDisplay
                      label="Asking Price"
                      saleDisplay={
                        apiAsset.price != null && apiAsset.price !== ''
                          ? formatAed(apiAsset.price)
                          : 'Contact'
                      }
                      compareAtNumeric={apiAsset.compareAtPrice}
                      variant="hero"
                      align="left"
                    />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/30 font-black tracking-widest uppercase mb-2">Total Area</p>
                    <p className="text-3xl font-serif font-bold">
                      {apiAsset.area != null ? apiAsset.area : '—'}{' '}
                      <span className="text-sm font-sans text-white/40">SQ.FT</span>
                    </p>
                  </div>
                </div>

                {apiAsset.description ? (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold tracking-tight" style={{ color: theme.primary }}>
                      Description
                    </h3>
                    <p className="text-white/60 leading-relaxed whitespace-pre-wrap">{apiAsset.description}</p>
                  </div>
                ) : null}

                {LISTING_DETAIL_ROWS.some(([k]) => readAssetLongField(apiAsset, k).trim()) ? (
                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <h3 className="text-xl font-bold tracking-tight" style={{ color: theme.primary }}>
                      Listing brief
                    </h3>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                      {LISTING_DETAIL_ROWS.map(([key, label]) => {
                        const v = readAssetLongField(apiAsset, key);
                        if (String(v).trim() === '') return null;
                        return (
                          <div key={key}>
                            <dt className="text-[10px] text-white/35 font-black uppercase tracking-widest mb-1">{label}</dt>
                            <dd className="text-white/80 font-medium whitespace-pre-wrap">{String(v)}</dd>
                          </div>
                        );
                      })}
                    </dl>
                    {apiAsset.mapsUrl ? (
                      <a
                        href={apiAsset.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-gold text-sm font-bold hover:underline"
                      >
                        Open map ↗
                      </a>
                    ) : null}
                  </div>
                ) : apiAsset.mapsUrl ? (
                  <div className="pt-4 border-t border-white/10">
                    <a
                      href={apiAsset.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-gold text-sm font-bold hover:underline"
                    >
                      Open map ↗
                    </a>
                  </div>
                ) : null}

                {LISTING_LONG_BLOCKS.some(([k]) => readAssetLongField(apiAsset, k).trim()) ? (
                  <div className="space-y-6 pt-4 border-t border-white/10">
                    {LISTING_LONG_BLOCKS.map(([key, title]) => {
                      const v = readAssetLongField(apiAsset, key);
                      if (String(v).trim() === '') return null;
                      return (
                        <div key={key}>
                          <h4 className="text-sm font-black text-gold/90 uppercase tracking-widest mb-2">{title}</h4>
                          <p className="text-white/65 leading-relaxed whitespace-pre-wrap text-sm">{String(v)}</p>
                        </div>
                      );
                    })}
                  </div>
                ) : null}

                <div className="flex flex-wrap gap-4 pt-6">
                  <a
                    href="#contact"
                    className="flex-1 min-w-[200px] bg-gold font-black py-6 rounded-2xl hover:bg-white transition-all tracking-[0.2em] uppercase text-xs text-center"
                    style={{ color: theme.secondary }}
                  >
                    Book Consultation
                  </a>
                </div>
              </div>
            </div>

            {featureList.length > 0 ? (
              <div className="mt-24">
                <h2 className="text-3xl font-serif font-bold mb-8" style={{ color: theme.primary }}>
                  Highlights
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {featureList.map((f, i) => (
                    <div key={i} className="flex items-center gap-4 p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                      <span className="text-gold">✦</span>
                      <span className="text-sm font-bold tracking-tight text-white/80">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </>
        )}
      </main>

      <Footer />

      {fullViewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50" onClick={() => setFullViewImage(null)}>
          <img src={fullViewImage} alt="" className="max-w-full max-h-full object-contain" onContextMenu={(e) => e.preventDefault()} />
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;
