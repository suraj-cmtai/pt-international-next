import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ProductCard } from "@/components/product-card"
import { getCategoryBySlug, getProductsByCategory } from "@/lib/data"

interface CategoryPageProps {
  params: {
    category: string
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = getCategoryBySlug(params.category)
  const products = getProductsByCategory(params.category)

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
      <section className="section-padding">
        <div className="max-w-7xl mx-auto container-padding">
          <Button variant="ghost" asChild className="mb-4 -ml-4">
            <Link href="/products">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Link>
          </Button>
          <Badge variant="secondary" className="mb-4">
            Product Category
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{category.name}</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">{category.description}</p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Available Products</h2>
            <div className="text-sm text-muted-foreground">
              {products.length} product{products.length !== 1 ? "s" : ""} available
            </div>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Products Available</h3>
              <p className="text-muted-foreground mb-6">
                We're currently updating our {category.name.toLowerCase()} catalog. Check back soon or contact us for
                availability.
              </p>
              <Button asChild>
                <Link href="/contact?message=Product Availability Inquiry">Contact Us</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Need Help Choosing?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Our technical experts can help you select the right products for your specific applications.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/contact?message=Product Selection Help">Get Expert Advice</Link>
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

export async function generateStaticParams() {
  return [
    { category: "research-products" },
    { category: "diagnostics-products" },
    { category: "instruments-consumables" },
    { category: "reagents-chemicals" },
    { category: "plasticwaresfiltrationunits" },
    { category: "food-testing-kits" },
    { category: "disinfectant-and-sanitizers" },
  ]
}
