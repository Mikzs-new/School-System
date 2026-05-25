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

  function getPositionTitle(position) {

    if (!position)
      return 'Unknown Position'

    if (typeof position === 'string')
      return position

    if (typeof position === 'object')
      return position.title || 'Unknown Position'

    return 'Unknown Position'
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

                {details?.valid_courses?.length > 0 ? (

                  details.valid_courses.map((item) => (

                    <button
                      key={item.id}
                      className="config-item"
                    >

                      {item.course?.name ||
                        'Unknown Course'}

                    </button>

                  ))

                ) : (

                  <div className="empty-state">
                    No allowed courses
                  </div>

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

                {details?.valid_year_levels?.length > 0 ? (

                  details.valid_year_levels.map((item) => (

                    <button
                      key={item.id}
                      className="config-item"
                    >

                      Year {item.year_level}

                    </button>

                  ))

                ) : (

                  <div className="empty-state">
                    No year levels
                  </div>

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

                {details?.positions?.length > 0 ? (

                  details.positions.map((position) => (

                    <button
                      key={position.id}
                      className="config-item"
                    >

                      {position?.title ||
                        'Unknown Position'}

                      {' — '}

                      Seats:
                      {' '}

                      {position?.seat_count || 0}

                    </button>

                  ))

                ) : (

                  <div className="empty-state">
                    No positions
                  </div>

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

                {details?.partylists?.length > 0 ? (

                  details.partylists.map((party, index) => (

                    <button
                      key={
                        party.id || index
                      }
                      className="config-item"
                    >

                      {party.partylist?.name ||
                        'Unknown Partylist'}

                    </button>

                  ))

                ) : (

                  <div className="empty-state">
                    No partylists
                  </div>

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

                {details?.candidates?.length > 0 ? (

                  details.candidates.map((candidate, index) => (

                    <button
                      key={
                        candidate.id || index
                      }
                      className="config-item"
                    >

                      {candidate.student ||
                        'Unknown Student'}

                      {' — '}

                      {getPositionTitle(
                        candidate.position
                      )}

                    </button>

                  ))

                ) : (

                  <div className="empty-state">
                    No candidates
                  </div>

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