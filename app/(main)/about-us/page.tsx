"use client"

import { motion } from "framer-motion"
import { Users, Target, Award, Globe } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { AboutUsSection } from "@/components/about-us-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { WhyChooseUsSection } from "@/components/why-choose-us-section"
import { aboutUsSections, getFeaturedTestimonials, whyChooseUsFeatures } from "@/lib/testimonials-data"
import { useLanguage } from "@/context/language-context"

export default function AboutUsPage() {
  const { t } = useLanguage()

  const values = [
    {
      icon: Target,
      title: t("about.values.excellence.title"),
      description: t("about.values.excellence.description"),
    },
    {
      icon: Users,
      title: t("about.values.collaboration.title"),
      description: t("about.values.collaboration.description"),
    },
    {
      icon: Globe,
      title: t("about.values.globalImpact.title"),
      description: t("about.values.globalImpact.description"),
    },
    {
      icon: Award,
      title: t("about.values.integrity.title"),
      description: t("about.values.integrity.description"),
    },
  ]

  const milestones = [
    {
      year: "2012",
      title: t("about.milestones.2012.title"),
      description: t("about.milestones.2012.description"),
    },
    {
      year: "2016",
      title: t("about.milestones.2016.title"),
      description: t("about.milestones.2016.description"),
    },
    {
      year: "2020",
      title: t("about.milestones.2020.title"),
      description: t("about.milestones.2020.description"),
    },
    {
      year: "2024",
      title: t("about.milestones.2024.title"),
      description: t("about.milestones.2024.description"),
    },
  ]

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
              {t("about.hero.badge")}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t("about.hero.title")}</h1>
            <p className="text-lg text-muted-foreground">{t("about.hero.description")}</p>
          </motion.div>
        </div>
      </section>

      {/* About Us Sections */}
      <AboutUsSection sections={aboutUsSections} />

      {/* Why Choose Us */}
      <section className="bg-gray-50">
        <WhyChooseUsSection
          features={whyChooseUsFeatures}
          variant="compact"
        />
      </section>

      {/* Testimonials */}
      <TestimonialsSection
        testimonials={getFeaturedTestimonials()}
        title={t("testimonials.title")}
        subtitle={t("testimonials.subtitle")}
        variant="compact"
      />
    </div>
  )
}
