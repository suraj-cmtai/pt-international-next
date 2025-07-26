"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/lib/data"

interface ProductCardProps {
  product: Product
  variant?: "default" | "featured"
}

export function ProductCard({ product, variant = "default" }: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)
  }

  return (
    <Card className={`h-full card-hover ${variant === "featured" ? "border-primary" : ""}`}>
      <div className="aspect-square relative overflow-hidden rounded-t-lg group">
        <Image
          src={product.images[currentImageIndex] || "/placeholder.svg"}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
        />

        {/* Image Navigation */}
        {product.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
              {product.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{product.title}</CardTitle>
            <Badge variant="secondary" className="mb-3 text-xs">
              {product.category.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </Badge>
          </div>
          {product.price && (
            <div className="text-right">
              <div className="font-semibold text-primary text-lg">{product.price}</div>
            </div>
          )}
        </div>
        <CardDescription className="line-clamp-2">{product.description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2 text-sm">Key Features:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              {product.features.slice(0, 2).map((feature, index) => (
                <li key={index} className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex gap-2">
            <Button asChild size="sm" className="flex-1">
              <Link href={`/products/${product.category}/${product.slug}`}>
                View Details
                <ArrowRight className="ml-2 h-3 w-3" />
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/contact?message=Product: ${product.title}`}>
                <ShoppingCart className="h-3 w-3" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
