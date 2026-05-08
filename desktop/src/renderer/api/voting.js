/**
 * src/renderer/api/voting.js
 *
 * Voting-specific API calls.
 *
 * Endpoints (from backend api/urls.py):
 *   GET  /api/v1/candidates/   → CandidateViewSet (IsAuthenticated + IsFacilitator)
 *   GET  /api/v1/votes/        → VoteViewSet
 *   POST /api/v1/votes/        → VoteCreateSerializer fields: student, election
 *
 * Vote model: student (FK→Student), election (FK→Election)
 * VoteItem model: vote, candidate, position
 */

import apiClient from './apiClient.js';

export async function getCandidates() {
  const res = await apiClient.get('/api/v1/candidates/');
  return Array.isArray(res.data) ? res.data : res.data?.results || [];
}

export async function getVotes() {
  const res = await apiClient.get('/api/v1/votes/');
  return Array.isArray(res.data) ? res.data : res.data?.results || [];
}

/**
 * Submit a vote.
 * @param {object} payload - { student: <Student id>, election: <Election id> }
 */
export async function submitVote({ student, election }) {
  const res = await apiClient.post('/api/v1/votes/', { student, election });
  return res.data;
}
