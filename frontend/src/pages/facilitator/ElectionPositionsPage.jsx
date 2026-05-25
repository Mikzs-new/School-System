import { useEffect, useState } from "react"

import { useParams } from "react-router-dom"

import PositionForm from "../../components/positions/PositionForm"
import PositionList from "../../components/positions/PositionList"

import {
  getPositions,
  createPosition,
  deletePosition,
} from "../../services/positionServices"



function ElectionPositionsPage() {
  const { id: electionId } = useParams()

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



      <PositionForm
        onSubmit={handleCreatePosition}
      />



      {loading ? (
        <div className="text-zinc-400">
          Loading positions...
        </div>
      ) : error ? (
        <div className="text-red-400">
          {error}
        </div>
      ) : (
        <PositionList
          positions={positions}
          onDelete={handleDeletePosition}
        />
      )}
    </div>
  )
}

export default ElectionPositionsPage