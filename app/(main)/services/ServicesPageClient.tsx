"use client"

import { motion } from "framer-motion"
import { Search, Grid, List } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { ServiceWithMeta } from "@/app/api/services/serviceServices"

interface ServicesPageClientProps {
  initialServices: ServiceWithMeta[]
}

export default function ServicesPageClient({ initialServices }: ServicesPageClientProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const filteredServices = initialServices.filter(
    (service) =>
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
              Our Services
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Professional Life Science Services</h1>
            <p className="text-lg text-muted-foreground">
              Comprehensive solutions for your research, diagnostic, and analytical needs with expert consultation and
              support.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground">
                {filteredServices.length} service{filteredServices.length !== 1 ? "s" : ""} found
              </div>
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid/List */}
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
                        <CardTitle className={viewMode === "list" ? "text-lg" : "text-xl"}>{service.title}</CardTitle>
                        <CardDescription>{service.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        {service.price && (
                          <div className="mb-4">
                            <div className="text-sm text-muted-foreground">Starting at</div>
                            <div className="text-lg font-bold text-primary">{service.price}</div>
                          </div>
                        )}
                        <Button asChild className="w-full">
                          <Link href={`/services/${service.slug}`}>Learn More</Link>
                        </Button>
                      </CardContent>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">No services found matching your search</div>
              <Button variant="outline" onClick={() => setSearchTerm("")}>
                Clear Search
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto container-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-4">Need Custom Solutions?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Our team of experts can develop tailored solutions to meet your specific requirements. Contact us to
              discuss your project.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/contact?message=Custom Service Inquiry">Request Consultation</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/products">View Products</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
