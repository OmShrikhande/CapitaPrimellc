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
  const { data } = useCMS();
  const activeOffers = (data.offers || []).filter(o => o.isVisible);

  if (loading) return null;
  if (offersToRender.length === 0) return null;

  return (
    <div className="bg-gold/10 border-y border-gold/20 py-4 overflow-hidden relative w-full">
      <div className="flex animate-marquee whitespace-nowrap items-center" style={{justifyContent:'space-around'}}>
        <marquee behavior="scroll" direction="left" scrollamount="3">
        {activeOffers.map((offer, i) => (
          <div key={i} className="flex items-center mx-10">
            <span className="text-gold text-[10px] font-black tracking-[0.4em] uppercase mr-4">Special Offer:</span>
            <span className="text-white text-sm font-bold tracking-tight mr-4">{offer.title}</span>
            <span className="text-white/40 text-xs mr-4">—</span>
            <span className="text-white/60 text-xs italic">{offer.description}</span>
            <span className="ml-10 text-gold opacity-20">✦</span>
          </div>
        ))}
        {/* Duplicate for seamless loop */}
        {activeOffers.map((offer, i) => (
          <div key={`dup-${i}`} className="flex items-center mx-10">
            <span className="text-gold text-[10px] font-black tracking-[0.4em] uppercase mr-4">Special Offer:</span>
            <span className="text-white text-sm font-bold tracking-tight mr-4">{offer.title}</span>
            <span className="text-white/40 text-xs mr-4">—</span>
            <span className="text-white/60 text-xs italic">{offer.description}</span>
            <span className="ml-10 text-gold opacity-20">✦</span>
          </div>
        ))}
        </marquee>
      </div>
    </section>
  );
};

export default Offers;
