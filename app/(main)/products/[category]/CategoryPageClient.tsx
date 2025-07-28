"use client"

import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ProductCard } from "@/components/product-card"
import { getProductsByCategory, getCategoryBySlug } from "@/lib/data"

interface CategoryPageProps {
  params: {
    category: string
  }
}

export default function CategoryPageClient({ params }: CategoryPageProps) {
  const { category: categorySlug } = params
  const category = getCategoryBySlug(categorySlug)
  const products = getProductsByCategory(categorySlug)

  if (!category) {
    notFound()
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
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              {category.name}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{category.name}</h1>
            <p className="text-lg text-muted-foreground">{category.description}</p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Products ({products.length})</h2>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <div key={product.id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">No products found in this category</div>
              <Button asChild>
                <Link href="/products">Browse All Categories</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Need Something Specific?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Can't find the exact product you're looking for? Contact us for custom solutions or special requests.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/contact?message=Product Inquiry">Request Custom Product</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/services">View Our Services</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
