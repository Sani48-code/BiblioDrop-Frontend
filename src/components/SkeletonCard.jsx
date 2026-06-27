const SkeletonCard = () => (
  <div className="card bg-base-200 animate-pulse rounded-2xl">
    <div className="h-52 bg-base-300 rounded-t-2xl" />
    <div className="card-body gap-3">
      <div className="h-4 bg-base-300 rounded w-3/4" />
      <div className="h-3 bg-base-300 rounded w-1/2" />
      <div className="h-3 bg-base-300 rounded w-1/3" />
    </div>
  </div>
)

export default SkeletonCard
