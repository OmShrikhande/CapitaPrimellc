const ITEMS = [
  'Palm Jumeirah', 'Emirates Hills', 'Dubai Creek Harbour', 'Mohammed Bin Rashid City',
  'Business Bay', 'Jumeirah Bay Island', 'Downtown Dubai', 'Dubai Hills Estate',
  'Emaar South', 'Dubai Marina', 'Al Barari', 'The World Islands',
];

const MarqueeItem = ({ label }) => (
  <span className="flex items-center gap-6 px-8">
    <span
      style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: '11px',
        fontWeight: 500,
        letterSpacing: '0.25em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.45)',
      }}
    >
      {label}
    </span>
    <span style={{ color: '#C9A84C', fontSize: '8px' }}>◆</span>
  </span>
);

const Marquee = () => (
  <div
    className="marquee-container overflow-hidden py-5"
    style={{
      background: '#0C0C0C',
      borderTop: '1px solid rgba(201,168,76,0.12)',
      borderBottom: '1px solid rgba(201,168,76,0.12)',
    }}
  >
    <div className="ticker-wrap">
      {[...ITEMS, ...ITEMS].map((item, i) => (
        <MarqueeItem key={i} label={item} />
      ))}
    </div>
  </div>
);

export default Marquee;
