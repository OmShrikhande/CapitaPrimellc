import { useCMS } from '../context/useCMS';
import { INITIAL_DATA } from '../context/initialData';

const REPEAT_COUNT = 4;

const OfferItems = ({ offers, hidden = false, groupId }) => (
  <div
    className="flex min-w-max shrink-0 items-center gap-10 px-5 sm:gap-14 sm:px-7"
    aria-hidden={hidden}
  >
    {offers.map((offer, index) => (
      <div
        key={`${groupId}-${offer.id ?? offer.title}-${index}`}
        className="flex shrink-0 items-center gap-4"
      >
        <span className="text-[10px] font-black uppercase tracking-[0.38em] text-gold">
          Special Offer
        </span>
        <span className="text-sm font-bold tracking-[0.02em] text-white">
          {offer.title}
        </span>
        <span className="text-xs text-white/35">-</span>
        <span className="text-xs italic text-white/65">
          {offer.description}
        </span>
        <span className="pl-6 text-gold/35">+</span>
      </div>
    ))}
  </div>
);

const Offers = () => {
  const { data, loading } = useCMS();
  const sourceOffers = Array.isArray(data.offers) ? data.offers : INITIAL_DATA.offers;
  const activeOffers = sourceOffers.filter((offer) => offer.isVisible);
  const offersToRender = activeOffers.length > 0 ? activeOffers : (
    Array.isArray(data.offers) ? [] : INITIAL_DATA.offers.filter((offer) => offer.isVisible)
  );
  const repeatedOffers = Array.from({ length: REPEAT_COUNT }, () => offersToRender).flat();

  if (loading) return null;
  if (offersToRender.length === 0) return null;

  return (
    <section
      className="relative z-40 overflow-hidden border-y border-gold/20 bg-[linear-gradient(90deg,rgba(201,168,76,0.18),rgba(201,168,76,0.08),rgba(201,168,76,0.18))] py-4"
      aria-label="Special offers"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,168,76,0.09),transparent_70%)]" />
      <div className="marquee-container relative flex w-full overflow-hidden">
        <div className="ticker-wrap flex items-center">
          <OfferItems offers={repeatedOffers} groupId="primary" />
          <OfferItems offers={repeatedOffers} hidden groupId="secondary" />
        </div>
      </div>
    </section>
  );
};

export default Offers;
