import React, {
  useEffect,
  useState
} from 'react'

import apiClient from '../api/apiClient.js'

export default function Departments() {

  const [departments, setDepartments] =
    useState([])

  const [loading, setLoading] =
    useState(false)

  const [formData, setFormData] =
    useState({
      name: '',
      initials: ''
    })

  useEffect(() => {

    fetchDepartments()

  }, [])

  async function fetchDepartments() {

    try {

      setLoading(true)

      const response =
        await apiClient.get(
          '/api/v1/school/departments/'
        )

      setDepartments(
        response.data || []
      )

    } catch (err) {

      console.error(err)

    } finally {

      setLoading(false)
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

        school: 4
      }

      console.log(payload)

      await apiClient.post(
        '/api/v1/school/departments/',
        payload
      )

      setFormData({
        name: '',
        initials: ''
      })

      fetchDepartments()

      alert(
        'Department added successfully'
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

          : 'Failed to add department.'
      )
    }
  }

  return (

    <div className="page-stack">

      <div className="page-header">

        <div>

          <h1>
            Departments
          </h1>

          <p>
            Manage school departments.
          </p>

        </div>

      </div>

      <form
        className="card-form"
        onSubmit={handleSubmit}
      >

        <input
          type="text"
          placeholder="Department Name"
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
          placeholder="Department Initials"
          value={formData.initials}
          onChange={(e) =>
            setFormData({
              ...formData,
              initials: e.target.value
            })
          }
        />

        <button type="submit">
          Add Department
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
                Department
              </th>

            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>

                <td colSpan="2">
                  Loading...
                </td>

              </tr>

            ) : departments.length === 0 ? (

              <tr>

                <td colSpan="2">
                  No departments found.
                </td>

              </tr>

            ) : (

              departments.map((dept) => (

                <tr key={dept.id}>

                  <td>
                    {dept.initials}
                  </td>

                  <td>
                    {dept.name}
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