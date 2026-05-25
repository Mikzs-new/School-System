import { useState } from "react"



function PositionForm({
  onSubmit,
}) {
  const [formData, setFormData] =
    useState({
      name: "",
      max_votes: 1,
    })



  const [loading, setLoading] =
    useState(false)



  const handleChange = (event) => {
    const { name, value } =
      event.target

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }))
  }



  const handleSubmit = async (
    event
  ) => {
    event.preventDefault()

    setLoading(true)

    try {
      await onSubmit(formData)

      setFormData({
        name: "",
        max_votes: 1,
      })
    }

    catch (error) {
      console.error(error)
    }

    finally {
      setLoading(false)
    }
  }



  return (
    <form
      onSubmit={handleSubmit}
      className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5"
    >
      <div>
        <label className="block text-sm text-zinc-300 mb-2">
          Position Name
        </label>

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter position name"
          className="w-full bg-zinc-950 border border-zinc-700 text-white px-4 py-3 rounded-xl outline-none focus:border-blue-500"
          required
        />
      </div>



      <div>
        <label className="block text-sm text-zinc-300 mb-2">
          Maximum Votes
        </label>

        <input
          type="number"
          name="max_votes"
          value={formData.max_votes}
          onChange={handleChange}
          min="1"
          className="w-full bg-zinc-950 border border-zinc-700 text-white px-4 py-3 rounded-xl outline-none focus:border-blue-500"
          required
        />
      </div>



      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition"
      >
        {loading
          ? "Creating..."
          : "Create Position"}
      </button>
    </form>
  )
}

export default PositionForm