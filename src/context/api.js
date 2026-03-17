// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://capitaprimellc.onrender.com';

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
  const data = await response.json();

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
      headers: {
        ...options.headers, // Auth headers first
        'Content-Type': 'application/json', // Override any existing content-type
      },
      ...options,
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
    throw error;
  }
};

// Admin API functions
export const adminAPI = {
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
    const response = await fetch(`${API_BASE_URL}/api/admin/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });

    return handleResponse(response);
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

    if (!token || !user) return false;

    try {
      // Basic token validation (you might want to decode JWT to check expiry)
      return true;
    } catch {
      // Invalid token format
      adminAPI.logout();
      return false;
    }
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
      return cachedRequest(`${API_BASE_URL}/api/admin/theme`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },

    // Update current theme
    update: async (themeData) => {
      const authHeaders = getAuthHeaders();
      console.log('Auth headers for theme update:', authHeaders);
      console.log('Theme data being sent:', themeData);

      if (!authHeaders.Authorization) {
        throw new Error('No authentication token found. Please login as admin first.');
      }

      // Use direct fetch instead of cachedRequest for debugging
      const response = await fetch(`${API_BASE_URL}/api/admin/theme`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify(themeData),
      });

      return handleResponse(response);
    },

    // Get all themes
    getAll: async () => {
      return cachedRequest(`${API_BASE_URL}/api/admin/themes`, {
        method: 'GET',
        headers: {
          ...getAuthHeaders(),
        },
      });
    },

    // Create theme preset
    createPreset: async (themeData) => {
      return cachedRequest(`${API_BASE_URL}/api/admin/themes`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
        },
        body: JSON.stringify(themeData),
      }, `POST-${API_BASE_URL}/api/admin/themes-${Date.now()}`);
    },

    // Activate a theme
    activate: async (themeId) => {
      return cachedRequest(`${API_BASE_URL}/api/admin/themes/${themeId}/activate`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
        },
      }, `PUT-${API_BASE_URL}/api/admin/themes/${themeId}/activate-${Date.now()}`);
    },
  },

  // Asset API functions
  assets: {
    // Get all assets (public)
    getAll: async () => {
      return cachedRequest(`${API_BASE_URL}/api/assets`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },

    // Get single asset (public)
    get: async (id) => {
      return cachedRequest(`${API_BASE_URL}/api/assets/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },

    // Create new asset (admin only)
    create: async (assetData) => {
      const formData = new FormData();

      // Add text fields
      Object.keys(assetData).forEach(key => {
        if (key !== 'images' && assetData[key] !== undefined) {
          formData.append(key, assetData[key]);
        }
      });

      // Add image files if provided (up to 7)
      if (assetData.images && Array.isArray(assetData.images)) {
        assetData.images.slice(0, 7).forEach((image, index) => {
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
        if (key !== 'images' && assetData[key] !== undefined) {
          formData.append(key, assetData[key]);
        }
      });

      // Add image files if provided (up to 7)
      if (assetData.images && Array.isArray(assetData.images)) {
        assetData.images.slice(0, 7).forEach((image, index) => {
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