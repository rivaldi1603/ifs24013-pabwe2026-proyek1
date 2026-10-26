<template>
  <div class="admin-page container">
    <!-- HEADER ADMIN -->
    <div class="dash-header admin-header-theme fade-in">
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
        <button v-if="currentTab === 'destinations'" @click="openAddDestinationModal" class="btn btn-primary">
          + Tambah Destinasi Baru
        </button>
        <button v-else-if="currentTab === 'services'" @click="openAddServiceModal" class="btn btn-accent">
          + Tambah Jasa / Homestay
        </button>
        <button v-else-if="currentTab === 'transport'" @click="openAddTransportModal" class="btn btn-primary">
          + Tambah Rute Ferry
        </button>
        <button v-else-if="currentTab === 'culinary'" @click="openAddCulinaryModal" class="btn btn-accent">
          + Tambah Kuliner Khas
        </button>
        <button v-else-if="currentTab === 'articles'" @click="openAddArticleModal" class="btn btn-primary">
          + Tulis Cerita Toba
        </button>
      </div>
    </div>

    <!-- METRICS GRID -->
    <div class="metrics-grid fade-in">
      <div class="metric-card card" @click="currentTab = 'destinations'" style="cursor: pointer;">
        <div class="metric-icon-wrap" style="background: #e0f2fe; color: #0369a1;">📍</div>
        <div class="metric-data">
          <span class="metric-num">{{ destinations.length }}</span>
          <span class="metric-label">Destinasi Wisata</span>
        </div>
      </div>
      <div class="metric-card card" @click="currentTab = 'services'" style="cursor: pointer;">
        <div class="metric-icon-wrap" style="background: #d1fae5; color: #047857;">🧶</div>
        <div class="metric-data">
          <span class="metric-num">{{ services.length }}</span>
          <span class="metric-label">Jasa & Homestay</span>
        </div>
      </div>
      <div class="metric-card card" @click="currentTab = 'transport'" style="cursor: pointer;">
        <div class="metric-icon-wrap" style="background: #e0e7ff; color: #4338ca;">🚢</div>
        <div class="metric-data">
          <span class="metric-num">{{ transportRoutes.length }}</span>
          <span class="metric-label">Jadwal Ferry & Kapal</span>
        </div>
      </div>
      <div class="metric-card card" @click="currentTab = 'culinary'" style="cursor: pointer;">
        <div class="metric-icon-wrap" style="background: #ffedd5; color: #c2410c;">🍲</div>
        <div class="metric-data">
          <span class="metric-num">{{ culinaryItems.length }}</span>
          <span class="metric-label">Menu Kuliner Khas</span>
        </div>
      </div>
      <div class="metric-card card" @click="currentTab = 'articles'" style="cursor: pointer;">
        <div class="metric-icon-wrap" style="background: #fef3c7; color: #b45309;">📖</div>
        <div class="metric-data">
          <span class="metric-num">{{ articles.length }}</span>
          <span class="metric-label">Cerita / Artikel Toba</span>
        </div>
      </div>
      <div class="metric-card card" @click="currentTab = 'reviews'" style="cursor: pointer;">
        <div class="metric-icon-wrap" style="background: #fee2e2; color: #b91c1c;">💬</div>
        <div class="metric-data">
          <span class="metric-num">{{ allReviews.length }}</span>
          <span class="metric-label">Ulasan Pengunjung</span>
        </div>
      </div>
      <div class="metric-card card" @click="currentTab = 'users'" style="cursor: pointer;">
        <div class="metric-icon-wrap" style="background: #f3e8ff; color: #6d28d9;">👥</div>
        <div class="metric-data">
          <span class="metric-num">{{ usersList.length }}</span>
          <span class="metric-label">Pengguna Terdaftar</span>
        </div>
      </div>
    </div>

    <!-- 7 TABS ADMIN UNTUK SELURUH HALAMAN -->
    <div class="dash-tabs fade-in">
      <button
        class="dash-tab-btn"
        :class="{ active: currentTab === 'destinations' }"
        @click="currentTab = 'destinations'"
      >
        📍 Destinasi ({{ destinations.length }})
      </button>
      <button
        class="dash-tab-btn"
        :class="{ active: currentTab === 'services' }"
        @click="currentTab = 'services'"
      >
        🧶 Jasa & Homestay ({{ services.length }})
      </button>
      <button
        class="dash-tab-btn"
        :class="{ active: currentTab === 'transport' }"
        @click="currentTab = 'transport'"
      >
        🚢 Jadwal Ferry ({{ transportRoutes.length }})
      </button>
      <button
        class="dash-tab-btn"
        :class="{ active: currentTab === 'culinary' }"
        @click="currentTab = 'culinary'"
      >
        🍲 Kuliner Khas ({{ culinaryItems.length }})
      </button>
      <button
        class="dash-tab-btn"
        :class="{ active: currentTab === 'articles' }"
        @click="currentTab = 'articles'"
      >
        📖 Cerita Toba ({{ articles.length }})
      </button>
      <button
        class="dash-tab-btn"
        :class="{ active: currentTab === 'reviews' }"
        @click="currentTab = 'reviews'"
      >
        💬 Moderasi Ulasan ({{ allReviews.length }})
      </button>
      <button
        class="dash-tab-btn"
        :class="{ active: currentTab === 'users' }"
        @click="currentTab = 'users'"
      >
        👥 Pengguna ({{ usersList.length }})
      </button>
    </div>

    <!-- TAB 1: DESTINASI WISATA -->
    <div v-if="currentTab === 'destinations'" class="tab-panel card fade-in">
      <div class="panel-header">
        <div>
          <h2>Kelola Destinasi Wisata</h2>
          <p class="panel-sub">Tambah, ubah data, atau hapus tempat wisata di kawasan Danau Toba.</p>
        </div>
        <div class="panel-tools">
          <input v-model="destSearch" type="text" placeholder="Cari destinasi..." class="form-input search-mini" />
          <button @click="openAddDestinationModal" class="btn btn-primary btn-sm">+ Tambah</button>
        </div>
      </div>

      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama Destinasi</th>
              <th>Kabupaten</th>
              <th>Tarif</th>
              <th>Rating</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="d in filteredDestinations" :key="d.id">
              <td><span class="id-tag">#{{ d.id }}</span></td>
              <td>
                <strong>{{ d.name }}</strong>
                <span class="table-sub">{{ d.category_name }}</span>
              </td>
              <td>{{ d.regency_short || d.regency_name }}</td>
              <td>{{ d.price_display }}</td>
              <td>★ {{ Number(d.rating_avg || 4.5).toFixed(1) }} ({{ d.review_count || 0 }})</td>
              <td>
                <div class="table-actions">
                  <button @click="editDestination(d)" class="btn-table btn-edit">✏️ Edit</button>
                  <button @click="deleteDest(d.id, d.name)" class="btn-table btn-del">🗑️ Hapus</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- TAB 2: JASA BUDAYA & HOMESTAY -->
    <div v-if="currentTab === 'services'" class="tab-panel card fade-in">
      <div class="panel-header">
        <div>
          <h2>Kelola Jasa Budaya & Homestay Warga</h2>
          <p class="panel-sub">Layanan berbasis komunitas lokal Danau Toba.</p>
        </div>
        <div class="panel-tools">
          <input v-model="serviceSearch" type="text" placeholder="Cari jasa / pengelola..." class="form-input search-mini" />
          <button @click="openAddServiceModal" class="btn btn-accent btn-sm">+ Tambah</button>
        </div>
      </div>

      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Layanan</th>
              <th>Penyedia / Warga</th>
              <th>Tipe</th>
              <th>Tarif</th>
              <th>WhatsApp</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="s in filteredServices" :key="s.id">
              <td><span class="id-tag">#{{ s.id }}</span></td>
              <td>
                <strong>{{ s.name }}</strong>
                <span class="table-sub">{{ s.regency_short || s.regency_name }}</span>
              </td>
              <td>{{ s.provider_name }}</td>
              <td><span class="badge badge-service">{{ formatServiceType(s.service_type) }}</span></td>
              <td>{{ s.price_display }} <small v-if="s.price_unit">/{{ s.price_unit }}</small></td>
              <td><code>{{ s.contact_wa || '-' }}</code></td>
              <td>
                <div class="table-actions">
                  <button @click="editService(s)" class="btn-table btn-edit">✏️ Edit</button>
                  <button @click="deleteServ(s.id, s.name)" class="btn-table btn-del">🗑️ Hapus</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- TAB 3: JADWAL FERRY & TRANSPORTASI -->
    <div v-if="currentTab === 'transport'" class="tab-panel card fade-in">
      <div class="panel-header">
        <div>
          <h2>Kelola Jadwal Ferry & Transportasi Danau Toba</h2>
          <p class="panel-sub">Jadwal penyeberangan KMP Ferry, kapal kayu tradisional, dan shuttle darat.</p>
        </div>
        <div class="panel-tools">
          <input v-model="transportSearch" type="text" placeholder="Cari rute penyeberangan..." class="form-input search-mini" />
          <button @click="openAddTransportModal" class="btn btn-primary btn-sm">+ Tambah Rute</button>
        </div>
      </div>

      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama Rute Penyeberangan</th>
              <th>Jenis</th>
              <th>Arah / Lintasan</th>
              <th>Jadwal / Jam Berangkat</th>
              <th>Tarif</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="t in filteredTransport" :key="t.id">
              <td><span class="id-tag">#{{ t.id }}</span></td>
              <td>
                <strong>{{ t.name }}</strong>
                <span class="table-sub">{{ t.operator || 'Dishub' }}</span>
              </td>
              <td>
                <span class="badge" :class="t.transport_type === 'ferry' ? 'badge-role-admin' : 'badge-role-partner'">
                  {{ t.transport_type === 'ferry' ? '🚢 Ferry KMP' : (t.transport_type === 'traditional_boat' ? '⛵ Kapal Tradisional' : '🚐 Shuttle') }}
                </span>
              </td>
              <td><strong>{{ t.route_direction }}</strong></td>
              <td>{{ t.departure_hours }}</td>
              <td>{{ t.price_display }}</td>
              <td>
                <div class="table-actions">
                  <button @click="editTransport(t)" class="btn-table btn-edit">✏️ Edit</button>
                  <button @click="deleteTrans(t.id, t.name)" class="btn-table btn-del">🗑️ Hapus</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- TAB 4: KULINER KHAS BATAK -->
    <div v-if="currentTab === 'culinary'" class="tab-panel card fade-in">
      <div class="panel-header">
        <div>
          <h2>Kelola Menu Kuliner Khas</h2>
          <p class="panel-sub">Katalog kuliner tradisional Danau Toba (Naniura, Arsik, Sasagun, dll).</p>
        </div>
        <div class="panel-tools">
          <input v-model="culinarySearch" type="text" placeholder="Cari kuliner..." class="form-input search-mini" />
          <button @click="openAddCulinaryModal" class="btn btn-accent btn-sm">+ Tambah Kuliner</button>
        </div>
      </div>

      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama Kuliner</th>
              <th>Status Halal</th>
              <th>Asal Daerah</th>
              <th>Deskripsi Singkat</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in filteredCulinary" :key="c.id">
              <td><span class="id-tag">#{{ c.id }}</span></td>
              <td><strong>{{ c.name }}</strong></td>
              <td>
                <span class="badge" :style="c.halal_status === 'Halal' ? 'background:#d1fae5; color:#065f46;' : 'background:#fee2e2; color:#991b1b;'">
                  {{ c.halal_status }}
                </span>
              </td>
              <td>{{ c.origin_region }}</td>
              <td><p class="table-desc-cell">{{ c.description }}</p></td>
              <td>
                <div class="table-actions">
                  <button @click="editCulinary(c)" class="btn-table btn-edit">✏️ Edit</button>
                  <button @click="deleteCulin(c.id, c.name)" class="btn-table btn-del">🗑️ Hapus</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- TAB 5: CERITA TOBA (ARTIKEL) -->
    <div v-if="currentTab === 'articles'" class="tab-panel card fade-in">
      <div class="panel-header">
        <div>
          <h2>Kelola Cerita Danau Toba (Artikel Budaya & Wisata)</h2>
          <p class="panel-sub">Artikel wawasan budaya, legenda, dan tips perjalanan bagi wisatawan.</p>
        </div>
        <div class="panel-tools">
          <input v-model="articleSearch" type="text" placeholder="Cari judul cerita..." class="form-input search-mini" />
          <button @click="openAddArticleModal" class="btn btn-primary btn-sm">+ Tulis Cerita Baru</button>
        </div>
      </div>

      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Judul Cerita / Artikel</th>
              <th>Wilayah Kabupaten</th>
              <th>Ringkasan Cerita</th>
              <th>Tanggal Publikasi</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="a in filteredArticles" :key="a.id">
              <td><span class="id-tag">#{{ a.id }}</span></td>
              <td>
                <strong>{{ a.title }}</strong>
                <span class="table-sub"><a :href="a.source_url || '#'" target="_blank" style="color:var(--primary-600);">Buka Sumber Tautan</a></span>
              </td>
              <td>{{ a.regency_short || a.regency_name || 'Kawasan Toba' }}</td>
              <td><p class="table-desc-cell">{{ a.summary }}</p></td>
              <td><small class="time-sub">{{ a.published_at }}</small></td>
              <td>
                <div class="table-actions">
                  <button @click="editArticle(a)" class="btn-table btn-edit">✏️ Edit</button>
                  <button @click="deleteArtic(a.id, a.title)" class="btn-table btn-del">🗑️ Hapus</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- TAB 6: MODERASI ULASAN PENGUNJUNG -->
    <div v-if="currentTab === 'reviews'" class="tab-panel card fade-in">
      <div class="panel-header">
        <div>
          <h2>Moderasi Ulasan Pengunjung</h2>
          <p class="panel-sub">Hapus ulasan spam atau komentar tidak pantas dari pengunjung.</p>
        </div>
        <div class="panel-tools">
          <input v-model="reviewSearch" type="text" placeholder="Cari pengulas..." class="form-input search-mini" />
        </div>
      </div>

      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Pengulas</th>
              <th>Target Tempat</th>
              <th>Rating</th>
              <th>Komentar</th>
              <th>Waktu</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in filteredReviews" :key="r.id">
              <td><span class="id-tag">#{{ r.id }}</span></td>
              <td>
                <strong>{{ r.reviewer_name }}</strong>
                <span class="table-sub">{{ r.user_id ? 'Terdaftar' : 'Tamu' }}</span>
              </td>
              <td>
                <span class="badge-target">{{ r.target_type === 'destination' ? '📍 Destinasi' : '🧶 Layanan' }}</span>
                <div style="font-weight: 600; margin-top: 2px;">{{ r.target_name || ('ID: ' + r.target_id) }}</div>
              </td>
              <td><span class="rating-stars-gold">★ {{ Number(r.rating).toFixed(1) }}</span></td>
              <td><p class="review-comment-full">"{{ r.review_text }}"</p></td>
              <td><small class="time-sub">{{ r.created_at }}</small></td>
              <td>
                <button @click="handleDeleteReview(r.id)" class="btn-table btn-del">🗑️ Hapus</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- TAB 7: MANAJEMEN PENGGUNA (USERS) -->
    <div v-if="currentTab === 'users'" class="tab-panel card fade-in">
      <div class="panel-header">
        <div>
          <h2>Daftar Pengguna Terdaftar</h2>
          <p class="panel-sub">Seluruh pengguna platform JelajahToba yang tersimpan di basis data.</p>
        </div>
        <div class="panel-tools">
          <input v-model="userSearch" type="text" placeholder="Cari nama atau email..." class="form-input search-mini" />
        </div>
      </div>

      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama Lengkap</th>
              <th>Email</th>
              <th>Role</th>
              <th>Nomor HP</th>
              <th>Bio Pengguna</th>
              <th>Terdaftar</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in filteredUsersList" :key="u.id">
              <td><span class="id-tag">#{{ u.id }}</span></td>
              <td>
                <strong>{{ u.name }}</strong>
                <span v-if="u.organization" class="table-sub">{{ u.organization }}</span>
              </td>
              <td><code>{{ u.email }}</code></td>
              <td>
                <span
                  class="badge"
                  :class="{
                    'badge-role-admin': u.role === 'admin',
                    'badge-role-partner': u.role === 'partner',
                    'badge-role-user': u.role === 'user'
                  }"
                >
                  {{ u.role === 'admin' ? '👑 Admin' : (u.role === 'partner' ? '🧶 Mitra' : '👤 Wisatawan') }}
                </span>
              </td>
              <td>{{ u.phone || '-' }}</td>
              <td><small class="table-desc-cell">{{ u.bio || '-' }}</small></td>
              <td><small class="time-sub">{{ u.created_at }}</small></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ==================== MODALS ==================== -->
    <DestinationModal
      v-model="destModalOpen"
      :form="destForm"
      :categories="categories"
      :regencies="regencies"
      :saving="saving"
      @save="saveDestination"
    />

    <ServiceModal
      v-model="serviceModalOpen"
      :form="serviceForm"
      :regencies="regencies"
      :saving="saving"
      @save="saveService"
    />

    <TransportModal
      v-model="transportModalOpen"
      :form="transportForm"
      :saving="saving"
      @save="saveTransport"
    />

    <CulinaryModal
      v-model="culinaryModalOpen"
      :form="culinaryForm"
      :saving="saving"
      @save="saveCulinary"
    />

    <ArticleModal
      v-model="articleModalOpen"
      :form="articleForm"
      :regencies="regencies"
      :saving="saving"
      @save="saveArticle"
    />
  </div>
</template>

<script setup>
import { ref, shallowRef, computed, onMounted, watch } from 'vue';
import { api } from '../api';
import { useAuth } from '../auth';
import { formatServiceType } from '../utils/formatters';
import { useAdminCrud } from '../composables/useAdminCrud';
import { useToast } from '../composables/useToast';
import { useConfirm } from '../composables/useConfirm';
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

// Template State Aliases for Seamless Backward Compatibility
const destinations = destCrud.items;
const destSearch = destCrud.searchQuery;
const filteredDestinations = destCrud.filteredItems;
const destModalOpen = destCrud.modalOpen;
const destForm = destCrud.form;
const openAddDestinationModal = () => destCrud.openAdd();
const editDestination = (d) => destCrud.openEdit({ ...d, is_community_managed: Boolean(d.is_community_managed) });
const saveDestination = () => destCrud.save();
const deleteDest = (id, name) => destCrud.remove(id, name);
const loadDestinations = () => destCrud.load();

const services = serviceCrud.items;
const serviceSearch = serviceCrud.searchQuery;
const filteredServices = serviceCrud.filteredItems;
const serviceModalOpen = serviceCrud.modalOpen;
const serviceForm = serviceCrud.form;
const openAddServiceModal = () => serviceCrud.openAdd();
const editService = (s) => serviceCrud.openEdit(s);
const saveService = () => serviceCrud.save();
const deleteServ = (id, name) => serviceCrud.remove(id, name);
const loadServices = () => serviceCrud.load();

const transportRoutes = transportCrud.items;
const transportSearch = transportCrud.searchQuery;
const filteredTransport = transportCrud.filteredItems;
const transportModalOpen = transportCrud.modalOpen;
const transportForm = transportCrud.form;
const openAddTransportModal = () => transportCrud.openAdd();
const editTransport = (t) => transportCrud.openEdit(t);
const saveTransport = () => transportCrud.save();
const deleteTrans = (id, name) => transportCrud.remove(id, name);
const loadTransport = () => transportCrud.load();

const culinaryItems = culinaryCrud.items;
const culinarySearch = culinaryCrud.searchQuery;
const filteredCulinary = culinaryCrud.filteredItems;
const culinaryModalOpen = culinaryCrud.modalOpen;
const culinaryForm = culinaryCrud.form;
const openAddCulinaryModal = () => culinaryCrud.openAdd();
const editCulinary = (c) => culinaryCrud.openEdit(c);
const saveCulinary = () => culinaryCrud.save();
const deleteCulin = (id, name) => culinaryCrud.remove(id, name);
const loadCulinary = () => culinaryCrud.load();

const articles = articleCrud.items;
const articleSearch = articleCrud.searchQuery;
const filteredArticles = articleCrud.filteredItems;
const articleModalOpen = articleCrud.modalOpen;
const articleForm = articleCrud.form;
const openAddArticleModal = () => articleCrud.openAdd();
const editArticle = (a) => articleCrud.openEdit(a);
const saveArticle = () => articleCrud.save();
const deleteArtic = (id, title) => articleCrud.remove(id, title);
const loadArticles = () => articleCrud.load();

// Global saving state across any modal
const saving = computed(() =>
  destCrud.saving.value ||
  serviceCrud.saving.value ||
  transportCrud.saving.value ||
  culinaryCrud.saving.value ||
  articleCrud.saving.value
);

// Initial bootstrap
async function loadInitialData() {
  try {
    const [destRes, regRes, catRes] = await Promise.all([
      api.getDestinations({ limit: 50 }),
      api.getRegencies(),
      api.getCategories()
    ]);
    if (destRes?.success) destinations.value = destRes.data || [];
    if (regRes?.success) regencies.value = regRes.data || [];
    if (catRes?.success) categories.value = catRes.data || [];
  } catch (err) {
    console.error('Error loading initial admin data:', err);
  }
}

async function loadReviews() {
  const res = await api.getReviews({ limit: 50 });
  if (res?.success) allReviews.value = res.data || [];
}

async function loadUsers() {
  const res = await api.getUsers();
  if (res?.success) usersList.value = res.data || [];
}

// On-demand tab loading
watch(currentTab, async (tab) => {
  if (tab === 'services' && services.value.length === 0) {
    await loadServices();
  } else if (tab === 'transport' && transportRoutes.value.length === 0) {
    await loadTransport();
  } else if (tab === 'culinary' && culinaryItems.value.length === 0) {
    await loadCulinary();
  } else if (tab === 'articles' && articles.value.length === 0) {
    await loadArticles();
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

/* PANELS & TABLES */
.tab-panel {
  padding: 1.75rem;
  border-radius: var(--radius-xl);
  content-visibility: auto;
  contain-intrinsic-size: 0 500px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.panel-header h2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.panel-sub {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-top: 0.2rem;
}

.panel-tools {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.search-mini {
  max-width: 240px;
  padding: 0.45rem 0.75rem;
  font-size: 0.85rem;
}

.table-responsive {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
}

.data-table th {
  background: #f8fafc;
  color: #475569;
  font-weight: 700;
  text-align: left;
  padding: 0.75rem 0.85rem;
  border-bottom: 1px solid #e2e8f0;
}

.data-table td {
  padding: 0.75rem 0.85rem;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}

.data-table tr:hover td {
  background: #f8fafc;
}

.id-tag {
  font-size: 0.75rem;
  font-family: monospace;
  color: #1e293b;
  background: #e2e8f0;
  font-weight: 700;
  padding: 0.15rem 0.35rem;
  border-radius: 4px;
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

.table-actions {
  display: flex;
  gap: 0.4rem;
}

.btn-table {
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: var(--radius-sm);
  padding: 0.3rem 0.55rem;
  font-size: 0.775rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-edit:hover {
  background: #f0f9ff;
  border-color: #0369a1;
  color: #0369a1;
}

.btn-del:hover {
  background: #fee2e2;
  border-color: #b91c1c;
  color: #b91c1c;
}

/* MODALS */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(4px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal-card {
  background: white;
  border-radius: var(--radius-xl);
  width: 100%;
  max-width: 600px;
  padding: 1.75rem 2rem;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-xl);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f1f5f9;
}

.modal-title {
  font-size: 1.35rem;
  color: #0f172a;
}

.modal-close-btn {
  background: transparent;
  border: none;
  font-size: 1.75rem;
  color: #94a3b8;
  cursor: pointer;
  line-height: 1;
}

.modal-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.full-width {
  grid-column: span 2;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f1f5f9;
}

@media (max-width: 768px) {
  .dash-header {
    flex-direction: column;
    align-items: stretch;
  }
  .modal-form-grid {
    grid-template-columns: 1fr;
  }
  .full-width {
    grid-column: span 1;
  }
}
</style>
