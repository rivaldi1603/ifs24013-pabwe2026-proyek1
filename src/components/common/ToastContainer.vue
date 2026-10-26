<template>
  <div class="toast-container" role="region" aria-label="Notifikasi Aplikasi" aria-live="polite">
    <TransitionGroup name="toast-fade">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast-item"
        :class="`toast-${toast.type}`"
        role="alert"
      >
        <div class="toast-icon">
          <span v-if="toast.type === 'success'">✓</span>
          <span v-else-if="toast.type === 'error'">✕</span>
          <span v-else-if="toast.type === 'warning'">⚠</span>
          <span v-else>ℹ</span>
        </div>
        <div class="toast-message">{{ toast.message }}</div>
        <button
          type="button"
          class="toast-close"
          aria-label="Tutup notifikasi"
          @click="remove(toast.id)"
        >
          &times;
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { useToast } from '../../composables/useToast.js';

const { toasts, remove } = useToast();
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 99999;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  pointer-events: none;
  max-width: 420px;
  width: calc(100vw - 3rem);
}

.toast-item {
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1.15rem;
  border-radius: 10px;
  background: #ffffff;
  color: #1f2937;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  border-left: 5px solid #0d9488;
  font-size: 0.925rem;
  line-height: 1.4;
  word-break: break-word;
}

.toast-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.85rem;
  flex-shrink: 0;
}

.toast-success {
  border-left-color: #10b981;
}
.toast-success .toast-icon {
  background: #d1fae5;
  color: #065f46;
}

.toast-error {
  border-left-color: #ef4444;
}
.toast-error .toast-icon {
  background: #fee2e2;
  color: #991b1b;
}

.toast-warning {
  border-left-color: #f59e0b;
}
.toast-warning .toast-icon {
  background: #fef3c7;
  color: #92400e;
}

.toast-info {
  border-left-color: #3b82f6;
}
.toast-info .toast-icon {
  background: #dbeafe;
  color: #1e40af;
}

.toast-message {
  flex: 1;
}

.toast-close {
  background: transparent;
  border: none;
  color: #9ca3af;
  font-size: 1.25rem;
  line-height: 1;
  cursor: pointer;
  padding: 0 0.25rem;
  transition: color 0.15s ease;
}

.toast-close:hover {
  color: #374151;
}

/* Transitions */
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.25s ease-out;
}

.toast-fade-enter-from {
  opacity: 0;
  transform: translateX(30px) scale(0.95);
}

.toast-fade-leave-to {
  opacity: 0;
  transform: translateX(30px) scale(0.9);
}
</style>
