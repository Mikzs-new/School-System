import React, { useEffect, useState } from 'react';
import { BarChart3, RefreshCw, Settings, UsersRound } from 'lucide-react';
import { getCandidates, getVotes } from '../api/voting.js';
import { hasRole } from '../state/roleGuard.js';

export default function AdminPanel({ user }) {
  const canUseAdminTools = hasRole(user, ['admin', 'staff']);
  const [activeTool, setActiveTool] = useState('candidates');
  const [candidates, setCandidates] = useState([]);
  const [votes, setVotes] = useState([]);
  const [status, setStatus] = useState({ type: 'idle', message: '' });
  const [isLoading, setIsLoading] = useState(false);

  const loadAdminData = async (tool = activeTool) => {
    setIsLoading(true);
    setStatus({ type: 'idle', message: '' });

    try {
      if (tool === 'candidates') {
        const data = await getCandidates();
        setCandidates(data);
        setStatus({ type: 'success', message: `Loaded ${data.length} candidate record(s).` });
      } else if (tool === 'votes') {
        const data = await getVotes();
        setVotes(data);
        setStatus({ type: 'success', message: `Loaded ${data.length} vote record(s).` });
      } else {
        setStatus({ type: 'info', message: 'Admin tools are available for this account.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (canUseAdminTools) {
      loadAdminData(activeTool);
    }
  }, [activeTool, canUseAdminTools]);

  if (!canUseAdminTools) {
    return null;
  }

  return (
    <section className="page-stack" aria-labelledby="admin-title">
      <header className="page-header">
        <div>
          <span className="eyebrow">Admin</span>
          <h1 id="admin-title">Admin tools</h1>
        </div>
        <button className="secondary-button" disabled={isLoading} type="button" onClick={() => loadAdminData()}>
          <RefreshCw size={17} />
          <span>Refresh</span>
        </button>
      </header>

      <div className="admin-grid">
        <button
          className={activeTool === 'candidates' ? 'tool-card active-tool' : 'tool-card'}
          type="button"
          onClick={() => setActiveTool('candidates')}
        >
          <UsersRound size={26} />
          <div>
            <h2>Manage candidates</h2>
            <p>Review candidate records from the existing backend API.</p>
          </div>
        </button>

        <button
          className={activeTool === 'votes' ? 'tool-card active-tool' : 'tool-card'}
          type="button"
          onClick={() => setActiveTool('votes')}
        >
          <BarChart3 size={26} />
          <div>
            <h2>View all votes</h2>
            <p>Access privileged voting summaries when the backend permits it.</p>
          </div>
        </button>

        <button
          className={activeTool === 'tools' ? 'tool-card active-tool' : 'tool-card'}
          type="button"
          onClick={() => setActiveTool('tools')}
        >
          <Settings size={26} />
          <div>
            <h2>Admin tools</h2>
            <p>Desktop-only shortcuts for staff and administrator workflows.</p>
          </div>
        </button>
      </div>

      {status.message ? <div className={`status-banner ${status.type}`}>{status.message}</div> : null}

      {activeTool === 'candidates' ? (
        <div className="data-panel">
          <h2>Candidate records</h2>
          {isLoading ? <div className="empty-state">Loading candidates...</div> : null}
          {!isLoading && candidates.length === 0 ? <div className="empty-state">No candidates found.</div> : null}
          {!isLoading && candidates.length > 0 ? (
            <div className="record-list">
              {candidates.map((candidate) => (
                <div className="record-row" key={candidate.id || candidate.pk}>
                  <strong>{candidate.name || candidate.full_name || candidate.student || `Candidate ${candidate.id}`}</strong>
                  <span>Election: {candidate.election || 'N/A'}</span>
                  <span>Position: {candidate.position || 'N/A'}</span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      {activeTool === 'votes' ? (
        <div className="data-panel">
          <h2>Vote records</h2>
          {isLoading ? <div className="empty-state">Loading votes...</div> : null}
          {!isLoading && votes.length === 0 ? <div className="empty-state">No votes found.</div> : null}
          {!isLoading && votes.length > 0 ? (
            <div className="record-list">
              {votes.map((vote) => (
                <div className="record-row" key={vote.id || `${vote.student}-${vote.election}`}>
                  <strong>Vote #{vote.id || 'N/A'}</strong>
                  <span>Student: {vote.student || 'N/A'}</span>
                  <span>Election: {vote.election || 'N/A'}</span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      {activeTool === 'tools' ? (
        <div className="data-panel">
          <h2>Admin tools</h2>
          <p className="muted-copy">Your desktop account is authorized as {user.role}. Backend changes are intentionally not made from this screen.</p>
        </div>
      ) : null}
    </section>
  );
}
