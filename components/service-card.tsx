import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Service } from "@/lib/data"

interface ServiceCardProps {
  service: Service
  variant?: "default" | "featured"
}

export function ServiceCard({ service, variant = "default" }: ServiceCardProps) {
  return (
    <Card className={`h-full card-hover ${variant === "featured" ? "border-primary" : ""}`}>
      <div className="aspect-video relative overflow-hidden rounded-t-lg">
        <Image
          src={service.image || "/placeholder.svg"}
          alt={service.title}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
            <Badge variant="secondary" className="mb-3">
              {service.category}
            </Badge>
          </div>
          {service.price && (
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Starting at</div>
              <div className="font-semibold text-primary">{service.price}</div>
            </div>
          )}
        </div>
        <CardDescription>{service.description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Key Features:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              {service.features.slice(0, 3).map((feature, index) => (
                <li key={index} className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex gap-2">
            <Button asChild className="flex-1">
              <Link href={`/services/${service.slug}`}>
                Learn More
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/contact?message=Service: ${service.title}`}>Get Quote</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
