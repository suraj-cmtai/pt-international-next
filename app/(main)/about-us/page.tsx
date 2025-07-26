"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Users, Target, Eye, Award, Globe } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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

      {/* Mission & Vision */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <div className="flex items-center mb-4">
                  <Target className="h-6 w-6 text-primary mr-3" />
                  <h2 className="text-2xl font-bold">Our Mission</h2>
                </div>
                <p className="text-muted-foreground">
                  To empower scientific discovery and improve global health by providing high-quality, innovative life
                  science products and exceptional customer service to researchers and healthcare professionals
                  worldwide.
                </p>
              </div>

              <div>
                <div className="flex items-center mb-4">
                  <Eye className="h-6 w-6 text-secondary mr-3" />
                  <h2 className="text-2xl font-bold">Our Vision</h2>
                </div>
                <p className="text-muted-foreground">
                  To be the leading global provider of life science solutions, driving innovation and excellence in
                  research, diagnostics, and healthcare through cutting-edge technology and unwavering commitment to
                  quality.
                </p>
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
                alt="Our Laboratory"
                width={500}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto container-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These values guide everything we do and shape our commitment to excellence in the life sciences industry.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full text-center card-hover">
                  <CardHeader>
                    <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10">
                      <value.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{value.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto container-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Our Journey</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Key milestones that have shaped PT International Lifesciences LLC into the company we are today.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center mb-8 last:mb-0"
              >
                <div className="flex-1 pr-6">
                  <Card className="card-hover">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{milestone.title}</CardTitle>
                        <Badge variant="outline">{milestone.year}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{milestone.description}</CardDescription>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
