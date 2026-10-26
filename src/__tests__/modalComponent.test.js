import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseModal from '../components/common/BaseModal.vue';

describe('BaseModal.vue component integration', () => {
  it('does not render dialog when modelValue is false', () => {
    const wrapper = mount(BaseModal, {
      props: {
        modelValue: false,
        title: 'Judul Modal'
      }
    });

    expect(wrapper.find('.modal-overlay').exists()).toBe(false);
    expect(wrapper.find('dialog').exists()).toBe(false);
  });

  it('renders dialog and accessibility attributes when modelValue is true', () => {
    const wrapper = mount(BaseModal, {
      props: {
        modelValue: true,
        title: 'Tambah Destinasi Baru'
      },
      slots: {
        default: '<div class="test-content">Konten Formulir</div>'
      }
    });

    expect(wrapper.find('.modal-overlay').exists()).toBe(true);
    const dialog = wrapper.find('dialog');
    expect(dialog.exists()).toBe(true);
    expect(dialog.attributes('aria-labelledby')).toBe('modal-title-heading');
    expect(wrapper.find('#modal-title-heading').text()).toBe('Tambah Destinasi Baru');
    expect(wrapper.find('.test-content').text()).toBe('Konten Formulir');
  });

  it('emits close and update:modelValue when close button is clicked', async () => {
    const wrapper = mount(BaseModal, {
      props: {
        modelValue: true,
        title: 'Uji Penutupan'
      }
    });

    const closeBtn = wrapper.find('.modal-close-btn');
    expect(closeBtn.exists()).toBe(true);
    await closeBtn.trigger('click');

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([false]);
    expect(wrapper.emitted('close')).toBeTruthy();
  });

  it('emits close on backdrop click when closeOnBackdrop is true', async () => {
    const wrapper = mount(BaseModal, {
      props: {
        modelValue: true,
        closeOnBackdrop: true
      }
    });

    const overlay = wrapper.find('.modal-overlay');
    await overlay.trigger('click');

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([false]);
  });

  it('does not emit close on backdrop click when closeOnBackdrop is false', async () => {
    const wrapper = mount(BaseModal, {
      props: {
        modelValue: true,
        closeOnBackdrop: false
      }
    });

    const overlay = wrapper.find('.modal-overlay');
    await overlay.trigger('click');

    expect(wrapper.emitted('update:modelValue')).toBeFalsy();
  });

  it('emits submit event when form is submitted', async () => {
    const wrapper = mount(BaseModal, {
      props: {
        modelValue: true,
        title: 'Formulir Uji'
      }
    });

    const form = wrapper.find('form');
    await form.trigger('submit.prevent');

    expect(wrapper.emitted('submit')).toBeTruthy();
  });

  it('handles saving state by disabling submit button and updating label', () => {
    const wrapper = mount(BaseModal, {
      props: {
        modelValue: true,
        saving: true,
        submitText: 'Kirim Data'
      }
    });

    const submitBtn = wrapper.find('button[type="submit"]');
    expect(submitBtn.attributes('disabled')).toBeDefined();
    expect(submitBtn.text()).toContain('Menyimpan...');
  });
});
