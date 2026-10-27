<template>
  <div class="tab-pane">
    <AdminEntityTable
      title="Kelola Jasa Budaya & Homestay Warga"
      subtitle="Layanan berbasis komunitas lokal Danau Toba."
      search-placeholder="Cari jasa / pengelola..."
      add-button-text="+ Tambah"
      add-button-class="btn-accent"
      :columns="SERVICE_COLUMNS"
      :items="serviceCrud.filteredItems.value"
      :loading="serviceCrud.loading.value"
      v-model:search-query="serviceCrud.searchQuery.value"
      @add="serviceCrud.openAdd()"
      @edit="serviceCrud.openEdit"
      @delete="(item) => serviceCrud.remove(item.id, item.name)"
    >
      <template #cell-name="{ item }">
        <strong>{{ item.name }}</strong>
        <span class="table-sub">{{ item.regency_short || item.regency_name }}</span>
      </template>
      <template #cell-provider="{ item }">
        {{ item.provider_name }}
      </template>
      <template #cell-service_type="{ item }">
        <span class="badge badge-service">{{ formatServiceType(item.service_type) }}</span>
      </template>
      <template #cell-price="{ item }">
        {{ item.price_display }} <small v-if="item.price_unit">/{{ item.price_unit }}</small>
      </template>
      <template #cell-contact_wa="{ item }">
        <code>{{ item.contact_wa || '-' }}</code>
      </template>
    </AdminEntityTable>

    <ServiceModal
      v-model="serviceCrud.modalOpen.value"
      :form="serviceCrud.form.value"
      :regencies="regencies"
      :saving="serviceCrud.saving.value"
      @save="serviceCrud.save()"
    />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { api } from '../../../api.js';
import { useAdminCrud } from '../../../composables/useAdminCrud.js';
import { formatServiceType } from '../../../utils/formatters.js';
import { SERVICE_COLUMNS } from '../../../constants/admin.js';
import AdminEntityTable from '../AdminEntityTable.vue';
import ServiceModal from '../ServiceModal.vue';

const props = defineProps({
  categories: { type: Array, default: () => [] },
  regencies: { type: Array, default: () => [] }
});

const emit = defineEmits(['update:count']);

const serviceCrud = useAdminCrud({
  entityLabel: 'Layanan Jasa',
  fetchFn: () => api.getServices({ limit: 50 }),
  createFn: api.createService,
  updateFn: api.updateService,
  deleteFn: api.deleteService,
  defaultForm: () => ({
    id: null,
    name: '',
    provider_name: '',
    service_type: 'homestay',
    category_id: props.categories[0]?.id || 1,
    regency_id: props.regencies[0]?.id || 1,
    price_display: 'Rp 150.000',
    price_unit: 'per malam',
    facilities: '',
    address: '',
    contact_phone: '',
    contact_wa: '',
    image_url: '',
    description: '',
    is_community_managed: true
  }),
  filterFn: (s, q) => s.name.toLowerCase().includes(q) || s.provider_name.toLowerCase().includes(q),
  onSuccess: () => {
    emit('update:count', serviceCrud.items.value.length);
  }
});

defineExpose({
  items: serviceCrud.items,
  load: serviceCrud.load
});

onMounted(async () => {
  await serviceCrud.load();
  emit('update:count', serviceCrud.items.value.length);
});
</script>

<style scoped>
.table-sub {
  display: block;
  font-size: 0.775rem;
  color: var(--text-muted, #64748b);
  margin-top: 0.2rem;
}
.badge-service {
  background: rgba(14, 165, 233, 0.12);
  color: #0c4a6e;
  font-weight: 700;
  padding: 0.2rem 0.55rem;
  border-radius: var(--radius-full, 9999px);
  font-size: 0.75rem;
}
</style>
