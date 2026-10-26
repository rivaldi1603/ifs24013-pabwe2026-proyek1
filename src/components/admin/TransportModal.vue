<template>
  <BaseModal
    :model-value="modelValue"
    :title="form.id ? 'Edit Rute Penyeberangan' : 'Tambah Rute Penyeberangan Baru'"
    :saving="saving"
    :submit-text="form.id ? 'Perbarui Rute' : 'Simpan Rute'"
    @update:model-value="$emit('update:modelValue', $event)"
    @submit="handleFormSubmit"
  >
    <FormField
      id="trans-name"
      label="Nama Rute / Dermaga *"
      v-model="form.name"
      :error="errors.name"
      placeholder="Contoh: Dermaga Ajibata - Tomok (KMP Ihan Batak)"
      full
      required
      @input="clearError('name')"
    />

    <div class="form-group">
      <label for="trans-type" class="form-label">Jenis Transportasi</label>
      <select id="trans-type" v-model="form.transport_type" class="form-select">
        <option v-for="opt in TRANSPORT_TYPE_OPTIONS" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
    </div>

    <FormField
      id="trans-vehicle"
      label="Nama Armada / Moda"
      v-model="form.vehicle_type"
      placeholder="KMP Ihan Batak / Pora-Pora"
    />

    <FormField
      id="trans-direction"
      label="Lintasan Penyeberangan *"
      v-model="form.route_direction"
      :error="errors.route_direction"
      placeholder="Contoh: Ajibata (Toba) - Tomok (Samosir)"
      full
      required
      @input="clearError('route_direction')"
    />

    <FormField
      id="trans-departure"
      label="Jadwal Keberangkatan"
      v-model="form.departure_hours"
      placeholder="Contoh: 07.30, 09.30, 11.30, 13.30, 15.30, 18.00 WIB"
    />

    <FormField
      id="trans-price"
      label="Tarif Display"
      v-model="form.price_display"
      placeholder="Rp 15.000 / orang (Kendaraan Rp 50.000)"
    />

    <FormField
      id="trans-operator"
      label="Operator / Pengelola"
      v-model="form.operator"
      placeholder="PT ASDP Indonesia Ferry / Swasta"
    />

    <FormField
      id="trans-contact"
      label="Kontak / Call Center"
      v-model="form.contact"
      placeholder="191 (ASDP) / 0812345678"
    />

    <div class="form-group full-width">
      <label for="trans-desc" class="form-label">Catatan / Deskripsi Rute</label>
      <textarea id="trans-desc" v-model="form.description" rows="2" class="form-textarea" placeholder="Waktu tempuh sekitar 45 menit, melayani kendaraan roda 2 dan roda 4."></textarea>
    </div>
  </BaseModal>
</template>

<script setup>
import BaseModal from '../common/BaseModal.vue';
import FormField from '../common/FormField.vue';
import { useFormValidation, isRequired } from '../../composables/useFormValidation.js';
import { TRANSPORT_TYPE_OPTIONS } from '../../constants/transport.js';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  form: { type: Object, required: true },
  saving: { type: Boolean, default: false }
});

const emit = defineEmits(['update:modelValue', 'save']);

const { errors, validate, clearError } = useFormValidation({
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
