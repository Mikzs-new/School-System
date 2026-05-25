import {
  GraduationCap,
  Layers3,
  ListChecks,
  Users,
  ShieldCheck,
  Power,
} from 'lucide-react'

import { useEffect, useState } from 'react'

import api from '../api/apiClient'

export default function ElectionDetail({
  election,
  onBack
}) {

  const [details, setDetails] =
    useState(null)

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {
    fetchAll()
  }, [])

  async function fetchAll() {

    try {

      setLoading(true)

      const response =
        await api.get(
          `/api/v1/election/elections/${election.id}/`
        )

      setDetails(response.data)

    } catch (error) {

      console.error(error)

    } finally {

      setLoading(false)
    }
  }

  async function endElection() {

    try {

      await api.post(
        `/api/v1/election/elections/${election.id}/end_election/`
      )

      alert(
        'Election ended successfully'
      )

      fetchAll()

    } catch (error) {

      console.error(error)

      alert(
        error?.response?.data?.detail ||
        'Failed to end election'
      )
    }
  }

  return (

    <div className="page-stack">

      <div className="page-header">

        <div>

          <h1>
            {details?.name || election.name}
          </h1>

          <p>
            Election configuration workspace
          </p>

        </div>

        <button
          className="workspace-secondary-btn"
          onClick={onBack}
        >
          Back
        </button>

      </div>

      {loading ? (

        <div className="empty-state">
          Loading election data...
        </div>

      ) : (

        <div className="election-config-grid">

          {/* LEFT */}

          <div className="election-records">

            {/* VALID COURSES */}

            <div className="config-card">

              <div className="config-title">

                <GraduationCap size={18} />

                <h3>
                  Allowed Courses
                </h3>

              </div>

              <div className="config-list">

                {details?.valid_courses?.length === 0 ? (

                  <div className="empty-state">
                    No allowed courses
                  </div>

                ) : (

                  details?.valid_courses?.map((item) => (

                    <button
                      key={item.id}
                      className="config-item"
                    >

                      {item.course?.name}

                    </button>

                  ))

                )}

              </div>

            </div>

            {/* YEAR LEVELS */}

            <div className="config-card">

              <div className="config-title">

                <Layers3 size={18} />

                <h3>
                  Year Levels
                </h3>

              </div>

              <div className="config-list">

                {details?.valid_year_levels?.length === 0 ? (

                  <div className="empty-state">
                    No year levels
                  </div>

                ) : (

                  details?.valid_year_levels?.map((item) => (

                    <button
                      key={item.id}
                      className="config-item"
                    >

                      Year {item.year_level}

                    </button>

                  ))

                )}

              </div>

            </div>

            {/* POSITIONS */}

            <div className="config-card">

              <div className="config-title">

                <ListChecks size={18} />

                <h3>
                  Positions
                </h3>

              </div>

              <div className="config-list">

                {details?.positions?.length === 0 ? (

                  <div className="empty-state">
                    No positions
                  </div>

                ) : (

                  details?.positions?.map((position) => (

                    <button
                      key={position.id}
                      className="config-item"
                    >

                      {position.title}

                      {' — '}

                      Seats:
                      {' '}
                      {position.seat_count}

                    </button>

                  ))

                )}

              </div>

            </div>

          </div>

          {/* RIGHT */}

          <div className="election-actions">

            {/* PARTYLISTS */}

            <div className="config-card">

              <div className="config-title">

                <ShieldCheck size={18} />

                <h3>
                  Partylists
                </h3>

              </div>

              <div className="config-list">

                {details?.partylists?.length === 0 ? (

                  <div className="empty-state">
                    No partylists
                  </div>

                ) : (

                  details?.partylists?.map((party, index) => (

                    <button
                      key={index}
                      className="config-item"
                    >

                      {party.partylist?.name}

                    </button>

                  ))

                )}

              </div>

            </div>

            {/* CANDIDATES */}

            <div className="config-card">

              <div className="config-title">

                <Users size={18} />

                <h3>
                  Candidates
                </h3>

              </div>

              <div className="config-list">

                {details?.candidates?.length === 0 ? (

                  <div className="empty-state">
                    No candidates
                  </div>

                ) : (

                  details?.candidates?.map((candidate) => (

                    <button
                      key={candidate.id}
                      className="config-item"
                    >

                      {candidate.student}

                      {' — '}

                      {candidate.position}

                    </button>

                  ))

                )}

              </div>

            </div>

            {/* END ELECTION */}

            <button
              className="election-action-card danger"
              onClick={endElection}
            >

              <Power size={20} />

              End Election

            </button>

          </div>

        </div>

      )}

    </div>
  )
}