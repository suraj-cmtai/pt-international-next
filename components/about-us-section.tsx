"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import type { AboutUsSection as AboutUsSectionType } from "@/lib/testimonials-data"
import { useLanguage } from "@/context/language-context"

interface AboutUsSectionProps {
  sections: AboutUsSectionType[]
  variant?: "default" | "compact"
}

export function AboutUsSection({ sections, variant = "default" }: AboutUsSectionProps) {
  const { t, language } = useLanguage()

  return (
    <div dir={language === "ar" ? "rtl" : "ltr"} className={`space-y-16`}>
      {sections.map((section, index) => {
        const isReversed = language === "ar" ? index % 2 === 0 : index % 2 === 1

        return (
          <section
            key={section.id}
            className={variant === "default" ? "section-padding" : "py-12"}
          >
            <div className="max-w-7xl mx-auto container-padding">
              <div
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${isReversed ? "lg:grid-flow-col-dense" : ""
                  }`}
              >
                {/* Text content */}
                <motion.div
                  initial={{ opacity: 0, x: isReversed ? 20 : -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className={isReversed ? "lg:col-start-2" : ""}
                >
                  <h2
                    className={`${variant === "default"
                        ? "text-3xl md:text-4xl"
                        : "text-2xl md:text-3xl"
                      } font-bold mb-6`}
                  >
                    {t(section.title)}
                  </h2>

                  <div className="prose prose-lg max-w-none mb-8">
                    <p className="text-muted-foreground leading-relaxed">
                      {t(section.content)}
                    </p>
                  </div>

                  {section.stats && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {section.stats.map((stat, statIndex) => (
                        <motion.div
                          key={statIndex}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: statIndex * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <Card className="text-center p-4">
                            <CardContent className="p-0">
                              <div className="text-2xl font-bold text-primary mb-1">
                                {stat.number}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {t(stat.label)}
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>

                {/* Image */}
                <motion.div
                  initial={{ opacity: 0, x: isReversed ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className={isReversed ? "lg:col-start-1 lg:row-start-1" : ""}
                >
                  {section.image && (
                    <div className="relative">
                      <Image
                        src={section.image || "/placeholder.svg"}
                        alt={t(section.title) || "About Us Image"}
                        width={600}
                        height={400}
                        className="rounded-lg shadow-lg aspect-square"
                      />
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </section>
        )
      })}
    </div>
  )
}
