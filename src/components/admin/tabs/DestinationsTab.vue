<template>
  <div class="tab-pane">
    <AdminEntityTable
      title="Kelola Destinasi Wisata"
      subtitle="Tambah, ubah data, atau hapus tempat wisata di kawasan Danau Toba."
      search-placeholder="Cari destinasi..."
      add-button-text="+ Tambah"
      add-button-class="btn-primary"
      :columns="DESTINATION_COLUMNS"
      :items="destCrud.filteredItems.value"
      :loading="destCrud.loading.value"
      v-model:search-query="destCrud.searchQuery.value"
      @add="destCrud.openAdd()"
      @edit="destCrud.openEdit"
      @delete="(item) => destCrud.remove(item.id, item.name)"
    >
      <template #cell-name="{ item }">
        <strong>{{ item.name }}</strong>
        <span class="table-sub">{{ item.category_name }}</span>
      </template>
      <template #cell-regency="{ item }">
        {{ item.regency_short || item.regency_name }}
      </template>
      <template #cell-price="{ item }">
        {{ item.price_display }}
      </template>
      <template #cell-rating="{ item }">
        ★ {{ Number(item.rating_avg || 4.5).toFixed(1) }} ({{ item.review_count || 0 }})
      </template>
    </AdminEntityTable>

    <DestinationModal
      v-model="destCrud.modalOpen.value"
      :form="destCrud.form.value"
      :categories="categories"
      :regencies="regencies"
      :saving="destCrud.saving.value"
      @save="destCrud.save()"
    />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { api } from '../../../api.js';
import { useAdminCrud } from '../../../composables/useAdminCrud.js';
import { DESTINATION_COLUMNS } from '../../../constants/admin.js';
import AdminEntityTable from '../AdminEntityTable.vue';
import DestinationModal from '../DestinationModal.vue';

const props = defineProps({
  categories: { type: Array, default: () => [] },
  regencies: { type: Array, default: () => [] }
});

const emit = defineEmits(['update:count']);

const destCrud = useAdminCrud({
  entityLabel: 'Destinasi',
  fetchFn: () => api.getDestinations({ limit: 50 }),
  createFn: api.createDestination,
  updateFn: api.updateDestination,
  deleteFn: api.deleteDestination,
  defaultForm: () => ({
    id: null,
    name: '',
    category_id: props.categories[0]?.id || 1,
    regency_id: props.regencies[0]?.id || 1,
    price_display: 'Gratis',
    operational_hours: '08.00 - 18.00 WIB',
    address: '',
    image_url: '',
    description: '',
    is_community_managed: false
  }),
  filterFn: (d, q) => d.name.toLowerCase().includes(q) || (d.address && d.address.toLowerCase().includes(q)),
  onSuccess: () => {
    emit('update:count', destCrud.items.value.length);
  }
});

defineExpose({
  items: destCrud.items,
  load: destCrud.load
});

onMounted(async () => {
  await destCrud.load();
  emit('update:count', destCrud.items.value.length);
});
</script>

<style scoped>
.table-sub {
  display: block;
  font-size: 0.775rem;
  color: var(--text-muted, #64748b);
  margin-top: 0.2rem;
}
</style>
