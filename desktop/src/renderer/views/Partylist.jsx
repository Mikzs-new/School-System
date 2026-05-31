import React, {
  useEffect,
  useState
} from 'react'

import api from '../api/apiClient'
import { authStore } from '../state/authStore.js'

export default function Partylists() {

  const userRole = authStore.getRole()
  const isStudent = userRole === 'student'

  const [partylists, setPartylists] =
    useState([])

  const [loading, setLoading] =
    useState(false)

  const [formData, setFormData] =
    useState({
      name: '',
      description: ''
    })

  useEffect(() => {

    fetchPartylists()

  }, [])

  async function fetchPartylists() {

    try {

      setLoading(true)

      const url = '/api/v1/election/partylists/'
      console.log('Request:', url)
      const response =
        await api.get(url)
      console.log('Response:', response.data)

      setPartylists(
        response.data || []
      )

    } catch (error) {

      console.error('API Error:', error.response?.data)
      
      if (error.response?.status === 401) {
        alert('Authentication failed. Please log in again.')
        authStore.clearAuth()
        window.location.reload()
      } else {
        alert('Failed to load partylists: ' + JSON.stringify(error.response?.data, null, 2))
      }

    } finally {

      setLoading(false)
    }
  }

  async function handleSubmit(e) {

    e.preventDefault()

    try {

      const url = '/api/v1/election/partylists/'
      console.log('Request:', url)
      const response = await api.post(url, formData)
      console.log('Response:', response.data)

      alert(
        'Partylist added successfully'
      )

      setFormData({
        name: '',
        description: ''
      })

      fetchPartylists()

    } catch (error) {

      console.error('API Error:', error.response?.data)
      
      if (error.response?.status === 401) {
        alert('Authentication failed. Please log in again.')
        authStore.clearAuth()
        window.location.reload()
      } else {
        alert('Failed to add partylist: ' + JSON.stringify(error.response?.data, null, 2))
      }
    }
  }

  return (

    <div className="page-stack">

      <div className="page-header">

        <div>

          <h1>
            Partylists
          </h1>

          <p>
            Manage election partylists.
          </p>

        </div>

      </div>

      {!isStudent && (
        <form
          className="card-form"
          onSubmit={handleSubmit}
        >

          <input
            type="text"
            placeholder="Partylist Name"
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
                description:
                  e.target.value
              })
            }
          />

          <button type="submit">
            Add Partylist
          </button>

        </form>
      )}

      <div className="data-panel">

        <table className="records-table">

          <thead>

            <tr>

              <th>
                Partylist
              </th>

              <th>
                Description
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

            ) : (

              partylists.map((party) => (

                <tr key={party.id}>

                  <td>
                    {party.name}
                  </td>

                  <td>
                    {party.description}
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