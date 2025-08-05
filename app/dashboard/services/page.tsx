"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Plus, Edit, Trash2, Search, Eye, X } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch } from "@/lib/redux/store"
import {
  fetchServices,
  createService,
  updateService,
  deleteService,
  selectServiceList,
  selectIsLoading,
  selectHasFetched,
  selectError,
  clearError,
  type Service,
} from "@/lib/redux/features/serviceSlice"
import { format } from "date-fns"
import { toast } from "@/hooks/use-toast"

export default function ServicesManagement() {
  const dispatch = useDispatch<AppDispatch>()
  const services = useSelector(selectServiceList)
  const isLoading = useSelector(selectIsLoading)
  const hasFetched = useSelector(selectHasFetched)
  const error = useSelector(selectError)

  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [features, setFeatures] = useState<string[]>([""])
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

  const filteredServices = services.filter(
    (service) =>
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  useEffect(() => {
    if (!hasFetched) {
      dispatch(fetchServices())
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
    if (!imageFile && fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [imageFile])

  // --- Image Handling ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setImageFile(file)

    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setImagePreview("")
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const addFeature = () => setFeatures([...features, ""])
  const removeFeature = (index: number) => setFeatures(features.filter((_, i) => i !== index))
  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...features]
    newFeatures[index] = value
    setFeatures(newFeatures)
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
    setImageFile(null)
    setImagePreview("")
    setEditingService(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const serviceFormData = new FormData()
    serviceFormData.append("title", formData.title)
    serviceFormData.append("description", formData.description)
    serviceFormData.append("longDescription", formData.longDescription)
    serviceFormData.append("category", formData.category)
    serviceFormData.append("price", formData.price)
    serviceFormData.append("slug", formData.slug || generateSlug(formData.title))
    serviceFormData.append("features", JSON.stringify(features.filter((f) => f.trim() !== "")))
    serviceFormData.append("isActive", formData.isActive.toString())

    if (imageFile) {
      serviceFormData.append("image", imageFile)
    }

    try {
      if (editingService) {
        await dispatch(updateService({ id: editingService.id!, serviceData: serviceFormData })).unwrap()
        toast({
          title: "Service Updated",
          description: "Service has been updated successfully.",
        })
      } else {
        await dispatch(createService(serviceFormData)).unwrap()
        toast({
          title: "Service Created",
          description: "New service has been created successfully.",
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

  const handleEdit = (service: Service) => {
    setEditingService(service)
    setFormData({
      title: service.title,
      description: service.description,
      longDescription: service.longDescription,
      category: service.category,
      price: service.price || "",
      slug: service.slug,
      isActive: service.isActive,
    })
    setFeatures(service.features.length > 0 ? service.features : [""])
    setImagePreview(service.image || "")
    setImageFile(null)

    if (fileInputRef.current) fileInputRef.current.value = ""
    setIsDialogOpen(true)
  }

  const handleDelete = async (serviceId: string) => {
    try {
      await dispatch(deleteService(serviceId)).unwrap()
      toast({
        title: "Service Deleted",
        description: "Service has been deleted successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete service",
        variant: "destructive",
      })
    }
  }

  // --- Loading style exactly like products page ---
  if (isLoading && !hasFetched) {
    return (
      <div className="flex items-center justify-center min-h-[300px] w-full">
        <div className="flex flex-col items-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted-foreground border-t-primary" />
          <span className="text-muted-foreground text-sm mt-2">Loading services...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-2 md:px-6 py-8">
      {/* Header and Create Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Services</h1>
        <button
          type="button"
          onClick={() => {
            resetForm()
            setIsDialogOpen(true)
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition text-sm font-medium"
        >
          <Plus className="h-4 w-4" />
          Add Service
        </button>
      </div>

      {/* Dialog for Add/Edit Service */}
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
                <h2 className="text-xl font-semibold mb-1">{editingService ? "Edit Service" : "Add Service"}</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  {editingService
                    ? "Update the service information below."
                    : "Fill in the details to create a new service."}
                </p>
              </div>
              <form onSubmit={handleSubmit} className="overflow-y-auto px-6 pb-6 pt-0 max-h-[80vh]">
                <div className="mb-4">
                  <label htmlFor="title" className="block text-sm font-medium mb-1">
                    Title *
                  </label>
                  <input
                    id="title"
                    className="w-full border rounded px-3 py-2 text-sm"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="slug" className="block text-sm font-medium mb-1">
                    URL Slug
                  </label>
                  <input
                    id="slug"
                    className="w-full border rounded px-3 py-2 text-sm"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="Auto-generated from title"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="category" className="block text-sm font-medium mb-1">
                    Category *
                  </label>
                  <input
                    id="category"
                    className="w-full border rounded px-3 py-2 text-sm"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., Consulting, Development"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="price" className="block text-sm font-medium mb-1">
                    Price
                  </label>
                  <input
                    id="price"
                    className="w-full border rounded px-3 py-2 text-sm"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g., $1000, Free, Custom"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="description" className="block text-sm font-medium mb-1">
                    Short Description *
                  </label>
                  <textarea
                    id="description"
                    className="w-full border rounded px-3 py-2 text-sm resize-none"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={2}
                    placeholder="Brief description of the service"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="longDescription" className="block text-sm font-medium mb-1">
                    Detailed Description *
                  </label>
                  <textarea
                    id="longDescription"
                    className="w-full border rounded px-3 py-2 text-sm resize-none"
                    value={formData.longDescription}
                    onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                    required
                    rows={4}
                    placeholder="Detailed description of the service"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="image" className="block text-sm font-medium mb-1">
                    Service Image
                  </label>
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="block w-full text-sm"
                    onChange={handleImageChange}
                  />
                  {(imagePreview || editingService?.image) && (
                    <div className="mt-2 relative w-16 h-16">
                      <img
                        src={imagePreview || editingService?.image || "/placeholder.svg"}
                        alt="Preview"
                        className="w-16 h-16 object-cover rounded border"
                      />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-white rounded-full p-0.5 shadow"
                        onClick={removeImage}
                        tabIndex={-1}
                      >
                        <X className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Key Features</label>
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
                <div className="mb-6 flex items-center gap-2">
                  <input
                    id="isActive"
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="h-4 w-4"
                  />
                  <label htmlFor="isActive" className="text-sm">
                    Active (visible to public)
                  </label>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="px-4 py-2 rounded border text-sm"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-primary text-white text-sm font-medium flex items-center justify-center"
                    disabled={isLoading || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="inline-block h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {editingService ? "Updating..." : "Creating..."}
                      </>
                    ) : editingService ? (
                      "Update Service"
                    ) : (
                      "Create Service"
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
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-3 py-2 w-full border rounded text-sm"
          />
        </div>
      </div>

      {/* Services Table */}
      <div className="overflow-x-auto border rounded-lg bg-white">
        <table className="min-w-full">
          <thead>
            <tr className="bg-muted/50 border-b">
              <th className="text-left px-4 py-3 text-sm font-semibold whitespace-nowrap">Service</th>
              <th className="text-left px-4 py-3 text-sm font-semibold whitespace-nowrap">Category</th>
              <th className="text-left px-4 py-3 text-sm font-semibold whitespace-nowrap">Price</th>
              <th className="text-left px-4 py-3 text-sm font-semibold whitespace-nowrap">Status</th>
              <th className="text-left px-4 py-3 text-sm font-semibold whitespace-nowrap">Updated</th>
              <th className="text-left px-4 py-3 text-sm font-semibold whitespace-nowrap">Image</th>
              <th className="text-right px-4 py-3 text-sm font-semibold whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredServices.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-muted-foreground py-12">
                  No services found.
                </td>
              </tr>
            ) : (
              filteredServices.map((service, idx) => (
                <tr
                  key={service.id}
                  className={
                    "hover:bg-muted/30 transition-colors " + (idx === filteredServices.length - 1 ? "" : "border-b")
                  }
                >
                  <td className="px-4 py-4 align-middle min-w-[180px]">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-medium">{service.title}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1">{service.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 align-middle min-w-[120px]">
                    <span className="inline-block px-2 py-1 rounded bg-muted text-xs">{service.category}</span>
                  </td>
                  <td className="px-4 py-4 align-middle min-w-[80px]">{service.price || "N/A"}</td>
                  <td className="px-4 py-4 align-middle min-w-[90px]">
                    <span
                      className={
                        "inline-block px-2 py-1 rounded text-xs " +
                        (service.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600")
                      }
                    >
                      {service.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-4 align-middle min-w-[110px]">
                    <span className="text-xs text-muted-foreground">
                      {service.updatedAt?.toDate?.() ? format(service.updatedAt.toDate(), "MMM d, yyyy") : "N/A"}
                    </span>
                  </td>
                  <td className="px-4 py-4 align-middle min-w-[90px]">
                    <div className="w-8 h-8">
                      {service.image ? (
                        <img
                          src={service.image || "/placeholder.svg"}
                          alt="Service image"
                          className="w-8 h-8 object-cover rounded border bg-background"
                        />
                      ) : (
                        <img
                          src="/placeholder.svg"
                          alt="No image"
                          className="w-8 h-8 object-cover rounded border bg-background"
                        />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 align-middle text-right min-w-[120px]">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        className="p-2 rounded hover:bg-muted"
                        title="View"
                        onClick={() => window.open(`/services/${service.slug}`, "_blank")}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="p-2 rounded hover:bg-muted"
                        title="Edit"
                        onClick={() => handleEdit(service)}
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
                              `Are you sure you want to delete "${service.title}"? This action cannot be undone.`,
                            )
                          ) {
                            handleDelete(service.id!)
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
