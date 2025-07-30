import admin from "firebase-admin";
import { db } from "../config/firebase";
import consoleManager from "../utils/consoleManager";

// Product type with meta fields
export interface ProductWithMeta {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  features: string[];
  images: string[];
  category: string;
  price?: string;
  specifications?: Record<string, string>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

class ProductService {
  static products: ProductWithMeta[] = [];
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

  // Helper method to convert document data to ProductWithMeta type
  private static convertToType(id: string, data: any): ProductWithMeta {
    return {
      id,
      slug: data.slug || "",
      title: data.title || "",
      description: data.description || "",
      longDescription: data.longDescription || "",
      features: data.features || [],
      images: data.images || [],
      category: data.category || "",
      price: data.price || "",
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

  // Get all products
  static async getAllProducts(forceRefresh = true) {
    if (forceRefresh || !this.isInitialized) {
      consoleManager.log("Force refreshing products from Firestore...");
      const snapshot = await db
        .collection(this.collectionName)
        .orderBy("updatedAt", "desc")
        .get();
      this.products = snapshot.docs.map((doc: any) => {
        return this.convertToType(doc.id, doc.data());
      });
      this.isInitialized = true;
    } else {
      consoleManager.log("Returning cached products. No Firestore read.");
    }
    return this.products;
  }

  // Add a new product
  static async addProduct(productData: Omit<ProductWithMeta, "id" | "createdAt" | "updatedAt">) {
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
      await this.getAllProducts(true);

      return newProduct;
    } catch (error: any) {
      consoleManager.error("Error adding new product:", error);
      throw error;
    }
  }

  // Get a product by ID
  static async getProductById(id: string) {
    try {
      const product = this.products.find((product) => product.id === id);
      if (product) {
        consoleManager.log(`Product found in cache:`, id);
        return product;
      }

      const productDoc = await db.collection(this.collectionName).doc(id).get();

      if (!productDoc.exists) {
        consoleManager.error(`Product with ID ${id} not found in Firestore.`);
        throw new Error("Product not found");
      }

      const productData = this.convertToType(productDoc.id, productDoc.data());
      consoleManager.log(`Product fetched from Firestore:`, id);
      return productData;
    } catch (error) {
      consoleManager.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  }

  // Update a product by ID
  static async updateProduct(id: string, updateData: Partial<ProductWithMeta>) {
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

      await this.getAllProducts(true);

      const updatedProduct = await this.getProductById(id);
      return updatedProduct;
    } catch (error: any) {
      consoleManager.error("Error updating product:", error);
      throw error;
    }
  }

  // Delete a product by ID (and its images)
  static async deleteProduct(id: string) {
    try {
      const product = await this.getProductById(id);
      if (product && product.images && product.images.length > 0) {
        // Delete all images associated with the product
        // You should implement image deletion logic here, e.g. using ReplaceImage or a batch delete
        // For now, just log
        consoleManager.log("Deleting images for product:", product.images);
        // Example: await ReplaceImage(null, imageUrl, ...);
      }

      const productRef = db.collection(this.collectionName).doc(id);
      await productRef.delete();

      consoleManager.log("Product deleted successfully:", id);
      await this.getAllProducts(true);
      return { id };
    } catch (error: any) {
      consoleManager.error("Error deleting product:", error);
      throw error;
    }
  }

  // Get products by category
  static async getProductsByCategory(category: string) {
    return this.products.filter(product => product.category === category && product.isActive);
  }

  // Get active products
  static async getActiveProducts() {
    return this.products.filter(product => product.isActive);
  }

  // Get product by slug
  static async getProductBySlug(slug: string) {
    return this.products.find(product => product.slug === slug && product.isActive);
  }

  // Search products
  static async searchProducts(query: string) {
    const searchTerm = query.toLowerCase();
    return this.products.filter(product =>
      product.title.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
    );
  }

  // Toggle product status
  static async toggleProductStatus(id: string) {
    try {
      const product = await this.getProductById(id);
      if (!product) {
        throw new Error("Product not found");
      }
      const newStatus = !product.isActive;
      await this.updateProduct(id, { isActive: newStatus });
      const updatedProduct = await this.getProductById(id);
      consoleManager.log(`Product ${newStatus ? "activated" : "deactivated"}:`, updatedProduct);
      return updatedProduct;
    } catch (error: any) {
      consoleManager.error("Error toggling product status:", error);
      throw error;
    }
  }
}

export default ProductService;
