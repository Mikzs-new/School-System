import { useEffect, useState } from "react"

import {
  getPositions,
  createPosition,
  deletePosition,
} from "../../api/positions"



function ElectionPositionsPage({ electionId }) {

  const [positions, setPositions] = useState([])

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState("")



  const fetchPositions = async () => {
    try {
      setLoading(true)

      const data = await getPositions(
        electionId
      )

      setPositions(data)
    }

    catch (error) {
      console.error(error)

      setError(
        "Failed to load positions"
      )
    }

    finally {
      setLoading(false)
    }
  }



  useEffect(() => {
    fetchPositions()
  }, [electionId])



  const handleCreatePosition = async (
    formData
  ) => {
    try {
      await createPosition(
        electionId,
        formData
      )

      fetchPositions()
    }

    catch (error) {
      console.error(error)
    }
  }



  const handleDeletePosition = async (
    positionId
  ) => {
    try {
      await deletePosition(positionId)

      fetchPositions()
    }

    catch (error) {
      console.error(error)
    }
  }



  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Positions
          </h1>

          <p className="text-zinc-400 mt-1">
            Manage election positions
          </p>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">
          Add Position
        </h2>
        <form onSubmit={(e) => {
          e.preventDefault()
          const formData = new FormData(e.target)
          handleCreatePosition({
            title: formData.get('title'),
            description: formData.get('description'),
            max_candidates: formData.get('max_candidates')
          })
        }} className="space-y-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Title</label>
            <input name="title" type="text" required className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none" />
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Description</label>
            <textarea name="description" className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none" rows={3} />
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Max Candidates</label>
            <input name="max_candidates" type="number" defaultValue={1} className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none" />
          </div>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition">
            Add Position
          </button>
        </form>
      </div>

      {loading ? (
        <div className="text-zinc-400">
          Loading positions...
        </div>
      ) : error ? (
        <div className="text-red-400">
          {error}
        </div>
      ) : (
        <div className="grid gap-4">
          {positions.map((position) => (
            <div
              key={position.id}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex items-center justify-between"
            >
              <div>
                <h3 className="text-xl font-semibold text-white">
                  {position.title}
                </h3>
                <p className="text-zinc-400 mt-1">
                  {position.description}
                </p>
                <p className="text-zinc-500 mt-2 text-sm">
                  Max Candidates: {position.max_candidates}
                </p>
              </div>
              <button
                onClick={() => handleDeletePosition(position.id)}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl transition"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ElectionPositionsPage