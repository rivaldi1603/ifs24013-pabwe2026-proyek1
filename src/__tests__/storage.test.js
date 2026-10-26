import { describe, it, expect, beforeEach } from 'vitest';
import {
  STORAGE_KEYS,
  getStoredToken,
  setStoredToken,
  getStoredUser,
  setStoredUser,
  clearStoredAuth,
  syncStoredUser,
  isValidTokenFormat,
  isTokenExpired
} from '../constants/storage.js';

describe('storage.js constants and security helpers', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    clearStoredAuth();
  });

  it('exports frozen STORAGE_KEYS constants', () => {
    expect(STORAGE_KEYS.TOKEN).toBe('jt_token');
    expect(STORAGE_KEYS.USER).toBe('jt_user');
    expect(STORAGE_KEYS.THEME).toBe('jt_theme');
    expect(Object.isFrozen(STORAGE_KEYS)).toBe(true);
  });

  describe('token format validation and expiration helpers', () => {
    it('validates token format with isValidTokenFormat', () => {
      expect(isValidTokenFormat('valid-jwt-token-string')).toBe(true);
      expect(isValidTokenFormat('')).toBe(false);
      expect(isValidTokenFormat('a')).toBe(false);
      expect(isValidTokenFormat(null)).toBe(false);
      expect(isValidTokenFormat(12345)).toBe(false);
      expect(isValidTokenFormat('token with spaces')).toBe(false);
      expect(isValidTokenFormat('token<script>')).toBe(false);
      expect(isValidTokenFormat('token"quote')).toBe(false);
      expect(isValidTokenFormat("token'single")).toBe(false);
      expect(isValidTokenFormat('a'.repeat(4097))).toBe(false);
    });

    it('evaluates token expiration with isTokenExpired', () => {
      expect(isTokenExpired(null)).toBe(true);
      expect(isTokenExpired('')).toBe(true);
      expect(isTokenExpired(123)).toBe(true);
      expect(isTokenExpired('opaque-token-no-dots')).toBe(false);

      // Valid future exp
      const futureExp = Math.floor(Date.now() / 1000) + 3600;
      const futurePayload = btoa(JSON.stringify({ exp: futureExp }));
      const futureToken = `header.${futurePayload}.signature`;
      expect(isTokenExpired(futureToken)).toBe(false);

      // Valid past exp
      const pastExp = Math.floor(Date.now() / 1000) - 3600;
      const pastPayload = btoa(JSON.stringify({ exp: pastExp }));
      const expiredToken = `header.${pastPayload}.signature`;
      expect(isTokenExpired(expiredToken)).toBe(true);

      // Payload without exp property
      const noExpPayload = btoa(JSON.stringify({ user: 'test' }));
      expect(isTokenExpired(`header.${noExpPayload}.sig`)).toBe(false);

      // Malformed base64 / json
      expect(isTokenExpired('header.%%%invalid%%%.sig')).toBe(false);
      const malformedJson = btoa('{ not-json }');
      expect(isTokenExpired(`header.${malformedJson}.sig`)).toBe(false);
    });

    it('purges expired token upon retrieval in getStoredToken', () => {
      const pastExp = Math.floor(Date.now() / 1000) - 3600;
      const pastPayload = btoa(JSON.stringify({ exp: pastExp }));
      const expiredToken = `header.${pastPayload}.sig`;

      sessionStorage.setItem(STORAGE_KEYS.TOKEN, expiredToken);
      expect(getStoredToken()).toBeNull();
    });

    it('purges expired token if already cached in memory', () => {
      const pastExp = Math.floor(Date.now() / 1000) - 3600;
      const pastPayload = btoa(JSON.stringify({ exp: pastExp }));
      const expiredToken = `header.${pastPayload}.sig`;

      setStoredToken(expiredToken);
      expect(getStoredToken()).toBeNull();
    });

    it('retrieves token from localStorage fallback when sessionStorage is empty', () => {
      localStorage.setItem(STORAGE_KEYS.TOKEN, 'local-token-only');
      expect(getStoredToken()).toBe('local-token-only');
    });

    it('clears token from localStorage when expired in localStorage fallback', () => {
      const pastExp = Math.floor(Date.now() / 1000) - 3600;
      const pastPayload = btoa(JSON.stringify({ exp: pastExp }));
      const expiredToken = `header.${pastPayload}.sig`;

      localStorage.setItem(STORAGE_KEYS.TOKEN, expiredToken);
      expect(getStoredToken()).toBeNull();
      expect(localStorage.getItem(STORAGE_KEYS.TOKEN)).toBeNull();
    });
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

      // Now set persist false -> should clear from localStorage
      setStoredToken('persistent-jwt-token-123', false);
      expect(localStorage.getItem(STORAGE_KEYS.TOKEN)).toBeNull();
    });

    it('clears token when setStoredToken is called with null or invalid token', () => {
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

    it('retrieves user from sessionStorage fallback when localStorage is empty', () => {
      sessionStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mockUser));
      expect(getStoredUser()).toEqual(mockUser);
    });

    it('removes user from localStorage when setStoredUser persist is false', () => {
      setStoredUser(mockUser, true);
      expect(localStorage.getItem(STORAGE_KEYS.USER)).not.toBeNull();

      setStoredUser(mockUser, false);
      expect(localStorage.getItem(STORAGE_KEYS.USER)).toBeNull();
      expect(sessionStorage.getItem(STORAGE_KEYS.USER)).not.toBeNull();
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

    it('syncStoredUser saves user if localStorage is missing it', () => {
      syncStoredUser(mockUser);
      expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.USER))).toEqual(mockUser);

      // When already present, does not overwrite
      syncStoredUser(mockUser);
      expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.USER))).toEqual(mockUser);

      // Falsy user does nothing
      syncStoredUser(null);
      expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.USER))).toEqual(mockUser);
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
