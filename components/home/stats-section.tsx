"use client"

import { motion } from "framer-motion"

const stats = [
  { number: "500+", label: "Products" },
  { number: "50+", label: "Countries" },
  { number: "1000+", label: "Clients" },
  { number: "15+", label: "Years Experience" },
]

export function StatsSection() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.number}</div>
              <div className="text-muted-foreground text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
