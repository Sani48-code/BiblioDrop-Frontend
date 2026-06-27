const SkeletonCard = () => (
  <div className="rounded-2xl overflow-hidden border border-base-200">
    <div className="h-56 skeleton-shimmer" />
    <div className="p-4 space-y-3">
      <div className="h-3 skeleton-shimmer rounded-full w-16" />
      <div className="h-5 skeleton-shimmer rounded w-4/5" />
      <div className="h-4 skeleton-shimmer rounded w-3/5" />
      <div className="flex justify-between mt-4">
        <div className="h-6 skeleton-shimmer rounded w-16" />
        <div className="h-8 skeleton-shimmer rounded-xl w-24" />
      </div>
    </div>
  </div>
)

export default SkeletonCard
