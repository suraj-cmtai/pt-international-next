"use client"

import { motion } from "framer-motion"
import { Search, Grid, List, AlertCircle, RefreshCw } from "lucide-react"
import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/context/language-context"
import type { Service } from "@/lib/data"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

interface ServicesPageClientProps {
  initialServices: Service[]
  loading?: boolean
  error?: string | null
}

export default function ServicesPageClient({
  initialServices,
  loading = false,
  error = null,
}: ServicesPageClientProps) {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const categories = useMemo(() => {
    const set = new Set<string>()
    initialServices.forEach((service) => {
      if (service.category) set.add(service.category)
    })
    return ["All", ...Array.from(set).sort()]
  }, [initialServices])

  const filteredServices = initialServices.filter((service) => {
    const matchesCategory = selectedCategory === "All" || service.category === selectedCategory
    const matchesSearch =
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.category.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <section className="section-padding bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="max-w-7xl mx-auto container-padding">
            <div className="max-w-3xl mx-auto text-center">
              <div className="h-6 w-32 bg-gray-200 rounded mx-auto mb-4 animate-pulse" />
              <div className="h-12 w-96 bg-gray-200 rounded mx-auto mb-6 animate-pulse" />
              <div className="h-6 w-80 bg-gray-200 rounded mx-auto animate-pulse" />
            </div>
          </div>
        </section>

        <section className="section-padding">
          <div className="max-w-7xl mx-auto container-padding">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="space-y-3">
                  <div className="h-48 bg-gray-200 rounded-lg animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-lg p-8 text-center"
          >
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t("services.error.title")}</h2>
            <p className="text-gray-600 mb-6">{t("services.error.description")}</p>
            <div className="text-sm text-gray-500 bg-gray-50 rounded-md p-3 mb-6">
              <strong>{t("services.error.label")}</strong> {error}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="border-primary text-primary hover:bg-primary hover:text-white"
              >
                <RefreshCw className="h-4 w-4" />
                {t("services.error.button")}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-7xl mx-auto container-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <Badge variant="secondary" className="mb-4">
              {t("services.hero.badge")}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t("services.hero.title")}</h1>
            <p className="text-lg text-muted-foreground">{t("services.hero.description")}</p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("services.search.placeholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex-1 md:w-64">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-64">
                    <SelectValue placeholder={t("services.category.placeholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground">
                {filteredServices.length} {t("services.count.label")}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto container-padding">
          {filteredServices.length > 0 ? (
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-6"}>
              {filteredServices.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className={`h-full card-hover ${viewMode === "list" ? "flex" : ""}`}>
                    <div
                      className={`${viewMode === "list" ? "w-48 h-32 flex-shrink-0" : "aspect-video"} relative overflow-hidden ${viewMode === "grid" ? "rounded-t-lg" : "rounded-l-lg"}`}
                    >
                      <Image
                        src={service.image || "/placeholder.svg"}
                        alt={service.title}
                        fill
                        className="object-cover"
                      />
                      <Badge className="absolute top-2 right-2" variant="secondary">
                        {service.category}
                      </Badge>
                    </div>
                    <div className="flex-1">
                      <CardHeader>
                        <CardTitle className={viewMode === "list" ? "text-lg" : "text-xl"}>
                          {service.title}
                        </CardTitle>
                        <CardDescription>{service.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        {service.price && (
                          <div className="mb-4">
                            <div className="text-sm text-muted-foreground">{t("services.price.startingAt")}</div>
                            <div className="text-lg font-bold text-primary">{service.price}</div>
                          </div>
                        )}
                        <Button asChild className="w-full">
                          <Link href={`/services/${service.slug}`}>{t("services.button.learnMore")}</Link>
                        </Button>
                      </CardContent>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">{t("services.noResults")}</div>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("All")
                }}
              >
                {t("services.button.clearSearch")}
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto container-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-4">{t("services.cta.title")}</h2>
            <p className="text-lg text-muted-foreground mb-8">{t("services.cta.description")}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/contact?message=Custom Service Inquiry">{t("services.cta.primary")}</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/products">{t("services.cta.secondary")}</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
