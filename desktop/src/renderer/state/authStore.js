/**
 * src/renderer/state/authStore.js
 *
 * Lightweight reactive store for authentication state.
 * Persists token/user/role to localStorage so sessions survive reloads.
 */

const STORAGE_KEY = 'school-voting-auth';

function readStored() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { token: null, refreshToken: null, user: null, role: null, notice: '' };
    const parsed = JSON.parse(raw);
    const role = parsed.role || parsed.user?.role || null;
    return {
      token: parsed.token || null,
      refreshToken: parsed.refreshToken || null,
      role,
      user: parsed.user ? { ...parsed.user, role } : null,
      notice: parsed.notice || ''
    };
  } catch {
    return { token: null, refreshToken: null, user: null, role: null, notice: '' };
  }
}

function inferRole(user, role) {
  if (role === 'school_staff' || role === 'staff') return 'facilitator';
  if (role) return role;
  if (user?.role === 'school_staff' || user?.role === 'staff') return 'facilitator';
  if (user?.role) return user.role;
  if (user?.is_superuser) return 'admin';
  if (user?.is_staff) return 'admin';
  return 'student';
}

let state = readStored();
const listeners = new Set();

function persist(next) {
  if (next.token) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  else window.localStorage.removeItem(STORAGE_KEY);
}

function notify() {
  listeners.forEach((fn) => fn(state));
}

export const authStore = {
  getState: () => state,
  getToken: () => state.token,
  getRefreshToken: () => state.refreshToken,
  getRole: () => state.role,

  setAuth({ token, user, role, refreshToken }) {
    const nextRole = inferRole(user, role);
    state = {
      token,
      refreshToken,
      role: nextRole,
      user: user ? { ...user, role: nextRole } : { role: nextRole },
      notice: ''
    };
    persist(state);
    notify();
  },

  setNotice(notice) {
    state = { ...state, notice };
    persist(state);
    notify();
  },

  clearNotice() {
    state = { ...state, notice: '' };
    persist(state);
    notify();
  },

  clearAuth() {
    state = { token: null, refreshToken: null, user: null, role: null, notice: '' };
    persist(state);
    notify();
  },

  setToken(token) {
    state = { ...state, token };
    persist(state);
    notify();
  },

  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }
};
