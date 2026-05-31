import { useState, useEffect } from 'react';
import { Search, Plus, Upload, MoreVertical, GraduationCap, X, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import apiClient from '../../api/apiClient.js';
import { authStore } from '../../state/authStore.js';
import NotificationModal from '../../components/ui/NotificationModal.jsx';

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [importing, setImporting] = useState(false);
  const [notification, setNotification] = useState({ isOpen: false, title: '', message: '', type: 'info' });
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    school_student_id: '',
    email: '',
    course: '',
    year_level: '1'
  });

  const showNotification = (title, message, type = 'info') => {
    setNotification({ isOpen: true, title, message, type });
  };

  const closeNotification = () => {
    setNotification({ isOpen: false, title: '', message: '', type: 'info' });
  };

  useEffect(() => {
    fetchStudents();
    fetchCourses();
  }, []);

  async function fetchStudents() {
    try {
      const response = await apiClient.get('/student/records/');
      setStudents(response.data || []);
    } catch (error) {
      console.error('FETCH STUDENTS ERROR:', error);
      showNotification('Error', 'Failed to load students', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function fetchCourses() {
    try {
      const response = await apiClient.get('/school/courses/');
      setCourses(response.data || []);
    } catch (error) {
      console.error('FETCH COURSES ERROR:', error);
    }
  }

  async function handleCSVImport(event) {
    const file = event.target.files[0];
    if (!file) {
      showNotification('Error', 'Please select a CSV file', 'error');
      return;
    }

    setImporting(true);
    setImportResult(null);

    try {
      const form = new FormData();
      form.append('file', file);

      const token = authStore.getToken();
      const apiUrl = process.env.API_URL || 'http://localhost:8000/api/v1';
      const baseUrl = apiUrl.endsWith('/api/v1') ? apiUrl : `${apiUrl}/api/v1`;
      
      const response = await fetch(`${baseUrl}/student/student-csv/`, {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : undefined
        },
        body: form
      });

      const data = await response.json();
      
      await fetchStudents();
      setImportResult(data);
      setShowImportModal(true);
      
      if (data.Errors && data.Errors.length > 0) {
        showNotification('Import Complete', `Imported ${data.Created_count || 0}, Updated ${data.Updated_count || 0}, Errors: ${data.Errors.length}`, 'warning');
      } else {
        showNotification('Success', `Imported ${data.Created_count || 0} students successfully`, 'success');
      }
    } catch (error) {
      console.error('CSV Import Error:', error);
      const errorMessage = error.message || 'CSV import failed';
      setImportResult({
        Errors: [{ row: 0, error: errorMessage }],
        Updated_count: 0,
        Created_count: 0
      });
      setShowImportModal(true);
      showNotification('Error', errorMessage, 'error');
    } finally {
      setImporting(false);
      event.target.value = '';
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!formData.first_name.trim()) {
      showNotification('Error', 'First name is required', 'error');
      return;
    }

    if (!formData.last_name.trim()) {
      showNotification('Error', 'Last name is required', 'error');
      return;
    }

    if (!formData.school_student_id.trim()) {
      showNotification('Error', 'Student ID is required', 'error');
      return;
    }

    if (!formData.course) {
      showNotification('Error', 'Please select a course', 'error');
      return;
    }

    try {
      const payload = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        school_student_id: formData.school_student_id.trim(),
        email: formData.email.trim(),
        course: Number(formData.course),
        year_level: Number(formData.year_level)
      };

      await apiClient.post('/student/records/', payload);
      showNotification('Success', 'Student added successfully', 'success');
      await fetchStudents();
      setShowModal(false);
      setFormData({
        first_name: '',
        last_name: '',
        school_student_id: '',
        email: '',
        course: '',
        year_level: '1'
      });
    } catch (error) {
      console.error('FULL SUBMIT ERROR:', error);
      const errorMessage = error.response?.data?.detail || error.response?.data?.error || error.message || 'Failed to add student';
      showNotification('Error', errorMessage, 'error');
    }
  }

  const filteredStudents = students.filter(student => {
    const searchLower = searchQuery.toLowerCase();
    const fullName = student.full_name?.toLowerCase() || '';
    const studentId = student.school_student_id?.toLowerCase() || '';
    return fullName.includes(searchLower) || studentId.includes(searchLower);
  });

  return (
    <div className="student-workspace">
      {/* HERO */}
      <div className="workspace-hero">
        <div>
          <span className="workspace-eyebrow">
            STUDENT DIRECTORY
          </span>
          <h1>
            Students
          </h1>
          <p>
            Manage student voters and
            academic participation.
          </p>
        </div>
        <div className="student-hero-actions">
          <label className="workspace-secondary-btn">
            <Upload size={18} />
            {importing ? 'Importing...' : 'Import CSV'}
            <input
              type="file"
              accept=".csv"
              hidden
              onChange={handleCSVImport}
              disabled={importing}
            />
          </label>
          <button
            className="workspace-primary-btn"
            onClick={() => setShowModal(true)}
          >
            <Plus size={18} />
            Add Student
          </button>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h2>Add Student</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="First Name"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Student ID"
                value={formData.school_student_id}
                onChange={(e) => setFormData({ ...formData, school_student_id: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <select
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                required
              >
                <option value="">Select Course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
              <select
                value={formData.year_level}
                onChange={(e) => setFormData({ ...formData, year_level: e.target.value })}
              >
                <option value="1">Year 1</option>
                <option value="2">Year 2</option>
                <option value="3">Year 3</option>
                <option value="4">Year 4</option>
              </select>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit">
                  Add Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* IMPORT RESULTS MODAL */}
      {showImportModal && importResult && (
        <div className="modal-overlay" onClick={() => setShowImportModal(false)}>
          <div className="modal-card import-results-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>CSV Import Results</h3>
              <button onClick={() => setShowImportModal(false)} aria-label="Close modal">
                <X size={20} />
              </button>
            </div>
            <div className="import-summary">
              <div className="import-stat success">
                <CheckCircle size={24} />
                <div>
                  <span className="import-stat-value">
                    {importResult.Created_count || 0}
                  </span>
                  <span className="import-stat-label">
                    Imported
                  </span>
                </div>
              </div>
              <div className="import-stat updated">
                <FileText size={24} />
                <div>
                  <span className="import-stat-value">
                    {importResult.Updated_count || 0}
                  </span>
                  <span className="import-stat-label">
                    Updated
                  </span>
                </div>
              </div>
              <div className="import-stat error">
                <AlertCircle size={24} />
                <div>
                  <span className="import-stat-value">
                    {importResult.Errors?.length || 0}
                  </span>
                  <span className="import-stat-label">
                    Errors
                  </span>
                </div>
              </div>
            </div>
            {importResult.Errors && importResult.Errors.length > 0 && (
              <div className="import-errors-section">
                <h4>Errors</h4>
                <div className="import-errors-list">
                  {importResult.Errors.map((error, index) => (
                    <div key={index} className="import-error-item">
                      <span className="error-row">
                        Row {error.row || 'N/A'}:
                      </span>
                      <span className="error-message">
                        {typeof error.error === 'string' ? error.error : JSON.stringify(error.error)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="modal-actions">
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="workspace-primary-btn"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SEARCH */}
      <div className="workspace-search">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search students..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="empty-state">
          Loading students...
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="empty-state">
          No students found
        </div>
      ) : (
        <div className="student-grid">
          {filteredStudents.map((student) => (
            <div className="student-card" key={student.id}>
              <div className="student-card-top">
                <div className="student-avatar">
                  {student.full_name?.charAt(0)}
                </div>
                <button className="student-menu-btn">
                  <MoreVertical size={18} />
                </button>
              </div>
              <div className="student-content">
                <h3>
                  {student.full_name}
                </h3>
                <p>
                  Student Voter
                </p>
                <div className="student-meta">
                  <div className="student-chip">
                    <GraduationCap size={14} />
                    {student.school_student_id}
                  </div>
                </div>
              </div>
              <div className="student-actions">
                <button>
                  View
                </button>
                <button>
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

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