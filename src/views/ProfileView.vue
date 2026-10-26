<template>
  <div class="profile-page container">
    <!-- USER PROFILE BANNER -->
    <ProfileHeader
      :user="user"
      @edit="openEditModal"
    />

    <!-- NOTIFICATION ALERT -->
    <div v-if="saveSuccessMsg" class="alert-success fade-in">
      ✅ {{ saveSuccessMsg }}
    </div>

    <!-- STATS / OVERVIEW CARDS -->
    <ProfileStats
      :reviews-count="myReviews.length"
      :average-rating="averageGivenRating"
    />

    <!-- TABS -->
    <div class="dash-tabs fade-in">
      <button
        class="dash-tab-btn"
        :class="{ active: currentTab === 'reviews' }"
        @click="currentTab = 'reviews'"
      >
        💬 Ulasan Saya ({{ myReviews.length }})
      </button>
      <button
        class="dash-tab-btn"
        :class="{ active: currentTab === 'recommendations' }"
        @click="switchTab('recommendations')"
      >
        ⭐ Rekomendasi Destinasi Populer
      </button>
    </div>

    <!-- TAB 1: MY REVIEWS -->
    <ProfileReviewsTab
      v-if="currentTab === 'reviews'"
      :reviews="myReviews"
      :loading="loading"
    />

    <!-- TAB 2: RECOMMENDATIONS -->
    <div v-if="currentTab === 'recommendations'" class="tab-panel card fade-in">
      <div class="panel-header">
        <div>
          <h2>Destinasi Rekomendasi Paling Populer</h2>
          <p class="panel-sub">Destinasi dengan ulasan positif terbanyak yang wajib Anda kunjungi.</p>
        </div>
      </div>

      <div class="recs-grid">
        <div v-for="d in featuredDestinations" :key="d.id" class="rec-card card">
          <div class="rec-img-wrap">
            <img
              :src="d.image_url || 'https://images.unsplash.com/photo-1578469550956-0e16b69c6a3d?w=600&auto=format&fit=crop&q=80'"
              :alt="d.name"
              class="rec-img"
            />
            <span class="rec-rating-badge">★ {{ Number(d.rating_avg || 4.8).toFixed(1) }}</span>
          </div>
          <div class="rec-body">
            <span class="rec-category">{{ d.category_name }} • {{ d.regency_short || d.regency_name }}</span>
            <h3 class="rec-name">{{ d.name }}</h3>
            <p class="rec-price">Tiket: <strong>{{ d.price_display }}</strong></p>
            <router-link :to="`/destinasi/${d.slug}`" class="btn btn-secondary btn-sm full-btn">
              Lihat Detail & Tulis Ulasan
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL EDIT PROFIL & UPLOAD FOTO -->
    <ProfileEditModal
      v-model="showEditModal"
      :user="user"
      :saving="saving"
      :error-message="editError"
      @save="saveProfile"
    />
  </div>
</template>

<script setup>
import { ref, shallowRef, computed, onMounted } from 'vue';
import { api } from '../api.js';
import { useProfileEdit } from '../composables/useProfileEdit.js';
import ProfileHeader from '../components/profile/ProfileHeader.vue';
import ProfileStats from '../components/profile/ProfileStats.vue';
import ProfileReviewsTab from '../components/profile/ProfileReviewsTab.vue';
import ProfileEditModal from '../components/profile/ProfileEditModal.vue';

const {
  user,
  showEditModal,
  saving,
  editError,
  saveSuccessMsg,
  openEditModal,
  saveProfile
} = useProfileEdit();

const currentTab = ref('reviews');
const myReviews = shallowRef([]);
const featuredDestinations = shallowRef([]);
const loading = ref(true);

const averageGivenRating = computed(() => {
  if (myReviews.value.length === 0) return '0.0';
  const sum = myReviews.value.reduce((acc, r) => acc + Number(r.rating || 0), 0);
  return (sum / myReviews.value.length).toFixed(1);
});

async function loadUserData() {
  if (!user.value) return;
  loading.value = true;
  try {
    const revRes = await api.getReviews({ user_id: user.value.id });
    if (revRes && revRes.success) {
      myReviews.value = revRes.data || [];
    }
  } catch (err) {
    console.error('Error loading profile reviews:', err);
  } finally {
    loading.value = false;
  }
}

async function switchTab(tab) {
  currentTab.value = tab;
  if (tab === 'recommendations' && featuredDestinations.value.length === 0) {
    try {
      const featRes = await api.getFeaturedDestinations();
      if (featRes && featRes.success) {
        featuredDestinations.value = featRes.data || [];
      }
    } catch (err) {
      console.error('Error loading recommendations:', err);
    }
  }
}

onMounted(() => {
  loadUserData();
});
</script>

<style scoped>
.profile-page {
  padding-top: 2.5rem;
  padding-bottom: 5rem;
}

.alert-success {
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  color: #065f46;
  padding: 0.85rem 1.25rem;
  border-radius: var(--radius-lg, 12px);
  margin-bottom: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.dash-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 0.25rem;
}

.dash-tab-btn {
  background: transparent;
  border: none;
  font-size: 0.95rem;
  font-weight: 700;
  color: #64748b;
  padding: 0.75rem 1.25rem;
  border-radius: var(--radius-md, 8px) var(--radius-md, 8px) 0 0;
  cursor: pointer;
  transition: all 0.2s ease;
}

.dash-tab-btn:hover {
  color: #0284c7;
}

.dash-tab-btn.active {
  color: #0369a1;
  border-bottom: 3px solid #0369a1;
  margin-bottom: -0.35rem;
  background: white;
}

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

.recs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.rec-card {
  border: 1px solid #e2e8f0;
  border-radius: var(--radius-lg, 12px);
  overflow: hidden;
  background: white;
}

.rec-img-wrap {
  position: relative;
  height: 180px;
}

.rec-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.rec-rating-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(4px);
  color: #fbbf24;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-full, 9999px);
}

.rec-body {
  padding: 1.25rem;
}

.rec-category {
  font-size: 0.75rem;
  color: var(--text-muted, #64748b);
  display: block;
  margin-bottom: 0.25rem;
}

.rec-name {
  font-size: 1.15rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: #0f172a;
}

.rec-price {
  font-size: 0.85rem;
  color: #475569;
  margin-bottom: 0.5rem;
}

.full-btn {
  width: 100%;
  margin-top: 0.75rem;
}
</style>
