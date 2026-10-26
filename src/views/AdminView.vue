<template>
  <div class="admin-page container">
    <!-- HEADER ADMIN -->
    <header class="dash-header admin-header-theme fade-in">
      <div>
        <div class="badge-role-row">
          <span class="user-role-badge badge-admin-glow">👑 SUPER ADMINISTRATOR</span>
          <span class="badge-system-status">Pusat Kendali Seluruh Konten</span>
        </div>
        <h1 class="dash-title">Panel Pengelolaan JelajahToba</h1>
        <p class="dash-subtitle">
          Selamat datang, <strong>{{ user?.name }}</strong>. Sebagai Administrator, Anda memiliki akses penuh untuk menambah, mengedit, dan menghapus seluruh konten platform: Destinasi, Jasa Budaya, Jadwal Ferry, Kuliner Khas, Cerita Toba, Ulasan, dan Pengguna.
        </p>
      </div>

      <div class="dash-quick-create">
        <button v-if="currentTab === 'destinations'" type="button" @click="destCrud.openAdd()" class="btn btn-primary">
          + Tambah Destinasi Baru
        </button>
        <button v-else-if="currentTab === 'services'" type="button" @click="serviceCrud.openAdd()" class="btn btn-accent">
          + Tambah Jasa / Homestay
        </button>
        <button v-else-if="currentTab === 'transport'" type="button" @click="transportCrud.openAdd()" class="btn btn-primary">
          + Tambah Rute Ferry
        </button>
        <button v-else-if="currentTab === 'culinary'" type="button" @click="culinaryCrud.openAdd()" class="btn btn-accent">
          + Tambah Kuliner Khas
        </button>
        <button v-else-if="currentTab === 'articles'" type="button" @click="articleCrud.openAdd()" class="btn btn-primary">
          + Tulis Cerita Toba
        </button>
      </div>
    </header>

    <!-- METRICS GRID -->
    <section class="metrics-grid fade-in" aria-label="Ringkasan Statistik Konten">
      <div
        v-for="tab in ADMIN_TABS"
        :key="tab.id"
        class="metric-card card clickable"
        :class="tab.themeClass"
        @click="currentTab = tab.id"
      >
        <div class="metric-icon-wrap">{{ tab.icon }}</div>
        <div class="metric-data">
          <span class="metric-num">{{ getCountForTab(tab.id) }}</span>
          <span class="metric-label">{{ tab.label }}</span>
        </div>
      </div>
    </section>

    <!-- TABS ADMIN NAV -->
    <nav class="dash-tabs fade-in" aria-label="Navigasi Tab Admin">
      <button
        v-for="tab in ADMIN_TABS"
        :key="tab.id"
        type="button"
        class="dash-tab-btn"
        :class="{ active: currentTab === tab.id }"
        @click="currentTab = tab.id"
      >
        {{ tab.icon }} {{ tab.label }} ({{ getCountForTab(tab.id) }})
      </button>
    </nav>

    <!-- TAB 1: DESTINASI WISATA -->
    <AdminEntityTable
      v-if="currentTab === 'destinations'"
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

    <!-- TAB 2: JASA BUDAYA & HOMESTAY -->
    <AdminEntityTable
      v-if="currentTab === 'services'"
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

    <!-- TAB 3: JADWAL FERRY & TRANSPORTASI -->
    <AdminEntityTable
      v-if="currentTab === 'transport'"
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
        <span class="badge" :class="item.transport_type === 'ferry' ? 'badge-role-admin' : 'badge-role-partner'">
          {{ item.transport_type === 'ferry' ? '🚢 Ferry KMP' : (item.transport_type === 'traditional_boat' ? '⛵ Kapal Tradisional' : '🚐 Shuttle') }}
        </span>
      </template>
      <template #cell-route_direction="{ item }">
        <strong>{{ item.route_direction }}</strong>
      </template>
    </AdminEntityTable>

    <!-- TAB 4: KULINER KHAS BATAK -->
    <AdminEntityTable
      v-if="currentTab === 'culinary'"
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

    <!-- TAB 5: CERITA TOBA (ARTIKEL) -->
    <AdminEntityTable
      v-if="currentTab === 'articles'"
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

    <!-- TAB 6: MODERASI ULASAN PENGUNJUNG -->
    <AdminEntityTable
      v-if="currentTab === 'reviews'"
      title="Moderasi Ulasan Pengunjung"
      subtitle="Hapus ulasan spam atau komentar tidak pantas dari pengunjung."
      search-placeholder="Cari pengulas..."
      :show-add-button="false"
      :can-edit="false"
      :columns="REVIEW_COLUMNS"
      :items="filteredReviews"
      :loading="loadingReviews"
      v-model:search-query="reviewSearch"
      @delete="(r) => handleDeleteReview(r.id)"
    >
      <template #cell-reviewer="{ item }">
        <strong>{{ item.reviewer_name }}</strong>
        <span class="table-sub">{{ item.user_id ? 'Terdaftar' : 'Tamu' }}</span>
      </template>
      <template #cell-target="{ item }">
        <span class="badge-target">{{ item.target_type === 'destination' ? '📍 Destinasi' : '🧶 Layanan' }}</span>
        <div class="target-title">{{ item.target_name || ('ID: ' + item.target_id) }}</div>
      </template>
      <template #cell-rating="{ item }">
        <span class="rating-stars-gold">★ {{ Number(item.rating).toFixed(1) }}</span>
      </template>
      <template #cell-review_text="{ item }">
        <p class="review-comment-full">"{{ item.review_text }}"</p>
      </template>
      <template #cell-created_at="{ item }">
        <small class="time-sub">{{ item.created_at }}</small>
      </template>
    </AdminEntityTable>

    <!-- TAB 7: MANAJEMEN PENGGUNA (USERS) -->
    <AdminEntityTable
      v-if="currentTab === 'users'"
      title="Daftar Pengguna Terdaftar"
      subtitle="Seluruh pengguna platform JelajahToba yang tersimpan di basis data."
      search-placeholder="Cari nama atau email..."
      :show-add-button="false"
      :can-edit="false"
      :can-delete="false"
      :columns="USER_COLUMNS"
      :items="filteredUsersList"
      :loading="loadingUsers"
      v-model:search-query="userSearch"
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

    <!-- ==================== MODALS ==================== -->
    <DestinationModal
      v-model="destCrud.modalOpen.value"
      :form="destCrud.form.value"
      :categories="categories"
      :regencies="regencies"
      :saving="destCrud.saving.value"
      @save="destCrud.save()"
    />

    <ServiceModal
      v-model="serviceCrud.modalOpen.value"
      :form="serviceCrud.form.value"
      :regencies="regencies"
      :saving="serviceCrud.saving.value"
      @save="serviceCrud.save()"
    />

    <TransportModal
      v-model="transportCrud.modalOpen.value"
      :form="transportCrud.form.value"
      :saving="transportCrud.saving.value"
      @save="transportCrud.save()"
    />

    <CulinaryModal
      v-model="culinaryCrud.modalOpen.value"
      :form="culinaryCrud.form.value"
      :saving="culinaryCrud.saving.value"
      @save="culinaryCrud.save()"
    />

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
import { ref, shallowRef, computed, onMounted, watch } from 'vue';
import { api } from '../api';
import { useAuth } from '../composables/useAuth';
import { formatServiceType } from '../utils/formatters';
import { useAdminCrud } from '../composables/useAdminCrud';
import { useToast } from '../composables/useToast';
import { useConfirm } from '../composables/useConfirm';
import {
  ADMIN_TABS,
  DESTINATION_COLUMNS,
  SERVICE_COLUMNS,
  TRANSPORT_COLUMNS,
  CULINARY_COLUMNS,
  ARTICLE_COLUMNS,
  REVIEW_COLUMNS,
  USER_COLUMNS
} from '../constants/admin';
import AdminEntityTable from '../components/admin/AdminEntityTable.vue';
import DestinationModal from '../components/admin/DestinationModal.vue';
import ServiceModal from '../components/admin/ServiceModal.vue';
import TransportModal from '../components/admin/TransportModal.vue';
import CulinaryModal from '../components/admin/CulinaryModal.vue';
import ArticleModal from '../components/admin/ArticleModal.vue';

const { currentUser: user } = useAuth();
const { confirm } = useConfirm();
const { success: toastSuccess, error: toastError } = useToast();

// Active tab
const currentTab = ref('destinations');

// Master references
const regencies = shallowRef([]);
const categories = shallowRef([]);
const allReviews = shallowRef([]);
const usersList = shallowRef([]);
const loadingReviews = ref(false);
const loadingUsers = ref(false);
const reviewSearch = ref('');
const userSearch = ref('');

// 1. Destinations CRUD Composable
const destCrud = useAdminCrud({
  entityLabel: 'Destinasi',
  fetchFn: () => api.getDestinations({ limit: 50 }),
  createFn: api.createDestination,
  updateFn: api.updateDestination,
  deleteFn: api.deleteDestination,
  defaultForm: () => ({
    id: null,
    name: '',
    category_id: categories.value[0]?.id || 1,
    regency_id: regencies.value[0]?.id || 1,
    price_display: 'Gratis',
    operational_hours: '08.00 - 18.00 WIB',
    address: '',
    image_url: '',
    description: '',
    is_community_managed: false
  }),
  filterFn: (d, q) => d.name.toLowerCase().includes(q) || (d.address && d.address.toLowerCase().includes(q))
});

// 2. Services CRUD Composable
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
    service_type: 'cultural_experience',
    category_id: 4,
    regency_id: regencies.value[0]?.id || 1,
    contact_wa: '',
    price_display: 'Rp 50.000',
    price_unit: 'per orang',
    description: ''
  }),
  filterFn: (s, q) => s.name.toLowerCase().includes(q) || s.provider_name.toLowerCase().includes(q)
});

// 3. Transport CRUD Composable
const transportCrud = useAdminCrud({
  entityLabel: 'Rute Transportasi',
  fetchFn: api.getTransport,
  createFn: api.createTransport,
  updateFn: api.updateTransport,
  deleteFn: api.deleteTransport,
  defaultForm: () => ({
    id: null,
    name: '',
    transport_type: 'ferry',
    route_direction: '',
    vehicle_type: 'Kapal Ferry KMP',
    departure_hours: 'Setiap 1 Jam',
    price_display: 'Rp 15.000 / orang',
    description: '',
    operator: 'ASDP Indonesia Ferry',
    contact: ''
  }),
  filterFn: (t, q) => t.name.toLowerCase().includes(q) || t.route_direction.toLowerCase().includes(q)
});

// 4. Culinary CRUD Composable
const culinaryCrud = useAdminCrud({
  entityLabel: 'Menu Kuliner',
  fetchFn: api.getCulinary,
  createFn: api.createCulinary,
  updateFn: api.updateCulinary,
  deleteFn: api.deleteCulinary,
  defaultForm: () => ({
    id: null,
    name: '',
    halal_status: 'Halal',
    origin_region: 'Danau Toba',
    description: '',
    image_url: ''
  }),
  filterFn: (c, q) => c.name.toLowerCase().includes(q) || (c.origin_region && c.origin_region.toLowerCase().includes(q))
});

// 5. Articles CRUD Composable
const articleCrud = useAdminCrud({
  entityLabel: 'Cerita Toba',
  fetchFn: api.getArticles,
  createFn: api.createArticle,
  updateFn: api.updateArticle,
  deleteFn: api.deleteArticle,
  defaultForm: () => ({
    id: null,
    title: '',
    regency_id: null,
    published_at: new Date().toISOString().split('T')[0],
    source_url: '',
    summary: ''
  }),
  filterFn: (a, q) => a.title.toLowerCase().includes(q) || (a.summary && a.summary.toLowerCase().includes(q))
});

function getCountForTab(tabId) {
  switch (tabId) {
    case 'destinations':
      return destCrud.items.value.length;
    case 'services':
      return serviceCrud.items.value.length;
    case 'transport':
      return transportCrud.items.value.length;
    case 'culinary':
      return culinaryCrud.items.value.length;
    case 'articles':
      return articleCrud.items.value.length;
    case 'reviews':
      return allReviews.value.length;
    case 'users':
      return usersList.value.length;
    default:
      return 0;
  }
}

// Initial bootstrap
async function loadInitialData() {
  try {
    const [destRes, regRes, catRes] = await Promise.all([
      api.getDestinations({ limit: 50 }),
      api.getRegencies(),
      api.getCategories()
    ]);
    if (destRes?.success) destCrud.items.value = destRes.data || [];
    if (regRes?.success) regencies.value = regRes.data || [];
    if (catRes?.success) categories.value = catRes.data || [];
  } catch (err) {
    console.error('Error loading initial admin data:', err);
  }
}

async function loadReviews() {
  loadingReviews.value = true;
  try {
    const res = await api.getReviews({ limit: 50 });
    if (res?.success) allReviews.value = res.data || [];
  } catch (err) {
    console.error('Error loading reviews:', err);
  } finally {
    loadingReviews.value = false;
  }
}

async function loadUsers() {
  loadingUsers.value = true;
  try {
    const res = await api.getUsers();
    if (res?.success) usersList.value = res.data || [];
  } catch (err) {
    console.error('Error loading users:', err);
  } finally {
    loadingUsers.value = false;
  }
}

// On-demand tab loading
watch(currentTab, async (tab) => {
  if (tab === 'services' && serviceCrud.items.value.length === 0) {
    await serviceCrud.load();
  } else if (tab === 'transport' && transportCrud.items.value.length === 0) {
    await transportCrud.load();
  } else if (tab === 'culinary' && culinaryCrud.items.value.length === 0) {
    await culinaryCrud.load();
  } else if (tab === 'articles' && articleCrud.items.value.length === 0) {
    await articleCrud.load();
  } else if (tab === 'reviews' && allReviews.value.length === 0) {
    await loadReviews();
  } else if (tab === 'users' && usersList.value.length === 0) {
    await loadUsers();
  }
});

const filteredReviews = computed(() => {
  const q = reviewSearch.value.trim().toLowerCase();
  if (!q) return allReviews.value;
  return allReviews.value.filter(r =>
    (r.reviewer_name && r.reviewer_name.toLowerCase().includes(q)) ||
    (r.review_text && r.review_text.toLowerCase().includes(q))
  );
});

const filteredUsersList = computed(() => {
  const q = userSearch.value.trim().toLowerCase();
  if (!q) return usersList.value;
  return usersList.value.filter(u =>
    u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
  );
});

async function handleDeleteReview(id) {
  const confirmed = await confirm({
    title: 'Hapus Ulasan',
    message: `Apakah Anda yakin ingin menghapus ulasan #${id}? Tindakan ini permanen.`,
    confirmText: 'Ya, Hapus',
    cancelText: 'Batal',
    danger: true
  });
  if (!confirmed) return;

  try {
    const res = await api.deleteReview(id);
    if (res?.success) {
      await loadReviews();
      toastSuccess(`Ulasan #${id} berhasil dihapus.`);
    } else {
      toastError(res?.message || 'Gagal menghapus ulasan.');
    }
  } catch (err) {
    console.error('Error deleting review:', err);
    toastError('Terjadi kesalahan saat menghapus ulasan.');
  }
}

onMounted(() => {
  loadInitialData();
});
</script>

<style scoped>
.admin-page {
  padding-top: 2rem;
  padding-bottom: 5rem;
}

.dash-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  padding: 1.85rem 2rem;
  border-radius: var(--radius-xl);
  margin-bottom: 1.75rem;
}

.admin-header-theme {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: white;
  border-left: 6px solid #0284c7;
}

.badge-role-row {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  margin-bottom: 0.5rem;
}

.badge-admin-glow {
  background: #075985;
  color: #ffffff;
  font-size: 0.725rem;
  font-weight: 800;
  padding: 0.2rem 0.6rem;
  border-radius: var(--radius-full);
}

.badge-system-status {
  font-size: 0.725rem;
  color: #cbd5e1;
  font-weight: 600;
}

.dash-title {
  font-size: 1.75rem;
  font-weight: 800;
  margin-bottom: 0.4rem;
  color: white;
}

.dash-subtitle {
  font-size: 0.9rem;
  color: #e2e8f0;
  max-width: 780px;
  line-height: 1.5;
}

.dash-quick-create {
  flex-shrink: 0;
}

/* METRICS */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
  margin-bottom: 1.75rem;
  contain: layout style;
}

.metric-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.15rem;
  border-radius: var(--radius-lg);
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.clickable {
  cursor: pointer;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.metric-icon-wrap {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
}

/* Metric color themes without inline styles */
.theme-blue .metric-icon-wrap { background: #e0f2fe; color: #0369a1; }
.theme-green .metric-icon-wrap { background: #d1fae5; color: #047857; }
.theme-indigo .metric-icon-wrap { background: #e0e7ff; color: #4338ca; }
.theme-orange .metric-icon-wrap { background: #ffedd5; color: #c2410c; }
.theme-amber .metric-icon-wrap { background: #fef3c7; color: #b45309; }
.theme-red .metric-icon-wrap { background: #fee2e2; color: #b91c1c; }
.theme-purple .metric-icon-wrap { background: #f3e8ff; color: #6d28d9; }

.metric-num {
  font-size: 1.45rem;
  font-weight: 800;
  color: #1e293b;
  line-height: 1.1;
  display: block;
}

.metric-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: 600;
}

/* TABS */
.dash-tabs {
  display: flex;
  gap: 0.35rem;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 0.25rem;
  overflow-x: auto;
}

.dash-tab-btn {
  background: transparent;
  border: none;
  font-size: 0.875rem;
  font-weight: 700;
  color: #64748b;
  padding: 0.65rem 1.1rem;
  border-radius: var(--radius-md) var(--radius-md) 0 0;
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.dash-tab-btn:hover {
  color: var(--primary-600);
}

.dash-tab-btn.active {
  color: #0369a1;
  border-bottom: 3px solid #0369a1;
  margin-bottom: -0.35rem;
  background: white;
}

.table-sub {
  display: block;
  font-size: 0.75rem;
  color: #475569;
}

.table-desc-cell {
  max-width: 260px;
  line-height: 1.4;
  margin: 0;
  color: #475569;
}

.review-comment-full {
  max-width: 280px;
  font-style: italic;
  color: #334155;
  margin: 0;
}

.time-sub {
  color: #475569;
  font-size: 0.75rem;
}

.rating-stars-gold {
  color: #b45309;
  font-weight: 800;
}

.badge-target {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.1rem 0.35rem;
  border-radius: 4px;
  background: #f1f5f9;
}

.target-title {
  font-weight: 600;
  margin-top: 2px;
}

.badge-service {
  background: #ede9fe;
  color: #6d28d9;
  font-size: 0.725rem;
  font-weight: 700;
  padding: 0.15rem 0.45rem;
  border-radius: var(--radius-full);
}

.badge-role-admin {
  background: #e0f2fe;
  color: #0369a1;
  font-weight: 800;
}

.badge-role-partner {
  background: #f3e8ff;
  color: #7c3aed;
  font-weight: 800;
}

.badge-role-user {
  background: #d1fae5;
  color: #065f46;
  font-weight: 800;
}

.badge-halal {
  background: #d1fae5;
  color: #065f46;
  font-weight: 600;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
}

.badge-non-halal {
  background: #fee2e2;
  color: #991b1b;
  font-weight: 600;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
}

.link-source {
  color: var(--primary-600);
  font-size: 0.825rem;
  font-weight: 500;
  text-decoration: none;
}

.link-source:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .dash-header {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
