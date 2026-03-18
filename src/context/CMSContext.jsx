import React, { useState, useEffect } from 'react';
import { INITIAL_DATA } from './initialData';
import { CMSContext } from './CMSContextCore';
import { adminAPI } from './api';

export const CMSProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('capita_cms_data');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });
  const [loading, setLoading] = useState(true);

  // Fetch content from backend on mount
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await adminAPI.content.get();
        if (response.success && response.data) {
          setData(response.data);
          localStorage.setItem('capita_cms_data', JSON.stringify(response.data));
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
      const updated = { ...data, ...newData };
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
        const response = await adminAPI.content.updateArrayItem('properties.items', 'add', property);
        if (response.success) {
          setData(prev => ({ ...prev, properties: { ...prev.properties, items: response.data } }));
        }
      } else {
        const updatedItems = [property, ...(data.properties.items || [])];
        updateData({ properties: { ...data.properties, items: updatedItems } });
      }
    } catch (error) {
      console.error('Failed to add property:', error);
    }
  };

  const updateProperty = async (index, property) => {
    try {
      if (adminAPI.isAuthenticated()) {
        const response = await adminAPI.content.updateArrayItem('properties.items', index, property);
        if (response.success) {
          setData(prev => ({ ...prev, properties: { ...prev.properties, items: response.data } }));
        }
      } else {
        const updatedItems = [...(data.properties.items || [])];
        updatedItems[index] = property;
        updateData({ properties: { ...data.properties, items: updatedItems } });
      }
    } catch (error) {
      console.error('Failed to update property:', error);
    }
  };

  const deleteProperty = async (index) => {
    try {
      if (adminAPI.isAuthenticated()) {
        const response = await adminAPI.content.deleteArrayItem('properties.items', index);
        if (response.success) {
          setData(prev => ({ ...prev, properties: { ...prev.properties, items: response.data } }));
        }
      } else {
        const updatedItems = (data.properties.items || []).filter((_, i) => i !== index);
        updateData({ properties: { ...data.properties, items: updatedItems } });
      }
    } catch (error) {
      console.error('Failed to delete property:', error);
    }
  };

  const addOffer = async (offer) => {
    try {
      if (adminAPI.isAuthenticated()) {
        const response = await adminAPI.content.updateArrayItem('offers.items', 'add', offer);
        if (response.success) {
          setData(prev => ({ ...prev, offers: { ...prev.offers, items: response.data } }));
        }
      } else {
        const updatedItems = [offer, ...(data.offers.items || [])];
        updateData({ offers: { ...data.offers, items: updatedItems } });
      }
    } catch (error) {
      console.error('Failed to add offer:', error);
    }
  };

  const updateOffer = async (index, offer) => {
    try {
      if (adminAPI.isAuthenticated()) {
        const response = await adminAPI.content.updateArrayItem('offers.items', index, offer);
        if (response.success) {
          setData(prev => ({ ...prev, offers: { ...prev.offers, items: response.data } }));
        }
      } else {
        const updatedItems = [...(data.offers.items || [])];
        updatedItems[index] = offer;
        updateData({ offers: { ...data.offers, items: updatedItems } });
      }
    } catch (error) {
      console.error('Failed to update offer:', error);
    }
  };

  const deleteOffer = async (index) => {
    try {
      if (adminAPI.isAuthenticated()) {
        const response = await adminAPI.content.deleteArrayItem('offers.items', index);
        if (response.success) {
          setData(prev => ({ ...prev, offers: { ...prev.offers, items: response.data } }));
        }
      } else {
        const updatedItems = (data.offers.items || []).filter((_, i) => i !== index);
        updateData({ offers: { ...data.offers, items: updatedItems } });
      }
    } catch (error) {
      console.error('Failed to delete offer:', error);
    }
  };

  const addService = async (service) => {
    try {
      if (adminAPI.isAuthenticated()) {
        const response = await adminAPI.content.updateArrayItem('services.items', 'add', service);
        if (response.success) {
          setData(prev => ({ ...prev, services: { ...prev.services, items: response.data } }));
        }
      } else {
        const updatedItems = [...(data.services.items || []), service];
        updateData({ services: { ...data.services, items: updatedItems } });
      }
    } catch (error) {
      console.error('Failed to add service:', error);
    }
  };

  const updateService = async (index, service) => {
    try {
      if (adminAPI.isAuthenticated()) {
        const response = await adminAPI.content.updateArrayItem('services.items', index, service);
        if (response.success) {
          setData(prev => ({ ...prev, services: { ...prev.services, items: response.data } }));
        }
      } else {
        const updatedItems = [...(data.services.items || [])];
        updatedItems[index] = service;
        updateData({ services: { ...data.services, items: updatedItems } });
      }
    } catch (error) {
      console.error('Failed to update service:', error);
    }
  };

  const deleteService = async (index) => {
    try {
      if (adminAPI.isAuthenticated()) {
        const response = await adminAPI.content.deleteArrayItem('services.items', index);
        if (response.success) {
          setData(prev => ({ ...prev, services: { ...prev.services, items: response.data } }));
        }
      } else {
        const updatedItems = (data.services.items || []).filter((_, i) => i !== index);
        updateData({ services: { ...data.services, items: updatedItems } });
      }
    } catch (error) {
      console.error('Failed to delete service:', error);
    }
  };

  const addTestimonial = async (testimonial) => {
    try {
      if (adminAPI.isAuthenticated()) {
        const response = await adminAPI.content.updateArrayItem('testimonials.items', 'add', testimonial);
        if (response.success) {
          setData(prev => ({ ...prev, testimonials: { ...prev.testimonials, items: response.data } }));
        }
      } else {
        const updatedItems = [...(data.testimonials.items || []), testimonial];
        updateData({ testimonials: { ...data.testimonials, items: updatedItems } });
      }
    } catch (error) {
      console.error('Failed to add testimonial:', error);
    }
  };

  const updateTestimonial = async (index, testimonial) => {
    try {
      if (adminAPI.isAuthenticated()) {
        const response = await adminAPI.content.updateArrayItem('testimonials.items', index, testimonial);
        if (response.success) {
          setData(prev => ({ ...prev, testimonials: { ...prev.testimonials, items: response.data } }));
        }
      } else {
        const updatedItems = [...(data.testimonials.items || [])];
        updatedItems[index] = testimonial;
        updateData({ testimonials: { ...data.testimonials, items: updatedItems } });
      }
    } catch (error) {
      console.error('Failed to update testimonial:', error);
    }
  };

  const deleteTestimonial = async (index) => {
    try {
      if (adminAPI.isAuthenticated()) {
        const response = await adminAPI.content.deleteArrayItem('testimonials.items', index);
        if (response.success) {
          setData(prev => ({ ...prev, testimonials: { ...prev.testimonials, items: response.data } }));
        }
      } else {
        const updatedItems = (data.testimonials.items || []).filter((_, i) => i !== index);
        updateData({ testimonials: { ...data.testimonials, items: updatedItems } });
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
      updateTheme
    }}>
      {children}
    </CMSContext.Provider>
  );
};
