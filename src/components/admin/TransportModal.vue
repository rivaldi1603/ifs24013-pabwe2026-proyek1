<template>
  <div v-if="modelValue" class="modal-overlay" @click.self="$emit('update:modelValue', false)">
    <div class="modal-card">
      <div class="modal-header">
        <h2 class="modal-title">{{ form.id ? 'Edit Rute Penyeberangan' : 'Tambah Rute Penyeberangan Baru' }}</h2>
        <button type="button" @click="$emit('update:modelValue', false)" class="modal-close-btn">&times;</button>
      </div>
      <form @submit.prevent="$emit('save')" class="modal-form-grid">
        <div class="form-group full-width">
          <label for="trans-name" class="form-label">Nama Rute / Dermaga *</label>
          <input id="trans-name" v-model="form.name" type="text" class="form-input" placeholder="Contoh: Dermaga Ajibata - Tomok (KMP Ihan Batak)" required />
        </div>
        <div class="form-group">
          <label for="trans-type" class="form-label">Jenis Transportasi</label>
          <select id="trans-type" v-model="form.transport_type" class="form-select">
            <option value="ferry">Kapal Motor Penyeberangan (KMP Ferry)</option>
            <option value="traditional_boat">Kapal Kayu Tradisional</option>
            <option value="land_shuttle">Shuttle / Angkutan Darat</option>
          </select>
        </div>
        <div class="form-group">
          <label for="trans-direction" class="form-label">Arah / Lintasan *</label>
          <input id="trans-direction" v-model="form.route_direction" type="text" placeholder="Contoh: Ajibata (Toba) ⇄ Tomok (Samosir)" class="form-input" required />
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
        <div class="modal-actions full-width">
          <button type="button" @click="$emit('update:modelValue', false)" class="btn btn-secondary">Batal</button>
          <button type="submit" class="btn btn-primary" :disabled="saving">{{ saving ? 'Menyimpan...' : 'Simpan Rute' }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: Boolean, default: false },
  form: { type: Object, required: true },
  saving: { type: Boolean, default: false }
});

defineEmits(['update:modelValue', 'save']);
</script>
