<template>
  <BaseModal
    :model-value="modelValue"
    :title="form.id ? 'Edit Rute Penyeberangan' : 'Tambah Rute Penyeberangan Baru'"
    :saving="saving"
    :submit-text="form.id ? 'Perbarui Rute' : 'Simpan Rute'"
    @update:model-value="$emit('update:modelValue', $event)"
    @submit="handleFormSubmit"
  >
    <div class="form-group full-width">
      <label for="trans-name" class="form-label">Nama Rute / Dermaga *</label>
      <input
        id="trans-name"
        v-model="form.name"
        type="text"
        class="form-input"
        :class="{ 'input-error': errors.name }"
        v-bind="getAriaProps('name')"
        placeholder="Contoh: Dermaga Ajibata - Tomok (KMP Ihan Batak)"
        @input="clearError('name')"
        required
      />
      <span v-if="errors.name" id="name-error" class="field-error-msg">{{ errors.name }}</span>
    </div>

    <div class="form-group">
      <label for="trans-type" class="form-label">Jenis Transportasi</label>
      <select id="trans-type" v-model="form.transport_type" class="form-select">
        <option v-for="opt in TRANSPORT_TYPE_OPTIONS" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
    </div>

    <div class="form-group">
      <label for="trans-vehicle" class="form-label">Nama Armada / Moda</label>
      <input id="trans-vehicle" v-model="form.vehicle_type" type="text" placeholder="KMP Ihan Batak / Pora-Pora" class="form-input" />
    </div>

    <div class="form-group full-width">
      <label for="trans-direction" class="form-label">Lintasan Penyeberangan *</label>
      <input
        id="trans-direction"
        v-model="form.route_direction"
        type="text"
        placeholder="Contoh: Ajibata (Toba) - Tomok (Samosir)"
        class="form-input"
        :class="{ 'input-error': errors.route_direction }"
        v-bind="getAriaProps('route_direction')"
        @input="clearError('route_direction')"
        required
      />
      <span v-if="errors.route_direction" id="route_direction-error" class="field-error-msg">{{ errors.route_direction }}</span>
    </div>

    <div class="form-group">
      <label for="trans-departure" class="form-label">Jadwal Keberangkatan</label>
      <input id="trans-departure" v-model="form.departure_hours" type="text" placeholder="Contoh: 07.30, 09.30, 11.30, 13.30, 15.30, 18.00 WIB" class="form-input" />
    </div>

    <div class="form-group">
      <label for="trans-price" class="form-label">Tarif Display</label>
      <input id="trans-price" v-model="form.price_display" type="text" placeholder="Rp 15.000 / orang (Kendaraan Rp 50.000)" class="form-input" />
    </div>

    <div class="form-group">
      <label for="trans-operator" class="form-label">Operator / Pengelola</label>
      <input id="trans-operator" v-model="form.operator" type="text" placeholder="PT ASDP Indonesia Ferry / Swasta" class="form-input" />
    </div>

    <div class="form-group">
      <label for="trans-contact" class="form-label">Kontak / Call Center</label>
      <input id="trans-contact" v-model="form.contact" type="text" placeholder="191 (ASDP) / 0812345678" class="form-input" />
    </div>

    <div class="form-group full-width">
      <label for="trans-desc" class="form-label">Catatan / Deskripsi Rute</label>
      <textarea id="trans-desc" v-model="form.description" rows="2" class="form-textarea" placeholder="Waktu tempuh sekitar 45 menit, melayani kendaraan roda 2 dan roda 4."></textarea>
    </div>
  </BaseModal>
</template>

<script setup>
import BaseModal from '../common/BaseModal.vue';
import { useFormValidation, isRequired } from '../../composables/useFormValidation.js';
import { TRANSPORT_TYPE_OPTIONS } from '../../constants/admin.js';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  form: { type: Object, required: true },
  saving: { type: Boolean, default: false }
});

const emit = defineEmits(['update:modelValue', 'save']);

const { errors, validate, clearError, getAriaProps } = useFormValidation({
  name: [
    { validate: isRequired, message: 'Nama rute / dermaga wajib diisi' },
    { validate: (v) => typeof v === 'string' && v.trim().length >= 3, message: 'Nama rute minimal 3 karakter' }
  ],
  route_direction: [{ validate: isRequired, message: 'Lintasan penyeberangan wajib diisi' }]
});

function handleFormSubmit() {
  if (validate(props.form)) {
    emit('save');
  }
}
</script>
