
"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { motion } from "framer-motion"
import {
  MoreHorizontal,
  Plus,
  Pencil,
  Trash2,
  Search,
  Loader2,
  Image as ImageIcon,
} from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import {
  fetchServices,
  createService,
  updateService,
  deleteService,
} from "@/lib/redux/features/serviceSlice"
import type { Service } from "@/lib/data"
import { AppDispatch } from "@/lib/redux/store"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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

  const filteredServices = services.filter((service: Service) =>
    service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.slug.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
      formData.append("slug", getSlugFromTitle(newServiceForm.title.trim()))
      formData.append("description", newServiceForm.description.trim())
      formData.append("longDescription", newServiceForm.longDescription.trim())
      formData.append("features", newServiceForm.features.split('.').map(s => s.trim()).filter(Boolean).join('.'))
      formData.append("category", newServiceForm.category.trim())
      formData.append("price", newServiceForm.price.trim())
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
      features: service.features?.join('.') || "",
      image: service.image ?? null,
      imageFile: null,
      removeImage: false,
      category: service.category,
      price: service.price || "",
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
      formData.append("slug", getSlugFromTitle(editServiceForm.title.trim()))
      formData.append("description", editServiceForm.description.trim())
      formData.append("longDescription", editServiceForm.longDescription.trim())
      formData.append("features", editServiceForm.features.split('.').map(s => s.trim()).filter(Boolean).join('.'))
      formData.append("category", editServiceForm.category.trim())
      formData.append("price", editServiceForm.price.trim())
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

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    formState: ServiceFormState,
    setFormState: React.Dispatch<React.SetStateAction<any>>
  ) => {
    const file = e.target.files?.[0] || null

    // Clean up previous object URL
    if (formState.imageFile && formState.image && formState.image.startsWith('blob:')) {
      URL.revokeObjectURL(formState.image)
    }

    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file')
        e.target.value = '' // Reset input
        return
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB')
        e.target.value = '' // Reset input
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

  // Add a wrapper with max-h and overflow for the form fields
  const renderFormFields = (
    formState: ServiceFormState,
    setFormState: React.Dispatch<React.SetStateAction<any>>
  ) => (
    <div className="max-h-[60vh] overflow-y-auto pr-2">
      <div className="space-y-4 py-2">
        <div className="grid gap-2">
          <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
          <Input
            id="title"
            value={formState.title}
            onChange={e => setFormState({ ...formState, title: e.target.value, slug: getSlugFromTitle(e.target.value) })}
            placeholder="Enter service title"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={formState.slug}
            onChange={e => setFormState({ ...formState, slug: e.target.value })}
            placeholder="Auto-generated from title"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
          <Input
            id="category"
            value={formState.category}
            onChange={e => setFormState({ ...formState, category: e.target.value })}
            placeholder="e.g., Consulting, Development"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            value={formState.price}
            onChange={e => setFormState({ ...formState, price: e.target.value })}
            placeholder="e.g., 1000, Free, Custom"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="description">Short Description <span className="text-red-500">*</span></Label>
          <Textarea
            id="description"
            value={formState.description}
            onChange={e => setFormState({ ...formState, description: e.target.value })}
            rows={2}
            placeholder="Enter a short description"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="longDescription">Long Description</Label>
          <Textarea
            id="longDescription"
            value={formState.longDescription}
            onChange={e => setFormState({ ...formState, longDescription: e.target.value })}
            rows={4}
            placeholder="Enter a detailed description"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="features">Features</Label>
          <Textarea
            id="features"
            value={formState.features}
            onChange={e => setFormState({ ...formState, features: e.target.value })}
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
                {formState.imageFile ? 'New image preview:' : 'Current image:'}
              </p>
              <div
                className="relative w-full h-40"
                style={{
                  backgroundImage: `url('/placeholder.svg')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <Image
                  src={formState.image}
                  alt="Service preview"
                  fill
                  className="object-cover rounded-md border"
                  onError={e => {
                    e.currentTarget.style.display = 'none'
                    e.currentTarget.parentElement?.nextElementSibling?.classList.remove('hidden')
                  }}
                />
              </div>
              {!formState.imageFile && (
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="removeImage"
                    checked={formState.removeImage}
                    onChange={e => setFormState({ ...formState, removeImage: e.target.checked })}
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
            onChange={e => handleImageChange(e, formState, setFormState)}
            className="file:text-foreground"
          />
          {formState.imageFile && (
            <p className="text-sm text-muted-foreground mt-1">
              New image selected: {formState.imageFile.name}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Supported formats: JPG, PNG, GIF. Max size: 5MB.
          </p>
        </div>
      </div>
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6"
    >
      <div className="flex justify-between items-center sm:flex-row flex-col gap-4">
        <h1 className="text-2xl font-bold">Service Management</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={open => {
          setIsCreateDialogOpen(open)
          if (!open) {
            resetCreateForm()
          }
        }}>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />Create Service
          </Button>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Create New Service</DialogTitle>
              <DialogDescription>
                Fill in the details for your new service. Click create when you're done.
              </DialogDescription>
            </DialogHeader>
            {/* Limit form height and make it scrollable */}
            <div className="max-h-[60vh] overflow-y-auto pr-2">
              {renderFormFields(newServiceForm, setNewServiceForm)}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsCreateDialogOpen(false)
                resetCreateForm()
              }}>
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                disabled={
                  isLoading || isSubmitting ||
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
                  'Create'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search services..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <motion.div layout className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Features</TableHead>
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
                  {searchQuery ? 'No services found matching your search' : 'No services found'}
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
                    <div
                      className="relative w-16 h-12"
                      style={{
                        backgroundImage: `url('/placeholder.svg')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      {service.image ? (
                        <Image
                          src={service.image}
                          alt={service.title}
                          fill
                          className="object-cover rounded"
                          onError={e => {
                            e.currentTarget.style.display = 'none'
                            e.currentTarget.parentElement?.nextElementSibling?.classList.remove('hidden')
                          }}
                        />
                      ) : null}
                      <div className={`w-full h-full bg-muted rounded flex items-center justify-center ${service.image ? 'hidden' : ''}`}>
                        <ImageIcon className="h-6 w-6 text-muted-foreground" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium max-w-[200px] truncate" title={service.title}>
                    {service.title}
                  </TableCell>
                  <TableCell>{service.category}</TableCell>
                  <TableCell>{service.slug}</TableCell>
                  <TableCell>{service.price || "—"}</TableCell>
                  <TableCell className="max-w-[200px] truncate" title={service.description}>
                    {service.description}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate" title={service.features?.join(", ")}>
                    {service.features?.length
                      ? service.features.slice(0, 3).join(", ") + (service.features.length > 3 ? "..." : "")
                      : "—"}
                  </TableCell>
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={open => {
        setIsEditDialogOpen(open)
        if (!open) {
          resetEditForm()
        }
      }}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
            <DialogDescription>
              Make changes to your service. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          {/* Limit form height and make it scrollable */}
          <div className="max-h-[60vh] overflow-y-auto pr-2">
            {editServiceForm && renderFormFields(editServiceForm, setEditServiceForm)}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsEditDialogOpen(false)
              resetEditForm()
            }}>
              Cancel
            </Button>
            <Button
              onClick={handleEdit}
              disabled={
                isLoading || isSubmitting ||
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
                'Save Changes'
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
            <Button variant="outline" onClick={() => {
              setIsDeleteDialogOpen(false)
              setSelectedServiceId(null)
            }}>
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
