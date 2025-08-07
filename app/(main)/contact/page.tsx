"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useSearchParams } from "next/navigation"
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/context/language-context"

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { t } = useLanguage()

  useEffect(() => {
    const messageParam = searchParams.get("message")
    if (messageParam) {
      setFormData((prev) => ({ ...prev, message: messageParam }))
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("name", formData.name)
      formDataToSend.append("email", formData.email)
      formDataToSend.append("phone", formData.phone)
      formDataToSend.append("subject", formData.subject)
      formDataToSend.append("message", formData.message)

      const response = await fetch("/api/routes/contact", {
        method: "POST",
        body: formDataToSend,
      })

      const result = await response.json()

      if (response.ok && result.success) {
        toast({
          title: t("contact.toast.successTitle"),
          description: t("contact.toast.successDescription"),
        })
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
      } else {
        throw new Error(result.error || t("contact.toast.errorDefault"))
      }
    } catch (error) {
      toast({
        title: t("contact.toast.errorTitle"),
        description: error instanceof Error ? error.message : t("contact.toast.errorDefault"),
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

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
              {t("contact.hero.badge")}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t("contact.hero.title")}</h1>
            <p className="text-lg text-muted-foreground">{t("contact.hero.description")}</p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="lg:col-span-2 lg:sticky lg:top-20"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">{t("contact.form.title")}</CardTitle>
                    <CardDescription>{t("contact.form.description")}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">{t("contact.form.name")} *</Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder={t("contact.form.namePlaceholder")}
                            autoComplete="name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">{t("contact.form.email")} *</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder={t("contact.form.emailPlaceholder")}
                            autoComplete="email"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">{t("contact.form.phone")} *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          placeholder={t("contact.form.phonePlaceholder")}
                          autoComplete="tel"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">{t("contact.form.subject")} *</Label>
                        <Input
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          placeholder={t("contact.form.subjectPlaceholder")}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">{t("contact.form.message")} *</Label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows={6}
                          placeholder={t("contact.form.messagePlaceholder")}
                        />
                      </div>

                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? t("contact.form.sending") : (
                          <>
                            {t("contact.form.send")}
                            <Send className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold mb-4">{t("contact.info.title")}</h2>
                <p className="text-muted-foreground mb-6">{t("contact.info.description")}</p>
              </div>

              {[
                {
                  icon: Mail,
                  title: t("contact.info.email"),
                  value: "ptinternationallifescience@gmail.com",
                },
                {
                  icon: Phone,
                  title: t("contact.info.phone"),
                  value: "+971562647649",
                },
                {
                  icon: MapPin,
                  title: t("contact.info.address"),
                  value: `PT INTERNATIONAL LIFESCIENCES LLC\nSharjah Media City, Sharjah, UAE\nP.O Box 839- Sharjah`,
                },
                {
                  icon: Clock,
                  title: t("contact.info.hours"),
                  value: `${t("contact.info.weekdays")}\n${t("contact.info.saturday")}`,
                },
              ].map((item, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <item.icon className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h3 className="font-medium mb-1">{item.title}</h3>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">{item.value}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </div>

          {/* Map Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-12"
          >
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative w-full h-64">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18..."
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute top-0 left-0 w-full h-full"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
