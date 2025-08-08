"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, CheckCircle, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { ServiceWithMeta } from "@/app/api/services/serviceServices"
import { useLanguage } from "@/context/language-context"

interface ServicePageClientProps {
  service: ServiceWithMeta
}

export default function ServicePageClient({ service }: ServicePageClientProps) {
  const { t } = useLanguage()

  return (
    <div>
      {/* Breadcrumb */}
      <section className="py-4 bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-primary">
              {t("breadcrumb.home") || "Home"}
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link href="/services" className="text-muted-foreground hover:text-primary">
              {t("breadcrumb.services") || "Services"}
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">{service.title}</span>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Button variant="ghost" asChild className="mb-4 -ml-4">
                <Link href="/services">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t("services.hero.back") || "Back to Services"}
                </Link>
              </Button>
              <Badge variant="secondary" className="mb-4">
                {service.category}
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">{service.title}</h1>
              <p className="text-lg text-muted-foreground mb-8">{service.description}</p>
              {service.price && (
                <div className="mb-8">
                  <div className="text-sm text-muted-foreground">
                    {t("services.price.startingAt") || "Starting at"}
                  </div>
                  <div className="text-2xl font-bold text-primary">{service.price}</div>
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href={`/contact?message=Service: ${service.title}`}>
                    {t("services.hero.quoteButton") || "Get Quote"}
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="tel:+971562647649">
                    <Phone className="h-4 w-4 mr-2" />
                    {t("services.hero.callUs") || "Call Us"}
                  </a>
                </Button>
              </div>
            </div>
            <div className="relative">
              <Image
                src={service.image || "/placeholder.svg"}
                alt={service.title}
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Description Section */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold mb-6">
                {t("services.detail.overviewTitle") || "Service Overview"}
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-muted-foreground leading-relaxed">{service.longDescription}</p>
              </div>
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>{t("services.detail.featuresTitle") || "Key Features"}</CardTitle>
                  <CardDescription>
                    {t("services.detail.featuresDescription") || "What's included in this service"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {service.features?.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
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

      {/* Contact CTA */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto container-padding">
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <CardContent className="p-8">
              <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold mb-4">
                  {t("services.cta.title") || "Ready to Get Started?"}
                </h2>
                <p className="text-muted-foreground mb-8">
                  {t("services.cta.description") ||
                    "Contact our team to discuss your specific requirements and learn how we can help you achieve your goals."}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" asChild>
                    <Link href={`/contact?message=Service: ${service.title}`}>
                      <Mail className="h-4 w-4 mr-2" />
                      {t("services.cta.primary") || "Request Quote"}
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <a href="tel:+971562647649">
                      <Phone className="h-4 w-4 mr-2" />
                      {t("services.cta.secondary") || "Call Now"}
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
