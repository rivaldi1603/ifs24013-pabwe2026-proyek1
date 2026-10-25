import { ref } from 'vue';

const currentUser = ref(null);

function loadUserFromStorage() {
  const stored = localStorage.getItem('jt_user') || sessionStorage.getItem('jt_user');
  if (stored) {
    try {
      currentUser.value = JSON.parse(stored);
      if (!localStorage.getItem('jt_user')) {
        localStorage.setItem('jt_user', stored);
      }
    } catch (e) {
      console.error('Failed to parse user from storage:', e);
      currentUser.value = null;
    }
  } else {
    currentUser.value = null;
  }
}

loadUserFromStorage();

globalThis.addEventListener('storage', loadUserFromStorage);
globalThis.addEventListener('jt:auth-change', loadUserFromStorage);
globalThis.addEventListener('jt:unauthorized', () => {
  sessionStorage.removeItem('jt_token');
  localStorage.removeItem('jt_token');
  sessionStorage.removeItem('jt_user');
  localStorage.removeItem('jt_user');
  currentUser.value = null;
  globalThis.dispatchEvent(new CustomEvent('jt:auth-change'));
});

export function useAuth() {
  function setUser(userData, token) {
    if (userData) {
      if (token) {
        sessionStorage.setItem('jt_token', token);
      }
      const serialized = JSON.stringify(userData);
      sessionStorage.setItem('jt_user', serialized);
      localStorage.setItem('jt_user', serialized);
      currentUser.value = userData;
      globalThis.dispatchEvent(new CustomEvent('jt:auth-change'));
    }
  }

  function logoutUser() {
    sessionStorage.removeItem('jt_token');
    localStorage.removeItem('jt_token');
    sessionStorage.removeItem('jt_user');
    localStorage.removeItem('jt_user');
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
