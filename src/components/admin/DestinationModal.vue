<template>
  <div v-if="modelValue" class="modal-overlay" @click.self="$emit('update:modelValue', false)">
    <div class="modal-card">
      <div class="modal-header">
        <h2 class="modal-title">{{ form.id ? 'Edit Destinasi' : 'Tambah Destinasi Baru' }}</h2>
        <button type="button" @click="$emit('update:modelValue', false)" class="modal-close-btn">&times;</button>
      </div>
      <form @submit.prevent="$emit('save')" class="modal-form-grid">
        <div class="form-group full-width">
          <label for="dest-name" class="form-label">Nama Tempat Wisata *</label>
          <input id="dest-name" v-model="form.name" type="text" class="form-input" required />
        </div>
        <div class="form-group">
          <label for="dest-category" class="form-label">Kategori *</label>
          <select id="dest-category" v-model="form.category_id" class="form-select" required>
            <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
        </div>
        <div class="form-group">
          <label for="dest-regency" class="form-label">Kabupaten *</label>
          <select id="dest-regency" v-model="form.regency_id" class="form-select" required>
            <option v-for="r in regencies" :key="r.id" :value="r.id">{{ r.name }}</option>
          </select>
        </div>
        <div class="form-group">
          <label for="dest-price" class="form-label">Tarif Tiket Display</label>
          <input id="dest-price" v-model="form.price_display" type="text" placeholder="Rp 10.000 / Gratis" class="form-input" />
        </div>
        <div class="form-group">
          <label for="dest-hours" class="form-label">Jam Operasional</label>
          <input id="dest-hours" v-model="form.operational_hours" type="text" placeholder="08.00 - 18.00 WIB" class="form-input" />
        </div>
        <div class="form-group full-width">
          <label for="dest-address" class="form-label">Alamat Lengkap</label>
          <input id="dest-address" v-model="form.address" type="text" class="form-input" />
        </div>
        <div class="form-group full-width">
          <label for="dest-image" class="form-label">URL Gambar</label>
          <input id="dest-image" v-model="form.image_url" type="text" placeholder="https://..." class="form-input" />
        </div>
        <div class="form-group full-width">
          <label for="dest-description" class="form-label">Deskripsi Lengkap</label>
          <textarea id="dest-description" v-model="form.description" rows="3" class="form-textarea"></textarea>
        </div>
        <div class="modal-actions full-width">
          <button type="button" @click="$emit('update:modelValue', false)" class="btn btn-secondary">Batal</button>
          <button type="submit" class="btn btn-primary" :disabled="saving">{{ saving ? 'Menyimpan...' : 'Simpan Destinasi' }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: Boolean, default: false },
  form: { type: Object, required: true },
  categories: { type: Array, default: () => [] },
  regencies: { type: Array, default: () => [] },
  saving: { type: Boolean, default: false }
});

defineEmits(['update:modelValue', 'save']);
</script>
