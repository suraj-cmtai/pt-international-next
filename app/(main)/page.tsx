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

const features = [
  {
    icon: Microscope,
    title: "Research Excellence",
    description: "Cutting-edge research products and solutions for scientific advancement",
  },
  {
    icon: TestTube,
    title: "Diagnostic Solutions",
    description: "Comprehensive diagnostic tools and testing kits for accurate results",
  },
  {
    icon: Shield,
    title: "Quality Assurance",
    description: "Rigorous quality control processes ensuring reliable products",
  },
  {
    icon: Award,
    title: "Industry Recognition",
    description: "Trusted by leading institutions and research facilities worldwide",
  },
]

const benefits = [
  "ISO 9001:2015 Certified Quality",
  "Global Shipping & Support",
  "Expert Technical Assistance",
  "Competitive Pricing",
]

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <StatsSection />

      {/* Why Choose Us Section */}
      <WhyChooseUsSection features={whyChooseUsFeatures} />

      {/* Services Section */}
      <ServicesSection />

      {/* Products Section */}
      <ProductsSection />

      {/* Gallery Section */}
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Sets Us Apart</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We combine scientific expertise with innovative solutions to deliver exceptional products and services.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
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
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
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
              <h2 className="text-3xl font-bold mb-6">Trusted by Scientists Worldwide</h2>
              <p className="text-muted-foreground mb-8">
                With over 15 years of experience, we've built a reputation for excellence in the life sciences industry.
                Our commitment to quality and innovation has made us a preferred partner for researchers globally.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-3" />
                    <span className="text-sm">{benefit}</span>
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
                src="/placeholder.svg?height=400&width=500"
                alt="Laboratory Facility"
                width={500}
                height={400}
                className="rounded-lg shadow-lg"
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Industry Recognition</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our commitment to excellence has earned us recognition from leading industry organizations.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: "ISO 9001:2015", description: "Quality Management" },
              { name: "FDA Registered", description: "Medical Devices" },
              { name: "CE Marking", description: "European Conformity" },
              { name: "GMP Certified", description: "Good Manufacturing" },
            ].map((cert, index) => (
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
                <p className="text-sm text-muted-foreground">{cert.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
