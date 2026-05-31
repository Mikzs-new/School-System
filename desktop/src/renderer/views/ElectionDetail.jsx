import {
  GraduationCap,
  Layers3,
  ListChecks,
  Users,
  ShieldCheck,
  Power,
  X,
  BarChart3,
  ChevronDown,
  Search,
  Vote as VoteIcon,
  Calendar,
  Clock,
  Calendar as CalendarIcon,
} from 'lucide-react'

import { useEffect, useState } from 'react'

import api from '../api/apiClient'
import { authStore } from '../state/authStore.js'

export default function ElectionDetail({
  election,
  onBack
}) {
  const userRole = authStore.getRole()
  const isStudent = userRole === 'student'
  const [showCourseModal, setShowCourseModal] = useState(false)
  const [showYearModal, setShowYearModal] = useState(false)
  const [showPositionModal, setShowPositionModal] = useState(false)
  const [showPartylistModal, setShowPartylistModal] = useState(false)
  const [showCandidateModal, setShowCandidateModal] = useState(false)
  const [showUpdateTimeModal, setShowUpdateTimeModal] = useState(false)

  const [details, setDetails] = useState(null)
  const [loading, setLoading] = useState(true)

  // Section-specific data
  const [courses, setCourses] = useState([])
  const [yearLevels, setYearLevels] = useState([])
  const [positions, setPositions] = useState([])
  const [partylists, setPartylists] = useState([])
  const [candidates, setCandidates] = useState([])
  const [eligibleStudents, setEligibleStudents] = useState([])
  const [showEligiblePreview, setShowEligiblePreview] = useState(false)
  const [votes, setVotes] = useState([])

  // Dropdown data
  const [availableCourses, setAvailableCourses] = useState([])
  const [availablePartylists, setAvailablePartylists] = useState([])
  const [studentEnrollments, setStudentEnrollments] = useState([])
  const [studentSearchQuery, setStudentSearchQuery] = useState('')

  // Form state for modals
  const [courseForm, setCourseForm] = useState({ course: '' })
  const [yearForm, setYearForm] = useState({ year_level: '' })
  const [positionForm, setPositionForm] = useState({ title: '', seat_count: 1 })
  const [partylistForm, setPartylistForm] = useState({ partylist: '' })
  const [candidateForm, setCandidateForm] = useState({ student_enrollment: '', position: '', partylist: '' })
  const [updateTimeForm, setUpdateTimeForm] = useState({ start_datetime: '', end_datetime: '' })

  useEffect(() => {
    loadAllData()
  }, [])

  // Dedicated data loaders
  async function loadAllData() {
    setLoading(true)
    await Promise.all([
      loadElectionDetails(),
      loadCourses(),
      loadYearLevels(),
      loadPositions(),
      loadPartylists(),
      loadCandidates(),
      loadEligibleStudents(),
      loadVotes(),
      loadDropdownData()
    ])
    setLoading(false)
  }

  async function loadElectionDetails() {
    try {
      const response = await api.get(`/api/v1/election/elections/${election.id}/`)
      setDetails(response.data)
    } catch (error) {
      console.error('Error loading election details:', error)
    }
  }

  async function loadCourses() {
    try {
      const response = await api.get(`/api/v1/election/elections/${election.id}/courses/`)
      setCourses(response.data || [])
    } catch (error) {
      console.error('Error loading courses:', error)
    }
  }

  async function loadYearLevels() {
    try {
      const response = await api.get(`/api/v1/election/elections/${election.id}/year_levels/`)
      setYearLevels(response.data || [])
    } catch (error) {
      console.error('Error loading year levels:', error)
    }
  }

  async function loadPositions() {
    try {
      const response = await api.get(`/api/v1/election/elections/${election.id}/positions/`)
      setPositions(response.data || [])
    } catch (error) {
      console.error('Error loading positions:', error)
    }
  }

  async function loadPartylists() {
    try {
      const response = await api.get(`/api/v1/election/elections/${election.id}/partylists/`)
      setPartylists(response.data || [])
    } catch (error) {
      console.error('Error loading partylists:', error)
    }
  }

  async function loadCandidates() {
    try {
      const response = await api.get(`/api/v1/election/elections/${election.id}/candidates/`)
      setCandidates(response.data || [])
    } catch (error) {
      console.error('Error loading candidates:', error)
    }
  }

  async function loadEligibleStudents() {
    if (isStudent) return
    try {
      const response = await api.get(`/api/v1/election/elections/${election.id}/students/`)
      setEligibleStudents(response.data || [])
    } catch (error) {
      console.error('Error loading eligible students:', error)
    }
  }

  async function loadVotes() {
    if (isStudent) return
    try {
      const response = await api.get(`/api/v1/election/elections/${election.id}/vote/`)
      setVotes(response.data || [])
    } catch (error) {
      console.error('Error loading votes:', error)
    }
  }

  async function loadDropdownData() {
    if (isStudent) return
    try {
      const [coursesRes, partylistsRes, enrollmentsRes] = await Promise.all([
        api.get('/api/v1/school/courses/'),
        api.get('/api/v1/election/partylists/'),
        api.get('/api/v1/student/enrollment/')
      ])
      setAvailableCourses(coursesRes.data || [])
      setAvailablePartylists(partylistsRes.data || [])
      setStudentEnrollments(enrollmentsRes.data || [])
    } catch (error) {
      console.error('Error loading dropdown data:', error)
    }
  }

  // Load voting ballot (for students)
  const [votingBallot, setVotingBallot] = useState(null)
  const [showVotingModal, setShowVotingModal] = useState(false)
  const [selectedVotes, setSelectedVotes] = useState({})
  const [submittingVote, setSubmittingVote] = useState(false)

  const loadVotingBallot = async () => {
    try {
      const response = await api.get(`/api/v1/election/elections/${election.id}/vote/`)
      setVotingBallot(response.data || [])
    } catch (error) {
      console.error('Error loading voting ballot:', error)
    }
  }

  const handleVoteNow = () => {
    loadVotingBallot()
    setShowVotingModal(true)
  }

  const handleVoteSubmit = async (e) => {
    e.preventDefault()
    setSubmittingVote(true)

    try {
      const voteItems = Object.entries(selectedVotes).map(([positionId, candidateId]) => ({
<<<<<<< HEAD
        candidate: candidateId
=======
        candidate: parseInt(candidateId)
>>>>>>> a3df293d4593471b5b23b54526cd622c30cc3e98
      }))

      await api.post(`/api/v1/election/elections/${election.id}/vote/`, {
        vote_items: voteItems
      })

      setShowVotingModal(false)
      setSelectedVotes({})
      alert('Vote submitted successfully!')
    } catch (error) {
      console.error('Error submitting vote:', error)
<<<<<<< HEAD
      alert(error.response?.data || 'Failed to submit vote')
=======
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.non_field_errors?.[0] ||
                          error.response?.data || 
                          'Failed to submit vote'
      alert(errorMessage)
>>>>>>> a3df293d4593471b5b23b54526cd622c30cc3e98
    } finally {
      setSubmittingVote(false)
    }
  }

  const handleLaunchElection = async () => {
    if (!confirm('Are you sure you want to launch this election?')) return

    try {
      await api.post(`/api/v1/election/elections/${election.id}/start_election/`)
      alert('Election launched successfully!')
      loadElectionDetails()
    } catch (error) {
      console.error('Error launching election:', error)
      alert(error.response?.data || 'Failed to launch election')
    }
  }

  async function endElection() {
    try {
<<<<<<< HEAD
      await api.patch(`/api/v1/election/elections/${election.id}/`, {
        status: 'ended'
      })
=======
      await api.post(`/api/v1/election/elections/${election.id}/end_election/`)
>>>>>>> a3df293d4593471b5b23b54526cd622c30cc3e98
      alert('Election ended successfully')
      loadElectionDetails()
    } catch (error) {
      console.error(error)
      alert(error?.response?.data?.detail || 'Failed to end election')
    }
  }

<<<<<<< HEAD
=======
  async function handleViewResults() {
    try {
      const response = await api.get(`/api/v1/election/elections/${election.id}/results/`)
      alert(JSON.stringify(response.data, null, 2))
    } catch (error) {
      console.error(error)
      alert(error?.response?.data?.detail || 'Failed to load results')
    }
  }

>>>>>>> a3df293d4593471b5b23b54526cd622c30cc3e98
  async function handleUpdateTime(e) {
    e.preventDefault()
    
    // Frontend validation
    const start = new Date(updateTimeForm.start_datetime)
    const end = new Date(updateTimeForm.end_datetime)
    
    if (end <= start) {
      alert('End date must be after start date')
      return
    }
    
    try {
<<<<<<< HEAD
      await api.patch(`/api/v1/election/elections/${election.id}/update_time/`, {
        start_datetime: updateTimeForm.start_datetime,
        end_datetime: updateTimeForm.end_datetime
=======
      // Convert local datetime to ISO string for backend (preserving local time)
      const formatToISO = (localDateTime) => {
        if (!localDateTime) return null
        const date = new Date(localDateTime)
        // Get the date components in local timezone
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        // Return ISO string without timezone conversion
        return `${year}-${month}-${day}T${hours}:${minutes}:00`
      }
      
      await api.patch(`/api/v1/election/elections/${election.id}/update_time/`, {
        start_datetime: formatToISO(updateTimeForm.start_datetime),
        end_datetime: formatToISO(updateTimeForm.end_datetime)
>>>>>>> a3df293d4593471b5b23b54526cd622c30cc3e98
      })
      alert('Election schedule updated successfully')
      setShowUpdateTimeModal(false)
      loadElectionDetails()
    } catch (error) {
      console.error(error)
      const errorMessage = error?.response?.data?.detail || error?.response?.data?.message || error?.message || 'Failed to update schedule'
      alert(errorMessage)
    }
  }

  function openUpdateTimeModal() {
    if (details) {
<<<<<<< HEAD
      setUpdateTimeForm({
        start_datetime: details.start_datetime || '',
        end_datetime: details.end_datetime || ''
=======
      // Convert UTC datetime to local datetime-local format
      const formatToLocalDateTime = (utcString) => {
        if (!utcString) return ''
        const date = new Date(utcString)
        // Format as YYYY-MM-DDTHH:MM for datetime-local input (preserving local time)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        return `${year}-${month}-${day}T${hours}:${minutes}`
      }
      
      setUpdateTimeForm({
        start_datetime: formatToLocalDateTime(details.start_datetime),
        end_datetime: formatToLocalDateTime(details.end_datetime)
>>>>>>> a3df293d4593471b5b23b54526cd622c30cc3e98
      })
    }
    setShowUpdateTimeModal(true)
  }

  // API save handlers
  async function handleAddCourse(e) {
    e.preventDefault()
    try {
      const payload = { course: parseInt(courseForm.course) }
      await api.post(`/api/v1/election/elections/${election.id}/courses/`, payload)
      alert('Course added successfully')
      setShowCourseModal(false)
      setCourseForm({ course: '' })
      loadCourses()
      loadElectionDetails()
    } catch (error) {
      console.error(error)
      alert(error?.response?.data?.detail || 'Failed to add course')
    }
  }

  async function handleAddYearLevel(e) {
    e.preventDefault()
    try {
      const payload = { year_level: parseInt(yearForm.year_level) }
      await api.post(`/api/v1/election/elections/${election.id}/year_levels/`, payload)
      alert('Year level added successfully')
      setShowYearModal(false)
      setYearForm({ year_level: '' })
      loadYearLevels()
      loadElectionDetails()
    } catch (error) {
      console.error(error)
      alert(error?.response?.data?.detail || 'Failed to add year level')
    }
  }

  async function handleAddPosition(e) {
    e.preventDefault()
    try {
      const payload = { title: positionForm.title, seat_count: parseInt(positionForm.seat_count) }
      await api.post(`/api/v1/election/elections/${election.id}/positions/`, payload)
      alert('Position added successfully')
      setShowPositionModal(false)
      setPositionForm({ title: '', seat_count: 1 })
      loadPositions()
      loadElectionDetails()
    } catch (error) {
      console.error(error)
      alert(error?.response?.data?.detail || 'Failed to add position')
    }
  }

  async function handleAddPartylist(e) {
    e.preventDefault()
    try {
      const payload = { partylist: parseInt(partylistForm.partylist) }
      await api.post(`/api/v1/election/elections/${election.id}/partylists/`, payload)
      alert('Partylist added successfully')
      setShowPartylistModal(false)
      setPartylistForm({ partylist: '' })
      loadPartylists()
      loadElectionDetails()
    } catch (error) {
      console.error(error)
      alert(error?.response?.data?.detail || 'Failed to add partylist')
    }
  }

  async function handleAddCandidate(e) {
    e.preventDefault()
    try {
      const payload = {
        student_enrollment: parseInt(candidateForm.student_enrollment),
        position: parseInt(candidateForm.position),
        partylist: candidateForm.partylist ? parseInt(candidateForm.partylist) : null
      }
      await api.post(`/api/v1/election/elections/${election.id}/candidates/`, payload)
      alert('Candidate added successfully')
      setShowCandidateModal(false)
      setCandidateForm({ student_enrollment: '', position: '', partylist: '' })
      setStudentSearchQuery('')
      loadCandidates()
      loadElectionDetails()
    } catch (error) {
      console.error(error)
      const errorMessage = error.message || error.response?.data?.detail || error.response?.data?.error || error.response?.data || 'Failed to add candidate'
      alert(errorMessage)
    }
  }

  // API delete handlers
  async function handleRemoveCourse(itemId) {
    if (!confirm('Are you sure you want to remove this course?')) return
    try {
      await api.delete(`/api/v1/election/elections/${election.id}/courses/${itemId}/`)
      alert('Course removed successfully')
      loadCourses()
      loadElectionDetails()
    } catch (error) {
      console.error(error)
      alert('Failed to remove course')
    }
  }

  async function handleRemoveYearLevel(itemId) {
    if (!confirm('Are you sure you want to remove this year level?')) return
    try {
      await api.delete(`/api/v1/election/elections/${election.id}/year_levels/${itemId}/`)
      alert('Year level removed successfully')
      loadYearLevels()
      loadElectionDetails()
    } catch (error) {
      console.error(error)
      alert('Failed to remove year level')
    }
  }

  async function handleRemovePosition(itemId) {
    if (!confirm('Are you sure you want to remove this position?')) return
    try {
      await api.delete(`/api/v1/election/elections/${election.id}/positions/${itemId}/`)
      alert('Position removed successfully')
      loadPositions()
      loadElectionDetails()
    } catch (error) {
      console.error(error)
      alert('Failed to remove position')
    }
  }

  async function handleRemovePartylist(itemId) {
    if (!confirm('Are you sure you want to remove this partylist?')) return
    try {
      await api.delete(`/api/v1/election/elections/${election.id}/partylists/${itemId}/`)
      alert('Partylist removed successfully')
      loadPartylists()
      loadElectionDetails()
    } catch (error) {
      console.error(error)
      alert('Failed to remove partylist')
    }
  }

  async function handleRemoveCandidate(itemId) {
    if (!confirm('Are you sure you want to remove this candidate?')) return
    try {
      await api.delete(`/api/v1/election/elections/${election.id}/candidates/${itemId}/`)
      alert('Candidate removed successfully')
      loadCandidates()
      loadElectionDetails()
    } catch (error) {
      console.error(error)
      alert('Failed to remove candidate')
    }
  }

  // Filter students based on search query
  const filteredStudents = studentEnrollments.filter(enrollment => {
    const searchLower = studentSearchQuery.toLowerCase()
    const fullName = enrollment.student?.full_name?.toLowerCase() || ''
    return fullName.includes(searchLower)
  })

  // Calculate turnout
  const totalEligible = eligibleStudents.length || 0
  const votesCast = Array.isArray(votes) ? votes.length : 0
  const turnoutPercentage = totalEligible > 0 ? ((votesCast / totalEligible) * 100).toFixed(1) : 0


  return (

    <div className="page-stack">

      <div className="page-header">

        <div>

          <h1>
            {details?.name || election.name}
          </h1>

          <p>
            Election configuration workspace
          </p>

        </div>

        <button
          className="workspace-secondary-btn"
          onClick={onBack}
        >
          Back
        </button>

      </div>

      {/* ELECTION SCHEDULE CARD */}
      {details && (
        <div className="election-schedule-card">
          <div className="schedule-header">
            <div>
              <h2>{details.name}</h2>
              <div className={`election-status-badge ${details.status?.toUpperCase() === 'DRAFTED' ? 'status-drafted' : details.status?.toUpperCase() === 'ENABLED' ? 'status-enabled' : 'status-ended'}`}>
                {details.status?.toUpperCase() || details.status}
              </div>
            </div>
            {!isStudent && details.status?.toUpperCase() === 'DRAFTED' && (
              <button
                className="workspace-secondary-btn"
                onClick={openUpdateTimeModal}
              >
                <CalendarIcon size={16} />
                Update Schedule
              </button>
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

      {loading ? (

        <div className="empty-state">
          Loading election data...
        </div>

      ) : (

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

                  <div className="empty-state">
                    No allowed courses
                  </div>

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

                  <div className="empty-state">
                    No year levels
                  </div>

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

                  <div className="empty-state">
                    No positions
                  </div>

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
                  <h3>Partylists</h3>
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
                      <span>{party.partylist?.name || party.initials || 'Unknown Partylist'}</span>
                      {!isStudent && (
                        <button
                          className="config-item-remove"
                          onClick={() => handleRemovePartylist(party.id)}
                          aria-label={`Remove ${party.partylist?.name || 'partylist'}`}
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))

                ) : (

                  <div className="empty-state">
                    No partylists
                  </div>

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

                  <div className="empty-state">
                    No candidates
                  </div>

                )}

              </div>

            </div>

            {/* ELIGIBLE VOTERS */}
            {!isStudent && (
              <div className="config-card">
                <div className="config-title">
                  <div className="config-title-left">
                    <Users size={18} />
                    <h3>Eligible Voters</h3>
                  </div>
                  <button
                    className="workspace-secondary-btn"
                    onClick={() => setShowEligiblePreview(!showEligiblePreview)}
                  >
                    {showEligiblePreview ? 'Hide' : 'Preview'}
                  </button>
                </div>
                <div className="config-list">
                  <button className="config-item">
                    Eligible Students: {totalEligible}
                  </button>
                  {showEligiblePreview && eligibleStudents.length > 0 && (
                    <div className="eligible-preview">
                      {eligibleStudents.map((student) => (
                        <div key={student.id} className="eligible-student-item">
                          <div className="student-name">{student.full_name}</div>
                          <div className="student-details">{student.course} — Year {student.year_level}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* VOTES */}
            {!isStudent && (
              <div className="config-card">
                <div className="config-title">
                  <div className="config-title-left">
                    <BarChart3 size={18} />
                    <h3>Votes</h3>
                  </div>
                </div>
                <div className="config-list">
                  <button className="config-item">
                    Eligible Voters: {totalEligible}
                  </button>
                  <button className="config-item">
                    Votes Cast: {votesCast}
                  </button>
                  <button className="config-item">
                    Turnout: {turnoutPercentage}%
                  </button>
                </div>
              </div>
            )}

            {/* ELECTION ACTIONS */}
            {!isStudent && (
              <div className="election-actions-row">
                {details?.status?.toUpperCase() === 'DRAFTED' && (
                  <button
                    className="election-action-card"
                    onClick={handleLaunchElection}
                  >
                    <Power size={20} />
                    Launch Election
                  </button>
                )}
<<<<<<< HEAD
                {details?.status?.toUpperCase() === 'ENABLED' && (
=======
                {details?.status?.toUpperCase() === 'ACTIVE' && (
>>>>>>> a3df293d4593471b5b23b54526cd622c30cc3e98
                  <button
                    className="election-action-card danger"
                    onClick={endElection}
                  >
                    <Power size={20} />
                    End Election
                  </button>
                )}
<<<<<<< HEAD
=======
                {details?.status?.toUpperCase() === 'ENDED' && (
                  <button
                    className="election-action-card"
                    onClick={handleViewResults}
                  >
                    <BarChart3 size={20} />
                    View Results
                  </button>
                )}
>>>>>>> a3df293d4593471b5b23b54526cd622c30cc3e98
              </div>
            )}

            {/* VOTE NOW */}
            {isStudent && (
              <button
                className="election-action-card"
                onClick={handleVoteNow}
              >
                <VoteIcon size={20} />
                Vote Now
              </button>
            )}

          </div>

        </div>

      )}

      {/* VOTING MODAL */}
      {showVotingModal && (
        <div className="modal-overlay" onClick={() => setShowVotingModal(false)}>
          <div className="modal-card voting-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Cast Your Vote</h3>
              <button onClick={() => setShowVotingModal(false)} aria-label="Close modal">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleVoteSubmit}>
              {votingBallot && votingBallot.map((position) => (
                <div key={position.id} className="voting-position-section">
                  <h4 className="voting-position-title">{position.title}</h4>
                  <div className="voting-candidates-list">
                    {position.candidates && position.candidates.length > 0 ? (
                      position.candidates.map((candidate) => (
                        <label key={candidate.id} className="voting-candidate-item">
                          <input
                            type="radio"
                            name={`position-${position.id}`}
                            value={candidate.id}
                            checked={selectedVotes[position.id] === candidate.id}
                            onChange={(e) => setSelectedVotes({
                              ...selectedVotes,
                              [position.id]: parseInt(e.target.value)
                            })}
                            required
                          />
                          <span className="voting-candidate-info">
                            <span className="voting-candidate-name">
                              {candidate.student || candidate.student_enrollment?.student?.full_name || 'Unknown'}
                              {candidate.partylist && ` (${candidate.partylist})`}
                            </span>
                          </span>
                        </label>
                      ))
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

      {/* MODALS */}
      {showCourseModal && (
        <div className="modal-overlay" onClick={() => setShowCourseModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Allowed Course</h3>
              <button onClick={() => setShowCourseModal(false)} aria-label="Close modal">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddCourse}>
              <div className="form-group">
                <label>Course</label>
                <select
                  value={courseForm.course}
                  onChange={(e) => setCourseForm({ ...courseForm, course: e.target.value })}
                  required
                >
                  <option value="">Select Course</option>
                  {availableCourses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowCourseModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="workspace-primary-btn">
                  Add Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showYearModal && (
        <div className="modal-overlay" onClick={() => setShowYearModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Year Level</h3>
              <button onClick={() => setShowYearModal(false)} aria-label="Close modal">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddYearLevel}>
              <div className="form-group">
                <label>Year Level</label>
                <input
                  type="number"
                  value={yearForm.year_level}
                  onChange={(e) => setYearForm({ ...yearForm, year_level: e.target.value })}
                  placeholder="Enter year level (1-5)"
                  min="1"
                  max="5"
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowYearModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="workspace-primary-btn">
                  Add Year Level
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPositionModal && (
        <div className="modal-overlay" onClick={() => setShowPositionModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Position</h3>
              <button onClick={() => setShowPositionModal(false)} aria-label="Close modal">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddPosition}>
              <div className="form-group">
                <label>Position Title</label>
                <input
                  type="text"
                  value={positionForm.title}
                  onChange={(e) => setPositionForm({ ...positionForm, title: e.target.value })}
                  placeholder="Enter position title"
                  required
                />
              </div>
              <div className="form-group">
                <label>Seat Count</label>
                <input
                  type="number"
                  value={positionForm.seat_count}
                  onChange={(e) => setPositionForm({ ...positionForm, seat_count: parseInt(e.target.value) || 1 })}
                  placeholder="Number of seats"
                  min="1"
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowPositionModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="workspace-primary-btn">
                  Add Position
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPartylistModal && (
        <div className="modal-overlay" onClick={() => setShowPartylistModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Partylist</h3>
              <button onClick={() => setShowPartylistModal(false)} aria-label="Close modal">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddPartylist}>
              <div className="form-group">
                <label>Partylist</label>
                <select
                  value={partylistForm.partylist}
                  onChange={(e) => setPartylistForm({ ...partylistForm, partylist: e.target.value })}
                  required
                >
                  <option value="">Select Partylist</option>
                  {availablePartylists.map((party) => (
                    <option key={party.id} value={party.id}>
                      {party.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowPartylistModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="workspace-primary-btn">
                  Add Partylist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCandidateModal && (
        <div className="modal-overlay" onClick={() => setShowCandidateModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Candidate</h3>
              <button onClick={() => setShowCandidateModal(false)} aria-label="Close modal">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddCandidate}>
              <div className="form-group">
                <label>Student</label>
                <div className="searchable-select">
                  <div className="search-input-wrapper">
                    <Search size={16} />
                    <input
                      type="text"
                      value={studentSearchQuery}
                      onChange={(e) => setStudentSearchQuery(e.target.value)}
                      placeholder="Search student name..."
                      className="search-input"
                    />
                  </div>
                  <select
                    value={candidateForm.student_enrollment}
                    onChange={(e) => setCandidateForm({ ...candidateForm, student_enrollment: e.target.value })}
                    required
                  >
                    <option value="">Select Student</option>
                    {filteredStudents.map((enrollment) => (
                      <option key={enrollment.id} value={enrollment.id}>
                        {enrollment.student?.full_name || enrollment.student?.username || 'Unknown'} - {enrollment.course?.name || enrollment.course || 'N/A'} (Year {enrollment.year_level || 'N/A'})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Position</label>
                <select
                  value={candidateForm.position}
                  onChange={(e) => setCandidateForm({ ...candidateForm, position: e.target.value })}
                  required
                >
                  <option value="">Select Position</option>
                  {positions.map((position) => (
                    <option key={position.id} value={position.id}>
                      {position.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Partylist (Optional)</label>
                <select
                  value={candidateForm.partylist}
                  onChange={(e) => setCandidateForm({ ...candidateForm, partylist: e.target.value })}
                >
                  <option value="">No Partylist (Independent)</option>
                  {partylists.map((party) => (
                    <option key={party.id} value={party.id}>
                      {party.partylist}
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowCandidateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="workspace-primary-btn">
                  Add Candidate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UPDATE TIME MODAL */}
      {showUpdateTimeModal && (
        <div className="modal-overlay" onClick={() => setShowUpdateTimeModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Update Election Schedule</h3>
              <button onClick={() => setShowUpdateTimeModal(false)} aria-label="Close modal">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdateTime}>
              <div className="form-group">
                <label>Start Date & Time *</label>
                <input
                  type="datetime-local"
                  value={updateTimeForm.start_datetime}
                  onChange={(e) => setUpdateTimeForm({ ...updateTimeForm, start_datetime: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>End Date & Time *</label>
                <input
                  type="datetime-local"
                  value={updateTimeForm.end_datetime}
                  onChange={(e) => setUpdateTimeForm({ ...updateTimeForm, end_datetime: e.target.value })}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowUpdateTimeModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="workspace-primary-btn">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}