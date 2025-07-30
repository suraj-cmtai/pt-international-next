"use client"

import { motion } from "framer-motion"
import { Search, Grid, List, ArrowLeft } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch } from "@/lib/redux/store"
import {
  fetchProductsByCategory,
  selectActiveProductList,
  selectIsLoading,
  selectError,
} from "@/lib/redux/features/productSlice"
import { productCategories } from "@/lib/data"
import { ProductCard } from "@/components/product-card"

interface CategoryPageClientProps {
  params: Promise<{ category: string }>
}

export default function CategoryPageClient({ params }: CategoryPageClientProps) {
  const dispatch = useDispatch<AppDispatch>()
  const products = useSelector(selectActiveProductList)
  const isLoading = useSelector(selectIsLoading)
  const error = useSelector(selectError)

  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [categorySlug, setCategorySlug] = useState<string>("")

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params
      setCategorySlug(resolvedParams.category)
      dispatch(fetchProductsByCategory(resolvedParams.category))
    }
    getParams()
  }, [params, dispatch])

  const category = productCategories.find((cat) => cat.slug === categorySlug)

  // Ensure all products have a string id for ProductCard compatibility
  const filteredProducts = products
    .filter(
      (product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter((product) => typeof product.id === "string" && !!product.id)

  if (isLoading) {
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
          <Button onClick={() => dispatch(fetchProductsByCategory(categorySlug))}>Try Again</Button>
        </div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Category not found</p>
          <Button asChild>
            <Link href="/products">Back to Products</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Breadcrumb */}
      <section className="py-4 bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-primary">
              Home
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link href="/products" className="text-muted-foreground hover:text-primary">
              Products
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">{category.name}</span>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-7xl mx-auto container-padding">
          <Button variant="ghost" asChild className="mb-6 -ml-4">
            <Link href="/products">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Categories
            </Link>
          </Button>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <Badge variant="secondary" className="mb-4">
              {category.name}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{category.name}</h1>
            <p className="text-lg text-muted-foreground">{category.description}</p>
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
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} found
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

      {/* Products Grid/List */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto container-padding">
          {filteredProducts.length > 0 ? (
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-6"}>
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  {/* Use the ProductCard component for each product, ensuring id is string */}
                  <ProductCard product={{ ...product, id: product.id as string }} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                {searchTerm ? "No products found matching your search" : "No products available in this category"}
              </div>
              {searchTerm && (
                <Button variant="outline" onClick={() => setSearchTerm("")}>
                  Clear Search
                </Button>
              )}
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
            <h2 className="text-3xl font-bold mb-4">Need Help Finding the Right Product?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Our experts are here to help you choose the perfect products for your specific needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href={`/contact?message=Product inquiry for ${category.name}`}>Contact Expert</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/products">Browse All Categories</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
