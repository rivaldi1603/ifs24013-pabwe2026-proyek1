<template>
  <div
    v-if="modelValue"
    class="modal-overlay"
    @click.self="onBackdropClick"
    @keydown.esc="close"
    role="dialog"
    aria-modal="true"
    tabindex="-1"
  >
    <div class="modal-card" :style="{ maxWidth: maxWidth }">
      <div class="modal-header">
        <slot name="header">
          <h2 class="modal-title">{{ title }}</h2>
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

      <form @submit.prevent="$emit('submit')" class="modal-form-grid">
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
    </div>
  </div>
</template>

<script setup>
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

function close() {
  emit('update:modelValue', false);
  emit('close');
}

function onBackdropClick() {
  if (props.closeOnBackdrop) {
    close();
  }
}
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
  width: 100%;
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
  color: #94a3b8;
  cursor: pointer;
  border-radius: 8px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.modal-close-btn:hover {
  background: #e2e8f0;
  color: #1e293b;
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
  color: #334155;
}

:deep(.form-input),
:deep(.form-select),
:deep(.form-textarea) {
  padding: 0.65rem 0.85rem;
  border: 1px solid #cbd5e1;
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
  border-color: #0d9488;
  box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.15);
}

:deep(.form-checkbox-label) {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  font-size: 0.9rem;
  color: #334155;
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
  color: #475569;
}

.btn-secondary:hover {
  background: #e2e8f0;
  color: #1e293b;
}

.btn-primary {
  background: #0d9488;
  color: #ffffff;
}

.btn-primary:hover:not(:disabled) {
  background: #0f766e;
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
