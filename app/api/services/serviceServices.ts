


import { db } from "../config/firebase";
import consoleManager from "../utils/consoleManager";
import admin from "firebase-admin";

// Copy of Service type with createdAt, updatedAt, isActive
export interface ServiceWithMeta {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  features: string[];
  image: string;
  category: string;
  price?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

class ServiceService {
  static services: ServiceWithMeta[] = [];
  static isInitialized = false;
  private static collectionName = "services";

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

  // Helper method to convert document data to ServiceWithMeta type
  private static convertToType(id: string, data: any): ServiceWithMeta {
    return {
      id,
      slug: data.slug || "",
      title: data.title || "",
      description: data.description || "",
      longDescription: data.longDescription || "",
      features: data.features || [],
      image: data.image || "",
      category: data.category || "",
      price: data.price || "",
      isActive: typeof data.isActive === "boolean" ? data.isActive : true,
      createdAt: this.convertTimestamp(data.createdAt),
      updatedAt: this.convertTimestamp(data.updatedAt),
    };
  }

  // Initialize Firestore real-time listener
  static initServices() {
    if (this.isInitialized) return;

    consoleManager.log("Initializing Firestore listener for services...");
    const servicesCollection = db.collection(this.collectionName);

    servicesCollection.onSnapshot((snapshot: any) => {
      this.services = snapshot.docs.map((doc: any) => {
        return this.convertToType(doc.id, doc.data());
      });
      consoleManager.log(
        "Firestore Read: Services updated, count:",
        this.services.length
      );
    });

    this.isInitialized = true;
  }

  // Get all services
  static async getAllServices(forceRefresh = true) {
    if (forceRefresh || !this.isInitialized) {
      consoleManager.log("Force refreshing services from Firestore...");
      const snapshot = await db
        .collection(this.collectionName)
        .orderBy("createdAt", "desc")
        .get();
      this.services = snapshot.docs.map((doc: any) => {
        return this.convertToType(doc.id, doc.data());
      });
      this.isInitialized = true;
    } else {
      consoleManager.log("Returning cached services. No Firestore read.");
    }
    return this.services;
  }

  // Add a new service
  static async addService(serviceData: Omit<ServiceWithMeta, "id" | "createdAt" | "updatedAt">) {
    try {
      const timestamp = admin.firestore.FieldValue.serverTimestamp();
      const newServiceRef = await db.collection(this.collectionName).add({
        ...serviceData,
        isActive: typeof serviceData.isActive === "boolean" ? serviceData.isActive : true,
        createdAt: timestamp,
        updatedAt: timestamp,
      });

      consoleManager.log("New service added with ID:", newServiceRef.id);

      // Wait a moment for the server timestamp to be resolved
      await new Promise(resolve => setTimeout(resolve, 100));

      // Fetch the newly created service to get the resolved timestamps
      const newServiceDoc = await db.collection(this.collectionName).doc(newServiceRef.id).get();
      const newService = this.convertToType(newServiceDoc.id, newServiceDoc.data());

      // Update the cache
      await this.getAllServices(true);

      return newService;
    } catch (error: any) {
      consoleManager.error("Error adding new service:", error);
      throw error;
    }
  }

  // Get a service by ID
  static async getServiceById(id: string) {
    try {
      const service = this.services.find((service) => service.id === id);
      if (service) {
        consoleManager.log(`Service found in cache:`, id);
        return service;
      }

      const serviceDoc = await db.collection(this.collectionName).doc(id).get();

      if (!serviceDoc.exists) {
        consoleManager.error(`Service with ID ${id} not found in Firestore.`);
        throw new Error("Service not found");
      }

      const serviceData = this.convertToType(serviceDoc.id, serviceDoc.data());
      consoleManager.log(`Service fetched from Firestore:`, id);
      return serviceData;
    } catch (error) {
      consoleManager.error(`Error fetching service ${id}:`, error);
      throw error;
    }
  }

  // Update a service by ID
  static async updateService(id: string, updateData: Partial<ServiceWithMeta>) {
    try {
      const timestamp = admin.firestore.FieldValue.serverTimestamp();
      const serviceRef = db.collection(this.collectionName).doc(id);
      await serviceRef.update({
        ...updateData,
        updatedAt: timestamp,
      });

      consoleManager.log("Service updated successfully:", id);

      // Wait a moment for the server timestamp to be resolved
      await new Promise(resolve => setTimeout(resolve, 100));

      await this.getAllServices(true);

      const updatedService = await this.getServiceById(id);
      return updatedService;
    } catch (error: any) {
      consoleManager.error("Error updating service:", error);
      throw error;
    }
  }

  // Delete a service by ID
  static async deleteService(id: string) {
    try {
      const serviceRef = db.collection(this.collectionName).doc(id);
      await serviceRef.delete();

      consoleManager.log("Service deleted successfully:", id);
      await this.getAllServices(true);
      return { id };
    } catch (error: any) {
      consoleManager.error("Error deleting service:", error);
      throw error;
    }
  }

  // Get services by category
  static async getServicesByCategory(category: string) {
    return this.services.filter(service => service.category === category);
  }

  // Get active services
  static async getActiveServices() {
    return this.services.filter(service => service.isActive);
  }

  // Get service by slug
  static async getServiceBySlug(slug: string) {
    // Try to find in cache first
    let service = this.services.find(service => service.slug === slug && service.isActive);
    if (service) {
      consoleManager.log(`Service found in cache by slug:`, slug);
      return service;
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
        consoleManager.error(`Service with slug ${slug} not found in Firestore.`);
        return null;
      }

      const doc = querySnapshot.docs[0];
      const serviceData = this.convertToType(doc.id, doc.data());
      consoleManager.log(`Service fetched from Firestore by slug:`, slug);
      return serviceData;
    } catch (error) {
      consoleManager.error(`Error fetching service by slug ${slug}:`, error);
      throw error;
    }
  }

  // Search services
  static async searchServices(query: string) {
    const searchTerm = query.toLowerCase();
    return this.services.filter(service =>
      service.title.toLowerCase().includes(searchTerm) ||
      service.description.toLowerCase().includes(searchTerm) ||
      service.category.toLowerCase().includes(searchTerm)
    );
  }
}

export default ServiceService;
