/**
 * src/api/positions.js
 *
 * Position API endpoints
 */

import apiClient from './apiClient.js';

export const getPositions = async (electionId) => {
  const response = await apiClient.get(`/elections/${electionId}/positions/`);
  return response.data;
};

export const createPosition = async (electionId, formData) => {
  const response = await apiClient.post(`/elections/${electionId}/positions/`, formData);
  return response.data;
};

export const updatePosition = async (positionId, formData) => {
  const response = await apiClient.put(`/positions/${positionId}/`, formData);
  return response.data;
};

export const deletePosition = async (positionId) => {
  const response = await apiClient.delete(`/positions/${positionId}/`);
  return response.data;
};
