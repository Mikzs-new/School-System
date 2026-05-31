import React, { useEffect, useState } from 'react';

import apiClient from '../../api/apiClient.js';
import { authStore } from '../../state/authStore.js';
import { getPartyLists, createPartyList } from '../../api/elections.js';
import NotificationModal from '../../components/ui/NotificationModal.jsx';

export default function CandidatesPage() {
  const userRole = authStore.getRole();
  const isStudent = userRole === 'student';

  const [partylists, setPartylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [notification, setNotification] = useState({ isOpen: false, title: '', message: '', type: 'info' });

  const showNotification = (title, message, type = 'info') => {
    setNotification({ isOpen: true, title, message, type });
  };

  const closeNotification = () => {
    setNotification({ isOpen: false, title: '', message: '', type: 'info' });
  };

  useEffect(() => {
    fetchPartylists();
  }, []);

  async function fetchPartylists() {
    try {
      setLoading(true);
      const data = await getPartyLists();
      setPartylists(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await createPartyList(formData);
      alert('Party list added successfully');
      setFormData({
        name: '',
        description: ''
      });
      fetchPartylists();
    } catch (error) {
      console.error(error);
      alert(
        error?.response?.data
          ? JSON.stringify(error.response.data, null, 2)
          : 'Failed to add party list'
      );
    }
  }

  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <h1>Party Lists</h1>
          <p>Manage election party lists.</p>
        </div>
      </div>

      {!isStudent && (
        <form className="card-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Party List Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value
              })
            }
          />
          <textarea
            className="modern-textarea"
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({
                ...formData,
                description: e.target.value
              })
            }
          />
          <button type="submit">Add Party List</button>
        </form>
      )}

      <div className="data-panel">
        <table className="records-table">
          <thead>
            <tr>
              <th>Party List</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="2">Loading...</td>
              </tr>
            ) : (
              partylists.map((party) => (
                <tr key={party.id}>
                  <td>{party.name}</td>
                  <td>{party.description}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
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