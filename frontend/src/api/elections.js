/**
 * src/api/elections.js
 *
 * Election API endpoints
 */

import apiClient from './apiClient.js';

export const getElections = async () => {
  const response = await apiClient.get('/elections/elections/');
  return response.data;
};

export const createElection = async (formData) => {
  const response = await apiClient.post('/elections/elections/', formData);
  return response.data;
};

export const updateElection = async (electionId, formData) => {
  const response = await apiClient.put(`/elections/elections/${electionId}/`, formData);
  return response.data;
};

export const deleteElection = async (electionId) => {
  const response = await apiClient.delete(`/elections/elections/${electionId}/`);
  return response.data;
};

export const getElection = async (electionId) => {
  const response = await apiClient.get(`/elections/elections/${electionId}/`);
  return response.data;
};
