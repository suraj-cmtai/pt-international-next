"use client"

import { motion } from "framer-motion"
import { Search, Grid, List } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch } from "@/lib/redux/store"
import {
  fetchActiveProducts,
  selectActiveProductList,
  selectIsLoading,
  selectHasFetched,
  selectError,
} from "@/lib/redux/features/productSlice"
import { productCategories } from "@/lib/data"

export default function ProductsPage() {
  const dispatch = useDispatch<AppDispatch>()
  const products = useSelector(selectActiveProductList)
  const isLoading = useSelector(selectIsLoading)
  const hasFetched = useSelector(selectHasFetched)
  const error = useSelector(selectError)

  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  useEffect(() => {
    if (!hasFetched) {
      dispatch(fetchActiveProducts())
    }
  }, [dispatch, hasFetched])

  // Group products by category
  const productsByCategory = productCategories.map((category) => ({
    ...category,
    productCount: products.filter((product) => product.category === category.slug).length,
  }))

  const filteredCategories = productsByCategory.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (isLoading && !hasFetched) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading products...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading products: {error}</p>
          <Button onClick={() => dispatch(fetchActiveProducts())}>Try Again</Button>
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
              Our Products
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Comprehensive Product Catalog</h1>
            <p className="text-lg text-muted-foreground">
              Explore our extensive range of life science products designed to meet your research and diagnostic needs.
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
                  placeholder="Search product categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground">
                {filteredCategories.length} categor{filteredCategories.length !== 1 ? "ies" : "y"} found
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

      {/* Categories Grid/List */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto container-padding">
          {filteredCategories.length > 0 ? (
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-6"}>
              {filteredCategories.map((category, index) => (
                <motion.div
                  key={category.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className={`h-full card-hover ${viewMode === "list" ? "flex" : ""}`}>
                    <div
                      className={`${viewMode === "list" ? "w-32 h-32 flex-shrink-0" : "aspect-video"} relative bg-gradient-to-br from-primary/10 to-secondary/10 ${viewMode === "grid" ? "rounded-t-lg" : "rounded-l-lg"} flex items-center justify-center`}
                    >
                      <div className="text-4xl font-bold text-primary/30">{category.name.charAt(0)}</div>
                      {category.productCount > 0 && (
                        <Badge className="absolute top-2 right-2" variant="secondary">
                          {category.productCount}
                        </Badge>
                      )}
                    </div>
                    <div className="flex-1">
                      <CardHeader>
                        <CardTitle className={viewMode === "list" ? "text-lg" : "text-xl"}>{category.name}</CardTitle>
                        <CardDescription>{category.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <Button asChild className="w-full" disabled={category.productCount === 0}>
                          <Link href={`/products/${category.slug}`}>
                            Browse Products {category.productCount > 0 && `(${category.productCount})`}
                          </Link>
                        </Button>
                      </CardContent>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">No categories found matching your search</div>
              <Button variant="outline" onClick={() => setSearchTerm("")}>
                Clear Search
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Featured Products CTA */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto container-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-4">Can't Find What You're Looking For?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Our product catalog is constantly expanding. Contact us for custom products or special requests.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/contact?message=Product Inquiry">Request Product</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/services">View Services</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
