/**
 * src/state/permissionGuard.js
 * Helper functions for checking user permissions and module access.
 */

import { ROLE_PERMISSIONS } from './permissions.js';

export function hasPermission(user, permission) {
  const role = user?.role || 'student';
  const perms = ROLE_PERMISSIONS[role] || [];
  const [module] = String(permission).split('.');
  return perms.includes('*') || perms.includes(permission) || perms.includes(`${module}.*`);
}

export function hasModuleAccess(user, module, action = 'read') {
  return hasPermission(user, `${module}.${action}`);
}
