"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { motion } from "framer-motion"
import { MoreHorizontal, Plus, Pencil, Trash2, Search, Loader2, ImageIcon, Eye, EyeOff, Grid, List } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { fetchServices, createService, updateService, deleteService } from "@/lib/redux/features/serviceSlice"
import type { Service } from "@/lib/data"
import type { AppDispatch } from "@/lib/redux/store"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

// Service form state
interface ServiceFormState {
  title: string
  slug: string
  description: string
  longDescription: string
  features: string
  image: string | null
  imageFile: File | null
  removeImage: boolean
  category: string
  price: string
  isActive: boolean
}

const initialFormState: ServiceFormState = {
  title: "",
  slug: "",
  description: "",
  longDescription: "",
  features: "",
  image: null,
  imageFile: null,
  removeImage: false,
  category: "",
  price: "",
  isActive: true,
}

function getSlugFromTitle(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export default function ServicesPage() {
  const dispatch = useDispatch<AppDispatch>()
  const services = useSelector((state: any) => state.services.services)
  const isLoading = useSelector((state: any) => state.services.loading)
  const error = useSelector((state: any) => state.services.error)

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")
  const [newServiceForm, setNewServiceForm] = useState<ServiceFormState>(initialFormState)
  const [editServiceForm, setEditServiceForm] = useState<ServiceFormState | null>(null)
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    dispatch(fetchServices())
  }, [dispatch])

  // Clean up object URLs when component unmounts or form changes
  useEffect(() => {
    return () => {
      if (newServiceForm.imageFile && newServiceForm.image) {
        URL.revokeObjectURL(newServiceForm.image)
      }
    }
  }, [newServiceForm.imageFile])

  useEffect(() => {
    return () => {
      if (editServiceForm?.imageFile && editServiceForm.image) {
        URL.revokeObjectURL(editServiceForm.image)
      }
    }
  }, [editServiceForm?.imageFile])

  // Filter services
  const filteredServices = services.filter((service: Service) => {
    const matchesSearch =
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.slug.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "isActive" && service.isActive) ||
      (statusFilter === "inactive" && !service.isActive)

    const matchesCategory = categoryFilter === "all" || service.category === categoryFilter

    return matchesSearch && matchesStatus && matchesCategory
  })

  // Get unique categories
  const categories: string[] = Array.from(new Set(services.map((service: Service) => service.category)))

  // Stats
  const stats = {
    total: services.length,
    isActive: services.filter((s: Service) => s.isActive).length,
    inactive: services.filter((s: Service) => !s.isActive).length,
    categories: categories.length,
  }

  const resetCreateForm = () => {
    if (newServiceForm.imageFile && newServiceForm.image) {
      URL.revokeObjectURL(newServiceForm.image)
    }
    setNewServiceForm(initialFormState)
  }

  const resetEditForm = () => {
    if (editServiceForm?.imageFile && editServiceForm.image) {
      URL.revokeObjectURL(editServiceForm.image)
    }
    setEditServiceForm(null)
    setSelectedServiceId(null)
  }

  const handleCreate = async () => {
    if (isSubmitting) return

    // Validation
    if (!newServiceForm.title.trim()) {
      toast.error("Title is required")
      return
    }
    if (!newServiceForm.description.trim()) {
      toast.error("Description is required")
      return
    }
    if (!newServiceForm.category.trim()) {
      toast.error("Category is required")
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("title", newServiceForm.title.trim())
      formData.append("slug", newServiceForm.title.trim())
      formData.append("description", newServiceForm.description.trim())
      formData.append("longDescription", newServiceForm.longDescription.trim())
      formData.append(
        "features",
        newServiceForm.features
          .split(".")
          .map((s) => s.trim())
          .filter(Boolean)
          .join("."),
      )
      formData.append("category", newServiceForm.category.trim())
      formData.append("price", newServiceForm.price.trim())
      formData.append("isActive", newServiceForm.isActive.toString())
      if (newServiceForm.imageFile) {
        formData.append("image", newServiceForm.imageFile)
      }

      await dispatch(createService(formData)).unwrap()
      resetCreateForm()
      setIsCreateDialogOpen(false)
      toast.success("Service created successfully!")
    } catch (err: any) {
      toast.error(err?.message || err || "Failed to create service")
    } finally {
      setIsSubmitting(false)
    }
  }

  const openEditDialog = (service: Service) => {
    setSelectedServiceId(service.id)
    setEditServiceForm({
      title: service.title,
      slug: service.slug,
      description: service.description,
      longDescription: service.longDescription,
      features: service.features?.join(".") || "",
      image: service.image ?? null,
      imageFile: null,
      removeImage: false,
      category: service.category,
      price: service.price || "",
      isActive: service.isActive ?? true,
    })
    setIsEditDialogOpen(true)
  }

  const handleEdit = async () => {
    if (!editServiceForm || !selectedServiceId || isSubmitting) return

    // Validation
    if (!editServiceForm.title.trim()) {
      toast.error("Title is required")
      return
    }
    if (!editServiceForm.description.trim()) {
      toast.error("Description is required")
      return
    }
    if (!editServiceForm.category.trim()) {
      toast.error("Category is required")
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("title", editServiceForm.title.trim())
      formData.append("slug", editServiceForm.title.trim())
      formData.append("description", editServiceForm.description.trim())
      formData.append("longDescription", editServiceForm.longDescription.trim())
      formData.append(
        "features",
        editServiceForm.features
          .split(".")
          .map((s) => s.trim())
          .filter(Boolean)
          .join("."),
      )
      formData.append("category", editServiceForm.category.trim())
      formData.append("price", editServiceForm.price.trim())
      formData.append("isActive", editServiceForm.isActive.toString())
      if (editServiceForm.imageFile) {
        formData.append("image", editServiceForm.imageFile)
      }
      if (editServiceForm.removeImage) {
        formData.append("removeImage", "true")
      }

      await dispatch(updateService({ id: selectedServiceId, formData })).unwrap()
      setIsEditDialogOpen(false)
      resetEditForm()
      toast.success("Service updated successfully!")
    } catch (err: any) {
      toast.error(err?.message || err || "Failed to update service")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedServiceId || isSubmitting) return

    setIsSubmitting(true)

    try {
      await dispatch(deleteService(selectedServiceId)).unwrap()
      setIsDeleteDialogOpen(false)
      setSelectedServiceId(null)
      toast.success("Service deleted successfully!")
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete service")
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleServiceStatus = async (serviceId: string, currentStatus: boolean) => {
    try {
      const formData = new FormData()
      formData.append("isActive", (!currentStatus).toString())

      await dispatch(updateService({ id: serviceId, formData })).unwrap()
      toast.success(`Service ${!currentStatus ? "activated" : "deactivated"} successfully!`)
    } catch (error: any) {
      toast.error(error?.message || "Failed to update service status")
    }
  }

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    formState: ServiceFormState,
    setFormState: React.Dispatch<React.SetStateAction<any>>,
  ) => {
    const file = e.target.files?.[0] || null

    // Clean up previous object URL
    if (formState.imageFile && formState.image && formState.image.startsWith("blob:")) {
      URL.revokeObjectURL(formState.image)
    }

    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file")
        e.target.value = "" // Reset input
        return
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB")
        e.target.value = "" // Reset input
        return
      }

      const objectUrl = URL.createObjectURL(file)
      setFormState({
        ...formState,
        imageFile: file,
        image: objectUrl,
        removeImage: false,
      })
    } else {
      setFormState({
        ...formState,
        imageFile: null,
      })
    }
  }

  // Form fields renderer
  const renderFormFields = (formState: ServiceFormState, setFormState: React.Dispatch<React.SetStateAction<any>>) => (
    <div className="max-h-[60vh] overflow-y-auto pr-2">
      <div className="space-y-4 py-2">
        <div className="grid gap-2">
          <Label htmlFor="title">
            Title <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            value={formState.title}
            onChange={(e) =>
              setFormState({ ...formState, title: e.target.value, slug: getSlugFromTitle(e.target.value) })
            }
            placeholder="Enter service title"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={formState.slug}
            onChange={(e) => setFormState({ ...formState, slug: e.target.value })}
            placeholder="Auto-generated from title"
            className="text-sm bg-muted-foreground/50 text-muted-foreground"
            readOnly
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="category">
            Category <span className="text-red-500">*</span>
          </Label>
          <Input
            id="category"
            value={formState.category}
            onChange={(e) => setFormState({ ...formState, category: e.target.value })}
            placeholder="e.g., Consulting, Development"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            value={formState.price}
            onChange={(e) => setFormState({ ...formState, price: e.target.value })}
            placeholder="e.g., 1000, Free, Custom"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="isActive"
            checked={formState.isActive}
            onCheckedChange={(checked) => setFormState({ ...formState, isActive: checked })}
          />
          <Label htmlFor="isActive">Active</Label>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="description">
            Short Description <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="description"
            value={formState.description}
            onChange={(e) => setFormState({ ...formState, description: e.target.value })}
            rows={2}
            placeholder="Enter a short description"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="longDescription">Long Description</Label>
          <Textarea
            id="longDescription"
            value={formState.longDescription}
            onChange={(e) => setFormState({ ...formState, longDescription: e.target.value })}
            rows={4}
            placeholder="Enter a detailed description"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="features">Features</Label>
          <Textarea
            id="features"
            value={formState.features}
            onChange={(e) => setFormState({ ...formState, features: e.target.value })}
            rows={3}
            placeholder="Enter features, separated by full stop (.)"
          />
          <span className="text-xs text-muted-foreground">Separate each feature with a full stop (.)</span>
        </div>
        <div className="grid gap-2">
          <Label>Featured Image</Label>
          {formState.image && !formState.removeImage && (
            <div className="my-2 space-y-2">
              <p className="text-sm text-muted-foreground">
                {formState.imageFile ? "New image preview:" : "Current image:"}
              </p>
              <div className="relative w-full h-40">
                <Image
                  src={formState.image || "/placeholder.svg"}
                  alt="Service preview"
                  fill
                  className="object-cover rounded-md border"
                  onError={(e) => {
                    e.currentTarget.style.display = "none"
                  }}
                />
              </div>
              {!formState.imageFile && (
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="removeImage"
                    checked={formState.removeImage}
                    onChange={(e) => setFormState({ ...formState, removeImage: e.target.checked })}
                  />
                  <Label htmlFor="removeImage" className="text-sm font-medium">
                    Remove this image on save
                  </Label>
                </div>
              )}
            </div>
          )}
          <Input
            id="imageFile"
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, formState, setFormState)}
            className="file:text-foreground"
          />
          {formState.imageFile && (
            <p className="text-sm text-muted-foreground mt-1">New image selected: {formState.imageFile.name}</p>
          )}
          <p className="text-xs text-muted-foreground">Supported formats: JPG, PNG, GIF. Max size: 5MB.</p>
        </div>
      </div>
    </div>
  )

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center sm:flex-row flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold">Service Management</h1>
          <p className="text-muted-foreground">Manage your services and their details</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Service
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.isActive}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Services</CardTitle>
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

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="isActive">Active</SelectItem>
            <SelectItem value="inActive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* <div className="flex items-center space-x-2">
          <Button variant={viewMode === "table" ? "default" : "outline"} size="sm" onClick={() => setViewMode("table")}>
            <List className="h-4 w-4" />
          </Button>
          <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
            <Grid className="h-4 w-4" />
          </Button>
        </div> */}
      </div>

      {/* Services Table */}
      <motion.div layout className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Features</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && services.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : filteredServices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  {searchQuery ? "No services found matching your search" : "No services found"}
                </TableCell>
              </TableRow>
            ) : (
              filteredServices.map((service: Service) => (
                <motion.tr
                  key={service.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  layout
                  className="group"
                >
                  <TableCell>
                    <div className="relative w-16 h-12">
                      {service.image ? (
                        <Image
                          src={service.image || "/placeholder.svg"}
                          alt={service.title}
                          fill
                          className="object-cover rounded"
                          onError={(e) => {
                            e.currentTarget.style.display = "none"
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-muted rounded flex items-center justify-center">
                          <ImageIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium max-w-[200px] truncate" title={service.title}>
                    {service.title}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{service.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Badge variant={service.isActive ? "default" : "secondary"}>
                        {service.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleServiceStatus(service.id, !!service.isActive)}
                        className="h-6 w-6 p-0"
                      >
                        {service.isActive ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{service.price || "—"}</TableCell>
                  <TableCell className="max-w-[200px] truncate" title={service.features?.join(", ")}>
                    {service.features?.length
                      ? service.features.slice(0, 2).join(", ") + (service.features.length > 2 ? "..." : "")
                      : "—"}
                  </TableCell>
                  <TableCell>{service.createdAt ? format(new Date(service.createdAt), "MMM dd, yyyy") : "—"}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => openEditDialog(service)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleServiceStatus(service.id, !!service.isActive)}>
                          {service.isActive ? (
                            <>
                              <EyeOff className="mr-2 h-4 w-4" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <Eye className="mr-2 h-4 w-4" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600 focus:bg-red-50"
                          onClick={() => {
                            setSelectedServiceId(service.id)
                            setIsDeleteDialogOpen(true)
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </motion.div>

      {/* Create Dialog */}
      <Dialog
        open={isCreateDialogOpen}
        onOpenChange={(open) => {
          setIsCreateDialogOpen(open)
          if (!open) {
            resetCreateForm()
          }
        }}
      >
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Create New Service</DialogTitle>
            <DialogDescription>
              Fill in the details for your new service. Click create when you're done.
            </DialogDescription>
          </DialogHeader>
          {renderFormFields(newServiceForm, setNewServiceForm)}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false)
                resetCreateForm()
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={
                isLoading ||
                isSubmitting ||
                !newServiceForm.title.trim() ||
                !newServiceForm.description.trim() ||
                !newServiceForm.category.trim()
              }
            >
              {isLoading || isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open)
          if (!open) {
            resetEditForm()
          }
        }}
      >
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
            <DialogDescription>Make changes to your service. Click save when you're done.</DialogDescription>
          </DialogHeader>
          {editServiceForm && renderFormFields(editServiceForm, setEditServiceForm)}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false)
                resetEditForm()
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEdit}
              disabled={
                isLoading ||
                isSubmitting ||
                !editServiceForm?.title?.trim() ||
                !editServiceForm?.description?.trim() ||
                !editServiceForm?.category?.trim()
              }
            >
              {isLoading || isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Service</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this service? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false)
                setSelectedServiceId(null)
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isLoading || isSubmitting}>
              {isLoading || isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
