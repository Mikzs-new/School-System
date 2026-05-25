import React, { useEffect, useState } from 'react'
import apiClient from '../api/apiClient.js'

export default function Courses() {

  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    department: '',
  })

  const fetchCourses = async () => {
    try {

      setLoading(true)

      const response = await apiClient.get('/api/v1/school/courses/')

      setCourses(response.data || [])

    } catch (err) {

      console.error(err)

      setError('Failed to load courses.')

    } finally {

      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      await apiClient.post('/api/v1/school/courses/', formData)

      setFormData({
        name: '',
        code: '',
        department: '',
      })

      fetchCourses()

    } catch (err) {

      console.error(err)

      setError('Failed to add course.')
    }
  }

  return (
    <div className="page-stack">

      <div className="page-header">
        <div>
          <h1>Courses</h1>
          <p>Manage school courses.</p>
        </div>
      </div>

      {error ? (
        <div className="status-banner error">
          {error}
        </div>
      ) : null}

      <form className="card-form" onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Course Name"
          value={formData.name}
          onChange={(e) =>
            setFormData({
              ...formData,
              name: e.target.value
            })
          }
        />

        <input
          type="text"
          placeholder="Course Code"
          value={formData.code}
          onChange={(e) =>
            setFormData({
              ...formData,
              code: e.target.value
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

        <button type="submit">
          Add Course
        </button>

      </form>

      <div className="data-panel">

        <table className="records-table">

          <thead>
            <tr>
              <th>Code</th>
              <th>Course</th>
              <th>Department</th>
            </tr>
          </thead>

          <tbody>

            {loading ? (

              <tr>
                <td colSpan="3">
                  Loading...
                </td>
              </tr>

            ) : courses.length === 0 ? (

              <tr>
                <td colSpan="3">
                  No courses found.
                </td>
              </tr>

            ) : (

              courses.map((course) => (
                <tr key={course.id}>
                  <td>{course.initials || '-'}</td>

                  <td>{course.name}</td>

                  <td>
                    {course.department?.name || '-'}
                  </td>
                </tr>
              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  )
}