<template>
  <div
    v-if="modelValue"
    class="modal-overlay"
    @click.self="onBackdropClick"
  >
    <dialog
      ref="modalCardRef"
      class="modal-card"
      :style="{ '--modal-max-w': maxWidth }"
      open
      aria-labelledby="modal-title-heading"
    >
      <div class="modal-header">
        <slot name="header">
          <h2 id="modal-title-heading" class="modal-title">{{ title }}</h2>
        </slot>
        <button
          type="button"
          class="modal-close-btn"
          aria-label="Tutup jendela modal"
          @click="close"
        >
          &times;
        </button>
      </div>

      <form @submit.prevent="$emit('submit')" class="modal-form-grid" novalidate>
        <slot></slot>

        <slot name="footer">
          <div class="modal-actions full-width">
            <button
              type="button"
              class="btn btn-secondary"
              @click="close"
            >
              {{ cancelText }}
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="saving"
            >
              {{ saving ? 'Menyimpan...' : submitText }}
            </button>
          </div>
        </slot>
      </form>
    </dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useFocusTrap } from '../../composables/useFocusTrap.js';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Formulir Data'
  },
  saving: {
    type: Boolean,
    default: false
  },
  submitText: {
    type: String,
    default: 'Simpan Data'
  },
  cancelText: {
    type: String,
    default: 'Batal'
  },
  maxWidth: {
    type: String,
    default: '680px'
  },
  closeOnBackdrop: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['update:modelValue', 'submit', 'close']);

const modalCardRef = ref(null);

function close() {
  emit('update:modelValue', false);
  emit('close');
}

function onBackdropClick() {
  if (props.closeOnBackdrop) {
    close();
  }
}

// Strict accessibility focus trap and ESC key handling
useFocusTrap(modalCardRef, () => props.modelValue, {
  onClose: close,
  autoFocus: true,
  restoreFocus: true,
  lockScroll: true
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  overflow-y: auto;
}

.modal-card {
  background: #ffffff;
  border-radius: 16px;
  border: none;
  padding: 0;
  margin: 0;
  color: inherit;
  width: 100%;
  max-width: var(--modal-max-w, 680px);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  animation: modalSlide 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-header {
  padding: 1.25rem 1.75rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f8fafc;
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
}

.modal-close-btn {
  background: transparent;
  border: none;
  font-size: 1.75rem;
  line-height: 1;
  color: #64748b;
  cursor: pointer;
  border-radius: 8px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.modal-close-btn:hover,
.modal-close-btn:focus-visible {
  background: #e2e8f0;
  color: #0f172a;
  outline: 2px solid #0f766e;
}

.modal-form-grid {
  padding: 1.5rem 1.75rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.15rem;
  overflow-y: auto;
}

:deep(.full-width) {
  grid-column: 1 / -1;
}

:deep(.form-group) {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

:deep(.form-label) {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
}

:deep(.form-input),
:deep(.form-select),
:deep(.form-textarea) {
  padding: 0.65rem 0.85rem;
  border: 1px solid #94a3b8;
  border-radius: 8px;
  font-size: 0.925rem;
  color: #0f172a;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  background: #ffffff;
}

:deep(.form-input:focus),
:deep(.form-select:focus),
:deep(.form-textarea:focus) {
  border-color: #0f766e;
  box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.2);
}

:deep(.input-error) {
  border-color: #dc2626 !important;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.2) !important;
}

:deep(.field-error-msg) {
  font-size: 0.8rem;
  color: #b91c1c;
  font-weight: 600;
  margin-top: 0.2rem;
}

:deep(.form-checkbox-label) {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  font-size: 0.9rem;
  color: #1e293b;
  cursor: pointer;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.btn {
  padding: 0.65rem 1.35rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.925rem;
  cursor: pointer;
  border: none;
  transition: all 0.15s ease;
}

.btn-secondary {
  background: #f1f5f9;
  color: #334155;
  border: 1px solid #cbd5e1;
}

.btn-secondary:hover {
  background: #e2e8f0;
  color: #0f172a;
}

/* High contrast primary button meeting WCAG AA (>= 5.5:1 ratio) */
.btn-primary {
  background: #0f766e;
  color: #ffffff;
}

.btn-primary:hover:not(:disabled) {
  background: #0b5e58;
}

.btn-primary:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

@keyframes modalSlide {
  from {
    opacity: 0;
    transform: translateY(15px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (max-width: 640px) {
  .modal-form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
