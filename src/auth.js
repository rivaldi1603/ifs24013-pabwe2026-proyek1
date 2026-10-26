/**
 * Authentication module entry point.
 * Re-exports useAuth from the dedicated composable for separation of concerns
 * and backwards compatibility.
 */
import { useAuth } from './composables/useAuth.js';

export function getAuthInstance() {
  return useAuth();
}

export { useAuth };
export default useAuth;
