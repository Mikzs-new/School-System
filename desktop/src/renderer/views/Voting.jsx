import React, { useEffect, useState } from 'react';
import { CheckCircle2, Eye, RefreshCw, UsersRound } from 'lucide-react';
import { getCandidates, submitVote } from '../api/voting.js';
import { hasPermission } from '../state/permissionGuard.js';

function getCandidateName(candidate) {
  return candidate.name || candidate.full_name || candidate.candidate_name || `Candidate ${candidate.id}`;
}

function getCandidateDetail(candidate) {
  return candidate.position || candidate.party || candidate.description || 'Candidate';
}

export default function Voting({ user }) {
  const canUseAdminTools = hasPermission(user, 'candidates.update') || hasPermission(user, 'votes.read');
  const canCastVote = hasPermission(user, 'vote.cast');
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState('');
  const [studentId, setStudentId] = useState('');
  const [status, setStatus] = useState({ type: 'idle', message: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadCandidates = async () => {
    setIsLoading(true);
    setStatus({ type: 'idle', message: '' });

    try {
      const data = await getCandidates();
      setCandidates(data);
      if (!data.length) {
        setStatus({ type: 'info', message: 'No candidates were returned by the API.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCandidates();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!canCastVote) {
      setStatus({ type: 'error', message: 'Access Denied' });
      return;
    }

    const selectedCandidate = candidates.find((candidate) => String(candidate.id || candidate.pk) === String(selectedCandidateId));

    if (!studentId.trim()) {
      setStatus({ type: 'error', message: 'Enter the student record ID before submitting your vote.' });
      return;
    }

    if (!selectedCandidate) {
      setStatus({ type: 'error', message: 'Choose a candidate before submitting your vote.' });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: 'idle', message: '' });

    try {
      await submitVote({ student: studentId.trim(), election: selectedCandidate.election });
      setStatus({ type: 'success', message: 'Your vote was submitted successfully.' });
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="page-stack" aria-labelledby="voting-title">
      <header className="page-header">
        <div>
          <span className="eyebrow">Voting</span>
          <h1 id="voting-title">Candidate ballot</h1>
        </div>
        <button className="secondary-button" disabled={isLoading} type="button" onClick={loadCandidates}>
          <RefreshCw size={17} />
          <span>Refresh</span>
        </button>
      </header>

      <form className="ballot" onSubmit={handleSubmit}>
        {canUseAdminTools ? (
          <div className="privileged-actions" aria-label="Privileged voting tools">
            <button className="secondary-button" type="button">
              <UsersRound size={17} />
              <span>Manage candidates</span>
            </button>
            <button className="secondary-button" type="button">
              <Eye size={17} />
              <span>View all votes</span>
            </button>
          </div>
        ) : null}

        <label className="field-row">
          <span>Student record ID</span>
          <input
            inputMode="numeric"
            onChange={(event) => setStudentId(event.target.value)}
            placeholder="Example: 1"
            required
            type="text"
            value={studentId}
          />
        </label>

        {isLoading ? <div className="empty-state">Loading candidates...</div> : null}

        {!isLoading && candidates.length > 0 ? (
          <div className="candidate-list">
            {candidates.map((candidate) => {
              const id = candidate.id || candidate.pk || candidate.candidate_id;
              const isSelected = String(selectedCandidateId) === String(id);

              return (
                <label className={isSelected ? 'candidate-row selected' : 'candidate-row'} key={id}>
                  <input
                    checked={isSelected}
                    name="candidate"
                    onChange={() => setSelectedCandidateId(id)}
                    type="radio"
                    value={id}
                  />
                  <span className="radio-mark" />
                  <span className="candidate-copy">
                    <strong>{getCandidateName(candidate)}</strong>
                    <small>{getCandidateDetail(candidate)}</small>
                  </span>
                </label>
              );
            })}
          </div>
        ) : null}

        {status.message ? <div className={`status-banner ${status.type}`}>{status.message}</div> : null}

        <button className="primary-button submit-vote" disabled={isSubmitting || isLoading} type="submit">
          <CheckCircle2 size={18} />
          <span>{isSubmitting ? 'Submitting...' : 'Submit vote'}</span>
        </button>
      </form>
    </section>
  );
}
