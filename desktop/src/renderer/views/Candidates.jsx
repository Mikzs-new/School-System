import React, {
  useEffect,
  useState
} from 'react'

import api from '../api/apiClient'

export default function Candidates() {

  const [candidates, setCandidates] =
    useState([])

  const [students, setStudents] =
    useState([])

  const [positions] =
    useState([

      {
        id: 1,
        title: 'President'
      },

      {
        id: 2,
        title: 'Vice President'
      },

      {
        id: 3,
        title: 'Secretary'
      },

      {
        id: 4,
        title: 'Treasurer'
      }

    ])

  const [partylists, setPartylists] =
    useState([])

  const [loading, setLoading] =
    useState(false)

  const [formData, setFormData] =
    useState({
      student: '',
      position: '',
      partylist: ''
    })

  useEffect(() => {

    fetchAll()

  }, [])

  async function fetchAll() {

    try {

      setLoading(true)

      const [
        candidatesRes,
        studentsRes,
        partylistsRes
      ] = await Promise.all([

        api.get(
          '`/api/v1/election/elections/${selectedElectionId}/candidates/`'
        ),

        api.get(
          '/api/v1/student/records/'
        ),

        api.get(
          '/api/v1/election/partylists/'
        )

      ])

      console.log(
        'CANDIDATES:',
        candidatesRes.data
      )

      console.log(
        'STUDENTS:',
        studentsRes.data
      )

      console.log(
        'PARTYLISTS:',
        partylistsRes.data
      )

      setCandidates(
        candidatesRes.data || []
      )

      setStudents(
        studentsRes.data || []
      )

      setPartylists(
        partylistsRes.data || []
      )

    } catch (error) {

      console.error(
        'FETCH ERROR:',
        error
      )

    } finally {

      setLoading(false)
    }
  }

  async function handleSubmit(e) {

    e.preventDefault()

    try {

      if (!formData.student) {

        alert(
          'Please select a student'
        )

        return
      }

      if (!formData.position) {

        alert(
          'Please select a position'
        )

        return
      }

      if (!formData.partylist) {

        alert(
          'Please select a partylist'
        )

        return
      }

      /*
        TEMPORARY:
        backend expects enrollment id,
        but frontend only has student ids
      */

      const payload = {

        student_enrollment:
          Number(formData.student),

        position:
          Number(formData.position),

        partylist:
          Number(formData.partylist),

        election: 2
      }

      console.log(
        'CANDIDATE PAYLOAD:',
        payload
      )

      const response =
        await api.post(
          '/api/v1/election/elections/:id/candidates/',
          payload
        )

      console.log(
        'SUCCESS:',
        response.data
      )

      alert(
        'Candidate added successfully'
      )

      setFormData({
        student: '',
        position: '',
        partylist: ''
      })

      fetchAll()

    } catch (error) {

      console.error(
        'CREATE ERROR:',
        error
      )

      console.error(
        'RESPONSE:',
        error?.response
      )

      console.error(
        'DATA:',
        error?.response?.data
      )

      alert(

        error?.response?.data

          ? JSON.stringify(
              error.response.data,
              null,
              2
            )

          : 'Failed to add candidate'
      )
    }
  }

  return (

    <div className="page-stack">

      <div className="page-header">

        <div>

          <h1>
            Candidates
          </h1>

          <p>
            Manage election candidates.
          </p>

        </div>

      </div>

      {/* FORM */}

      <form
        className="card-form"
        onSubmit={handleSubmit}
      >

        {/* STUDENTS */}

        <select
          value={formData.student}
          onChange={(e) =>
            setFormData({
              ...formData,
              student:
                e.target.value
            })
          }
        >

          <option value="">
            Select Student
          </option>

          {students.map((student) => (

            <option
              key={student.id}
              value={student.id}
            >

              {student.full_name}

            </option>

          ))}

        </select>

        {/* POSITIONS */}

        <select
          value={formData.position}
          onChange={(e) =>
            setFormData({
              ...formData,
              position:
                e.target.value
            })
          }
        >

          <option value="">
            Select Position
          </option>

          {positions.map((position) => (

            <option
              key={position.id}
              value={position.id}
            >

              {position.title}

            </option>

          ))}

        </select>

        {/* PARTYLISTS */}

        <select
          value={formData.partylist}
          onChange={(e) =>
            setFormData({
              ...formData,
              partylist:
                e.target.value
            })
          }
        >

          <option value="">
            Select Partylist
          </option>

          {partylists.map((party) => (

            <option
              key={party.id}
              value={party.id}
            >

              {party.name}

            </option>

          ))}

        </select>

        <button type="submit">

          Add Candidate

        </button>

      </form>

      {/* TABLE */}

      <div className="data-panel">

        <table className="records-table">

          <thead>

            <tr>

              <th>
                Candidate
              </th>

              <th>
                Position
              </th>

              <th>
                Partylist
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

            ) : candidates.length === 0 ? (

              <tr>

                <td colSpan="3">
                  No candidates found.
                </td>

              </tr>

            ) : (

              candidates.map((candidate) => (

                <tr key={candidate.id}>

                  <td>

                    {
                      candidate.student_enrollment?.student ||

                      'Unknown'
                    }

                  </td>

                  <td>

                    {
                      candidate.position?.title ||

                      'Unknown'
                    }

                  </td>

                  <td>

                    {
                      candidate.partylist?.partylist?.name ||

                      candidate.partylist?.name ||

                      candidate.partylist ||

                      'Unknown'
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