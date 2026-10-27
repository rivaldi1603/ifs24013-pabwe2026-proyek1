import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  extractList,
  extractDetail,
  extractError,
  useMetadata,
  useDestinationsCatalog,
  useServicesCatalog,
  useTransportCatalog,
  useCulinaryCatalog,
  useArticlesCatalog,
  useReviews
} from '../composables/useCatalog.js';
import { api } from '../api.js';

describe('useCatalog composables suite', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('helper functions (extractList, extractDetail, extractError)', () => {
    it('extractList safely extracts arrays and handles invalid/empty inputs', () => {
      expect(extractList({ success: true, data: [1, 2, 3] })).toEqual([1, 2, 3]);
      expect(extractList({ success: true, data: 'not-an-array' })).toEqual([]);
      expect(extractList({ success: true, data: null })).toEqual([]);
      expect(extractList({ success: false, data: [1, 2] })).toEqual([]);
      expect(extractList(null)).toEqual([]);
      expect(extractList(undefined)).toEqual([]);
    });

    it('extractDetail safely extracts data objects and handles missing/falsy inputs', () => {
      expect(extractDetail({ success: true, data: { id: 10 } })).toEqual({ id: 10 });
      expect(extractDetail({ success: true, data: null })).toBeNull();
      expect(extractDetail({ success: false, data: { id: 10 } })).toBeNull();
      expect(extractDetail(null)).toBeNull();
      expect(extractDetail(undefined)).toBeNull();
    });

    it('extractError safely returns server message or fallback', () => {
      expect(extractError({ message: 'Server error' }, 'Fallback')).toBe('Server error');
      expect(extractError({ message: '' }, 'Fallback')).toBe('Fallback');
      expect(extractError(null, 'Fallback')).toBe('Fallback');
      expect(extractError(undefined, 'Fallback')).toBe('Fallback');
    });
  });

  describe('useMetadata()', () => {
    it('loads metadata and caches results', async () => {
      const mockRegencies = [{ id: 1, name: 'Toba' }];
      const mockCategories = [{ id: 1, name: 'Danau' }];

      const rSpy = vi.spyOn(api, 'getRegencies').mockResolvedValue({ success: true, data: mockRegencies });
      const cSpy = vi.spyOn(api, 'getCategories').mockResolvedValue({ success: true, data: mockCategories });

      const { regencies, categories, loadMetadata } = useMetadata();
      const res = await loadMetadata(true);

      expect(rSpy).toHaveBeenCalled();
      expect(cSpy).toHaveBeenCalled();
      expect(res.regencies).toEqual(mockRegencies);
      expect(res.categories).toEqual(mockCategories);
      expect(regencies.value).toEqual(mockRegencies);
      expect(categories.value).toEqual(mockCategories);

      // Verify cached hit without force
      rSpy.mockClear();
      cSpy.mockClear();
      const cachedRes = await loadMetadata(false);
      expect(rSpy).not.toHaveBeenCalled();
      expect(cachedRes.regencies).toEqual(mockRegencies);

      // Verify pending promise reuse when force=false
      regencies.value = [];
      categories.value = [];
      const p1 = loadMetadata(false);
      const p2 = loadMetadata(false);
      const [r1, r2] = await Promise.all([p1, p2]);
      expect(r2.regencies).toEqual(r1.regencies);
    });

    it('handles metadata fetch errors gracefully', async () => {
      vi.spyOn(api, 'getRegencies').mockRejectedValue(new Error('Regencies crash'));
      vi.spyOn(api, 'getCategories').mockResolvedValue({ success: false });

      const { error, loadMetadata } = useMetadata();
      const res = await loadMetadata(true);

      expect(res.regencies).toEqual([]);
      expect(error.value).toBe('Gagal memuat data wilayah dan kategori.');
    });

    it('loads directory stats successfully and handles error', async () => {
      const mockStats = { totalDestinations: 130, totalServices: 40 };
      vi.spyOn(api, 'getStats').mockResolvedValue({ success: true, data: mockStats });

      const { stats, loading, error, loadStats } = useMetadata();
      const res = await loadStats();

      expect(res).toEqual(mockStats);
      expect(stats.value).toEqual(mockStats);
      expect(loading.value).toBe(false);

      // Error case
      vi.spyOn(api, 'getStats').mockRejectedValue(new Error('Stats network fail'));
      const errRes = await loadStats();
      expect(errRes).toBeNull();
      expect(error.value).toBe('Gagal memuat statistik.');
    });
  });

  describe('useDestinationsCatalog()', () => {
    it('loads destinations list and handles API failure message', async () => {
      const mockDestinations = [{ id: 1, name: 'Bukit Holbung' }];
      vi.spyOn(api, 'getDestinations').mockResolvedValue({ success: true, data: mockDestinations, total: 1 });

      const { items, loading, error, loadDestinations } = useDestinationsCatalog();
      const res = await loadDestinations({ page: 1 });

      expect(res.success).toBe(true);
      expect(items.value).toEqual(mockDestinations);
      expect(loading.value).toBe(false);

      // Unsuccessful API response
      vi.spyOn(api, 'getDestinations').mockResolvedValue({ success: false, message: 'Tidak ditemukan' });
      await loadDestinations();
      expect(error.value).toBe('Tidak ditemukan');

      // Network exception
      vi.spyOn(api, 'getDestinations').mockRejectedValue(new Error('Network drop'));
      const failRes = await loadDestinations();
      expect(failRes.success).toBe(false);
      expect(error.value).toBe('Terjadi kesalahan jaringan saat memuat destinasi.');
    });

    it('loads featured destinations and handles exception', async () => {
      const mockFeatured = [{ id: 10, name: 'Parapat' }];
      vi.spyOn(api, 'getFeaturedDestinations').mockResolvedValue({ success: true, data: mockFeatured });

      const { featured, loadFeatured } = useDestinationsCatalog();
      const res = await loadFeatured();
      expect(res).toEqual(mockFeatured);
      expect(featured.value).toEqual(mockFeatured);

      // Network exception fallback
      vi.spyOn(api, 'getFeaturedDestinations').mockRejectedValue(new Error('Featured drop'));
      const fallback = await loadFeatured();
      expect(fallback).toEqual([]);
    });

    it('loads destination detail and handles not found and exceptions', async () => {
      const mockDetail = { id: 1, name: 'Sipinsur', slug: 'sipinsur' };
      vi.spyOn(api, 'getDestinationDetail').mockResolvedValue({ success: true, data: mockDetail });

      const { item, error, loadDestinationDetail } = useDestinationsCatalog();
      const res = await loadDestinationDetail('sipinsur');
      expect(res).toEqual(mockDetail);
      expect(item.value).toEqual(mockDetail);

      // Unsuccessful response
      vi.spyOn(api, 'getDestinationDetail').mockResolvedValue({ success: false, message: 'Destinasi hilang' });
      const notFound = await loadDestinationDetail('unknown');
      expect(notFound).toBeNull();
      expect(error.value).toBe('Destinasi hilang');

      // Exception handling
      vi.spyOn(api, 'getDestinationDetail').mockRejectedValue(new Error('Crash'));
      const crashRes = await loadDestinationDetail('crash-slug');
      expect(crashRes).toBeNull();
      expect(error.value).toBe('Gagal memuat detail destinasi.');
    });
  });

  describe('useServicesCatalog()', () => {
    it('loads services list and handles error states', async () => {
      const mockServices = [{ id: 1, name: 'Pemandu Batak' }];
      vi.spyOn(api, 'getServices').mockResolvedValue({ success: true, data: mockServices });

      const { items, error, loadServices } = useServicesCatalog();
      await loadServices();
      expect(items.value).toEqual(mockServices);

      // Fail message
      vi.spyOn(api, 'getServices').mockResolvedValue({ success: false });
      await loadServices();
      expect(error.value).toBe('Gagal memuat jasa lokal.');

      // Exception
      vi.spyOn(api, 'getServices').mockRejectedValue(new Error('Service fail'));
      const fail = await loadServices();
      expect(fail.success).toBe(false);
      expect(error.value).toBe('Terjadi kesalahan jaringan saat memuat jasa lokal.');
    });

    it('loads service detail and handles error states', async () => {
      const mockDetail = { id: 2, name: 'Homestay Toba' };
      vi.spyOn(api, 'getServiceDetail').mockResolvedValue({ success: true, data: mockDetail });

      const { item, error, loadServiceDetail } = useServicesCatalog();
      const res = await loadServiceDetail('homestay-toba');
      expect(res).toEqual(mockDetail);
      expect(item.value).toEqual(mockDetail);

      // Not found
      vi.spyOn(api, 'getServiceDetail').mockResolvedValue({ success: false });
      const notFound = await loadServiceDetail('missing');
      expect(notFound).toBeNull();
      expect(error.value).toBe('Layanan tidak ditemukan.');

      // Exception
      vi.spyOn(api, 'getServiceDetail').mockRejectedValue(new Error('Detail err'));
      const errRes = await loadServiceDetail('err');
      expect(errRes).toBeNull();
      expect(error.value).toBe('Gagal memuat detail layanan.');
    });
  });

  describe('useTransportCatalog()', () => {
    it('loads transport schedules and handles failure', async () => {
      const mockRoutes = [{ id: 1, route_direction: 'Ajibata - Tomok' }];
      vi.spyOn(api, 'getTransport').mockResolvedValue({ success: true, data: mockRoutes });

      const { items, error, loadTransport } = useTransportCatalog();
      const res = await loadTransport('ferry');
      expect(res).toEqual(mockRoutes);
      expect(items.value).toEqual(mockRoutes);

      // Failure response
      vi.spyOn(api, 'getTransport').mockResolvedValue({ success: false });
      const failRes = await loadTransport();
      expect(failRes).toEqual([]);
      expect(error.value).toBe('Gagal memuat jadwal transportasi.');

      // Exception
      vi.spyOn(api, 'getTransport').mockRejectedValue(new Error('Transport err'));
      const errRes = await loadTransport();
      expect(errRes).toEqual([]);
      expect(error.value).toBe('Gagal memuat jadwal transportasi.');
    });
  });

  describe('useCulinaryCatalog()', () => {
    it('loads restaurants and culinary items with error handling', async () => {
      const mockRestos = [{ id: 1, name: 'RM Islam Balige' }];
      const mockDishes = [{ id: 1, name: 'Arsik Ikan Mas' }];

      vi.spyOn(api, 'getRestaurants').mockResolvedValue({ success: true, data: mockRestos });
      vi.spyOn(api, 'getCulinary').mockResolvedValue({ success: true, data: mockDishes });

      const { restaurants, culinaryItems, error, loadRestaurants, loadCulinaryItems } = useCulinaryCatalog();
      await loadRestaurants();
      await loadCulinaryItems(true);

      expect(restaurants.value).toEqual(mockRestos);
      expect(culinaryItems.value).toEqual(mockDishes);

      // Restaurants failure and exception
      vi.spyOn(api, 'getRestaurants').mockResolvedValue({ success: false });
      await loadRestaurants();
      expect(error.value).toBe('Gagal memuat rumah makan.');

      vi.spyOn(api, 'getRestaurants').mockRejectedValue(new Error('Resto err'));
      await loadRestaurants();
      expect(error.value).toBe('Gagal memuat data rumah makan.');

      // Culinary items exception
      vi.spyOn(api, 'getCulinary').mockRejectedValue(new Error('Dish err'));
      const dishes = await loadCulinaryItems();
      expect(dishes).toEqual([]);
    });
  });

  describe('useArticlesCatalog()', () => {
    it('loads articles and handles errors', async () => {
      const mockArticles = [{ id: 1, title: 'Sejarah Danau Toba' }];
      vi.spyOn(api, 'getArticles').mockResolvedValue({ success: true, data: mockArticles });

      const { items, error, loadArticles } = useArticlesCatalog();
      const res = await loadArticles();
      expect(res).toEqual(mockArticles);
      expect(items.value).toEqual(mockArticles);

      // Unsuccessful
      vi.spyOn(api, 'getArticles').mockResolvedValue({ success: false });
      const empty = await loadArticles();
      expect(empty).toEqual([]);
      expect(error.value).toBe('Gagal memuat artikel.');

      // Exception
      vi.spyOn(api, 'getArticles').mockRejectedValue(new Error('Articles crash'));
      const crash = await loadArticles();
      expect(crash).toEqual([]);
      expect(error.value).toBe('Gagal memuat artikel.');
    });
  });

  describe('useReviews()', () => {
    it('loads user reviews and handles empty/error cases', async () => {
      const mockReviews = [{ id: 1, reviewer_name: 'Budi' }];
      vi.spyOn(api, 'getReviews').mockResolvedValue({ success: true, data: mockReviews });

      const { reviews, error, loadUserReviews, loadEntityReviews, submitReview } = useReviews();

      // Empty user id
      const emptyIdRes = await loadUserReviews(null);
      expect(emptyIdRes).toEqual([]);

      // Valid user id
      const res = await loadUserReviews(42);
      expect(res).toEqual(mockReviews);
      expect(reviews.value).toEqual(mockReviews);

      // Unsuccessful user reviews response
      vi.spyOn(api, 'getReviews').mockResolvedValue({ success: false });
      const unsuccessUserRes = await loadUserReviews(42);
      expect(unsuccessUserRes).toEqual([]);

      // Exception in user reviews
      vi.spyOn(api, 'getReviews').mockRejectedValue(new Error('Rev err'));
      const errRes = await loadUserReviews(42);
      expect(errRes).toEqual([]);
      expect(error.value).toBe('Gagal memuat ulasan.');

      // Entity reviews success
      vi.spyOn(api, 'getReviews').mockResolvedValue({ success: true, data: mockReviews });
      const entRes = await loadEntityReviews('destination', 10);
      expect(entRes).toEqual(mockReviews);

      // Unsuccessful entity reviews response
      vi.spyOn(api, 'getReviews').mockResolvedValue({ success: false });
      const unsuccessEntRes = await loadEntityReviews('destination', 10);
      expect(unsuccessEntRes).toEqual([]);

      // Entity reviews exception
      vi.spyOn(api, 'getReviews').mockRejectedValue(new Error('Entity rev err'));
      const entErrRes = await loadEntityReviews('destination', 10);
      expect(entErrRes).toEqual([]);

      // Submit review success & fail
      vi.spyOn(api, 'submitReview').mockResolvedValue({ success: true });
      const subRes = await submitReview({ rating: 5 });
      expect(subRes.success).toBe(true);

      vi.spyOn(api, 'submitReview').mockRejectedValue(new Error('Submit crash'));
      const subFail = await submitReview({ rating: 1 });
      expect(subFail.success).toBe(false);
    });
  });
});
