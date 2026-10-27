import { ref, shallowRef } from 'vue';
import { api } from '../api.js';

// Shared module-level cache for static metadata to avoid redundant network requests
const cachedRegencies = shallowRef([]);
const cachedCategories = shallowRef([]);
let metadataPromise = null;

/**
 * Safely extracts an array from standard API response envelope: { success: true, data: [...] }
 */
export function extractList(res) {
  if (res && res.success && Array.isArray(res.data)) {
    return res.data;
  }
  return [];
}

/**
 * Safely extracts detail object from API response envelope: { success: true, data: {...} }
 */
export function extractDetail(res) {
  if (res && res.success && res.data) {
    return res.data;
  }
  return null;
}

/**
 * Safely extracts error message from API response envelope with a fallback.
 */
export function extractError(res, fallback) {
  if (res && res.message) {
    return res.message;
  }
  return fallback;
}

/**
 * Metadata Composable
 * Manages regency options, tourism categories, and overall directory statistics.
 */
export function useMetadata() {
  const regencies = cachedRegencies;
  const categories = cachedCategories;
  const stats = shallowRef(null);
  const loading = ref(false);
  const error = ref(null);

  async function loadMetadata(force = false) {
    if (!force && cachedRegencies.value.length > 0 && cachedCategories.value.length > 0) {
      return { regencies: cachedRegencies.value, categories: cachedCategories.value };
    }
    if (metadataPromise && !force) {
      return metadataPromise;
    }

    loading.value = true;
    error.value = null;
    metadataPromise = Promise.all([
      api.getRegencies(),
      api.getCategories()
    ]).then(([rRes, cRes]) => {
      cachedRegencies.value = extractList(rRes);
      cachedCategories.value = extractList(cRes);
      return { regencies: cachedRegencies.value, categories: cachedCategories.value };
    }).catch(err => {
      console.error('Failed to load metadata:', err);
      error.value = 'Gagal memuat data wilayah dan kategori.';
      return { regencies: [], categories: [] };
    }).finally(() => {
      loading.value = false;
      metadataPromise = null;
    });

    return metadataPromise;
  }

  async function loadStats() {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.getStats();
      const data = extractDetail(res);
      stats.value = data;
      return data;
    } catch (err) {
      console.error('Failed to load directory stats:', err);
      error.value = 'Gagal memuat statistik.';
      return null;
    } finally {
      loading.value = false;
    }
  }

  return {
    regencies,
    categories,
    stats,
    loading,
    error,
    loadMetadata,
    loadStats
  };
}

/**
 * Destinations Catalog Composable
 * Encapsulates destination listing, featured highlights, and detail fetching.
 */
export function useDestinationsCatalog() {
  const items = shallowRef([]);
  const featured = shallowRef([]);
  const item = shallowRef(null);
  const loading = ref(false);
  const error = ref(null);

  async function loadDestinations(params = {}) {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.getDestinations(params);
      if (res && res.success) {
        items.value = extractList(res);
        return res;
      }
      error.value = extractError(res, 'Gagal memuat destinasi.');
      return res;
    } catch (err) {
      console.error('Error fetching destinations:', err);
      error.value = 'Terjadi kesalahan jaringan saat memuat destinasi.';
      return { success: false, message: error.value };
    } finally {
      loading.value = false;
    }
  }

  async function loadFeatured() {
    try {
      const res = await api.getFeaturedDestinations();
      featured.value = extractList(res);
      return featured.value;
    } catch (err) {
      console.error('Error fetching featured destinations:', err);
      return [];
    }
  }

  async function loadDestinationDetail(slug) {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.getDestinationDetail(slug);
      const detail = extractDetail(res);
      if (detail) {
        item.value = detail;
        return detail;
      }
      error.value = extractError(res, 'Destinasi tidak ditemukan.');
      return null;
    } catch (err) {
      console.error('Error fetching destination detail:', err);
      error.value = 'Gagal memuat detail destinasi.';
      return null;
    } finally {
      loading.value = false;
    }
  }

  return {
    items,
    featured,
    item,
    loading,
    error,
    loadDestinations,
    loadFeatured,
    loadDestinationDetail
  };
}

/**
 * Local Services Catalog Composable
 * Encapsulates local services and homestay catalog fetching and detail retrieval.
 */
export function useServicesCatalog() {
  const items = shallowRef([]);
  const item = shallowRef(null);
  const loading = ref(false);
  const error = ref(null);

  async function loadServices(params = {}) {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.getServices(params);
      if (res && res.success) {
        items.value = extractList(res);
        return res;
      }
      error.value = extractError(res, 'Gagal memuat jasa lokal.');
      return res;
    } catch (err) {
      console.error('Error fetching services:', err);
      error.value = 'Terjadi kesalahan jaringan saat memuat jasa lokal.';
      return { success: false, message: error.value };
    } finally {
      loading.value = false;
    }
  }

  async function loadServiceDetail(slug) {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.getServiceDetail(slug);
      const detail = extractDetail(res);
      if (detail) {
        item.value = detail;
        return detail;
      }
      error.value = extractError(res, 'Layanan tidak ditemukan.');
      return null;
    } catch (err) {
      console.error('Error fetching service detail:', err);
      error.value = 'Gagal memuat detail layanan.';
      return null;
    } finally {
      loading.value = false;
    }
  }

  return {
    items,
    item,
    loading,
    error,
    loadServices,
    loadServiceDetail
  };
}

/**
 * Transport Catalog Composable
 * Encapsulates Lake Toba ferry, boat, and shuttle schedules.
 */
export function useTransportCatalog() {
  const items = shallowRef([]);
  const loading = ref(false);
  const error = ref(null);

  async function loadTransport(type = '') {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.getTransport(type);
      if (res && res.success) {
        items.value = extractList(res);
        return items.value;
      }
      error.value = extractError(res, 'Gagal memuat jadwal transportasi.');
      return [];
    } catch (err) {
      console.error('Error fetching transport:', err);
      error.value = 'Gagal memuat jadwal transportasi.';
      return [];
    } finally {
      loading.value = false;
    }
  }

  return {
    items,
    loading,
    error,
    loadTransport
  };
}

/**
 * Culinary Catalog Composable
 * Encapsulates Batak cultural culinary dishes and partner restaurants.
 */
export function useCulinaryCatalog() {
  const restaurants = shallowRef([]);
  const culinaryItems = shallowRef([]);
  const loading = ref(false);
  const error = ref(null);

  async function loadRestaurants(params = {}) {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.getRestaurants(params);
      if (res && res.success) {
        restaurants.value = extractList(res);
        return res;
      }
      error.value = extractError(res, 'Gagal memuat rumah makan.');
      return res;
    } catch (err) {
      console.error('Error fetching restaurants:', err);
      error.value = 'Gagal memuat data rumah makan.';
      return { success: false, message: error.value };
    } finally {
      loading.value = false;
    }
  }

  async function loadCulinaryItems(halal = false) {
    try {
      const res = await api.getCulinary(halal);
      culinaryItems.value = extractList(res);
      return culinaryItems.value;
    } catch (err) {
      console.error('Error fetching culinary items:', err);
      return [];
    }
  }

  return {
    restaurants,
    culinaryItems,
    loading,
    error,
    loadRestaurants,
    loadCulinaryItems
  };
}

/**
 * Cultural Articles Composable
 * Encapsulates Toba cultural stories, articles, and folklore.
 */
export function useArticlesCatalog() {
  const items = shallowRef([]);
  const loading = ref(false);
  const error = ref(null);

  async function loadArticles() {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.getArticles();
      if (res && res.success) {
        items.value = extractList(res);
        return items.value;
      }
      error.value = extractError(res, 'Gagal memuat artikel.');
      return [];
    } catch (err) {
      console.error('Error fetching articles:', err);
      error.value = 'Gagal memuat artikel.';
      return [];
    } finally {
      loading.value = false;
    }
  }

  return {
    items,
    loading,
    error,
    loadArticles
  };
}

/**
 * Reviews Composable
 * Encapsulates public ratings and reviews across destinations, culinary, and services.
 */
export function useReviews() {
  const reviews = shallowRef([]);
  const loading = ref(false);
  const error = ref(null);

  async function loadUserReviews(userId) {
    if (!userId) return [];
    loading.value = true;
    error.value = null;
    try {
      const res = await api.getReviews({ user_id: userId });
      if (res && res.success) {
        reviews.value = extractList(res);
        return reviews.value;
      }
      reviews.value = [];
      error.value = extractError(res, 'Gagal memuat ulasan.');
      return [];
    } catch (err) {
      console.error('Error loading user reviews:', err);
      error.value = 'Gagal memuat ulasan.';
      return [];
    } finally {
      loading.value = false;
    }
  }

  async function loadEntityReviews(targetType, targetId) {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.getReviews(targetType, targetId);
      if (res && res.success) {
        reviews.value = extractList(res);
        return reviews.value;
      }
      reviews.value = [];
      error.value = extractError(res, 'Gagal memuat ulasan.');
      return [];
    } catch (err) {
      console.error('Error loading entity reviews:', err);
      return [];
    } finally {
      loading.value = false;
    }
  }

  async function submitReview(payload) {
    loading.value = true;
    error.value = null;
    try {
      return await api.submitReview(payload);
    } catch (err) {
      console.error('Error submitting review:', err);
      return { success: false, message: 'Gagal mengirim ulasan.' };
    } finally {
      loading.value = false;
    }
  }

  return {
    reviews,
    loading,
    error,
    loadUserReviews,
    loadEntityReviews,
    submitReview
  };
}
