<template>
  <div class="tab-panel card fade-in">
    <div class="panel-header">
      <div>
        <h2 class="panel-title">{{ title }}</h2>
        <p v-if="subtitle" class="panel-sub">{{ subtitle }}</p>
      </div>
      <div class="panel-tools">
        <input
          :value="searchQuery"
          @input="$emit('update:searchQuery', $event.target.value)"
          type="text"
          :placeholder="searchPlaceholder"
          class="form-input search-mini"
          :aria-label="searchPlaceholder"
        />
        <button
          v-if="showAddButton"
          type="button"
          :class="['btn btn-sm', addButtonClass]"
          @click="$emit('add')"
        >
          {{ addButtonText }}
        </button>
      </div>
    </div>

    <div class="table-responsive">
      <div v-if="loading" class="table-loading-state">
        <div class="table-spinner"></div>
        <span>Memuat data...</span>
      </div>

      <div v-else-if="items.length === 0" class="table-empty-state">
        <p class="empty-text">Tidak ada data yang cocok dengan pencarian.</p>
      </div>

      <table v-else class="data-table" :aria-label="title">
        <thead>
          <tr>
            <th v-for="col in columns" :key="col.key">
              {{ col.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id">
            <td v-for="col in columns" :key="col.key">
              <!-- Custom Cell Slot -->
              <slot :name="`cell-${col.key}`" :item="item" :value="item[col.key]">
                <!-- Default ID rendering -->
                <span v-if="col.key === 'id'" class="id-tag">#{{ item.id }}</span>

                <!-- Default Actions rendering -->
                <div v-else-if="col.key === 'actions'" class="table-actions">
                  <slot name="actions" :item="item">
                    <button
                      v-if="canEdit"
                      type="button"
                      class="btn-table btn-edit"
                      :aria-label="`Edit ${item.name || item.title || item.id}`"
                      @click="$emit('edit', item)"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      v-if="canDelete"
                      type="button"
                      class="btn-table btn-del"
                      :aria-label="`Hapus ${item.name || item.title || item.id}`"
                      @click="$emit('delete', item)"
                    >
                      🗑️ Hapus
                    </button>
                  </slot>
                </div>

                <!-- Fallback to raw property -->
                <span v-else>{{ item[col.key] ?? '-' }}</span>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  columns: { type: Array, required: true },
  items: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  searchQuery: { type: String, default: '' },
  searchPlaceholder: { type: String, default: 'Cari data...' },
  showAddButton: { type: Boolean, default: true },
  addButtonText: { type: String, default: '+ Tambah Data' },
  addButtonClass: { type: String, default: 'btn-primary' },
  canEdit: { type: Boolean, default: true },
  canDelete: { type: Boolean, default: true }
});

defineEmits(['update:searchQuery', 'add', 'edit', 'delete']);
</script>

<style scoped>
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  background: #ffffff;
}

.panel-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.panel-sub {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0.25rem 0 0;
}

.panel-tools {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}

.search-mini {
  width: 220px;
  padding: 0.45rem 0.75rem;
  font-size: 0.875rem;
}

.table-responsive {
  overflow-x: auto;
  min-height: 200px;
}

.table-loading-state,
.table-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 3rem 1.5rem;
  color: #64748b;
  font-size: 0.95rem;
}

.table-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e2e8f0;
  border-top-color: #0d9488;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.empty-text {
  margin: 0;
  font-style: italic;
}

@media (max-width: 640px) {
  .panel-header {
    flex-direction: column;
    align-items: stretch;
  }
  .search-mini {
    width: 100%;
  }
}
</style>
