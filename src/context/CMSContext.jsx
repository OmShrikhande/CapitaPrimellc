import React, { useState, useEffect } from 'react';
import { INITIAL_DATA } from './initialData';
import { CMSContext } from './CMSContextCore';
import { adminAPI } from './api';

const mergeCMSData = (incoming = {}) => ({
  ...INITIAL_DATA,
  ...incoming,
  theme: {
    ...INITIAL_DATA.theme,
    ...(incoming.theme || {}),
  },
  hero: {
    ...INITIAL_DATA.hero,
    ...(incoming.hero || {}),
  },
  about: {
    ...INITIAL_DATA.about,
    ...(incoming.about || {}),
  },
  popupSettings: {
    ...INITIAL_DATA.popupSettings,
    ...(incoming.popupSettings || {}),
  },
  offers: Array.isArray(incoming.offers) ? incoming.offers : INITIAL_DATA.offers,
  stats: Array.isArray(incoming.stats) ? incoming.stats : INITIAL_DATA.stats,
  properties: Array.isArray(incoming.properties) ? incoming.properties : INITIAL_DATA.properties,
  services: Array.isArray(incoming.services) ? incoming.services : INITIAL_DATA.services,
  testimonials: Array.isArray(incoming.testimonials) ? incoming.testimonials : INITIAL_DATA.testimonials,
});

export const CMSProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('capita_cms_data');
    return saved ? mergeCMSData(JSON.parse(saved)) : INITIAL_DATA;
  });
  const [loading, setLoading] = useState(true);

  // Fetch content from backend on mount
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await adminAPI.content.get();
        if (response.success && response.data) {
          const mergedData = mergeCMSData(response.data);
          setData(mergedData);
          localStorage.setItem('capita_cms_data', JSON.stringify(mergedData));
        }
      } catch (error) {
        console.error('Failed to fetch content from backend:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const updateData = async (newData) => {
    try {
      // Optimistic update
      const updated = mergeCMSData({ ...data, ...newData });
      setData(updated);
      localStorage.setItem('capita_cms_data', JSON.stringify(updated));

      // Sync with backend if authenticated
      if (adminAPI.isAuthenticated()) {
        await adminAPI.content.update(newData);
      }
    } catch (error) {
      console.error('Failed to update content:', error);
      // Revert if needed or show error
    }
  };

  const addProperty = async (property) => {
    try {
      if (adminAPI.isAuthenticated()) {
        const response = await adminAPI.content.updateArrayItem('properties', 'add', property);
        if (response.success) {
          setData(prev => ({ ...prev, properties: response.data }));
          localStorage.setItem('capita_cms_data', JSON.stringify({ ...data, properties: response.data }));
        }
      } else {
        const updatedProperties = [property, ...data.properties];
        updateData({ properties: updatedProperties });
      }
    } catch (error) {
      console.error('Failed to add property:', error);
    }
  };

  const updateProperty = async (index, property) => {
    try {
      if (adminAPI.isAuthenticated()) {
        const response = await adminAPI.content.updateArrayItem('properties', index, property);
        if (response.success) {
          setData(prev => ({ ...prev, properties: response.data }));
          localStorage.setItem('capita_cms_data', JSON.stringify({ ...data, properties: response.data }));
        }
      } else {
        const updatedProperties = [...data.properties];
        updatedProperties[index] = property;
        updateData({ properties: updatedProperties });
      }
    } catch (error) {
      console.error('Failed to update property:', error);
    }
  };

  const deleteProperty = async (index) => {
    try {
      if (adminAPI.isAuthenticated()) {
        const response = await adminAPI.content.deleteArrayItem('properties', index);
        if (response.success) {
          setData(prev => ({ ...prev, properties: response.data }));
          localStorage.setItem('capita_cms_data', JSON.stringify({ ...data, properties: response.data }));
        }
      } else {
        const updatedProperties = data.properties.filter((_, i) => i !== index);
        updateData({ properties: updatedProperties });
      }
    } catch (error) {
      console.error('Failed to delete property:', error);
    }
  };

  const addOffer = async (offer) => {
    try {
      if (adminAPI.isAuthenticated()) {
        const response = await adminAPI.content.updateArrayItem('offers', 'add', offer);
        if (response.success) {
          setData(prev => ({ ...prev, offers: response.data }));
          localStorage.setItem('capita_cms_data', JSON.stringify(mergeCMSData({ ...data, offers: response.data })));
        }
      } else {
        const updatedOffers = [offer, ...data.offers];
        updateData({ offers: updatedOffers });
      }
    } catch (error) {
      console.error('Failed to add offer:', error);
    }
  };

  const updateOffer = async (index, offer) => {
    try {
      if (adminAPI.isAuthenticated()) {
        const response = await adminAPI.content.updateArrayItem('offers', index, offer);
        if (response.success) {
          setData(prev => ({ ...prev, offers: response.data }));
          localStorage.setItem('capita_cms_data', JSON.stringify(mergeCMSData({ ...data, offers: response.data })));
        }
      } else {
        const updatedOffers = [...data.offers];
        updatedOffers[index] = offer;
        updateData({ offers: updatedOffers });
      }
    } catch (error) {
      console.error('Failed to update offer:', error);
    }
  };

  const deleteOffer = async (index) => {
    try {
      if (adminAPI.isAuthenticated()) {
        const response = await adminAPI.content.deleteArrayItem('offers', index);
        if (response.success) {
          setData(prev => ({ ...prev, offers: response.data }));
          localStorage.setItem('capita_cms_data', JSON.stringify(mergeCMSData({ ...data, offers: response.data })));
        }
      } else {
        const updatedOffers = data.offers.filter((_, i) => i !== index);
        updateData({ offers: updatedOffers });
      }
    } catch (error) {
      console.error('Failed to delete offer:', error);
    }
  };

  const addService = async (service) => {
    try {
      if (adminAPI.isAuthenticated()) {
        const response = await adminAPI.content.updateArrayItem('services', 'add', service);
        if (response.success) {
          setData(prev => ({ ...prev, services: response.data }));
        }
      } else {
        const updatedServices = [...data.services, service];
        updateData({ services: updatedServices });
      }
    } catch (error) {
      console.error('Failed to add service:', error);
    }
  };

  const updateService = async (index, service) => {
    try {
      if (adminAPI.isAuthenticated()) {
        const response = await adminAPI.content.updateArrayItem('services', index, service);
        if (response.success) {
          setData(prev => ({ ...prev, services: response.data }));
        }
      } else {
        const updatedServices = [...data.services];
        updatedServices[index] = service;
        updateData({ services: updatedServices });
      }
    } catch (error) {
      console.error('Failed to update service:', error);
    }
  };

  const deleteService = async (index) => {
    try {
      if (adminAPI.isAuthenticated()) {
        const response = await adminAPI.content.deleteArrayItem('services', index);
        if (response.success) {
          setData(prev => ({ ...prev, services: response.data }));
        }
      } else {
        const updatedServices = data.services.filter((_, i) => i !== index);
        updateData({ services: updatedServices });
      }
    } catch (error) {
      console.error('Failed to delete service:', error);
    }
  };

  const addTestimonial = async (testimonial) => {
    try {
      if (adminAPI.isAuthenticated()) {
        const response = await adminAPI.content.updateArrayItem('testimonials', 'add', testimonial);
        if (response.success) {
          setData(prev => ({ ...prev, testimonials: response.data }));
        }
      } else {
        const updatedTestimonials = [...data.testimonials, testimonial];
        updateData({ testimonials: updatedTestimonials });
      }
    } catch (error) {
      console.error('Failed to add testimonial:', error);
    }
  };

  const updateTestimonial = async (index, testimonial) => {
    try {
      if (adminAPI.isAuthenticated()) {
        const response = await adminAPI.content.updateArrayItem('testimonials', index, testimonial);
        if (response.success) {
          setData(prev => ({ ...prev, testimonials: response.data }));
        }
      } else {
        const updatedTestimonials = [...data.testimonials];
        updatedTestimonials[index] = testimonial;
        updateData({ testimonials: updatedTestimonials });
      }
    } catch (error) {
      console.error('Failed to update testimonial:', error);
    }
  };

  const deleteTestimonial = async (index) => {
    try {
      if (adminAPI.isAuthenticated()) {
        const response = await adminAPI.content.deleteArrayItem('testimonials', index);
        if (response.success) {
          setData(prev => ({ ...prev, testimonials: response.data }));
        }
      } else {
        const updatedTestimonials = data.testimonials.filter((_, i) => i !== index);
        updateData({ testimonials: updatedTestimonials });
      }
    } catch (error) {
      console.error('Failed to delete testimonial:', error);
    }
  };

  const updateTheme = async (newTheme) => {
    try {
      const updatedTheme = { ...data.theme, ...newTheme };
      setData(prev => ({ ...prev, theme: updatedTheme }));
      
      if (adminAPI.isAuthenticated()) {
        await adminAPI.theme.update(newTheme);
      }
    } catch (error) {
      console.error('Failed to update theme:', error);
    }
  };

  const updatePopupSettings = async (popupSettings) => {
    try {
      const nextPopupSettings = {
        ...data.popupSettings,
        ...popupSettings,
      };

      const updated = mergeCMSData({ ...data, popupSettings: nextPopupSettings });
      setData(updated);
      localStorage.setItem('capita_cms_data', JSON.stringify(updated));

      if (adminAPI.isAuthenticated()) {
        await adminAPI.content.updateSection('popupSettings', nextPopupSettings);
      }
    } catch (error) {
      console.error('Failed to update popup settings:', error);
    }
  };

  return (
    <CMSContext.Provider value={{ 
      data, 
      loading,
      updateData, 
      addProperty, 
      updateProperty, 
      deleteProperty,
      addOffer,
      updateOffer,
      deleteOffer,
      addService,
      updateService,
      deleteService,
      addTestimonial,
      updateTestimonial,
      deleteTestimonial,
      updateTheme,
      updatePopupSettings
    }}>
      {children}
    </CMSContext.Provider>
  );
};
