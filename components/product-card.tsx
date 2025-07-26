import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ShoppingCart } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/lib/data"

interface ProductCardProps {
  product: Product
  variant?: "default" | "featured"
}

export function ProductCard({ product, variant = "default" }: ProductCardProps) {
  return (
    <Card className={`h-full card-hover ${variant === "featured" ? "border-primary" : ""}`}>
      <div className="aspect-square relative overflow-hidden rounded-t-lg">
        <Image
          src={product.images[0] || "/placeholder.svg"}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
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
