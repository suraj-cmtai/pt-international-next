import ServiceService from "@/app/api/services/serviceServices"
import ServicesPageClient from "./ServicesPageClient"

export const metadata = {
  title: "Our Services",
  description: "Comprehensive life science services for research and diagnostics",
}

export default async function ServicesPage() {
  // Fetch active services on the server
  const services = await ServiceService.getActiveServices()

  return <ServicesPageClient initialServices={services} />
}
