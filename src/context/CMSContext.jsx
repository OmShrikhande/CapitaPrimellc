import React, { useEffect, useState } from 'react';
import { INITIAL_DATA } from './initialData';
import { CMSContext } from './CMSContextCore';
import { adminAPI } from './api';

const ensureArray = (value, fallback = []) => (Array.isArray(value) ? value : fallback);

const ensureSectionWithItems = (section, initialSection) => ({
  ...initialSection,
  ...(section || {}),
  items: ensureArray(section?.items, initialSection.items || []),
});

const mergeCMSData = (incoming = {}) => ({
  ...INITIAL_DATA,
  ...incoming,
  theme: { ...INITIAL_DATA.theme, ...(incoming.theme || {}) },
  hero: { ...INITIAL_DATA.hero, ...(incoming.hero || {}) },
  about: { ...INITIAL_DATA.about, ...(incoming.about || {}) },
  contact: { ...INITIAL_DATA.contact, ...(incoming.contact || {}) },
  footer: { ...INITIAL_DATA.footer, ...(incoming.footer || {}) },
  navbar: { ...INITIAL_DATA.navbar, ...(incoming.navbar || {}) },
  popupSettings: { ...INITIAL_DATA.popupSettings, ...(incoming.popupSettings || {}) },
  stats: ensureArray(incoming.stats, INITIAL_DATA.stats),
  properties: ensureSectionWithItems(incoming.properties, INITIAL_DATA.properties),
  services: ensureSectionWithItems(incoming.services, INITIAL_DATA.services),
  testimonials: ensureSectionWithItems(incoming.testimonials, INITIAL_DATA.testimonials),
  offers: ensureSectionWithItems(incoming.offers, INITIAL_DATA.offers),
});

const persistData = (nextData) => {
  localStorage.setItem('capita_cms_data', JSON.stringify(nextData));
};

export const CMSProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('capita_cms_data');
    if (!saved) return INITIAL_DATA;

    try {
      return mergeCMSData(JSON.parse(saved));
    } catch (error) {
      console.warn('Corrupted CMS cache, using defaults:', error);
      return INITIAL_DATA;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await adminAPI.content.get();

        if (response?.success && response.data) {
          const mergedData = mergeCMSData(response.data);
          setData(mergedData);
          persistData(mergedData);
        }
      } catch (error) {
        console.error('Failed to fetch content from backend:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const updateData = async (newData) => {
    try {
      const updated = mergeCMSData({ ...data, ...newData });
      setData(updated);
      persistData(updated);

      if (adminAPI.isAuthenticated()) {
        try {
          await adminAPI.content.update(newData);
        } catch (backendError) {
          console.error('Failed to sync with backend:', backendError.message);
        }
      }
    } catch (error) {
      console.error('Failed to update content:', error);
    }
  };

  const syncSectionItems = async (sectionKey, nextItems, requestFactory) => {
    const updated = mergeCMSData({
      ...data,
      [sectionKey]: {
        ...data[sectionKey],
        items: nextItems,
      },
    });

    setData(updated);
    persistData(updated);

    if (adminAPI.isAuthenticated()) {
      try {
        await requestFactory();
      } catch (backendError) {
        console.error(`Failed to sync ${sectionKey}:`, backendError.message);
      }
    }
  };

  const createArrayHandlers = (sectionKey) => ({
    add: async (item) => {
      const nextItems = [item, ...(data[sectionKey]?.items || [])];

      if (adminAPI.isAuthenticated()) {
        try {
          const response = await adminAPI.content.updateArrayItem(`${sectionKey}.items`, 'add', item);
          if (response.success && Array.isArray(response.data)) {
            return syncSectionItems(sectionKey, response.data, async () => {});
          }
        } catch (error) {
          console.warn(`Backend add ${sectionKey} failed, using local update:`, error.message);
        }
      }

      return syncSectionItems(sectionKey, nextItems, async () =>
        adminAPI.content.updateSection(sectionKey, { ...data[sectionKey], items: nextItems })
      );
    },
    update: async (index, item) => {
      const currentItems = [...(data[sectionKey]?.items || [])];
      if (!currentItems[index]) return;
      currentItems[index] = { ...currentItems[index], ...item };

      if (adminAPI.isAuthenticated()) {
        try {
          const response = await adminAPI.content.updateArrayItem(`${sectionKey}.items`, index, currentItems[index]);
          if (response.success && Array.isArray(response.data)) {
            return syncSectionItems(sectionKey, response.data, async () => {});
          }
        } catch (error) {
          console.warn(`Backend update ${sectionKey} failed, using local update:`, error.message);
        }
      }

      return syncSectionItems(sectionKey, currentItems, async () =>
        adminAPI.content.updateSection(sectionKey, { ...data[sectionKey], items: currentItems })
      );
    },
    remove: async (index) => {
      const nextItems = (data[sectionKey]?.items || []).filter((_, itemIndex) => itemIndex !== index);

      if (adminAPI.isAuthenticated()) {
        try {
          const response = await adminAPI.content.deleteArrayItem(`${sectionKey}.items`, index);
          if (response.success && Array.isArray(response.data)) {
            return syncSectionItems(sectionKey, response.data, async () => {});
          }
        } catch (error) {
          console.warn(`Backend delete ${sectionKey} failed, using local update:`, error.message);
        }
      }

      return syncSectionItems(sectionKey, nextItems, async () =>
        adminAPI.content.updateSection(sectionKey, { ...data[sectionKey], items: nextItems })
      );
    },
  });

  const propertyHandlers = createArrayHandlers('properties');
  const offerHandlers = createArrayHandlers('offers');
  const serviceHandlers = createArrayHandlers('services');
  const testimonialHandlers = createArrayHandlers('testimonials');

  const updateTheme = async (newTheme) => {
    try {
      const updatedTheme = { ...data.theme, ...newTheme };
      const updated = mergeCMSData({ ...data, theme: updatedTheme });
      setData(updated);
      persistData(updated);

      if (adminAPI.isAuthenticated()) {
        await adminAPI.theme.update(newTheme);
      }
    } catch (error) {
      console.error('Failed to update theme:', error);
    }
  };

  const updatePopupSettings = async (popupSettings) => {
    try {
      const nextPopupSettings = { ...data.popupSettings, ...popupSettings };
      const updated = mergeCMSData({ ...data, popupSettings: nextPopupSettings });
      setData(updated);
      persistData(updated);

      if (adminAPI.isAuthenticated()) {
        await adminAPI.content.updateSection('popupSettings', nextPopupSettings);
      }
    } catch (error) {
      console.error('Failed to update popup settings:', error);
    }
  };

  const resetData = async () => {
    try {
      setData(INITIAL_DATA);
      persistData(INITIAL_DATA);

      if (adminAPI.isAuthenticated() && adminAPI.content.reset) {
        try {
          await adminAPI.content.reset();
        } catch (backendError) {
          console.error('Failed to sync reset with backend:', backendError.message);
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Failed to reset data:', error);
      return { success: false, error: error.message };
    }
  };

  return (
    <CMSContext.Provider
      value={{
        data,
        loading,
        updateData,
        addProperty: propertyHandlers.add,
        updateProperty: propertyHandlers.update,
        deleteProperty: propertyHandlers.remove,
        addOffer: offerHandlers.add,
        updateOffer: offerHandlers.update,
        deleteOffer: offerHandlers.remove,
        addService: serviceHandlers.add,
        updateService: serviceHandlers.update,
        deleteService: serviceHandlers.remove,
        addTestimonial: testimonialHandlers.add,
        updateTestimonial: testimonialHandlers.update,
        deleteTestimonial: testimonialHandlers.remove,
        updateTheme,
        updatePopupSettings,
        resetData,
      }}
    >
      {children}
    </CMSContext.Provider>
  );
};
