"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Eye,
  RefreshCw,
  AlertCircle,
} from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch } from "@/lib/redux/store"
import { useLanguage } from "@/context/language-context"
import {
  fetchActiveGallery,
  selectActiveGalleryList,
  selectIsLoading,
  selectHasFetched,
  selectError,
} from "@/lib/redux/features/gallerySlice"
import Loading from "./loading"

const DUMMY_GALLERY = [
  {
    id: "1",
    title: "Laboratory Instruments",
    description: "High-precision laboratory instruments for research and diagnostics at PT International Lifesciences.",
    category: "Instruments",
    image: "/placeholder.svg",
    createdOn: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Research Products",
    description: "Innovative research products supporting scientific discovery.",
    category: "Research",
    image: "/placeholder.svg",
    createdOn: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Diagnostics Solutions",
    description: "Reliable diagnostics products for accurate results.",
    category: "Diagnostics",
    image: "/placeholder.svg",
    createdOn: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Consumables & Reagents",
    description: "Quality consumables and reagents for laboratory workflows.",
    category: "Consumables",
    image: "/placeholder.svg",
    createdOn: new Date().toISOString(),
  },
  {
    id: "5",
    title: "Events & Exhibitions",
    description: "PT International Lifesciences at industry events and exhibitions.",
    category: "Events",
    image: "/placeholder.svg",
    createdOn: new Date().toISOString(),
  },
  {
    id: "6",
    title: "Best Life Sciences Supplier Award 2023",
    description: "PT International Lifesciences received the Best Life Sciences Supplier Award in 2023 for outstanding service and product quality.",
    category: "Awards",
    image: "/placeholder.svg",
    createdOn: new Date().toISOString(),
  },
  {
    id: "7",
    title: "Excellence in Diagnostics Innovation 2022",
    description: "Recognized for excellence in diagnostics innovation at the National Science Expo 2022.",
    category: "Awards",
    image: "/placeholder.svg",
    createdOn: new Date().toISOString(),
  },
  {
    id: "8",
    title: "ISO 9001:2015 Certification",
    description: "PT International Lifesciences is proud to be ISO 9001:2015 certified for quality management systems.",
    category: "Awards",
    image: "/placeholder.svg",
    createdOn: new Date().toISOString(),
  },
]

export default function GalleryPage() {
  const dispatch = useDispatch<AppDispatch>()
  const galleryItems = useSelector(selectActiveGalleryList)
  const isLoading = useSelector(selectIsLoading)
  const hasFetched = useSelector(selectHasFetched)
  const error = useSelector(selectError)
  const { t } = useLanguage()

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedImage, setSelectedImage] = useState<any>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    if (!hasFetched && !error) {
      dispatch(fetchActiveGallery())
    }
  }, [dispatch, hasFetched, error])

  const items = error ? DUMMY_GALLERY : galleryItems
  const categories = [...new Set(items.map((item) => item.category))]

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const openLightbox = (item: any) => {
    setSelectedImage(item)
    setCurrentImageIndex(filteredItems.findIndex((i) => i.id === item.id))
  }

  const navigateImage = (direction: "prev" | "next") => {
    const newIndex =
      direction === "prev"
        ? (currentImageIndex - 1 + filteredItems.length) % filteredItems.length
        : (currentImageIndex + 1) % filteredItems.length
    setCurrentImageIndex(newIndex)
    setSelectedImage(filteredItems[newIndex])
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      Instruments: "bg-blue-100 text-blue-800",
      Research: "bg-purple-100 text-purple-800",
      Diagnostics: "bg-green-100 text-green-800",
      Consumables: "bg-orange-100 text-orange-800",
      Events: "bg-teal-100 text-teal-800",
      Awards: "bg-yellow-100 text-yellow-800",
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  if (!hasFetched && !error || isLoading) {
    return <Loading />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="section-padding bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-7xl mx-auto container-padding text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <Badge variant="secondary" className="mb-4">{t("gallery.badge")}</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t("gallery.title1")}</h1>
            <p className="text-lg text-muted-foreground">{t("gallery.description1")}</p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={t("gallery.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-4 items-center">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder={t("gallery.allCategories")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("gallery.allCategories")}</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="text-sm text-gray-600">
                {filteredItems.length} / {items.length}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group cursor-pointer"
                onClick={() => openLightbox(item)}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-64">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      fill
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-colors">
                      <Eye className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <Badge className={`absolute top-3 left-3 ${getCategoryColor(item.category)}`}>
                      {item.category}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-primary mb-2 line-clamp-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">{item.description}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(item.createdOn).toLocaleDateString("en-US")}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">{t("gallery.noResults")}</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-5xl w-full p-0 bg-black/95 border-0" showCloseButton={false}>
          <DialogTitle className="hidden">{selectedImage?.title}</DialogTitle>
          <AnimatePresence>
            {selectedImage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="relative h-[90vh]"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-4 z-10 text-white hover:bg-white/20"
                  onClick={() => setSelectedImage(null)}
                >
                  <X className="h-6 w-6" />
                </Button>

                {filteredItems.length > 1 && (
                  <>
                    <div className="absolute top-1/2 -translate-y-1/2 left-4 z-20">
                      <Button variant="ghost" size="icon" onClick={() => navigateImage("prev")} className="text-white rounded-full hover:bg-white/20">
                        <ChevronLeft className="h-8 w-8" />
                      </Button>
                    </div>
                    <div className="absolute top-1/2 -translate-y-1/2 right-4 z-20">
                      <Button variant="ghost" size="icon" onClick={() => navigateImage("next")} className="text-white rounded-full hover:bg-white/20">
                        <ChevronRight className="h-8 w-8" />
                      </Button>
                    </div>
                  </>
                )}

                <div className="relative h-full w-full flex items-center justify-center">
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
                  {selectedImage.category && (
                    <p className="text-sm text-gray-300 mt-1">{selectedImage.category}</p>
                  )}
                  {filteredItems.length > 1 && (
                    <p className="text-xs text-gray-400 mt-2">
                      {/* Do not use t() for current/total, just show "current of total" */}
                      {`${currentImageIndex + 1} of ${filteredItems.length}`}
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </div>
  )
}