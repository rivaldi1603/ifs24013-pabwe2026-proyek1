import { ref, shallowRef, computed } from 'vue';
import { api } from '../api.js';
import { useToast } from './useToast.js';

export function useAdminUsers() {
  const usersList = shallowRef([]);
  const loading = ref(false);
  const searchQuery = ref('');
  const { error: toastError } = useToast();

  async function loadUsers() {
    loading.value = true;
    try {
      const res = await api.getUsers();
      if (res?.success) {
        usersList.value = res.data || [];
      }
    } catch (err) {
      console.error('Error fetching admin users:', err);
      toastError('Gagal memuat data pengguna.');
    } finally {
      loading.value = false;
    }
  }

  const filteredUsers = computed(() => {
    const q = searchQuery.value.trim().toLowerCase();
    if (!q) return usersList.value;
    return usersList.value.filter(u =>
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.organization && u.organization.toLowerCase().includes(q))
    );
  });

  return {
    usersList,
    loading,
    searchQuery,
    filteredUsers,
    loadUsers
  };
}
