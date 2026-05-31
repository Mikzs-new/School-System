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
  const [showCourseModal, setShowCourseModal] =
  useState(false)

const [showYearModal, setShowYearModal] =
  useState(false)

const [showPositionModal, setShowPositionModal] =
  useState(false)

const [showPartylistModal, setShowPartylistModal] =
  useState(false)

const [showCandidateModal, setShowCandidateModal] =
  useState(false) 

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

              <div className="config-title-left">
                <GraduationCap size={18} />
                <h3>Allowed Courses</h3>
              </div>

              <button
                className="workspace-primary-btn"
                onClick={() => setShowCourseModal(true)}
              >
                + Add
              </button>

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

              <div className="config-title-left">
                <GraduationCap size={18} />
                <h3>Year Level</h3>
              </div>

              <button
                className="workspace-primary-btn"
                onClick={() => setShowYearModal(true)}
              >
                + Add
              </button>

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

                <div className="config-title-left">
                  <GraduationCap size={18} />
                  <h3>Possitions</h3>
                </div>

                <button
                  className="workspace-primary-btn"
                  onClick={() => setShowPositionModal(true)}
                >
                  + Add
                </button>

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

                <div className="config-title-left">
                  <GraduationCap size={18} />
                  <h3>Partylist</h3>
                </div>

                <button
                  className="workspace-primary-btn"
                  onClick={() => setShowPartylistModal(true)}
                >
                  + Add
                </button>

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

              <div className="config-title-left">
                <GraduationCap size={18} />
                <h3>Candidates</h3>
              </div>

              <button
                className="workspace-primary-btn"
               onClick={() => setShowCandidateModal(true)}
              >
                + Add
              </button>

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

                      {
                              candidate.partylist?.partylist?.name

                                ? `${candidate.student_enrollment?.student}
                                  (${candidate.partylist.partylist.name})`

                                : candidate.student_enrollment?.student
                            }

                            —

                            {
                              candidate.position?.title
                            }

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
      <div className="config-card">

  <div className="config-title">

    <Users size={18} />

    <h3>
      Eligible Voters
    </h3>

  </div>

  <div className="config-list">

    <button
      className="config-item"
    >

      Total Eligible:

      {

        details?.eligible_voters_count ||

        0

      }

    </button>

  </div>

</div>

    </div>
    
  )
  
}