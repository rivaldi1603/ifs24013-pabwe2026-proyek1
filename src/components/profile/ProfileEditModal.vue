<template>
  <BaseModal
    :model-value="modelValue"
    title="Edit Profil Pengguna"
    :saving="saving"
    submit-text="Simpan Perubahan"
    max-width="540px"
    @update:model-value="$emit('update:modelValue', $event)"
    @submit="handleSubmit"
  >
    <!-- AVATAR UPLOAD & PREVIEW -->
    <div class="form-group avatar-center full-width">
      <span class="form-label avatar-label">Foto Profil</span>
      <div class="avatar-preview-box">
        <img v-if="form.avatar_url" :src="form.avatar_url" alt="Preview Foto" class="preview-avatar-img" />
        <div v-else class="preview-avatar-placeholder">
          {{ form.name ? form.name.charAt(0).toUpperCase() : 'U' }}
        </div>
      </div>

      <div class="avatar-upload-controls">
        <label class="btn btn-secondary btn-sm upload-btn-label">
          📁 Upload Foto Baru
          <input type="file" accept="image/*" class="file-hidden-input" @change="handleFileUpload" />
        </label>
        <button
          v-if="form.avatar_url"
          type="button"
          class="btn btn-sm btn-link-danger"
          @click="form.avatar_url = ''"
        >
          Hapus Foto
        </button>
      </div>
      <small class="upload-hint">Foto otomatis di-crop & dioptimalkan (JPG, PNG, WebP)</small>
    </div>

    <!-- NAMA LENGKAP -->
    <div class="form-group full-width">
      <label for="prof-name" class="form-label">Nama Lengkap *</label>
      <input
        id="prof-name"
        v-model="form.name"
        type="text"
        class="form-input"
        placeholder="Nama Anda"
        required
      />
    </div>

    <!-- EMAIL (READONLY) -->
    <div class="form-group full-width">
      <label for="prof-email" class="form-label">Alamat Email</label>
      <input
        id="prof-email"
        :value="user?.email"
        type="email"
        class="form-input disabled-input"
        disabled
      />
      <small class="field-hint">Alamat email digunakan untuk login dan tidak dapat diubah.</small>
    </div>

    <!-- NOMOR HP / WHATSAPP -->
    <div class="form-group full-width">
      <label for="prof-phone" class="form-label">Nomor Telepon / WhatsApp</label>
      <input
        id="prof-phone"
        v-model="form.phone"
        type="text"
        class="form-input"
        placeholder="Contoh: 081234567890"
      />
    </div>

    <!-- BIO -->
    <div class="form-group full-width">
      <label for="prof-bio" class="form-label">Bio / Tentang Diri Anda</label>
      <textarea
        id="prof-bio"
        v-model="form.bio"
        rows="3"
        class="form-textarea"
        placeholder="Ceritakan minat Anda dalam berwisata, makanan favorit di Danau Toba, atau profesi Anda..."
      ></textarea>
    </div>

    <div v-if="displayError" class="alert-error full-width">
      {{ displayError }}
    </div>
  </BaseModal>
</template>

<script setup>
import { reactive, watch, ref, computed } from 'vue';
import BaseModal from '../common/BaseModal.vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  user: {
    type: Object,
    default: () => ({})
  },
  saving: {
    type: Boolean,
    default: false
  },
  errorMessage: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue', 'save']);

const form = reactive({
  name: '',
  phone: '',
  bio: '',
  avatar_url: ''
});

const localError = ref('');

const displayError = computed(() => localError.value || props.errorMessage);

watch(
  () => props.modelValue,
  (open) => {
    if (open && props.user) {
      form.name = props.user.name || '';
      form.phone = props.user.phone || '';
      form.bio = props.user.bio || '';
      form.avatar_url = props.user.avatar_url || '';
      localError.value = '';
    }
  },
  { immediate: true }
);

function handleFileUpload(e) {
  const file = e.target.files?.[0];
  if (!file) return;

  if (file.size > 10 * 1024 * 1024) {
    localError.value = 'Ukuran file foto maksimal adalah 10 MB.';
    return;
  }

  const reader = new FileReader();
  reader.onload = (event) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX_SIZE = 260;
      const width = img.width;
      const height = img.height;

      const minSide = Math.min(width, height);
      const startX = (width - minSide) / 2;
      const startY = (height - minSide) / 2;

      canvas.width = MAX_SIZE;
      canvas.height = MAX_SIZE;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, startX, startY, minSide, minSide, 0, 0, MAX_SIZE, MAX_SIZE);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        form.avatar_url = compressedDataUrl;
        localError.value = '';
      }
    };
    img.onerror = () => {
      localError.value = 'Gagal membaca format gambar.';
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
}

function handleSubmit() {
  if (!form.name.trim()) {
    localError.value = 'Nama lengkap wajib diisi.';
    return;
  }
  emit('save', {
    name: form.name.trim(),
    phone: form.phone.trim(),
    bio: form.bio.trim(),
    avatar_url: form.avatar_url
  });
}
</script>

<style scoped>
.avatar-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.avatar-label {
  display: block;
  margin-bottom: 0.75rem;
}

.avatar-preview-box {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 3px solid var(--primary, #0284c7);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-card, #ffffff);
  margin-bottom: 0.75rem;
}

.preview-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-avatar-placeholder {
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--primary, #0284c7);
}

.avatar-upload-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.upload-btn-label {
  cursor: pointer;
  margin: 0;
}

.file-hidden-input {
  display: none;
}

.upload-hint {
  color: var(--text-muted, #64748b);
  font-size: 0.8rem;
}

.disabled-input {
  background-color: var(--bg-muted, #f1f5f9);
  cursor: not-allowed;
  opacity: 0.75;
}

.field-hint {
  color: var(--text-muted, #64748b);
  font-size: 0.8rem;
  margin-top: 0.25rem;
  display: block;
}

.alert-error {
  background-color: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.875rem;
}
</style>
