import React, { useState, useEffect } from 'react';
import { INITIAL_DATA } from './initialData';
import { CMSContext } from './CMSContextCore';
import { adminAPI } from './api';

// Validate and merge fetched data with defaults to handle missing/malformed data gracefully
const validateAndMergeData = (fetchedData) => {
  if (!fetchedData || typeof fetchedData !== 'object') {
    console.warn('Invalid data structure from backend, using defaults');
    return INITIAL_DATA;
  }

  try {
    // Helper to ensure array exists
    const ensureArray = (data) => Array.isArray(data) ? data : [];
    
    // Helper to ensure object with items array
    const ensureArraySection = (section, initialSection) => {
      if (!section || typeof section !== 'object') {
        return initialSection;
      }
      return {
        ...initialSection,
        ...section,
        items: ensureArray(section.items)
      };
    };

    // Deep merge with initial data to ensure all required fields exist
    return {
      theme: { ...INITIAL_DATA.theme, ...(fetchedData.theme || {}) },
      hero: { ...INITIAL_DATA.hero, ...(fetchedData.hero || {}) },
      about: { ...INITIAL_DATA.about, ...(fetchedData.about || {}) },
      contact: { ...INITIAL_DATA.contact, ...(fetchedData.contact || {}) },
      footer: { ...INITIAL_DATA.footer, ...(fetchedData.footer || {}) },
      navbar: { ...INITIAL_DATA.navbar, ...(fetchedData.navbar || {}) },
      stats: ensureArray(fetchedData.stats),
      properties: ensureArraySection(fetchedData.properties, INITIAL_DATA.properties),
      services: ensureArraySection(fetchedData.services, INITIAL_DATA.services),
      testimonials: ensureArraySection(fetchedData.testimonials, INITIAL_DATA.testimonials),
      offers: ensureArraySection(fetchedData.offers, INITIAL_DATA.offers),
    };
  } catch (error) {
    console.error('Error validating data:', error.message);
    return INITIAL_DATA;
  }
};

export const CMSProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('capita_cms_data');
    if (saved) {
      try {
        return validateAndMergeData(JSON.parse(saved));
      } catch (error) {
        console.warn('Corrupted localStorage data, using defaults', error);
        return INITIAL_DATA;
      }
    }
    return INITIAL_DATA;
  });
  const [loading, setLoading] = useState(true);

  // Fetch content from backend on mount
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        console.log('Fetching content from backend...');
        const response = await adminAPI.content.get();
        
        if (response && response.data) {
          console.log('Backend content fetched successfully:', response.data);
          const validatedData = validateAndMergeData(response.data);
          setData(validatedData);
          localStorage.setItem('capita_cms_data', JSON.stringify(validatedData));
          console.log('Data updated and stored:', { 
            propertiesCount: validatedData.properties?.items?.length || 0,
            servicesCount: validatedData.services?.items?.length || 0,
            testimonialsCount: validatedData.testimonials?.items?.length || 0,
            offersCount: validatedData.offers?.items?.length || 0
          });
        } else if (response && response.success === false) {
          console.warn('Backend returned error, keeping local data:', response.message);
        } else {
          console.warn('Unexpected response format:', response);
        }
      } catch (error) {
        console.error('Failed to fetch content from backend:', error.message);
        // Keep existing data on error
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const updateData = async (newData) => {
    try {
      // Validate and merge with existing data
      const updated = validateAndMergeData({ ...data, ...newData });
      setData(updated);
      localStorage.setItem('capita_cms_data', JSON.stringify(updated));

      // Sync with backend if authenticated
      if (adminAPI.isAuthenticated()) {
        try {
          await adminAPI.content.update(newData);
        } catch (backendError) {
          console.error('Failed to sync with backend:', backendError.message);
          // Data is still updated locally even if backend sync fails
        }
      }
    } catch (error) {
      console.error('Failed to update content:', error);
      // Keep existing data on error
    }
  };

  const addProperty = async (property) => {
    try {
      if (!property || typeof property !== 'object') {
        throw new Error('Invalid property data');
      }

      if (adminAPI.isAuthenticated()) {
        try {
          const response = await adminAPI.content.updateArrayItem('properties.items', 'add', property);
          if (response.success && Array.isArray(response.data)) {
            setData(prev => ({ ...prev, properties: { ...prev.properties, items: response.data } }));
          }
        } catch (backendError) {
          console.warn('Backend add failed, updating locally:', backendError.message);
          const updatedItems = [property, ...(data.properties?.items || [])];
          updateData({ properties: { ...data.properties, items: updatedItems } });
        }
      } else {
        const updatedItems = [property, ...(data.properties?.items || [])];
        updateData({ properties: { ...data.properties, items: updatedItems } });
      }
    } catch (error) {
      console.error('Failed to add property:', error.message);
    }
  };

  const updateProperty = async (index, property) => {
    try {
      if (index < 0 || !property || typeof property !== 'object') {
        throw new Error('Invalid property index or data');
      }

      if (adminAPI.isAuthenticated()) {
        try {
          const response = await adminAPI.content.updateArrayItem('properties.items', index, property);
          if (response.success && Array.isArray(response.data)) {
            setData(prev => ({ ...prev, properties: { ...prev.properties, items: response.data } }));
          }
        } catch (backendError) {
          console.warn('Backend update failed, updating locally:', backendError.message);
          const updatedItems = [...(data.properties?.items || [])];
          if (updatedItems[index]) {
            updatedItems[index] = { ...updatedItems[index], ...property };
            updateData({ properties: { ...data.properties, items: updatedItems } });
          }
        }
      } else {
        const updatedItems = [...(data.properties?.items || [])];
        if (updatedItems[index]) {
          updatedItems[index] = { ...updatedItems[index], ...property };
          updateData({ properties: { ...data.properties, items: updatedItems } });
        }
      }
    } catch (error) {
      console.error('Failed to update property:', error.message);
    }
  };

  const deleteProperty = async (index) => {
    try {
      if (index < 0) throw new Error('Invalid property index');

      if (adminAPI.isAuthenticated()) {
        try {
          const response = await adminAPI.content.deleteArrayItem('properties.items', index);
          if (response.success && Array.isArray(response.data)) {
            setData(prev => ({ ...prev, properties: { ...prev.properties, items: response.data } }));
          }
        } catch (backendError) {
          console.warn('Backend delete failed, updating locally:', backendError.message);
          const updatedItems = (data.properties?.items || []).filter((_, i) => i !== index);
          updateData({ properties: { ...data.properties, items: updatedItems } });
        }
      } else {
        const updatedItems = (data.properties?.items || []).filter((_, i) => i !== index);
        updateData({ properties: { ...data.properties, items: updatedItems } });
      }
    } catch (error) {
      console.error('Failed to delete property:', error.message);
    }
  };

  const addOffer = async (offer) => {
    try {
      if (!offer || typeof offer !== 'object') {
        throw new Error('Invalid offer data');
      }

      if (adminAPI.isAuthenticated()) {
        try {
          const response = await adminAPI.content.updateArrayItem('offers.items', 'add', offer);
          if (response.success && Array.isArray(response.data)) {
            setData(prev => ({ ...prev, offers: { ...prev.offers, items: response.data } }));
          }
        } catch (backendError) {
          console.warn('Backend add failed, updating locally:', backendError.message);
          const updatedItems = [offer, ...(data.offers?.items || [])];
          updateData({ offers: { ...data.offers, items: updatedItems } });
        }
      } else {
        const updatedItems = [offer, ...(data.offers?.items || [])];
        updateData({ offers: { ...data.offers, items: updatedItems } });
      }
    } catch (error) {
      console.error('Failed to add offer:', error.message);
    }
  };

  const updateOffer = async (index, offer) => {
    try {
      if (index < 0 || !offer || typeof offer !== 'object') {
        throw new Error('Invalid offer index or data');
      }

      if (adminAPI.isAuthenticated()) {
        try {
          const response = await adminAPI.content.updateArrayItem('offers.items', index, offer);
          if (response.success && Array.isArray(response.data)) {
            setData(prev => ({ ...prev, offers: { ...prev.offers, items: response.data } }));
          }
        } catch (backendError) {
          console.warn('Backend update failed, updating locally:', backendError.message);
          const updatedItems = [...(data.offers?.items || [])];
          if (updatedItems[index]) {
            updatedItems[index] = { ...updatedItems[index], ...offer };
            updateData({ offers: { ...data.offers, items: updatedItems } });
          }
        }
      } else {
        const updatedItems = [...(data.offers?.items || [])];
        if (updatedItems[index]) {
          updatedItems[index] = { ...updatedItems[index], ...offer };
          updateData({ offers: { ...data.offers, items: updatedItems } });
        }
      }
    } catch (error) {
      console.error('Failed to update offer:', error.message);
    }
  };

  const deleteOffer = async (index) => {
    try {
      if (index < 0) throw new Error('Invalid offer index');

      if (adminAPI.isAuthenticated()) {
        try {
          const response = await adminAPI.content.deleteArrayItem('offers.items', index);
          if (response.success && Array.isArray(response.data)) {
            setData(prev => ({ ...prev, offers: { ...prev.offers, items: response.data } }));
          }
        } catch (backendError) {
          console.warn('Backend delete failed, updating locally:', backendError.message);
          const updatedItems = (data.offers?.items || []).filter((_, i) => i !== index);
          updateData({ offers: { ...data.offers, items: updatedItems } });
        }
      } else {
        const updatedItems = (data.offers?.items || []).filter((_, i) => i !== index);
        updateData({ offers: { ...data.offers, items: updatedItems } });
      }
    } catch (error) {
      console.error('Failed to delete offer:', error.message);
    }
  };

  const addService = async (service) => {
    try {
      if (!service || typeof service !== 'object') {
        throw new Error('Invalid service data');
      }

      if (adminAPI.isAuthenticated()) {
        try {
          const response = await adminAPI.content.updateArrayItem('services.items', 'add', service);
          if (response.success && Array.isArray(response.data)) {
            setData(prev => ({ ...prev, services: { ...prev.services, items: response.data } }));
          }
        } catch (backendError) {
          console.warn('Backend add failed, updating locally:', backendError.message);
          const updatedItems = [...(data.services?.items || []), service];
          updateData({ services: { ...data.services, items: updatedItems } });
        }
      } else {
        const updatedItems = [...(data.services?.items || []), service];
        updateData({ services: { ...data.services, items: updatedItems } });
      }
    } catch (error) {
      console.error('Failed to add service:', error.message);
    }
  };

  const updateService = async (index, service) => {
    try {
      if (index < 0 || !service || typeof service !== 'object') {
        throw new Error('Invalid service index or data');
      }

      if (adminAPI.isAuthenticated()) {
        try {
          const response = await adminAPI.content.updateArrayItem('services.items', index, service);
          if (response.success && Array.isArray(response.data)) {
            setData(prev => ({ ...prev, services: { ...prev.services, items: response.data } }));
          }
        } catch (backendError) {
          console.warn('Backend update failed, updating locally:', backendError.message);
          const updatedItems = [...(data.services?.items || [])];
          if (updatedItems[index]) {
            updatedItems[index] = { ...updatedItems[index], ...service };
            updateData({ services: { ...data.services, items: updatedItems } });
          }
        }
      } else {
        const updatedItems = [...(data.services?.items || [])];
        if (updatedItems[index]) {
          updatedItems[index] = { ...updatedItems[index], ...service };
          updateData({ services: { ...data.services, items: updatedItems } });
        }
      }
    } catch (error) {
      console.error('Failed to update service:', error.message);
    }
  };

  const deleteService = async (index) => {
    try {
      if (index < 0) throw new Error('Invalid service index');

      if (adminAPI.isAuthenticated()) {
        try {
          const response = await adminAPI.content.deleteArrayItem('services.items', index);
          if (response.success && Array.isArray(response.data)) {
            setData(prev => ({ ...prev, services: { ...prev.services, items: response.data } }));
          }
        } catch (backendError) {
          console.warn('Backend delete failed, updating locally:', backendError.message);
          const updatedItems = (data.services?.items || []).filter((_, i) => i !== index);
          updateData({ services: { ...data.services, items: updatedItems } });
        }
      } else {
        const updatedItems = (data.services?.items || []).filter((_, i) => i !== index);
        updateData({ services: { ...data.services, items: updatedItems } });
      }
    } catch (error) {
      console.error('Failed to delete service:', error.message);
    }
  };

  const addTestimonial = async (testimonial) => {
    try {
      if (!testimonial || typeof testimonial !== 'object') {
        throw new Error('Invalid testimonial data');
      }

      if (adminAPI.isAuthenticated()) {
        try {
          const response = await adminAPI.content.updateArrayItem('testimonials.items', 'add', testimonial);
          if (response.success && Array.isArray(response.data)) {
            setData(prev => ({ ...prev, testimonials: { ...prev.testimonials, items: response.data } }));
          }
        } catch (backendError) {
          console.warn('Backend add failed, updating locally:', backendError.message);
          const updatedItems = [...(data.testimonials?.items || []), testimonial];
          updateData({ testimonials: { ...data.testimonials, items: updatedItems } });
        }
      } else {
        const updatedItems = [...(data.testimonials?.items || []), testimonial];
        updateData({ testimonials: { ...data.testimonials, items: updatedItems } });
      }
    } catch (error) {
      console.error('Failed to add testimonial:', error.message);
    }
  };

  const updateTestimonial = async (index, testimonial) => {
    try {
      if (index < 0 || !testimonial || typeof testimonial !== 'object') {
        throw new Error('Invalid testimonial index or data');
      }

      if (adminAPI.isAuthenticated()) {
        try {
          const response = await adminAPI.content.updateArrayItem('testimonials.items', index, testimonial);
          if (response.success && Array.isArray(response.data)) {
            setData(prev => ({ ...prev, testimonials: { ...prev.testimonials, items: response.data } }));
          }
        } catch (backendError) {
          console.warn('Backend update failed, updating locally:', backendError.message);
          const updatedItems = [...(data.testimonials?.items || [])];
          if (updatedItems[index]) {
            updatedItems[index] = { ...updatedItems[index], ...testimonial };
            updateData({ testimonials: { ...data.testimonials, items: updatedItems } });
          }
        }
      } else {
        const updatedItems = [...(data.testimonials?.items || [])];
        if (updatedItems[index]) {
          updatedItems[index] = { ...updatedItems[index], ...testimonial };
          updateData({ testimonials: { ...data.testimonials, items: updatedItems } });
        }
      }
    } catch (error) {
      console.error('Failed to update testimonial:', error.message);
    }
  };

  const deleteTestimonial = async (index) => {
    try {
      if (index < 0) throw new Error('Invalid testimonial index');

      if (adminAPI.isAuthenticated()) {
        try {
          const response = await adminAPI.content.deleteArrayItem('testimonials.items', index);
          if (response.success && Array.isArray(response.data)) {
            setData(prev => ({ ...prev, testimonials: { ...prev.testimonials, items: response.data } }));
          }
        } catch (backendError) {
          console.warn('Backend delete failed, updating locally:', backendError.message);
          const updatedItems = (data.testimonials?.items || []).filter((_, i) => i !== index);
          updateData({ testimonials: { ...data.testimonials, items: updatedItems } });
        }
      } else {
        const updatedItems = (data.testimonials?.items || []).filter((_, i) => i !== index);
        updateData({ testimonials: { ...data.testimonials, items: updatedItems } });
      }
    } catch (error) {
      console.error('Failed to delete testimonial:', error.message);
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
