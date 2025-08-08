"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Star, Quote } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Testimonial } from "@/lib/testimonials-data"
import { useLanguage } from "@/context/language-context"

interface TestimonialsSectionProps {
  testimonials: Testimonial[]
  title?: string
  subtitle?: string
  showCategory?: boolean
  variant?: "default" | "compact"
}

export function TestimonialsSection({
  testimonials,
  title,
  subtitle,
  showCategory = false,
  variant = "default",
}: TestimonialsSectionProps) {
  const { t } = useLanguage()

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ))
  }

  return (
    <section className={`${variant === "default" ? "section-padding" : "py-12"} bg-gray-50`}>
      <div className="max-w-7xl mx-auto container-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className={`${variant === "default" ? "text-3xl md:text-4xl" : "text-2xl md:text-3xl"} font-bold mb-4`}>
            {title || t("testimonials.title")}
          </h2>
          <p className={`${variant === "default" ? "text-lg" : "text-base"} text-muted-foreground max-w-2xl mx-auto`}>
            {subtitle || t("testimonials.subtitle")}
          </p>
        </motion.div>

        <div
          className={`grid grid-cols-1 ${variant === "default" ? "md:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-2"} gap-6`}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full card-hover">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="relative">
                      <Image
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.name}
                        width={60}
                        height={60}
                        className="rounded-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm">{testimonial.name}</h4>
                      <p className="text-xs text-muted-foreground">{testimonial.title}</p>
                      <p className="text-xs text-muted-foreground font-medium">{testimonial.company}</p>
                      {showCategory && testimonial.category && (
                        <Badge variant="outline" className="mt-1 text-xs">
                          {t(`testimonials.categories.${testimonial.category}`, testimonial.category)}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center mb-3">{renderStars(testimonial.rating)}</div>

                  <div className="relative">
                    <Quote className="absolute -top-2 -left-2 h-6 w-6 text-primary/20" />
                    <p className="text-sm text-muted-foreground leading-relaxed pl-4">
                      {t(`testimonials.content.${testimonial.id}`, testimonial.content)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
