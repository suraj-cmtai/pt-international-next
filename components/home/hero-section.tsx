"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden hero-gradient text-white">
      <div className="absolute inset-0 bg-black/10" />
      <div className="relative max-w-7xl mx-auto container-padding section-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30 mb-6">
            Leading Life Sciences Solutions
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Advancing Science,
            <br />
            <span className="text-white/90">Improving Lives</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8">
            PT International Lifesciences LLC provides cutting-edge research products, diagnostic solutions, and
            scientific instruments to laboratories worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="default" asChild>
              <Link href="/products">
                Explore Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary bg-transparent"
              asChild
            >
              <Link href="/contact">Get Quote</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
