<template>
  <div class="tab-pane">
    <AdminEntityTable
      title="Kelola Jadwal Ferry & Transportasi Danau Toba"
      subtitle="Jadwal penyeberangan KMP Ferry, kapal kayu tradisional, dan shuttle darat."
      search-placeholder="Cari rute penyeberangan..."
      add-button-text="+ Tambah Rute"
      add-button-class="btn-primary"
      :columns="TRANSPORT_COLUMNS"
      :items="transportCrud.filteredItems.value"
      :loading="transportCrud.loading.value"
      v-model:search-query="transportCrud.searchQuery.value"
      @add="transportCrud.openAdd()"
      @edit="transportCrud.openEdit"
      @delete="(item) => transportCrud.remove(item.id, item.name)"
    >
      <template #cell-name="{ item }">
        <strong>{{ item.name }}</strong>
        <span class="table-sub">{{ item.operator || 'Dishub' }}</span>
      </template>
      <template #cell-transport_type="{ item }">
        <span class="badge" :class="getTransportMeta(item.transport_type).badgeClass">
          {{ getTransportMeta(item.transport_type).label }}
        </span>
      </template>
      <template #cell-route_direction="{ item }">
        <strong>{{ item.route_direction }}</strong>
      </template>
    </AdminEntityTable>

    <TransportModal
      v-model="transportCrud.modalOpen.value"
      :form="transportCrud.form.value"
      :saving="transportCrud.saving.value"
      @save="transportCrud.save()"
    />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { api } from '../../../api.js';
import { useAdminCrud } from '../../../composables/useAdminCrud.js';
import { TRANSPORT_COLUMNS } from '../../../constants/admin.js';
import { TRANSPORT_TYPES, getTransportMeta } from '../../../constants/transport.js';
import AdminEntityTable from '../AdminEntityTable.vue';
import TransportModal from '../TransportModal.vue';

const emit = defineEmits(['update:count']);

const transportCrud = useAdminCrud({
  entityLabel: 'Rute Transportasi',
  fetchFn: () => api.getTransport(),
  createFn: api.createTransport,
  updateFn: api.updateTransport,
  deleteFn: api.deleteTransport,
  defaultForm: () => ({
    id: null,
    name: '',
    transport_type: TRANSPORT_TYPES.FERRY,
    route_direction: '',
    vehicle_type: 'Kapal Motor Penyeberangan (KMP)',
    departure_hours: 'Setiap 1-2 Jam',
    price_display: 'Rp 15.000 / orang',
    operator: 'PT ASDP Indonesia Ferry',
    contact: '191 (ASDP)',
    description: ''
  }),
  filterFn: (t, q) => t.name.toLowerCase().includes(q) || t.route_direction.toLowerCase().includes(q),
  onSuccess: () => {
    emit('update:count', transportCrud.items.value.length);
  }
});

defineExpose({
  items: transportCrud.items,
  load: transportCrud.load
});

onMounted(async () => {
  await transportCrud.load();
  emit('update:count', transportCrud.items.value.length);
});
</script>

<style scoped>
.table-sub {
  display: block;
  font-size: 0.775rem;
  color: var(--text-muted, #64748b);
  margin-top: 0.2rem;
}
.badge-role-admin {
  background: rgba(3, 105, 161, 0.12);
  color: #0c4a6e;
}
.badge-role-partner {
  background: rgba(16, 185, 129, 0.12);
  color: #064e3b;
}
.badge-role-user {
  background: rgba(100, 116, 139, 0.12);
  color: #1e293b;
}
</style>
