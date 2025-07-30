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

// Product type with meta fields
export interface Product {
  id?: string
  title: string
  slug: string
  description: string
  longDescription: string
  category: string
  price?: string
  features: string[]
  images: string[]
  specifications?: Record<string, string>
  isActive: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}

class ProductService {
  private collectionName = "products"

  // Upload multiple images to Firebase Storage
  async uploadImages(files: File[], productId: string): Promise<string[]> {
    try {
      const uploadPromises = files.map(async (file, index) => {
        const fileName = `${productId}_${index}_${Date.now()}_${file.name}`
        const storageRef = ref(storage, `products/${fileName}`)
        const snapshot = await uploadBytes(storageRef, file)
        return await getDownloadURL(snapshot.ref)
      })

      return await Promise.all(uploadPromises)
    } catch (error) {
      consoleManager.error("Error uploading product images:", error)
      throw error
    }
  }

  // Delete images from Firebase Storage
  async deleteImages(imageUrls: string[]): Promise<void> {
    try {
      const deletePromises = imageUrls.map(async (url) => {
        const imageRef = ref(storage, url)
        await deleteObject(imageRef)
      })

      await Promise.all(deletePromises)
    } catch (error) {
      consoleManager.error("Error deleting product images:", error)
      throw error
    }
  }

  // Add a new product
  async addProduct(productData: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<Product> {
    try {
      const now = Timestamp.now()
      const docData = {
        ...productData,
        createdAt: now,
        updatedAt: now,
      }

      const docRef = await addDoc(collection(db, this.collectionName), docData)
      const newProduct = { id: docRef.id, ...docData }

      consoleManager.log("Product added successfully:", newProduct)
      return newProduct
    } catch (error) {
      consoleManager.error("Error adding product:", error)
      throw error
    }
  }

  // Get all products with pagination and filters
  async getAllProducts(
    pageSize = 10,
    lastDoc?: any,
    filters?: {
      category?: string
      isActive?: boolean
      searchTerm?: string
    },
  ): Promise<{ products: Product[]; hasMore: boolean; lastDoc: any }> {
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
      const products: Product[] = []
      let newLastDoc = null

      querySnapshot.docs.forEach((doc, index) => {
        if (index < pageSize) {
          products.push({ id: doc.id, ...doc.data() } as Product)
          newLastDoc = doc
        }
      })

      // Filter by search term if provided (client-side filtering for simplicity)
      let filteredProducts = products
      if (filters?.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase()
        filteredProducts = products.filter(
          (product) =>
            product.title.toLowerCase().includes(searchLower) ||
            product.description.toLowerCase().includes(searchLower),
        )
      }

      const hasMore = querySnapshot.docs.length > pageSize

      consoleManager.log(`Fetched ${filteredProducts.length} products`)
      return { products: filteredProducts, hasMore, lastDoc: newLastDoc }
    } catch (error) {
      consoleManager.error("Error fetching products:", error)
      throw error
    }
  }

  // Get active products only
  async getActiveProducts(): Promise<Product[]> {
    try {
      const q = query(collection(db, this.collectionName), where("isActive", "==", true), orderBy("updatedAt", "desc"))

      const querySnapshot = await getDocs(q)
      const products: Product[] = []

      querySnapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() } as Product)
      })

      consoleManager.log(`Fetched ${products.length} active products`)
      return products
    } catch (error) {
      consoleManager.error("Error fetching active products:", error)
      throw error
    }
  }

  // Get product by ID
  async getProductById(id: string): Promise<Product | null> {
    try {
      const docRef = doc(db, this.collectionName, id)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const product = { id: docSnap.id, ...docSnap.data() } as Product
        consoleManager.log("Product fetched successfully:", product)
        return product
      } else {
        consoleManager.log("Product not found")
        return null
      }
    } catch (error) {
      consoleManager.error("Error fetching product:", error)
      throw error
    }
  }

  // Get product by slug
  async getProductBySlug(slug: string): Promise<Product | null> {
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
        const product = { id: doc.id, ...doc.data() } as Product
        consoleManager.log("Product fetched by slug:", product)
        return product
      } else {
        consoleManager.log("Product not found with slug:", slug)
        return null
      }
    } catch (error) {
      consoleManager.error("Error fetching product by slug:", error)
      throw error
    }
  }

  // Update product
  async updateProduct(id: string, productData: Partial<Product>): Promise<Product> {
    try {
      const docRef = doc(db, this.collectionName, id)
      const updateData = {
        ...productData,
        updatedAt: Timestamp.now(),
      }

      await updateDoc(docRef, updateData)

      const updatedDoc = await getDoc(docRef)
      const updatedProduct = { id: updatedDoc.id, ...updatedDoc.data() } as Product

      consoleManager.log("Product updated successfully:", updatedProduct)
      return updatedProduct
    } catch (error) {
      consoleManager.error("Error updating product:", error)
      throw error
    }
  }

  // Toggle product status
  async toggleProductStatus(id: string): Promise<Product> {
    try {
      const docRef = doc(db, this.collectionName, id)
      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()) {
        throw new Error("Product not found")
      }

      const currentData = docSnap.data() as Product
      const newStatus = !currentData.isActive

      await updateDoc(docRef, {
        isActive: newStatus,
        updatedAt: Timestamp.now(),
      })

      const updatedProduct = { id, ...currentData, isActive: newStatus }
      consoleManager.log(`Product ${newStatus ? "activated" : "deactivated"}:`, updatedProduct)
      return updatedProduct
    } catch (error) {
      consoleManager.error("Error toggling product status:", error)
      throw error
    }
  }

  // Delete product
  async deleteProduct(id: string): Promise<void> {
    try {
      // First get the product to delete associated images
      const product = await this.getProductById(id)
      if (product && product.images.length > 0) {
        await this.deleteImages(product.images)
      }

      const docRef = doc(db, this.collectionName, id)
      await deleteDoc(docRef)

      consoleManager.log("Product deleted successfully:", id)
    } catch (error) {
      consoleManager.error("Error deleting product:", error)
      throw error
    }
  }

  // Get products by category
  async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where("category", "==", category),
        where("isActive", "==", true),
        orderBy("updatedAt", "desc"),
      )

      const querySnapshot = await getDocs(q)
      const products: Product[] = []

      querySnapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() } as Product)
      })

      consoleManager.log(`Fetched ${products.length} products for category: ${category}`)
      return products
    } catch (error) {
      consoleManager.error("Error fetching products by category:", error)
      throw error
    }
  }
}

export default new ProductService()
