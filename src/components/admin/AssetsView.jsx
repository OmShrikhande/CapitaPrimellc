import React, { useState, useEffect } from 'react';
import { adminAPI, getImageURL } from '../../context/api';
import Sparkline from './Sparkline';
import ImagePreview from './ImagePreview';

const ASSET_CATEGORY_OPTIONS = ['Property', 'Land', 'Commercial', 'Plot', 'Industrial', 'Other'];

/** Parse comma-separated list for submit; keeps spaces inside each segment. */
const parseCommaList = (text) =>
  String(text || '')
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

/** Non-empty segments for chip preview (typing "a, b" works; comma stays in the field). */
const commaListChips = (text) => parseCommaList(text);

/** Remove the Nth completed segment; rejoins with ", " so indices stay aligned with chips. */
const removeCommaListChipAt = (raw, chipIndex) => {
  const segments = parseCommaList(raw);
  if (chipIndex < 0 || chipIndex >= segments.length) return raw;
  segments.splice(chipIndex, 1);
  return segments.join(', ');
};

const emptyListingExtensions = () => ({
  marketingHeadline: '',
  grossFloorAreaSqFt: '',
  floorAreaRatio: '',
  totalBuiltUpAreaSqFt: '',
  buildingHeightDescription: '',
  totalUnitsApproved: '',
  usageType: '',
  jvInventorySplit: '',
  jvUpfrontNote: '',
  mapsUrl: '',
  advantagesNotes: '',
  commissionPercent: '',
  drawingsStatusNotes: '',
  titleDeedsFeesNotes: '',
  paymentTermsNotes: '',
  investmentNarrative: '',
  jvTermsRich: '',
});

const LISTING_EXTENSION_FIELDS = [
  'marketingHeadline',
  'grossFloorAreaSqFt',
  'floorAreaRatio',
  'totalBuiltUpAreaSqFt',
  'buildingHeightDescription',
  'totalUnitsApproved',
  'usageType',
  'jvInventorySplit',
  'jvUpfrontNote',
  'mapsUrl',
  'advantagesNotes',
  'commissionPercent',
  'drawingsStatusNotes',
  'titleDeedsFeesNotes',
  'paymentTermsNotes',
  'investmentNarrative',
  'jvTermsRich',
];

const readLongField = (source, key) => {
  const chunks = source?.[`${key}Chunks`];
  if (Array.isArray(chunks) && chunks.length > 0) {
    return chunks.map((item) => String(item || '')).join('');
  }
  const raw = source?.[key];
  return raw == null ? '' : String(raw);
};

const AssetForm = ({ isOpen, onClose, editingAsset, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Property',
    quantity: '',
    location: '',
    description: '',
    isVisible: true,
    images: [],
    // Property-specific fields
    price: '',
    area: '',
    bedrooms: '',
    bathrooms: '',
    parking: '',
    yearBuilt: '',
    propertyType: '',
    listingType: '',
    // Coordinates
    latitude: '',
    longitude: '',
    // Additional details (free-text in form; arrays built on submit)
    amenitiesText: '',
    featuresText: '',
    neighborhood: '',
    developer: '',
    completionStatus: '',
    paymentPlan: '',
    // Contact info
    agentName: '',
    agentPhone: '',
    agentEmail: '',
    isSpecial: false,
    viewingFeeAed: '',
    compareAtPrice: '',
    coverImageIndex: 0,
    ...emptyListingExtensions(),
  });
  const [loading, setLoading] = useState(false);
  const [previewItems, setPreviewItems] = useState([]);

  useEffect(() => {
    if (editingAsset) {
      setFormData({
        name: editingAsset.name || '',
        type: editingAsset.type || 'Property',
        quantity: editingAsset.quantity || '',
        location: editingAsset.location || '',
        description: editingAsset.description || '',
        isVisible: editingAsset.isVisible !== undefined ? !!editingAsset.isVisible : true,
        images: [],
        // Property-specific fields
        price: editingAsset.price || '',
        area: editingAsset.area || '',
        bedrooms: editingAsset.bedrooms || '',
        bathrooms: editingAsset.bathrooms || '',
        parking: editingAsset.parking || '',
        yearBuilt: editingAsset.yearBuilt || '',
        propertyType: editingAsset.propertyType || '',
        listingType: editingAsset.listingType || '',
        // Coordinates
        latitude: editingAsset.coordinates?.latitude || '',
        longitude: editingAsset.coordinates?.longitude || '',
        // Additional details
        amenitiesText: Array.isArray(editingAsset.amenities) && editingAsset.amenities.length
          ? editingAsset.amenities.join(', ')
          : '',
        featuresText: Array.isArray(editingAsset.features) && editingAsset.features.length
          ? editingAsset.features.join(', ')
          : '',
        neighborhood: editingAsset.neighborhood || '',
        developer: editingAsset.developer || '',
        completionStatus: editingAsset.completionStatus || '',
        paymentPlan: editingAsset.paymentPlan || '',
        // Contact info
        agentName: editingAsset.agentName || '',
        agentPhone: editingAsset.agentPhone || '',
        agentEmail: editingAsset.agentEmail || '',
        isSpecial: !!editingAsset.isSpecial,
        viewingFeeAed: editingAsset.viewingFeeAed != null && editingAsset.viewingFeeAed !== '' ? String(editingAsset.viewingFeeAed) : '',
        compareAtPrice:
          editingAsset.compareAtPrice != null && editingAsset.compareAtPrice !== ''
            ? String(editingAsset.compareAtPrice)
            : '',
        coverImageIndex:
          Number.isInteger(editingAsset.coverImageIndex) && editingAsset.coverImageIndex >= 0
            ? editingAsset.coverImageIndex
            : 0,
        ...emptyListingExtensions(),
        ...Object.fromEntries(
          LISTING_EXTENSION_FIELDS.map((key) => [key, readLongField(editingAsset, key)])
        ),
      });
      const existing = Array.isArray(editingAsset.imageUrls)
        ? editingAsset.imageUrls.map((url) => ({ kind: 'existing', src: url }))
        : [];
      setPreviewItems(existing);
    } else {
      setFormData({
        name: '',
        type: 'Property',
        quantity: '',
        location: '',
        description: '',
        isVisible: true,
        images: [],
        // Property-specific fields
        price: '',
        area: '',
        bedrooms: '',
        bathrooms: '',
        parking: '',
        yearBuilt: '',
        propertyType: '',
        listingType: '',
        // Coordinates
        latitude: '',
        longitude: '',
        // Additional details
        amenitiesText: '',
        featuresText: '',
        neighborhood: '',
        developer: '',
        completionStatus: '',
        paymentPlan: '',
        // Contact info
        agentName: '',
        agentPhone: '',
        agentEmail: '',
        isSpecial: false,
        viewingFeeAed: '',
        compareAtPrice: '',
        coverImageIndex: 0,
        ...emptyListingExtensions(),
      });
      setPreviewItems([]);
    }
  }, [editingAsset, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // Limit to 7 images total
      const allowedFiles = files.slice(0, Math.max(0, 7 - previewItems.length));

      // Create previews for new files
      const newPreviews = allowedFiles.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => resolve({ kind: 'new', src: ev.target.result, file });
          reader.readAsDataURL(file);
        });
      });

      Promise.all(newPreviews).then(previews => {
        setPreviewItems(prev => [...prev, ...previews]);
        setFormData((prev) => ({
          ...prev,
          coverImageIndex:
            Number.isInteger(prev.coverImageIndex) && prev.coverImageIndex >= 0
              ? prev.coverImageIndex
              : 0,
        }));
      });
    }
  };

  const removeImage = (index) => {
    setPreviewItems((prev) => {
      const nextItems = prev.filter((_, i) => i !== index);
      setFormData((prevForm) => {
        const nextNewFiles = nextItems
          .filter((item) => item.kind === 'new' && item.file)
          .map((item) => item.file);
        const retainedImageUrls = nextItems
          .filter((item) => item.kind === 'existing')
          .map((item) => item.src);

        let nextCover = Number.isInteger(prevForm.coverImageIndex) ? prevForm.coverImageIndex : 0;
        if (nextItems.length === 0) {
          nextCover = 0;
        } else if (index < nextCover) {
          nextCover -= 1;
        } else if (index === nextCover) {
          nextCover = 0;
        } else if (nextCover >= nextItems.length) {
          nextCover = nextItems.length - 1;
        }

        return {
          ...prevForm,
          images: nextNewFiles,
          retainedImageUrls,
          coverImageIndex: Math.max(0, nextCover),
        };
      });
      return nextItems;
    });
  };

  const refreshDerivedImageFields = (items) => {
    const nextNewFiles = items
      .filter((item) => item.kind === 'new' && item.file)
      .map((item) => item.file);
    const retainedImageUrls = items
      .filter((item) => item.kind === 'existing')
      .map((item) => item.src);
    setFormData((prev) => ({
      ...prev,
      images: nextNewFiles,
      retainedImageUrls,
      coverImageIndex: Math.min(Math.max(0, Number(prev.coverImageIndex) || 0), Math.max(0, items.length - 1)),
    }));
  };

  useEffect(() => {
    refreshDerivedImageFields(previewItems);
  }, [previewItems]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const typeTrim = formData.type != null ? String(formData.type).trim() : '';
      const { amenitiesText, featuresText, ...rest } = formData;
      const coverIdx = Number(formData.coverImageIndex) || 0;
      const coverItem = previewItems[coverIdx] || previewItems[0] || null;
      const coverSrc = coverItem?.src ? String(coverItem.src) : '';
      const safeCoverImageUrl =
        coverSrc && !coverSrc.startsWith('data:') && !coverSrc.startsWith('blob:')
          ? coverSrc
          : '';

      const payload = {
        ...rest,
        type: typeTrim || 'Property',
        amenities: parseCommaList(amenitiesText),
        features: parseCommaList(featuresText),
        // Never send base64/blob preview strings in form fields; Multer rejects large field values.
        coverImageUrl: safeCoverImageUrl,
      };
      await onSubmit(payload);
      onClose();
    } catch (error) {
      console.error('Error submitting asset:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-serif font-bold text-white">
            {editingAsset ? 'Edit Asset' : 'Add New Asset'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
                Asset Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-gold/50 focus:outline-none transition-all"
                placeholder="Enter asset name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
                Listing category
              </label>
              <select
                name="type"
                value={formData.type || 'Property'}
                onChange={handleInputChange}
                className="capita-admin-select w-full border border-white/10 rounded-xl px-4 py-3 focus:border-gold/50 focus:outline-none transition-all"
              >
                {ASSET_CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
                {formData.type && !ASSET_CATEGORY_OPTIONS.includes(formData.type) ? (
                  <option value={formData.type}>{formData.type} (saved)</option>
                ) : null}
              </select>
              <p className="text-xs text-gray-500 mt-1">Defaults to Property — real estate inventory only.</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-gold/50 focus:outline-none transition-all"
                placeholder="Enter quantity"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-gold/50 focus:outline-none transition-all"
                placeholder="Enter location"
              />
            </div>

            {/* Property-specific fields */}
            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
                Offer price (AED)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-gold/50 focus:outline-none transition-all"
                placeholder="Current / promotional price"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
                List price (AED) — optional
              </label>
              <input
                type="number"
                name="compareAtPrice"
                value={formData.compareAtPrice}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-gold/50 focus:outline-none transition-all"
                placeholder="Higher amount shown struck through"
                min="0"
                step="0.01"
              />
              <p className="text-xs text-gray-500 mt-1">If higher than offer price, the site shows a discount style (red strikethrough).</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
                Area (sq ft)
              </label>
              <input
                type="number"
                name="area"
                value={formData.area}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-gold/50 focus:outline-none transition-all"
                placeholder="Enter area"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
                Bedrooms
              </label>
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-gold/50 focus:outline-none transition-all"
                placeholder="Number of bedrooms"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
                Bathrooms
              </label>
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-gold/50 focus:outline-none transition-all"
                placeholder="Number of bathrooms"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
                Parking Spaces
              </label>
              <input
                type="number"
                name="parking"
                value={formData.parking}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-gold/50 focus:outline-none transition-all"
                placeholder="Number of parking spaces"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
                Year Built
              </label>
              <input
                type="number"
                name="yearBuilt"
                value={formData.yearBuilt}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-gold/50 focus:outline-none transition-all"
                placeholder="Year built"
                min="1800"
                max={new Date().getFullYear() + 5}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
                Property Type
              </label>
              <select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleInputChange}
                className="capita-admin-select w-full border border-white/10 rounded-xl px-4 py-3 focus:border-gold/50 focus:outline-none transition-all"
              >
                <option value="">Select property type</option>
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="Townhouse">Townhouse</option>
                <option value="Penthouse">Penthouse</option>
                <option value="Studio">Studio</option>
                <option value="Office">Office</option>
                <option value="Retail">Retail</option>
                <option value="Warehouse">Warehouse</option>
                <option value="Land">Land</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
                Listing Type
              </label>
              <select
                name="listingType"
                value={formData.listingType}
                onChange={handleInputChange}
                className="capita-admin-select w-full border border-white/10 rounded-xl px-4 py-3 focus:border-gold/50 focus:outline-none transition-all"
              >
                <option value="">Select listing type</option>
                <option value="Sale">For Sale</option>
                <option value="Rent">For Rent</option>
                <option value="Lease">For Lease</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isVisible"
                checked={!!formData.isVisible}
                onChange={(e) => setFormData((prev) => ({ ...prev, isVisible: e.target.checked }))}
                className="w-6 h-6 rounded bg-white/5 border-white/10 text-gold focus:ring-gold"
              />
              <label htmlFor="isVisible" className="text-sm font-bold text-gray-400 uppercase tracking-widest opacity-70">
                Show on website (home & listings)
              </label>
            </div>

            <div className="md:col-span-2 rounded-xl border border-gold/20 bg-gold/5 p-4 space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isSpecial"
                  checked={!!formData.isSpecial}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isSpecial: e.target.checked,
                      viewingFeeAed: e.target.checked ? prev.viewingFeeAed : '',
                    }))
                  }
                  className="w-6 h-6 rounded bg-white/5 border-white/10 text-gold focus:ring-gold"
                />
                <label htmlFor="isSpecial" className="text-sm font-bold text-gray-400 uppercase tracking-widest opacity-90">
                  Paid unlock — fee via Stripe to view full details; sorted first when featured on the home page
                </label>
              </div>
              {formData.isSpecial ? (
                <div>
                  <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
                    Viewing access fee (AED) *
                  </label>
                  <input
                    type="number"
                    name="viewingFeeAed"
                    value={formData.viewingFeeAed}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-gold/50 focus:outline-none transition-all"
                    placeholder="e.g. 99.00"
                    required={formData.isSpecial}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Charged via Stripe; the amount is stored on the server and is not accepted from the browser at checkout.
                  </p>
                </div>
              ) : null}
            </div>
          </div>

          <details className="group rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 open:pb-5 open:pt-4">
            <summary className="cursor-pointer list-none text-sm font-bold text-gold/90 uppercase tracking-widest flex items-center gap-2">
              <span className="opacity-70 group-open:rotate-90 transition-transform inline-block">▸</span>
              Optional details (map, developer, amenities…)
            </summary>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
                Latitude
              </label>
              <input
                type="number"
                name="latitude"
                value={formData.latitude}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-gold/50 focus:outline-none transition-all"
                placeholder="25.123456"
                step="0.000001"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
                Longitude
              </label>
              <input
                type="number"
                name="longitude"
                value={formData.longitude}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-gold/50 focus:outline-none transition-all"
                placeholder="55.123456"
                step="0.000001"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
                Neighborhood
              </label>
              <input
                type="text"
                name="neighborhood"
                value={formData.neighborhood}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-gold/50 focus:outline-none transition-all"
                placeholder="Enter neighborhood"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
                Developer
              </label>
              <input
                type="text"
                name="developer"
                value={formData.developer}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-gold/50 focus:outline-none transition-all"
                placeholder="Enter developer name"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
                Completion Status
              </label>
              <select
                name="completionStatus"
                value={formData.completionStatus}
                onChange={handleInputChange}
                className="capita-admin-select w-full border border-white/10 rounded-xl px-4 py-3 focus:border-gold/50 focus:outline-none transition-all"
              >
                <option value="">Select status</option>
                <option value="Ready">Ready</option>
                <option value="Off-Plan">Off-Plan</option>
                <option value="Under Construction">Under Construction</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
                Payment Plan
              </label>
              <input
                type="text"
                name="paymentPlan"
                value={formData.paymentPlan}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-gold/50 focus:outline-none transition-all"
                placeholder="e.g., 20% down payment"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
                Amenities (comma-separated)
              </label>
              <input
                type="text"
                value={formData.amenitiesText}
                onChange={(e) => setFormData((prev) => ({ ...prev, amenitiesText: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-gold/50 focus:outline-none transition-all"
                placeholder="Pool, gym, parking"
              />
              {commaListChips(formData.amenitiesText).length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {commaListChips(formData.amenitiesText).map((amenity, index) => (
                    <span key={`${amenity}-${index}`} className="bg-gold/20 text-gold px-2 py-1 rounded text-xs flex items-center gap-1">
                      {amenity}
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            amenitiesText: removeCommaListChipAt(prev.amenitiesText, index),
                          }))
                        }
                        className="text-gold hover:text-red-400"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
                Features (comma-separated)
              </label>
              <input
                type="text"
                value={formData.featuresText}
                onChange={(e) => setFormData((prev) => ({ ...prev, featuresText: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-gold/50 focus:outline-none transition-all"
                placeholder="Sea view, corner unit"
              />
              {commaListChips(formData.featuresText).length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {commaListChips(formData.featuresText).map((feature, index) => (
                    <span key={`${feature}-${index}`} className="bg-gold/20 text-gold px-2 py-1 rounded text-xs flex items-center gap-1">
                      {feature}
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            featuresText: removeCommaListChipAt(prev.featuresText, index),
                          }))
                        }
                        className="text-gold hover:text-red-400"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          </details>

          <details className="group rounded-2xl border border-gold/25 bg-gold/[0.04] px-4 py-3 open:pb-5 open:pt-4">
            <summary className="cursor-pointer list-none text-sm font-bold text-gold uppercase tracking-widest flex items-center gap-2">
              <span className="opacity-70 group-open:rotate-90 transition-transform inline-block">▸</span>
              JV / development brief (WhatsApp-style listings)
            </summary>
            <p className="text-xs text-gray-500 mt-3 leading-relaxed">
              Paste client copy into the large fields or fill the structured lines for the public listing page. Plot size stays in “Area (sq ft)” above; use GFA / FAR here when the client sends them separately.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Marketing headline</label>
                <input
                  type="text"
                  name="marketingHeadline"
                  value={formData.marketingHeadline}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-gold/50 focus:outline-none transition-all"
                  placeholder="e.g. Joint Venture Dubai South – Residential Development"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">GFA (SQ.FT.)</label>
                <input type="text" name="grossFloorAreaSqFt" value={formData.grossFloorAreaSqFt} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold/50 focus:outline-none" placeholder="41,483" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">FAR</label>
                <input type="text" name="floorAreaRatio" value={formData.floorAreaRatio} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold/50 focus:outline-none" placeholder="1.80" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Total built-up (SQ.FT.)</label>
                <input type="text" name="totalBuiltUpAreaSqFt" value={formData.totalBuiltUpAreaSqFt} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold/50 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Building / height</label>
                <input type="text" name="buildingHeightDescription" value={formData.buildingHeightDescription} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold/50 focus:outline-none" placeholder="G+4 + Roof" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Units approved</label>
                <input type="text" name="totalUnitsApproved" value={formData.totalUnitsApproved} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold/50 focus:outline-none" placeholder="48" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Usage type</label>
                <input type="text" name="usageType" value={formData.usageType} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold/50 focus:outline-none" placeholder="Residential + Hotel" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">JV inventory split</label>
                <input type="text" name="jvInventorySplit" value={formData.jvInventorySplit} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold/50 focus:outline-none" placeholder="40/60 or 50/50" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Upfront / contribution</label>
                <input type="text" name="jvUpfrontNote" value={formData.jvUpfrontNote} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold/50 focus:outline-none" placeholder="7M upfront (deductible…)" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Commission %</label>
                <input type="text" name="commissionPercent" value={formData.commissionPercent} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold/50 focus:outline-none" placeholder="3%" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Google Maps URL</label>
                <input type="url" name="mapsUrl" value={formData.mapsUrl} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold/50 focus:outline-none" placeholder="https://maps.app.goo.gl/..." />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Design / drawing status</label>
                <textarea name="drawingsStatusNotes" value={formData.drawingsStatusNotes} onChange={handleInputChange} rows={2} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold/50 focus:outline-none resize-none" placeholder="Preliminary design approved…" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Title deed / DLD fees note</label>
                <textarea name="titleDeedsFeesNotes" value={formData.titleDeedsFeesNotes} onChange={handleInputChange} rows={2} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold/50 focus:outline-none resize-none" placeholder="AED 12M fees paid…" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Payment terms note</label>
                <textarea name="paymentTermsNotes" value={formData.paymentTermsNotes} onChange={handleInputChange} rows={2} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold/50 focus:outline-none resize-none" placeholder="Payment over 5 years…" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Advantages / bullets</label>
                <textarea name="advantagesNotes" value={formData.advantagesNotes} onChange={handleInputChange} rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold/50 focus:outline-none resize-none" placeholder="One point per line or paste as received" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Investment narrative</label>
                <textarea name="investmentNarrative" value={formData.investmentNarrative} onChange={handleInputChange} rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold/50 focus:outline-none resize-none" placeholder="Ideal for… proximity to Expo, airport…" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Full JV terms (paste entire message)</label>
                <textarea name="jvTermsRich" value={formData.jvTermsRich} onChange={handleInputChange} rows={8} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold/50 focus:outline-none resize-y min-h-[160px] font-mono text-sm" placeholder="Paste WhatsApp / email body; appears on listing with line breaks preserved" />
              </div>
            </div>
          </details>

          {/* Agent Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
                Agent Name
              </label>
              <input
                type="text"
                name="agentName"
                value={formData.agentName}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-gold/50 focus:outline-none transition-all"
                placeholder="Agent name"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
                Agent Phone
              </label>
              <input
                type="tel"
                name="agentPhone"
                value={formData.agentPhone}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-gold/50 focus:outline-none transition-all"
                placeholder="+971 XX XXX XXXX"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
                Agent Email
              </label>
              <input
                type="email"
                name="agentEmail"
                value={formData.agentEmail}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-gold/50 focus:outline-none transition-all"
                placeholder="agent@company.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-gold/50 focus:outline-none transition-all resize-none"
              placeholder="Enter asset description"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
              Asset Images (Max 7)
            </label>
            <div className="space-y-4">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                disabled={previewItems.length >= 7}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-gold file:text-black hover:file:bg-gold/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              />
              {previewItems.length > 0 && (
                <div className="grid grid-cols-4 gap-3">
                  {previewItems.map((preview, index) => (
                    <div key={index} className="relative group">
                      <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/10 bg-black/20 relative">
                        {/* Handle both data URLs (new uploads) and backend URLs (existing images) */}
                        {preview.src.startsWith('data:') || preview.src.startsWith('blob:') ? (
                          <img src={preview.src} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                        ) : (
                          <ImagePreview
                            imagePath={preview.src}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            coverImageIndex: index,
                          }))
                        }
                        className={`absolute left-1/2 -translate-x-1/2 -bottom-2 px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest border transition-all ${
                          Number(formData.coverImageIndex || 0) === index
                            ? 'bg-gold text-black border-gold'
                            : 'bg-black/80 text-white/70 border-white/20 hover:border-gold/50 hover:text-gold'
                        }`}
                        title="Use this image as homepage cover"
                      >
                        Cover
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-500">
                Cover photo is used on homepage cards only (not inside listing details).
              </p>
              <p className="text-xs text-gray-500">
                {previewItems.length}/7 images uploaded
              </p>
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white py-3 px-6 rounded-xl font-bold uppercase tracking-widest transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gold hover:bg-gold/80 disabled:bg-gray-500 text-black py-3 px-6 rounded-xl font-black uppercase tracking-widest transition-all disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : (editingAsset ? 'Update Asset' : 'Add Asset')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AssetsView = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.assets.getAllAuthenticated();
      if (response.success) {
        setAssets(response.data);
      }
    } catch (err) {
      setError('Failed to load assets');
      console.error('Error loading assets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAsset = async (assetData) => {
    try {
      setError('');
      const response = await adminAPI.assets.create(assetData);
      if (response.success) {
        await loadAssets();
      } else {
        const msg = response.message || 'Failed to add asset';
        setError(msg);
        throw new Error(msg);
      }
    } catch (err) {
      const msg = err?.message || 'Failed to add asset';
      setError(msg);
      throw err;
    }
  };

  const handleUpdateAsset = async (assetData) => {
    try {
      setError('');
      const response = await adminAPI.assets.update(editingAsset.id, assetData);
      if (response.success) {
        await loadAssets();
      } else {
        const msg = response.message || 'Failed to update asset';
        setError(msg);
        throw new Error(msg);
      }
    } catch (err) {
      const msg = err?.message || 'Failed to update asset';
      setError(msg);
      throw err;
    }
  };

  const handleDeleteAsset = async (assetId) => {
    if (!window.confirm('Are you sure you want to delete this asset?')) return;

    try {
      const response = await adminAPI.assets.delete(assetId);
      if (response.success) {
        await loadAssets(); // Reload assets
      }
    } catch (err) {
      setError('Failed to delete asset');
      console.error('Error deleting asset:', err);
    }
  };

  const handleEdit = (asset) => {
    setEditingAsset(asset);
    setIsAdding(true);
  };

  const handleFormSubmit = async (assetData) => {
    if (editingAsset) {
      await handleUpdateAsset(assetData);
    } else {
      await handleAddAsset(assetData);
    }
  };

  const handleFormCancel = () => {
    setIsAdding(false);
    setEditingAsset(null);
  };

  const toPrettyText = (value) => {
    if (value == null) return '';
    if (Array.isArray(value)) {
      const trimmed = value.map((v) => String(v || '').trim()).filter(Boolean);
      return trimmed.length ? trimmed.join(', ') : '';
    }
    if (typeof value === 'object') {
      try {
        return JSON.stringify(value, null, 2);
      } catch {
        return String(value);
      }
    }
    return String(value).trim();
  };

  const getFullAssetText = (asset) => {
    const ignore = new Set(['id', 'imageUrls', 'createdAt', 'updatedAt']);
    const rows = [];
    const consumedChunkKeys = new Set();

    LISTING_EXTENSION_FIELDS.forEach((key) => {
      const full = readLongField(asset, key).trim();
      if (!full) return;
      rows.push(`${key}: ${full}`);
      consumedChunkKeys.add(`${key}Chunks`);
    });

    Object.keys(asset || {}).forEach((key) => {
      if (ignore.has(key)) return;
      if (LISTING_EXTENSION_FIELDS.includes(key)) return;
      if (consumedChunkKeys.has(key)) return;
      const raw = asset[key];
      const asText = toPrettyText(raw);
      if (!asText) return;
      rows.push(`${key}: ${asText}`);
    });
    if (Array.isArray(asset?.imageUrls) && asset.imageUrls.length > 0) {
      rows.push(`imageUrls: ${asset.imageUrls.join(', ')}`);
    }
    return rows.join('\n');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-gold text-lg">Loading assets...</div>
      </div>
    );
  }

  return (
    <div className="space-y-10 w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-4 px-2">
        <div>
          <h3 className="text-3xl font-serif font-bold tracking-tight mb-2">Asset Inventory</h3>
          <p className="text-[11px] text-gray-500 font-bold uppercase tracking-[0.3em] opacity-60">Managing {assets.length} Active Assets</p>
        </div>
        <button
          onClick={() => { setError(''); setIsAdding(true); setEditingAsset(null); }}
          className="bg-gold text-yellow-500 px-8 py-4 rounded-2xl text-[11px] font-black tracking-[0.3em] uppercase hover:bg-white transition-all shadow-2xl scale-105 active:scale-95 shrink-0"
        >
          + Add New Asset
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <AssetForm
        isOpen={isAdding}
        onClose={handleFormCancel}
        editingAsset={editingAsset}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-2 gap-10">
        {assets.map((asset) => (
          <div key={asset.id} className="bg-[#0a0a0a]/80 backdrop-blur-md border border-white/5 rounded-3xl p-6 lg:p-8 hover:border-gold/40 transition-all group relative overflow-hidden shadow-2xl">
            <div className="absolute -right-16 -top-16 w-48 h-48 bg-gold/5 blur-[80px] group-hover:bg-gold/10 transition-all rounded-full" />

            <div className="flex gap-4 lg:gap-6 items-start relative">
              <div className="w-20 h-20 lg:w-24 lg:h-24 bg-black/40 rounded-3xl flex items-center justify-center text-4xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-700 border border-white/10 shadow-inner overflow-hidden flex-shrink-0 relative">
                {asset.imageUrls && asset.imageUrls.length > 0 ? (
                  <ImagePreview
                    imagePath={asset.coverImageUrl || asset.imageUrls[asset.coverImageIndex || 0] || asset.imageUrls[0]}
                    alt={asset.name}
                    className="w-full h-full object-cover"
                    fallbackEmoji={
                      asset.type === 'Equipment' ? '🔧' :
                      asset.type === 'Furniture' ? '🪑' :
                      asset.type === 'Vehicle' ? '🚗' :
                      asset.type === 'Property' ? '🏢' : '📦'
                    }
                  />
                ) : (
                  (asset.type === 'Equipment' ? '🔧' :
                  asset.type === 'Furniture' ? '🪑' :
                  asset.type === 'Vehicle' ? '🚗' :
                  asset.type === 'Property' ? '🏢' : '📦')
                )}
              </div>
              <div className="flex-1 min-w-0 pr-0 lg:pr-2">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h4 className="font-bold text-xl lg:text-2xl tracking-tight text-white/90 truncate">{asset.name}</h4>
                  <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${
                    asset.quantity > 0 ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}>
                    {asset.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                  {asset.isSpecial ? (
                    <span className="text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border bg-gold/15 text-gold border-gold/35">
                      Special
                    </span>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] lg:text-[11px] text-gray-500 font-black uppercase tracking-[0.2em]">
                  <span className="flex items-center gap-2 group-hover:text-gold transition-colors whitespace-nowrap">🏷️ {asset.type}</span>
                  <span className="flex items-center gap-2 text-white/70 whitespace-nowrap">📦 Qty: {asset.quantity || 0}</span>
                  {asset.location && <span className="flex items-center gap-2 whitespace-nowrap">📍 {asset.location}</span>}
                  <span className="flex items-center gap-2 whitespace-nowrap">🖼️ {asset.imageUrls ? asset.imageUrls.length : 0} Images</span>
                </div>
                {asset.description && <p className="text-sm text-gray-400 mt-2 break-words">{asset.description}</p>}
                <div className="mt-3 rounded-xl border border-white/10 bg-black/35 p-3 max-h-72 overflow-auto custom-scrollbar">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gold/80 mb-2">
                    Full filled data
                  </p>
                  <div className="space-y-2">
                    {getFullAssetText(asset)
                      .split('\n')
                      .filter(Boolean)
                      .map((row) => {
                        const separatorIndex = row.indexOf(':');
                        if (separatorIndex === -1) {
                          return (
                            <div key={row} className="text-[11px] leading-relaxed text-white/70 break-words">
                              {row}
                            </div>
                          );
                        }
                        const key = row.slice(0, separatorIndex);
                        const value = row.slice(separatorIndex + 1).trim();
                        return (
                          <div key={row} className="grid grid-cols-[130px_1fr] gap-3 text-[11px] leading-relaxed">
                            <span className="text-gold/85 font-bold uppercase tracking-wider break-words">{key}</span>
                            <span className="text-white/75 whitespace-pre-wrap break-words">{value}</span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-5 relative z-10 justify-end">
              <button
                onClick={() => handleEdit(asset)}
                className="flex items-center justify-center gap-3 px-4 py-3 lg:px-6 lg:py-3 bg-white/5 hover:bg-gold hover:text-black rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase transition-all border border-white/10"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteAsset(asset.id)}
                className="p-3 lg:p-4 bg-red-500/5 hover:bg-red-500/10 text-red-500/40 hover:text-red-500 rounded-2xl transition-all border border-red-500/10"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {assets.length === 0 && !loading && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-bold text-white/60 mb-2">No Assets Found</h3>
          <p className="text-gray-500">Start by adding your first asset to the inventory.</p>
        </div>
      )}
    </div>
  );
};

export default AssetsView;