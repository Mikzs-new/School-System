import { useState, useEffect } from 'react';
import { Calendar, Clock, ChevronRight, Vote as VoteIcon } from 'lucide-react';
import apiClient from '../../api/apiClient';
import { authStore } from '../../state/authStore';
import NotificationModal from '../../components/ui/NotificationModal';
import ElectionDetailPage from '../facilitator/ElectionDetailPage';

export default function DashboardPage() {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedElection, setSelectedElection] = useState(null);
  const [notification, setNotification] = useState({ isOpen: false, title: '', message: '', type: 'info' });

  const showNotification = (title, message, type = 'info') => {
    setNotification({ isOpen: true, title, message, type });
  };

  const closeNotification = () => {
    setNotification({ isOpen: false, title: '', message: '', type: 'info' });
  };

  useEffect(() => {
    loadElections();
  }, []);

  async function loadElections() {
    try {
      setLoading(true);
      const response = await apiClient.get('/election/elections/');
      setElections(response.data || []);
    } catch (error) {
      console.error('Error loading elections:', error);
      showNotification('Error', 'Failed to load elections', 'error');
    } finally {
      setLoading(false);
    }
  }

  const getStatusColor = (status) => {
    const statusUpper = status?.toUpperCase();
    switch (statusUpper) {
      case 'ACTIVE':
      case 'ENABLED':
        return 'status-enabled';
      case 'DRAFTED':
        return 'status-drafted';
      case 'ENDED':
        return 'status-ended';
      default:
        return 'status-drafted';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleViewElection = (election) => {
    setSelectedElection(election);
  };

  if (selectedElection) {
    return (
      <ElectionDetailPage
        electionId={selectedElection.id}
        onBack={() => setSelectedElection(null)}
      />
    );
  }

  return (
    <div className="elections-wrapper">
      <div className="page-stack">
        <div className="page-header">
          <div>
            <h1>Elections</h1>
            <p>View and participate in upcoming elections</p>
          </div>
        </div>

        {loading ? (
          <div className="empty-state">Loading elections...</div>
        ) : elections.length === 0 ? (
          <div className="empty-state">No elections available</div>
        ) : (
          <div className="election-dashboard-grid">
            {elections.map((election) => {
              const statusUpper = election.status?.toUpperCase();
              const isEnded = statusUpper === 'ENDED';
              const isActive = statusUpper === 'ACTIVE' || statusUpper === 'ENABLED';
              const isDrafted = statusUpper === 'DRAFTED';

              return (
                <div
                  key={election.id}
                  className="election-card"
                  onClick={() => handleViewElection(election)}
                >
                  <div className="election-card-header">
                    <div className={`election-status ${getStatusColor(election.status)}`}>
                      {election.status?.toUpperCase() || election.status}
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
                    {isEnded ? (
                      <span className="election-card-action">View Results</span>
                    ) : isActive ? (
                      <span className="election-card-action">Vote Now</span>
                    ) : (
                      <span className="election-card-action">View Election</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

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