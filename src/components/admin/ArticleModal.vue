<template>
  <div v-if="modelValue" class="modal-overlay" @click.self="$emit('update:modelValue', false)">
    <div class="modal-card">
      <div class="modal-header">
        <h2 class="modal-title">{{ form.id ? 'Edit Cerita Toba' : 'Tulis Cerita / Artikel Baru' }}</h2>
        <button type="button" @click="$emit('update:modelValue', false)" class="modal-close-btn">&times;</button>
      </div>
      <form @submit.prevent="$emit('save')" class="modal-form-grid">
        <div class="form-group full-width">
          <label for="art-title" class="form-label">Judul Artikel / Cerita Budaya *</label>
          <input id="art-title" v-model="form.title" type="text" class="form-input" placeholder="Contoh: Legenda Terbentuknya Danau Toba dan Kearifan Tradisi Batak" required />
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
          <input id="art-source" v-model="form.source_url" type="text" placeholder="https://..." class="form-input" />
        </div>
        <div class="form-group full-width">
          <label for="art-summary" class="form-label">Isi / Ringkasan Cerita</label>
          <textarea id="art-summary" v-model="form.summary" rows="4" class="form-textarea" placeholder="Tuliskan cerita, makna filosofis, atau ulasan perjalanan..."></textarea>
        </div>
        <div class="modal-actions full-width">
          <button type="button" @click="$emit('update:modelValue', false)" class="btn btn-secondary">Batal</button>
          <button type="submit" class="btn btn-primary" :disabled="saving">{{ saving ? 'Menyimpan...' : 'Publikasikan Cerita' }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: Boolean, default: false },
  form: { type: Object, required: true },
  regencies: { type: Array, default: () => [] },
  saving: { type: Boolean, default: false }
});

defineEmits(['update:modelValue', 'save']);
</script>
