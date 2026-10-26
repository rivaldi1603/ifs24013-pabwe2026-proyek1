<template>
  <div class="user-stats-grid fade-in" aria-label="Statistik Pengguna">
    <div class="stat-card card">
      <span class="stat-icon" aria-hidden="true">💬</span>
      <div>
        <span class="stat-num">{{ reviewsCount }}</span>
        <span class="stat-label">Ulasan Ditulis</span>
      </div>
    </div>
    <div class="stat-card card">
      <span class="stat-icon" aria-hidden="true">⭐</span>
      <div>
        <span class="stat-num">{{ averageRating }}</span>
        <span class="stat-label">Rata-rata Rating Diberikan</span>
      </div>
    </div>
    <div class="stat-card card">
      <span class="stat-icon" aria-hidden="true">🗺️</span>
      <div>
        <span class="stat-num">{{ regenciesCount }}</span>
        <span class="stat-label">Kabupaten Kawasan Toba</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  reviewsCount: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: [Number, String],
    default: '0.0'
  },
  regenciesCount: {
    type: Number,
    default: 8
  }
});
</script>
