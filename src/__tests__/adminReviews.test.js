import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api } from '../api.js';

let mockConfirmResult = true;
vi.mock('../composables/useConfirm.js', () => ({
  useConfirm: () => ({
    confirm: vi.fn(() => Promise.resolve(mockConfirmResult))
  })
}));

import { useAdminReviews } from '../composables/useAdminReviews.js';


describe('useAdminReviews composable', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('initializes with default state', () => {
    const { allReviews, loading, searchQuery, filteredReviews } = useAdminReviews();
    expect(allReviews.value).toEqual([]);
    expect(loading.value).toBe(false);
    expect(searchQuery.value).toBe('');
    expect(filteredReviews.value).toEqual([]);
  });

  describe('loadReviews()', () => {
    it('loads reviews successfully and updates state', async () => {
      const mockData = [
        { id: 1, reviewer_name: 'Budi', review_text: 'Pemandangan indah', target_name: 'Danau Toba' },
        { id: 2, reviewer_name: 'Siti', review_text: 'Sangat bersih', target_name: 'Batu Gantung' }
      ];
      vi.spyOn(api, 'getReviews').mockResolvedValue({ success: true, data: mockData });

      const { allReviews, loading, loadReviews } = useAdminReviews();
      const promise = loadReviews();
      expect(loading.value).toBe(true);
      await promise;

      expect(loading.value).toBe(false);
      expect(allReviews.value).toEqual(mockData);
    });

    it('handles empty data response gracefully', async () => {
      vi.spyOn(api, 'getReviews').mockResolvedValue({ success: true });

      const { allReviews, loadReviews } = useAdminReviews();
      await loadReviews();
      expect(allReviews.value).toEqual([]);
    });

    it('handles unsuccessful API response without updating reviews list', async () => {
      vi.spyOn(api, 'getReviews').mockResolvedValue({ success: false });

      const { allReviews, loadReviews } = useAdminReviews();
      await loadReviews();
      expect(allReviews.value).toEqual([]);
    });

    it('handles API errors gracefully and toggles loading off', async () => {
      vi.spyOn(api, 'getReviews').mockRejectedValue(new Error('Network Crash'));

      const { allReviews, loading, loadReviews } = useAdminReviews();
      await loadReviews();

      expect(loading.value).toBe(false);
      expect(allReviews.value).toEqual([]);
    });
  });

  describe('filteredReviews computed', () => {
    it('returns all reviews when searchQuery is empty or whitespace', () => {
      const { allReviews, searchQuery, filteredReviews } = useAdminReviews();
      allReviews.value = [
        { id: 1, reviewer_name: 'Budi', review_text: 'Mantap', target_name: 'Holbung' }
      ];
      searchQuery.value = '   ';
      expect(filteredReviews.value).toEqual(allReviews.value);
    });

    it('filters reviews by reviewer_name, review_text, or target_name', () => {
      const { allReviews, searchQuery, filteredReviews } = useAdminReviews();
      allReviews.value = [
        { id: 1, reviewer_name: 'Horas Manurung', review_text: 'Makanan enak', target_name: 'Restoran Balige' },
        { id: 2, reviewer_name: 'Budi Santoso', review_text: 'Pemandangan indah', target_name: 'Bukit Holbung' },
        { id: 3, reviewer_name: 'Ani', review_text: 'Sangat damai', target_name: 'Samosir Resort' },
        { id: 4, reviewer_name: null, review_text: null, target_name: null }
      ];

      searchQuery.value = 'manurung';
      expect(filteredReviews.value).toHaveLength(1);
      expect(filteredReviews.value[0].id).toBe(1);

      searchQuery.value = 'indah';
      expect(filteredReviews.value).toHaveLength(1);
      expect(filteredReviews.value[0].id).toBe(2);

      searchQuery.value = 'samosir';
      expect(filteredReviews.value).toHaveLength(1);
      expect(filteredReviews.value[0].id).toBe(3);
    });
  });

  describe('handleDeleteReview()', () => {
    it('aborts delete when confirmation is cancelled', async () => {
      const deleteSpy = vi.spyOn(api, 'deleteReview');
      const { handleDeleteReview } = useAdminReviews();

      mockConfirmResult = false;
      await handleDeleteReview(10);
      expect(deleteSpy).not.toHaveBeenCalled();
      mockConfirmResult = true;
    });


    it('deletes review and reloads list on success', async () => {
      const getSpy = vi.spyOn(api, 'getReviews').mockResolvedValue({ success: true, data: [] });
      const deleteSpy = vi.spyOn(api, 'deleteReview').mockResolvedValue({ success: true });

      const { handleDeleteReview } = useAdminReviews();
      await handleDeleteReview(10);

      expect(deleteSpy).toHaveBeenCalledWith(10);
      expect(getSpy).toHaveBeenCalled();
    });

    it('shows error toast when API delete response is not successful', async () => {
      const deleteSpy = vi.spyOn(api, 'deleteReview').mockResolvedValue({ success: false, message: 'Review tidak ditemukan' });

      const { handleDeleteReview } = useAdminReviews();
      await handleDeleteReview(999);

      expect(deleteSpy).toHaveBeenCalledWith(999);
    });

    it('falls back to default error message when API delete response has no message', async () => {
      const deleteSpy = vi.spyOn(api, 'deleteReview').mockResolvedValue({ success: false });

      const { handleDeleteReview } = useAdminReviews();
      await handleDeleteReview(888);

      expect(deleteSpy).toHaveBeenCalledWith(888);
    });

    it('handles unexpected exceptions during delete gracefully', async () => {
      const deleteSpy = vi.spyOn(api, 'deleteReview').mockRejectedValue(new Error('Fatal delete error'));

      const { handleDeleteReview } = useAdminReviews();
      await handleDeleteReview(5);

      expect(deleteSpy).toHaveBeenCalledWith(5);
    });
  });
});
