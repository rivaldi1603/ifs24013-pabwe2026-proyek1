<template>
  <Transition name="modal-fade">
    <div
      v-if="confirmState.isOpen"
      class="confirm-overlay"
      @click.self="handleCancel"
    >
      <dialog
        ref="confirmCardRef"
        class="confirm-card"
        open
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-msg"
      >
        <div class="confirm-header" :class="{ 'is-danger': confirmState.danger }">
          <div class="confirm-icon">
            <span v-if="confirmState.danger">⚠</span>
            <span v-else>?</span>
          </div>
          <h3 id="confirm-modal-title" class="confirm-title">{{ confirmState.title }}</h3>
        </div>
        <div class="confirm-body">
          <p id="confirm-modal-msg" class="confirm-message">{{ confirmState.message }}</p>
        </div>
        <div class="confirm-actions">
          <button
            type="button"
            class="btn btn-secondary"
            @click="handleCancel"
          >
            {{ confirmState.cancelText }}
          </button>
          <button
            type="button"
            class="btn"
            :class="confirmState.danger ? 'btn-danger' : 'btn-primary'"
            @click="handleConfirm"
          >
            {{ confirmState.confirmText }}
          </button>
        </div>
      </dialog>
    </div>
  </Transition>
</template>

<script setup>
import { ref } from 'vue';
import { useConfirm } from '../../composables/useConfirm.js';
import { useFocusTrap } from '../../composables/useFocusTrap.js';

const { confirmState, handleConfirm, handleCancel } = useConfirm();
const confirmCardRef = ref(null);

useFocusTrap(confirmCardRef, () => confirmState.value.isOpen, {
  onClose: handleCancel,
  autoFocus: true,
  restoreFocus: true,
  lockScroll: true
});
</script>

<style scoped>
.confirm-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  z-index: 99998;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.confirm-card {
  background: #ffffff;
  border-radius: 14px;
  border: none;
  padding: 0;
  margin: 0;
  color: inherit;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  animation: scaleUp 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.confirm-header {
  padding: 1.25rem 1.5rem 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

/* High contrast icons meeting WCAG AA standards */
.confirm-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #e0f2fe;
  color: #0369a1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.15rem;
  flex-shrink: 0;
}

.confirm-header.is-danger .confirm-icon {
  background: #fee2e2;
  color: #991b1b;
}

.confirm-title {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
  color: #0f172a;
}

.confirm-body {
  padding: 0.5rem 1.5rem 1.25rem;
}

.confirm-message {
  margin: 0;
  color: #334155;
  font-size: 0.95rem;
  line-height: 1.5;
}

.confirm-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
}

.btn {
  padding: 0.55rem 1.15rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  border: none;
  transition: all 0.15s ease;
}

.btn-secondary {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #334155;
}

.btn-secondary:hover,
.btn-secondary:focus-visible {
  background: #f1f5f9;
  outline: 2px solid #0f766e;
}

/* High contrast primary and danger buttons meeting WCAG AA (>= 4.5:1 ratio) */
.btn-primary {
  background: #0f766e;
  color: #ffffff;
}

.btn-primary:hover,
.btn-primary:focus-visible {
  background: #0b5e58;
  outline: 2px solid #0f766e;
}

.btn-danger {
  background: #b91c1c;
  color: #ffffff;
}

.btn-danger:hover,
.btn-danger:focus-visible {
  background: #991b1b;
  outline: 2px solid #991b1b;
}

@keyframes scaleUp {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
