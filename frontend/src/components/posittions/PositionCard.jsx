function PositionCard({
  position,
  onDelete,
}) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex items-center justify-between">
      <div>
        <h2 className="text-xl font-semibold text-white">
          {position.name}
        </h2>

        <p className="text-zinc-400 mt-1">
          Max Votes: {position.max_votes}
        </p>
      </div>



      <button
        onClick={() =>
          onDelete(position.id)
        }
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition"
      >
        Delete
      </button>
    </div>
  )
}

export default PositionCard