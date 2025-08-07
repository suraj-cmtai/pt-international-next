"use client"

import { motion } from "framer-motion"
import { Search, Grid, List, ArrowLeft } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/app/api/services/productServices"
import { ProductCard } from "@/components/product-card"

// Static category data for display purposes
const categoryInfo: Record<string, { name: string; description: string }> = {
  "research-products": {
    name: "Research Products",
    description: "Advanced tools and kits for cutting-edge research applications",
  },
  "diagnostics-products": {
    name: "Diagnostics Products",
    description: "Reliable diagnostic solutions for clinical and laboratory use",
  },
  "instruments-consumables": {
    name: "Instruments & Consumables",
    description: "High-quality laboratory instruments and consumable supplies",
  },
  "reagents-chemicals": {
    name: "Reagents & Chemicals",
    description: "Pure reagents and chemicals for various applications",
  },
  plasticwaresfiltrationunits: {
    name: "Plasticwares & Filtration Units",
    description: "Laboratory plasticware and filtration solutions",
  },
  "food-testing-kits": {
    name: "Food Testing Kits",
    description: "Comprehensive kits for food safety and quality testing",
  },
  "disinfectant-and-sanitizers": {
    name: "Disinfectant & Sanitizers",
    description: "Professional-grade disinfection and sanitization products",
  },
}

interface CategoryPageClientProps {
  category: string
  initialProducts: Product[]
}

export default function CategoryPageClient({ category, initialProducts }: CategoryPageClientProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const categoryData = categoryInfo[category] || { name: "Products", description: "Product category" }

  const filteredProducts = initialProducts.filter(
    (product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
            <span className="text-foreground">{categoryData.name}</span>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-7xl mx-auto container-padding">
          <Button variant="ghost" asChild className="mb-6 -ml-4">
            <Link href="/products">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Link>
          </Button>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <Badge variant="secondary" className="mb-4">
              {categoryData.name}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{categoryData.name}</h1>
            <p className="text-lg text-muted-foreground">{categoryData.description}</p>
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
              {/* <div className="flex border rounded-md">
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
              </div> */}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid/List */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto container-padding">
          {filteredProducts.length > 0 ? (
            viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    {/* Custom list view using ProductCard, but with horizontal layout */}
                    <div className="flex bg-white rounded-lg border card-hover group overflow-hidden shadow-sm">
                      {/* Image section */}
                      <div className="relative w-48 h-40 flex-shrink-0 overflow-hidden">
                        <ProductCardImageGallery images={product.images} title={product.title} />
                      </div>
                      {/* Info section */}
                      <div className="flex-1 flex flex-col justify-between p-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="secondary" className="text-xs">
                              {product.category}
                            </Badge>
                            {product.price && (
                              <span className="text-lg font-semibold text-primary">{product.price}</span>
                            )}
                          </div>
                          <div className="font-semibold text-lg mb-1 line-clamp-2">{product.title}</div>
                          <div className="text-sm text-muted-foreground mb-2 line-clamp-2">{product.description}</div>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {product.features.slice(0, 2).map((feature, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                            {product.features.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{product.features.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="text-xs text-muted-foreground">{product.features.length} features</div>
                          <Button asChild size="sm">
                            <Link href={`/products/${category}/${product.slug}`}>View Details</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )
          ) : (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">No products found in this category</div>
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
            <h2 className="text-3xl font-bold mb-4">Need Help Choosing?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Our experts can help you select the right products for your specific needs. Contact us for personalized
              recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/contact?message=Product Selection Help">Get Expert Advice</Link>
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

// Helper component for image gallery in list view (mimics ProductCard image logic)
function ProductCardImageGallery({
  images,
  title,
}: {
  images: string[]
  title: string
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  if (!images || images.length === 0) {
    images = ["/placeholder.svg"]
  }

  // Only show arrows/dots if more than one image
  return (
    <div className="relative w-full h-full group">
      <img
        src={images[currentImageIndex] || "/placeholder.svg"}
        alt={title}
        className="object-cover w-full h-full transition-transform group-hover:scale-105"
        style={{ borderRadius: "0.5rem" }}
      />
      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white/90"
            onClick={e => {
              e.preventDefault()
              e.stopPropagation()
              setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
            }}
            tabIndex={-1}
            type="button"
          >
            <span className="sr-only">Previous image</span>
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white/90"
            onClick={e => {
              e.preventDefault()
              e.stopPropagation()
              setCurrentImageIndex((prev) => (prev + 1) % images.length)
            }}
            tabIndex={-1}
            type="button"
          >
            <span className="sr-only">Next image</span>
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
            {images.map((_, idx) => (
              <button
                key={idx}
                className={`w-2 h-2 rounded-full transition-colors ${
                  idx === currentImageIndex ? "bg-white" : "bg-white/50"
                }`}
                onClick={e => {
                  e.preventDefault()
                  e.stopPropagation()
                  setCurrentImageIndex(idx)
                }}
                tabIndex={-1}
                type="button"
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}