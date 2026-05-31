/**
 * src/api/candidates.js
 *
 * Candidate API endpoints
 */

import apiClient from './apiClient.js';

export const getCandidates = async (electionId) => {
  const response = await apiClient.get(`/elections/${electionId}/candidates/`);
  return response.data;
};

export const createCandidate = async (electionId, formData) => {
  const response = await apiClient.post(`/elections/${electionId}/candidates/`, formData);
  return response.data;
};

export const updateCandidate = async (candidateId, formData) => {
  const response = await apiClient.put(`/candidates/${candidateId}/`, formData);
  return response.data;
};

export const deleteCandidate = async (candidateId) => {
  const response = await apiClient.delete(`/candidates/${candidateId}/`);
  return response.data;
};
