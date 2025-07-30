import { db } from "../config/firebase";
import consoleManager from "../utils/consoleManager";
import admin from "firebase-admin";

// Product type with meta fields
export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription: string;
  category: string;
  price?: string;
  features: string[];
  images: string[];
  specifications?: Record<string, string>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

class ProductService {
  static products: Product[] = [];
  static isInitialized = false;
  private static collectionName = "products";

  // Helper method to convert Firestore timestamp to Date
  private static convertTimestamp(timestamp: any): Date {
    if (timestamp && timestamp._seconds) {
      return new Date(timestamp._seconds * 1000);
    }
    if (timestamp && typeof timestamp.toDate === "function") {
      return timestamp.toDate();
    }
    if (timestamp instanceof Date) {
      return timestamp;
    }
    if (typeof timestamp === "string") {
      const date = new Date(timestamp);
      return isNaN(date.getTime()) ? new Date() : date;
    }
    if (typeof timestamp === "number") {
      return new Date(timestamp);
    }
    if (!timestamp || (typeof timestamp === "object" && Object.keys(timestamp).length === 0)) {
      return new Date();
    }
    return new Date();
  }

  // Helper method to convert document data to Product type
  private static convertToType(id: string, data: any): Product {
    return {
      id,
      title: data.title || "",
      slug: data.slug || "",
      description: data.description || "",
      longDescription: data.longDescription || "",
      category: data.category || "",
      price: data.price || "",
      features: data.features || [],
      images: data.images || [],
      specifications: data.specifications || {},
      isActive: typeof data.isActive === "boolean" ? data.isActive : true,
      createdAt: this.convertTimestamp(data.createdAt),
      updatedAt: this.convertTimestamp(data.updatedAt),
    };
  }

  // Initialize Firestore real-time listener
  static initProducts() {
    if (this.isInitialized) return;

    consoleManager.log("Initializing Firestore listener for products...");
    const productsCollection = db.collection(this.collectionName);

    productsCollection.onSnapshot((snapshot: any) => {
      this.products = snapshot.docs.map((doc: any) => {
        return this.convertToType(doc.id, doc.data());
      });
      consoleManager.log(
        "Firestore Read: Products updated, count:",
        this.products.length
      );
    });

    this.isInitialized = true;
  }

  // Get all products with optional pagination and filters
  static async getAllProducts(
    pageSize = 10,
    lastDoc?: any,
    filters?: {
      category?: string;
      isActive?: boolean;
      searchTerm?: string;
    }
  ): Promise<{ products: Product[]; hasMore: boolean; lastDoc: any }> {
    try {
      let queryRef = db.collection(this.collectionName).orderBy("updatedAt", "desc");

      if (filters?.category) {
        queryRef = queryRef.where("category", "==", filters.category);
      }
      if (filters?.isActive !== undefined) {
        queryRef = queryRef.where("isActive", "==", filters.isActive);
      }
      if (lastDoc) {
        queryRef = queryRef.startAfter(lastDoc);
      }
      queryRef = queryRef.limit(pageSize + 1);

      const snapshot = await queryRef.get();
      const products: Product[] = [];
      let newLastDoc = null;

      snapshot.docs.forEach((doc: any, index: number) => {
        if (index < pageSize) {
          products.push(this.convertToType(doc.id, doc.data()));
          newLastDoc = doc;
        }
      });

      // Filter by search term if provided (client-side filtering for simplicity)
      let filteredProducts = products;
      if (filters?.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        filteredProducts = products.filter(
          (product) =>
            product.title.toLowerCase().includes(searchLower) ||
            product.description.toLowerCase().includes(searchLower)
        );
      }

      const hasMore = snapshot.docs.length > pageSize;

      consoleManager.log(`Fetched ${filteredProducts.length} products`);
      return { products: filteredProducts, hasMore, lastDoc: newLastDoc };
    } catch (error) {
      consoleManager.error("Error fetching products:", error);
      throw error;
    }
  }

  // Add a new product
  static async addProduct(productData: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<Product> {
    try {
      const timestamp = admin.firestore.FieldValue.serverTimestamp();
      const newProductRef = await db.collection(this.collectionName).add({
        ...productData,
        isActive: typeof productData.isActive === "boolean" ? productData.isActive : true,
        createdAt: timestamp,
        updatedAt: timestamp,
      });

      consoleManager.log("New product added with ID:", newProductRef.id);

      // Wait a moment for the server timestamp to be resolved
      await new Promise(resolve => setTimeout(resolve, 100));

      // Fetch the newly created product to get the resolved timestamps
      const newProductDoc = await db.collection(this.collectionName).doc(newProductRef.id).get();
      const newProduct = this.convertToType(newProductDoc.id, newProductDoc.data());

      // Update the cache
      await this.getAllProducts(10, undefined, undefined);

      return newProduct;
    } catch (error: any) {
      consoleManager.error("Error adding new product:", error);
      throw error;
    }
  }

  // Get active products only
  static async getActiveProducts(): Promise<Product[]> {
    return this.products.filter(product => product.isActive);
  }

  // Get product by ID
  static async getProductById(id: string): Promise<Product | null> {
    try {
      const product = this.products.find((product) => product.id === id);
      if (product) {
        consoleManager.log(`Product found in cache:`, id);
        return product;
      }

      const productDoc = await db.collection(this.collectionName).doc(id).get();

      if (!productDoc.exists) {
        consoleManager.error(`Product with ID ${id} not found in Firestore.`);
        return null;
      }

      const productData = this.convertToType(productDoc.id, productDoc.data());
      consoleManager.log(`Product fetched from Firestore:`, id);
      return productData;
    } catch (error) {
      consoleManager.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  }

  // Get product by slug
  static async getProductBySlug(slug: string): Promise<Product | null> {
    // Try to find in cache first
    let product = this.products.find(product => product.slug === slug && product.isActive);
    if (product) {
      consoleManager.log(`Product found in cache by slug:`, slug);
      return product;
    }

    // If not found in cache, query Firestore
    try {
      const querySnapshot = await db
        .collection(this.collectionName)
        .where("slug", "==", slug)
        .where("isActive", "==", true)
        .limit(1)
        .get();

      if (querySnapshot.empty) {
        consoleManager.error(`Product with slug ${slug} not found in Firestore.`);
        return null;
      }

      const doc = querySnapshot.docs[0];
      const productData = this.convertToType(doc.id, doc.data());
      consoleManager.log(`Product fetched from Firestore by slug:`, slug);
      return productData;
    } catch (error) {
      consoleManager.error(`Error fetching product by slug ${slug}:`, error);
      throw error;
    }
  }

  // Update product
  static async updateProduct(id: string, updateData: Partial<Product>): Promise<Product> {
    try {
      const timestamp = admin.firestore.FieldValue.serverTimestamp();
      const productRef = db.collection(this.collectionName).doc(id);
      await productRef.update({
        ...updateData,
        updatedAt: timestamp,
      });

      consoleManager.log("Product updated successfully:", id);

      // Wait a moment for the server timestamp to be resolved
      await new Promise(resolve => setTimeout(resolve, 100));

      await this.getAllProducts(10, undefined, undefined);

      const updatedProduct = await this.getProductById(id);
      if (!updatedProduct) throw new Error("Product not found after update");
      return updatedProduct;
    } catch (error: any) {
      consoleManager.error("Error updating product:", error);
      throw error;
    }
  }

  // Toggle product status
  static async toggleProductStatus(id: string): Promise<Product> {
    try {
      const product = await this.getProductById(id);
      if (!product) {
        throw new Error("Product not found");
      }
      const newStatus = !product.isActive;

      const productRef = db.collection(this.collectionName).doc(id);
      await productRef.update({
        isActive: newStatus,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Wait a moment for the server timestamp to be resolved
      await new Promise(resolve => setTimeout(resolve, 100));

      await this.getAllProducts(10, undefined, undefined);

      const updatedProduct = await this.getProductById(id);
      if (!updatedProduct) throw new Error("Product not found after status toggle");
      consoleManager.log(`Product ${newStatus ? "activated" : "deactivated"}:`, updatedProduct);
      return updatedProduct;
    } catch (error) {
      consoleManager.error("Error toggling product status:", error);
      throw error;
    }
  }

  // Delete product
  static async deleteProduct(id: string): Promise<{ id: string }> {
    try {
      const productRef = db.collection(this.collectionName).doc(id);
      await productRef.delete();

      consoleManager.log("Product deleted successfully:", id);
      await this.getAllProducts(10, undefined, undefined);
      return { id };
    } catch (error: any) {
      consoleManager.error("Error deleting product:", error);
      throw error;
    }
  }

  // Get products by category
  static async getProductsByCategory(category: string): Promise<Product[]> {
    return this.products.filter(product => product.category === category && product.isActive);
  }

  // Search products
  static async searchProducts(query: string): Promise<Product[]> {
    const searchTerm = query.toLowerCase();
    return this.products.filter(product =>
      product.title.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
    );
  }
}

export default ProductService;
