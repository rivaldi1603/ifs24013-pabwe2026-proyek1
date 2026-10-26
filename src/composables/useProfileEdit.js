import { ref } from 'vue';
import { api } from '../api.js';
import { useAuth } from './useAuth.js';

export function useProfileEdit() {
  const { currentUser: user, setUser } = useAuth();
  const showEditModal = ref(false);
  const saving = ref(false);
  const editError = ref('');
  const saveSuccessMsg = ref('');

  function openEditModal() {
    editError.value = '';
    showEditModal.value = true;
  }

  function closeEditModal() {
    showEditModal.value = false;
    editError.value = '';
  }

  async function saveProfile(formData) {
    saving.value = true;
    editError.value = '';
    try {
      const res = await api.updateProfile(formData);

      if (res?.success && res.user) {
        setUser(res.user);
        showEditModal.value = false;
        saveSuccessMsg.value = 'Profil dan foto Anda berhasil diperbarui!';
        setTimeout(() => {
          saveSuccessMsg.value = '';
        }, 3500);
        return true;
      } else {
        editError.value = res?.message || 'Gagal menyimpan perubahan profil.';
        return false;
      }
    } catch (err) {
      console.error('Save profile error:', err);
      editError.value = 'Terjadi kesalahan server saat memperbarui profil.';
      return false;
    } finally {
      saving.value = false;
    }
  }

  return {
    user,
    showEditModal,
    saving,
    editError,
    saveSuccessMsg,
    openEditModal,
    closeEditModal,
    saveProfile
  };
}
