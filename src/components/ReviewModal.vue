<template>
  <BaseModal
    :model-value="isOpen"
    title="Tulis Ulasan & Penilaian"
    :saving="submitting"
    submit-text="Kirim Ulasan"
    max-width="560px"
    @update:model-value="(val) => { if (!val) close(); }"
    @submit="handleSubmit"
    @close="close"
  >
    <p class="modal-target-info full-width">
      Memberikan ulasan untuk: <strong>{{ targetTitle }}</strong>
    </p>

    <!-- Login gate: only registered users may post reviews -->
    <div v-if="!currentUser" class="login-gate full-width">
      <p class="login-gate-text">
        Anda perlu masuk terlebih dahulu untuk menulis ulasan dan memberi bintang.
      </p>
      <div class="modal-actions-custom">
        <button type="button" class="btn btn-secondary" @click="close">Nanti Saja</button>
        <router-link id="review-login" :to="{ path: '/auth/login', query: { redirect: route.fullPath } }" class="btn btn-primary" @click="close">
          Masuk
        </router-link>
        <router-link id="review-register" :to="{ path: '/auth/register', query: { redirect: route.fullPath } }" class="btn btn-secondary" @click="close">
          Daftar
        </router-link>
      </div>
    </div>

    <template v-else>
      <!-- Rating Stars Selection -->
      <div class="form-group full-width">
        <span class="form-label">Penilaian Bintang (1 - 5):</span>
        <div class="stars-selector">
          <button
            v-for="star in 5"
            :key="star"
            type="button"
            class="star-btn"
            :class="{ 'star-active': star <= rating }"
            @click="rating = star"
            :title="`${star} Bintang`"
          >
            ★
          </button>
          <span class="rating-text-hint">{{ rating }} dari 5 Bintang</span>
        </div>
      </div>

      <div class="form-group full-width">
        <label for="review-author" class="form-label">Nama Anda:</label>
        <input
          id="review-author"
          v-model="reviewerName"
          type="text"
          class="form-input"
          placeholder="Contoh: Budi Santoso / Turis Jakarta"
          required
          readonly
        />
      </div>

      <div class="form-group full-width">
        <label for="review-content" class="form-label">Ulasan Pengalaman Anda:</label>
        <textarea
          id="review-content"
          v-model="reviewText"
          rows="4"
          class="form-textarea"
          placeholder="Ceritakan pengalaman Anda, suasana tempat, keramahan pengelola lokal, atau saran untuk wisatawan lain..."
          required
        ></textarea>
      </div>

      <div v-if="errorMsg" class="alert-error full-width">
        {{ errorMsg }}
      </div>
    </template>

    <template v-if="!currentUser" #footer>
      <div></div>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { api } from '../api.js';
import { useAuth } from '../composables/useAuth.js';
import BaseModal from './common/BaseModal.vue';

const props = defineProps({
  isOpen: Boolean,
  targetType: {
    type: String,
    required: true
  },
  targetId: {
    type: Number,
    required: true
  },
  targetTitle: {
    type: String,
    default: 'Destinasi'
  }
});

const emit = defineEmits(['close', 'review-submitted']);
const { currentUser } = useAuth();
const route = useRoute();

const rating = ref(5);
const reviewerName = ref('');
const reviewText = ref('');
const submitting = ref(false);
const errorMsg = ref('');

// Pre-fill user name if logged in
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    if (currentUser.value?.name) {
      reviewerName.value = currentUser.value.name;
    }
  }
});

function close() {
  errorMsg.value = '';
  emit('close');
}

async function handleSubmit() {
  if (!reviewerName.value.trim() || !reviewText.value.trim()) {
    errorMsg.value = 'Silakan lengkapi nama dan isi ulasan.';
    return;
  }

  submitting.value = true;
  errorMsg.value = '';

  try {
    const res = await api.submitReview({
      target_type: props.targetType,
      target_id: props.targetId,
      rating: rating.value,
      reviewer_name: reviewerName.value.trim(),
      review_text: reviewText.value.trim()
    });

    if (res?.success) {
      emit('review-submitted', res.data);
      reviewText.value = '';
      close();
    } else {
      errorMsg.value = res?.message || 'Gagal mengirimkan ulasan.';
    }
  } catch (err) {
    console.error('Submit review error:', err);
    errorMsg.value = 'Terjadi kesalahan jaringan.';
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.modal-target-info {
  font-size: 0.95rem;
  color: var(--text-muted, #64748b);
  margin-bottom: 0.5rem;
}

.login-gate {
  text-align: center;
  padding: 1.5rem 0.5rem;
}

.login-gate-text {
  color: var(--text-muted, #64748b);
  margin-bottom: 1.5rem;
  font-size: 1rem;
}

.modal-actions-custom {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
}

.stars-selector {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin-top: 0.35rem;
}

.star-btn {
  background: none;
  border: none;
  font-size: 1.85rem;
  color: #cbd5e1;
  cursor: pointer;
  transition: transform 0.15s ease, color 0.15s ease;
  line-height: 1;
  padding: 0;
}

.star-btn:hover,
.star-btn.star-active {
  color: #eab308;
  transform: scale(1.15);
}

.rating-text-hint {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-muted, #64748b);
  margin-left: 0.5rem;
}

.alert-error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  padding: 0.65rem 0.85rem;
  border-radius: var(--radius-md, 8px);
  font-size: 0.875rem;
}
</style>
