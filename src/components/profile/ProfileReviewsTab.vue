<template>
  <div class="tab-panel card fade-in">
    <div class="panel-header">
      <div>
        <h2>Riwayat Ulasan & Penilaian Anda</h2>
        <p class="panel-sub">Ulasan yang Anda kirimkan untuk objek wisata maupun layanan lokal di kawasan Danau Toba.</p>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      Memuat ulasan Anda...
    </div>

    <div v-else-if="reviews.length === 0" class="empty-reviews-state">
      <div class="empty-icon">✍️</div>
      <h3>Anda Belum Menulis Ulasan</h3>
      <p>Jelajahi objek wisata Danau Toba dan bagikan ulasan serta penilaian bintang Anda untuk membantu wisatawan lain!</p>
      <router-link to="/destinasi" class="btn btn-primary" style="margin-top: 1rem;">
        Mulai Menjelajahi Destinasi
      </router-link>
    </div>

    <div v-else class="my-reviews-list">
      <div v-for="rev in reviews" :key="rev.id" class="my-review-card">
        <div class="my-rev-header">
          <div>
            <span class="badge-target">{{ rev.target_type === 'destination' ? '📍 Destinasi' : '🧶 Layanan' }}</span>
            <h3 class="my-rev-target-name">{{ rev.target_name || ('Objek #' + rev.target_id) }}</h3>
            <span class="my-rev-date">{{ rev.created_at }}</span>
          </div>
          <div class="my-rev-stars">
            ★ {{ Number(rev.rating).toFixed(1) }}
          </div>
        </div>
        <p class="my-rev-comment">"{{ rev.review_text }}"</p>
        <div v-if="rev.target_slug" class="my-rev-footer">
          <router-link :to="`/${rev.target_type === 'destination' ? 'destinasi' : 'jasa-lokal'}/${rev.target_slug}`" class="btn-link">
            Buka Halaman Tempat Ini →
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  reviews: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
});
</script>

<style scoped>
.tab-panel {
  padding: 1.75rem;
  border-radius: var(--radius-xl, 16px);
}

.panel-header {
  margin-bottom: 1.5rem;
}

.panel-header h2 {
  font-size: 1.35rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.panel-sub {
  font-size: 0.85rem;
  color: var(--text-muted, #64748b);
  margin-top: 0.25rem;
}

.loading-state {
  text-align: center;
  padding: 3rem;
  color: var(--text-muted, #64748b);
}

.empty-reviews-state {
  text-align: center;
  padding: 3.5rem 1.5rem;
  background: #f8fafc;
  border-radius: var(--radius-lg, 12px);
  border: 2px dashed #cbd5e1;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 0.75rem;
}

.empty-reviews-state h3 {
  font-size: 1.25rem;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.empty-reviews-state p {
  color: var(--text-muted, #64748b);
  max-width: 480px;
  margin: 0 auto;
  font-size: 0.95rem;
}

.my-reviews-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.my-review-card {
  border: 1px solid #e2e8f0;
  border-radius: var(--radius-lg, 12px);
  padding: 1.25rem 1.5rem;
  background: #fafafa;
  transition: all 0.2s ease;
}

.my-review-card:hover {
  border-color: #cbd5e1;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.my-rev-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.badge-target {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
  background: #f1f5f9;
  color: #475569;
}

.my-rev-target-name {
  font-size: 1.1rem;
  margin: 0.25rem 0;
  color: #1e293b;
}

.my-rev-date {
  font-size: 0.75rem;
  color: #475569;
}

.my-rev-stars {
  font-size: 1.15rem;
  font-weight: 800;
  color: #b45309;
}

.my-rev-comment {
  font-size: 0.925rem;
  color: #334155;
  line-height: 1.55;
  margin: 0.75rem 0;
}

.my-rev-footer {
  margin-top: 0.5rem;
}

.btn-link {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--primary-color, #0284c7);
  text-decoration: none;
}

.btn-link:hover {
  text-decoration: underline;
}
</style>
