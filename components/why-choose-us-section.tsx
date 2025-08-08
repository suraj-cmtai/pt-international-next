"use client"

import { motion } from "framer-motion"
import { useLanguage } from "@/context/language-context"
import {
  Award,
  Globe,
  Users,
  Clock,
  Shield,
  Headphones,
  CheckCircle,
  TrendingUp
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { WhyChooseUsFeature } from "@/lib/testimonials-data"

interface WhyChooseUsSectionProps {
  features: WhyChooseUsFeature[]
  variant?: "default" | "compact"
}

const iconMap = {
  Award,
  Globe,
  Users,
  Clock,
  Shield,
  HeadphonesIcon: Headphones,
  CheckCircle,
  TrendingUp
}

export function WhyChooseUsSection({ features, variant = "default" }: WhyChooseUsSectionProps) {
  const { t } = useLanguage()

  const title = t("whyChoose.title")
  const subtitle = t("whyChoose.subtitle")

  return (
    <section className={`${variant === "default" ? "section-padding" : "py-12"}`}>
      <div className="max-w-7xl mx-auto container-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className={`${variant === "default" ? "text-3xl md:text-4xl" : "text-2xl md:text-3xl"} font-bold mb-4`}>
            {title}
          </h2>
          <p className={`${variant === "default" ? "text-lg" : "text-base"} text-muted-foreground max-w-3xl mx-auto`}>
            {subtitle}
          </p>
        </motion.div>

        <div
          className={`grid grid-cols-1 ${variant === "default" ? "md:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-2"
            } gap-6`}
        >
          {features.map((feature, index) => {
            const IconComponent = iconMap[feature.icon as keyof typeof iconMap] || CheckCircle
            const translatedTitle = t(`whyChoose.features.${feature.id}.title`)
            const translatedDescription = t(`whyChoose.features.${feature.id}.description`)
            const translatedLabel = feature.stats?.label
              ? t(`whyChoose.features.${feature.id}.label`)
              : undefined

            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full card-hover text-center">
                  <CardHeader>
                    <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className={`${variant === "default" ? "text-xl" : "text-lg"} mb-2`}>
                      {translatedTitle}
                    </CardTitle>
                    {feature.stats && (
                      <div className="mb-3">
                        <div className="text-2xl font-bold text-primary">{feature.stats.number}</div>
                        <Badge variant="secondary" className="text-xs">
                          {translatedLabel}
                        </Badge>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {translatedDescription}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
