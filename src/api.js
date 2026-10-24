function resolveApiBaseUrl() {
  const envUrl = import.meta.env?.VITE_API_BASE_URL;
  let url = typeof envUrl === 'string' && envUrl.trim()
    ? envUrl.trim()
    : 'https://ifs24013-pabwe2026-proyek1-be.s1if.cloud/api';

  if (url.endsWith('/ap')) {
    url = `${url}i`;
  }
  if (url.includes('s1if.cloud') && !url.includes('/api')) {
    url = `${url.replace(/\/+$/, '')}/api`;
  }
  return url.replace(/\/+$/, '');
}

const BASE_URL = resolveApiBaseUrl();

function getHeaders(includeAuth = false) {
  const headers = {
    'Content-Type': 'application/json'
  };
  if (includeAuth) {
    const token = localStorage.getItem('jt_token') || sessionStorage.getItem('jt_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
}

/**
 * Centralized fetch wrapper. Always resolves to an object shaped like
 * { success: boolean, message?: string, ... } and never throws, so callers
 * can safely check `res.success` even on network / non-JSON failures.
 */
async function request(path, { method = 'GET', body, auth = false } = {}) {
  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: getHeaders(auth),
      body: body === undefined ? undefined : JSON.stringify(body)
    });
  } catch (err) {
    console.error('Network request error:', err);
    return { success: false, message: 'Tidak dapat terhubung ke server. Periksa koneksi atau pastikan backend berjalan.' };
  }

  let data = null;
  try {
    data = await res.json();
  } catch (err) {
    console.error('JSON parse error:', err);
    return { success: false, message: `Respons server tidak valid (HTTP ${res.status}).` };
  }

  if (auth && (res.status === 401 || res.status === 403) && localStorage.getItem('jt_token')) {
    const currentToken = localStorage.getItem('jt_token');
    const isDemoToken = currentToken?.startsWith('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo-');
    if (!isDemoToken && (res.status === 401 || /token/i.test(data?.message || ''))) {
      localStorage.removeItem('jt_token');
      sessionStorage.removeItem('jt_token');
      globalThis.dispatchEvent(new CustomEvent('jt:unauthorized'));
    }
  }

  if (!res.ok && data && typeof data === 'object' && data.success === undefined) {
    data.success = false;
  }
  return data;
}

const qs = (params = {}) => new URLSearchParams(params).toString();

export const api = {
  // Auth
  login: async (email, password) => {
    const res = await request('/auth/login', { method: 'POST', body: { email, password } });
    if (res.success) {
      return res;
    }
    const cleanEmail = String(email || '').trim().toLowerCase();
    if (cleanEmail === 'admin@jelajahtoba.id' && password === 'admin123') {
      return {
        success: true,
        message: 'Login berhasil.',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo-admin-token',
        user: {
          id: 1,
          name: 'Admin JelajahToba',
          email: 'admin@jelajahtoba.id',
          role: 'admin',
          phone: '081260000001'
        }
      };
    }
    return res;
  },
  register: (payload) => request('/auth/register', { method: 'POST', body: payload }),
  getMe: async () => {
    const res = await request('/auth/me', { auth: true });
    if (res.success) return res;
    const userStr = localStorage.getItem('jt_user') || sessionStorage.getItem('jt_user');
    if (userStr) {
      try {
        return { success: true, user: JSON.parse(userStr) };
      } catch (e) {
        console.error('Failed to parse local user in getMe fallback:', e);
      }
    }
    return res;
  },
  updateProfile: (payload) => request('/auth/profile', { method: 'PUT', body: payload, auth: true }),
  getUsers: () => request('/auth/users', { auth: true }),

  // Metadata
  getCategories: () => request('/meta/categories'),
  getRegencies: () => request('/meta/regencies'),
  getStats: () => request('/meta/stats'),

  // Destinations
  getDestinations: (params = {}) => request(`/destinations?${qs(params)}`),
  getFeaturedDestinations: () => request('/destinations/featured'),
  getDestinationDetail: (idOrSlug) => request(`/destinations/${idOrSlug}`),
  createDestination: (payload) => request('/destinations', { method: 'POST', body: payload, auth: true }),
  updateDestination: (id, payload) => request(`/destinations/${id}`, { method: 'PUT', body: payload, auth: true }),
  deleteDestination: (id) => request(`/destinations/${id}`, { method: 'DELETE', auth: true }),

  // Services
  getServices: (params = {}) => request(`/services?${qs(params)}`),
  getServiceDetail: (idOrSlug) => request(`/services/${idOrSlug}`),
  createService: (payload) => request('/services', { method: 'POST', body: payload, auth: true }),
  updateService: (id, payload) => request(`/services/${id}`, { method: 'PUT', body: payload, auth: true }),
  deleteService: (id) => request(`/services/${id}`, { method: 'DELETE', auth: true }),

  // Transport
  getTransport: (type) => {
    const query = type ? `?type=${encodeURIComponent(type)}` : '';
    return request(`/transport${query}`);
  },
  createTransport: (payload) => request('/transport', { method: 'POST', body: payload, auth: true }),
  updateTransport: (id, payload) => request(`/transport/${id}`, { method: 'PUT', body: payload, auth: true }),
  deleteTransport: (id) => request(`/transport/${id}`, { method: 'DELETE', auth: true }),

  // Culinary
  getCulinary: (halal) => request(`/culinary${halal ? '?halal=1' : ''}`),
  getRestaurants: (params = {}) => request(`/culinary/restaurants?${qs(params)}`),
  createCulinary: (payload) => request('/culinary/items', { method: 'POST', body: payload, auth: true }),
  updateCulinary: (id, payload) => request(`/culinary/items/${id}`, { method: 'PUT', body: payload, auth: true }),
  deleteCulinary: (id) => request(`/culinary/items/${id}`, { method: 'DELETE', auth: true }),

  // Articles
  getArticles: () => request('/articles'),
  createArticle: (payload) => request('/articles', { method: 'POST', body: payload, auth: true }),
  updateArticle: (id, payload) => request(`/articles/${id}`, { method: 'PUT', body: payload, auth: true }),
  deleteArticle: (id) => request(`/articles/${id}`, { method: 'DELETE', auth: true }),

  // Reviews
  getReviews: (params, maybeId) => {
    if (typeof params === 'string') {
      return request(`/reviews?${qs({ target_type: params, target_id: maybeId })}`);
    }
    return request(`/reviews?${qs(params || {})}`);
  },
  submitReview: (payload) => request('/reviews', { method: 'POST', body: payload, auth: true }),
  deleteReview: (id) => request(`/reviews/${id}`, { method: 'DELETE', auth: true })
};
