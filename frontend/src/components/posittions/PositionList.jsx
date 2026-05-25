import PositionCard from "./PositionCard"



function PositionList({
  positions,
  onDelete,
}) {
  if (positions.length === 0) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-zinc-400">
        No positions found
      </div>
    )
  }



  return (
    <div className="space-y-4">
      {positions.map((position) => (
        <PositionCard
          key={position.id}
          position={position}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

export default PositionList