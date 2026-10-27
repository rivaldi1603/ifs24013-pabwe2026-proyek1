import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import DestinationCard from '../components/DestinationCard.vue';
import ServiceCard from '../components/ServiceCard.vue';
import ConfirmModal from '../components/common/ConfirmModal.vue';
import { useConfirm } from '../composables/useConfirm.js';

// Stub router-link
const routerLinkStub = {
  name: 'RouterLink',
  props: ['to'],
  template: '<a :href="to"><slot /></a>'
};

describe('Main Components Suite', () => {
  describe('DestinationCard.vue', () => {
    const mockItem = {
      id: 10,
      slug: 'bukit-holbung',
      name: 'Bukit Holbung',
      regency_short: 'Samosir',
      is_community_managed: 1,
      price_display: 'Rp 10.000',
      category_name: 'Perbukitan',
      rating_avg: 4.8,
      review_count: 120,
      address: 'Desa Janji Marhatan, Samosir',
      operational_hours: '07.00 - 19.00 WIB',
      image_url: 'https://example.com/holbung.jpg'
    };

    it('renders destination item information and community badge', () => {
      const wrapper = mount(DestinationCard, {
        props: { item: mockItem },
        global: {
          stubs: { 'router-link': routerLinkStub }
        }
      });

      expect(wrapper.text()).toContain('Bukit Holbung');
      expect(wrapper.text()).toContain('Samosir');
      expect(wrapper.text()).toContain('Komunitas');
      expect(wrapper.text()).toContain('Rp 10.000');
      expect(wrapper.text()).toContain('4.8');
      expect(wrapper.text()).toContain('(120)');
      expect(wrapper.text()).toContain('07.00 - 19.00 WIB');
    });

    it('handles fallback values when optional fields are missing', () => {
      const wrapper = mount(DestinationCard, {
        props: { item: { id: 2, name: 'Air Terjun Sipiso Piso' } },
        global: {
          stubs: { 'router-link': routerLinkStub }
        }
      });

      expect(wrapper.text()).toContain('Danau Toba');
      expect(wrapper.text()).toContain('Gratis');
      expect(wrapper.text()).toContain('Wisata Alam');
      expect(wrapper.text()).not.toContain('Komunitas');
    });

    it('replaces broken image with fallback default image on error event', async () => {
      const wrapper = mount(DestinationCard, {
        props: { item: mockItem },
        global: {
          stubs: { 'router-link': routerLinkStub }
        }
      });

      const img = wrapper.find('img.card-img');
      expect(img.exists()).toBe(true);

      await img.trigger('error');
      expect(img.element.src).toContain('images.unsplash.com');
    });
  });

  describe('ServiceCard.vue', () => {
    const mockService = {
      id: 5,
      slug: 'sewa-kapal-tomok',
      name: 'Sewa Kapal Wisata Tomok',
      service_type: 'rental',
      regency_short: 'Samosir',
      provider_name: 'Pak Ambarita',
      is_community_managed: true,
      description: 'Layanan sewa kapal keliling Danau Toba dengan pemandu lokal berpengalaman.',
      price_display: 'Rp 350.000',
      price_unit: 'jam',
      rating_avg: 4.9,
      contact_wa: '628123456789'
    };

    it('renders service details, community badge, and computed WhatsApp link', () => {
      const wrapper = mount(ServiceCard, {
        props: { service: mockService },
        global: {
          stubs: { 'router-link': routerLinkStub }
        }
      });

      expect(wrapper.text()).toContain('Sewa Kapal Wisata Tomok');
      expect(wrapper.text()).toContain('Pak Ambarita');
      expect(wrapper.text()).toContain('Warga Lokal');
      expect(wrapper.text()).toContain('Rp 350.000');
      expect(wrapper.text()).toContain('/jam');
      expect(wrapper.text()).toContain('4.9');

      const waBtn = wrapper.find('a.btn-whatsapp');
      expect(waBtn.attributes('href')).toContain('https://wa.me/628123456789');
      expect(waBtn.attributes('href')).toContain(encodeURIComponent('Pak Ambarita'));
    });

    it('uses fallback WhatsApp number when contact_wa is omitted', () => {
      const wrapper = mount(ServiceCard, {
        props: {
          service: {
            id: 8,
            name: 'Pemandu Sejarah',
            service_type: 'guide',
            provider_name: 'Ina Maria'
          }
        },
        global: {
          stubs: { 'router-link': routerLinkStub }
        }
      });

      const waBtn = wrapper.find('a.btn-whatsapp');
      expect(waBtn.attributes('href')).toContain('https://wa.me/6281260008888');
    });
  });

  describe('ConfirmModal.vue', () => {
    beforeEach(() => {
      const { handleCancel } = useConfirm();
      handleCancel();
    });

    it('renders nothing when confirmation modal is closed', () => {
      const wrapper = mount(ConfirmModal);
      expect(wrapper.find('dialog.confirm-card').exists()).toBe(false);
    });

    it('renders dialog with message and triggers confirm action', async () => {
      const { confirm } = useConfirm();
      const confirmPromise = confirm({
        title: 'Hapus Data?',
        message: 'Tindakan ini tidak dapat dibatalkan.',
        confirmText: 'Ya, Hapus',
        danger: true
      });

      const wrapper = mount(ConfirmModal, { attachTo: document.body });
      expect(wrapper.find('dialog.confirm-card').exists()).toBe(true);
      expect(wrapper.find('#confirm-modal-title').text()).toBe('Hapus Data?');
      expect(wrapper.find('#confirm-modal-msg').text()).toContain('Tindakan ini tidak dapat dibatalkan');

      const confirmBtn = wrapper.find('button.btn-danger');
      expect(confirmBtn.exists()).toBe(true);
      await confirmBtn.trigger('click');

      const result = await confirmPromise;
      expect(result).toBe(true);
      wrapper.unmount();
    });

    it('triggers cancel action when cancel button is clicked', async () => {
      const { confirm } = useConfirm();
      const cancelPromise = confirm({
        title: 'Batal Perubahan?',
        message: 'Data akan hilang.'
      });

      const wrapper = mount(ConfirmModal, { attachTo: document.body });
      const cancelBtn = wrapper.find('button.btn-secondary');
      await cancelBtn.trigger('click');

      const result = await cancelPromise;
      expect(result).toBe(false);
      wrapper.unmount();
    });
  });
});
