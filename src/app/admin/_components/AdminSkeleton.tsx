/**
 * Reusable pulse skeleton for admin card lists.
 * Pass `rows` to control how many skeleton cards to show.
 */
export default function AdminSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="bg-white border-2 border-gray-100 rounded-2xl p-5 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-100 rounded-lg w-1/3" />
              <div className="h-3 bg-gray-100 rounded-lg w-1/2" />
              <div className="h-3 bg-gray-100 rounded-lg w-1/4" />
            </div>
            <div className="flex gap-2">
              <div className="h-7 w-14 bg-gray-100 rounded-lg" />
              <div className="h-7 w-14 bg-gray-100 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
