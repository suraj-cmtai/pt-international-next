"use client"

import { useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ServiceCard } from "@/components/service-card"
import type { Service } from "@/lib/data"

// Redux imports
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/lib/redux/store"
import { fetchActiveServices } from "@/lib/redux/features/serviceSlice"

// i18n
import { useLanguage } from "@/context/language-context"

export function ServicesSection() {
  const { t } = useLanguage()
  const dispatch = useDispatch<AppDispatch>()
  const { services, loading } = useSelector((state: RootState) => state.services)

  useEffect(() => {
    dispatch(fetchActiveServices())
  }, [dispatch])

  // Only show first 3 active services
  const activeServices = useMemo(
    () => (Array.isArray(services) ? services.filter((s) => s.isActive).slice(0, 3) : []),
    [services]
  )

  if (loading) {
    return (
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-12">
            <div className="h-8 w-96 bg-gray-200 rounded mx-auto mb-4 animate-pulse" />
            <div className="h-6 w-full max-w-2xl bg-gray-200 rounded mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-96 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (!activeServices || activeServices.length === 0) {
    return null
  }

  return (
    <section className="section-padding bg-gray-50">
      <div className="max-w-7xl mx-auto container-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("services.title")}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("services.description")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {activeServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <ServiceCard service={service} variant="default" />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button size="lg" asChild>
            <Link href="/services">
              {t("services.button")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
