<template>
  <BaseModal
    :model-value="modelValue"
    :title="form.id ? 'Edit Kuliner Khas' : 'Tambah Menu Kuliner Khas'"
    :saving="saving"
    :submit-text="form.id ? 'Perbarui Kuliner' : 'Simpan Kuliner'"
    @update:model-value="$emit('update:modelValue', $event)"
    @submit="handleFormSubmit"
  >
    <div class="form-group full-width">
      <label for="cul-name" class="form-label">Nama Makanan / Minuman *</label>
      <input
        id="cul-name"
        v-model="form.name"
        type="text"
        class="form-input"
        :class="{ 'input-error': errors.name }"
        v-bind="getAriaProps('name')"
        placeholder="Contoh: Ikan Mas Arsik"
        @input="clearError('name')"
        required
      />
      <span v-if="errors.name" id="name-error" class="field-error-msg">{{ errors.name }}</span>
    </div>

    <div class="form-group">
      <label for="cul-halal" class="form-label">Status Kehalalan</label>
      <select id="cul-halal" v-model="form.halal_status" class="form-select">
        <option value="Halal">Halal (Ikan / Sayur / Ayam / Kue)</option>
        <option value="Non-Halal">Non-Halal (Tradisional Khas)</option>
      </select>
    </div>

    <div class="form-group">
      <label for="cul-origin" class="form-label">Asal Daerah / Wilayah</label>
      <input id="cul-origin" v-model="form.origin_region" type="text" placeholder="Contoh: Samosir / Balige" class="form-input" />
    </div>

    <div class="form-group full-width">
      <label for="cul-image" class="form-label">URL Foto Makanan</label>
      <input
        id="cul-image"
        v-model="form.image_url"
        type="text"
        placeholder="https://..."
        class="form-input"
        :class="{ 'input-error': errors.image_url }"
        v-bind="getAriaProps('image_url')"
        @input="clearError('image_url')"
      />
      <span v-if="errors.image_url" id="image_url-error" class="field-error-msg">{{ errors.image_url }}</span>
    </div>

    <div class="form-group full-width">
      <label for="cul-desc" class="form-label">Deskripsi & Ciri Khas Bumbu</label>
      <textarea id="cul-desc" v-model="form.description" rows="3" class="form-textarea" placeholder="Bumbu andaliman yang beraroma jeruk tajam, menggunakan asam gelugur..."></textarea>
    </div>
  </BaseModal>
</template>

<script setup>
import BaseModal from '../common/BaseModal.vue';
import { useFormValidation, isRequired, isValidUrl } from '../../composables/useFormValidation.js';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  form: { type: Object, required: true },
  saving: { type: Boolean, default: false }
});

const emit = defineEmits(['update:modelValue', 'save']);

const { errors, validate, clearError, getAriaProps } = useFormValidation({
  name: [
    { validate: isRequired, message: 'Nama makanan/minuman wajib diisi' },
    { validate: (v) => typeof v === 'string' && v.trim().length >= 2, message: 'Nama makanan minimal 2 karakter' }
  ],
  image_url: [{ validate: isValidUrl, message: 'Format URL foto makanan tidak valid (gunakan http:// atau https://)' }]
});

function handleFormSubmit() {
  if (validate(props.form)) {
    emit('save');
  }
}
</script>
