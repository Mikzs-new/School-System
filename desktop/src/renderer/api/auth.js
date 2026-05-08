/**
 * src/renderer/api/auth.js
 *
 * Login / logout helpers.
 * Token endpoint: POST /api/token/  (simplejwt TokenObtainPairView)
 * Returns: { access, refresh }
 */

import apiClient from './apiClient.js';
import { authStore } from '../state/authStore.js';

function decodeJwt(token) {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(payload));
  } catch {
    return {};
  }
}

async function lookupDbUser(username, userId) {
  if (!window.desktopAuth?.lookupUserRole) return null;
  try {
    return await window.desktopAuth.lookupUserRole({ username, userId });
  } catch {
    return null;
  }
}

async function normalizeAuth(data, inputUsername) {
  // simplejwt returns { access, refresh }
  const token = data?.access || data?.token || data?.access_token || data?.key;
  if (!token) throw new Error('Login succeeded but no auth token was returned by the API.');

  const payload = decodeJwt(token);
  const username = payload.username || inputUsername;
  const dbUser = await lookupDbUser(username, payload.user_id || payload.id || null);

  if (dbUser && !dbUser.is_active) throw new Error('This account is inactive.');

  const user = {
    username: dbUser?.username || username,
    first_name: dbUser?.first_name || payload.first_name,
    last_name: dbUser?.last_name || payload.last_name,
    email: dbUser?.email,
    is_superuser: dbUser?.is_superuser ?? payload.is_superuser,
    is_staff: dbUser?.is_staff ?? payload.is_staff,
    role: dbUser?.role || payload.role
  };

  const role = user.role;
  return { token, user, role };
}

export async function login({ username, password }) {
  const res = await apiClient.post('/api/token/', { username, password });
  const auth = await normalizeAuth(res.data, username);
  authStore.setAuth(auth);
  return auth;
}

export function logout() {
  authStore.clearAuth();
}
