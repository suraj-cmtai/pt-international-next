"use client"

import { useState } from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, CheckCircle, ShoppingCart, Download, Share, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Product } from "@/app/api/services/productServices"

// Static category data for display purposes
const productCategories = [
  {
    slug: "research-products",
    name: "Research Products",
    description: "Advanced tools and kits for cutting-edge research applications",
  },
  {
    slug: "diagnostics-products",
    name: "Diagnostics Products",
    description: "Reliable diagnostic solutions for clinical and laboratory use",
  },
  {
    slug: "instruments-consumables",
    name: "Instruments & Consumables",
    description: "High-quality laboratory instruments and consumable supplies",
  },
  {
    slug: "reagents-chemicals",
    name: "Reagents & Chemicals",
    description: "Pure reagents and chemicals for various applications",
  },
  {
    slug: "plasticwaresfiltrationunits",
    name: "Plasticwares & Filtration Units",
    description: "Laboratory plasticware and filtration solutions",
  },
  {
    slug: "food-testing-kits",
    name: "Food Testing Kits",
    description: "Comprehensive kits for food safety and quality testing",
  },
  {
    slug: "disinfectant-and-sanitizers",
    name: "Disinfectant & Sanitizers",
    description: "Professional-grade disinfection and sanitization products",
  },
]

interface ProductPageClientProps {
  category: string
  product: Product
}

export default function ProductPageClient({ category, product }: ProductPageClientProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const categoryData = productCategories.find((cat) => cat.slug === category)

  if (!product || !categoryData || product.category !== category) {
    notFound()
  }

  const images = product.images || ["/placeholder.svg"]

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const selectImage = (index: number) => {
    setCurrentImageIndex(index)
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
            <Link href={`/products/${category}`} className="text-muted-foreground hover:text-primary">
              {categoryData.name}
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">{product.title}</span>
          </div>
        </div>
      </section>

      {/* Product Details */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto container-padding">
          <Button variant="ghost" asChild className="mb-6 -ml-4">
            <Link href={`/products/${category}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to {categoryData.name}
            </Link>
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image Display */}
              <div className="aspect-square relative overflow-hidden rounded-lg border group">
                <Image
                  src={images[currentImageIndex] || "/placeholder.svg"}
                  alt={product.title}
                  fill
                  className="object-cover cursor-pointer"
                  onClick={() => {
                    // Optional: Add lightbox functionality here
                  }}
                />

                {/* Navigation arrows - only show if multiple images */}
                {images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white/90"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white/90"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>

              {/* Thumbnail Images */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className={`aspect-square relative overflow-hidden rounded border cursor-pointer transition-all ${
                        index === currentImageIndex ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"
                      }`}
                      onClick={() => selectImage(index)}
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${product.title} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <Badge variant="secondary" className="mb-3">
                  {categoryData.name}
                </Badge>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.title}</h1>
                <p className="text-lg text-muted-foreground">{product.description}</p>
              </div>

              {product.price && (
                <div className="p-4 bg-primary/5 rounded-lg">
                  <div className="text-sm text-muted-foreground">Price</div>
                  <div className="text-3xl font-bold text-primary">{product.price}</div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="flex-1" asChild>
                  <Link href={`/contact?message=Product: ${product.title}`}>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Enquire Now
                  </Link>
                </Button>
                <Button size="lg" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Datasheet
                </Button>
                <Button size="lg" variant="outline">
                  <Share className="h-4 w-4" />
                </Button>
              </div>

              {product.features && product.features.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Key Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-primary mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Product Details Tabs */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto container-padding">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="support">Support</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Product Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="text-muted-foreground leading-relaxed">{product.longDescription}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="specifications" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Technical Specifications</CardTitle>
                </CardHeader>
                <CardContent>
                  {product.specifications ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-2 border-b">
                          <span className="font-medium">{key}:</span>
                          <span className="text-muted-foreground">{value}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      Detailed specifications are available upon request. Contact our technical team for more
                      information.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="support" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Support & Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Available Resources:</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Product datasheet and technical specifications</li>
                        <li>• User manual and installation guide</li>
                        <li>• Safety data sheet (SDS)</li>
                        <li>• Certificate of analysis (COA)</li>
                        <li>• Technical support documentation</li>
                      </ul>
                    </div>
                    <div className="pt-4">
                      <Button asChild>
                        <Link href="/contact?message=Technical Support Request">Contact Technical Support</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}
