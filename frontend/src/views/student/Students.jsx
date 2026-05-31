import {
  Search,
  Plus,
  Upload,
  MoreVertical,
  GraduationCap
} from "lucide-react";

import { useEffect, useState } from "react";

import apiClient from "../../api/apiClient";
import NotificationModal from "../../components/ui/NotificationModal.jsx";

export default function Students() {

  const [students, setStudents] =
    useState([]);

  const [courses, setCourses] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [showModal, setShowModal] =
    useState(false);

  const [notification, setNotification] = useState({ isOpen: false, title: '', message: '', type: 'info' });

  const showNotification = (title, message, type = 'info') => {
    setNotification({ isOpen: true, title, message, type });
  };

  const closeNotification = () => {
    setNotification({ isOpen: false, title: '', message: '', type: 'info' });
  };

  const [formData, setFormData] =
    useState({
      first_name: "",
      last_name: "",
      school_student_id: "",
      email: "",
      course: "",
      year_level: "1"
    });

  useEffect(() => {

    fetchStudents();

    fetchCourses();

  }, []);

  async function fetchStudents() {

    try {

      const response =
        await apiClient.get(
          "/student/records/"
        );

      setStudents(
        response.data || []
      );

    } catch (error) {

      console.error(
        "FETCH STUDENTS ERROR:",
        error
      );

    } finally {

      setLoading(false);
    }
  }

  async function fetchCourses() {

    try {

      const response =
        await apiClient.get(
          "/school/courses/"
        );

      setCourses(
        response.data || []
      );

    } catch (error) {

      console.error(
        "FETCH COURSES ERROR:",
        error
      );
    }
  }

  async function handleCSVImport(event) {

    const file =
      event.target.files[0];

    if (!file) return;

    try {

      const form =
        new FormData();

      form.append(
        "file",
        file
      );

      await apiClient.post(
        "/student/import-csv/",
        form,
        {
          headers: {
            "Content-Type":
              "multipart/form-data"
          }
        }
      );

      await fetchStudents();

      showNotification('Success', 'CSV imported successfully', 'success');

    } catch (error) {

      console.error(error);

      showNotification('Error', 'CSV import failed', 'error');
    }
  }

  async function handleSubmit(event) {

    event.preventDefault();

    try {

      if (
        !formData.first_name.trim()
      ) {

        showNotification('Validation Error', 'First name is required', 'warning');

        return;
      }

      if (
        !formData.last_name.trim()
      ) {

        showNotification('Validation Error', 'Last name is required', 'warning');

        return;
      }

      if (
        !formData.school_student_id.trim()
      ) {

        showNotification('Validation Error', 'Student ID is required', 'warning');

        return;
      }

      if (!formData.course) {

        showNotification('Validation Error', 'Please select a course', 'warning');

        return;
      }

      const payload = {

        first_name:
          formData.first_name.trim(),

        last_name:
          formData.last_name.trim(),

        school_student_id:
          formData.school_student_id.trim(),

        email:
          formData.email.trim(),

        course:
          Number(formData.course),

        year_level:
          Number(formData.year_level)
      };

      console.log(
        "SUBMIT PAYLOAD:",
        payload
      );

      const response =
        await apiClient.post(
          "/student/records/",
          payload
        );

      console.log(
        "SUCCESS RESPONSE:",
        response.data
      );

      showNotification('Success', 'Student added successfully', 'success');

      await fetchStudents();

      setShowModal(false);

      setFormData({
        first_name: "",
        last_name: "",
        school_student_id: "",
        email: "",
        course: "",
        year_level: "1"
      });

    } catch (error) {

      console.error(
        "FULL SUBMIT ERROR:",
        error
      );

      console.error(
        "RESPONSE:",
        error?.response
      );

      console.error(
        "DATA:",
        error?.response?.data
      );

      console.error(
        "MESSAGE:",
        error?.message
      );

      const backendError =
        error?.response?.data;

      if (backendError) {

        showNotification('Error', JSON.stringify(backendError, null, 2), 'error');

      } else {

        showNotification('Error', error?.message || "Failed to add student", 'error');
      }
    }
  }

  return (
    <div className="students-wrapper">
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

            Import CSV

            <input
              type="file"
              accept=".csv"
              hidden
              onChange={handleCSVImport}
            />

          </label>

          <button
            className="workspace-primary-btn"
            onClick={() =>
              setShowModal(true)
            }
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

            <h2>
              Add Student
            </h2>

            <form onSubmit={handleSubmit}>

              <input
                type="text"
                placeholder="First Name"
                value={formData.first_name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    first_name:
                      e.target.value
                  })
                }
              />

              <input
                type="text"
                placeholder="Last Name"
                value={formData.last_name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    last_name:
                      e.target.value
                  })
                }
              />

              <input
                type="text"
                placeholder="Student ID"
                value={
                  formData.school_student_id
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    school_student_id:
                      e.target.value
                  })
                }
              />

              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email:
                      e.target.value
                  })
                }
              />

              {/* COURSE */}

              <select
                value={formData.course}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    course:
                      e.target.value
                  })
                }
              >

                <option value="">
                  Select Course
                </option>

                {courses.map((course) => (

                  <option
                    key={course.id}
                    value={course.id}
                  >

                    {course.name}

                  </option>

                ))}

              </select>

              {/* YEAR LEVEL */}

              <select
                value={
                  formData.year_level
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    year_level:
                      e.target.value
                  })
                }
              >

                <option value="1">
                  Year 1
                </option>

                <option value="2">
                  Year 2
                </option>

                <option value="3">
                  Year 3
                </option>

                <option value="4">
                  Year 4
                </option>

              </select>

              <div className="modal-actions">

                <button
                  type="button"
                  onClick={() =>
                    setShowModal(false)
                  }
                >
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

      {/* SEARCH */}

      <div className="workspace-search">

        <Search size={18} />

        <input
          type="text"
          placeholder="Search students..."
        />

      </div>

      {/* CONTENT */}

      {loading ? (

        <div className="empty-state">

          Loading students...

        </div>

      ) : (

        <div className="student-grid">

          {students.map((student) => (

            <div
              className="student-card"
              key={student.id}
            >

              <div className="student-card-top">

                <div className="student-avatar">

                  {student.full_name
                    ?.charAt(0)}

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

                    {
                      student.school_student_id
                    }

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