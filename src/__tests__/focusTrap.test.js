import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ref, nextTick, defineComponent } from 'vue';
import { mount } from '@vue/test-utils';
import { useFocusTrap, isElementVisible } from '../composables/useFocusTrap.js';

describe('useFocusTrap composable and visibility helpers', () => {
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

  it('evaluates isElementVisible correctly for all visibility styles', () => {
    const el = document.createElement('div');
    expect(isElementVisible(el)).toBe(true);

    el.setAttribute('hidden', '');
    expect(isElementVisible(el)).toBe(false);

    el.removeAttribute('hidden');
    el.style.display = 'none';
    expect(isElementVisible(el)).toBe(false);

    el.style.display = 'block';
    el.style.visibility = 'hidden';
    expect(isElementVisible(el)).toBe(false);
  });

  it('returns empty array when containerRef is null', () => {
    const containerRef = ref(null);
    const { getFocusableElements } = useFocusTrap(containerRef, ref(false));
    expect(getFocusableElements()).toEqual([]);
  });

  it('traps focus between first and last elements on forward and backward Tab', async () => {
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
    expect(focusables).toHaveLength(3);

    // Escape closes trap
    const escEvent = new KeyboardEvent('keydown', { key: 'Escape', cancelable: true });
    const escSpy = vi.spyOn(escEvent, 'preventDefault');
    handleKeydown(escEvent);
    expect(escSpy).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();

    // Normal non-Tab key does nothing
    handleKeydown(new KeyboardEvent('keydown', { key: 'Enter', cancelable: true }));

    // Tab key forward when on last element -> cycles to first
    link1.focus();
    const tabLastEvent = new KeyboardEvent('keydown', { key: 'Tab', cancelable: true });
    const preventLastSpy = vi.spyOn(tabLastEvent, 'preventDefault');
    handleKeydown(tabLastEvent);
    expect(preventLastSpy).toHaveBeenCalled();

    // Tab forward when focus is outside container -> focuses first
    const outsideBtn = document.createElement('button');
    document.body.appendChild(outsideBtn);
    outsideBtn.focus();
    expect(container.contains(document.activeElement)).toBe(false);

    const tabOutsideEvent = new KeyboardEvent('keydown', { key: 'Tab', cancelable: true });
    const preventOutsideSpy = vi.spyOn(tabOutsideEvent, 'preventDefault');
    handleKeydown(tabOutsideEvent);
    expect(preventOutsideSpy).toHaveBeenCalled();

    // Tab backward (Shift+Tab) on first element -> cycles to last
    input1.focus();
    const shiftFirstEvent = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, cancelable: true });
    const preventShiftFirstSpy = vi.spyOn(shiftFirstEvent, 'preventDefault');
    handleKeydown(shiftFirstEvent);
    expect(preventShiftFirstSpy).toHaveBeenCalled();

    // Tab backward when focus is outside container -> cycles to last
    outsideBtn.focus();
    const shiftOutsideEvent = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, cancelable: true });
    const preventShiftOutsideSpy = vi.spyOn(shiftOutsideEvent, 'preventDefault');
    handleKeydown(shiftOutsideEvent);
    expect(preventShiftOutsideSpy).toHaveBeenCalled();

    document.body.removeChild(outsideBtn);
  });

  it('handles empty container and focuses container with tabindex -1', async () => {
    const emptyContainer = document.createElement('div');
    document.body.appendChild(emptyContainer);

    const isActive = ref(true);
    const containerRef = ref(emptyContainer);
    const { handleKeydown } = useFocusTrap(containerRef, isActive);

    await nextTick();
    expect(emptyContainer.getAttribute('tabindex')).toBe('-1');

    // Tab on empty container prevents default
    const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', cancelable: true });
    const tabSpy = vi.spyOn(tabEvent, 'preventDefault');
    handleKeydown(tabEvent);
    expect(tabSpy).toHaveBeenCalled();

    document.body.removeChild(emptyContainer);
  });

  it('restores focus to previous element on deactivate', async () => {
    const triggerBtn = document.createElement('button');
    document.body.appendChild(triggerBtn);
    triggerBtn.focus();
    expect(document.activeElement).toBe(triggerBtn);

    const isActive = ref(true);
    const containerRef = ref(container);

    useFocusTrap(containerRef, isActive, { restoreFocus: true });
    await nextTick();

    isActive.value = false;
    await nextTick();
    expect(document.activeElement).toBe(triggerBtn);

    document.body.removeChild(triggerBtn);
  });

  it('handles error gracefully when previous element focus throws', async () => {
    const faultyElement = {
      focus() {
        throw new Error('Focus error');
      }
    };
    const prevActive = document.activeElement;
    Object.defineProperty(document, 'activeElement', {
      value: faultyElement,
      configurable: true
    });

    const isActive = ref(true);
    const containerRef = ref(container);
    useFocusTrap(containerRef, isActive);
    await nextTick();

    expect(() => {
      isActive.value = false;
    }).not.toThrow();

    delete document.activeElement;
  });

  it('allows natural tab traversal on middle elements without preventing default', async () => {
    const isActive = ref(true);
    const containerRef = ref(container);
    const { handleKeydown } = useFocusTrap(containerRef, isActive);

    await nextTick();
    button1.focus(); // middle element

    const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', cancelable: true });
    const tabSpy = vi.spyOn(tabEvent, 'preventDefault');
    handleKeydown(tabEvent);
    expect(tabSpy).not.toHaveBeenCalled();

    const shiftEvent = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, cancelable: true });
    const shiftSpy = vi.spyOn(shiftEvent, 'preventDefault');
    handleKeydown(shiftEvent);
    expect(shiftSpy).not.toHaveBeenCalled();
  });

  it('supports reactive getter function for isActive', async () => {
    let activeState = false;
    const containerRef = ref(container);
    useFocusTrap(containerRef, () => activeState);

    expect(document.body.style.overflow).toBe('');
  });

  it('honors autoFocus false, lockScroll false, restoreFocus false, and default onClose', async () => {
    const isActive = ref(true);
    const containerRef = ref(container);

    const { handleKeydown } = useFocusTrap(containerRef, isActive, {
      autoFocus: false,
      lockScroll: false,
      restoreFocus: false
    });

    await nextTick();
    expect(document.body.style.overflow).toBe('');

    // Default onClose is triggered safely on Escape
    expect(() => {
      handleKeydown(new KeyboardEvent('keydown', { key: 'Escape', cancelable: true }));
    }).not.toThrow();

    isActive.value = false;
    await nextTick();
    expect(document.body.style.overflow).toBe('');
  });

  it('registers onUnmounted hook inside active Vue component lifecycle', () => {
    const TestComponent = defineComponent({
      template: '<div><div ref="modal">Test</div></div>',
      setup() {
        const modal = ref(null);
        useFocusTrap(modal, ref(true));
        return { modal };
      }
    });

    const wrapper = mount(TestComponent);
    expect(wrapper.exists()).toBe(true);
    wrapper.unmount();
    expect(document.body.style.overflow).toBe('');
  });
});
