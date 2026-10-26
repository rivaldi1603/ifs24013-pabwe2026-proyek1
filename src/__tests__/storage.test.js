import { describe, it, expect, beforeEach } from 'vitest';
import {
  STORAGE_KEYS,
  getStoredToken,
  setStoredToken,
  getStoredUser,
  setStoredUser,
  clearStoredAuth
} from '../constants/storage.js';

describe('storage.js constants and security helpers', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('exports frozen STORAGE_KEYS constants', () => {
    expect(STORAGE_KEYS.TOKEN).toBe('jt_token');
    expect(STORAGE_KEYS.USER).toBe('jt_user');
    expect(STORAGE_KEYS.THEME).toBe('jt_theme');
    expect(Object.isFrozen(STORAGE_KEYS)).toBe(true);
  });

  describe('token storage management', () => {
    it('returns null when no token is stored', () => {
      expect(getStoredToken()).toBeNull();
    });

    it('stores token in sessionStorage by default and retrieves it', () => {
      setStoredToken('test-jwt-token-xyz');
      expect(sessionStorage.getItem(STORAGE_KEYS.TOKEN)).toBe('test-jwt-token-xyz');
      expect(localStorage.getItem(STORAGE_KEYS.TOKEN)).toBeNull();
      expect(getStoredToken()).toBe('test-jwt-token-xyz');
    });

    it('stores token in localStorage when persist is true', () => {
      setStoredToken('persistent-jwt-token-123', true);
      expect(sessionStorage.getItem(STORAGE_KEYS.TOKEN)).toBe('persistent-jwt-token-123');
      expect(localStorage.getItem(STORAGE_KEYS.TOKEN)).toBe('persistent-jwt-token-123');
      expect(getStoredToken()).toBe('persistent-jwt-token-123');
    });

    it('clears token when setStoredToken is called with null or empty string', () => {
      setStoredToken('active-token', true);
      expect(getStoredToken()).toBe('active-token');

      setStoredToken(null);
      expect(sessionStorage.getItem(STORAGE_KEYS.TOKEN)).toBeNull();
      expect(localStorage.getItem(STORAGE_KEYS.TOKEN)).toBeNull();
      expect(getStoredToken()).toBeNull();
    });
  });

  describe('user storage management', () => {
    const mockUser = { id: 1, name: 'Rivaldi Adrian', role: 'admin', email: 'rivaldi@example.com' };

    it('returns null when no user is stored', () => {
      expect(getStoredUser()).toBeNull();
    });

    it('stores and retrieves user profile correctly', () => {
      setStoredUser(mockUser);
      expect(JSON.parse(sessionStorage.getItem(STORAGE_KEYS.USER))).toEqual(mockUser);
      expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.USER))).toEqual(mockUser);
      expect(getStoredUser()).toEqual(mockUser);
    });

    it('handles invalid JSON gracefully without throwing', () => {
      localStorage.setItem(STORAGE_KEYS.USER, 'corrupted-json-data');
      expect(getStoredUser()).toBeNull();
    });

    it('removes user when setStoredUser is called with null', () => {
      setStoredUser(mockUser);
      setStoredUser(null);
      expect(sessionStorage.getItem(STORAGE_KEYS.USER)).toBeNull();
      expect(localStorage.getItem(STORAGE_KEYS.USER)).toBeNull();
      expect(getStoredUser()).toBeNull();
    });
  });

  describe('clearStoredAuth', () => {
    it('completely purges all auth tokens and user records from both scopes', () => {
      sessionStorage.setItem(STORAGE_KEYS.TOKEN, 'tok-session');
      sessionStorage.setItem(STORAGE_KEYS.USER, JSON.stringify({ id: 1 }));
      localStorage.setItem(STORAGE_KEYS.TOKEN, 'tok-local');
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify({ id: 1 }));

      clearStoredAuth();

      expect(sessionStorage.getItem(STORAGE_KEYS.TOKEN)).toBeNull();
      expect(sessionStorage.getItem(STORAGE_KEYS.USER)).toBeNull();
      expect(localStorage.getItem(STORAGE_KEYS.TOKEN)).toBeNull();
      expect(localStorage.getItem(STORAGE_KEYS.USER)).toBeNull();
    });
  });
});
