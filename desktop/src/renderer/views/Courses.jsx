import React, {
  useEffect,
  useState
} from 'react'

import apiClient from '../api/apiClient.js'

export default function Courses() {

  const [courses, setCourses] =
    useState([])

  const [departments, setDepartments] =
    useState([])

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState('')

  const [formData, setFormData] =
    useState({
      name: '',
      initials: '',
      department: ''
    })

  useEffect(() => {

    fetchCourses()

    fetchDepartments()

  }, [])

  async function fetchCourses() {

    try {

      setLoading(true)

      const response =
        await apiClient.get(
          '/api/v1/school/courses/'
        )

      setCourses(
        response.data || []
      )

    } catch (err) {

      console.error(err)

      setError(
        'Failed to load courses.'
      )

    } finally {

      setLoading(false)
    }
  }

  async function fetchDepartments() {

    try {

      const response =
        await apiClient.get(
          '/api/v1/school/departments/'
        )

      setDepartments(
        response.data || []
      )

    } catch (err) {

      console.error(err)
    }
  }

  async function handleSubmit(e) {

    e.preventDefault()

    try {

      const payload = {

        name:
          formData.name,

        initials:
          formData.initials,

        department:
          Number(
            formData.department
          ),

        school: 4
      }

      console.log(payload)

      await apiClient.post(
        '/api/v1/school/courses/',
        payload
      )

      setFormData({
        name: '',
        initials: '',
        department: ''
      })

      fetchCourses()

      alert(
        'Course added successfully'
      )

    } catch (err) {

      console.error(err)

      alert(

        err?.response?.data

          ? JSON.stringify(
              err.response.data,
              null,
              2
            )

          : 'Failed to add course.'
      )
    }
  }

  return (

    <div className="page-stack">

      <div className="page-header">

        <div>

          <h1>
            Courses
          </h1>

          <p>
            Manage school courses.
          </p>

        </div>

      </div>

      <form
        className="card-form"
        onSubmit={handleSubmit}
      >

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
          placeholder="Course Initials"
          value={formData.initials}
          onChange={(e) =>
            setFormData({
              ...formData,
              initials: e.target.value
            })
          }
        />

        <select
          value={formData.department}
          onChange={(e) =>
            setFormData({
              ...formData,
              department:
                e.target.value
            })
          }
        >

          <option value="">
            Select Department
          </option>

          {departments.map((dept) => (

            <option
              key={dept.id}
              value={dept.id}
            >

              {dept.name}

            </option>

          ))}

        </select>

        <button type="submit">
          Add Course
        </button>

      </form>

      <div className="data-panel">

        <table className="records-table">

          <thead>

            <tr>

              <th>
                Initials
              </th>

              <th>
                Course
              </th>

              <th>
                Department
              </th>

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

                  <td>
                    {course.initials}
                  </td>

                  <td>
                    {course.name}
                  </td>

                  <td>
                    {
                      course.department?.name
                    }
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