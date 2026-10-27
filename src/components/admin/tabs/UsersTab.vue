<template>
  <div class="tab-pane">
    <AdminEntityTable
      title="Daftar Pengguna Terdaftar"
      subtitle="Seluruh pengguna platform JelajahToba yang tersimpan di basis data."
      search-placeholder="Cari nama atau email..."
      :show-add-button="false"
      :can-edit="false"
      :can-delete="false"
      :columns="USER_COLUMNS"
      :items="filteredUsers"
      :loading="loading"
      v-model:search-query="searchQuery"
    >
      <template #cell-name="{ item }">
        <strong>{{ item.name }}</strong>
        <span v-if="item.organization" class="table-sub">{{ item.organization }}</span>
      </template>
      <template #cell-email="{ item }">
        <code>{{ item.email }}</code>
      </template>
      <template #cell-role="{ item }">
        <span
          class="badge"
          :class="{
            'badge-role-admin': item.role === 'admin',
            'badge-role-partner': item.role === 'partner',
            'badge-role-user': item.role === 'user'
          }"
        >
          {{ item.role === 'admin' ? '👑 Admin' : (item.role === 'partner' ? '🧶 Mitra' : '👤 Wisatawan') }}
        </span>
      </template>
      <template #cell-phone="{ item }">
        {{ item.phone || '-' }}
      </template>
      <template #cell-bio="{ item }">
        <small class="table-desc-cell">{{ item.bio || '-' }}</small>
      </template>
      <template #cell-created_at="{ item }">
        <small class="time-sub">{{ item.created_at }}</small>
      </template>
    </AdminEntityTable>
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue';
import { USER_COLUMNS } from '../../../constants/admin.js';
import { useAdminUsers } from '../../../composables/useAdminUsers.js';
import AdminEntityTable from '../AdminEntityTable.vue';

const emit = defineEmits(['update:count']);

const {
  usersList,
  loading,
  searchQuery,
  filteredUsers,
  loadUsers
} = useAdminUsers();

watch(usersList, (newVal) => {
  emit('update:count', newVal.length);
});

defineExpose({
  items: usersList,
  load: loadUsers
});

onMounted(async () => {
  await loadUsers();
  emit('update:count', usersList.value.length);
});
</script>

<style scoped>
.table-sub {
  display: block;
  font-size: 0.775rem;
  color: var(--text-muted, #64748b);
  margin-top: 0.2rem;
}
.table-desc-cell {
  font-size: 0.8rem;
  color: var(--text-muted, #64748b);
  max-width: 320px;
  line-height: 1.4;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.badge-role-admin {
  background: rgba(3, 105, 161, 0.12);
  color: #0c4a6e;
  font-weight: 700;
  padding: 0.2rem 0.55rem;
  border-radius: var(--radius-full, 9999px);
  font-size: 0.75rem;
}
.badge-role-partner {
  background: rgba(16, 185, 129, 0.12);
  color: #064e3b;
  font-weight: 700;
  padding: 0.2rem 0.55rem;
  border-radius: var(--radius-full, 9999px);
  font-size: 0.75rem;
}
.badge-role-user {
  background: rgba(100, 116, 139, 0.12);
  color: #1e293b;
  font-weight: 700;
  padding: 0.2rem 0.55rem;
  border-radius: var(--radius-full, 9999px);
  font-size: 0.75rem;
}
.time-sub {
  font-size: 0.75rem;
  color: var(--text-muted, #64748b);
}
</style>
