import { ref, shallowRef, computed } from 'vue';
import { useToast } from './useToast.js';
import { useConfirm } from './useConfirm.js';

/**
 * Generic Admin CRUD Manager Composable
 * Encapsulates entity state, modal visibility, form data, search filtering,
 * saving, and deletion with modern toast alerts and confirm modals.
 */
export function useAdminCrud({
  entityLabel = 'Data',
  fetchFn,
  createFn,
  updateFn,
  deleteFn,
  defaultForm = () => ({}),
  filterFn = () => true,
  onSuccess
} = {}) {
  const items = shallowRef([]);
  const loading = ref(false);
  const saving = ref(false);
  const modalOpen = ref(false);
  const form = ref(defaultForm());
  const searchQuery = ref('');

  const { success: toastSuccess, error: toastError } = useToast();
  const { confirm } = useConfirm();

  async function load() {
    if (!fetchFn) return;
    loading.value = true;
    try {
      const res = await fetchFn();
      if (res && res.success) {
        items.value = res.data || [];
      } else {
        items.value = [];
      }
    } catch (err) {
      console.error(`Failed to load ${entityLabel}:`, err);
    } finally {
      loading.value = false;
    }
  }

  function openAdd(initialOverrides = {}) {
    form.value = { ...defaultForm(), ...initialOverrides };
    modalOpen.value = true;
  }

  function openEdit(item) {
    form.value = { ...item };
    modalOpen.value = true;
  }

  function closeModal() {
    modalOpen.value = false;
  }

  async function save() {
    saving.value = true;
    try {
      const isEdit = Boolean(form.value.id);
      const res = isEdit
        ? await updateFn(form.value.id, form.value)
        : await createFn(form.value);

      if (res && res.success) {
        modalOpen.value = false;
        await load();
        toastSuccess(`${entityLabel} berhasil ${isEdit ? 'diperbarui' : 'disimpan'}!`);
        if (onSuccess) onSuccess(res.data);
        return true;
      } else {
        toastError(res?.message || `Gagal menyimpan ${entityLabel.toLowerCase()}.`);
        return false;
      }
    } catch (err) {
      console.error(`Error saving ${entityLabel}:`, err);
      toastError(`Terjadi kesalahan saat menyimpan ${entityLabel.toLowerCase()}.`);
      return false;
    } finally {
      saving.value = false;
    }
  }

  async function remove(id, displayLabel) {
    const label = displayLabel || `${entityLabel} #${id}`;
    const confirmed = await confirm({
      title: `Hapus ${entityLabel}`,
      message: `Apakah Anda yakin ingin menghapus "${label}"? Tindakan ini tidak dapat dibatalkan.`,
      confirmText: 'Ya, Hapus',
      cancelText: 'Batal',
      danger: true
    });

    if (!confirmed) return false;

    try {
      const res = await deleteFn(id);
      if (res && res.success) {
        await load();
        toastSuccess(`${entityLabel} "${label}" berhasil dihapus.`);
        return true;
      } else {
        toastError(res?.message || `Gagal menghapus ${entityLabel.toLowerCase()}.`);
        return false;
      }
    } catch (err) {
      console.error(`Error deleting ${entityLabel}:`, err);
      toastError(`Terjadi kesalahan saat menghapus ${entityLabel.toLowerCase()}.`);
      return false;
    }
  }

  const filteredItems = computed(() => {
    const q = searchQuery.value.trim().toLowerCase();
    if (!q) return items.value;
    return items.value.filter(item => filterFn(item, q));
  });

  return {
    items,
    loading,
    saving,
    modalOpen,
    form,
    searchQuery,
    filteredItems,
    load,
    openAdd,
    openEdit,
    closeModal,
    save,
    remove
  };
}
