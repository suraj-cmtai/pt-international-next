"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Search, Edit, Trash2, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

const serviceCategories = ["Research", "Diagnostics", "Consulting", "Quality", "Development", "Education"]

const initialServices = [
  {
    id: "1",
    title: "Research Services",
    category: "Research",
    description: "Comprehensive research solutions for academic and commercial laboratories",
    price: "Contact for pricing",
    slug: "research-services",
    image: "/placeholder.svg?height=200&width=300",
    features: [
      "Custom research protocol development",
      "Data analysis and interpretation",
      "Regulatory compliance consulting",
    ],
  },
  {
    id: "2",
    title: "Diagnostic Services",
    category: "Diagnostics",
    description: "Advanced diagnostic testing and analysis for healthcare providers",
    price: "Varies by test",
    slug: "diagnostic-services",
    image: "/placeholder.svg?height=200&width=300",
    features: ["Clinical chemistry analysis", "Molecular diagnostics", "Immunoassay testing"],
  },
]

export default function ServicesPage() {
  const [services, setServices] = useState(initialServices)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [newService, setNewService] = useState({
    title: "",
    category: "",
    description: "",
    price: "",
    slug: "",
    image: "",
    features: ["", "", ""],
  })
  const { toast } = useToast()

  const filteredServices = services.filter(
    (service) =>
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        setSelectedImage(imageUrl)
        setNewService({ ...newService, image: imageUrl })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...newService.features]
    updatedFeatures[index] = value
    setNewService({ ...newService, features: updatedFeatures })
  }

  const addFeature = () => {
    setNewService({ ...newService, features: [...newService.features, ""] })
  }

  const removeFeature = (index: number) => {
    const updatedFeatures = newService.features.filter((_, i) => i !== index)
    setNewService({ ...newService, features: updatedFeatures })
  }

  const handleAddService = () => {
    if (!newService.title || !newService.category || !newService.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const service = {
      ...newService,
      id: Date.now().toString(),
      slug: newService.title.toLowerCase().replace(/\s+/g, "-"),
      image: selectedImage || "/placeholder.svg?height=200&width=300&query=" + newService.title,
      features: newService.features.filter((feature) => feature.trim() !== ""),
    }

    setServices([...services, service])
    setNewService({ title: "", category: "", description: "", price: "", slug: "", image: "", features: ["", "", ""] })
    setSelectedImage(null)
    setIsAddDialogOpen(false)

    toast({
      title: "Success",
      description: "Service added successfully!",
    })
  }

  const handleDeleteService = (id: string) => {
    setServices(services.filter((s) => s.id !== id))
    toast({
      title: "Success",
      description: "Service deleted successfully!",
    })
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Services Management</h1>
            <p className="text-muted-foreground">Manage your service offerings and descriptions</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Service
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Service</DialogTitle>
                <DialogDescription>Create a new service entry for your catalog</DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Service Title *</Label>
                    <Input
                      id="title"
                      value={newService.title}
                      onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                      placeholder="Enter service title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={newService.category}
                      onValueChange={(value) => setNewService({ ...newService, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={newService.description}
                    onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                    placeholder="Enter service description"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price (Optional)</Label>
                  <Input
                    id="price"
                    value={newService.price}
                    onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                    placeholder="Contact for pricing"
                  />
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <Label>Service Image</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    {selectedImage ? (
                      <div className="relative">
                        <Image
                          src={selectedImage || "/placeholder.svg"}
                          alt="Service preview"
                          width={300}
                          height={200}
                          className="rounded-lg mx-auto"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => {
                            setSelectedImage(null)
                            setNewService({ ...newService, image: "" })
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <div className="text-sm text-gray-600 mb-2">
                          <label htmlFor="image-upload" className="cursor-pointer text-primary hover:underline">
                            Click to upload
                          </label>{" "}
                          or drag and drop
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                        <input
                          id="image-upload"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2">
                  <Label>Key Features</Label>
                  {newService.features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        placeholder={`Feature ${index + 1}`}
                      />
                      {newService.features.length > 1 && (
                        <Button variant="outline" size="sm" onClick={() => removeFeature(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={addFeature}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Feature
                  </Button>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddService}>Add Service</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="card-hover">
              <div className="aspect-video relative bg-muted rounded-t-lg overflow-hidden">
                <Image src={service.image || "/placeholder.svg"} alt={service.title} fill className="object-cover" />
              </div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                    <Badge variant="secondary" className="mt-1">
                      {service.category}
                    </Badge>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteService(service.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">{service.description}</CardDescription>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Key Features:</div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {service.features.slice(0, 3).map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                {service.price && <div className="mt-4 text-lg font-semibold text-primary">{service.price}</div>}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <div className="text-lg font-semibold mb-2">No services found</div>
          <p className="text-muted-foreground">
            {searchTerm ? "Try adjusting your search terms" : "Get started by adding your first service"}
          </p>
        </div>
      )}
    </div>
  )
}
