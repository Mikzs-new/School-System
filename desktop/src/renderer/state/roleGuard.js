/**
 * src/renderer/state/roleGuard.js
 * Simple role-check helpers.
 */

export function hasRole(user, roles) {
  const allowed = Array.isArray(roles) ? roles : [roles];
  return allowed.includes(user?.role);
}

export const isAdmin = (user) => hasRole(user, 'admin');
export const isStaff = (user) => hasRole(user, ['facilitator', 'staff']);
