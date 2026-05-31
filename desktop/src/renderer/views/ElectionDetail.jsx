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
  const currentUser = authStore.getState().user
  const isStudent = userRole === 'student'
  
  // Global debugging
  console.log('Current User:', currentUser)
  console.log('Current Role:', userRole)
  console.log('Is Student:', isStudent)
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
      const url = `/api/v1/election/elections/${election.id}/`
      console.log('Request:', url)
      const response = await api.get(url)
      console.log('Election Detail Response:', response.data)
      console.log('Election Status:', response.data.status)
      console.log('User Role:', currentUser?.role)
      setDetails(response.data)
    } catch (error) {
      console.error('API Error:', error.response?.data)
    }
  }

  async function loadCourses() {
    try {
      const url = `/api/v1/election/elections/${election.id}/courses/`
      console.log('Request:', url)
      const response = await api.get(url)
      console.log('Response:', response.data)
      setCourses(response.data || [])
    } catch (error) {
      console.error('API Error:', error.response?.data)
    }
  }

  async function loadYearLevels() {
    try {
      const url = `/api/v1/election/elections/${election.id}/year_levels/`
      console.log('Request:', url)
      const response = await api.get(url)
      console.log('Response:', response.data)
      setYearLevels(response.data || [])
    } catch (error) {
      console.error('API Error:', error.response?.data)
    }
  }

  async function loadPositions() {
    try {
      const url = `/api/v1/election/elections/${election.id}/positions/`
      console.log('Request:', url)
      const response = await api.get(url)
      console.log('Response:', response.data)
      setPositions(response.data || [])
    } catch (error) {
      console.error('API Error:', error.response?.data)
    }
  }

  async function loadPartylists() {
    try {
      const url = `/api/v1/election/elections/${election.id}/partylists/`
      console.log('Request:', url)
      const response = await api.get(url)
      console.log('Response:', response.data)
      setPartylists(response.data || [])
    } catch (error) {
      console.error('API Error:', error.response?.data)
    }
  }

  async function loadCandidates() {
    try {
      const url = `/api/v1/election/elections/${election.id}/candidates/`
      console.log('Request:', url)
      const response = await api.get(url)
      console.log('Response:', response.data)
      setCandidates(response.data || [])
    } catch (error) {
      console.error('API Error:', error.response?.data)
    }
  }

  async function loadEligibleStudents() {
    if (isStudent) return
    try {
      const url = `/api/v1/election/elections/${election.id}/students/`
      console.log('Load Eligible Students - Request:', url)
      const response = await api.get(url)
      console.log('Load Eligible Students - Response:', response.data)
      console.log('Load Eligible Students - Count:', response.data?.length || 0)
      setEligibleStudents(response.data || [])
    } catch (error) {
      console.error('Load Eligible Students - API Error:', error.response?.data)
      alert(JSON.stringify(error.response?.data, null, 2))
    }
  }

  async function loadVotes() {
    if (isStudent) return
    try {
      const url = `/api/v1/election/elections/${election.id}/vote/`
      console.log('Request:', url)
      const response = await api.get(url)
      console.log('Response:', response.data)
      setVotes(response.data || [])
    } catch (error) {
      console.error('API Error:', error.response?.data)
    }
  }

  async function loadDropdownData() {
    if (isStudent) return
    try {
      const coursesUrl = '/api/v1/school/courses/'
      const partylistsUrl = '/api/v1/election/partylists/'
      const studentsUrl = `/api/v1/election/elections/${election.id}/students/`
      
      console.log('Request:', coursesUrl)
      console.log('Request:', partylistsUrl)
      console.log('Request:', studentsUrl)
      
      const [coursesRes, partylistsRes, studentsRes] = await Promise.all([
        api.get(coursesUrl),
        api.get(partylistsUrl),
        api.get(studentsUrl)
      ])
      
      console.log('Response:', coursesRes.data)
      console.log('Response:', partylistsRes.data)
      console.log('Response:', studentsRes.data)
      
      setAvailableCourses(coursesRes.data || [])
      setAvailablePartylists(partylistsRes.data || [])
      
      // Check if students data is valid
      if (studentsRes.data && Array.isArray(studentsRes.data)) {
        setStudentEnrollments(studentsRes.data)
        console.log('Students loaded:', studentsRes.data.length)
      } else {
        console.warn('Students endpoint returned invalid data:', studentsRes.data)
        // Fallback to enrollment endpoint if students endpoint fails
        try {
          console.log('Falling back to enrollment endpoint')
          const enrollmentsUrl = '/api/v1/student/enrollment/'
          console.log('Request:', enrollmentsUrl)
          const enrollmentsRes = await api.get(enrollmentsUrl)
          console.log('Response:', enrollmentsRes.data)
          setStudentEnrollments(enrollmentsRes.data || [])
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError.response?.data)
          setStudentEnrollments([])
        }
      }
    } catch (error) {
      console.error('API Error:', error.response?.data)
      alert('Failed to load dropdown data: ' + JSON.stringify(error.response?.data, null, 2))
    }
  }

  // Load voting ballot (for students)
  const [votingBallot, setVotingBallot] = useState(null)
  const [showVotingModal, setShowVotingModal] = useState(false)
  const [selectedVotes, setSelectedVotes] = useState({})
  const [submittingVote, setSubmittingVote] = useState(false)

  const loadVotingBallot = async () => {
    try {
      const url = `/api/v1/election/elections/${election.id}/vote/`
      console.log('GET Vote Ballot Request:', url)
      const response = await api.get(url)
      console.log('GET Vote Ballot Response:', response.data)
      setVotingBallot(response.data || [])
    } catch (error) {
      console.error('API Error:', error.response?.data)
    }
  }

  const handleVoteNow = () => {
    loadVotingBallot()
    setShowVotingModal(true)
  }

  const handleVoteSubmit = async (e) => {
    console.log("Starting vote submit")
    e.preventDefault()
    setSubmittingVote(true)
    
    console.log("Election object:", election)
    const electionId = election.id
    console.log("Voting Election ID:", electionId)
    console.log("Displayed Election ID:", election.id)
    
    const url = `/api/v1/election/elections/${electionId}/vote/`
    console.log("POST URL:", url)
    
    console.log("Selected Votes:", selectedVotes)
    console.log("Selected Votes type:", typeof selectedVotes)
    console.log("Selected Votes keys:", Object.keys(selectedVotes))
    
    try {
      console.log("Building vote items...")
      // Build vote_items array based on backend serializer expectations
      // Each vote item should include both position and candidate
      const voteItems = Object.entries(selectedVotes).map(([positionId, candidateId]) => ({
        position: parseInt(positionId),
        candidate: parseInt(candidateId)
      }))
      
      console.log("Vote items built:", voteItems)

      const payload = {
        vote_items: voteItems
      }
      
      console.log("Payload:", payload)
      console.log("Payload.vote_items:", payload.vote_items)
      console.log("Vote Payload:", JSON.stringify(payload, null, 2))
      console.log("Final Payload Structure:", payload)
      
      console.log("About to make POST request...")
      console.log("API object:", api)
      console.log("API.post function:", api.post)

      const response = await api.post(url, payload)
      console.log("POST Vote Response:", response.data)

      setShowVotingModal(false)
      setSelectedVotes({})
      alert('Vote submitted successfully!')
    } catch (error) {
      console.error("FULL ERROR OBJECT:", error)
      console.error("STACK:", error?.stack)
      console.error("MESSAGE:", error?.message)
      console.error("RESPONSE:", error?.response)
      console.error("DATA:", error?.response?.data)
      
      alert(
        error?.message ||
        JSON.stringify(error, null, 2)
      )
    } finally {
      setSubmittingVote(false)
    }
  }

  const handleLaunchElection = async () => {
    if (!confirm('Are you sure you want to launch this election?')) return

    try {
      const url = `/api/v1/election/elections/${election.id}/start_election/`
      console.log('Request:', url)
      const response = await api.post(url)
      console.log('Response:', response.data)
      alert('Election launched successfully!')
      loadElectionDetails()
    } catch (error) {
      console.error('API Error:', error.response?.data)
      alert(JSON.stringify(error.response?.data, null, 2))
    }
  }

  async function endElection() {
    if (!confirm('Are you sure you want to end this election?')) return
    
    try {
      const url = `/api/v1/election/elections/${election.id}/end_election/`
      console.log('End Election Request:', url)
      const response = await api.post(url)
      console.log('End Election Response:', response)
      console.log('End Election Data:', response?.data)
      
      const message =
        response?.data?.message ||
        response?.data?.detail ||
        "Election ended successfully";
      
      alert(message)
      loadElectionDetails()
    } catch (error) {
      console.error('End Election API Error:', error.response?.data)
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        JSON.stringify(error.response?.data, null, 2);
      alert(errorMessage)
    }
  }

  const [showResultsModal, setShowResultsModal] = useState(false)
  const [resultsData, setResultsData] = useState(null)

  async function handleViewResults() {
    try {
      const url = `/api/v1/election/elections/${election.id}/results/`
      console.log('View Results Request:', url)
      const response = await api.get(url)
      console.log('View Results Response:', response)
      console.log('View Results Data:', response?.data)
      
      if (!response?.data) {
        alert('No results data received')
        return
      }
      
      setResultsData(response.data)
      setShowResultsModal(true)
    } catch (error) {
      console.error('View Results API Error:', error.response?.data)
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        JSON.stringify(error.response?.data, null, 2);
      alert(errorMessage)
    }
  }

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
      // Convert local datetime to ISO string for backend (with UTC timezone)
      const formatToISO = (localDateTime) => {
        if (!localDateTime) return null
        const date = new Date(localDateTime)
        // Return ISO string with 'Z' suffix to indicate UTC
        return date.toISOString()
      }
      
      const url = `/api/v1/election/elections/${election.id}/update_time/`
      console.log('Request:', url)
      const response = await api.patch(url, {
        start_datetime: formatToISO(updateTimeForm.start_datetime),
        end_datetime: formatToISO(updateTimeForm.end_datetime)
      })
      console.log('Response:', response.data)
      alert('Election schedule updated successfully')
      setShowUpdateTimeModal(false)
      loadElectionDetails()
    } catch (error) {
      console.error('API Error:', error.response?.data)
      alert(JSON.stringify(error.response?.data, null, 2))
    }
  }

  function openUpdateTimeModal() {
    if (details) {
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
      })
    }
    setShowUpdateTimeModal(true)
  }

  // API save handlers
  async function handleAddCourse(e) {
    e.preventDefault()
    try {
      const url = `/api/v1/election/elections/${election.id}/courses/`
      console.log('Request:', url)
      const payload = { course: parseInt(courseForm.course) }
      const response = await api.post(url, payload)
      console.log('Response:', response.data)
      alert('Course added successfully')
      setShowCourseModal(false)
      setCourseForm({ course: '' })
      loadCourses()
      loadElectionDetails()
    } catch (error) {
      console.error('API Error:', error.response?.data)
      alert(JSON.stringify(error.response?.data, null, 2))
    }
  }

  async function handleAddYearLevel(e) {
    e.preventDefault()
    try {
      const url = `/api/v1/election/elections/${election.id}/year_levels/`
      console.log('Request:', url)
      const payload = { year_level: parseInt(yearForm.year_level) }
      const response = await api.post(url, payload)
      console.log('Response:', response.data)
      alert('Year level added successfully')
      setShowYearModal(false)
      setYearForm({ year_level: '' })
      loadYearLevels()
      loadElectionDetails()
    } catch (error) {
      console.error('API Error:', error.response?.data)
      alert(JSON.stringify(error.response?.data, null, 2))
    }
  }

  async function handleAddPosition(e) {
    e.preventDefault()
    try {
      const url = `/api/v1/election/elections/${election.id}/positions/`
      console.log('Request:', url)
      const payload = { title: positionForm.title, seat_count: parseInt(positionForm.seat_count) }
      const response = await api.post(url, payload)
      console.log('Response:', response.data)
      alert('Position added successfully')
      setShowPositionModal(false)
      setPositionForm({ title: '', seat_count: 1 })
      loadPositions()
      loadElectionDetails()
    } catch (error) {
      console.error('API Error:', error.response?.data)
      alert(JSON.stringify(error.response?.data, null, 2))
    }
  }

  async function handleAddPartylist(e) {
    e.preventDefault()
    try {
      const url = `/api/v1/election/elections/${election.id}/partylists/`
      console.log('Request:', url)
      const payload = { partylist: parseInt(partylistForm.partylist) }
      const response = await api.post(url, payload)
      console.log('Response:', response.data)
      alert('Partylist added successfully')
      setShowPartylistModal(false)
      setPartylistForm({ partylist: '' })
      loadPartylists()
      loadElectionDetails()
    } catch (error) {
      console.error('API Error:', error.response?.data)
      alert(JSON.stringify(error.response?.data, null, 2))
    }
  }

  async function handleAddCandidate(e) {
    e.preventDefault()
    try {
      const url = `/api/v1/election/elections/${election.id}/candidates/`
      console.log('Request:', url)
      const payload = {
        student_enrollment: parseInt(candidateForm.student_enrollment),
        position: parseInt(candidateForm.position),
        partylist: candidateForm.partylist ? parseInt(candidateForm.partylist) : null
      }
      const response = await api.post(url, payload)
      console.log('Response:', response.data)
      alert('Candidate added successfully')
      setShowCandidateModal(false)
      setCandidateForm({ student_enrollment: '', position: '', partylist: '' })
      setStudentSearchQuery('')
      loadCandidates()
      loadElectionDetails()
    } catch (error) {
      console.error('API Error:', error.response?.data)
      alert(JSON.stringify(error.response?.data, null, 2))
    }
  }

  // API delete handlers
  async function handleRemoveCourse(itemId) {
    if (!confirm('Are you sure you want to remove this course?')) return
    try {
      const url = `/api/v1/election/elections/${election.id}/courses/${itemId}/`
      console.log('Request:', url)
      const response = await api.delete(url)
      console.log('Response:', response.data)
      alert('Course removed successfully')
      loadCourses()
      loadElectionDetails()
    } catch (error) {
      console.error('API Error:', error.response?.data)
      alert(JSON.stringify(error.response?.data, null, 2))
    }
  }

  async function handleRemoveYearLevel(itemId) {
    if (!confirm('Are you sure you want to remove this year level?')) return
    try {
      const url = `/api/v1/election/elections/${election.id}/year_levels/${itemId}/`
      console.log('Request:', url)
      const response = await api.delete(url)
      console.log('Response:', response.data)
      alert('Year level removed successfully')
      loadYearLevels()
      loadElectionDetails()
    } catch (error) {
      console.error('API Error:', error.response?.data)
      alert(JSON.stringify(error.response?.data, null, 2))
    }
  }

  async function handleRemovePosition(itemId) {
    if (!confirm('Are you sure you want to remove this position?')) return
    try {
      const url = `/api/v1/election/elections/${election.id}/positions/${itemId}/`
      console.log('Request:', url)
      const response = await api.delete(url)
      console.log('Response:', response.data)
      alert('Position removed successfully')
      loadPositions()
      loadElectionDetails()
    } catch (error) {
      console.error('API Error:', error.response?.data)
      alert(JSON.stringify(error.response?.data, null, 2))
    }
  }

  async function handleRemovePartylist(itemId) {
    if (!confirm('Are you sure you want to remove this partylist?')) return
    try {
      const url = `/api/v1/election/elections/${election.id}/partylists/${itemId}/`
      console.log('Request:', url)
      const response = await api.delete(url)
      console.log('Response:', response.data)
      alert('Partylist removed successfully')
      loadPartylists()
      loadElectionDetails()
    } catch (error) {
      console.error('API Error:', error.response?.data)
      alert(JSON.stringify(error.response?.data, null, 2))
    }
  }

  async function handleRemoveCandidate(itemId) {
    if (!confirm('Are you sure you want to remove this candidate?')) return
    try {
      const url = `/api/v1/election/elections/${election.id}/candidates/${itemId}/`
      console.log('Request:', url)
      const response = await api.delete(url)
      console.log('Response:', response.data)
      alert('Candidate removed successfully')
      loadCandidates()
      loadElectionDetails()
    } catch (error) {
      console.error('API Error:', error.response?.data)
      alert(JSON.stringify(error.response?.data, null, 2))
    }
  }

  // Filter students based on search query
  const filteredStudents = studentEnrollments.filter(student => {
    const searchLower = studentSearchQuery.toLowerCase()
    // Handle both new students endpoint format and fallback enrollment format
    const fullName = student.full_name?.toLowerCase() || 
                    student.student?.full_name?.toLowerCase() || 
                    student.student?.username?.toLowerCase() || ''
    const course = student.course?.toLowerCase() || 
                   student.course?.name?.toLowerCase() || 
                   student.student?.course?.name?.toLowerCase() || ''
    const yearLevel = String(student.year_level || 
                           student.student?.year_level || '')
    return fullName.includes(searchLower) || course.includes(searchLower) || yearLevel.includes(searchLower)
  })

  // Calculate turnout
  const totalEligible = eligibleStudents.length || 0
  const votesCast = Array.isArray(votes) ? votes.length : 0
  const turnoutPercentage = totalEligible > 0 ? ((votesCast / totalEligible) * 100).toFixed(1) : 0

  // Normalize status for consistent comparison
  const status = details?.status?.toLowerCase() || ''
  
  // Debugging logs
  console.log('Role:', userRole)
  console.log('Status:', details?.status)
  console.log('Normalized Status:', status)
  console.log('Candidates:', candidates)
  console.log('Is Student:', isStudent)


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
              <div className={`election-status-badge ${status === 'drafted' ? 'status-drafted' : status === 'active' ? 'status-enabled' : 'status-ended'}`}>
                {details.status?.toUpperCase() || details.status}
              </div>
            </div>
            {!isStudent && status === 'drafted' && (
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
                {status === 'drafted' && (
                  <button
                    className="election-action-card"
                    onClick={handleLaunchElection}
                  >
                    <Power size={20} />
                    Launch Election
                  </button>
                )}
                {status === 'active' && (
                  <button
                    className="election-action-card danger"
                    onClick={endElection}
                  >
                    <Power size={20} />
                    End Election
                  </button>
                )}
                {status === 'ended' && (
                  <button
                    className="election-action-card"
                    onClick={handleViewResults}
                  >
                    <BarChart3 size={20} />
                    View Results
                  </button>
                )}
              </div>
            )}

            {/* VOTE NOW */}
            {isStudent && status === 'active' && (
              <button
                className="election-action-card"
                onClick={handleVoteNow}
              >
                <VoteIcon size={20} />
                Vote Now
              </button>
            )}

            {/* VIEW RESULTS FOR STUDENTS */}
            {isStudent && status === 'ended' && (
              <button
                className="election-action-card"
                onClick={handleViewResults}
              >
                <BarChart3 size={20} />
                View Results
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
                    {filteredStudents.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.full_name || student.student?.full_name || student.student?.username || 'Unknown'} ({student.course || student.course?.name || student.student?.course?.name || 'N/A'} - Year {student.year_level || student.student?.year_level || 'N/A'})
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

      {/* RESULTS MODAL */}
      {showResultsModal && resultsData && (
        <div className="modal-overlay" onClick={() => setShowResultsModal(false)}>
          <div className="modal-card results-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Election Results</h3>
              <button onClick={() => setShowResultsModal(false)} aria-label="Close modal">
                <X size={20} />
              </button>
            </div>
            <div className="results-content">
              {/* Election Summary */}
              <div className="results-summary">
                <h4>Election Summary</h4>
                <div className="summary-grid">
                  <div className="summary-item">
                    <span className="summary-label">Total Possible Votes</span>
                    <span className="summary-value">{resultsData.total_possible_votes}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Total Votes</span>
                    <span className="summary-value">{resultsData.total_votes}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Turnout Percentage</span>
                    <span className="summary-value">{resultsData.turnout_percentage?.toFixed(2)}%</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Abstained Students</span>
                    <span className="summary-value">{resultsData.abstained_students}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Generated At</span>
                    <span className="summary-value">{new Date(resultsData.generated_at).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Position Results */}
              <div className="position-results">
                <h4>Position Results</h4>
                {resultsData.candidate_results?.map((positionResult, index) => (
                  <div key={index} className="position-result-section">
                    <div className="position-header">
                      <h5>{positionResult.position}</h5>
                      <span className="abstained-badge">Abstained: {positionResult.abstained_votes}</span>
                    </div>
                    <table className="results-table">
                      <thead>
                        <tr>
                          <th>Rank</th>
                          <th>Candidate</th>
                          <th>Votes</th>
                          <th>Vote %</th>
                        </tr>
                      </thead>
                      <tbody>
                        {positionResult.candidates?.map((candidate) => (
                          <tr key={candidate.candidate_id}>
                            <td>
                              <span className={`rank-badge rank-${candidate.ranking}`}>
                                #{candidate.ranking}
                              </span>
                            </td>
                            <td>{candidate.candidate_name}</td>
                            <td>{candidate.total_votes}</td>
                            <td>{candidate.vote_percentage?.toFixed(2)}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}