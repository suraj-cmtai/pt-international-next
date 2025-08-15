"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Plus, Edit, Trash2, Search, Eye, X, FileText } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch } from "@/lib/redux/store"
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  selectProductList,
  selectIsLoading,
  selectHasFetched,
  selectError,
  clearError,
  type Product,
} from "@/lib/redux/features/productSlice"
import { productCategories } from "@/lib/data"
import { format } from "date-fns"
import { toast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { uploadImageClient, uploadPDFClient } from "@/lib/firebase-client"

type ImageItem = { file?: File; url?: string; previewUrl: string }

export default function ProductsManagement() {
  const dispatch = useDispatch<AppDispatch>()
  const products = useSelector(selectProductList)
  const isLoading = useSelector(selectIsLoading)
  const hasFetched = useSelector(selectHasFetched)
  const error = useSelector(selectError)

  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [imagesState, setImagesState] = useState<ImageItem[]>([])
  const [features, setFeatures] = useState<string[]>([""])
  const [specifications, setSpecifications] = useState<{ key: string; value: string }[]>([{ key: "", value: "" }])
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    longDescription: "",
    category: "",
    price: "",
    slug: "",
    isActive: true,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Delete confirmation modal
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; product: Product | null }>({
    isOpen: false,
    product: null
  })

  // Brochure state
  const [brochureFile, setBrochureFile] = useState<File | null>(null)
  const [brochureUrl, setBrochureUrl] = useState<string | null>(null)
  const brochureInputRef = useRef<HTMLInputElement>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Get unique categories
  const categories: string[] = Array.from(new Set(products.map((product: Product) => product.category)))

  // Stats
  const stats = {
    total: products.length,
    active: products.filter((p: Product) => p.isActive).length,
    inactive: products.filter((p: Product) => !p.isActive).length,
    categories: categories.length,
  }

  useEffect(() => {
    if (!hasFetched) {
      dispatch(fetchProducts())
    }
  }, [dispatch, hasFetched])

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      })
      dispatch(clearError())
    }
  }, [error, dispatch])

  useEffect(() => {
    // If all images are removed, reset file input
    if (imagesState.filter((img) => img.file).length === 0 && fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [imagesState])

  // --- Image Handling ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Read all files and add to imagesState
    const newImageItems: ImageItem[] = []
    let loaded = 0
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        newImageItems.push({
          file,
          previewUrl: reader.result as string,
        })
        loaded++
        if (loaded === files.length) {
          setImagesState((prev) => [...prev, ...newImageItems])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setImagesState((prev) => {
      const newArr = [...prev]
      newArr.splice(index, 1)
      return newArr
    })
    // Reset file input if all files are removed
    setTimeout(() => {
      if (imagesState.filter((img, i) => i !== index && img.file).length === 0 && fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }, 0)
  }

  // --- Brochure Handling ---
  const handleBrochureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === "application/pdf") {
      setBrochureFile(file)
      setBrochureUrl(URL.createObjectURL(file))
    } else {
      setBrochureFile(null)
      setBrochureUrl(null)
      if (file) {
        toast({
          title: "Invalid File",
          description: "Please upload a PDF file for the brochure.",
          variant: "destructive",
        })
      }
    }
  }

  const removeBrochure = () => {
    setBrochureFile(null)
    setBrochureUrl(null)
    if (brochureInputRef.current) {
      brochureInputRef.current.value = ""
    }
  }

  const addFeature = () => setFeatures([...features, ""])
  const removeFeature = (index: number) => setFeatures(features.filter((_, i) => i !== index))
  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...features]
    newFeatures[index] = value
    setFeatures(newFeatures)
  }

  const addSpecification = () => setSpecifications([...specifications, { key: "", value: "" }])
  const removeSpecification = (index: number) => setSpecifications(specifications.filter((_, i) => i !== index))
  const updateSpecification = (index: number, field: "key" | "value", value: string) => {
    const newSpecs = [...specifications]
    newSpecs[index][field] = value
    setSpecifications(newSpecs)
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      longDescription: "",
      category: "",
      price: "",
      slug: "",
      isActive: true,
    })
    setFeatures([""])
    setSpecifications([{ key: "", value: "" }])
    setImagesState([])
    setEditingProduct(null)
    setBrochureFile(null)
    setBrochureUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
    if (brochureInputRef.current) brochureInputRef.current.value = ""
  }

  // Check if all required fields are filled
  const isFormValid = () => {
    return (
      formData.title.trim() !== "" &&
      formData.description.trim() !== "" &&
      formData.longDescription.trim() !== "" &&
      formData.category.trim() !== ""
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const specsObject = specifications
        .filter((spec) => spec.key.trim() !== "" && spec.value.trim() !== "")
        .reduce(
          (acc, spec) => {
            acc[spec.key] = spec.value
            return acc
          },
          {} as Record<string, string>,
        )

      // Process images: upload new files and keep existing URLs
      const processedImages: string[] = []
      
      for (const img of imagesState) {
        if (img.file) {
          // Upload new image file to Firebase
          const uploadedUrl = await uploadImageClient(img.file)
          processedImages.push(uploadedUrl)
        } else if (img.url) {
          // Keep existing URL
          processedImages.push(img.url)
        }
      }

      // Process brochure: upload new file or keep existing URL
      let processedBrochure: string | null = null
      if (brochureFile) {
        // Upload new brochure file to Firebase
        processedBrochure = await uploadPDFClient(brochureFile)
      } else if (brochureUrl && editingProduct && editingProduct.brochure === brochureUrl) {
        // Keep existing brochure URL
        processedBrochure = brochureUrl
      }

      // Create FormData to maintain compatibility with existing Redux slice
      const productFormData = new FormData()
      productFormData.append("title", formData.title)
      productFormData.append("description", formData.description)
      productFormData.append("longDescription", formData.longDescription)
      productFormData.append("category", formData.category)
      productFormData.append("price", formData.price)
      productFormData.append("slug", formData.slug || generateSlug(formData.title))
      productFormData.append("features", JSON.stringify(features.filter((f) => f.trim() !== "")))
      productFormData.append("specifications", JSON.stringify(specsObject))
      productFormData.append("isActive", formData.isActive.toString())
      
      // Add processed images as strings (URLs)
      processedImages.forEach((imageUrl) => {
        productFormData.append("images", imageUrl)
      })
      
      // Add processed brochure as string (URL) if exists
      if (processedBrochure) {
        productFormData.append("brochure", processedBrochure)
      }

      if (editingProduct) {
        await dispatch(updateProduct({ id: editingProduct.id!, productData: productFormData })).unwrap()
        toast({
          title: "Product Updated",
          description: "Product has been updated successfully.",
        })
      } else {
        await dispatch(createProduct(productFormData)).unwrap()
        toast({
          title: "Product Created",
          description: "New product has been created successfully.",
        })
      }
      setIsDialogOpen(false)
      resetForm()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || error.errorMessage || "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      title: product.title,
      description: product.description,
      longDescription: product.longDescription,
      category: product.category,
      price: product.price || "",
      slug: product.slug,
      isActive: product.isActive,
    })
    setFeatures(product.features.length > 0 ? product.features : [""])
    // Set imagesState to existing images as { url, previewUrl }
    setImagesState(
      (product.images || []).map((img) => ({
        url: img,
        previewUrl: img,
      })),
    )

    if (product.specifications) {
      const specs = Object.entries(product.specifications).map(([key, value]) => ({ key, value }))
      setSpecifications(specs.length > 0 ? specs : [{ key: "", value: "" }])
    } else {
      setSpecifications([{ key: "", value: "" }])
    }

    // Brochure: if exists, set as URL (string), else null
    if (product.brochure) {
      setBrochureFile(null)
      setBrochureUrl(product.brochure)
      if (brochureInputRef.current) brochureInputRef.current.value = ""
    } else {
      setBrochureFile(null)
      setBrochureUrl(null)
      if (brochureInputRef.current) brochureInputRef.current.value = ""
    }

    if (fileInputRef.current) fileInputRef.current.value = ""
    setIsDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.product) return
    
    try {
      await dispatch(deleteProduct(deleteDialog.product.id!)).unwrap()
      toast({
        title: "Product Deleted",
        description: "Product has been deleted successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete product",
        variant: "destructive",
      })
    } finally {
      setDeleteDialog({ isOpen: false, product: null })
    }
  }

  // --- Loading style exactly like services page ---
  if (isLoading && !hasFetched) {
    return (
      <div className="flex items-center justify-center min-h-[300px] w-full">
        <div className="flex flex-col items-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted-foreground border-t-primary" />
          <span className="text-muted-foreground text-sm mt-2">Loading products...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-2 md:px-6 py-8">
      {/* Header and Create Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Product Management</h1>
          <p className="text-muted-foreground">Manage your products and their details</p>
        </div>
        <Button
          onClick={() => {
            resetForm()
            setIsDialogOpen(true)
          }}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Product
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.inactive}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.categories}</div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog for Add/Edit Product */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Edit Product" : "Create New Product"}</DialogTitle>
            <DialogDescription>
              {editingProduct
                ? "Make changes to your product. Click save when you're done."
                : "Fill in the details for your new product. Click create when you're done."}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="title">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: generateSlug(e.target.value) })}
                placeholder="Enter product title"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="Auto-generated from title"
                className="bg-muted"
                readOnly
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="category">
                Category <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {productCategories.map((category) => (
                    <SelectItem key={category.slug} value={category.slug}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="e.g., $299.99"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: !!checked })}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">
                Short Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={2}
                placeholder="Enter a short description"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="longDescription">
                Long Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="longDescription"
                value={formData.longDescription}
                onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                required
                rows={4}
                placeholder="Enter a detailed description"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="images">Product Images</Label>
              <Input
                id="images"
                type="file"
                accept="image/*"
                multiple
                ref={fileInputRef}
                onChange={handleImageChange}
              />
              {imagesState.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {imagesState.map((img, index) => (
                    <div key={index} className="relative w-16 h-16">
                      <img
                        src={img.previewUrl || "/placeholder.svg"}
                        alt={`Preview ${index + 1}`}
                        className="w-16 h-16 object-cover rounded border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-muted-foreground">Supported formats: JPG, PNG, GIF. Max size: 1MB.</p>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="brochure">Brochure (PDF)</Label>
              <Input
                id="brochure"
                type="file"
                accept="application/pdf"
                ref={brochureInputRef}
                onChange={handleBrochureChange}
              />
              {(brochureFile || brochureUrl) && (
                <div className="flex items-center gap-2 mt-2">
                  <FileText className="h-5 w-5 text-primary" />
                  {brochureFile ? (
                    <span className="text-sm">{brochureFile.name}</span>
                  ) : brochureUrl ? (
                    <a
                      href={brochureUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline text-sm"
                    >
                      View Brochure
                    </a>
                  ) : null}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="ml-2 h-6 w-6 p-0 text-red-500 hover:text-red-700"
                    onClick={removeBrochure}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <p className="text-xs text-muted-foreground">Upload a PDF file. Max size: 2MB.</p>
            </div>
            
            <div className="grid gap-2">
              <Label>Key Features</Label>
              <div className="space-y-2">
                {features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      placeholder="Enter feature"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFeature(index)}
                      disabled={features.length === 1}
                      className="px-2 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={addFeature}
                  className="flex items-center gap-1 text-primary hover:text-primary/80"
                >
                  <Plus className="h-4 w-4" />
                  Add Feature
                </Button>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label>Technical Specifications</Label>
              <div className="space-y-2">
                {specifications.map((spec, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={spec.key}
                      onChange={(e) => updateSpecification(index, "key", e.target.value)}
                      placeholder="Specification name"
                      className="flex-1"
                    />
                    <Input
                      value={spec.value}
                      onChange={(e) => updateSpecification(index, "value", e.target.value)}
                      placeholder="Specification value"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSpecification(index)}
                      disabled={specifications.length === 1}
                      className="px-2 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={addSpecification}
                  className="flex items-center gap-1 text-primary hover:text-primary/80"
                >
                  <Plus className="h-4 w-4" />
                  Add Specification
                </Button>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || isSubmitting || !isFormValid()}
                className="min-w-[120px]"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {editingProduct ? "Saving..." : "Creating..."}
                  </>
                ) : (
                  editingProduct ? "Save Changes" : "Create Product"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.isOpen} onOpenChange={(open) => setDeleteDialog({ isOpen: open, product: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{deleteDialog.product?.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Search Bar */}
      <div className="flex items-center mb-6">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto border rounded-lg bg-white">
        <table className="min-w-full">
          <thead>
            <tr className="bg-muted/50 border-b">
              <th className="text-left px-4 py-3 text-sm font-semibold whitespace-nowrap">Product</th>
              <th className="text-left px-4 py-3 text-sm font-semibold whitespace-nowrap">Category</th>
              <th className="text-left px-4 py-3 text-sm font-semibold whitespace-nowrap">Price</th>
              <th className="text-left px-4 py-3 text-sm font-semibold whitespace-nowrap">Status</th>
              <th className="text-left px-4 py-3 text-sm font-semibold whitespace-nowrap">Updated</th>
              <th className="text-left px-4 py-3 text-sm font-semibold whitespace-nowrap">Images</th>
              <th className="text-right px-4 py-3 text-sm font-semibold whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-muted-foreground py-12">
                  No products found.
                </td>
              </tr>
            ) : (
              filteredProducts.map((product, idx) => (
                <tr
                  key={product.id}
                  className={
                    "hover:bg-muted/30 transition-colors " + (idx === filteredProducts.length - 1 ? "" : "border-b")
                  }
                >
                  <td className="px-4 py-4 align-middle min-w-[180px]">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-medium">{product.title}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1">{product.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 align-middle min-w-[120px]">
                    <span className="inline-block px-2 py-1 rounded bg-muted text-xs">
                      {productCategories.find((cat) => cat.slug === product.category)?.name || product.category}
                    </span>
                  </td>
                  <td className="px-4 py-4 align-middle min-w-[80px]">{product.price || "N/A"}</td>
                  <td className="px-4 py-4 align-middle min-w-[90px]">
                    <span
                      className={
                        "inline-block px-2 py-1 rounded text-xs " +
                        (product.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600")
                      }
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-4 align-middle min-w-[110px]">
                    <span className="text-xs text-muted-foreground">
                      {product.updatedAt?.toDate?.() ? format(product.updatedAt.toDate(), "MMM d, yyyy") : "N/A"}
                    </span>
                  </td>
                  <td className="px-4 py-4 align-middle min-w-[90px]">
                    <div className="flex -space-x-2">
                      {product.images && product.images.length > 0 ? (
                        product.images
                          .slice(0, 3)
                          .map((img, i) => (
                            <img
                              key={i}
                              src={img || "/placeholder.svg"}
                              alt={`Product image ${i + 1}`}
                              className="w-8 h-8 object-cover rounded border bg-background"
                            />
                          ))
                      ) : (
                        <img
                          src="/placeholder.svg"
                          alt="No image"
                          className="w-8 h-8 object-cover rounded border bg-background"
                        />
                      )}
                      {product.images && product.images.length > 3 && (
                        <div className="w-8 h-8 bg-muted rounded border flex items-center justify-center text-xs font-medium">
                          +{product.images.length - 3}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 align-middle text-right min-w-[120px]">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="View"
                        onClick={() => window.open(`/products/${product.category}/${product.slug}`, "_blank")}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Edit"
                        onClick={() => handleEdit(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        title="Delete"
                        onClick={() => setDeleteDialog({ isOpen: true, product })}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}