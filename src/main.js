import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './fonts.css';
import './index.css';

const app = createApp(App);
app.use(router);

router.isReady().then(() => {
  app.mount('#app');
});

if (typeof globalThis.window !== 'undefined') {
  globalThis.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      globalThis.dispatchEvent(new CustomEvent('jt:auth-change'));
    }
  });
}

