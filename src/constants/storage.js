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
 *    - In-Memory Token Cache: The active token is cached in an in-memory variable (`inMemoryToken`)
 *      to avoid repeated disk/storage reads and provide fast, safe accessor routines.
 *    - Automatic Expiration Checking: Tokens are validated for expiration (`isTokenExpired`)
 *      upon retrieval; expired tokens are immediately purged rather than being sent to the backend.
 *    - Token Format Validation: Only syntactically well-formed token strings are accepted (`isValidTokenFormat`).
 *    - Session-first Token Storage: Tokens are prioritized in `sessionStorage` so they are
 *      automatically cleared when the browser window/tab is closed.
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
 * In-memory token cache for runtime isolation and fast access.
 */
let inMemoryToken = null;

/**
 * Validates basic token string format (non-empty, reasonable length, no whitespace/injection).
 * @param {string} token
 * @returns {boolean}
 */
export function isValidTokenFormat(token) {
  if (typeof token !== 'string') return false;
  const trimmed = token.trim();
  if (trimmed.length < 3 || trimmed.length > 4096) return false;
  return !/[\s<>"']/.test(trimmed);
}

/**
 * Safely parses the expiration timestamp from a JWT payload without external dependencies.
 * @param {string} token
 * @returns {boolean} True if token is expired, false if still valid or unparseable
 */
export function isTokenExpired(token) {
  if (!token || typeof token !== 'string') return true;
  const parts = token.split('.');
  if (parts.length === 3) {
    try {
      const payloadBase64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const jsonStr = atob(payloadBase64);
      if (jsonStr) {
        const payload = JSON.parse(jsonStr);
        if (typeof payload.exp === 'number') {
          return Date.now() >= payload.exp * 1000;
        }
      }
      return false;
    } catch {
      return false;
    }
  }
  return false;
}

/**
 * Retrieves the stored JWT token, prioritizing in-memory cache, then sessionStorage, then localStorage.
 * Automatically purges expired tokens.
 * @returns {string|null}
 */
export function getStoredToken() {
  if (inMemoryToken) {
    if (isTokenExpired(inMemoryToken)) {
      clearStoredAuth();
      return null;
    }
    return inMemoryToken;
  }

  const sessionToken = sessionStorage.getItem(STORAGE_KEYS.TOKEN);
  const localToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
  const rawToken = sessionToken || localToken || null;

  if (rawToken && isTokenExpired(rawToken)) {
    clearStoredAuth();
    return null;
  }

  inMemoryToken = rawToken;
  return inMemoryToken;
}

/**
 * Stores the JWT token in memory, sessionStorage (and optionally localStorage).
 * @param {string|null} token
 * @param {boolean} [persist=false]
 */
export function setStoredToken(token, persist = false) {
  if (token && isValidTokenFormat(token)) {
    inMemoryToken = token;
    sessionStorage.setItem(STORAGE_KEYS.TOKEN, token);

    if (persist) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    } else {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
    }
  } else {
    inMemoryToken = null;
    sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  }
}

/**
 * Retrieves and safely parses the authenticated user profile from storage.
 * @returns {object|null}
 */
export function getStoredUser() {
  const localUser = localStorage.getItem(STORAGE_KEYS.USER);
  const sessionUser = sessionStorage.getItem(STORAGE_KEYS.USER);
  const userStr = localUser || sessionUser || null;

  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (err) {
      console.error('Failed to parse user profile from storage:', err);
      return null;
    }
  }
  return null;
}

/**
 * Serializes and saves the user profile object to storage.
 * @param {object|null} user
 * @param {boolean} [persist=true]
 */
export function setStoredUser(user, persist = true) {
  if (user) {
    const serialized = JSON.stringify(user);
    sessionStorage.setItem(STORAGE_KEYS.USER, serialized);
    if (persist) {
      localStorage.setItem(STORAGE_KEYS.USER, serialized);
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  } else {
    sessionStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }
}

/**
 * Clears all authentication credentials and user profile data from all storage scopes.
 */
export function clearStoredAuth() {
  inMemoryToken = null;
  sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
  sessionStorage.removeItem(STORAGE_KEYS.USER);
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
}

/**
 * Ensures user profile present in sessionStorage is synchronized to localStorage.
 * @param {object} user
 */
export function syncStoredUser(user) {
  if (user && !localStorage.getItem(STORAGE_KEYS.USER)) {
    setStoredUser(user, true);
  }
}
