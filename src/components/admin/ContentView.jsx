import React, { useState } from 'react';
import { INITIAL_DATA, DEFAULT_HERO_GLOBE_MARKERS } from '../../context/initialData';

const mergeHeroFromCms = (h) => ({
  ...INITIAL_DATA.hero,
  ...(h || {}),
  floatBadge1: { ...INITIAL_DATA.hero.floatBadge1, ...(h?.floatBadge1 || {}) },
  floatBadge2: { ...INITIAL_DATA.hero.floatBadge2, ...(h?.floatBadge2 || {}) },
  locations: Array.isArray(h?.locations) && h.locations.length ? [...h.locations] : [...INITIAL_DATA.hero.locations],
  globeMarkers:
    Array.isArray(h?.globeMarkers) && h.globeMarkers.length ? [...h.globeMarkers] : [...DEFAULT_HERO_GLOBE_MARKERS],
});

const ContentView = ({ data, updateData }) => {
  const [hero, setHero] = useState(() => mergeHeroFromCms(data?.hero));
  const [about, setAbout] = useState(data.about || {});
  const [stats, setStats] = useState(data.stats || []);
  const [contact, setContact] = useState(data.contact || { info: [] });
  const [footer, setFooter] = useState(data.footer || { socials: [], links: {} });
  const [navbar, setNavbar] = useState(data.navbar || { links: [] });
  const [services, setServices] = useState(data.services || { items: [] });
  const [testimonials, setTestimonials] = useState(data.testimonials || { items: [] });
  const [properties, setProperties] = useState(data.properties || { items: [] });
  const [offers, setOffers] = useState(data.offers || { items: [] });

  const handleSave = () => {
    updateData({ hero, about, stats, contact, footer, navbar, services, testimonials, properties, offers });
    alert('Site content successfully synchronized with the global grid.');
  };

  const updateStat = (index, field, value) => {
    const newStats = [...stats];
    newStats[index] = { ...newStats[index], [field]: value };
    setStats(newStats);
  };

  const updateContactInfo = (index, field, value) => {
    const newInfo = [...contact.info];
    newInfo[index] = { ...newInfo[index], [field]: value };
    setContact({ ...contact, info: newInfo });
  };

  const updateNavbarLink = (index, field, value) => {
    const newLinks = [...navbar.links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setNavbar({ ...navbar, links: newLinks });
  };

  const updateServiceItem = (index, field, value) => {
    const newItems = [...services.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setServices({ ...services, items: newItems });
  };

  const updateTestimonialItem = (index, field, value) => {
    const newItems = [...testimonials.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setTestimonials({ ...testimonials, items: newItems });
  };

  const updateOfferItem = (index, field, value) => {
    const newItems = [...offers.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setOffers({ ...offers, items: newItems });
  };

  const markersList = Array.isArray(hero.globeMarkers) && hero.globeMarkers.length ? hero.globeMarkers : DEFAULT_HERO_GLOBE_MARKERS;

  const updateGlobeMarker = (index, field, value) => {
    const next = markersList.map((m, i) => (i === index ? { ...m, [field]: value } : m));
    setHero({ ...hero, globeMarkers: next });
  };

  const addGlobeMarker = () => {
    setHero({
      ...hero,
      globeMarkers: [...markersList, { lat: 25.2, lng: 55.27, size: 0.06, name: 'New marker' }],
    });
  };

  const removeGlobeMarker = (index) => {
    const next = markersList.filter((_, i) => i !== index);
    setHero({ ...hero, globeMarkers: next.length ? next : [...DEFAULT_HERO_GLOBE_MARKERS] });
  };

  return (
    <div className="space-y-12 w-full max-w-7xl mx-auto pb-36">
      <div className="px-2">
        <h3 className="text-4xl font-serif font-bold tracking-tight mb-2">Core Content Architect</h3>
        <p className="text-[11px] text-gray-500 font-black uppercase tracking-[0.4em] opacity-60">Global Synchronization Hub</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Hero Section */}
        <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group lg:col-span-2">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="text-6xl">🔭</span>
          </div>
          <h3 className="text-2xl font-serif font-bold mb-10 text-gold tracking-tight border-b border-white/5 pb-6 flex items-center gap-4">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse"></span>
            Hero & globe (home)
          </h3>
          <p className="text-[11px] text-gray-500 mb-8 leading-relaxed max-w-3xl">
            Edit headline copy, location pills under the CTAs, the prime listing card on the globe, and map pins (latitude, longitude, size 0.04–0.2). The live site reads this from the same CMS document as the rest of Site Architect.
          </p>
          <div className="space-y-8">
            <div>
              <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-3">Section Label</label>
              <input value={hero.label || ''} onChange={(e) => setHero({ ...hero, label: e.target.value })} className="admin-input w-full" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-3">Title Line 1</label>
                <input value={hero.titleLine1 || ''} onChange={(e) => setHero({ ...hero, titleLine1: e.target.value })} className="admin-input w-full" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-3">Title Line 2 (Shimmer)</label>
                <input value={hero.titleLine2 || ''} onChange={(e) => setHero({ ...hero, titleLine2: e.target.value })} className="admin-input w-full text-gold" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-3">Title Line 3</label>
                <input value={hero.titleLine3 || ''} onChange={(e) => setHero({ ...hero, titleLine3: e.target.value })} className="admin-input w-full" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-3">Title Line 4</label>
                <input value={hero.titleLine4 || ''} onChange={(e) => setHero({ ...hero, titleLine4: e.target.value })} className="admin-input w-full" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-3">Hero Narrative</label>
              <textarea rows="4" value={hero.description || ''} onChange={(e) => setHero({ ...hero, description: e.target.value })} className="admin-input w-full leading-relaxed" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-3">Primary CTA</label>
                <input value={hero.ctaPrimary || ''} onChange={(e) => setHero({ ...hero, ctaPrimary: e.target.value })} className="admin-input w-full" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-3">Secondary CTA</label>
                <input value={hero.ctaSecondary || ''} onChange={(e) => setHero({ ...hero, ctaSecondary: e.target.value })} className="admin-input w-full" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-3">Location pills (one per line)</label>
              <textarea
                rows={5}
                value={(hero.locations || []).join('\n')}
                onChange={(e) =>
                  setHero({
                    ...hero,
                    locations: e.target.value
                      .split('\n')
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
                placeholder={'Palm Jumeirah\nEmirates Hills'}
                className="admin-input w-full leading-relaxed font-mono text-sm"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border border-white/10 rounded-2xl p-6 bg-white/[0.02]">
              <div className="space-y-4">
                <p className="text-[10px] font-black text-gold uppercase tracking-[0.3em]">Prime listing (globe card)</p>
                <div>
                  <label className="block text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-2">Badge label</label>
                  <input
                    value={hero.floatBadge1?.label || ''}
                    onChange={(e) => setHero({ ...hero, floatBadge1: { ...hero.floatBadge1, label: e.target.value } })}
                    className="admin-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-2">Price / value line</label>
                  <input
                    value={hero.floatBadge1?.value || ''}
                    onChange={(e) => setHero({ ...hero, floatBadge1: { ...hero.floatBadge1, value: e.target.value } })}
                    className="admin-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-2">Sub-label (e.g. plot name)</label>
                  <input
                    value={hero.floatBadge1?.subLabel || ''}
                    onChange={(e) => setHero({ ...hero, floatBadge1: { ...hero.floatBadge1, subLabel: e.target.value } })}
                    className="admin-input w-full"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-[10px] font-black text-gold uppercase tracking-[0.3em]">Second badge</p>
                <div>
                  <label className="block text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-2">Label</label>
                  <input
                    value={hero.floatBadge2?.label || ''}
                    onChange={(e) => setHero({ ...hero, floatBadge2: { ...hero.floatBadge2, label: e.target.value } })}
                    className="admin-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-2">Sub-label</label>
                  <input
                    value={hero.floatBadge2?.subLabel || ''}
                    onChange={(e) => setHero({ ...hero, floatBadge2: { ...hero.floatBadge2, subLabel: e.target.value } })}
                    className="admin-input w-full"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-3">Bottom label (under globe)</label>
              <input value={hero.bottomLabel || ''} onChange={(e) => setHero({ ...hero, bottomLabel: e.target.value })} className="admin-input w-full" />
            </div>
            <div className="border border-white/10 rounded-2xl p-6 bg-white/[0.02] space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="text-[10px] font-black text-gold uppercase tracking-[0.3em]">Globe markers (lat, lng, size)</p>
                <button type="button" onClick={addGlobeMarker} className="text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg bg-gold/15 text-gold border border-gold/30 hover:bg-gold/25">
                  Add pin
                </button>
              </div>
              <div className="space-y-3 max-h-[320px] overflow-y-auto custom-scrollbar pr-1">
                {markersList.map((m, i) => (
                  <div key={i} className="grid grid-cols-12 gap-2 items-end bg-black/30 rounded-xl p-3 border border-white/5">
                    <div className="col-span-12 sm:col-span-3">
                      <label className="block text-[8px] text-gray-600 uppercase mb-1">Name</label>
                      <input value={m.name || ''} onChange={(e) => updateGlobeMarker(i, 'name', e.target.value)} className="admin-input w-full py-2 text-xs" />
                    </div>
                    <div className="col-span-4 sm:col-span-2">
                      <label className="block text-[8px] text-gray-600 uppercase mb-1">Lat</label>
                      <input type="number" step="any" value={m.lat} onChange={(e) => updateGlobeMarker(i, 'lat', e.target.value)} className="admin-input w-full py-2 text-xs" />
                    </div>
                    <div className="col-span-4 sm:col-span-2">
                      <label className="block text-[8px] text-gray-600 uppercase mb-1">Lng</label>
                      <input type="number" step="any" value={m.lng} onChange={(e) => updateGlobeMarker(i, 'lng', e.target.value)} className="admin-input w-full py-2 text-xs" />
                    </div>
                    <div className="col-span-4 sm:col-span-2">
                      <label className="block text-[8px] text-gray-600 uppercase mb-1">Size</label>
                      <input type="number" step="0.01" value={m.size} onChange={(e) => updateGlobeMarker(i, 'size', e.target.value)} className="admin-input w-full py-2 text-xs" />
                    </div>
                    <div className="col-span-12 sm:col-span-3 flex justify-end pb-1">
                      <button type="button" onClick={() => removeGlobeMarker(i)} className="text-[9px] font-black uppercase text-red-400/80 hover:text-red-300">
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="text-6xl">🏛️</span>
          </div>
          <h3 className="text-2xl font-serif font-bold mb-10 text-gold tracking-tight border-b border-white/5 pb-6 flex items-center gap-4">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse"></span>
            Legacy Engine
          </h3>
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-3">Title Line 1</label>
                <input value={about.titleLine1} onChange={e => setAbout({...about, titleLine1: e.target.value})} className="admin-input w-full" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-3">Establishment Year</label>
                <input value={about.estYear} onChange={e => setAbout({...about, estYear: e.target.value})} className="admin-input w-full font-mono" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-3">Establishment Location</label>
                <input value={about.estLocation} onChange={e => setAbout({...about, estLocation: e.target.value})} className="admin-input w-full" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-3">Mission Narrative</label>
              <textarea rows="4" value={about.description1} onChange={e => setAbout({...about, description1: e.target.value})} className="admin-input w-full leading-relaxed" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-3">Legacy Quote</label>
              <textarea rows="2" value={about.quote} onChange={e => setAbout({...about, quote: e.target.value})} className="admin-input w-full italic" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-3">Team Size</label>
              <input value={about.teamSize} onChange={e => setAbout({...about, teamSize: e.target.value})} className="admin-input w-full" />
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="text-6xl">📊</span>
          </div>
          <h3 className="text-2xl font-serif font-bold mb-10 text-gold tracking-tight border-b border-white/5 pb-6 flex items-center gap-4">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse"></span>
            Quant Metrics
          </h3>
          <div className="space-y-6">
            {stats.map((stat, i) => (
              <div key={i} className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-2">Value</label>
                    <input type="number" step="0.1" value={stat.value} onChange={e => updateStat(i, 'value', parseFloat(e.target.value))} className="admin-input w-full py-2 px-4" />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-2">Suffix</label>
                    <input value={stat.suffix} onChange={e => updateStat(i, 'suffix', e.target.value)} className="admin-input w-full py-2 px-4" />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-2">Label</label>
                    <input value={stat.label} onChange={e => updateStat(i, 'label', e.target.value)} className="admin-input w-full py-2 px-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="text-6xl">📞</span>
          </div>
          <h3 className="text-2xl font-serif font-bold mb-10 text-gold tracking-tight border-b border-white/5 pb-6 flex items-center gap-4">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse"></span>
            Communication Node
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-3">Contact Title</label>
              <input value={contact.titleLine1} onChange={e => setContact({...contact, titleLine1: e.target.value})} className="admin-input w-full" />
            </div>
            {contact.info.map((info, i) => (
              <div key={i} className="p-6 bg-white/5 rounded-2xl border border-white/5 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-2">{info.label}</label>
                  <input value={info.value} onChange={e => updateContactInfo(i, 'value', e.target.value)} className="admin-input w-full py-2 px-4" />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-2">Icon ID</label>
                  <input value={info.icon} onChange={e => updateContactInfo(i, 'icon', e.target.value)} className="admin-input w-full py-2 px-4 font-mono" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navbar Section */}
        <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="text-6xl">🧭</span>
          </div>
          <h3 className="text-2xl font-serif font-bold mb-10 text-gold tracking-tight border-b border-white/5 pb-6 flex items-center gap-4">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse"></span>
            Navigation Grid
          </h3>
          <div className="space-y-6">
            {navbar.links.map((link, i) => (
              <div key={i} className="p-6 bg-white/5 rounded-2xl border border-white/5 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-2">Label</label>
                  <input value={link.label} onChange={e => updateNavbarLink(i, 'label', e.target.value)} className="admin-input w-full py-2 px-4" />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-2">Href</label>
                  <input value={link.href} onChange={e => updateNavbarLink(i, 'href', e.target.value)} className="admin-input w-full py-2 px-4 font-mono" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Description */}
        <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="text-6xl">📜</span>
          </div>
          <h3 className="text-2xl font-serif font-bold mb-10 text-gold tracking-tight border-b border-white/5 pb-6 flex items-center gap-4">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse"></span>
            Footer Registry
          </h3>
          <div className="space-y-8">
            <div>
              <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-3">Footer Narrative</label>
              <textarea rows="4" value={footer.description} onChange={e => setFooter({...footer, description: e.target.value})} className="admin-input w-full leading-relaxed" />
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="text-6xl">🛠️</span>
          </div>
          <h3 className="text-2xl font-serif font-bold mb-10 text-gold tracking-tight border-b border-white/5 pb-6 flex items-center gap-4">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse"></span>
            Services Architecture
          </h3>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-2">Label</label>
                <input value={services.label} onChange={e => setServices({...services, label: e.target.value})} className="admin-input w-full" />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-2">Title Line 1</label>
                <input value={services.titleLine1} onChange={e => setServices({...services, titleLine1: e.target.value})} className="admin-input w-full" />
              </div>
            </div>
            {services.items.map((item, i) => (
              <div key={i} className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                <div>
                  <label className="block text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-2">Service Title</label>
                  <input value={item.title} onChange={e => updateServiceItem(i, 'title', e.target.value)} className="admin-input w-full py-2 px-4" />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-2">Description</label>
                  <textarea value={item.desc} onChange={e => updateServiceItem(i, 'desc', e.target.value)} className="admin-input w-full py-2 px-4" rows="2" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="text-6xl">💬</span>
          </div>
          <h3 className="text-2xl font-serif font-bold mb-10 text-gold tracking-tight border-b border-white/5 pb-6 flex items-center gap-4">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse"></span>
            Client Testimonials
          </h3>
          <div className="space-y-6">
            {testimonials.items.map((t, i) => (
              <div key={i} className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-2">Name</label>
                    <input value={t.name} onChange={e => updateTestimonialItem(i, 'name', e.target.value)} className="admin-input w-full py-2 px-4" />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-2">Title</label>
                    <input value={t.title} onChange={e => updateTestimonialItem(i, 'title', e.target.value)} className="admin-input w-full py-2 px-4" />
                  </div>
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-2">Quote</label>
                  <textarea value={t.quote} onChange={e => updateTestimonialItem(i, 'quote', e.target.value)} className="admin-input w-full py-2 px-4" rows="3" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Properties Section Labels */}
        <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="text-6xl">🏗️</span>
          </div>
          <h3 className="text-2xl font-serif font-bold mb-10 text-gold tracking-tight border-b border-white/5 pb-6 flex items-center gap-4">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse"></span>
            Properties Section
          </h3>
          <div className="space-y-8">
            <div>
              <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-3">Section Label</label>
              <input value={properties.label} onChange={e => setProperties({...properties, label: e.target.value})} className="admin-input w-full" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-3">Title Line 1</label>
                <input value={properties.titleLine1} onChange={e => setProperties({...properties, titleLine1: e.target.value})} className="admin-input w-full" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-3">Title Line 2 (Shimmer)</label>
                <input value={properties.titleLine2} onChange={e => setProperties({...properties, titleLine2: e.target.value})} className="admin-input w-full text-gold" />
              </div>
            </div>
          </div>
        </div>

        {/* Offers Section */}
        <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="text-6xl">🎁</span>
          </div>
          <h3 className="text-2xl font-serif font-bold mb-10 text-gold tracking-tight border-b border-white/5 pb-6 flex items-center gap-4">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse"></span>
            Special Offers Relay
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-3">Offers Label</label>
              <input value={offers.label} onChange={e => setOffers({...offers, label: e.target.value})} className="admin-input w-full" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-3">Ticker direction (main site banner)</label>
              <select
                value={offers.marqueeScroll || 'default'}
                onChange={(e) => setOffers({ ...offers, marqueeScroll: e.target.value })}
                className="admin-input w-full py-3"
              >
                <option value="default">Right → Left (standard)</option>
                <option value="reverse">Left → Right</option>
              </select>
              <p className="text-[10px] text-gray-500 mt-2 leading-relaxed">
                Controls the horizontal scroll direction of the special-offers strip under the navigation.
              </p>
            </div>
            {offers.items.map((offer, i) => (
              <div key={i} className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-[9px] font-bold text-gray-600 uppercase tracking-widest">Offer #{i+1}</label>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" checked={offer.isVisible} onChange={e => updateOfferItem(i, 'isVisible', e.target.checked)} />
                    <span className="text-[10px] text-gray-500 uppercase font-bold">Visible</span>
                  </div>
                </div>
                <input value={offer.title} onChange={e => updateOfferItem(i, 'title', e.target.value)} className="admin-input w-full py-2 px-4" placeholder="Title" />
                <textarea value={offer.description} onChange={e => updateOfferItem(i, 'description', e.target.value)} className="admin-input w-full py-2 px-4" rows="2" placeholder="Description" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-[100] pointer-events-none pb-[max(1rem,env(safe-area-inset-bottom))] pt-10 px-4 bg-gradient-to-t from-black via-black/95 to-transparent border-t border-white/[0.06]">
        <div className="pointer-events-auto max-w-7xl mx-auto flex justify-center">
          <button
            type="button"
            onClick={handleSave}
            className="group relative flex flex-col items-center gap-1 bg-gradient-to-b from-gold to-[#a88430] text-black font-black py-5 px-16 sm:px-24 rounded-2xl overflow-hidden transition-all shadow-[0_-4px_40px_rgba(201,168,76,0.35),0_12px_40px_rgba(0,0,0,0.5)] ring-1 ring-gold/40 hover:ring-gold/70 hover:shadow-[0_-6px_48px_rgba(201,168,76,0.45)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]"
          >
            <span className="relative z-10 tracking-[0.45em] uppercase text-[11px]">Deploy global update</span>
            <span className="relative z-10 text-[9px] font-bold tracking-[0.2em] uppercase text-black/60 group-hover:text-black/75">
              Publish all changes on this page to the live site
            </span>
            <div className="absolute inset-0 bg-white/25 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentView;
