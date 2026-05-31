import { useState, useEffect } from 'react'
import { X, Trophy, Users, Vote, TrendingUp, Calendar } from 'lucide-react'
import api from '../api/apiClient'
import { formatUtcDateOnly } from '../utils/dateUtils.js'

export default function ElectionResultsModal({ election, onClose }) {
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadResults()
  }, [election])

  async function loadResults() {
    try {
      setLoading(true)
      const response = await api.get(`/api/v1/election/elections/${election.id}/results/`)
      setResults(response.data)
    } catch (error) {
      console.error('Error loading results:', error)
      alert('Failed to load election results')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return formatUtcDateOnly(dateString)
  }

  if (loading) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-card modal-lg" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Election Results</h3>
            <button onClick={onClose} aria-label="Close modal">
              <X size={20} />
            </button>
          </div>
          <div className="loading-state">Loading results...</div>
        </div>
      </div>
    )
  }

  if (!results) {
    return null
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Election Results</h3>
          <button onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="election-results-container">
          {/* Results Header Card */}
          <div className="results-header-card">
            <div className="results-header-info">
              <h2 className="results-election-name">{election.name}</h2>
              <div className={`election-status status-ended`}>Ended</div>
            </div>
            
            <div className="results-date-range">
              <Calendar size={16} />
              <span>
                {formatDate(election.start_datetime)} to {formatDate(election.end_datetime)}
              </span>
            </div>

            <div className="results-stats-grid">
              <div className="result-stat-card">
                <div className="stat-value">{results.total_possible_votes}</div>
                <div className="stat-label">Eligible Voters</div>
                <Users size={20} className="stat-icon" />
              </div>
              <div className="result-stat-card">
                <div className="stat-value">{results.total_votes}</div>
                <div className="stat-label">Votes Cast</div>
                <Vote size={20} className="stat-icon" />
              </div>
              <div className="result-stat-card">
                <div className="stat-value">{results.turnout_percentage}%</div>
                <div className="stat-label">Turnout</div>
                <TrendingUp size={20} className="stat-icon" />
              </div>
            </div>
          </div>

          {/* Position Results */}
          <div className="results-grid">
            {results.candidate_results && results.candidate_results.map((positionResult, index) => (
              <div key={index} className="position-result-card">
                <h4 className="position-title">{positionResult.position}</h4>
                
                <div className="candidates-list">
                  {positionResult.candidates.map((candidate, idx) => (
                    <div
                      key={candidate.id}
                      className={`candidate-result-row ${candidate.ranking === 1 ? 'winner' : ''}`}
                    >
                      <div className="candidate-info">
                        {candidate.ranking === 1 && (
                          <div className="winner-badge">
                            <Trophy size={14} />
                            <span>WINNER</span>
                          </div>
                        )}
                        <div className="candidate-details">
                          <div className="candidate-name">{candidate.name}</div>
                          {candidate.partylist && (
                            <div className="candidate-partylist">{candidate.partylist}</div>
                          )}
                        </div>
                      </div>
                      <div className="candidate-votes">
                        <div className="vote-count">{candidate.total_votes}</div>
                        <div className="vote-label">Votes</div>
                      </div>
                    </div>
                  ))}
                </div>

                {positionResult.abstained_votes !== undefined && (
                  <div className="abstained-info">
                    Abstained: {positionResult.abstained_votes} votes
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
