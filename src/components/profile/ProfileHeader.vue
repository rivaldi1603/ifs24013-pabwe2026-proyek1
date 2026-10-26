<template>
  <div class="profile-header card fade-in">
    <div class="user-intro">
      <!-- AVATAR CONTAINER -->
      <div class="avatar-wrapper" @click="$emit('edit')" title="Klik untuk mengganti foto profil">
        <img v-if="user?.avatar_url" :src="user.avatar_url" :alt="user.name" class="user-avatar-img" />
        <div v-else class="user-avatar-large">
          {{ user?.name ? user.name.charAt(0).toUpperCase() : 'U' }}
        </div>
        <span class="avatar-edit-badge" title="Ganti foto">📷</span>
      </div>

      <div class="user-intro-text">
        <div class="badge-role-row">
          <span class="user-role-badge" :class="user?.role === 'partner' ? 'badge-partner' : 'badge-user'">
            {{ user?.role === 'partner' ? '🧶 MITRA KOMUNITAS' : '🌿 WISATAWAN TERDAFTAR' }}
          </span>
          <span class="account-status-chip">Akun Aktif</span>
        </div>

        <h1 class="user-display-name">{{ user?.name }}</h1>
        
        <div class="user-contact-chips">
          <span class="contact-chip">✉️ {{ user?.email }}</span>
          <span v-if="user?.phone" class="contact-chip">📱 {{ user.phone }}</span>
        </div>

        <!-- USER BIO -->
        <p class="user-bio-text">
          {{ user?.bio || 'Belum ada bio. Ceritakan pengalaman dan ketertarikan Anda saat menjelajah keindahan Danau Toba!' }}
        </p>
      </div>
    </div>

    <div class="profile-header-actions">
      <button @click="$emit('edit')" class="btn btn-secondary btn-edit-profile">
        ✏️ Edit Profil & Foto
      </button>
      <router-link to="/destinasi" class="btn btn-primary">
        🔍 Jelajahi Wisata
      </router-link>
    </div>
  </div>
</template>

<script setup>
defineProps({
  user: {
    type: Object,
    default: null
  }
});

defineEmits(['edit']);
</script>

<style scoped>
.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
  padding: 2.25rem;
  border-radius: var(--radius-xl, 16px);
  margin-bottom: 1.5rem;
  background: white;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
}

.user-intro {
  display: flex;
  align-items: flex-start;
  gap: 1.75rem;
  flex: 1;
}

.avatar-wrapper {
  position: relative;
  cursor: pointer;
  flex-shrink: 0;
}

.avatar-wrapper:hover .avatar-edit-badge {
  transform: scale(1.15);
  background: #0284c7;
}

.user-avatar-large {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: linear-gradient(135deg, #047857 0%, #065f46 100%);
  color: white;
  font-size: 2.5rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(4, 120, 87, 0.3);
}

.user-avatar-img {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.12);
}

.avatar-edit-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  background: #047857;
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  border: 2px solid white;
  transition: transform 0.2s ease, background 0.2s ease;
}

.badge-role-row {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  margin-bottom: 0.35rem;
}

.user-role-badge {
  font-size: 0.725rem;
  font-weight: 800;
  padding: 0.2rem 0.6rem;
  border-radius: var(--radius-full, 9999px);
  letter-spacing: 0.04em;
}

.badge-user {
  background: #065f46;
  color: #ffffff;
}

.badge-partner {
  background: #5b21b6;
  color: #ffffff;
}

.account-status-chip {
  font-size: 0.75rem;
  color: #065f46;
  font-weight: 700;
}

.user-display-name {
  font-size: 1.85rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
  line-height: 1.2;
}

.user-contact-chips {
  display: flex;
  gap: 0.75rem;
  margin: 0.4rem 0 0.75rem;
  flex-wrap: wrap;
}

.contact-chip {
  font-size: 0.825rem;
  color: #64748b;
  background: #f8fafc;
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-sm, 6px);
  border: 1px solid #f1f5f9;
}

.user-bio-text {
  font-size: 0.925rem;
  color: #475569;
  line-height: 1.5;
  background: #f8fafc;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md, 8px);
  border-left: 3px solid #10b981;
  max-width: 680px;
  margin: 0;
}

.profile-header-actions {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  flex-shrink: 0;
}

.btn-edit-profile {
  font-weight: 700;
}

@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    padding: 1.5rem;
  }
  .user-intro {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .badge-role-row, .user-contact-chips {
    justify-content: center;
  }
  .profile-header-actions {
    width: 100%;
  }
}
</style>
