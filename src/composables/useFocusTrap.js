import { watch, onUnmounted, nextTick, getCurrentInstance } from 'vue';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(', ');

/**
 * Checks if a DOM element is visible to the user and keyboard focusable.
 * @param {HTMLElement} el
 * @returns {boolean}
 */
export function isElementVisible(el) {
  if (el.hasAttribute('hidden')) return false;
  if (el.style.display === 'none') return false;
  if (el.style.visibility === 'hidden') return false;
  return true;
}

/**
 * Focus Trap Composable (useFocusTrap)
 * Ensures strict modal accessibility by trapping keyboard navigation within the modal,
 * preventing background scrolling, auto-focusing elements, and restoring focus upon closing.
 *
 * @param {import('vue').Ref<HTMLElement|null>} containerRef - Ref pointing to the modal container
 * @param {import('vue').Ref<boolean> | Function} isActive - Reactive boolean or getter for modal open state
 * @param {object} [options]
 * @param {Function} [options.onClose] - Callback fired when Escape is pressed
 * @param {boolean} [options.autoFocus=true] - Whether to auto-focus the first element
 * @param {boolean} [options.restoreFocus=true] - Whether to return focus to previous element on close
 * @param {boolean} [options.lockScroll=true] - Whether to lock body overflow while open
 */
export function useFocusTrap(containerRef, isActive, options = {}) {
  const {
    onClose = () => {},
    autoFocus = true,
    restoreFocus = true,
    lockScroll = true
  } = options;

  let previouslyFocusedElement = null;

  function getFocusableElements() {
    if (!containerRef.value) return [];
    return Array.from(
      containerRef.value.querySelectorAll(FOCUSABLE_SELECTOR)
    ).filter(isElementVisible);
  }

  function handleKeydown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
      return;
    }

    if (event.key === 'Tab') {
      const focusables = getFocusableElements();
      if (focusables.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusables[0];
      const lastElement = focusables[focusables.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === firstElement || !containerRef.value.contains(document.activeElement)) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement || !containerRef.value.contains(document.activeElement)) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  }

  function activate() {
    previouslyFocusedElement = document.activeElement;

    if (lockScroll && document.body) {
      document.body.style.overflow = 'hidden';
    }

    window.addEventListener('keydown', handleKeydown);

    nextTick(() => {
      if (autoFocus && containerRef.value) {
        const focusables = getFocusableElements();
        if (focusables.length > 0) {
          focusables[0].focus();
        } else {
          containerRef.value.setAttribute('tabindex', '-1');
          containerRef.value.focus();
        }
      }
    });
  }

  function deactivate() {
    window.removeEventListener('keydown', handleKeydown);

    if (lockScroll && document.body) {
      document.body.style.overflow = '';
    }

    if (restoreFocus && previouslyFocusedElement?.focus) {
      try {
        previouslyFocusedElement.focus();
      } catch {
        // Ignore unmounted elements
      }
    }
    previouslyFocusedElement = null;
  }

  watch(
    () => (typeof isActive === 'function' ? isActive() : isActive.value),
    (active) => {
      if (active) {
        activate();
      } else {
        deactivate();
      }
    },
    { immediate: true }
  );

  if (getCurrentInstance()) {
    onUnmounted(() => {
      deactivate();
    });
  }

  return {
    activate,
    deactivate,
    getFocusableElements,
    handleKeydown
  };
}
