/**
 * src/api/elections.js
 *
 * Election API endpoints
 */

import apiClient from './apiClient.js';

// Global Election Endpoints
export const getElections = async () => {
  const response = await apiClient.get('/election/elections/');
  return response.data;
};

export const createElection = async (formData) => {
  const response = await apiClient.post('/election/elections/', formData);
  return response.data;
};

export const updateElection = async (electionId, formData) => {
  const response = await apiClient.put(`/election/elections/${electionId}/`, formData);
  return response.data;
};

export const deleteElection = async (electionId) => {
  const response = await apiClient.delete(`/election/elections/${electionId}/`);
  return response.data;
};

export const getElection = async (electionId) => {
  const response = await apiClient.get(`/election/elections/${electionId}/`);
  return response.data;
};

// Nested Election Endpoints
export const getElectionPositions = async (electionId) => {
  const response = await apiClient.get(`/election/elections/${electionId}/positions/`);
  return response.data;
};

export const createElectionPosition = async (electionId, formData) => {
  const response = await apiClient.post(`/election/elections/${electionId}/positions/`, formData);
  return response.data;
};

export const getElectionCandidates = async (electionId) => {
  const response = await apiClient.get(`/election/elections/${electionId}/candidates/`);
  return response.data;
};

export const createElectionCandidate = async (electionId, formData) => {
  const response = await apiClient.post(`/election/elections/${electionId}/candidates/`, formData);
  return response.data;
};

export const getElectionCourses = async (electionId) => {
  const response = await apiClient.get(`/election/elections/${electionId}/courses/`);
  return response.data;
};

export const createElectionCourse = async (electionId, formData) => {
  const response = await apiClient.post(`/election/elections/${electionId}/courses/`, formData);
  return response.data;
};

export const getElectionYearLevels = async (electionId) => {
  const response = await apiClient.get(`/election/elections/${electionId}/year_levels/`);
  return response.data;
};

export const createElectionYearLevel = async (electionId, formData) => {
  const response = await apiClient.post(`/election/elections/${electionId}/year_levels/`, formData);
  return response.data;
};

export const submitVote = async (electionId, payload) => {
  const response = await apiClient.post(`/election/elections/${electionId}/vote/`, payload);
  return response.data;
};

export const getElectionPartyLists = async (electionId) => {
  const response = await apiClient.get(`/election/elections/${electionId}/partylists/`);
  return response.data;
};

export const createElectionPartyList = async (electionId, formData) => {
  const response = await apiClient.post(`/election/elections/${electionId}/partylists/`, formData);
  return response.data;
};

// Global Party List Endpoints
export const getPartyLists = async () => {
  const response = await apiClient.get('/election/partylists/');
  return response.data;
};

export const createPartyList = async (formData) => {
  const response = await apiClient.post('/election/partylists/', formData);
  return response.data;
};

// Election Results
export const getElectionResults = async (electionId) => {
  // Use authenticated request (results require IsAuthenticated)
  const response = await apiClient.get(`/election/elections/${electionId}/results/`);
  return response.data;
};
