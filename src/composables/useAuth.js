import { ref } from 'vue';
import {
  getStoredUser,
  setStoredUser,
  setStoredToken,
  clearStoredAuth,
  syncStoredUser
} from '../constants/storage.js';

/**
 * Shared reactive user state across the entire application.
 */
const currentUser = ref(null);

/**
 * Synchronizes user state with storage and handles event triggers.
 */
function loadUserFromStorage() {
  const user = getStoredUser();
  currentUser.value = user;
  if (user) {
    syncStoredUser(user);
  }
}

// Initial bootstrap
loadUserFromStorage();

// Global listeners for cross-tab or interceptor auth synchronization
globalThis.addEventListener('storage', loadUserFromStorage);
globalThis.addEventListener('jt:auth-change', loadUserFromStorage);
globalThis.addEventListener('jt:unauthorized', () => {
  clearStoredAuth();
  currentUser.value = null;
  globalThis.dispatchEvent(new CustomEvent('jt:auth-change'));
});

/**
 * Authentication Composable (useAuth)
 * Encapsulates user session, token management, and logout logic.
 */
export function useAuth() {
  /**
   * Sets authenticated user data and optional session token.
   * @param {object} userData
   * @param {string} [token]
   */
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

  /**
   * Clears user session, revokes credentials, and dispatches change event.
   */
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
