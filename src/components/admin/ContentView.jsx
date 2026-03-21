import React, { useState } from 'react';

const ContentView = ({ data, updateData }) => {
  const [hero, setHero] = useState(data.hero || {});
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

  return (
    <div className="space-y-12 w-full max-w-7xl mx-auto pb-20">
      <div className="px-2">
        <h3 className="text-4xl font-serif font-bold tracking-tight mb-2">Core Content Architect</h3>
        <p className="text-[11px] text-gray-500 font-black uppercase tracking-[0.4em] opacity-60">Global Synchronization Hub</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Hero Section */}
        <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="text-6xl">🔭</span>
          </div>
          <h3 className="text-2xl font-serif font-bold mb-10 text-gold tracking-tight border-b border-white/5 pb-6 flex items-center gap-4">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse"></span>
            Hero Nexus
          </h3>
          <div className="space-y-8">
            <div>
              <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-3">Section Label</label>
              <input value={hero.label} onChange={e => setHero({...hero, label: e.target.value})} className="admin-input w-full" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-3">Title Line 1</label>
                <input value={hero.titleLine1} onChange={e => setHero({...hero, titleLine1: e.target.value})} className="admin-input w-full" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-3">Title Line 2 (Shimmer)</label>
                <input value={hero.titleLine2} onChange={e => setHero({...hero, titleLine2: e.target.value})} className="admin-input w-full text-gold" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-3">Hero Narrative</label>
              <textarea rows="4" value={hero.description} onChange={e => setHero({...hero, description: e.target.value})} className="admin-input w-full leading-relaxed" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-3">Bottom Label</label>
              <input value={hero.bottomLabel} onChange={e => setHero({...hero, bottomLabel: e.target.value})} className="admin-input w-full" />
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

      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100]">
        <button 
          onClick={handleSave} 
          className="group relative bg-gold text-black font-black py-6 px-24 rounded-2xl overflow-hidden transition-all shadow-[0_20px_50px_rgba(201,168,76,0.3)] hover:shadow-[0_25px_60px_rgba(201,168,76,0.5)] hover:scale-105 active:scale-95"
        >
          <span className="relative z-10 tracking-[0.5em] uppercase text-[11px]">Deploy Global Update</span>
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
        </button>
      </div>
    </div>
  );
};

export default ContentView;
