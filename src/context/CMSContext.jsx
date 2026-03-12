import React, { useState } from 'react';
import { INITIAL_DATA } from './initialData';
import { CMSContext } from './CMSContextCore';

export const CMSProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('capita_cms_data');
    let parsed = saved ? JSON.parse(saved) : INITIAL_DATA;
    
    // Migration: ensure IDs and visibility
    if (parsed.properties) {
      parsed.properties = parsed.properties.map((p, i) => ({
        ...p,
        id: p.id || `p-${Date.now()}-${i}`,
        isVisible: p.isVisible !== undefined ? p.isVisible : true,
        gallery: p.gallery || [],
        specs: p.specs || { zoning: '', permit: '', coverage: '', ownership: '' }
      }));
    }
    if (parsed.offers) {
      parsed.offers = parsed.offers.map((o, i) => ({
        ...o,
        id: o.id || `o-${Date.now()}-${i}`,
        isVisible: o.isVisible !== undefined ? o.isVisible : true
      }));
    } else {
      parsed.offers = INITIAL_DATA.offers;
    }
    if (!parsed.theme) {
      parsed.theme = INITIAL_DATA.theme;
    }
    
    return parsed;
  });

  const updateData = (newData) => {
    const updated = { ...data, ...newData };
    setData(updated);
    localStorage.setItem('capita_cms_data', JSON.stringify(updated));
  };

  const addProperty = (property) => {
    const updatedProperties = [property, ...data.properties];
    updateData({ properties: updatedProperties });
  };

  const updateProperty = (index, property) => {
    const updatedProperties = [...data.properties];
    updatedProperties[index] = property;
    updateData({ properties: updatedProperties });
  };

  const deleteProperty = (index) => {
    const updatedProperties = data.properties.filter((_, i) => i !== index);
    updateData({ properties: updatedProperties });
  };

  const addOffer = (offer) => {
    const updatedOffers = [offer, ...data.offers];
    updateData({ offers: updatedOffers });
  };

  const updateOffer = (index, offer) => {
    const updatedOffers = [...data.offers];
    updatedOffers[index] = offer;
    updateData({ offers: updatedOffers });
  };

  const deleteOffer = (index) => {
    const updatedOffers = data.offers.filter((_, i) => i !== index);
    updateData({ offers: updatedOffers });
  };

  const updateTheme = (newTheme) => {
    updateData({ theme: { ...data.theme, ...newTheme } });
  };

  return (
    <CMSContext.Provider value={{ 
      data, 
      updateData, 
      addProperty, 
      updateProperty, 
      deleteProperty,
      addOffer,
      updateOffer,
      deleteOffer,
      updateTheme
    }}>
      {children}
    </CMSContext.Provider>
  );
};
