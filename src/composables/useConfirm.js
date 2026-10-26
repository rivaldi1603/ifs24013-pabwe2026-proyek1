import { ref } from 'vue';

const confirmState = ref({
  isOpen: false,
  title: 'Konfirmasi Tindakan',
  message: '',
  confirmText: 'Ya, Lanjutkan',
  cancelText: 'Batal',
  danger: false,
  resolve: null
});

/**
 * Modern Confirm Dialog Composable
 * Provides an asynchronous, accessible dialog replacing window.confirm()
 */
export function useConfirm() {
  function confirm({
    title = 'Konfirmasi Tindakan',
    message = 'Apakah Anda yakin ingin melanjutkan tindakan ini?',
    confirmText = 'Ya, Lanjutkan',
    cancelText = 'Batal',
    danger = false
  } = {}) {
    return new Promise((resolve) => {
      confirmState.value = {
        isOpen: true,
        title,
        message,
        confirmText,
        cancelText,
        danger,
        resolve
      };
    });
  }

  function handleConfirm() {
    if (confirmState.value.resolve) {
      confirmState.value.resolve(true);
    }
    confirmState.value.isOpen = false;
  }

  function handleCancel() {
    if (confirmState.value.resolve) {
      confirmState.value.resolve(false);
    }
    confirmState.value.isOpen = false;
  }

  return {
    confirmState,
    confirm,
    handleConfirm,
    handleCancel
  };
}
