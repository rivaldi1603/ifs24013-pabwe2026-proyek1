<template>
  <BaseModal
    :model-value="modelValue"
    :title="form.id ? 'Edit Cerita Toba' : 'Tulis Cerita / Artikel Baru'"
    :saving="saving"
    :submit-text="form.id ? 'Perbarui Cerita' : 'Publikasikan Cerita'"
    @update:model-value="$emit('update:modelValue', $event)"
    @submit="handleFormSubmit"
  >
    <div class="form-group full-width">
      <label for="art-title" class="form-label">Judul Artikel / Cerita Budaya *</label>
      <input
        id="art-title"
        v-model="form.title"
        type="text"
        class="form-input"
        :class="{ 'input-error': errors.title }"
        v-bind="getAriaProps('title')"
        placeholder="Contoh: Legenda Terbentuknya Danau Toba dan Kearifan Tradisi Batak"
        @input="clearError('title')"
        required
      />
      <span v-if="errors.title" id="title-error" class="field-error-msg">{{ errors.title }}</span>
    </div>

    <div class="form-group">
      <label for="art-regency" class="form-label">Wilayah Kabupaten Terkait</label>
      <select id="art-regency" v-model="form.regency_id" class="form-select">
        <option :value="null">Kawasan Danau Toba Umum</option>
        <option v-for="r in regencies" :key="r.id" :value="r.id">{{ r.name }}</option>
      </select>
    </div>

    <div class="form-group">
      <label for="art-date" class="form-label">Tanggal Publikasi</label>
      <input id="art-date" v-model="form.published_at" type="date" class="form-input" />
    </div>

    <div class="form-group full-width">
      <label for="art-source" class="form-label">Tautan Sumber Berita / Referensi Asli</label>
      <input
        id="art-source"
        v-model="form.source_url"
        type="text"
        placeholder="https://..."
        class="form-input"
        :class="{ 'input-error': errors.source_url }"
        v-bind="getAriaProps('source_url')"
        @input="clearError('source_url')"
      />
      <span v-if="errors.source_url" id="source_url-error" class="field-error-msg">{{ errors.source_url }}</span>
    </div>

    <div class="form-group full-width">
      <label for="art-summary" class="form-label">Isi / Ringkasan Cerita</label>
      <textarea id="art-summary" v-model="form.summary" rows="4" class="form-textarea" placeholder="Tuliskan cerita, makna filosofis, atau ulasan perjalanan..."></textarea>
    </div>
  </BaseModal>
</template>

<script setup>
import BaseModal from '../common/BaseModal.vue';
import { useFormValidation, isRequired, isValidUrl } from '../../composables/useFormValidation.js';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  form: { type: Object, required: true },
  regencies: { type: Array, default: () => [] },
  saving: { type: Boolean, default: false }
});

const emit = defineEmits(['update:modelValue', 'save']);

const { errors, validate, clearError, getAriaProps } = useFormValidation({
  title: [
    { validate: isRequired, message: 'Judul artikel wajib diisi' },
    { validate: (v) => typeof v === 'string' && v.trim().length >= 4, message: 'Judul minimal 4 karakter' }
  ],
  source_url: [{ validate: isValidUrl, message: 'Format tautan sumber tidak valid (gunakan http:// atau https://)' }]
});

function handleFormSubmit() {
  if (validate(props.form)) {
    emit('save');
  }
}
</script>
