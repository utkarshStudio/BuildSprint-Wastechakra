import { authApi } from './authApi';
import { citizenApi } from './citizenApi';
import { collectorApi } from './collectorApi';
import { businessApi } from './businessApi';
import { facilityApi } from './facilityApi';
import { adminApi } from './adminApi';

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:8000/api/v1' : 'https://buildsprint-wastechakra.onrender.com/api/v1');

const TOKEN_KEY = 'wc_access_token';
const REFRESH_KEY = 'wc_refresh_token';
const USER_KEY = 'wc_user';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setTokens(access, refresh) {
  if (access) localStorage.setItem(TOKEN_KEY, access);
  if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
}

export function clearTokens() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
}

export function setStoredUser(user) {
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export async function request(path, options = {}, retry = true) {
  const headers = { ...(options.headers || {}) };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401 && retry && localStorage.getItem(REFRESH_KEY)) {
    const refreshed = await tryRefresh();
    if (refreshed) return request(path, options, false);
  }

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    const message = err.error || err.detail || (Array.isArray(err) ? err.map((e) => e.detail).join(', ') : 'Request failed');
    throw new Error(message);
  }

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) return response.json();
  return response;
}

export async function tryRefresh() {
  const refresh = localStorage.getItem(REFRESH_KEY);
  if (!refresh) return false;
  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });
    if (!res.ok) {
      clearTokens();
      return false;
    }
    const data = await res.json();
    setTokens(data.access);
    return true;
  } catch {
    clearTokens();
    return false;
  }
}

export function isAuthenticated() {
  return !!getToken();
}

export function qs(params) {
  const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ''));
  const query = new URLSearchParams(clean).toString();
  return query ? `?${query}` : '';
}

// Master combined API object
export const api = {
  ...authApi,
  ...citizenApi,
  ...collectorApi,
  ...businessApi,
  ...facilityApi,
  ...adminApi,
};

// Export individual modular role APIs
export { authApi, citizenApi, collectorApi, businessApi, facilityApi, adminApi, API_BASE_URL };

// Convenience named exports (kept for backwards compatibility)
export const getStatsSummary = (...args) => api.getStatsSummary(...args);
export const simulateWaste = (...args) => api.simulateWaste(...args);
export const processWasteImage = (...args) => api.processWasteImage(...args);
export const getWasteRecords = (...args) => api.getWasteRecords(...args);
export const getDecisionConfig = (...args) => api.getDecisionConfig(...args);
export const updateDecisionConfig = (...args) => api.updateDecisionConfig(...args);
export const getCommunityEvents = (...args) => api.getCommunityEvents(...args);
export const joinCommunityEvent = (...args) => api.joinCommunityEvent(...args);
