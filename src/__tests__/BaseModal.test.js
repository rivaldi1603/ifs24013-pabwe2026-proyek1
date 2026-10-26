import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseModal from '../components/common/BaseModal.vue';

describe('BaseModal component integration and accessibility', () => {
  it('menutup dengan tombol Esc dan menandai dialog dengan aria-labelledby', async () => {
    const w = mount(BaseModal, {
      props: { modelValue: true, title: 'Uji' },
      attachTo: document.body
    });

    expect(w.find('dialog').attributes('aria-labelledby')).toBe('modal-title-heading');
    await w.find('dialog').trigger('keydown', { key: 'Escape' });
    expect(w.emitted('update:modelValue')?.[0]).toEqual([false]);
    expect(w.emitted('close')).toBeTruthy();
  });

  it('renders title and slot contents properly', () => {
    const w = mount(BaseModal, {
      props: { modelValue: true, title: 'Uji Header' },
      slots: { default: '<p class="slot-text">Konten Modal</p>' }
    });

    expect(w.find('#modal-title-heading').text()).toBe('Uji Header');
    expect(w.find('.slot-text').text()).toBe('Konten Modal');
  });

  it('emits submit event when form is submitted', async () => {
    const w = mount(BaseModal, {
      props: { modelValue: true, title: 'Uji Submit' }
    });

    await w.find('form').trigger('submit.prevent');
    expect(w.emitted('submit')).toBeTruthy();
  });
});
