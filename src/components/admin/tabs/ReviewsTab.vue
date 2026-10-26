<template>
  <div class="tab-pane">
    <AdminEntityTable
      title="Moderasi Ulasan Pengunjung"
      subtitle="Hapus ulasan spam atau komentar tidak pantas dari pengunjung."
      search-placeholder="Cari pengulas..."
      :show-add-button="false"
      :can-edit="false"
      :columns="REVIEW_COLUMNS"
      :items="filteredReviews"
      :loading="loading"
      v-model:search-query="searchQuery"
      @delete="(r) => handleDeleteReview(r.id)"
    >
      <template #cell-reviewer="{ item }">
        <strong>{{ item.reviewer_name }}</strong>
        <span class="table-sub">{{ item.user_id ? 'Terdaftar' : 'Tamu' }}</span>
      </template>
      <template #cell-target="{ item }">
        <span class="badge-target">{{ item.target_type === 'destination' ? '📍 Destinasi' : '🧶 Layanan' }}</span>
        <div class="target-title">{{ item.target_name || ('ID: ' + item.target_id) }}</div>
      </template>
      <template #cell-rating="{ item }">
        <span class="rating-stars-gold">★ {{ Number(item.rating).toFixed(1) }}</span>
      </template>
      <template #cell-review_text="{ item }">
        <p class="review-comment-full">"{{ item.review_text }}"</p>
      </template>
      <template #cell-created_at="{ item }">
        <small class="time-sub">{{ item.created_at }}</small>
      </template>
    </AdminEntityTable>
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue';
import { REVIEW_COLUMNS } from '../../../constants/admin.js';
import { useAdminReviews } from '../../../composables/useAdminReviews.js';
import AdminEntityTable from '../AdminEntityTable.vue';

const emit = defineEmits(['update:count']);

const {
  allReviews,
  loading,
  searchQuery,
  filteredReviews,
  loadReviews,
  handleDeleteReview
} = useAdminReviews();

watch(allReviews, (newVal) => {
  emit('update:count', newVal.length);
});

defineExpose({
  items: allReviews,
  load: loadReviews
});

onMounted(async () => {
  await loadReviews();
  emit('update:count', allReviews.value.length);
});
</script>

<style scoped>
.table-sub {
  display: block;
  font-size: 0.775rem;
  color: var(--text-muted, #64748b);
  margin-top: 0.2rem;
}
.badge-target {
  font-size: 0.725rem;
  background: var(--bg-hover, #f1f5f9);
  padding: 0.15rem 0.5rem;
  border-radius: var(--radius-full, 9999px);
  color: #475569;
}
.target-title {
  font-size: 0.85rem;
  font-weight: 600;
  margin-top: 0.25rem;
}
.rating-stars-gold {
  color: #eab308;
  font-weight: 700;
}
.review-comment-full {
  font-size: 0.825rem;
  color: var(--text-color, #334155);
  line-height: 1.45;
  margin: 0;
  max-width: 320px;
}
.time-sub {
  font-size: 0.75rem;
  color: var(--text-muted, #64748b);
}
</style>
