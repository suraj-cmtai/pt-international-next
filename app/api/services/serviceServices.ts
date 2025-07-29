import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
} from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { db, storage } from "../config/firebase"
import consoleManager from "../utils/consoleManager"

export interface Service {
  id?: string
  title: string
  slug: string
  description: string
  longDescription: string
  category: string
  price?: string
  features: string[]
  image: string
  isActive: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}

class ServiceService {
  private collectionName = "services"

  // Upload image to Firebase Storage
  async uploadImage(file: File, serviceId: string): Promise<string> {
    try {
      const fileName = `${serviceId}_${Date.now()}_${file.name}`
      const storageRef = ref(storage, `services/${fileName}`)
      const snapshot = await uploadBytes(storageRef, file)
      return await getDownloadURL(snapshot.ref)
    } catch (error) {
      consoleManager.error("Error uploading service image:", error)
      throw error
    }
  }

  // Delete image from Firebase Storage
  async deleteImage(imageUrl: string): Promise<void> {
    try {
      const imageRef = ref(storage, imageUrl)
      await deleteObject(imageRef)
    } catch (error) {
      consoleManager.error("Error deleting service image:", error)
      throw error
    }
  }

  // Add a new service
  async addService(serviceData: Omit<Service, "id" | "createdAt" | "updatedAt">): Promise<Service> {
    try {
      const now = Timestamp.now()
      const docData = {
        ...serviceData,
        createdAt: now,
        updatedAt: now,
      }

      const docRef = await addDoc(collection(db, this.collectionName), docData)
      const newService = { id: docRef.id, ...docData }

      consoleManager.log("Service added successfully:", newService)
      return newService
    } catch (error) {
      consoleManager.error("Error adding service:", error)
      throw error
    }
  }

  // Get all services with pagination and filters
  async getAllServices(
    pageSize = 10,
    lastDoc?: any,
    filters?: {
      category?: string
      isActive?: boolean
      searchTerm?: string
    },
  ): Promise<{ services: Service[]; hasMore: boolean; lastDoc: any }> {
    try {
      let q = query(collection(db, this.collectionName), orderBy("updatedAt", "desc"))

      // Apply filters
      if (filters?.category) {
        q = query(q, where("category", "==", filters.category))
      }

      if (filters?.isActive !== undefined) {
        q = query(q, where("isActive", "==", filters.isActive))
      }

      // Add pagination
      q = query(q, limit(pageSize + 1))

      if (lastDoc) {
        q = query(q, startAfter(lastDoc))
      }

      const querySnapshot = await getDocs(q)
      const services: Service[] = []
      let newLastDoc = null

      querySnapshot.docs.forEach((doc, index) => {
        if (index < pageSize) {
          services.push({ id: doc.id, ...doc.data() } as Service)
          newLastDoc = doc
        }
      })

      // Filter by search term if provided (client-side filtering for simplicity)
      let filteredServices = services
      if (filters?.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase()
        filteredServices = services.filter(
          (service) =>
            service.title.toLowerCase().includes(searchLower) ||
            service.description.toLowerCase().includes(searchLower),
        )
      }

      const hasMore = querySnapshot.docs.length > pageSize

      consoleManager.log(`Fetched ${filteredServices.length} services`)
      return { services: filteredServices, hasMore, lastDoc: newLastDoc }
    } catch (error) {
      consoleManager.error("Error fetching services:", error)
      throw error
    }
  }

  // Get active services only
  async getActiveServices(): Promise<Service[]> {
    try {
      const q = query(collection(db, this.collectionName), where("isActive", "==", true), orderBy("updatedAt", "desc"))

      const querySnapshot = await getDocs(q)
      const services: Service[] = []

      querySnapshot.forEach((doc) => {
        services.push({ id: doc.id, ...doc.data() } as Service)
      })

      consoleManager.log(`Fetched ${services.length} active services`)
      return services
    } catch (error) {
      consoleManager.error("Error fetching active services:", error)
      throw error
    }
  }

  // Get service by ID
  async getServiceById(id: string): Promise<Service | null> {
    try {
      const docRef = doc(db, this.collectionName, id)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const service = { id: docSnap.id, ...docSnap.data() } as Service
        consoleManager.log("Service fetched successfully:", service)
        return service
      } else {
        consoleManager.log("Service not found")
        return null
      }
    } catch (error) {
      consoleManager.error("Error fetching service:", error)
      throw error
    }
  }

  // Get service by slug
  async getServiceBySlug(slug: string): Promise<Service | null> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where("slug", "==", slug),
        where("isActive", "==", true),
        limit(1),
      )

      const querySnapshot = await getDocs(q)

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0]
        const service = { id: doc.id, ...doc.data() } as Service
        consoleManager.log("Service fetched by slug:", service)
        return service
      } else {
        consoleManager.log("Service not found with slug:", slug)
        return null
      }
    } catch (error) {
      consoleManager.error("Error fetching service by slug:", error)
      throw error
    }
  }

  // Update service
  async updateService(id: string, serviceData: Partial<Service>): Promise<Service> {
    try {
      const docRef = doc(db, this.collectionName, id)
      const updateData = {
        ...serviceData,
        updatedAt: Timestamp.now(),
      }

      await updateDoc(docRef, updateData)

      const updatedDoc = await getDoc(docRef)
      const updatedService = { id: updatedDoc.id, ...updatedDoc.data() } as Service

      consoleManager.log("Service updated successfully:", updatedService)
      return updatedService
    } catch (error) {
      consoleManager.error("Error updating service:", error)
      throw error
    }
  }

  // Toggle service status
  async toggleServiceStatus(id: string): Promise<Service> {
    try {
      const docRef = doc(db, this.collectionName, id)
      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()) {
        throw new Error("Service not found")
      }

      const currentData = docSnap.data() as Service
      const newStatus = !currentData.isActive

      await updateDoc(docRef, {
        isActive: newStatus,
        updatedAt: Timestamp.now(),
      })

      const updatedService = { id, ...currentData, isActive: newStatus }
      consoleManager.log(`Service ${newStatus ? "activated" : "deactivated"}:`, updatedService)
      return updatedService
    } catch (error) {
      consoleManager.error("Error toggling service status:", error)
      throw error
    }
  }

  // Delete service
  async deleteService(id: string): Promise<void> {
    try {
      // First get the service to delete associated image
      const service = await this.getServiceById(id)
      if (service && service.image) {
        await this.deleteImage(service.image)
      }

      const docRef = doc(db, this.collectionName, id)
      await deleteDoc(docRef)

      consoleManager.log("Service deleted successfully:", id)
    } catch (error) {
      consoleManager.error("Error deleting service:", error)
      throw error
    }
  }

  // Get services by category
  async getServicesByCategory(category: string): Promise<Service[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where("category", "==", category),
        where("isActive", "==", true),
        orderBy("updatedAt", "desc"),
      )

      const querySnapshot = await getDocs(q)
      const services: Service[] = []

      querySnapshot.forEach((doc) => {
        services.push({ id: doc.id, ...doc.data() } as Service)
      })

      consoleManager.log(`Fetched ${services.length} services for category: ${category}`)
      return services
    } catch (error) {
      consoleManager.error("Error fetching services by category:", error)
      throw error
    }
  }
}

export default new ServiceService()
