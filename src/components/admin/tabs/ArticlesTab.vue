<template>
  <div class="tab-pane">
    <AdminEntityTable
      title="Kelola Cerita Danau Toba (Artikel Budaya & Wisata)"
      subtitle="Artikel wawasan budaya, legenda, dan tips perjalanan bagi wisatawan."
      search-placeholder="Cari judul cerita..."
      add-button-text="+ Tulis Cerita Baru"
      add-button-class="btn-primary"
      :columns="ARTICLE_COLUMNS"
      :items="articleCrud.filteredItems.value"
      :loading="articleCrud.loading.value"
      v-model:search-query="articleCrud.searchQuery.value"
      @add="articleCrud.openAdd()"
      @edit="articleCrud.openEdit"
      @delete="(item) => articleCrud.remove(item.id, item.title)"
    >
      <template #cell-title="{ item }">
        <strong>{{ item.title }}</strong>
        <span class="table-sub">
          <a :href="item.source_url || '#'" target="_blank" rel="noopener noreferrer" class="link-source">
            Buka Sumber Tautan
          </a>
        </span>
      </template>
      <template #cell-regency="{ item }">
        {{ item.regency_short || item.regency_name || 'Kawasan Toba' }}
      </template>
      <template #cell-summary="{ item }">
        <p class="table-desc-cell">{{ item.summary }}</p>
      </template>
      <template #cell-published_at="{ item }">
        <small class="time-sub">{{ item.published_at }}</small>
      </template>
    </AdminEntityTable>

    <ArticleModal
      v-model="articleCrud.modalOpen.value"
      :form="articleCrud.form.value"
      :regencies="regencies"
      :saving="articleCrud.saving.value"
      @save="articleCrud.save()"
    />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { api } from '../../../api.js';
import { useAdminCrud } from '../../../composables/useAdminCrud.js';
import { ARTICLE_COLUMNS } from '../../../constants/admin.js';
import AdminEntityTable from '../AdminEntityTable.vue';
import ArticleModal from '../ArticleModal.vue';

const props = defineProps({
  regencies: { type: Array, default: () => [] }
});

const emit = defineEmits(['update:count']);

const articleCrud = useAdminCrud({
  entityLabel: 'Cerita Toba',
  fetchFn: () => api.getArticles(),
  createFn: api.createArticle,
  updateFn: api.updateArticle,
  deleteFn: api.deleteArticle,
  defaultForm: () => ({
    id: null,
    title: '',
    regency_id: props.regencies[0]?.id || 1,
    summary: '',
    content: '',
    source_url: '',
    image_url: '',
    published_at: new Date().toISOString().split('T')[0]
  }),
  filterFn: (a, q) => a.title.toLowerCase().includes(q) || (a.summary && a.summary.toLowerCase().includes(q)),
  onSuccess: () => {
    emit('update:count', articleCrud.items.value.length);
  }
});

defineExpose({
  items: articleCrud.items,
  load: articleCrud.load
});

onMounted(async () => {
  await articleCrud.load();
  emit('update:count', articleCrud.items.value.length);
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
.link-source {
  color: var(--primary-color, #0284c7);
  text-decoration: underline;
}
.time-sub {
  font-size: 0.75rem;
  color: var(--text-muted, #64748b);
}
</style>
