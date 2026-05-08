/**
 * src/renderer/api/modules.js
 *
 * Generic CRUD helpers used by all module views (Students, Candidates, etc.).
 * All endpoints follow the DRF DefaultRouter pattern: /api/v1/<resource>/
 */

import apiClient from './apiClient.js';

function normalizeList(data) {
  return Array.isArray(data) ? data : data?.results || data?.items || [];
}

export async function listModule(endpoint) {
  const res = await apiClient.get(endpoint);
  return normalizeList(res.data);
}

export async function createModuleRecord(endpoint, payload) {
  const res = await apiClient.post(endpoint, payload);
  return res.data;
}

export async function updateModuleRecord(endpoint, id, payload) {
  const res = await apiClient.patch(`${endpoint}${id}/`, payload);
  return res.data;
}

export async function deleteModuleRecord(endpoint, id) {
  const res = await apiClient.delete(`${endpoint}${id}/`);
  return res.data;
}
