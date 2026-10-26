<template>
  <BaseModal
    :model-value="modelValue"
    :title="form.id ? 'Edit Kuliner Khas' : 'Tambah Menu Kuliner Khas'"
    :saving="saving"
    :submit-text="form.id ? 'Perbarui Kuliner' : 'Simpan Kuliner'"
    @update:model-value="$emit('update:modelValue', $event)"
    @submit="handleFormSubmit"
  >
    <FormField
      id="cul-name"
      label="Nama Makanan / Minuman *"
      v-model="form.name"
      :error="errors.name"
      placeholder="Contoh: Ikan Mas Arsik"
      full
      required
      @input="clearError('name')"
    />

    <div class="form-group">
      <label for="cul-halal" class="form-label">Status Kehalalan</label>
      <select id="cul-halal" v-model="form.halal_status" class="form-select">
        <option v-for="opt in HALAL_STATUS_OPTIONS" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
    </div>

    <FormField
      id="cul-origin"
      label="Asal Daerah / Wilayah"
      v-model="form.origin_region"
      placeholder="Contoh: Samosir / Balige"
    />

    <FormField
      id="cul-image"
      label="URL Foto Makanan"
      v-model="form.image_url"
      :error="errors.image_url"
      placeholder="https://..."
      full
      @input="clearError('image_url')"
    />

    <div class="form-group full-width">
      <label for="cul-desc" class="form-label">Deskripsi & Ciri Khas Bumbu</label>
      <textarea id="cul-desc" v-model="form.description" rows="3" class="form-textarea" placeholder="Bumbu andaliman yang beraroma jeruk tajam, menggunakan asam gelugur..."></textarea>
    </div>
  </BaseModal>
</template>

<script setup>
import BaseModal from '../common/BaseModal.vue';
import FormField from '../common/FormField.vue';
import { useFormValidation, isRequired, isValidUrl } from '../../composables/useFormValidation.js';
import { HALAL_STATUS_OPTIONS } from '../../constants/admin.js';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  form: { type: Object, required: true },
  saving: { type: Boolean, default: false }
});

const emit = defineEmits(['update:modelValue', 'save']);

const { errors, validate, clearError } = useFormValidation({
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
