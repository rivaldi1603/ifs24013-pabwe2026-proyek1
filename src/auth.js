/**
 * Authentication module entry point.
 * Re-exports useAuth from the dedicated composable for separation of concerns
 * and backwards compatibility.
 */
export { useAuth, useAuth as default } from './composables/useAuth.js';
