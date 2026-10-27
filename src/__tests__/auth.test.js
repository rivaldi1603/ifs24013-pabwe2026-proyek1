import { describe, it, expect, beforeEach, vi } from 'vitest';
import useAuthDefault, { useAuth, getAuth } from '../auth.js';
import { useAuth as useAuthComposable } from '../composables/useAuth.js';
import { api } from '../api.js';


describe('auth.js composable unit tests', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    const { logoutUser } = useAuth();
    logoutUser();
  });

  it('re-exports useAuth from auth.js matching composables/useAuth', () => {
    expect(typeof useAuth).toBe('function');
    expect(typeof useAuthComposable).toBe('function');
    expect(useAuth).toBe(useAuthComposable);
    expect(useAuthDefault).toBe(useAuthComposable);
    expect(typeof getAuth).toBe('function');
    const authFromGet = getAuth();
    const directInstance = useAuth();
    const composableInstance = useAuthComposable();
    expect(directInstance.currentUser).toBe(composableInstance.currentUser);
    expect(authFromGet.currentUser).toBe(composableInstance.currentUser);
  });


  it('initializes with null user when localStorage is empty', () => {
    const { currentUser, loadUserFromStorage } = useAuth();
    loadUserFromStorage();
    expect(currentUser.value).toBeNull();
  });

  it('loads valid user from localStorage', () => {
    const mockUser = { id: 1, name: 'Budi Traveler', role: 'user' };
    localStorage.setItem('jt_user', JSON.stringify(mockUser));
    const { currentUser, loadUserFromStorage } = useAuth();
    loadUserFromStorage();
    expect(currentUser.value).toEqual(mockUser);
  });

  it('handles invalid JSON in localStorage gracefully', () => {
    localStorage.setItem('jt_user', 'invalid-json-string');
    const { currentUser, loadUserFromStorage } = useAuth();
    loadUserFromStorage();
    expect(currentUser.value).toBeNull();
  });

  it('setUser saves user and token to storage and updates state', () => {
    const { currentUser, setUser } = useAuth();
    const mockUser = { id: 2, name: 'Admin Toba', role: 'admin' };
    setUser(mockUser, 'fake-jwt-token-123');

    expect(currentUser.value).toEqual(mockUser);
    expect(sessionStorage.getItem('jt_token')).toBe('fake-jwt-token-123');
    expect(JSON.parse(localStorage.getItem('jt_user'))).toEqual(mockUser);
  });

  it('setUser without token still updates user', () => {
    const { currentUser, setUser } = useAuth();
    const mockUser = { id: 3, name: 'Mitra Ulos', role: 'partner' };
    setUser(mockUser);

    expect(currentUser.value).toEqual(mockUser);
    expect(JSON.parse(localStorage.getItem('jt_user'))).toEqual(mockUser);
  });

  it('setUser ignores falsy user data', () => {
    const { currentUser, setUser } = useAuth();
    setUser(null);
    expect(currentUser.value).toBeNull();
  });

  it('logoutUser clears storage and resets state', () => {
    const { currentUser, setUser, logoutUser } = useAuth();
    setUser({ id: 1, name: 'Test' }, 'token');
    expect(currentUser.value).not.toBeNull();

    logoutUser();
    expect(currentUser.value).toBeNull();
    expect(sessionStorage.getItem('jt_token')).toBeNull();
    expect(localStorage.getItem('jt_user')).toBeNull();
  });

  it('responds to jt:unauthorized event by clearing credentials', () => {
    const { currentUser, setUser } = useAuth();
    setUser({ id: 99, name: 'Expired User' }, 'old-token');

    window.dispatchEvent(new CustomEvent('jt:unauthorized'));

    expect(currentUser.value).toBeNull();
    expect(sessionStorage.getItem('jt_token')).toBeNull();
  });

  it('responds to storage and jt:auth-change events', () => {
    const { currentUser } = useAuth();
    const mockUser = { id: 10, name: 'Sync User' };
    localStorage.setItem('jt_user', JSON.stringify(mockUser));

    window.dispatchEvent(new Event('storage'));
    expect(currentUser.value).toEqual(mockUser);

    localStorage.removeItem('jt_user');
    window.dispatchEvent(new CustomEvent('jt:auth-change'));
    expect(currentUser.value).toBeNull();
  });

  it('loads user from sessionStorage and syncs to localStorage when localStorage is empty', () => {
    const mockUser = { id: 7, name: 'Session User', role: 'user' };
    sessionStorage.setItem('jt_user', JSON.stringify(mockUser));
    const { currentUser, loadUserFromStorage } = useAuth();
    loadUserFromStorage();
    expect(currentUser.value).toEqual(mockUser);
    expect(localStorage.getItem('jt_user')).toBe(JSON.stringify(mockUser));
  });

  it('logoutUser clears both localStorage and sessionStorage credentials', () => {
    const { currentUser, setUser, logoutUser } = useAuth();
    setUser({ id: 5, name: 'Dual Storage' }, 'token-xyz');
    expect(sessionStorage.getItem('jt_token')).toBe('token-xyz');
    expect(sessionStorage.getItem('jt_user')).not.toBeNull();

    logoutUser();
    expect(currentUser.value).toBeNull();
    expect(sessionStorage.getItem('jt_token')).toBeNull();
    expect(sessionStorage.getItem('jt_user')).toBeNull();
  });

  it('allows unregistering and re-registering global auth listeners cleanly', () => {
    const { currentUser, setUser, removeAuthListeners, setupAuthListeners } = useAuth();
    setUser({ id: 88, name: 'Active User' }, 'tok');

    removeAuthListeners();

    // Event dispatched after removing listeners should not trigger state clear
    window.dispatchEvent(new CustomEvent('jt:unauthorized'));
    expect(currentUser.value).toEqual({ id: 88, name: 'Active User' });

    // Re-attach listeners
    setupAuthListeners();
    window.dispatchEvent(new CustomEvent('jt:unauthorized'));
    expect(currentUser.value).toBeNull();
  });

  it('safely handles environments without addEventListener or removeEventListener', () => {
    const { setupAuthListeners, removeAuthListeners } = useAuth();
    const originalAdd = globalThis.addEventListener;
    const originalRemove = globalThis.removeEventListener;

    try {
      globalThis.addEventListener = undefined;
      globalThis.removeEventListener = undefined;
      expect(() => setupAuthListeners()).not.toThrow();
      expect(() => removeAuthListeners()).not.toThrow();
    } finally {
      globalThis.addEventListener = originalAdd;
      globalThis.removeEventListener = originalRemove;
    }
  });

  it('initAuthSync registers listeners and returns cleanup function', () => {
    const { initAuthSync, currentUser } = useAuth();
    const cleanup = initAuthSync();
    expect(typeof cleanup).toBe('function');

    // Test that cleanup unregisters listeners
    cleanup();
    currentUser.value = { id: 999, name: 'Still Here' };
    window.dispatchEvent(new CustomEvent('jt:unauthorized'));
    expect(currentUser.value).toEqual({ id: 999, name: 'Still Here' });
  });

  describe('ensureSession()', () => {
    it('returns null and clears user when no token is in storage', async () => {
      const { ensureSession, currentUser } = useAuth();
      currentUser.value = { id: 1, name: 'Old' };
      const res = await ensureSession();
      expect(res).toBeNull();
      expect(currentUser.value).toBeNull();
    });

    it('verifies session with api.getMe successfully and deduplicates concurrent calls', async () => {
      const { ensureSession, currentUser } = useAuth();
      sessionStorage.setItem('jt_token', 'valid-token-abc');
      const verified = { id: 42, name: 'Verified User', role: 'admin' };
      const spy = vi.spyOn(api, 'getMe').mockResolvedValue({ success: true, user: verified });

      const [res1, res2] = await Promise.all([ensureSession(), ensureSession()]);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(res1).toEqual(verified);
      expect(res2).toEqual(verified);
      expect(currentUser.value).toEqual(verified);
      spy.mockRestore();
    });

    it('supports res.data fallback when user field is not provided', async () => {
      const { ensureSession, currentUser } = useAuth();
      sessionStorage.setItem('jt_token', 'valid-token-def');
      const verified = { id: 43, name: 'Data User', role: 'partner' };
      const spy = vi.spyOn(api, 'getMe').mockResolvedValue({ success: true, data: verified });

      const res = await ensureSession();
      expect(res).toEqual(verified);
      expect(currentUser.value).toEqual(verified);
      spy.mockRestore();
    });

    it('clears storage and user when server responds with unsuccessful session', async () => {
      const { ensureSession, currentUser } = useAuth();
      sessionStorage.setItem('jt_token', 'invalid-token-xyz');
      currentUser.value = { id: 44, name: 'Pending' };
      const spy = vi.spyOn(api, 'getMe').mockResolvedValue({ success: false, message: 'Invalid token' });

      const res = await ensureSession();
      expect(res).toBeNull();
      expect(currentUser.value).toBeNull();
      expect(sessionStorage.getItem('jt_token')).toBeNull();
      spy.mockRestore();
    });

    it('falls back to existing currentUser when api.getMe rejects with network error', async () => {
      const { ensureSession, currentUser } = useAuth();
      sessionStorage.setItem('jt_token', 'token-offline');
      const existingUser = { id: 45, name: 'Offline User' };
      currentUser.value = existingUser;
      const spy = vi.spyOn(api, 'getMe').mockRejectedValue(new Error('Network Offline'));

      const res = await ensureSession();
      expect(res).toEqual(existingUser);
      expect(currentUser.value).toEqual(existingUser);
      spy.mockRestore();
    });
  });
});



