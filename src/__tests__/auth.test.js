import { describe, it, expect, beforeEach } from 'vitest';
import { useAuth, getAuthInstance } from '../auth.js';
import { useAuth as useAuthComposable } from '../composables/useAuth.js';

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
    expect(getAuthInstance()).toBeDefined();
    const directInstance = useAuth();
    const composableInstance = useAuthComposable();
    expect(directInstance.currentUser).toBe(composableInstance.currentUser);
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
});
