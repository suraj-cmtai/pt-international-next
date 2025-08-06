"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Plus, Edit, Trash2, Search, Eye, X } from "lucide-react"
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
  // imagesState: array of { file?: File, url?: string, previewUrl: string }
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
    if (fileInputRef.current) fileInputRef.current.value = ""
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
    const specsObject = specifications
      .filter((spec) => spec.key.trim() !== "" && spec.value.trim() !== "")
      .reduce(
        (acc, spec) => {
          acc[spec.key] = spec.value
          return acc
        },
        {} as Record<string, string>,
      )

    // Prepare images array: [File, File, string, ...]
    // For new images, send the File; for existing, send the url string
    const imagesPayload = imagesState.map((img) => img.file ?? img.url ?? "")

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

    // Append images as an array (field name: images)
    // For files, append as File; for strings, append as string
    imagesPayload.forEach((img, idx) => {
      if (img instanceof File) {
        productFormData.append("images", img)
      } else if (typeof img === "string" && img) {
        productFormData.append("images", img)
      }
    })

    try {
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
        description: error.message || "Something went wrong",
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

    if (fileInputRef.current) fileInputRef.current.value = ""
    setIsDialogOpen(true)
  }

  const handleDelete = async (productId: string) => {
    try {
      await dispatch(deleteProduct(productId)).unwrap()
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
        <button
          type="button"
          onClick={() => {
            resetForm()
            setIsDialogOpen(true)
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition text-sm font-medium"
        >
          <Plus className="h-4 w-4" />
          Create Product
        </button>
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
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg mx-2 p-0 relative">
            <div className="flex flex-col h-full">
              <button
                type="button"
                className="absolute top-3 right-3 text-muted-foreground hover:text-black"
                onClick={() => setIsDialogOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
              <div className="px-6 pt-6 pb-2">
                <h2 className="text-xl font-semibold mb-1">{editingProduct ? "Edit Product" : "Create New Product"}</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  {editingProduct
                    ? "Make changes to your product. Click save when you're done."
                    : "Fill in the details for your new product. Click create when you're done."}
                </p>
              </div>
              <form onSubmit={handleSubmit} className="overflow-y-auto px-6 pb-6 pt-0 max-h-[80vh]">
                <div className="space-y-4 py-2">
                  <div className="grid gap-2">
                    <label htmlFor="title" className="text-sm font-medium">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="title"
                      className="w-full border rounded px-3 py-2 text-sm"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: generateSlug(e.target.value) })}
                      placeholder="Enter product title"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="slug" className="text-sm font-medium">
                      Slug
                    </label>
                    <input
                      id="slug"
                      className="w-full border rounded px-3 py-2 text-sm bg-muted-foreground text-muted-foreground"
                      autoComplete="off"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="Auto-generated from title"
                      readOnly
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="category" className="text-sm font-medium">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="category"
                      className="w-full border rounded px-3 py-2 text-sm"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                    >
                      <option value="">Select category</option>
                      {productCategories.map((category) => (
                        <option key={category.slug} value={category.slug}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="price" className="text-sm font-medium">
                      Price
                    </label>
                    <input
                      id="price"
                      className="w-full border rounded px-3 py-2 text-sm"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="e.g., $299.99"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      id="isActive"
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="h-4 w-4"
                    />
                    <label htmlFor="isActive" className="text-sm font-medium">
                      Active
                    </label>
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="description" className="text-sm font-medium">
                      Short Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="description"
                      className="w-full border rounded px-3 py-2 text-sm resize-none"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                      rows={2}
                      placeholder="Enter a short description"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="longDescription" className="text-sm font-medium">
                      Long Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="longDescription"
                      className="w-full border rounded px-3 py-2 text-sm resize-none"
                      value={formData.longDescription}
                      onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                      required
                      rows={4}
                      placeholder="Enter a detailed description"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="images" className="text-sm font-medium">
                      Product Images
                    </label>
                    <input
                      id="images"
                      type="file"
                      accept="image/*"
                      multiple
                      ref={fileInputRef}
                      className="block w-full text-sm file:text-foreground"
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
                            <button
                              type="button"
                              className="absolute top-1 right-1 bg-white rounded-full p-0.5 shadow"
                              onClick={() => removeImage(index)}
                              tabIndex={-1}
                            >
                              <X className="h-4 w-4 text-red-500" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">Supported formats: JPG, PNG, GIF. Max size: 5MB.</p>
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Key Features</label>
                    <div className="flex flex-col gap-2">
                      {features.map((feature, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            className="flex-1 border rounded px-3 py-2 text-sm"
                            value={feature}
                            onChange={(e) => updateFeature(index, e.target.value)}
                            placeholder="Enter feature"
                          />
                          <button
                            type="button"
                            className="text-red-500 hover:text-red-700 px-2"
                            onClick={() => removeFeature(index)}
                            disabled={features.length === 1}
                            tabIndex={-1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="flex items-center gap-1 text-sm text-primary hover:underline mt-1"
                        onClick={addFeature}
                      >
                        <Plus className="h-4 w-4" />
                        Add Feature
                      </button>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Technical Specifications</label>
                    <div className="flex flex-col gap-2">
                      {specifications.map((spec, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            className="flex-1 border rounded px-3 py-2 text-sm"
                            value={spec.key}
                            onChange={(e) => updateSpecification(index, "key", e.target.value)}
                            placeholder="Specification name"
                          />
                          <input
                            className="flex-1 border rounded px-3 py-2 text-sm"
                            value={spec.value}
                            onChange={(e) => updateSpecification(index, "value", e.target.value)}
                            placeholder="Specification value"
                          />
                          <button
                            type="button"
                            className="text-red-500 hover:text-red-700 px-2"
                            onClick={() => removeSpecification(index)}
                            disabled={specifications.length === 1}
                            tabIndex={-1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="flex items-center gap-1 text-sm text-primary hover:underline mt-1"
                        onClick={addSpecification}
                      >
                        <Plus className="h-4 w-4" />
                        Add Specification
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <button
                    type="button"
                    className="px-4 py-2 rounded border text-sm"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={
                      "px-4 py-2 rounded text-sm font-medium flex items-center justify-center " +
                      (isLoading || isSubmitting || !isFormValid()
                        ? "bg-muted text-muted-foreground cursor-not-allowed"
                        : "bg-primary text-white")
                    }
                    disabled={isLoading || isSubmitting || !isFormValid()}
                  >
                    {isLoading || isSubmitting || !isFormValid() ? (
                      isSubmitting ? (
                        <>
                          <span className="inline-block h-4 w-4 mr-2 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
                          {editingProduct ? "Saving..." : "Creating..."}
                        </>
                      ) : editingProduct ? (
                        <span className="text-muted-foreground">Save Changes</span>
                      ) : (
                        <span className="text-muted-foreground">Create</span>
                      )
                    ) : isSubmitting ? (
                      <>
                        <span className="inline-block h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {editingProduct ? "Saving..." : "Creating..."}
                      </>
                    ) : editingProduct ? (
                      "Save Changes"
                    ) : (
                      "Create"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="flex items-center mb-6">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-3 py-2 w-full border rounded text-sm"
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
                      <button
                        type="button"
                        className="p-2 rounded hover:bg-muted"
                        title="View"
                        onClick={() => window.open(`/products/${product.category}/${product.slug}`, "_blank")}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="p-2 rounded hover:bg-muted"
                        title="Edit"
                        onClick={() => handleEdit(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="p-2 rounded hover:bg-muted"
                        title="Delete"
                        onClick={() => {
                          if (
                            window.confirm(
                              `Are you sure you want to delete "${product.title}"? This action cannot be undone.`,
                            )
                          ) {
                            handleDelete(product.id!)
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
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
