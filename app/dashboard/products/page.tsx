"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Search, Edit, Trash2, Package, Upload, X } from "lucide-react"
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

const productCategories = [
  "research-products",
  "diagnostics-products",
  "instruments-consumables",
  "reagents-chemicals",
  "plasticwaresfiltrationunits",
  "food-testing-kits",
  "disinfectant-and-sanitizers",
]

const initialProducts = [
  {
    id: "1",
    title: "Advanced PCR Kit",
    category: "research-products",
    description: "High-performance PCR amplification kit for research applications",
    price: "$299.99",
    slug: "advanced-pcr-kit",
    images: ["/placeholder.svg?height=200&width=200"],
  },
  {
    id: "2",
    title: "COVID-19 Rapid Test",
    category: "diagnostics-products",
    description: "Fast and accurate COVID-19 antigen detection test",
    price: "$15.99",
    slug: "covid-19-rapid-test",
    images: ["/placeholder.svg?height=200&width=200"],
  },
  {
    id: "3",
    title: "Laboratory Centrifuge",
    category: "instruments-consumables",
    description: "High-speed benchtop centrifuge for sample preparation",
    price: "$1,299.99",
    slug: "laboratory-centrifuge",
    images: ["/placeholder.svg?height=200&width=200"],
  },
]

export default function ProductsPage() {
  const [products, setProducts] = useState(initialProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [newProduct, setNewProduct] = useState({
    title: "",
    category: "",
    description: "",
    price: "",
    slug: "",
    images: [] as string[],
  })
  const { toast } = useToast()

  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string
          setSelectedImages((prev) => [...prev, imageUrl])
          setNewProduct((prev) => ({ ...prev, images: [...prev.images, imageUrl] }))
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index))
    setNewProduct((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))
  }

  const handleAddProduct = () => {
    if (!newProduct.title || !newProduct.category || !newProduct.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const product = {
      ...newProduct,
      id: Date.now().toString(),
      slug: newProduct.title.toLowerCase().replace(/\s+/g, "-"),
      images:
        selectedImages.length > 0
          ? selectedImages
          : ["/placeholder.svg?height=200&width=200&query=" + newProduct.title],
    }

    setProducts([...products, product])
    setNewProduct({ title: "", category: "", description: "", price: "", slug: "", images: [] })
    setSelectedImages([])
    setIsAddDialogOpen(false)

    toast({
      title: "Success",
      description: "Product added successfully!",
    })
  }

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id))
    toast({
      title: "Success",
      description: "Product deleted successfully!",
    })
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Products Management</h1>
            <p className="text-muted-foreground">Manage your product catalog and inventory</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>Create a new product entry for your catalog</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Product Title *</Label>
                    <Input
                      id="title"
                      value={newProduct.title}
                      onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                      placeholder="Enter product title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={newProduct.category}
                      onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {productCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
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
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    placeholder="Enter product description"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price (Optional)</Label>
                  <Input
                    id="price"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    placeholder="$0.00"
                  />
                </div>

                {/* Multiple Image Upload */}
                <div className="space-y-2">
                  <Label>Product Images</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    {selectedImages.length > 0 ? (
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        {selectedImages.map((image, index) => (
                          <div key={index} className="relative">
                            <Image
                              src={image || "/placeholder.svg"}
                              alt={`Product image ${index + 1}`}
                              width={150}
                              height={150}
                              className="rounded-lg object-cover"
                            />
                            <Button
                              variant="destructive"
                              size="sm"
                              className="absolute top-1 right-1"
                              onClick={() => removeImage(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : null}
                    <div className="text-center">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <div className="text-sm text-gray-600 mb-2">
                        <label htmlFor="images-upload" className="cursor-pointer text-primary hover:underline">
                          Click to upload multiple images
                        </label>{" "}
                        or drag and drop
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                      <input
                        id="images-upload"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddProduct}>Add Product</Button>
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
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="card-hover">
              <CardHeader>
                <div className="aspect-square relative bg-muted rounded-lg mb-4">
                  {product.images && product.images.length > 0 ? (
                    <Image
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.title}
                      width={100}
                      height={100}
                      className="object-cover rounded-md"
                    />
                  ) : (
                    <Package className="absolute inset-0 m-auto h-12 w-12 text-muted-foreground" />
                  )}
                </div>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{product.title}</CardTitle>
                    <Badge variant="secondary" className="mt-1">
                      {product.category.replace(/-/g, " ")}
                    </Badge>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteProduct(product.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">{product.description}</CardDescription>
                {product.price && <div className="text-lg font-semibold text-primary">{product.price}</div>}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No products found</h3>
          <p className="text-muted-foreground">
            {searchTerm ? "Try adjusting your search terms" : "Get started by adding your first product"}
          </p>
        </div>
      )}
    </div>
  )
}
