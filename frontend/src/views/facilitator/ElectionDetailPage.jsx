import React, { useEffect, useState } from 'react';

import {
  GraduationCap,
  Layers3,
  ListChecks,
  Users,
  ShieldCheck,
  X,
  ArrowLeft,
  BarChart3,
  Trophy,
  TrendingUp,
  UserX,
  Calendar,
  Clock,
  Loader2,
  Play,
  Square,
  Vote as VoteIcon,
  Check,
  CheckCircle2
} from 'lucide-react';

import apiClient from '../../api/apiClient.js';
import { authStore } from '../../state/authStore.js';
import NotificationModal from '../../components/ui/NotificationModal.jsx';
import {
  getElection,
  startElection,
  endElection,
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
  getElectionResults,
  getVotingBallot,
  submitVote
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

  // Voting state for students
  const [votingBallot, setVotingBallot] = useState(null);
  const [showVotingModal, setShowVotingModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedVotes, setSelectedVotes] = useState({});
  const [submittingVote, setSubmittingVote] = useState(false);
  const [lifecycleConfirm, setLifecycleConfirm] = useState(null);
  const [updatingLifecycle, setUpdatingLifecycle] = useState(false);

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

  const getErrorMessage = (error, fallback) => {
    const data = error?.response?.data;
    if (typeof data === 'string') return data;
    if (data?.detail) return data.detail;
    if (data?.message) return data.message;
    if (Array.isArray(data?.non_field_errors)) return data.non_field_errors.join('\n');
    if (data && typeof data === 'object') {
      return Object.entries(data)
        .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
        .join('\n');
    }
    return error?.message || fallback;
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

  // Voting functions for students
  async function loadVotingBallot() {
    try {
      const data = await getVotingBallot(electionId);
      setVotingBallot(data || []);
      return data || [];
    } catch (error) {
      console.error('Error loading voting ballot:', error);
      showNotification('Unable to Load Ballot', getErrorMessage(error, 'Please try again later.'), 'error');
      return null;
    }
  }

  const getSelectedForPosition = (positionId) => selectedVotes[positionId] || [];

  const toggleCandidateSelection = (position, candidateId) => {
    const positionId = position.id;
    const seatCount = Number(position.seat_count) || 1;
    const currentSelections = getSelectedForPosition(positionId);
    const isSelected = currentSelections.includes(candidateId);

    if (seatCount === 1) {
      setSelectedVotes((current) => ({ ...current, [positionId]: [candidateId] }));
      return;
    }

    if (isSelected) {
      setSelectedVotes((current) => ({
        ...current,
        [positionId]: (current[positionId] || []).filter((id) => id !== candidateId)
      }));
      return;
    }

    if (currentSelections.length >= seatCount) {
      showNotification(
        'Selection Limit Reached',
        `${position.title} allows ${seatCount} selection${seatCount > 1 ? 's' : ''}.`,
        'warning'
      );
      return;
    }

    setSelectedVotes((current) => ({
      ...current,
      [positionId]: [...(current[positionId] || []), candidateId]
    }));
  };

  const handleVoteNow = async () => {
    if (details?.has_voted) {
      showNotification('Vote Submitted', 'You have already voted in this election.', 'success');
      return;
    }

    if (!isActive) {
      showNotification(
        isEnded ? 'Election Ended' : 'Voting Not Started',
        isEnded ? 'This election has ended.' : 'Voting has not started yet.',
        isEnded ? 'info' : 'warning'
      );
      return;
    }

    const ballot = votingBallot?.length ? votingBallot : await loadVotingBallot();
    if (!ballot) return;

    if (ballot.length > 0) {
      setShowVotingModal(true);
    } else {
      showNotification('No Candidates', 'No candidates available for this election.', 'warning');
    }
  };

  const handleVoteSubmit = async (e) => {
    e.preventDefault();
    if (!isActive || details?.has_voted) {
      showNotification(
        details?.has_voted ? 'Vote Submitted' : 'Voting Unavailable',
        details?.has_voted ? 'You have already voted in this election.' : 'Students can only vote while the election is active.',
        details?.has_voted ? 'success' : 'warning'
      );
      return;
    }
    
    const validationErrors = [];
    votingBallot.forEach((position) => {
      const seatCount = Number(position.seat_count) || 1;
      const selectedCount = getSelectedForPosition(position.id).length;

      if (selectedCount !== seatCount) {
        validationErrors.push(`${position.title}: choose ${seatCount} candidate${seatCount > 1 ? 's' : ''}.`);
      }
    });

    if (validationErrors.length > 0) {
      showNotification('Incomplete Ballot', validationErrors.join('\n'), 'warning');
      return;
    }

    setShowConfirmModal(true);
  };

  const handleConfirmVote = async () => {
    setShowConfirmModal(false);
    setSubmittingVote(true);

    try {
      const voteItems = Object.values(selectedVotes)
        .flat()
        .map((candidateId) => ({ candidate: parseInt(candidateId) }));

      await submitVote(electionId, { vote_items: voteItems });
      setShowSuccessModal(true);
      setShowVotingModal(false);
      setSelectedVotes({});
      
      await loadElectionDetails();
    } catch (error) {
      console.error('Error submitting vote:', error);
      showNotification('Unable to Submit Vote', getErrorMessage(error, 'Please try again later.'), 'error');
    } finally {
      setSubmittingVote(false);
    }
  };

  const openLifecycleConfirm = (action) => {
    setLifecycleConfirm(action);
  };

  const handleLifecycleAction = async () => {
    const action = lifecycleConfirm;
    if (!action) return;

    setUpdatingLifecycle(true);
    try {
      if (action === 'start') {
        await startElection(electionId);
        showNotification('Election Started', 'The election is now active.', 'success');
      } else {
        await endElection(electionId);
        showNotification('Election Ended', 'The election has been finalized.', 'success');
      }
      setLifecycleConfirm(null);
      await loadElectionDetails();
    } catch (error) {
      console.error(`Error ${action === 'start' ? 'starting' : 'ending'} election:`, error);
      showNotification(
        action === 'start' ? 'Unable to Start Election' : 'Unable to End Election',
        getErrorMessage(error, action === 'start' ? 'Please try starting the election again.' : 'Please try ending the election again.'),
        'error'
      );
    } finally {
      setUpdatingLifecycle(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="empty-state">Loading election data...</div>
      </div>
    );
  }

  const isEditable = details?.status?.toUpperCase() === 'DRAFTED';
  const isEnded = details?.status?.toUpperCase() === 'ENDED';
  const isActive = details?.status?.toUpperCase() === 'ACTIVE' || details?.status?.toUpperCase() === 'ENABLED';
  const canStudentVote = isStudent && isActive && details?.has_voted === false;

  return (
    <div className="page-container">
      <button onClick={onBack} className="election-back-link">
        <ArrowLeft size={18} />
        Back to Elections
      </button>

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

      {/* ELECTION SCHEDULE CARD */}
      {details && (
        <div className="election-schedule-card">
          <div className="schedule-header">
            <div>
              <h2>{details.name}</h2>
              <div className="schedule-status-row">
                <div className={`election-status-badge ${details.status?.toUpperCase() === 'DRAFTED' ? 'status-drafted' : details.status?.toUpperCase() === 'ACTIVE' || details.status?.toUpperCase() === 'ENABLED' ? 'status-enabled' : 'status-ended'}`}>
                  {details.status?.toUpperCase() || details.status}
                </div>
                {isEnded && !isStudent && (
                  <div className="election-completed-badge">
                    <CheckCircle2 size={14} />
                    Election Completed
                  </div>
                )}
              </div>
            </div>
            {!isStudent && (
              <div className="election-lifecycle-actions">
                {isEditable && (
                  <>
                    <button
                      className="workspace-secondary-btn"
                      onClick={() => {/* TODO: Implement update schedule modal */}}
                    >
                      <Calendar size={16} />
                      Update Schedule
                    </button>
                    <button
                      className="workspace-success-btn"
                      onClick={() => openLifecycleConfirm('start')}
                      disabled={updatingLifecycle}
                    >
                      <Play size={16} />
                      Start Election
                    </button>
                  </>
                )}
                {isActive && (
                  <button
                    className="workspace-danger-btn"
                    onClick={() => openLifecycleConfirm('end')}
                    disabled={updatingLifecycle}
                  >
                    <Square size={16} />
                    End Election
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="schedule-details">
            <div className="schedule-item">
              <Calendar size={18} />
              <div>
                <span className="schedule-label">Starts</span>
                <span className="schedule-value">
                  {details.start_datetime ? new Date(details.start_datetime).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : 'Not set'}
                </span>
              </div>
            </div>
            <div className="schedule-item">
              <Clock size={18} />
              <div>
                <span className="schedule-label">Ends</span>
                <span className="schedule-value">
                  {details.end_datetime ? new Date(details.end_datetime).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : 'Not set'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STATUS LOCK MESSAGE */}
      {!isStudent && !isEditable && (
        <div className={`status-banner ${isEnded ? 'error' : 'info'}`}>
          {isEnded ? (
            <>
              <X size={18} />
              <span>This election has ended and can no longer be modified.</span>
            </>
          ) : (
            <>
              <ShieldCheck size={18} />
              <span>This election is active. Configuration is locked.</span>
            </>
          )}
        </div>
      )}

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
              {!isStudent && isEditable && (
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
                    {!isStudent && isEditable && (
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
              {!isStudent && isEditable && (
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
                    {!isStudent && isEditable && (
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
              {!isStudent && isEditable && (
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
                    {!isStudent && isEditable && (
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
              {!isStudent && isEditable && (
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
                    {!isStudent && isEditable && (
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
              {!isStudent && isEditable && (
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
                    {!isStudent && isEditable && (
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

          {/* STUDENT VOTING STATE */}
          {canStudentVote && (
            <button
              className="election-action-card"
              onClick={handleVoteNow}
            >
              <VoteIcon size={20} />
              Vote Now
            </button>
          )}

          {isStudent && isActive && details?.has_voted === true && (
            <div className="election-action-card status-success-card">
              <CheckCircle2 size={20} />
              Vote Submitted
            </div>
          )}

          {isStudent && isEditable && (
            <div className="election-action-card status-warning-card">
              <Clock size={20} />
              Voting has not started yet
            </div>
          )}

          {isStudent && isEnded && (
            <>
              <div className="election-action-card status-ended-card">
                <X size={20} />
                Election Ended
              </div>
              <button
                className="election-action-card"
                onClick={handleViewResults}
              >
                <BarChart3 size={20} />
                View Results
              </button>
            </>
          )}
        </div>
      </div>

      {/* VOTING MODAL FOR STUDENTS */}
      {showVotingModal && (
        <div className="modal-overlay" onClick={() => setShowVotingModal(false)}>
          <div className="modal-card voting-modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>Cast Your Vote</h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--muted)' }}>
                  {details?.name || 'Election'}
                </p>
              </div>
              <button onClick={() => setShowVotingModal(false)} aria-label="Close modal">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleVoteSubmit}>
              {votingBallot && votingBallot.map((position) => (
                <div key={position.id} className="voting-position-section">
                  <div className="voting-position-header">
                    <h4 className="voting-position-title">{position.title}</h4>
                    <span className="voting-position-requirement">
                      Choose {position.seat_count} candidate{position.seat_count > 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="voting-candidates-grid">
                    {position.candidates && position.candidates.length > 0 ? (
                      position.candidates.map((candidate) => {
                        const selectedForPosition = getSelectedForPosition(position.id);
                        const isSelected = selectedForPosition.includes(candidate.id);
                        const seatCount = Number(position.seat_count) || 1;
                        return (
                          <label 
                            key={candidate.id} 
                            className={`voting-candidate-card ${isSelected ? 'selected' : ''}`}
                          >
                            <input
                              type={seatCount === 1 ? 'radio' : 'checkbox'}
                              name={`position-${position.id}`}
                              value={candidate.id}
                              checked={isSelected}
                              onChange={() => toggleCandidateSelection(position, candidate.id)}
                            />
                            <div className="voting-candidate-card-content">
                              <div className="voting-candidate-avatar">
                                {candidate.student?.charAt(0) || candidate.full_name?.charAt(0) || 'C'}
                              </div>
                              <div className="voting-candidate-details">
                                <div className="voting-candidate-name">
                                  {candidate.student || candidate.full_name || 'Unknown'}
                                </div>
                                <div className="voting-candidate-fields">
                                  <div>
                                    <span>Party List</span>
                                    <strong>{candidate.partylist || 'Independent'}</strong>
                                  </div>
                                  <div>
                                    <span>Course</span>
                                    <strong>{candidate.course || 'N/A'}</strong>
                                  </div>
                                  <div>
                                    <span>Year Level</span>
                                    <strong>{candidate.year_level || 'N/A'}</strong>
                                  </div>
                                </div>
                              </div>
                              {isSelected && (
                                <div className="voting-candidate-check">
                                  <Check size={20} />
                                </div>
                              )}
                            </div>
                          </label>
                        );
                      })
                    ) : (
                      <div className="voting-no-candidates">No candidates available</div>
                    )}
                  </div>
                </div>
              ))}
              <div className="modal-actions">
                <button type="button" onClick={() => setShowVotingModal(false)}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="workspace-primary-btn"
                  disabled={submittingVote}
                >
                  {submittingVote ? 'Submitting...' : 'Submit Vote'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL */}
      {showConfirmModal && (
        <div className="modal-overlay" onClick={() => setShowConfirmModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Submit Vote?</h3>
            </div>
            <div className="modal-body">
              <p>You cannot change your vote after submission.</p>
            </div>
            <div className="modal-actions">
              <button type="button" onClick={() => setShowConfirmModal(false)}>
                Cancel
              </button>
              <button
                type="button"
                className="workspace-primary-btn"
                onClick={handleConfirmVote}
              >
                Submit Vote
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LIFECYCLE CONFIRMATION MODAL */}
      {lifecycleConfirm && (
        <div className="modal-overlay" onClick={() => !updatingLifecycle && setLifecycleConfirm(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{lifecycleConfirm === 'start' ? 'Start Election?' : 'End Election?'}</h3>
            </div>
            <div className="modal-body">
              <p>
                {lifecycleConfirm === 'start'
                  ? 'Once started, election configuration will be locked and students may begin voting.'
                  : 'This will stop all voting and finalize election results.'}
              </p>
            </div>
            <div className="modal-actions">
              <button
                type="button"
                onClick={() => setLifecycleConfirm(null)}
                disabled={updatingLifecycle}
              >
                Cancel
              </button>
              <button
                type="button"
                className={lifecycleConfirm === 'start' ? 'workspace-success-btn' : 'workspace-danger-btn'}
                onClick={handleLifecycleAction}
                disabled={updatingLifecycle}
              >
                {updatingLifecycle && <Loader2 size={16} className="button-spinner" />}
                {lifecycleConfirm === 'start' ? 'Start Election' : 'End Election'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL */}
      {showSuccessModal && (
        <div className="modal-overlay" onClick={() => setShowSuccessModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CheckCircle2 size={24} style={{ color: '#10b981' }} />
                <h3>Vote Submitted Successfully</h3>
              </div>
            </div>
            <div className="modal-body">
              <p>Your vote has been recorded.</p>
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="workspace-primary-btn"
                onClick={() => setShowSuccessModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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
          <div className="results-modal results-modal-large">
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
              ) : !results.candidate_results || results.candidate_results.length === 0 ? (
                <div className="empty-state">No analytics data available for this election.</div>
              ) : (
                <div className="results-dashboard">
                  {/* SUMMARY CARDS */}
                  <div className="results-summary-section">
                    <h4>Election Summary</h4>
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

                    {/* TURNOUT VISUALIZATION */}
                    <div className="turnout-visualization">
                      <div className="turnout-header">
                        <span className="turnout-label">Turnout</span>
                        <span className="turnout-percentage">{results.turnout_percentage || 0}%</span>
                      </div>
                      <div className="turnout-bar-container">
                        <div 
                          className="turnout-bar" 
                          style={{ width: `${results.turnout_percentage || 0}%` }}
                        ></div>
                      </div>
                      <div className="turnout-details">
                        <span>Votes Cast: {results.total_votes || 0}</span>
                        <span>Possible Votes: {results.total_possible_votes || 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* RESULTS BY POSITION */}
                  <div className="results-by-position-section">
                    <h4>Results By Position</h4>
                    {results.candidate_results.map((positionResult, idx) => (
                      <div key={idx} className="position-results-card">
                        <div className="position-card-header">
                          <h5>{positionResult.position}</h5>
                          <span className="abstained-badge">Abstained: {positionResult.abstained_votes || 0}</span>
                        </div>

                        {/* WINNER CARD */}
                        {positionResult.candidates && positionResult.candidates.length > 0 && (
                          <div className="winner-card-highlighted">
                            <div className="winner-badge-large">
                              <Trophy size={24} />
                              <span>Winner</span>
                            </div>
                            <div className="winner-info-large">
                              <h6>{positionResult.candidates[0].candidate_name}</h6>
                              <div className="winner-stats-large">
                                <span className="winner-votes-large">{positionResult.candidates[0].total_votes} Votes</span>
                                <span className="winner-percentage-large">{positionResult.candidates[0].vote_percentage}%</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* CANDIDATE RANKINGS TABLE */}
                        {positionResult.candidates && positionResult.candidates.length > 0 && (
                          <div className="rankings-table-container">
                            <h6>Full Rankings</h6>
                            <table className="rankings-table">
                              <thead>
                                <tr>
                                  <th>Rank</th>
                                  <th>Candidate</th>
                                  <th>Party List</th>
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
                                    <td className="partylist-cell">{candidate.partylist || 'Independent'}</td>
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
