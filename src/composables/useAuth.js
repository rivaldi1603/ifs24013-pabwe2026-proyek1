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

/**
 * Handles unauthorized session expiry dispatched by API interceptors.
 */
function handleUnauthorized() {
  clearStoredAuth();
  currentUser.value = null;
  globalThis.dispatchEvent(new CustomEvent('jt:auth-change'));
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

// Initial bootstrap
loadUserFromStorage();
setupAuthListeners();

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
    removeAuthListeners
  };
}

