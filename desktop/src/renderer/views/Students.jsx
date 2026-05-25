import {
  Search,
  Plus,
  Upload,
  MoreVertical,
  GraduationCap
} from "lucide-react";

import { useEffect, useState } from "react";

import api from "../api/apiClient";

export default function Students() {

  const [students, setStudents] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [showModal, setShowModal] =
    useState(false);

  const [formData, setFormData] =
  useState({
    first_name: "",
    last_name: "",
    school_student_id: "",
    email: "",
    course: "",
    department: ""
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  async function fetchStudents() {

    try {

      const response =
        await api.get(
          "/api/v1/student/records/"
        );

      setStudents(
        response.data || []
      );

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  }

  async function handleCSVImport(event) {

    const file =
      event.target.files[0];

    if (!file) return;

    try {

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      await api.post(
        "/api/v1/student/import-csv/",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data"
          }
        }
      );

      await fetchStudents();

      alert(
        "CSV imported successfully"
      );

    } catch (error) {

      console.error(error);

      alert(
        "CSV import failed"
      );
    }
  }

  async function handleSubmit(event) {

    event.preventDefault();

    try {

      await api.post(
        "/api/v1/student/records/",
        formData
      );

      await fetchStudents();

      setShowModal(false);

      setFormData({
        first_name: "",
        last_name: "",
        school_student_id: "",
        email: ""
      });

      alert(
        "Student added successfully"
      );

    } catch (error) {

      console.error(error);

      alert(
        error?.response?.data?.detail ||
        "Failed to add student"
      );
    }
  }

  return (

    <div className="student-workspace">

      {/* HERO */}

      <div className="workspace-hero">

        <div>

          <span className="workspace-eyebrow">
            STUDENT DIRECTORY
          </span>

          <h1>Students</h1>

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

            <h2>Add Student</h2>

            <form onSubmit={handleSubmit}>

              <input
                type="text"
                placeholder="First Name"
                value={formData.first_name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    first_name: e.target.value
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
                    last_name: e.target.value
                  })
                }
              />

              <input
                type="text"
                placeholder="Student ID"
                value={formData.school_student_id}
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
                    email: e.target.value
                  })
                }
              />
              <input
                type="text"
                placeholder="Course"
                value={formData.course}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    course: e.target.value
                  })
                }
              />

              <input
                type="text"
                placeholder="Department"
                value={formData.department}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    department: e.target.value
                  })
                }
              />
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

                  {student.first_name
                    ?.charAt(0)}

                </div>

                <button className="student-menu-btn">

                  <MoreVertical size={18} />

                </button>

              </div>

              <div className="student-content">

                <h3>

                  {student.first_name}
                  {" "}
                  {student.last_name}

                </h3>

                <p>

                  {student.course_name ||
                    "No course"}

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

    </div>
  );
}