"use client"

import { Microscope, TestTube, Shield, Award, CheckCircle } from "lucide-react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TestimonialsSection } from "@/components/testimonials-section"
import { WhyChooseUsSection } from "@/components/why-choose-us-section"
import { getFeaturedTestimonials, whyChooseUsFeatures } from "@/lib/testimonials-data"
import { HeroSection } from "@/components/home/hero-section"
import { StatsSection } from "@/components/home/stats-section"
import { GallerySection } from "@/components/home/gallery-section"
import { ServicesSection } from "@/components/home/services-section"
import { ProductsSection } from "@/components/home/products-section"
import { motion } from "framer-motion"
import { useLanguage } from "@/context/language-context"

const features = [
  {
    icon: Microscope,
    titleKey: "home.features.0.title",
    descKey: "home.features.0.description",
  },
  {
    icon: TestTube,
    titleKey: "home.features.1.title",
    descKey: "home.features.1.description",
  },
  {
    icon: Shield,
    titleKey: "home.features.2.title",
    descKey: "home.features.2.description",
  },
  {
    icon: Award,
    titleKey: "home.features.3.title",
    descKey: "home.features.3.description",
  },
]

const benefits = [
  "home.benefits.0",
  "home.benefits.1",
  "home.benefits.2",
  "home.benefits.3",
]

const recognitions = [
  { name: "ISO 9001:2015", descriptionKey: "home.recognition.iso" },
  { name: "FDA Registered", descriptionKey: "home.recognition.fda" },
  { name: "CE Marking", descriptionKey: "home.recognition.ce" },
  { name: "GMP Certified", descriptionKey: "home.recognition.gmp" },
]

export default function HomePage() {
  const { t } = useLanguage()

  return (
    <div>
      <HeroSection />
      <StatsSection />
      <WhyChooseUsSection features={whyChooseUsFeatures} />
      <ServicesSection />
      <ProductsSection />
      <GallerySection />

      {/* Features Section */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto container-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("home.setsApart.title")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("home.setsApart.description")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.titleKey}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full card-hover text-center">
                  <CardHeader>
                    <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">
                      {t(feature.titleKey)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{t(feature.descKey)}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6">
                {t("home.benefits.title")}
              </h2>
              <p className="text-muted-foreground mb-8">
                {t("home.benefits.description")}
              </p>
              <div className="space-y-4">
                {benefits.map((key, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-3" />
                    <span className="text-sm">{t(key)}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Image
                src="/lab-med.jpg"
                alt="Laboratory Facility"
                width={500}
                height={400}
                className="rounded-lg shadow-lg aspect-square"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection testimonials={getFeaturedTestimonials()} />

      {/* Industry Recognition Section */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto container-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("home.recognition.title")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("home.recognition.description")}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {recognitions.map((cert, index) => (
              <motion.div
                key={cert.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{cert.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {t(cert.descriptionKey)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
