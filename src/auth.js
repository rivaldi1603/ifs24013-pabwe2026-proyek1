import { useAuth } from './composables/useAuth.js';

export function getAuth() {
  return useAuth();
}

export { useAuth, useAuth as default };


