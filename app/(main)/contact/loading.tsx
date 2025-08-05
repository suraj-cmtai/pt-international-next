import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section Skeleton */}
      <section className="section-padding bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="max-w-3xl mx-auto text-center">
            <Skeleton className="h-6 w-32 mx-auto mb-4" />
            <Skeleton className="h-12 w-80 mx-auto mb-6" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
        </div>
      </section>

      {/* Contact Form Skeleton */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <Skeleton className="h-8 w-48" />
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-12 w-32" />
              </div>
            </div>
            <div className="space-y-6">
              <Skeleton className="h-8 w-48" />
              <div className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
