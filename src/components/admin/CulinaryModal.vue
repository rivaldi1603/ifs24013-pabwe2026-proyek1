<template>
  <div v-if="modelValue" class="modal-overlay" @click.self="$emit('update:modelValue', false)">
    <div class="modal-card">
      <div class="modal-header">
        <h2 class="modal-title">{{ form.id ? 'Edit Kuliner Khas' : 'Tambah Menu Kuliner Khas' }}</h2>
        <button type="button" @click="$emit('update:modelValue', false)" class="modal-close-btn">&times;</button>
      </div>
      <form @submit.prevent="$emit('save')" class="modal-form-grid">
        <div class="form-group full-width">
          <label for="cul-name" class="form-label">Nama Makanan / Minuman *</label>
          <input id="cul-name" v-model="form.name" type="text" class="form-input" placeholder="Contoh: Ikan Mas Arsik" required />
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
          <input id="cul-image" v-model="form.image_url" type="text" placeholder="https://..." class="form-input" />
        </div>
        <div class="form-group full-width">
          <label for="cul-desc" class="form-label">Deskripsi & Ciri Khas Bumbu</label>
          <textarea id="cul-desc" v-model="form.description" rows="3" class="form-textarea" placeholder="Bumbu andaliman yang beraroma jeruk tajam, menggunakan asam gelugur..."></textarea>
        </div>
        <div class="modal-actions full-width">
          <button type="button" @click="$emit('update:modelValue', false)" class="btn btn-secondary">Batal</button>
          <button type="submit" class="btn btn-primary" :disabled="saving">{{ saving ? 'Menyimpan...' : 'Simpan Kuliner' }}</button>
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
