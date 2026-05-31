/**
 * src/api/auth.js
 *
 * Login / logout helpers.
 * Token endpoint: POST /api/v1/auth/login/
 * Returns: { access, refresh }
 */

import apiClient from './apiClient.js';

function decodeJwt(token) {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(payload));
  } catch {
    return {};
  }
}

function normalizeRole(role, user = {}) {
  if (role === 'school_staff' || role === 'staff' || role === 'facilitator') return 'facilitator';
  if (role === 'admin' || user?.is_superuser || user?.is_staff) return 'admin';
  return 'student';
}

async function normalizeAuth(data, inputUsername) {
  const token = data?.access || data?.token || data?.access_token || data?.key;
  if (!token) throw new Error('Login succeeded but no auth token was returned by the API.');

  const payload = decodeJwt(token);
  const username = payload.username || inputUsername;

  const user = {
    username: username,
    first_name: payload.first_name,
    last_name: payload.last_name,
    email: payload.email,
    is_superuser: payload.is_superuser,
    is_staff: payload.is_staff,
    role: normalizeRole(data?.role || payload.role, payload)
  };

  return { token, user, role: user.role };
}

export async function login({ username, password }) {
  const res = await apiClient.post('/auth/login/', { username, password });
  const auth = await normalizeAuth(res.data, username);
  
  localStorage.setItem('token', auth.token);
  if (res.data.refresh) {
    localStorage.setItem('refreshToken', res.data.refresh);
  }
  
  return auth;
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
}
