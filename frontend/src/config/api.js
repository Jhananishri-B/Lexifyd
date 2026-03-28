/**
 * Backend base URL.
 * - If VITE_API_URL is set (e.g. http://localhost:5001), the app calls the API directly (needs backend CORS).
 * - If unset, use same-origin paths like /api/... (Vite dev proxy in vite.config.js).
 */
const raw = import.meta.env.VITE_API_URL || '';
export const API_BASE = String(raw).replace(/\/$/, '');

export function apiUrl(path) {
  const p = path.startsWith('/') ? path : `/${path}`;
  if (API_BASE) return `${API_BASE}${p}`;
  return p;
}
