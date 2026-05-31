import { useState, useEffect } from 'react'

import { Calendar, Clock, ChevronRight, Plus, X } from 'lucide-react'

import api from '../api/apiClient'
import { authStore } from '../state/authStore.js'

import ElectionDetail from './ElectionDetail.jsx'

export default function Elections({
  user
}) {
  const [selectedElection, setSelectedElection] = useState(null)
  const [elections, setElections] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createForm, setCreateForm] = useState({
    name: '',
    description: '',
    start_datetime: '',
    end_datetime: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const userRole = authStore.getRole()
  const isStudent = userRole === 'student'

  useEffect(() => {
    loadElections()
  }, [])

  async function loadElections() {
    try {
      setLoading(true)
      const response = await api.get('/api/v1/election/elections/')
      setElections(response.data || [])
    } catch (error) {
      console.error('Error loading elections:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateElection(e) {
    e.preventDefault()
    setSubmitting(true)
    try {
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
      
      const payload = {
        name: createForm.name,
        description: createForm.description || '',
        start_datetime: formatToISO(createForm.start_datetime),
        end_datetime: formatToISO(createForm.end_datetime)
      }
      await api.post('/api/v1/election/elections/', payload)
      setShowCreateModal(false)
      setCreateForm({ name: '', description: '', start_datetime: '', end_datetime: '' })
      alert('Election created successfully!')
      loadElections()
    } catch (error) {
      console.error('Error creating election:', error)
      const errorMessage = error.message || error.response?.data?.detail || error.response?.data || 'Failed to create election'
      alert(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  if (selectedElection) {
    return (
      <ElectionDetail
        election={selectedElection}
        onBack={() => setSelectedElection(null)}
      />
    )
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'status-enabled'
      case 'SCHEDULED': return 'status-scheduled'
      case 'DRAFTED': return 'status-drafted'
      case 'ENDED': return 'status-ended'
      default: return 'status-drafted'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <h1>Elections</h1>
          <p>View and participate in upcoming elections</p>
        </div>
        {!isStudent && (
          <button
            className="create-election-btn"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus size={18} />
            Create Election
          </button>
        )}
      </div>

      {loading ? (
        <div className="empty-state">Loading elections...</div>
      ) : elections.length === 0 ? (
        <div className="empty-state">No elections available</div>
      ) : (
        <div className="election-dashboard-grid">
          {elections.map((election) => (
            <div
              key={election.id}
              className="election-card"
              onClick={() => setSelectedElection(election)}
            >
              <div className="election-card-header">
                <div className={`election-status ${getStatusColor(election.status)}`}>
                  {election.status}
                </div>
                <ChevronRight size={20} className="election-card-chevron" />
              </div>
              
              <h3 className="election-card-title">{election.name}</h3>
              
              {election.description && (
                <p className="election-card-description">{election.description}</p>
              )}
              
              <div className="election-card-meta">
                <div className="election-meta-item">
                  <Calendar size={16} />
                  <span>Start: {formatDate(election.start_datetime)}</span>
                </div>
                <div className="election-meta-item">
                  <Clock size={16} />
                  <span>End: {formatDate(election.end_datetime)}</span>
                </div>
              </div>
              
              <div className="election-card-footer">
                <span className="election-card-action">View Election</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create Election</h3>
              <button onClick={() => setShowCreateModal(false)} aria-label="Close modal">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateElection}>
              <div className="form-group">
                <label>Election Name *</label>
                <input
                  type="text"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  placeholder="Enter election name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  placeholder="Enter election description (optional)"
                  rows={3}
                />
              </div>
              <div className="form-group">
                <label>Start Date & Time *</label>
                <input
                  type="datetime-local"
                  value={createForm.start_datetime}
                  onChange={(e) => setCreateForm({ ...createForm, start_datetime: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>End Date & Time *</label>
                <input
                  type="datetime-local"
                  value={createForm.end_datetime}
                  onChange={(e) => setCreateForm({ ...createForm, end_datetime: e.target.value })}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="workspace-primary-btn"
                  disabled={submitting}
                >
                  {submitting ? 'Creating...' : 'Create Election'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}