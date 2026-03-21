import { useCMS } from '../context/useCMS';
import { INITIAL_DATA } from '../context/initialData';

const REPEAT_COUNT = 4;

const OfferItems = ({ offers, hidden = false, groupId, label }) => (
  <div className="flex min-w-max shrink-0 items-center gap-10 px-5 sm:gap-14 sm:px-7" aria-hidden={hidden}>
    {offers.map((offer, index) => (
      <div key={`${groupId}-${offer.id ?? offer.title}-${index}`} className="flex shrink-0 items-center gap-4">
        <span className="text-[10px] font-black uppercase tracking-[0.38em] text-gold">{label}</span>
        <span className="text-sm font-bold tracking-[0.02em] text-white">{offer.title}</span>
        <span className="text-xs text-white/35">-</span>
        <span className="text-xs italic text-white/65">{offer.description}</span>
        <span className="pl-6 text-gold/35">+</span>
      </div>
    ))}
  </div>
);

const Offers = () => {
  const { data, loading } = useCMS();
  const offersData = data?.offers || INITIAL_DATA.offers;
  const sourceOffers = Array.isArray(offersData.items) ? offersData.items : INITIAL_DATA.offers.items;
  const activeOffers = sourceOffers.filter((offer) => offer.isVisible);
  const offersToRender = activeOffers.length > 0 ? activeOffers : (Array.isArray(offersData.items) ? [] : INITIAL_DATA.offers.items.filter((offer) => offer.isVisible));
  const repeatedOffers = Array.from({ length: REPEAT_COUNT }, () => offersToRender).flat();

  if (loading || offersToRender.length === 0) return null;

  return (
    <section
      className="relative z-40 overflow-hidden border-y border-gold/20 bg-[linear-gradient(90deg,rgba(201,168,76,0.18),rgba(201,168,76,0.08),rgba(201,168,76,0.18))] py-4"
      aria-label="Special offers"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,168,76,0.09),transparent_70%)]" />
      <div className="marquee-container relative flex w-full overflow-hidden">
        <div className="ticker-wrap flex items-center">
          <OfferItems offers={repeatedOffers} groupId="primary" label={offersData.label || 'Special Offer'} />
          <OfferItems offers={repeatedOffers} hidden groupId="secondary" label={offersData.label || 'Special Offer'} />
        </div>
      </div>
    </section>
  );
};

export default Offers;
