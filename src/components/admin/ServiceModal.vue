<template>
  <BaseModal
    :model-value="modelValue"
    :title="form.id ? 'Edit Jasa / Homestay' : 'Tambah Jasa Baru'"
    :saving="saving"
    :submit-text="form.id ? 'Perbarui Layanan' : 'Simpan Layanan'"
    @update:model-value="$emit('update:modelValue', $event)"
    @submit="handleFormSubmit"
  >
    <div class="form-group full-width">
      <label for="srv-name" class="form-label">Nama Layanan *</label>
      <input
        id="srv-name"
        v-model="form.name"
        type="text"
        class="form-input"
        :class="{ 'input-error': errors.name }"
        v-bind="getAriaProps('name')"
        placeholder="Contoh: Homestay Rumah Batak Tradisional"
        @input="clearError('name')"
        required
      />
      <span v-if="errors.name" id="name-error" class="field-error-msg">{{ errors.name }}</span>
    </div>

    <div class="form-group">
      <label for="srv-provider" class="form-label">Penyedia / Warga *</label>
      <input
        id="srv-provider"
        v-model="form.provider_name"
        type="text"
        class="form-input"
        :class="{ 'input-error': errors.provider_name }"
        v-bind="getAriaProps('provider_name')"
        placeholder="Nama pemilik atau pokdarwis"
        @input="clearError('provider_name')"
        required
      />
      <span v-if="errors.provider_name" id="provider_name-error" class="field-error-msg">{{ errors.provider_name }}</span>
    </div>

    <div class="form-group">
      <label for="srv-type" class="form-label">Jenis Layanan</label>
      <select id="srv-type" v-model="form.service_type" class="form-select">
        <option value="cultural_experience">Workshop & Budaya</option>
        <option value="homestay">Homestay Warga</option>
        <option value="tour_guide">Pemandu Lokal</option>
        <option value="adventure">Petualangan Air/Alam</option>
        <option value="boat_rental">Sewa Solu / Perahu</option>
      </select>
    </div>

    <div class="form-group">
      <label for="srv-regency" class="form-label">Kabupaten *</label>
      <select
        id="srv-regency"
        v-model="form.regency_id"
        class="form-select"
        :class="{ 'input-error': errors.regency_id }"
        v-bind="getAriaProps('regency_id')"
        @change="clearError('regency_id')"
        required
      >
        <option v-for="r in regencies" :key="r.id" :value="r.id">{{ r.name }}</option>
      </select>
      <span v-if="errors.regency_id" id="regency_id-error" class="field-error-msg">{{ errors.regency_id }}</span>
    </div>

    <div class="form-group">
      <label for="srv-wa" class="form-label">Nomor WhatsApp</label>
      <input id="srv-wa" v-model="form.contact_wa" type="text" placeholder="6281234567890" class="form-input" />
    </div>

    <div class="form-group">
      <label for="srv-price" class="form-label">Tarif Display</label>
      <input id="srv-price" v-model="form.price_display" type="text" placeholder="Rp 150.000" class="form-input" />
    </div>

    <div class="form-group">
      <label for="srv-unit" class="form-label">Satuan Tarif</label>
      <input id="srv-unit" v-model="form.price_unit" type="text" placeholder="per malam / per orang" class="form-input" />
    </div>

    <div class="form-group full-width">
      <label for="srv-desc" class="form-label">Deskripsi Layanan</label>
      <textarea id="srv-desc" v-model="form.description" rows="3" class="form-textarea" placeholder="Jelaskan fasilitas, keunikan layanan, dan kontak panduan..."></textarea>
    </div>
  </BaseModal>
</template>

<script setup>
import BaseModal from '../common/BaseModal.vue';
import { useFormValidation, isRequired } from '../../composables/useFormValidation.js';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  form: { type: Object, required: true },
  regencies: { type: Array, default: () => [] },
  saving: { type: Boolean, default: false }
});

const emit = defineEmits(['update:modelValue', 'save']);

const { errors, validate, clearError, getAriaProps } = useFormValidation({
  name: [
    { validate: isRequired, message: 'Nama layanan wajib diisi' },
    { validate: (v) => typeof v === 'string' && v.trim().length >= 3, message: 'Nama layanan minimal 3 karakter' }
  ],
  provider_name: [{ validate: isRequired, message: 'Nama penyedia wajib diisi' }],
  regency_id: [{ validate: isRequired, message: 'Pilih salah satu kabupaten' }]
});

function handleFormSubmit() {
  if (validate(props.form)) {
    emit('save');
  }
}
</script>
