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
    if (!raw) return { token: null, user: null, role: null, notice: '' };
    const parsed = JSON.parse(raw);
    const role = parsed.role || parsed.user?.role || null;
    return {
      token: parsed.token || null,
      role,
      user: parsed.user ? { ...parsed.user, role } : null,
      notice: parsed.notice || ''
    };
  } catch {
    return { token: null, user: null, role: null, notice: '' };
  }
}

function inferRole(user, role) {
  if (role) return role;
  if (user?.role) return user.role;
  if (user?.is_superuser) return 'admin';
  if (user?.is_staff) return 'staff';
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

  setAuth({ token, user, role }) {
    const nextRole = inferRole(user, role);
    state = {
      token,
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
    state = { token: null, user: null, role: null, notice: '' };
    persist(state);
    notify();
  },

  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }
};
