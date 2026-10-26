/**
 * Centralized Web Storage Configuration and Security Helpers.
 *
 * SECURITY & BEST PRACTICE ARCHITECTURE NOTE:
 * Storing JSON Web Tokens (JWT) in client-side Web Storage (localStorage / sessionStorage)
 * involves well-documented security trade-offs:
 *
 * 1. Risk Analysis:
 *    - Web Storage is accessible to any JavaScript execution context running on the same origin.
 *    - In the event of an unmitigated Cross-Site Scripting (XSS) vulnerability, malicious scripts
 *      could theoretically inspect and exfiltrate credentials stored in localStorage/sessionStorage.
 *
 * 2. Mitigations Implemented in JelajahToba:
 *    - Session-first Token Storage: Tokens are prioritized in `sessionStorage` so they are
 *      automatically cleared when the browser window/tab is closed, mitigating persistence risks.
 *    - Safe Navigation & Sanitization: Navigation redirects use `safeRedirect` to prevent Open Redirect
 *      and XSS injection vectors.
 *    - Centralized Accessors: All storage interactions are routed through this module, eliminating
 *      magic strings and allowing easy transition to secure storage engines.
 *
 * 3. Production Recommendation:
 *    - For dedicated production deployments with a shared root domain between Front-End and Back-End,
 *      authentication should ideally transition to `HttpOnly`, `Secure`, `SameSite=Strict` HTTP cookies.
 *      This completely prevents client-side script access to the token while protecting against CSRF.
 */

export const STORAGE_KEYS = Object.freeze({
  TOKEN: 'jt_token',
  USER: 'jt_user',
  THEME: 'jt_theme'
});

/**
 * Retrieves the stored JWT token, checking sessionStorage first then localStorage fallback.
 * @returns {string|null}
 */
export function getStoredToken() {
  if (typeof globalThis.sessionStorage === 'undefined') return null;
  return sessionStorage.getItem(STORAGE_KEYS.TOKEN) || (typeof globalThis.localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.TOKEN) : null) || null;
}

/**
 * Stores the JWT token in sessionStorage (and optionally localStorage if persist is requested).
 * @param {string} token
 * @param {boolean} persist
 */
export function setStoredToken(token, persist = false) {
  if (typeof globalThis.sessionStorage === 'undefined') return;
  if (!token) {
    sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
    if (typeof globalThis.localStorage !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
    }
    return;
  }
  sessionStorage.setItem(STORAGE_KEYS.TOKEN, token);
  if (persist && typeof globalThis.localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  } else if (typeof globalThis.localStorage !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  }
}

/**
 * Retrieves and safely parses the authenticated user profile from storage.
 * @returns {object|null}
 */
export function getStoredUser() {
  if (typeof globalThis.localStorage === 'undefined') return null;
  const userStr = localStorage.getItem(STORAGE_KEYS.USER) || (typeof globalThis.sessionStorage !== 'undefined' ? sessionStorage.getItem(STORAGE_KEYS.USER) : null);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch (err) {
    console.error('Failed to parse user profile from storage:', err);
    return null;
  }
}

/**
 * Serializes and saves the user profile object to storage.
 * @param {object} user
 * @param {boolean} persist
 */
export function setStoredUser(user, persist = true) {
  if (typeof globalThis.localStorage === 'undefined') return;
  if (!user) {
    if (typeof globalThis.sessionStorage !== 'undefined') {
      sessionStorage.removeItem(STORAGE_KEYS.USER);
    }
    localStorage.removeItem(STORAGE_KEYS.USER);
    return;
  }
  const serialized = JSON.stringify(user);
  if (typeof globalThis.sessionStorage !== 'undefined') {
    sessionStorage.setItem(STORAGE_KEYS.USER, serialized);
  }
  if (persist) {
    localStorage.setItem(STORAGE_KEYS.USER, serialized);
  }
}

/**
 * Clears all authentication credentials and user profile data from all storage scopes.
 */
export function clearStoredAuth() {
  if (typeof globalThis.sessionStorage !== 'undefined') {
    sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
    sessionStorage.removeItem(STORAGE_KEYS.USER);
  }
  if (typeof globalThis.localStorage !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }
}

/**
 * Ensures user profile present in sessionStorage is synchronized to localStorage.
 */
export function syncStoredUser(user) {
  if (!user || typeof globalThis.localStorage === 'undefined') return;
  if (!localStorage.getItem(STORAGE_KEYS.USER)) {
    setStoredUser(user, true);
  }
}
