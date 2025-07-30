"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, CheckCircle, ShoppingCart, Download, Share } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Product } from "@/app/api/services/productServices"

// Static category data for display purposes
const categoryInfo: Record<string, { name: string }> = {
  "research-products": { name: "Research Products" },
  "diagnostics-products": { name: "Diagnostics Products" },
  "instruments-consumables": { name: "Instruments & Consumables" },
  "reagents-chemicals": { name: "Reagents & Chemicals" },
  plasticwaresfiltrationunits: { name: "Plasticwares & Filtration Units" },
  "food-testing-kits": { name: "Food Testing Kits" },
  "disinfectant-and-sanitizers": { name: "Disinfectant & Sanitizers" },
}

interface ProductPageClientProps {
  category: string
  product: Product
}

export default function ProductPageClient({ category, product }: ProductPageClientProps) {
  const categoryData = categoryInfo[category] || { name: "Products" }

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
              <div className="aspect-square relative overflow-hidden rounded-lg border">
                <Image
                  src={product.images[0] || "/placeholder.svg"}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
              </div>
              {product.images.length > 1 && (
                <div className="grid grid-cols-3 gap-2">
                  {product.images.slice(1).map((image, index) => (
                    <div key={index} className="aspect-square relative overflow-hidden rounded border">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${product.title} ${index + 2}`}
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
                  {product.specifications && Object.keys(product.specifications).length > 0 ? (
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
