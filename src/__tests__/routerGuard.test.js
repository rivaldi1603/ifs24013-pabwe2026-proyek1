import { describe, it, expect, beforeEach } from 'vitest';
import { checkAuthRedirect, resolveSession } from '../router/index.js';
import { setStoredToken, setStoredUser, clearStoredAuth } from '../constants/storage.js';

describe('router navigation guards and auth redirects', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    clearStoredAuth();
  });

  describe('resolveSession helper', () => {
    it('returns null token and user when storage is empty', () => {
      const session = resolveSession();
      expect(session.token).toBeNull();
      expect(session.user).toBeNull();
    });

    it('returns stored token and user when available', () => {
      const mockUser = { id: 1, name: 'Toba User', role: 'user' };
      setStoredToken('test-jwt-token');
      setStoredUser(mockUser);

      const session = resolveSession();
      expect(session.token).toBe('test-jwt-token');
      expect(session.user).toEqual(mockUser);
    });
  });

  describe('checkAuthRedirect logic', () => {
    it('redirects unauthenticated users from protected routes to login with redirect param', () => {
      const protectedRoute = {
        path: '/profil',
        fullPath: '/profil?tab=reviews',
        meta: { requiresAuth: true }
      };

      const redirect = checkAuthRedirect(protectedRoute, null, null);
      expect(redirect).toEqual({
        path: '/auth/login',
        query: { redirect: '/profil?tab=reviews' }
      });
    });

    it('redirects unauthenticated users if token exists but user profile is missing', () => {
      const protectedRoute = {
        path: '/dashboard',
        fullPath: '/dashboard',
        meta: { requiresAuth: true }
      };

      const redirect = checkAuthRedirect(protectedRoute, 'valid-token', null);
      expect(redirect).toEqual({
        path: '/auth/login',
        query: { redirect: '/dashboard' }
      });
    });

    it('allows access to protected routes when user and token are present', () => {
      const protectedRoute = {
        path: '/dashboard',
        fullPath: '/dashboard',
        meta: { requiresAuth: true }
      };
      const user = { id: 1, name: 'Normal User', role: 'user' };

      const redirect = checkAuthRedirect(protectedRoute, 'valid-token', user);
      expect(redirect).toBeNull();
    });

    it('redirects non-admin users attempting to access admin routes to /profil', () => {
      const adminRoute = {
        path: '/admin',
        fullPath: '/admin',
        meta: { requiresAuth: true, role: 'admin' }
      };
      const regularUser = { id: 2, name: 'Tourist', role: 'user' };

      const redirect = checkAuthRedirect(adminRoute, 'user-token', regularUser);
      expect(redirect).toEqual({ path: '/profil' });
    });

    it('allows admin users access to admin routes', () => {
      const adminRoute = {
        path: '/admin',
        fullPath: '/admin',
        meta: { requiresAuth: true, role: 'admin' }
      };
      const adminUser = { id: 9, name: 'Super Admin', role: 'admin' };

      const redirect = checkAuthRedirect(adminRoute, 'admin-token', adminUser);
      expect(redirect).toBeNull();
    });

    it('allows unauthenticated visitors to view guest-only routes (login/register)', () => {
      const loginRoute = {
        path: '/auth/login',
        fullPath: '/auth/login',
        meta: { guestOnly: true }
      };

      const redirect = checkAuthRedirect(loginRoute, null, null);
      expect(redirect).toBeNull();
    });

    it('redirects logged-in regular users visiting guest-only routes to /profil', () => {
      const loginRoute = {
        path: '/auth/login',
        fullPath: '/auth/login',
        meta: { guestOnly: true }
      };
      const regularUser = { id: 5, name: 'Budi', role: 'user' };

      const redirect = checkAuthRedirect(loginRoute, 'budi-token', regularUser);
      expect(redirect).toEqual({ path: '/profil' });
    });

    it('redirects logged-in admin visiting guest-only routes to /admin', () => {
      const loginRoute = {
        path: '/auth/login',
        fullPath: '/auth/login',
        meta: { guestOnly: true }
      };
      const adminUser = { id: 1, name: 'Admin', role: 'admin' };

      const redirect = checkAuthRedirect(loginRoute, 'admin-token', adminUser);
      expect(redirect).toEqual({ path: '/admin' });
    });

    it('allows access to public unrestricted routes without any redirection', () => {
      const publicRoute = {
        path: '/destinasi',
        fullPath: '/destinasi',
        meta: {}
      };

      expect(checkAuthRedirect(publicRoute, null, null)).toBeNull();
      expect(checkAuthRedirect(publicRoute, 'some-token', { role: 'user' })).toBeNull();
    });
  });
});
