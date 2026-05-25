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

          <button className="workspace-primary-btn">

            <Plus size={18} />

            Add Student

          </button>

        </div>

      </div>

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