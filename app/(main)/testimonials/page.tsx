"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Star, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {  Select,  SelectContent,  SelectItem,  SelectTrigger,  SelectValue,} from "@/components/ui/select"
import { TestimonialsSection } from "@/components/testimonials-section"
import { testimonials } from "@/lib/testimonials-data"
import { useLanguage } from "@/context/language-context"

const categories = ["all", "research", "diagnostics", "consulting", "quality"]

export default function TestimonialsPage() {
  const { t } = useLanguage()
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredTestimonials = testimonials.filter(
    (testimonial) => selectedCategory === "all" || testimonial.category === selectedCategory
  )

  const averageRating =
    testimonials.reduce((acc, testimonial) => acc + testimonial.rating, 0) / testimonials.length

  return (
    <div>
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-7xl mx-auto container-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <Badge variant="secondary" className="mb-4">
              {t("testimonials.badge")}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t("testimonials.hero.title")}</h1>
            <p className="text-lg text-muted-foreground mb-8">
              {t("testimonials.hero.subtitle")}
            </p>

            <div className="flex items-center justify-center space-x-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < Math.floor(averageRating)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                        }`}
                    />
                  ))}
                </div>
                <div className="text-2xl font-bold">{averageRating.toFixed(1)}/5</div>
                <div className="text-sm text-muted-foreground">{t("testimonials.averageRating")}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{testimonials.length}</div>
                <div className="text-sm text-muted-foreground">{t("testimonials.reviewCount")}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">50+</div>
                <div className="text-sm text-muted-foreground">{t("testimonials.countriesServed")}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder={t("testimonials.filter.all")} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {t(`testimonials.filter.${category}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsSection
        testimonials={filteredTestimonials}
        title=""
        subtitle=""
        showCategory={true}
      />

      {/* CTA Section */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto container-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-4">{t("testimonials.cta.title")}</h2>
            <p className="text-lg text-muted-foreground mb-8">
              {t("testimonials.cta.description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <a href="/contact">{t("testimonials.cta.primary")}</a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="/products">{t("testimonials.cta.secondary")}</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
