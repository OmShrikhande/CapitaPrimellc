// API Configuration - Auto-detect environment
const getAPIBaseURL = () => {
  const envURL = import.meta.env.VITE_API_BASE_URL;
  if (envURL) return envURL;
  
  // Auto-detect local development
  if (import.meta.env.DEV) {
    return 'http://localhost:3000';
  }
  
  // Production fallback
  return 'https://capitaprimellc.onrender.com';
};

const API_BASE_URL = getAPIBaseURL();

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Request deduplication cache
const requestCache = new Map();
const REQUEST_CACHE_TIME = 5000; // 5 seconds

// Helper function to handle API responses
const handleResponse = async (response) => {
  let data;
  try {
    data = await response.json();
  } catch (e) {
    throw new Error(`Invalid response from server (HTTP ${response.status})`);
  }

  if (!response.ok) {
    // Handle specific error codes
    if (response.status === 401) {
      // Clear auth tokens on unauthorized
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
    }

    throw new Error(data.description || data.message || `HTTP ${response.status}: API request failed`);
  }

  return data;
};

// Cached request wrapper to prevent duplicate requests
const cachedRequest = async (url, options = {}, cacheKey = null) => {
  const key = cacheKey || `${options.method || 'GET'}-${url}`;

  // Check cache for GET requests
  if (!options.method || options.method === 'GET') {
    const cached = requestCache.get(key);
    if (cached && (Date.now() - cached.timestamp) < REQUEST_CACHE_TIME) {
      return cached.data;
    }
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
        ...getAuthHeaders(),
      },
    });

    const result = await handleResponse(response);

    // Cache successful GET requests
    if (!options.method || options.method === 'GET') {
      requestCache.set(key, {
        data: result,
        timestamp: Date.now(),
      });
    }

    return result;
  } catch (error) {
    // Clear cache on error
    requestCache.delete(key);
    console.error(`API Request failed [${url}]:`, error.message);
    throw error;
  }
};

// Admin API functions
export const adminAPI = {
  // Connection Test
  testConnection: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Backend connection test failed:', error.message);
      return { success: false, message: error.message };
    }
  },

  // Admin Login
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await handleResponse(response);

    // Store token if login successful
    if (data.success && data.data?.token) {
      localStorage.setItem('adminToken', data.data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.data.user));
    }

    return data;
  },

  // Get Admin Profile
  getProfile: async () => {
    return cachedRequest(`${API_BASE_URL}/api/admin/profile`);
  },

  // Logout (client-side only)
  logout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');
    return !!(token && user);
  },

  // Get stored user data
  getUser: () => {
    try {
      const user = localStorage.getItem('adminUser');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  // Theme API functions
  theme: {
    // Get current active theme (public - no auth required)
    get: async () => {
      return cachedRequest(`${API_BASE_URL}/api/admin/theme`);
    },

    // Update current theme
    update: async (themeData) => {
      const response = await fetch(`${API_BASE_URL}/api/admin/theme`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(themeData),
      });

      return handleResponse(response);
    },

    // Get all themes
    getAll: async () => {
      return cachedRequest(`${API_BASE_URL}/api/admin/themes`);
    },

    // Create theme preset
    createPreset: async (themeData) => {
      const response = await fetch(`${API_BASE_URL}/api/admin/themes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(themeData),
      });
      return handleResponse(response);
    },

    // Activate a theme
    activate: async (themeId) => {
      const response = await fetch(`${API_BASE_URL}/api/admin/themes/${themeId}/activate`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
        },
      });
      return handleResponse(response);
    },
  },

  // Content API functions
  content: {
    // Get all content (public)
    get: async () => {
      return cachedRequest(`${API_BASE_URL}/api/content`);
    },

    // Update all content
    update: async (contentData) => {
      const response = await fetch(`${API_BASE_URL}/api/content`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(contentData),
      });

      return handleResponse(response);
    },

    // Update specific section
    updateSection: async (section, sectionData) => {
      const response = await fetch(`${API_BASE_URL}/api/content/${section}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(sectionData),
      });

      return handleResponse(response);
    },

    // Add/Update array item
    updateArrayItem: async (type, index, itemData) => {
      const response = await fetch(`${API_BASE_URL}/api/content/array/${type}/${index}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(itemData),
      });

      return handleResponse(response);
    },

    // Delete array item
    deleteArrayItem: async (type, index) => {
      const response = await fetch(`${API_BASE_URL}/api/content/array/${type}/${index}`, {
        method: 'DELETE',
        headers: {
          ...getAuthHeaders(),
        },
      });

      return handleResponse(response);
    },
  },

  // Asset API functions
  assets: {
    // Get all assets (public)
    getAll: async () => {
      return cachedRequest(`${API_BASE_URL}/api/assets`);
    },

    // Get single asset (public)
    get: async (id) => {
      return cachedRequest(`${API_BASE_URL}/api/assets/${id}`);
    },

    // Create new asset (admin only)
    create: async (assetData) => {
      const formData = new FormData();

      // Add text fields
      Object.keys(assetData).forEach(key => {
        if (key !== 'images' && assetData[key] !== undefined && assetData[key] !== null) {
          if (Array.isArray(assetData[key])) {
            assetData[key].forEach(item => formData.append(key, item));
          } else {
            formData.append(key, assetData[key]);
          }
        }
      });

      // Add image files if provided (up to 7)
      if (assetData.images && Array.isArray(assetData.images)) {
        assetData.images.slice(0, 7).forEach((image) => {
          formData.append('images', image);
        });
      }

      const response = await fetch(`${API_BASE_URL}/api/assets`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
        },
        body: formData,
      });

      return handleResponse(response);
    },

    // Update asset (admin only)
    update: async (id, assetData) => {
      const formData = new FormData();

      // Add text fields
      Object.keys(assetData).forEach(key => {
        if (key !== 'images' && assetData[key] !== undefined && assetData[key] !== null) {
          if (Array.isArray(assetData[key])) {
            assetData[key].forEach(item => formData.append(key, item));
          } else {
            formData.append(key, assetData[key]);
          }
        }
      });

      // Add image files if provided (up to 7)
      if (assetData.images && Array.isArray(assetData.images)) {
        assetData.images.slice(0, 7).forEach((image) => {
          formData.append('images', image);
        });
      }

      const response = await fetch(`${API_BASE_URL}/api/assets/${id}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
        },
        body: formData,
      });

      return handleResponse(response);
    },

    // Delete asset (admin only)
    delete: async (id) => {
      const response = await fetch(`${API_BASE_URL}/api/assets/${id}`, {
        method: 'DELETE',
        headers: {
          ...getAuthHeaders(),
        },
      });

      return handleResponse(response);
    },
  },
};
