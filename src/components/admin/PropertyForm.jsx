import React, { useState, useRef, useEffect } from 'react';

const PropertyForm = ({ isOpen, onClose, editingIndex, property, onSubmit, onCancel }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollContainerRef = useRef(null);
  const [formData, setFormData] = useState({
    title: '', location: '', area: '', price: '', category: 'Residential', badge: 'NEW', features: '', isVisible: true, gallery: '', specs: { zoning: '', permit: '', coverage: '', ownership: '' }
  });

  // Handle scroll detection for border animation
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      const progress = scrollTop / (scrollHeight - clientHeight);
      setScrollProgress(progress);
    }
  };

  // Initialize form data when component mounts or when editing
  React.useEffect(() => {
    if (property) {
      setFormData({
        ...property,
        features: Array.isArray(property.features) ? property.features.join(', ') : (property.features || ''),
        gallery: Array.isArray(property.gallery) ? property.gallery.join(', ') : (property.gallery || ''),
        specs: property.specs || { zoning: '', permit: '', coverage: '', ownership: '' }
      });
    } else {
      resetFormData();
    }
  }, [property, isOpen]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [isOpen]);

  const resetFormData = () => {
    setFormData({
      title: '', location: '', area: '', price: '', category: 'Residential', badge: 'NEW', features: '', isVisible: true, gallery: '',
      specs: { zoning: '', permit: '', coverage: '', ownership: '' }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const propertyData = {
      ...formData,
      features: (formData.features || '').split(',').map(s => s.trim()).filter(s => s !== ''),
      gallery: (formData.gallery || '').split(',').map(s => s.trim()).filter(s => s !== ''),
      gradient: formData.category === 'Commercial' ? 'linear-gradient(135deg, #1a0a00 0%, #2a1200 40%, #140800 100%)' : 'linear-gradient(135deg, #0a1f0a 0%, #0d2b12 40%, #091a09 100%)',
      accent: formData.category === 'Commercial' ? '#4a2000' : '#1a4d1a'
    };

    onSubmit(propertyData);
    resetFormData();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    if (imageFiles.length > 0) {
      const urls = imageFiles.map(file => URL.createObjectURL(file));
      const currentGallery = formData.gallery ? formData.gallery.split(',').map(s => s.trim()).filter(s => s !== '') : [];
      const newGallery = [...currentGallery, ...urls];
      setFormData({...formData, gallery: newGallery.join(', ')});
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    if (imageFiles.length > 0) {
      const urls = imageFiles.map(file => URL.createObjectURL(file));
      const currentGallery = formData.gallery ? formData.gallery.split(',').map(s => s.trim()).filter(s => s !== '') : [];
      const newGallery = [...currentGallery, ...urls];
      setFormData({...formData, gallery: newGallery.join(', ')});
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] flex items-center justify-center p-8">
      <div className="bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-12 pr-16 w-full max-w-3xl h-[90vh] relative shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Border Scrollbar */}
        <div className="absolute inset-0 rounded-[3rem] pointer-events-none">
          <div
            className="absolute right-0 w-2 bg-gradient-to-b from-gold via-gold/50 to-gold/20 rounded-r-[3rem] transition-all duration-300 ease-out"
            style={{
              height: '25%',
              top: `${scrollProgress * 75}%`,
              boxShadow: `0 0 ${20 + scrollProgress * 30}px rgba(201, 168, 76, ${0.3 + scrollProgress * 0.7})`
            }}
          />
          {/* Animated border particles */}
          <div
            className="absolute right-0 w-2 h-2 bg-gold rounded-full transition-all duration-500"
            style={{
              top: `${scrollProgress * 100}%`,
              transform: `translateY(${scrollProgress * 10}px) scale(${1 + scrollProgress})`,
              opacity: scrollProgress > 0 ? 1 : 0
            }}
          />
          {/* Additional crazy border effects */}
          <div
            className="absolute right-0 w-0.5 h-8 bg-gradient-to-b from-transparent via-gold to-transparent transition-all duration-300"
            style={{
              top: `${(scrollProgress * 100) - 10}%`,
              opacity: scrollProgress > 0.1 ? 0.8 : 0,
              transform: `rotate(${scrollProgress * 360}deg)`
            }}
          />
          <div
            className="absolute right-0 w-0.5 h-6 bg-gradient-to-b from-gold/50 to-transparent transition-all duration-200"
            style={{
              top: `${(scrollProgress * 100) + 15}%`,
              opacity: scrollProgress > 0.2 ? 0.6 : 0,
              transform: `rotate(${-scrollProgress * 180}deg)`
            }}
          />
        </div>
        <div className="absolute top-0 right-4 p-12">
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors text-2xl">✕</button>
        </div>
        <h3 className="text-4xl font-serif font-bold mb-10 tracking-tight">{editingIndex !== null ? 'Modify Asset' : 'Register New Asset'}</h3>
        <div ref={scrollContainerRef} className="h-[calc(90vh-200px)] overflow-y-auto scrollbar-hide">
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-10">
          <div className="col-span-2">
            <label className="block text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3 opacity-60">Asset Title</label>
            <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 focus:border-gold/50 outline-none text-white font-bold transition-all" placeholder="Enter property name..." />
          </div>
          <div>
            <label className="block text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3 opacity-60">Location Cluster</label>
            <input required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 focus:border-gold/50 outline-none text-white font-bold transition-all" placeholder="e.g. Dubai Hills" />
          </div>
          <div>
            <label className="block text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3 opacity-60">Asset Category</label>
            <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 focus:border-gold/50 outline-none text-white font-bold transition-all appearance-none cursor-pointer">
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Mixed Use">Mixed Use</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3 opacity-60">Valuation (AED)</label>
            <input required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 focus:border-gold/50 outline-none text-white font-bold transition-all font-mono" placeholder="2,500,000" />
          </div>
          <div>
            <label className="block text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3 opacity-60">Spatial Area (SQ.FT)</label>
            <input required value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 focus:border-gold/50 outline-none text-white font-bold transition-all font-mono" placeholder="5,400" />
          </div>
          <div className="col-span-2">
            <label className="block text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3 opacity-60">Gallery (Comma Delimited URLs, Drag & Drop, or Upload)</label>
            <div className="flex gap-4">
              <div className="w-[70%]">
                <div
                  className={`relative w-full bg-white/5 border border-dashed rounded-2xl px-8 py-5 transition-all ${
                    isDragging ? 'border-gold bg-gold/5' : 'border-white/10'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    value={formData.gallery}
                    onChange={e => setFormData({...formData, gallery: e.target.value})}
                    className="w-full bg-transparent outline-none text-white font-bold placeholder:text-gray-400"
                    placeholder={isDragging ? "Drop images here..." : "Add path from your system or drag images here"}
                  />
                  {isDragging && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gold/10 rounded-2xl border-2 border-dashed border-gold">
                      <span className="text-gold font-bold text-lg">Drop images here</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="w-[30%] flex items-end">
                <label className="w-full">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="w-full bg-gold text-black px-6 py-5 rounded-2xl text-[11px] font-black tracking-[0.2em] uppercase hover:bg-white transition-all cursor-pointer text-center shadow-2xl scale-105 active:scale-95">
                    📁 Upload Images
                  </div>
                </label>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3 opacity-60">Zoning</label>
            <input value={formData.specs.zoning} onChange={e => setFormData({...formData, specs: {...formData.specs, zoning: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 focus:border-gold/50 outline-none text-white font-bold transition-all" placeholder="Residential/Commercial" />
          </div>
          <div>
            <label className="block text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3 opacity-60">Permit</label>
            <input value={formData.specs.permit} onChange={e => setFormData({...formData, specs: {...formData.specs, permit: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 focus:border-gold/50 outline-none text-white font-bold transition-all" placeholder="G+2" />
          </div>
          <div>
            <label className="block text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3 opacity-60">Coverage</label>
            <input value={formData.specs.coverage} onChange={e => setFormData({...formData, specs: {...formData.specs, coverage: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 focus:border-gold/50 outline-none text-white font-bold transition-all" placeholder="65%" />
          </div>
          <div>
            <label className="block text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3 opacity-60">Ownership</label>
            <input value={formData.specs.ownership} onChange={e => setFormData({...formData, specs: {...formData.specs, ownership: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 focus:border-gold/50 outline-none text-white font-bold transition-all" placeholder="Freehold" />
          </div>
          <div className="col-span-2 flex items-center gap-4">
            <input type="checkbox" id="isVisible" checked={formData.isVisible} onChange={e => setFormData({...formData, isVisible: e.target.checked})} className="w-6 h-6 rounded bg-white/5 border-white/10 text-gold focus:ring-gold" />
            <label htmlFor="isVisible" className="text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] opacity-60">Visible on Site</label>
          </div>
          <div className="col-span-2 flex gap-6 mt-6">
            <button type="submit" className="flex-1 bg-gold text-black font-black py-5 rounded-2xl hover:bg-white transition-all shadow-2xl tracking-[0.2em] uppercase text-xs">
              {editingIndex !== null ? 'Sync Changes' : 'Initialize Asset'}
            </button>
            <button type="button" onClick={onCancel} className="flex-1 bg-white/5 text-white font-black py-5 rounded-2xl hover:bg-white/10 transition-all tracking-[0.2em] uppercase text-xs border border-white/10">
              Abort
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};

export default PropertyForm;