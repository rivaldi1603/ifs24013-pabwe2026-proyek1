<template>
  <div class="app-layout">
    <Navbar />
    <main class="main-content">
      <router-view />
    </main>
    <Footer />
    <ToastContainer />
    <ConfirmModal />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
import ToastContainer from './components/common/ToastContainer.vue';
import ConfirmModal from './components/common/ConfirmModal.vue';
import { initAuthSync } from './composables/useAuth.js';

let disposeAuthSync;

onMounted(() => {
  disposeAuthSync = initAuthSync();
});

onUnmounted(() => {
  if (typeof disposeAuthSync === 'function') {
    disposeAuthSync();
  }
});
</script>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  min-height: calc(100vh - 74px);
}
</style>
