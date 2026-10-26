<template>
  <Transition name="modal-fade">
    <div
      v-if="confirmState.isOpen"
      class="confirm-overlay"
      @click.self="handleCancel"
      @keydown.esc="handleCancel"
      role="dialog"
      aria-modal="true"
      :aria-label="confirmState.title"
      tabindex="-1"
    >
      <div class="confirm-card">
        <div class="confirm-header" :class="{ 'is-danger': confirmState.danger }">
          <div class="confirm-icon">
            <span v-if="confirmState.danger">⚠</span>
            <span v-else>?</span>
          </div>
          <h3 class="confirm-title">{{ confirmState.title }}</h3>
        </div>
        <div class="confirm-body">
          <p class="confirm-message">{{ confirmState.message }}</p>
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
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { useConfirm } from '../../composables/useConfirm.js';

const { confirmState, handleConfirm, handleCancel } = useConfirm();
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

.confirm-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #e0f2fe;
  color: #0284c7;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.15rem;
  flex-shrink: 0;
}

.confirm-header.is-danger .confirm-icon {
  background: #fee2e2;
  color: #dc2626;
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
  color: #475569;
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

.btn-secondary:hover {
  background: #f1f5f9;
}

.btn-primary {
  background: #0d9488;
  color: #ffffff;
}

.btn-primary:hover {
  background: #0f766e;
}

.btn-danger {
  background: #dc2626;
  color: #ffffff;
}

.btn-danger:hover {
  background: #b91c1c;
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
