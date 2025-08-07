"use client"

import { motion } from "framer-motion"
import { Search, AlertCircle, RefreshCw } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { useLanguage } from "@/context/language-context"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Product } from "@/lib/redux/features/productSlice"

const productCategories = [
  {
    slug: "research-products",
    nameKey: "products.categories.research-products.name",
    descriptionKey: "products.categories.research-products.description"
  },
  {
    slug: "diagnostics-products",
    nameKey: "products.categories.diagnostics-products.name",
    descriptionKey: "products.categories.diagnostics-products.description"
  },
  {
    slug: "instruments-consumables",
    nameKey: "products.categories.instruments-consumables.name",
    descriptionKey: "products.categories.instruments-consumables.description"
  },
  {
    slug: "reagents-chemicals",
    nameKey: "products.categories.reagents-chemicals.name",
    descriptionKey: "products.categories.reagents-chemicals.description"
  },
  {
    slug: "plasticwaresfiltrationunits",
    nameKey: "products.categories.plasticwaresfiltrationunits.name",
    descriptionKey: "products.categories.plasticwaresfiltrationunits.description"
  },
  {
    slug: "food-testing-kits",
    nameKey: "products.categories.food-testing-kits.name",
    descriptionKey: "products.categories.food-testing-kits.description"
  },
  {
    slug: "disinfectant-and-sanitizers",
    nameKey: "products.categories.disinfectant-and-sanitizers.name",
    descriptionKey: "products.categories.disinfectant-and-sanitizers.description"
  }
]

interface ProductsPageClientProps {
  initialProducts: Product[]
  loading?: boolean
  error?: string | null
}

export default function ProductsPageClient({ initialProducts, loading = false, error = null }: ProductsPageClientProps) {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode] = useState<"grid" | "list">("grid")

  const productsByCategory = productCategories.map((category) => ({
    ...category,
    name: t(category.nameKey),
    description: t(category.descriptionKey),
    productCount: initialProducts.filter((product) => product.category === category.slug).length,
  }))

  const filteredCategories = productsByCategory.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Skeleton */}
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t("products.error.title")}</h2>
            <p className="text-gray-600 mb-6">{t("products.error.message")}</p>
            <div className="text-sm text-gray-500 bg-gray-50 rounded-md p-3 mb-6">
              <strong>{t("products.error.label")}:</strong> {error}
            </div>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="border-primary text-primary hover:bg-primary hover:text-white"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {t("products.error.refresh")}
            </Button>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Hero */}
      <section className="section-padding bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-7xl mx-auto container-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <Badge variant="secondary" className="mb-4">
              {t("products.badge")}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t("products.title")}</h1>
            <p className="text-lg text-muted-foreground">{t("products.description")}</p>
          </motion.div>
        </div>
      </section>

      {/* Filter */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("products.search.placeholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredCategories.length}{" "}
              {filteredCategories.length === 1
                ? t("products.search.resultLabel.single")
                : t("products.search.resultLabel.plural")}
            </div>

          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto container-padding">
          {filteredCategories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCategories.map((category, index) => (
                <motion.div
                  key={category.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full card-hover">
                    <div className="aspect-video relative bg-gradient-to-br from-primary/10 to-secondary/10 rounded-t-lg flex items-center justify-center">
                      <div className="text-4xl font-bold text-primary/30">{category.name.charAt(0)}</div>
                      {category.productCount > 0 && (
                        <Badge className="absolute top-2 right-2" variant="secondary">
                          {category.productCount}
                        </Badge>
                      )}
                    </div>
                    <CardHeader>
                      <CardTitle>{category.name}</CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Button asChild className="w-full" disabled={category.productCount === 0}>
                        <Link href={`/products/${category.slug}`}>
                          {t("products.cta.request")} {category.productCount > 0 && `(${category.productCount})`}
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">{t("products.empty")}</div>
              <Button variant="outline" onClick={() => setSearchTerm("")}>
                {t("products.search.clear")}
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
            <h2 className="text-3xl font-bold mb-4">{t("products.cta.title")}</h2>
            <p className="text-lg text-muted-foreground mb-8">{t("products.cta.description")}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/contact?message=Product Inquiry">{t("products.cta.request")}</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/services">{t("products.cta.services")}</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
