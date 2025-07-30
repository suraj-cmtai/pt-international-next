import ServicePageClient from "./ServicePageClient"
import ServiceService from "@/app/api/services/serviceServices"
import { notFound } from "next/navigation"

export const metadata = {
  title: "Service Details",
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const resolvedParams = await params

  // Fetch the service by slug using ServiceService (server-side)
  const service = await ServiceService.getServiceBySlug(resolvedParams.slug)

  // If service not found, show 404
  if (!service) {
    notFound()
  }

  return <ServicePageClient service={service} />
}

export async function generateStaticParams() {
  // This static list is a fallback; ideally, fetch all services and map to { slug }
  return [
    { slug: "research-services" },
    { slug: "diagnostic-services" },
    { slug: "consulting" },
    { slug: "quality-control" },
    { slug: "method-development" },
    { slug: "training-services" },
  ]
}
