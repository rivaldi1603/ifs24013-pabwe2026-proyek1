import { ref } from 'vue';
import {
  STORAGE_KEYS,
  getStoredUser,
  setStoredUser,
  setStoredToken,
  clearStoredAuth,
  syncStoredUser
} from './constants/storage.js';

const currentUser = ref(null);

function loadUserFromStorage() {
  const user = getStoredUser();
  currentUser.value = user;
  if (user) {
    syncStoredUser(user);
  }
}

loadUserFromStorage();

globalThis.addEventListener('storage', loadUserFromStorage);
globalThis.addEventListener('jt:auth-change', loadUserFromStorage);
globalThis.addEventListener('jt:unauthorized', () => {
  clearStoredAuth();
  currentUser.value = null;
  globalThis.dispatchEvent(new CustomEvent('jt:auth-change'));
});

export function useAuth() {
  function setUser(userData, token) {
    if (userData) {
      if (token) {
        setStoredToken(token);
      }
      setStoredUser(userData);
      currentUser.value = userData;
      globalThis.dispatchEvent(new CustomEvent('jt:auth-change'));
    }
  }

  function logoutUser() {
    clearStoredAuth();
    currentUser.value = null;
    globalThis.dispatchEvent(new CustomEvent('jt:auth-change'));
  }

  return {
    currentUser,
    setUser,
    logoutUser,
    loadUserFromStorage
  };
}
