import { NextResponse } from "next/server";
import { UploadImage } from "../../controller/imageController";
import ServiceService from "../../services/serviceServices";
import consoleManager from "../../utils/consoleManager";

// Get all services (GET)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const isActive = searchParams.get("isActive");
    const search = searchParams.get("search");

    let services = await ServiceService.getAllServices();

    // Apply filters if provided
    if (category) {
      services = services.filter((service: any) => service.category === category);
    }
    if (isActive !== null) {
      services = services.filter((service: any) => service.isActive === (isActive === "true"));
    }
    if (search) {
      const searchTerm = search.toLowerCase();
      services = services.filter(
        (service: any) =>
          service.title.toLowerCase().includes(searchTerm) ||
          service.description.toLowerCase().includes(searchTerm) ||
          service.category.toLowerCase().includes(searchTerm)
      );
    }

    consoleManager.log("Fetched services with filters:", services.length);

    return NextResponse.json(
      {
        statusCode: 200,
        message: "Services fetched successfully",
        data: services,
        errorCode: "NO",
        errorMessage: "",
      },
      { status: 200 }
    );
  } catch (error: any) {
    consoleManager.error("Error in GET /api/services:", error);
    return NextResponse.json(
      {
        statusCode: 500,
        errorCode: "INTERNAL_ERROR",
        errorMessage: error.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

// Add a new service (POST)
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const title = formData.get("title");
    const description = formData.get("description");
    const longDescription = formData.get("longDescription");
    const category = formData.get("category");
    const price = formData.get("price");
    const slug = formData.get("slug");
    const features = formData.get("features");
    const isActive = formData.get("isActive") === "true";
    const file = formData.get("image");

    // Validate required fields
    if (!title || !description || !longDescription || !category) {
      return NextResponse.json(
        {
          statusCode: 400,
          errorCode: "BAD_REQUEST",
          errorMessage: "Title, description, long description, and category are required",
        },
        { status: 400 }
      );
    }

    // Parse features
    let parsedFeatures: string[] = [];
    if (features) {
      try {
        parsedFeatures = JSON.parse(features.toString());
      } catch {
        parsedFeatures = features.toString().split(".").map((f: string) => f.trim()).filter(Boolean);
      }
    }

    // Generate slug if not provided
    const serviceSlug =
      slug?.toString() ||
      title
        .toString()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    let imageUrl = null;

    // Upload image if provided
    if (file && file instanceof File) {
      imageUrl = await UploadImage(file, 1200, 800);
      consoleManager.log("Service image uploaded:", imageUrl);
    }

    const serviceData = {
      title: title.toString(),
      slug: serviceSlug,
      description: description.toString(),
      longDescription: longDescription.toString(),
      category: category.toString(),
      price: price?.toString(),
      features: parsedFeatures,
      image: imageUrl || "/placeholder.svg?height=400&width=600" ,
      isActive,
    };

    // Ensure image is a string (or null), as required by ServiceWithMeta
    const serviceDataForAdd = {
      ...serviceData,
      image: typeof serviceData.image === "string" ? serviceData.image : "/placeholder.svg?height=400&width=600"
    };

    const newService = await ServiceService.addService(serviceDataForAdd);

    consoleManager.log("Service created successfully:", newService);

    return NextResponse.json(
      {
        statusCode: 201,
        message: "Service added successfully",
        data: newService,
        errorCode: "NO",
        errorMessage: "",
      },
      { status: 201 }
    );
  } catch (error: any) {
    consoleManager.error("Error in POST /api/services:", error);
    return NextResponse.json(
      {
        statusCode: 500,
        errorCode: "INTERNAL_ERROR",
        errorMessage: error.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
