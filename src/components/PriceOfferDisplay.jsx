/**
 * “Was / now” pricing: optional higher compare-at amount shown struck through in red (offer style).
 * saleDisplay: pre-formatted string (e.g. from toLocaleString or CMS text).
 * compareAtNumeric: number (AED) — list / original price before discount.
 */
export function parseMoneyNumber(value) {
  if (value == null || value === '') return NaN;
  if (typeof value === 'number') return Number.isFinite(value) ? value : NaN;
  const n = parseFloat(String(value).replace(/,/g, '').trim());
  return Number.isFinite(n) ? n : NaN;
}

export function getOfferMeta(saleDisplay, compareAtNumeric) {
  const saleNum = parseMoneyNumber(saleDisplay);
  const cmp = compareAtNumeric != null ? Number(compareAtNumeric) : NaN;
  const hasOffer = Number.isFinite(cmp) && Number.isFinite(saleNum) && cmp > saleNum;
  const pct = hasOffer ? Math.min(99, Math.max(1, Math.round((1 - saleNum / cmp) * 100))) : null;
  return { hasOffer, pct, saleNum, compareAt: hasOffer ? cmp : null };
}

export function PriceOfferDisplay({
  label = 'Asking Price',
  saleDisplay,
  compareAtNumeric,
  variant = 'card',
  align = 'right',
}) {
  const { hasOffer, pct, compareAt: cmp } = getOfferMeta(saleDisplay, compareAtNumeric);

  const isHero = variant === 'hero';
  const isModal = variant === 'modal';

  const labelSize = isHero ? '10px' : isModal ? '12px' : '9px';
  const saleFont = isHero ? 'clamp(28px, 4vw, 40px)' : isModal ? '28px' : '20px';
  const strikeFont = isHero ? '18px' : isModal ? '16px' : '13px';
  const pillSize = isHero ? '11px' : '9px';

  const textAlign = align === 'left' ? 'left' : 'right';

  return (
    <div style={{ textAlign }}>
      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: labelSize,
          color: 'rgba(255,255,255,0.35)',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          marginBottom: hasOffer ? 6 : 2,
        }}
      >
        {hasOffer ? 'Limited offer' : label}
      </p>
      {hasOffer ? (
        <div
          style={{
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: align === 'left' ? 'flex-start' : 'flex-end',
            gap: 6,
          }}
        >
          <span
            style={{
              display: 'inline-block',
              padding: '5px 12px',
              borderRadius: 6,
              fontFamily: "'Inter', sans-serif",
              fontSize: pillSize,
              fontWeight: 800,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              background: 'linear-gradient(135deg, rgba(185, 28, 28, 0.45) 0%, rgba(201, 168, 76, 0.2) 100%)',
              border: '1px solid rgba(248, 113, 113, 0.55)',
              color: '#fecaca',
              boxShadow: '0 4px 24px rgba(220, 38, 38, 0.15)',
            }}
          >
            {pct}% off
          </span>
          <div
            style={{
              position: 'relative',
              fontFamily: "'Inter', sans-serif",
              fontSize: strikeFont,
              fontWeight: 500,
              color: 'rgba(255,255,255,0.42)',
              letterSpacing: '0.04em',
            }}
          >
            <span
              style={{
                textDecoration: 'line-through',
                textDecorationColor: 'rgba(239, 68, 68, 0.95)',
                textDecorationThickness: 2,
                textUnderlineOffset: 4,
              }}
            >
              AED {cmp.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </div>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: saleFont,
              fontWeight: 600,
              color: '#C9A84C',
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            <span
              style={{
                fontSize: isHero ? '14px' : isModal ? '14px' : '11px',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                color: 'rgba(201,168,76,0.75)',
                marginRight: 6,
              }}
            >
              AED
            </span>
            {saleDisplay}
          </p>
        </div>
      ) : (
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: saleFont,
            fontWeight: 600,
            color: '#C9A84C',
            lineHeight: 1.1,
            margin: 0,
          }}
        >
          <span
            style={{
              fontSize: isHero ? '14px' : isModal ? '14px' : '11px',
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
              color: 'rgba(201,168,76,0.7)',
              marginRight: 3,
            }}
          >
            AED
          </span>
          {saleDisplay}
        </p>
      )}
    </div>
  );
}
