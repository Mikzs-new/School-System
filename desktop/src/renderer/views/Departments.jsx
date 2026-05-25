import React, { useEffect, useState } from 'react'
import apiClient from '../api/apiClient.js'

export default function Departments() {

  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    code: '',
  })

  const fetchDepartments = async () => {

    try {

      setLoading(true)

      const response = await apiClient.get('/api/v1/school/departments/')

      setDepartments(response.data || [])

    } catch (err) {

      console.error(err)

      setError('Failed to load departments.')

    } finally {

      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDepartments()
  }, [])

  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      await apiClient.post('/departments/', formData)

      setFormData({
        name: '',
        code: '',
      })

      fetchDepartments()

    } catch (err) {

      console.error(err)

      setError('Failed to add department.')
    }
  }

  return (

    <div className="page-stack">

      <div className="page-header">
        <div>
          <h1>Departments</h1>
          <p>Manage school departments.</p>
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
          placeholder="Department Code"
          value={formData.code}
          onChange={(e) =>
            setFormData({
              ...formData,
              code: e.target.value
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
              <th>Code</th>
              <th>Department</th>
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

              departments.map((department) => (
                <tr key={department.id}>
                  <td>{department.code}</td>
                  <td>{department.name}</td>
                </tr>
              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  )
}