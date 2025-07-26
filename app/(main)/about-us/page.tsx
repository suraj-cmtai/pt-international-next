"use client"

import { motion } from "framer-motion"
import { Users, Target, Award, Globe } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { AboutUsSection } from "@/components/about-us-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { WhyChooseUsSection } from "@/components/why-choose-us-section"
import { aboutUsSections, getFeaturedTestimonials, whyChooseUsFeatures } from "@/lib/testimonials-data"

const values = [
  {
    icon: Target,
    title: "Excellence",
    description: "We strive for excellence in everything we do, from product quality to customer service.",
  },
  {
    icon: Users,
    title: "Collaboration",
    description: "We believe in the power of collaboration to drive scientific advancement and innovation.",
  },
  {
    icon: Globe,
    title: "Global Impact",
    description: "Our solutions reach laboratories worldwide, contributing to global health and research.",
  },
  {
    icon: Award,
    title: "Integrity",
    description: "We maintain the highest standards of integrity and ethical practices in all our operations.",
  },
]

const milestones = [
  { year: "2008", title: "Company Founded", description: "PT International Lifesciences LLC was established" },
  { year: "2012", title: "Global Expansion", description: "Expanded operations to serve 25+ countries" },
  { year: "2016", title: "Product Innovation", description: "Launched advanced diagnostic solutions" },
  { year: "2020", title: "Digital Transformation", description: "Implemented cutting-edge digital platforms" },
  { year: "2024", title: "Sustainability Initiative", description: "Launched comprehensive sustainability program" },
]

export default function AboutUsPage() {
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
              About PT International
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Pioneering Life Sciences Solutions</h1>
            <p className="text-lg text-muted-foreground">
              For over 15 years, PT International Lifesciences LLC has been at the forefront of providing innovative
              research products, diagnostic solutions, and scientific instruments to laboratories worldwide.
            </p>
          </motion.div>
        </div>
      </section>

      {/* About Us Sections */}
      <AboutUsSection sections={aboutUsSections} />

      {/* Why Choose Us */}
      <section className="bg-gray-50">
        <WhyChooseUsSection
          features={whyChooseUsFeatures}
          title="Our Competitive Advantages"
          subtitle="What sets us apart in the life sciences industry"
          variant="compact"
        />
      </section>

      {/* Testimonials */}
      <TestimonialsSection
        testimonials={getFeaturedTestimonials()}
        title="Trusted by Industry Leaders"
        subtitle="See what our customers say about working with us"
        variant="compact"
      />
    </div>
  )
}
