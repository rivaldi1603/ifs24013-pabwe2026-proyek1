<template>
  <div class="admin-page container">
    <!-- DASHBOARD HEADER -->
    <section class="dash-header admin-header-theme shadow-sm" aria-label="Ringkasan Status Admin">
      <div class="dash-welcome">
        <div class="badge-role-row">
          <span class="badge-admin-glow">SISTEM KONTROL PUSAT</span>
          <span class="badge-system-status">● Basis Data Terhubung</span>
        </div>
        <h1 class="dash-title">Halo, {{ user?.name || 'Administrator' }} 👋</h1>
        <p class="dash-subtitle">
          Kelola katalog pariwisata Danau Toba, jadwal penyeberangan, data kuliner, cerita budaya, serta moderasi ulasan publik.
        </p>
      </div>
      <div class="dash-quick-actions">
        <router-link to="/destinasi" class="btn btn-secondary btn-sm">
          👁️ Lihat Web Publik
        </router-link>
      </div>
    </section>

    <!-- TAB BAR -->
    <AdminTabBar
      v-model="currentTab"
      :tabs="ADMIN_TABS"
      :count="getCountForTab"
    />

    <!-- ACTIVE TAB COMPONENT -->
    <keep-alive>
      <component
        :is="activeTabComponent"
        :categories="categories"
        :regencies="regencies"
        @update:count="(c) => setTabCount(currentTab, c)"
      />
    </keep-alive>
  </div>
</template>

<script setup>
import { ref, shallowRef, computed, onMounted, defineAsyncComponent, reactive } from 'vue';
import { api } from '../api.js';
import { useAuth } from '../composables/useAuth.js';
import { ADMIN_TABS } from '../constants/admin.js';
import AdminTabBar from '../components/admin/AdminTabBar.vue';

const { currentUser: user } = useAuth();

const TAB_COMPONENTS = {
  destinations: defineAsyncComponent(() => import('../components/admin/tabs/DestinationsTab.vue')),
  services: defineAsyncComponent(() => import('../components/admin/tabs/ServicesTab.vue')),
  transport: defineAsyncComponent(() => import('../components/admin/tabs/TransportTab.vue')),
  culinary: defineAsyncComponent(() => import('../components/admin/tabs/CulinaryTab.vue')),
  articles: defineAsyncComponent(() => import('../components/admin/tabs/ArticlesTab.vue')),
  reviews: defineAsyncComponent(() => import('../components/admin/tabs/ReviewsTab.vue')),
  users: defineAsyncComponent(() => import('../components/admin/tabs/UsersTab.vue'))
};

const currentTab = ref('destinations');
const activeTabComponent = computed(() => TAB_COMPONENTS[currentTab.value]);

const tabCounts = reactive({
  destinations: 0,
  services: 0,
  transport: 0,
  culinary: 0,
  articles: 0,
  reviews: 0,
  users: 0
});

function getCountForTab(tabId) {
  return tabCounts[tabId] ?? 0;
}

function setTabCount(tabId, count) {
  if (typeof count === 'number') {
    tabCounts[tabId] = count;
  }
}

// Master references
const regencies = shallowRef([]);
const categories = shallowRef([]);

async function loadInitialMetadata() {
  try {
    const [regRes, catRes] = await Promise.all([
      api.getRegencies(),
      api.getCategories()
    ]);
    if (regRes?.success) regencies.value = regRes.data || [];
    if (catRes?.success) categories.value = catRes.data || [];
  } catch (err) {
    console.error('Error fetching admin metadata:', err);
  }
}

onMounted(() => {
  loadInitialMetadata();
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
  border-radius: var(--radius-xl, 16px);
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
  border-radius: var(--radius-full, 9999px);
}

.badge-system-status {
  font-size: 0.725rem;
  color: #cbd5e1;
  font-weight: 600;
}

.dash-title {
  font-size: 1.85rem;
  font-weight: 800;
  margin-bottom: 0.4rem;
  color: #ffffff;
}

.dash-subtitle {
  color: #94a3b8;
  font-size: 0.95rem;
  margin: 0;
  max-width: 650px;
  line-height: 1.5;
}

.dash-quick-actions {
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .dash-header {
    flex-direction: column;
    align-items: flex-start;
    padding: 1.5rem;
  }
}
</style>
