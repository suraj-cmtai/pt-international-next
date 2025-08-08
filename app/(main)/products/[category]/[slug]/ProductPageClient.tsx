"use client"

import { useState } from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, CheckCircle, ShoppingCart, Download, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Product } from "@/app/api/services/productServices"
import { useLanguage } from "@/context/language-context"

// Static category data (with translation keys)
const productCategories = [
  {
    "slug": "research-products",
    "name": "products.categories.research-products.title",
    "description": "products.categories.research-products.description"
  },
  {
    "slug": "diagnostics-products",
    "name": "products.categories.diagnostics-products.title",
    "description": "products.categories.diagnostics-products.description"
  },
  {
    "slug": "instruments-consumables",
    "name": "products.categories.instruments-consumables.title",
    "description": "products.categories.instruments-consumables.description"
  },
  {
    "slug": "reagents-chemicals",
    "name": "products.categories.reagents-chemicals.title",
    "description": "products.categories.reagents-chemicals.description"
  },
  {
    "slug": "plasticwaresfiltrationunits",
    "name": "products.categories.plasticwaresfiltrationunits.title",
    "description": "products.categories.plasticwaresfiltrationunits.description"
  },
  {
    "slug": "food-testing-kits",
    "name": "products.categories.food-testing-kits.title",
    "description": "products.categories.food-testing-kits.description"
  },
  {
    "slug": "disinfectant-and-sanitizers",
    "name": "products.categories.disinfectant-and-sanitizers.title",
    "description": "products.categories.disinfectant-and-sanitizers.description"
  }
]

interface ProductPageClientProps {
  category: string
  product: Product
}

export default function ProductPageClient({ category, product }: ProductPageClientProps) {
  const { t } = useLanguage()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showBrochure, setShowBrochure] = useState(false)

  const categoryData = productCategories.find((cat) => cat.slug === category)
  const categoryName = categoryData ? t(categoryData.name) : ""

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
          <div className="flex flex-wrap items-center space-x-2 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-primary">
              {t("common.home")}
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link href="/products" className="text-muted-foreground hover:text-primary">
              {t("products.title")}
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link href={`/products/${category}`} className="text-muted-foreground hover:text-primary">
              {categoryName}
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">{product.title}</span>
          </div>
        </div>
      </section>

      {/* Product Section */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto container-padding">
          <Button variant="ghost" asChild className="mb-6 -ml-4">
            <Link href={`/products/${category}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("products.detail.backToCategory").replace("{{category}}", categoryName)}
            </Link>
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-square relative overflow-hidden rounded-lg border group w-full max-w-md mx-auto lg:max-w-none">
                <Image
                  src={images[currentImageIndex]}
                  alt={product.title}
                  fill
                  className="object-cover cursor-pointer"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                {images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute left-2 top-1/2 -translate-y-1/2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white/90"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white/90"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto lg:max-w-none">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className={`aspect-square relative overflow-hidden rounded border cursor-pointer transition-all ${index === currentImageIndex ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"
                        }`}
                      onClick={() => selectImage(index)}
                    >
                      <Image
                        src={image}
                        alt={`${product.title} ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 25vw, 10vw"
                        priority={index === 0}
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
                  {categoryName}
                </Badge>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.title}</h1>
                <p className="text-lg text-muted-foreground">{product.description}</p>
              </div>

              {product.price && (
                <div className="p-4 bg-primary/5 rounded-lg">
                  <div className="text-sm text-muted-foreground">{t("products.detail.priceLabel")}</div>
                  <div className="text-3xl font-bold text-primary">{product.price}</div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="flex-1 p-2" asChild>
                  <Link href={`/contact?message=Product: ${product.title}`}>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {t("products.detail.enquireButton")}
                  </Link>
                </Button>

                {product.brochure && (
                  <>
                    <Button size="lg" variant="outline" onClick={() => setShowBrochure(!showBrochure)}>
                      <Download className="h-4 w-4 mr-2" />
                      {showBrochure ? t("products.detail.hideBrochure") : t("products.detail.viewBrochure")}
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                      <Link href={product.brochure} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 mr-2" />
                        {t("products.detail.downloadBrochure")}
                      </Link>
                    </Button>
                  </>
                )}
              </div>

              {/* Inline PDF */}
              {product.brochure && showBrochure && (
                <div className="mt-4 w-full">
                  <div className="rounded border overflow-hidden" style={{ minHeight: 300, height: "50vh" }}>
                    <iframe
                      src={product.brochure}
                      title="Product Brochure"
                      width="100%"
                      height="100%"
                      style={{ border: "none" }}
                    />
                  </div>
                </div>
              )}

              {product.features?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t("products.detail.featuresTitle")}</CardTitle>
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
      {/* Tabs */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto container-padding">
          <Tabs defaultValue="description">
            {/* Scrollable Tabs on mobile */}
            <TabsList className="flex w-full overflow-x-auto sm:grid sm:grid-cols-3">
              <TabsTrigger value="description" className="flex-shrink-0">
                {t("products.detail.tabs.description")}
              </TabsTrigger>
              <TabsTrigger value="specifications" className="flex-shrink-0">
                {t("products.detail.tabs.specifications")}
              </TabsTrigger>
              <TabsTrigger value="support" className="flex-shrink-0">
                {t("products.detail.tabs.support")}
              </TabsTrigger>
            </TabsList>

            {/* Description */}
            <TabsContent value="description" className="mt-10 sm:mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("products.detail.descriptionTitle")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.longDescription}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Specifications */}
            <TabsContent value="specifications" className="mt-10 sm:mt-6 mb-12">
              <Card>
                <CardHeader>
                  <CardTitle>{t("products.detail.specificationsTitle")}</CardTitle>
                </CardHeader>
                <CardContent>
                  {product.specifications ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <div
                          key={key}
                          className="flex flex-col sm:flex-row sm:justify-between py-2 border-b"
                        >
                          <span className="font-medium">{key}:</span>
                          <span className="text-muted-foreground">{value}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      {t("products.detail.noSpecifications")}
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Support */}
            <TabsContent value="support" className="mt-10 sm:mt-6 mb-12">
              <Card>
                <CardHeader>
                  <CardTitle>{t("products.detail.supportTitle")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Resources List */}
                    <div>
                      <h4 className="font-medium mb-2">
                        {t("products.detail.resourcesTitle")}
                      </h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• {t("products.detail.resources.datasheet")}</li>
                        <li>• {t("products.detail.resources.manual")}</li>
                        <li>• {t("products.detail.resources.sds")}</li>
                        <li>• {t("products.detail.resources.coa")}</li>
                        <li>• {t("products.detail.resources.documentation")}</li>
                      </ul>
                    </div>

                    {/* Support Button */}
                    <div className="pt-4 flex flex-col items-center sm:flex-row sm:justify-start">
                      <Button asChild className="w-full sm:w-auto">
                        <Link href="/contact?message=Technical Support Request">
                          {t("products.detail.techsupportButton")}
                        </Link>
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
