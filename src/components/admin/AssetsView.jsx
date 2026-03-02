import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../context/api';
import Sparkline from './Sparkline';

const AssetForm = ({ isOpen, onClose, editingAsset, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    quantity: '',
    location: '',
    description: '',
    image: null
  });
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (editingAsset) {
      setFormData({
        name: editingAsset.name || '',
        type: editingAsset.type || '',
        quantity: editingAsset.quantity || '',
        location: editingAsset.location || '',
        description: editingAsset.description || '',
        image: null
      });
      setImagePreview(editingAsset.imageUrl || '');
    } else {
      setFormData({
        name: '',
        type: '',
        quantity: '',
        location: '',
        description: '',
        image: null
      });
      setImagePreview('');
    }
  }, [editingAsset, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit(formData);
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
      <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
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
                Asset Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold/50 focus:outline-none transition-all"
                required
              >
                <option value="">Select type</option>
                <option value="Equipment">Equipment</option>
                <option value="Furniture">Furniture</option>
                <option value="Vehicle">Vehicle</option>
                <option value="Property">Property</option>
                <option value="Other">Other</option>
              </select>
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
              Asset Image
            </label>
            <div className="flex gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-gold file:text-black hover:file:bg-gold/80 transition-all"
              />
              {imagePreview && (
                <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/10">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
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
      const response = await adminAPI.assets.getAll();
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
      const response = await adminAPI.assets.create(assetData);
      if (response.success) {
        await loadAssets(); // Reload assets
      }
    } catch (err) {
      setError('Failed to add asset');
      throw err;
    }
  };

  const handleUpdateAsset = async (assetData) => {
    try {
      const response = await adminAPI.assets.update(editingAsset.id, assetData);
      if (response.success) {
        await loadAssets(); // Reload assets
      }
    } catch (err) {
      setError('Failed to update asset');
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
          onClick={() => { setIsAdding(true); setEditingAsset(null); }}
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
          <div key={asset.id} className="bg-[#0a0a0a]/80 backdrop-blur-md border border-white/5 rounded-3xl p-8 lg:p-10 flex flex-col lg:flex-row justify-between items-start lg:items-center hover:border-gold/40 transition-all group relative overflow-hidden shadow-2xl">
            <div className="absolute -right-16 -top-16 w-48 h-48 bg-gold/5 blur-[80px] group-hover:bg-gold/10 transition-all rounded-full" />

            <div className="flex gap-6 lg:gap-8 items-center relative flex-1">
              <div className="w-20 h-20 lg:w-24 lg:h-24 bg-black/40 rounded-3xl flex items-center justify-center text-4xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-700 border border-white/10 shadow-inner overflow-hidden flex-shrink-0">
                {asset.imageUrl ? (
                  <img src={asset.imageUrl} alt={asset.name} className="w-full h-full object-cover" />
                ) : (
                  asset.type === 'Equipment' ? '🔧' :
                  asset.type === 'Furniture' ? '🪑' :
                  asset.type === 'Vehicle' ? '🚗' :
                  asset.type === 'Property' ? '🏢' : '📦'
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h4 className="font-bold text-xl lg:text-2xl tracking-tight text-white/90 truncate">{asset.name}</h4>
                  <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${
                    asset.quantity > 0 ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}>
                    {asset.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] lg:text-[11px] text-gray-500 font-black uppercase tracking-[0.2em]">
                  <span className="flex items-center gap-2 group-hover:text-gold transition-colors whitespace-nowrap">🏷️ {asset.type}</span>
                  <span className="flex items-center gap-2 text-white/70 whitespace-nowrap">📦 Qty: {asset.quantity || 0}</span>
                  {asset.location && <span className="flex items-center gap-2 whitespace-nowrap">📍 {asset.location}</span>}
                </div>
                {asset.description && (
                  <p className="text-sm text-gray-400 mt-2 line-clamp-2">{asset.description}</p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap lg:flex-nowrap gap-3 lg:gap-4 mt-8 lg:mt-0 relative shrink-0 w-full lg:w-auto justify-end">
              <button
                onClick={() => handleEdit(asset)}
                className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-4 py-3 lg:px-6 lg:py-4 bg-white/5 hover:bg-gold hover:text-black rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase transition-all border border-white/10"
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