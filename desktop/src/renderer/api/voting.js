/**
 * src/renderer/api/voting.js
 *
 * Voting-specific API calls using the existing backend routes.
 */

import apiClient from './apiClient.js';

export async function getCandidates() {
  const res = await apiClient.get('/api/v1/election/candidates/');
  return Array.isArray(res.data) ? res.data : res.data?.results || [];
}

export async function getVotes() {
  const res = await apiClient.get('/api/v1/election/votes/');
  return Array.isArray(res.data) ? res.data : res.data?.results || [];
}

export async function submitVote({ student, election }) {
  const res = await apiClient.post('/api/v1/election/vote/', { student, election });
  return res.data;
}
