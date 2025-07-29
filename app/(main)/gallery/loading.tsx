import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section Skeleton */}
      <section className="bg-primary text-white py-20">
        <div className="w-full max-w-7xl mx-auto px-4">
          <div className="text-center">
            <Skeleton className="h-16 w-96 mx-auto mb-6 bg-white/20" />
            <Skeleton className="h-6 w-[600px] mx-auto bg-white/20" />
          </div>
        </div>
      </section>

      {/* Filters Section Skeleton */}
      <section className="py-8 bg-white border-b">
        <div className="w-full max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            <Skeleton className="h-10 w-80" />
            <div className="flex gap-4 items-center">
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid Skeleton */}
      <section className="py-12">
        <div className="w-full max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="h-64 w-full rounded-lg" />
                <div className="space-y-2 p-4">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
