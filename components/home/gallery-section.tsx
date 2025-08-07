"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Eye, X, ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import {
  fetchActiveGallery,
  selectActiveGalleryList,
  selectIsLoading,
  type GalleryItem,
} from "@/lib/redux/features/gallerySlice"
import type { AppDispatch, RootState } from "@/lib/redux/store"
import { useLanguage } from "@/context/language-context"

export function GallerySection() {
  const { t } = useLanguage()
  const dispatch = useDispatch<AppDispatch>()
  const galleryItems: GalleryItem[] = useSelector((state: RootState) => selectActiveGalleryList(state))
  const loading = useSelector((state: RootState) => selectIsLoading(state))

  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    dispatch(fetchActiveGallery())
  }, [dispatch])

  const visibleItems = Array.isArray(galleryItems) ? galleryItems.slice(0, 4) : []

  const openLightbox = (item: GalleryItem, idx: number) => {
    setSelectedImage(item)
    setCurrentIndex(idx)
  }
  const closeLightbox = () => setSelectedImage(null)
  const navigateImage = (direction: "prev" | "next") => {
    if (!visibleItems.length) return
    let newIndex =
      direction === "prev"
        ? (currentIndex - 1 + visibleItems.length) % visibleItems.length
        : (currentIndex + 1) % visibleItems.length
    setCurrentIndex(newIndex)
    setSelectedImage(visibleItems[newIndex])
  }

  if (loading) {
    return (
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-12">
            <div className="h-8 w-48 bg-gray-200 rounded mx-auto mb-4 animate-pulse" />
            <div className="h-6 w-96 bg-gray-200 rounded mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-64 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (!visibleItems.length) return null

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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("gallery.title")}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("gallery.description")}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {visibleItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
              onClick={() => openLightbox(item, index)}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full">
                <div className="relative h-64">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    fill
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                    <Eye className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-primary mb-2 line-clamp-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">{item.description}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    {item.createdOn ? new Date(item.createdOn).toLocaleDateString("en-US") : ""}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Lightbox Modal */}
        <Dialog open={!!selectedImage} onOpenChange={closeLightbox}>
          <DialogContent className="max-w-3xl w-full p-0 bg-black/95 border-0" showCloseButton={false}>
            <DialogTitle hidden className="sr-only">{t("gallery.lightbox.title")}</DialogTitle>
            <AnimatePresence>
              {selectedImage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="relative h-[60vh] md:h-[70vh]"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-4 z-10 text-white hover:bg-white/20"
                    onClick={closeLightbox}
                  >
                    <X className="h-6 w-6" />
                  </Button>

                  {visibleItems.length > 1 && (
                    <>
                      <div className="absolute top-1/2 -translate-y-1/2 left-4 z-20">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigateImage("prev")}
                          className="text-white rounded-full hover:bg-white/20 hover:text-white"
                        >
                          <ChevronLeft className="h-8 w-8" />
                        </Button>
                      </div>
                      <div className="absolute top-1/2 -translate-y-1/2 right-4 z-20">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigateImage("next")}
                          className="text-white rounded-full hover:bg-white/20 hover:text-white"
                        >
                          <ChevronRight className="h-8 w-8" />
                        </Button>
                      </div>
                    </>
                  )}

                  <div
                    className="relative h-full w-full flex items-center justify-center"
                    style={{
                      backgroundImage: `url('/placeholder.svg')`,
                      backgroundSize: "contain",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                    }}
                  >
                    <Image
                      src={selectedImage.image || "/placeholder.svg"}
                      alt={selectedImage.title}
                      fill
                      className="object-contain"
                      sizes="90vw"
                      priority
                    />
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent text-center text-white">
                    <h3 className="text-xl font-medium">{selectedImage.title}</h3>
                    {selectedImage.category && <p className="text-sm text-gray-300 mt-1">{selectedImage.category}</p>}
                    {visibleItems.length > 1 && (
                      <p className="text-xs text-gray-400 mt-2">
                        {currentIndex + 1} / {visibleItems.length}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </DialogContent>
        </Dialog>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button size="lg" asChild>
            <Link href="/gallery">
              {t("gallery.button")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
