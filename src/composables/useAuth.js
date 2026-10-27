import { ref } from 'vue';
import {
  getStoredUser,
  setStoredUser,
  getStoredToken,
  setStoredToken,
  clearStoredAuth,
  syncStoredUser
} from '../constants/storage.js';
import { api } from '../api.js';

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

/**
 * Handles unauthorized session expiry dispatched by API interceptors.
 */
function handleUnauthorized() {
  clearStoredAuth();
  currentUser.value = null;
}

/**
 * Attaches global listeners for cross-tab or interceptor auth synchronization.
 */
export function setupAuthListeners() {
  if (typeof globalThis.addEventListener === 'function') {
    globalThis.addEventListener('storage', loadUserFromStorage);
    globalThis.addEventListener('jt:auth-change', loadUserFromStorage);
    globalThis.addEventListener('jt:unauthorized', handleUnauthorized);
  }
}

/**
 * Removes global auth event listeners to prevent memory leaks and dangling handlers.
 */
export function removeAuthListeners() {
  if (typeof globalThis.removeEventListener === 'function') {
    globalThis.removeEventListener('storage', loadUserFromStorage);
    globalThis.removeEventListener('jt:auth-change', loadUserFromStorage);
    globalThis.removeEventListener('jt:unauthorized', handleUnauthorized);
  }
}

/**
 * Initializes auth listeners and returns a cleanup disposer function.
 * Recommended to be called inside App.vue onMounted and disposed onUnmounted.
 * @returns {() => void} Cleanup disposer function
 */
export function initAuthSync() {
  setupAuthListeners();
  loadUserFromStorage();
  return () => {
    removeAuthListeners();
  };
}

// Initial bootstrap
loadUserFromStorage();
setupAuthListeners();

let sessionPromise = null;

/**
 * Verifies session against backend server (/auth/me) to ensure client-side
 * role guards cannot be tampered with via local storage.
 * Deduplicates concurrent calls.
 * @returns {Promise<object|null>}
 */
export function ensureSession() {
  const token = getStoredToken();
  if (!token) {
    currentUser.value = null;
    return Promise.resolve(null);
  }

  if (sessionPromise) {
    return sessionPromise;
  }

  sessionPromise = api.getMe()
    .then((res) => {
      if (res?.success && (res.user || res.data)) {
        const verifiedUser = res.user || res.data;
        currentUser.value = verifiedUser;
        setStoredUser(verifiedUser, false);
        return verifiedUser;
      }
      clearStoredAuth();
      currentUser.value = null;
      return null;
    })
    .catch((err) => {
      console.warn('Session verification fallback:', err);
      return currentUser.value;
    })
    .finally(() => {
      sessionPromise = null;
    });

  return sessionPromise;
}

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
    loadUserFromStorage,
    setupAuthListeners,
    removeAuthListeners,
    initAuthSync,
    ensureSession
  };
}

export default useAuth;
