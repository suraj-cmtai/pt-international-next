"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from "@/lib/redux/store"
import {
  selectSubscribers,
  selectSubscriberLoading,
  selectSubscriberError,
  fetchSubscribers,
  createSubscriber,
  updateSubscriber,
  deleteSubscriber
} from "@/lib/redux/features/subscriberSlice"
import { format } from "date-fns"
import { toast } from "sonner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { motion } from "framer-motion"
import { CheckCircle, Loader2, Mail, MoreVertical, Plus, Search, XCircle } from "lucide-react"

// Types
interface Subscriber {
  id: string;
  email: string;
  status: 'Active' | 'Inactive' | 'Unsubscribed';
  source: string;
  createdAt: string;
  updatedAt: string;
  lastEmailSent?: string | null;
}

export default function SubscribersPage() {
  const dispatch = useDispatch<AppDispatch>()
  const subscribers = useSelector(selectSubscribers)
  const isLoading = useSelector(selectSubscriberLoading)
  const error = useSelector(selectSubscriberError)
  
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedSubscriber, setSelectedSubscriber] = useState<Subscriber | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newSubscriber, setNewSubscriber] = useState<{
    email: string;
    status: 'Active' | 'Inactive' | 'Unsubscribed';
    source: string;
  }>({
    email: "",
    status: "Active",
    source: "Manual Entry"
  })

  useEffect(() => {
    dispatch(fetchSubscribers())
  }, [dispatch])

  // Filter subscribers based on search query and status filter
  const filteredSubscribers = subscribers.filter(subscriber => {
    const matchesSearch = 
      subscriber.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subscriber.source.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || subscriber.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Get color based on status
  const getStatusColor = (status: Subscriber['status']) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Inactive":
        return "bg-yellow-100 text-yellow-800"
      case "Unsubscribed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Handle adding new subscriber
  const handleAdd = async () => {
    const formData = new FormData()
    formData.append("email", newSubscriber.email)
    formData.append("status", newSubscriber.status)
    formData.append("source", newSubscriber.source)

    try {
      await dispatch(createSubscriber(formData)).unwrap()
      setIsAddDialogOpen(false)
      setNewSubscriber({
        email: "",
        status: "Active",
        source: "Manual Entry"
      })
      toast.success("Subscriber added successfully!")
    } catch (error) {
      toast.error("Failed to add subscriber")
    }
  }

  // Handle updating subscriber
  const handleUpdate = async () => {
    if (!selectedSubscriber) return

    const formData = new FormData()
    formData.append("email", selectedSubscriber.email)
    formData.append("status", selectedSubscriber.status)
    formData.append("source", selectedSubscriber.source)

    try {
      await dispatch(updateSubscriber({ 
        id: selectedSubscriber.id, 
        data: formData 
      })).unwrap()
      setIsEditDialogOpen(false)
      toast.success("Subscriber updated successfully!")
    } catch (error) {
      toast.error("Failed to update subscriber")
    }
  }

  // Handle deleting subscriber
  const handleDelete = async () => {
    if (!selectedSubscriber) return

    try {
      await dispatch(deleteSubscriber(selectedSubscriber.id)).unwrap()
      setIsDeleteDialogOpen(false)
      toast.success("Subscriber deleted successfully!")
    } catch (error) {
      toast.error("Failed to delete subscriber")
    }
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">Error: {error}</p>
        <Button 
          onClick={() => dispatch(fetchSubscribers())}
          className="mt-4"
        >
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Email Subscribers</h1>
        <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" /> Add Subscriber
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search subscribers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
            <SelectItem value="Unsubscribed">Unsubscribed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <motion.div layout className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Subscribed Date</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Last Email</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : filteredSubscribers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No subscribers found
                </TableCell>
              </TableRow>
            ) : (
              filteredSubscribers.map((subscriber) => (
                <motion.tr
                  key={subscriber.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  layout
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      {subscriber.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(subscriber.status)}>
                      {subscriber.status === "Active" && <CheckCircle className="w-3 h-3 mr-1" />}
                      {subscriber.status === "Unsubscribed" && <XCircle className="w-3 h-3 mr-1" />}
                      {subscriber.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{subscriber.source}</TableCell>
                  <TableCell>{format(new Date(subscriber.createdAt), "MMM d, yyyy")}</TableCell>
                  <TableCell>{format(new Date(subscriber.updatedAt), "MMM d, yyyy")}</TableCell>
                  <TableCell>
                    {subscriber.lastEmailSent 
                      ? format(new Date(subscriber.lastEmailSent), "MMM d, yyyy")
                      : "Never"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedSubscriber(subscriber)
                            setIsEditDialogOpen(true)
                          }}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            setSelectedSubscriber(subscriber)
                            setIsDeleteDialogOpen(true)
                          }}
                        >
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

      {/* Add Subscriber Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Subscriber</DialogTitle>
            <DialogDescription>
              Add a new email subscriber to your list.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="email">Email</label>
              <Input
                id="email"
                type="email"
                value={newSubscriber.email}
                onChange={(e) => setNewSubscriber({ ...newSubscriber, email: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="source">Source</label>
              <Input
                id="source"
                value={newSubscriber.source}
                onChange={(e) => setNewSubscriber({ ...newSubscriber, source: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="status">Status</label>
              <Select
                value={newSubscriber.status}
                onValueChange={(value: 'Active' | 'Inactive' | 'Unsubscribed') =>
                  setNewSubscriber({ ...newSubscriber, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Unsubscribed">Unsubscribed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd} disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Subscriber"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Subscriber Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Subscriber</DialogTitle>
            <DialogDescription>
              Update subscriber information.
            </DialogDescription>
          </DialogHeader>
          {selectedSubscriber && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="edit-email">Email</label>
                <Input
                  id="edit-email"
                  type="email"
                  value={selectedSubscriber.email}
                  onChange={(e) =>
                    setSelectedSubscriber({
                      ...selectedSubscriber,
                      email: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="edit-source">Source</label>
                <Input
                  id="edit-source"
                  value={selectedSubscriber.source}
                  onChange={(e) =>
                    setSelectedSubscriber({
                      ...selectedSubscriber,
                      source: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="edit-status">Status</label>
                <Select
                  value={selectedSubscriber.status}
                  onValueChange={(value: 'Active' | 'Inactive' | 'Unsubscribed') =>
                    setSelectedSubscriber({
                      ...selectedSubscriber,
                      status: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Unsubscribed">Unsubscribed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Subscriber Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Subscriber</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this subscriber? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}