import { ref, shallowRef, computed } from 'vue';
import { api } from '../api.js';
import { useToast } from './useToast.js';
import { useConfirm } from './useConfirm.js';

export function useAdminReviews() {
  const allReviews = shallowRef([]);
  const loading = ref(false);
  const searchQuery = ref('');
  const { confirm } = useConfirm();
  const { success: toastSuccess, error: toastError } = useToast();

  async function loadReviews() {
    loading.value = true;
    try {
      const res = await api.getReviews({ limit: 100 });
      if (res?.success) {
        allReviews.value = res.data || [];
      }
    } catch (err) {
      console.error('Error fetching admin reviews:', err);
      toastError('Gagal memuat moderasi ulasan.');
    } finally {
      loading.value = false;
    }
  }

  const filteredReviews = computed(() => {
    const q = searchQuery.value.trim().toLowerCase();
    if (!q) return allReviews.value;
    return allReviews.value.filter(r =>
      r.reviewer_name?.toLowerCase().includes(q) ||
      r.review_text?.toLowerCase().includes(q) ||
      r.target_name?.toLowerCase().includes(q)
    );
  });

  async function handleDeleteReview(id) {
    const confirmed = await confirm({
      title: 'Hapus Ulasan',
      message: `Apakah Anda yakin ingin menghapus ulasan #${id}? Tindakan ini permanen.`,
      confirmText: 'Ya, Hapus',
      cancelText: 'Batal',
      danger: true
    });
    if (!confirmed) return;

    try {
      const res = await api.deleteReview(id);
      if (res?.success) {
        await loadReviews();
        toastSuccess(`Ulasan #${id} berhasil dihapus.`);
      } else {
        toastError(res?.message || 'Gagal menghapus ulasan.');
      }
    } catch (err) {
      console.error('Error deleting review:', err);
      toastError('Terjadi kesalahan saat menghapus ulasan.');
    }
  }

  return {
    allReviews,
    loading,
    searchQuery,
    filteredReviews,
    loadReviews,
    handleDeleteReview
  };
}
