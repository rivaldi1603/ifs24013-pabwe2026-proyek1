<template>
  <div class="tab-pane">
    <AdminEntityTable
      title="Kelola Menu Kuliner Khas"
      subtitle="Katalog kuliner tradisional Danau Toba (Naniura, Arsik, Sasagun, dll)."
      search-placeholder="Cari kuliner..."
      add-button-text="+ Tambah Kuliner"
      add-button-class="btn-accent"
      :columns="CULINARY_COLUMNS"
      :items="culinaryCrud.filteredItems.value"
      :loading="culinaryCrud.loading.value"
      v-model:search-query="culinaryCrud.searchQuery.value"
      @add="culinaryCrud.openAdd()"
      @edit="culinaryCrud.openEdit"
      @delete="(item) => culinaryCrud.remove(item.id, item.name)"
    >
      <template #cell-name="{ item }">
        <strong>{{ item.name }}</strong>
      </template>
      <template #cell-halal_status="{ item }">
        <span class="badge" :class="item.halal_status === 'Halal' ? 'badge-halal' : 'badge-non-halal'">
          {{ item.halal_status }}
        </span>
      </template>
      <template #cell-description="{ item }">
        <p class="table-desc-cell">{{ item.description }}</p>
      </template>
    </AdminEntityTable>

    <CulinaryModal
      v-model="culinaryCrud.modalOpen.value"
      :form="culinaryCrud.form.value"
      :saving="culinaryCrud.saving.value"
      @save="culinaryCrud.save()"
    />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { api } from '../../../api.js';
import { useAdminCrud } from '../../../composables/useAdminCrud.js';
import { CULINARY_COLUMNS } from '../../../constants/admin.js';
import AdminEntityTable from '../AdminEntityTable.vue';
import CulinaryModal from '../CulinaryModal.vue';

const emit = defineEmits(['update:count']);

const culinaryCrud = useAdminCrud({
  entityLabel: 'Menu Kuliner',
  fetchFn: () => api.getCulinary(),
  createFn: api.createCulinary,
  updateFn: api.updateCulinary,
  deleteFn: api.deleteCulinary,
  defaultForm: () => ({
    id: null,
    name: '',
    halal_status: 'Halal',
    origin_region: 'Toba Samosir',
    image_url: '',
    description: ''
  }),
  filterFn: (c, q) => c.name.toLowerCase().includes(q) || (c.origin_region && c.origin_region.toLowerCase().includes(q)),
  onSuccess: () => {
    emit('update:count', culinaryCrud.items.value.length);
  }
});

defineExpose({
  items: culinaryCrud.items,
  load: culinaryCrud.load
});

onMounted(async () => {
  await culinaryCrud.load();
  emit('update:count', culinaryCrud.items.value.length);
});
</script>

<style scoped>
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
.badge-halal {
  background: rgba(16, 185, 129, 0.12);
  color: #064e3b;
  font-weight: 700;
  padding: 0.2rem 0.55rem;
  border-radius: var(--radius-full, 9999px);
  font-size: 0.75rem;
}
.badge-non-halal {
  background: rgba(239, 68, 68, 0.12);
  color: #7f1d1d;
  font-weight: 700;
  padding: 0.2rem 0.55rem;
  border-radius: var(--radius-full, 9999px);
  font-size: 0.75rem;
}
</style>
