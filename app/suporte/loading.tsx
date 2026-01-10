import { Skeleton } from "@/components/ui/skeleton"

export default function SuporteLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-emerald-50">
      <div className="relative bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Skeleton className="h-16 w-16 mx-auto mb-4 bg-white/20 rounded-full" />
          <Skeleton className="h-12 w-96 mx-auto mb-4 bg-white/20" />
          <Skeleton className="h-6 w-[600px] mx-auto bg-white/20" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>

        <Skeleton className="h-12 w-64 mx-auto mb-8" />
        <Skeleton className="h-64 max-w-3xl mx-auto rounded-xl" />
      </div>
    </div>
  )
}
