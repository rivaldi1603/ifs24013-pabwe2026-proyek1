<template>
  <BaseModal
    :model-value="modelValue"
    :title="form.id ? 'Edit Destinasi' : 'Tambah Destinasi Baru'"
    :saving="saving"
    :submit-text="form.id ? 'Perbarui Destinasi' : 'Simpan Destinasi'"
    @update:model-value="$emit('update:modelValue', $event)"
    @submit="handleFormSubmit"
  >
    <div class="form-group full-width">
      <label for="dest-name" class="form-label">Nama Tempat Wisata *</label>
      <input
        id="dest-name"
        v-model="form.name"
        type="text"
        class="form-input"
        :class="{ 'input-error': errors.name }"
        v-bind="getAriaProps('name')"
        placeholder="Contoh: Danau Toba / Bukit Holbung"
        @input="clearError('name')"
        required
      />
      <span v-if="errors.name" id="name-error" class="field-error-msg">{{ errors.name }}</span>
    </div>

    <div class="form-group">
      <label for="dest-category" class="form-label">Kategori *</label>
      <select
        id="dest-category"
        v-model="form.category_id"
        class="form-select"
        :class="{ 'input-error': errors.category_id }"
        v-bind="getAriaProps('category_id')"
        @change="clearError('category_id')"
        required
      >
        <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
      </select>
      <span v-if="errors.category_id" id="category_id-error" class="field-error-msg">{{ errors.category_id }}</span>
    </div>

    <div class="form-group">
      <label for="dest-regency" class="form-label">Kabupaten *</label>
      <select
        id="dest-regency"
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
      <label for="dest-price" class="form-label">Tarif Tiket Masuk</label>
      <input id="dest-price" v-model="form.price_display" type="text" placeholder="Rp 10.000 / Gratis" class="form-input" />
    </div>

    <div class="form-group">
      <label for="dest-hours" class="form-label">Jam Operasional</label>
      <input id="dest-hours" v-model="form.operational_hours" type="text" placeholder="08.00 - 18.00 WIB" class="form-input" />
    </div>

    <div class="form-group full-width">
      <label for="dest-address" class="form-label">Alamat Lengkap</label>
      <input id="dest-address" v-model="form.address" type="text" class="form-input" placeholder="Nama desa, kecamatan, kabupaten" />
    </div>

    <div class="form-group full-width">
      <label for="dest-image" class="form-label">URL Gambar</label>
      <input
        id="dest-image"
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
      <label for="dest-description" class="form-label">Deskripsi Lengkap</label>
      <textarea id="dest-description" v-model="form.description" rows="3" class="form-textarea" placeholder="Jelaskan daya tarik, keindahan alam, dan fasilitas yang tersedia..."></textarea>
    </div>
  </BaseModal>
</template>

<script setup>
import BaseModal from '../common/BaseModal.vue';
import { useFormValidation, isRequired, isValidUrl } from '../../composables/useFormValidation.js';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  form: { type: Object, required: true },
  categories: { type: Array, default: () => [] },
  regencies: { type: Array, default: () => [] },
  saving: { type: Boolean, default: false }
});

const emit = defineEmits(['update:modelValue', 'save']);

const { errors, validate, clearError, getAriaProps } = useFormValidation({
  name: [
    { validate: isRequired, message: 'Nama destinasi wajib diisi' },
    { validate: (v) => typeof v === 'string' && v.trim().length >= 3, message: 'Nama destinasi minimal 3 karakter' }
  ],
  category_id: [{ validate: isRequired, message: 'Pilih salah satu kategori' }],
  regency_id: [{ validate: isRequired, message: 'Pilih salah satu kabupaten' }],
  image_url: [{ validate: isValidUrl, message: 'Format URL gambar tidak valid (gunakan http:// atau https://)' }]
});

function handleFormSubmit() {
  if (validate(props.form)) {
    emit('save');
  }
}
</script>
