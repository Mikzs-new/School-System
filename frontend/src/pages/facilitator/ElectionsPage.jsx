import { useEffect, useState } from "react"

import { useNavigate } from "react-router-dom"

import {
  getElections,
  createElection,
} from "../../services/electionService"



function ElectionsPage() {

  const navigate = useNavigate()



  const [elections, setElections] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState("")



  const [name, setName] =
    useState("")

  const [description, setDescription] =
    useState("")

  const [status, setStatus] =
    useState("draft")



  const fetchElections = async () => {

    try {

      setLoading(true)

      const data =
        await getElections()

      setElections(
        data.results || data
      )
    }

    catch (error) {

      console.error(error)

      setError(
        "Failed to load elections"
      )
    }

    finally {

      setLoading(false)
    }
  }



  useEffect(() => {

    fetchElections()

  }, [])



  const handleCreateElection =
    async (e) => {

      e.preventDefault()

      try {

        await createElection({
          name,
          description,
          status,
        })



        setName("")
        setDescription("")
        setStatus("draft")



        fetchElections()
      }

      catch (error) {

        console.log(error)

        console.log(
          error.response
        )

        console.log(
          error.response?.data
        )

        alert(
          JSON.stringify(
            error.response?.data ||
            error.message,
            null,
            2
          )
        )
      }
    }



  return (

    <div className="space-y-8 pb-20">

      <div>

        <h1 className="text-3xl font-bold text-white">
          Elections
        </h1>

        <p className="text-zinc-400 mt-1">
          Manage elections
        </p>

      </div>



      <form
        onSubmit={handleCreateElection}
        className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4 max-w-2xl"
      >

        <h2 className="text-2xl font-semibold text-white">
          Create Election
        </h2>



        <div>

          <label className="block text-sm text-zinc-400 mb-2">
            Election Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none"
            required
          />

        </div>



        <div>

          <label className="block text-sm text-zinc-400 mb-2">
            Description
          </label>

          <textarea
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none"
            rows={5}
          />

        </div>



        <div>

          <label className="block text-sm text-zinc-400 mb-2">
            Status
          </label>

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
            className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none"
          >

            <option value="draft">
              Draft
            </option>

            <option value="active">
              Active
            </option>

            <option value="closed">
              Closed
            </option>

          </select>

        </div>



        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition"
        >
          Create Election
        </button>

      </form>



      {loading ? (

        <div className="text-zinc-400">
          Loading elections...
        </div>

      ) : error ? (

        <div className="text-red-400">
          {error}
        </div>

      ) : elections.length === 0 ? (

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-zinc-400">
          No elections found
        </div>

      ) : (

        <div className="grid gap-4">

          {elections.map((election) => (

            <div
              key={election.id}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex items-center justify-between"
            >

              <div>

                <h2 className="text-xl font-semibold text-white">
                  {election.name}
                </h2>

                <p className="text-zinc-400 mt-1">
                  {election.description}
                </p>

                <p className="text-zinc-500 mt-2 text-sm">
                  Status:
                  {" "}
                  {election.status}
                </p>

              </div>



              <button
                onClick={() =>
                  navigate(
                    `/facilitator/elections/${election.id}/positions`
                  )
                }
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl transition"
              >
                Manage Positions
              </button>

            </div>
          ))}

        </div>
      )}

    </div>
  )
}



export default ElectionsPage