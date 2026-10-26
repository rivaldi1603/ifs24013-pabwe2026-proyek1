import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ref, nextTick } from 'vue';
import { useFocusTrap } from '../composables/useFocusTrap.js';

describe('useFocusTrap composable', () => {
  let container;
  let input1;
  let button1;
  let link1;

  beforeEach(() => {
    container = document.createElement('div');
    input1 = document.createElement('input');
    button1 = document.createElement('button');
    link1 = document.createElement('a');
    link1.setAttribute('href', '#');

    container.appendChild(input1);
    container.appendChild(button1);
    container.appendChild(link1);
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (container.parentNode) {
      document.body.removeChild(container);
    }
    document.body.style.overflow = '';
  });

  it('initializes and traps focus between first and last elements', async () => {
    const isActive = ref(true);
    const containerRef = ref(container);
    const onClose = vi.fn();

    const { handleKeydown, getFocusableElements } = useFocusTrap(containerRef, isActive, {
      onClose,
      autoFocus: true,
      restoreFocus: true,
      lockScroll: true
    });

    await nextTick();
    expect(document.body.style.overflow).toBe('hidden');

    const focusables = getFocusableElements();
    expect(focusables.length).toBe(3);

    // Press Escape
    handleKeydown(new KeyboardEvent('keydown', { key: 'Escape', cancelable: true }));
    expect(onClose).toHaveBeenCalled();

    // Tab on last element should cycle to first
    link1.focus();
    const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', cancelable: true });
    const preventSpy = vi.spyOn(tabEvent, 'preventDefault');
    handleKeydown(tabEvent);
    expect(preventSpy).toHaveBeenCalled();

    // Shift+Tab on first element should cycle to last
    input1.focus();
    const shiftTabEvent = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, cancelable: true });
    const shiftPreventSpy = vi.spyOn(shiftTabEvent, 'preventDefault');
    handleKeydown(shiftTabEvent);
    expect(shiftPreventSpy).toHaveBeenCalled();
  });

  it('deactivates and restores body overflow when isActive becomes false', async () => {
    const isActive = ref(true);
    const containerRef = ref(container);

    useFocusTrap(containerRef, isActive, { lockScroll: true });
    await nextTick();
    expect(document.body.style.overflow).toBe('hidden');

    isActive.value = false;
    await nextTick();
    expect(document.body.style.overflow).toBe('');
  });

  it('handles empty container gracefully', () => {
    const emptyContainer = document.createElement('div');
    document.body.appendChild(emptyContainer);

    const isActive = ref(true);
    const containerRef = ref(emptyContainer);
    const { handleKeydown, getFocusableElements } = useFocusTrap(containerRef, isActive);

    expect(getFocusableElements()).toHaveLength(0);

    const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', cancelable: true });
    const preventSpy = vi.spyOn(tabEvent, 'preventDefault');
    handleKeydown(tabEvent);
    expect(preventSpy).toHaveBeenCalled();

    document.body.removeChild(emptyContainer);
  });
});
