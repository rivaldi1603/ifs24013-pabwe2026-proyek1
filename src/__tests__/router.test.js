import { describe, it, expect } from 'vitest';
import { checkAuthRedirect } from '../router/index.js';

describe('router guard', () => {
  const admin = { role: 'admin' };
  const user = { role: 'user' };

  it('redirect ke login jika belum login', () => {
    expect(checkAuthRedirect({ meta: { requiresAuth: true }, fullPath: '/admin' }, null, null))
      .toEqual({ path: '/auth/login', query: { redirect: '/admin' } });
  });

  it('menolak non-admin di rute admin', () => {
    expect(checkAuthRedirect({ meta: { requiresAuth: true, role: 'admin' } }, 't', user))
      .toEqual({ path: '/profil' });
  });

  it('guestOnly mengarahkan admin ke /admin', () => {
    expect(checkAuthRedirect({ meta: { guestOnly: true } }, 't', admin)).toEqual({ path: '/admin' });
  });

  it('guestOnly mengarahkan user biasa ke /profil', () => {
    expect(checkAuthRedirect({ meta: { guestOnly: true } }, 't', user)).toEqual({ path: '/profil' });
  });

  it('mengizinkan rute publik tanpa redirect', () => {
    expect(checkAuthRedirect({ meta: {} }, null, null)).toBeNull();
  });
});
