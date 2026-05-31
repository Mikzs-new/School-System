import React, { useEffect, useState } from 'react';

import {
  GraduationCap,
  Layers3,
  ListChecks,
  Users,
  ShieldCheck,
  X,
  ChevronRight,
  ArrowLeft,
  BarChart3,
  Trophy,
  TrendingUp,
  UserX,
  Crown
} from 'lucide-react';

import apiClient from '../../api/apiClient.js';
import { authStore } from '../../state/authStore.js';
import NotificationModal from '../../components/ui/NotificationModal.jsx';
import {
  getElection,
  getElectionCourses,
  getElectionYearLevels,
  getElectionPositions,
  getElectionPartyLists,
  getElectionCandidates,
  createElectionCourse,
  createElectionYearLevel,
  createElectionPosition,
  createElectionPartyList,
  createElectionCandidate,
  getElectionResults
} from '../../api/elections.js';

export default function ElectionDetailPage({ electionId, onBack }) {
  const userRole = authStore.getRole();
  const isStudent = userRole === 'student';

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const [courses, setCourses] = useState([]);
  const [yearLevels, setYearLevels] = useState([]);
  const [positions, setPositions] = useState([]);
  const [partylists, setPartylists] = useState([]);
  const [candidates, setCandidates] = useState([]);

  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showYearModal, setShowYearModal] = useState(false);
  const [showPositionModal, setShowPositionModal] = useState(false);
  const [showPartylistModal, setShowPartylistModal] = useState(false);
  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [notification, setNotification] = useState({ isOpen: false, title: '', message: '', type: 'info' });

  const [courseForm, setCourseForm] = useState({ course: '' });
  const [yearForm, setYearForm] = useState({ year_level: '' });
  const [positionForm, setPositionForm] = useState({ title: '', seat_count: 1 });
  const [partylistForm, setPartylistForm] = useState({ partylist: '' });
  const [candidateForm, setCandidateForm] = useState({ student_enrollment: '', position: '', partylist: '' });
  const [results, setResults] = useState(null);

  useEffect(() => {
    loadAllData();
  }, [electionId]);

  async function loadAllData() {
    setLoading(true);
    try {
      await Promise.all([
        loadElectionDetails(),
        loadCourses(),
        loadYearLevels(),
        loadPositions(),
        loadPartylists(),
        loadCandidates()
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function loadElectionDetails() {
    try {
      const data = await getElection(electionId);
      setDetails(data);
    } catch (error) {
      console.error('Error loading election details:', error);
    }
  }

  async function loadCourses() {
    try {
      const data = await getElectionCourses(electionId);
      setCourses(data || []);
    } catch (error) {
      console.error('Error loading courses:', error);
    }
  }

  async function loadYearLevels() {
    try {
      const data = await getElectionYearLevels(electionId);
      setYearLevels(data || []);
    } catch (error) {
      console.error('Error loading year levels:', error);
    }
  }

  async function loadPositions() {
    try {
      const data = await getElectionPositions(electionId);
      setPositions(data || []);
    } catch (error) {
      console.error('Error loading positions:', error);
    }
  }

  async function loadPartylists() {
    try {
      const data = await getElectionPartyLists(electionId);
      setPartylists(data || []);
    } catch (error) {
      console.error('Error loading partylists:', error);
    }
  }

  async function loadCandidates() {
    try {
      const data = await getElectionCandidates(electionId);
      setCandidates(data || []);
    } catch (error) {
      console.error('Error loading candidates:', error);
    }
  }

  const showNotification = (title, message, type = 'info') => {
    setNotification({ isOpen: true, title, message, type });
  };

  const closeNotification = () => {
    setNotification({ isOpen: false, title: '', message: '', type: 'info' });
  };

  async function handleAddCourse(e) {
    e.preventDefault();
    try {
      const payload = { course: parseInt(courseForm.course) };
      await createElectionCourse(electionId, payload);
      showNotification('Success', 'Course added successfully', 'success');
      setShowCourseModal(false);
      setCourseForm({ course: '' });
      loadCourses();
    } catch (error) {
      console.error(error);
      showNotification('Error', error?.response?.data?.detail || 'Failed to add course', 'error');
    }
  }

  async function handleAddYearLevel(e) {
    e.preventDefault();
    try {
      const payload = { year_level: parseInt(yearForm.year_level) };
      await createElectionYearLevel(electionId, payload);
      showNotification('Success', 'Year level added successfully', 'success');
      setShowYearModal(false);
      setYearForm({ year_level: '' });
      loadYearLevels();
    } catch (error) {
      console.error(error);
      showNotification('Error', error?.response?.data?.detail || 'Failed to add year level', 'error');
    }
  }

  async function handleAddPosition(e) {
    e.preventDefault();
    try {
      const payload = { title: positionForm.title, seat_count: parseInt(positionForm.seat_count) };
      await createElectionPosition(electionId, payload);
      showNotification('Success', 'Position added successfully', 'success');
      setShowPositionModal(false);
      setPositionForm({ title: '', seat_count: 1 });
      loadPositions();
    } catch (error) {
      console.error(error);
      showNotification('Error', error?.response?.data?.detail || 'Failed to add position', 'error');
    }
  }

  async function handleAddPartylist(e) {
    e.preventDefault();
    try {
      const payload = { partylist: parseInt(partylistForm.partylist) };
      await createElectionPartyList(electionId, payload);
      showNotification('Success', 'Party list added successfully', 'success');
      setShowPartylistModal(false);
      setPartylistForm({ partylist: '' });
      loadPartylists();
    } catch (error) {
      console.error(error);
      showNotification('Error', error?.response?.data?.detail || 'Failed to add party list', 'error');
    }
  }

  async function handleAddCandidate(e) {
    e.preventDefault();
    try {
      const payload = {
        student_enrollment: parseInt(candidateForm.student_enrollment),
        position: parseInt(candidateForm.position),
        partylist: candidateForm.partylist ? parseInt(candidateForm.partylist) : null
      };
      await createElectionCandidate(electionId, payload);
      showNotification('Success', 'Candidate added successfully', 'success');
      setShowCandidateModal(false);
      setCandidateForm({ student_enrollment: '', position: '', partylist: '' });
      loadCandidates();
    } catch (error) {
      console.error(error);
      showNotification('Error', error?.response?.data?.detail || 'Failed to add candidate', 'error');
    }
  }

  async function handleRemoveCourse(itemId) {
    if (!confirm('Are you sure you want to remove this course?')) return;
    try {
      await apiClient.delete(`/election/elections/${electionId}/courses/${itemId}/`);
      showNotification('Success', 'Course removed successfully', 'success');
      loadCourses();
    } catch (error) {
      console.error(error);
      showNotification('Error', 'Failed to remove course', 'error');
    }
  }

  async function handleRemoveYearLevel(itemId) {
    if (!confirm('Are you sure you want to remove this year level?')) return;
    try {
      await apiClient.delete(`/election/elections/${electionId}/year_levels/${itemId}/`);
      showNotification('Success', 'Year level removed successfully', 'success');
      loadYearLevels();
    } catch (error) {
      console.error(error);
      showNotification('Error', 'Failed to remove year level', 'error');
    }
  }

  async function handleRemovePosition(itemId) {
    if (!confirm('Are you sure you want to remove this position?')) return;
    try {
      await apiClient.delete(`/election/elections/${electionId}/positions/${itemId}/`);
      showNotification('Success', 'Position removed successfully', 'success');
      loadPositions();
    } catch (error) {
      console.error(error);
      showNotification('Error', 'Failed to remove position', 'error');
    }
  }

  async function handleRemovePartylist(itemId) {
    if (!confirm('Are you sure you want to remove this party list?')) return;
    try {
      await apiClient.delete(`/election/elections/${electionId}/partylists/${itemId}/`);
      showNotification('Success', 'Party list removed successfully', 'success');
      loadPartylists();
    } catch (error) {
      console.error(error);
      showNotification('Error', 'Failed to remove party list', 'error');
    }
  }

  async function handleRemoveCandidate(itemId) {
    if (!confirm('Are you sure you want to remove this candidate?')) return;
    try {
      await apiClient.delete(`/election/elections/${electionId}/candidates/${itemId}/`);
      showNotification('Success', 'Candidate removed successfully', 'success');
      loadCandidates();
    } catch (error) {
      console.error(error);
      showNotification('Error', 'Failed to remove candidate', 'error');
    }
  }

  async function handleViewResults() {
    try {
      const data = await getElectionResults(electionId);
      console.log('Results data:', data);
      setResults(data);
      setShowResultsModal(true);
    } catch (error) {
      console.error('Error loading results:', error);
      const errorMessage = error?.response?.data?.detail || 
                          error?.response?.data?.message ||
                          error?.message || 
                          'Failed to load results';
      
      // Check if election is not ended
      if (errorMessage.includes('not available yet') || errorMessage.includes('not available')) {
        showNotification('Results Unavailable', 'Election results are not available yet. The election must be ended before viewing results.', 'warning');
      } else {
        showNotification('Error', errorMessage, 'error');
      }
    }
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className="empty-state">Loading election data...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* BREADCRUMBS */}
      <div className="breadcrumbs">
        <button onClick={onBack} className="breadcrumb-link">
          <ArrowLeft size={16} />
          Elections
        </button>
        <ChevronRight size={16} className="breadcrumb-separator" />
        <span className="breadcrumb-current">{details?.name || 'Election Detail'}</span>
      </div>

      {/* PAGE HEADER */}
      <div className="page-header">
        <div>
          <h1>{details?.name || 'Election Detail'}</h1>
          <p>Election configuration workspace</p>
        </div>
        <button
          className="workspace-secondary-btn"
          onClick={handleViewResults}
        >
          <BarChart3 size={16} />
          View Results
        </button>
      </div>

      {/* ELECTION CONFIG GRID */}
      <div className="election-config-grid">
        {/* LEFT COLUMN */}
        <div className="election-records">
          {/* ALLOWED COURSES */}
          <div className="config-card">
            <div className="config-title">
              <div className="config-title-left">
                <GraduationCap size={18} />
                <h3>Allowed Courses</h3>
              </div>
              {!isStudent && (
                <button
                  className="workspace-primary-btn"
                  onClick={() => setShowCourseModal(true)}
                >
                  + Add
                </button>
              )}
            </div>
            <div className="config-list">
              {courses.length > 0 ? (
                courses.map((item) => (
                  <div key={item.id} className="config-item-with-action">
                    <span>{item.course?.name || item.initials || item.course || 'Unknown Course'}</span>
                    {!isStudent && (
                      <button
                        className="config-item-remove"
                        onClick={() => handleRemoveCourse(item.id)}
                        aria-label={`Remove ${item.course?.name || item.initials || 'course'}`}
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="empty-state">No allowed courses</div>
              )}
            </div>
          </div>

          {/* YEAR LEVELS */}
          <div className="config-card">
            <div className="config-title">
              <div className="config-title-left">
                <Layers3 size={18} />
                <h3>Year Levels</h3>
              </div>
              {!isStudent && (
                <button
                  className="workspace-primary-btn"
                  onClick={() => setShowYearModal(true)}
                >
                  + Add
                </button>
              )}
            </div>
            <div className="config-list">
              {yearLevels.length > 0 ? (
                yearLevels.map((item) => (
                  <div key={item.id} className="config-item-with-action">
                    <span>Year {item.year_level}</span>
                    {!isStudent && (
                      <button
                        className="config-item-remove"
                        onClick={() => handleRemoveYearLevel(item.id)}
                        aria-label={`Remove Year ${item.year_level}`}
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="empty-state">No year levels</div>
              )}
            </div>
          </div>

          {/* POSITIONS */}
          <div className="config-card">
            <div className="config-title">
              <div className="config-title-left">
                <ListChecks size={18} />
                <h3>Positions</h3>
              </div>
              {!isStudent && (
                <button
                  className="workspace-primary-btn"
                  onClick={() => setShowPositionModal(true)}
                >
                  + Add
                </button>
              )}
            </div>
            <div className="config-list">
              {positions.length > 0 ? (
                positions.map((position) => (
                  <div key={position.id} className="config-item-with-action">
                    <span>
                      {position?.title || 'Unknown Position'} — Seats: {position?.seat_count || 0}
                    </span>
                    {!isStudent && (
                      <button
                        className="config-item-remove"
                        onClick={() => handleRemovePosition(position.id)}
                        aria-label={`Remove ${position?.title || 'position'}`}
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="empty-state">No positions</div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="election-actions">
          {/* PARTYLISTS */}
          <div className="config-card">
            <div className="config-title">
              <div className="config-title-left">
                <ShieldCheck size={18} />
                <h3>Party Lists</h3>
              </div>
              {!isStudent && (
                <button
                  className="workspace-primary-btn"
                  onClick={() => setShowPartylistModal(true)}
                >
                  + Add
                </button>
              )}
            </div>
            <div className="config-list">
              {partylists.length > 0 ? (
                partylists.map((party) => (
                  <div key={party.id} className="config-item-with-action">
                    <span>{party.partylist?.name || party.initials || 'Unknown Party List'}</span>
                    {!isStudent && (
                      <button
                        className="config-item-remove"
                        onClick={() => handleRemovePartylist(party.id)}
                        aria-label={`Remove ${party.partylist?.name || 'party list'}`}
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="empty-state">No party lists</div>
              )}
            </div>
          </div>

          {/* CANDIDATES */}
          <div className="config-card">
            <div className="config-title">
              <div className="config-title-left">
                <Users size={18} />
                <h3>Candidates</h3>
              </div>
              {!isStudent && (
                <button
                  className="workspace-primary-btn"
                  onClick={() => setShowCandidateModal(true)}
                >
                  + Add
                </button>
              )}
            </div>
            <div className="config-list">
              {candidates.length > 0 ? (
                candidates.map((candidate) => (
                  <div key={candidate.id} className="config-item-with-action">
                    <span>
                      {candidate.partylist
                        ? `${candidate.full_name} (${candidate.partylist}) — ${candidate.position}`
                        : `${candidate.full_name} — ${candidate.position}`}
                    </span>
                    {!isStudent && (
                      <button
                        className="config-item-remove"
                        onClick={() => handleRemoveCandidate(candidate.id)}
                        aria-label={`Remove candidate`}
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="empty-state">No candidates</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MODALS */}
      {showCourseModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Add Course</h3>
            <form onSubmit={handleAddCourse}>
              <input
                type="text"
                placeholder="Course ID"
                value={courseForm.course}
                onChange={(e) => setCourseForm({ course: e.target.value })}
                required
              />
              <div className="modal-actions">
                <button type="button" onClick={() => setShowCourseModal(false)}>Cancel</button>
                <button type="submit">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showYearModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Add Year Level</h3>
            <form onSubmit={handleAddYearLevel}>
              <input
                type="number"
                placeholder="Year Level"
                value={yearForm.year_level}
                onChange={(e) => setYearForm({ year_level: e.target.value })}
                required
              />
              <div className="modal-actions">
                <button type="button" onClick={() => setShowYearModal(false)}>Cancel</button>
                <button type="submit">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPositionModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Add Position</h3>
            <form onSubmit={handleAddPosition}>
              <input
                type="text"
                placeholder="Position Title"
                value={positionForm.title}
                onChange={(e) => setPositionForm({ ...positionForm, title: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Seat Count"
                value={positionForm.seat_count}
                onChange={(e) => setPositionForm({ ...positionForm, seat_count: e.target.value })}
                required
              />
              <div className="modal-actions">
                <button type="button" onClick={() => setShowPositionModal(false)}>Cancel</button>
                <button type="submit">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPartylistModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Add Party List</h3>
            <form onSubmit={handleAddPartylist}>
              <input
                type="text"
                placeholder="Party List ID"
                value={partylistForm.partylist}
                onChange={(e) => setPartylistForm({ partylist: e.target.value })}
                required
              />
              <div className="modal-actions">
                <button type="button" onClick={() => setShowPartylistModal(false)}>Cancel</button>
                <button type="submit">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCandidateModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Add Candidate</h3>
            <form onSubmit={handleAddCandidate}>
              <input
                type="text"
                placeholder="Student Enrollment ID"
                value={candidateForm.student_enrollment}
                onChange={(e) => setCandidateForm({ ...candidateForm, student_enrollment: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Position ID"
                value={candidateForm.position}
                onChange={(e) => setCandidateForm({ ...candidateForm, position: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Party List ID (optional)"
                value={candidateForm.partylist}
                onChange={(e) => setCandidateForm({ ...candidateForm, partylist: e.target.value })}
              />
              <div className="modal-actions">
                <button type="button" onClick={() => setShowCandidateModal(false)}>Cancel</button>
                <button type="submit">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showResultsModal && (
        <div className="modal-overlay">
          <div className="results-modal">
            <div className="results-modal-header">
              <h3>Election Results</h3>
              <button
                className="results-modal-close"
                onClick={() => setShowResultsModal(false)}
                aria-label="Close results"
              >
                <X size={20} />
              </button>
            </div>
            <div className="results-modal-content">
              {!results ? (
                <div className="empty-state">Loading results...</div>
              ) : (
                <div className="results-dashboard">
                  {/* SUMMARY CARDS */}
                  <div className="results-summary-grid">
                    <div className="summary-card">
                      <div className="summary-icon summary-icon-total">
                        <Users size={24} />
                      </div>
                      <div className="summary-content">
                        <span className="summary-label">Total Possible Votes</span>
                        <span className="summary-value">{results.total_possible_votes || 0}</span>
                      </div>
                    </div>
                    <div className="summary-card">
                      <div className="summary-icon summary-icon-votes">
                        <TrendingUp size={24} />
                      </div>
                      <div className="summary-content">
                        <span className="summary-label">Total Votes Cast</span>
                        <span className="summary-value">{results.total_votes || 0}</span>
                      </div>
                    </div>
                    <div className="summary-card">
                      <div className="summary-icon summary-icon-turnout">
                        <BarChart3 size={24} />
                      </div>
                      <div className="summary-content">
                        <span className="summary-label">Turnout</span>
                        <span className="summary-value">{results.turnout_percentage || 0}%</span>
                      </div>
                    </div>
                    <div className="summary-card">
                      <div className="summary-icon summary-icon-abstained">
                        <UserX size={24} />
                      </div>
                      <div className="summary-content">
                        <span className="summary-label">Abstained</span>
                        <span className="summary-value">{results.abstained_students || 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* RESULTS BY POSITION */}
                  {results.candidate_results && results.candidate_results.length > 0 && (
                    <div className="results-by-position">
                      {results.candidate_results.map((positionResult, idx) => (
                        <div key={idx} className="position-results-section">
                          <div className="position-header">
                            <h4>{positionResult.position}</h4>
                            <span className="abstained-badge">Abstained: {positionResult.abstained_votes || 0}</span>
                          </div>

                          {/* WINNER CARD */}
                          {positionResult.candidates && positionResult.candidates.length > 0 && (
                            <div className="winner-card">
                              <div className="winner-badge">
                                <Crown size={20} />
                                <span>Winner</span>
                              </div>
                              <div className="winner-info">
                                <h5>{positionResult.candidates[0].candidate_name}</h5>
                                <div className="winner-stats">
                                  <span className="winner-votes">{positionResult.candidates[0].total_votes} votes</span>
                                  <span className="winner-percentage">{positionResult.candidates[0].vote_percentage}%</span>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* CANDIDATE RANKINGS TABLE */}
                          {positionResult.candidates && positionResult.candidates.length > 0 && (
                            <div className="rankings-table-container">
                              <h5>Full Rankings</h5>
                              <table className="rankings-table">
                                <thead>
                                  <tr>
                                    <th>Rank</th>
                                    <th>Candidate</th>
                                    <th>Votes</th>
                                    <th>Percentage</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {positionResult.candidates.map((candidate) => (
                                    <tr key={candidate.candidate_id}>
                                      <td className="rank-cell">
                                        <span className={`rank-badge rank-${candidate.ranking}`}>
                                          #{candidate.ranking}
                                        </span>
                                      </td>
                                      <td className="candidate-cell">{candidate.candidate_name}</td>
                                      <td className="votes-cell">{candidate.total_votes}</td>
                                      <td className="percentage-cell">
                                        <div className="percentage-bar-container">
                                          <div className="percentage-bar" style={{ width: `${candidate.vote_percentage}%` }}></div>
                                          <span className="percentage-text">{candidate.vote_percentage}%</span>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* NOTIFICATION MODAL */}
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={closeNotification}
        title={notification.title}
        message={notification.message}
        type={notification.type}
      />
    </div>
  );
}
