"use client"

import { useEffect, useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, Search, LayoutGrid, List } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/context/language-context"

interface Service {
  id: string
  name: string
  description: string
  price?: string
  image?: string
  slug: string
}

interface ServicesPageClientProps {
  initialServices: Service[]
  error?: string | null
}

export default function ServicesPageClient({ initialServices, error }: ServicesPageClientProps) {
  const { t } = useLanguage()
  const [services, setServices] = useState<Service[]>(initialServices)
  const [searchTerm, setSearchTerm] = useState("")
  const [isGridView, setIsGridView] = useState(true)

  useEffect(() => {
    setServices(initialServices)
  }, [initialServices])

  const filteredServices = useMemo(() => {
    if (!searchTerm.trim()) return services
    const lower = searchTerm.toLowerCase()
    return services.filter((service) =>
      service.name.toLowerCase().includes(lower) ||
      service.description.toLowerCase().includes(lower)
    )
  }, [searchTerm, services])

  if (error) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t("services.error.title")}</h2>
        <p className="text-gray-600 mb-6">{t("services.error.message")}</p>
        <div className="text-sm text-gray-500 bg-gray-50 rounded-md p-3 mb-6">
          <strong>{t("services.error.details")}</strong> {error}
        </div>
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
          className="border-primary text-primary hover:bg-primary hover:text-white"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          {t("services.error.button")}
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-12">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <Badge variant="secondary" className="mb-4">{t("services.hero.badge")}</Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-6">{t("services.hero.title")}</h1>
        <p className="text-lg text-muted-foreground">{t("services.hero.description")}</p>
      </div>

      {/* Search + Toggle */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            placeholder={t("services.search.placeholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button variant={isGridView ? "default" : "outline"} onClick={() => setIsGridView(true)}>
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button variant={!isGridView ? "default" : "outline"} onClick={() => setIsGridView(false)}>
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Result Count */}
      <div className="text-sm text-muted-foreground mb-4">
        {t("services.search.results")
          .replace("{{count}}", String(filteredServices.length))
          .replace("{{plural}}", filteredServices.length !== 1 ? "s" : "")
        }
      </div>

      {/* Services List */}
      {filteredServices.length > 0 ? (
        <div className={`grid gap-6 ${isGridView ? "md:grid-cols-3" : "grid-cols-1"}`}>
          {filteredServices.map((service) => (
            <div key={service.id} className="border rounded-lg p-6 hover:shadow-md transition">
              <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
              <p className="text-muted-foreground mb-4">{service.description}</p>
              {service.price && (
                <div className="mb-4">
                  <div className="text-sm text-muted-foreground">{t("services.card.startingAt")}</div>
                  <div className="text-lg font-bold text-primary">{service.price}</div>
                </div>
              )}
              <Button asChild className="w-full">
                <Link href={`/services/${service.slug}`}>{t("services.card.button")}</Link>
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center mt-20">
          <div className="text-muted-foreground mb-4">{t("services.empty")}</div>
          <Button variant="outline" onClick={() => setSearchTerm("")}>
            {t("services.search.clear")}
          </Button>
        </div>
      )}

      {/* CTA Section */}
      <div className="mt-20 text-center bg-muted rounded-xl p-10 space-y-4">
        <h2 className="text-3xl font-bold mb-4">{t("services.cta.title")}</h2>
        <p className="text-lg text-muted-foreground mb-8">{t("services.cta.description")}</p>
        <div className="flex justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/contact?message=Custom Service Inquiry">{t("services.cta.button.primary")}</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/products">{t("services.cta.button.secondary")}</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}