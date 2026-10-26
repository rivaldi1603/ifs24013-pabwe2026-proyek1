import { ref } from 'vue';

const toasts = ref([]);
let nextId = 1;

/**
 * Toast Notification Composable
 * Provides non-blocking, modern notification states replacing native window.alert()
 */
export function useToast() {
  function add(message, type = 'info', duration = 4000) {
    const id = nextId++;
    const toast = {
      id,
      message,
      type, // 'success' | 'error' | 'warning' | 'info'
      createdAt: Date.now()
    };

    toasts.value.push(toast);

    if (duration > 0) {
      setTimeout(() => {
        remove(id);
      }, duration);
    }

    return id;
  }

  function remove(id) {
    const index = toasts.value.findIndex(t => t.id === id);
    if (index !== -1) {
      toasts.value.splice(index, 1);
    }
  }

  function clear() {
    toasts.value = [];
  }

  return {
    toasts,
    add,
    remove,
    clear,
    success: (msg, dur = 3500) => add(msg, 'success', dur),
    error: (msg, dur = 5000) => add(msg, 'error', dur),
    warning: (msg, dur = 4000) => add(msg, 'warning', dur),
    info: (msg, dur = 3500) => add(msg, 'info', dur)
  };
}
