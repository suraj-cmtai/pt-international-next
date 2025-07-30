import { NextResponse } from "next/server";
import { UploadImage, ReplaceImage } from "../../../controller/imageController";
import ServiceService from "../../../services/serviceServices";
import consoleManager from "../../../utils/consoleManager";

// Helper to get service by id or slug
async function getServiceByIdOrSlug(idOrSlug: string) {
  // Try by ID first
  let service = null;
  try {
    service = await ServiceService.getServiceById(idOrSlug);
  } catch (e) {
    // Ignore error, try by slug next
  }
  if (!service) {
    service = await ServiceService.getServiceBySlug(idOrSlug);
  }
  return service;
}

// Get a specific service (GET)
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const service = await getServiceByIdOrSlug(id);

    if (!service) {
      return NextResponse.json(
        {
          statusCode: 404,
          errorCode: "NOT_FOUND",
          errorMessage: "Service not found",
        },
        { status: 404 }
      );
    }

    consoleManager.log("Fetched service:", id);

    return NextResponse.json(
      {
        statusCode: 200,
        message: "Service fetched successfully",
        data: {
          ...service,
          createdAt: service.createdAt,
          updatedAt: service.updatedAt,
        },
        errorCode: "NO",
        errorMessage: "",
      },
      { status: 200 }
    );
  } catch (error: any) {
    consoleManager.error("Error in GET /api/services/[id]:", error);
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

// Update a service (PUT)
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const formData = await req.formData();

    // Fetch the existing service to preserve createdAt and handle image replacement
    const existingService = await getServiceByIdOrSlug(id);
    if (!existingService) {
      return NextResponse.json(
        {
          statusCode: 404,
          errorCode: "NOT_FOUND",
          errorMessage: "Service not found",
        },
        { status: 404 }
      );
    }

    // Extract form data
    const title = formData.get("title");
    const description = formData.get("description");
    const longDescription = formData.get("longDescription");
    const category = formData.get("category");
    const price = formData.get("price");
    const slug = formData.get("slug");
    const features = formData.get("features");
    const isActive = formData.get("isActive");
    const file = formData.get("image");

    let imageUrl: string = existingService.image as string;

    // Upload new image if provided
    if (file && file instanceof File) {
      imageUrl = (await ReplaceImage(
        file,
        existingService.image as string,
        1200,
        800
      )) as string;
      consoleManager.log("Service image updated:", imageUrl);
    }

    // Parse features
    let parsedFeatures: string[] = [];
    if (features) {
      try {
        parsedFeatures = JSON.parse(features.toString());
      } catch {
        parsedFeatures = features
          .toString()
          .split(".")
          .map((f: string) => f.trim())
          .filter(Boolean);
      }
    } else {
      parsedFeatures = existingService.features || [];
    }

    // Prepare update data
    const updateData: any = {};
    if (title) updateData.title = title.toString();
    if (description) updateData.description = description.toString();
    if (longDescription) updateData.longDescription = longDescription.toString();
    if (category) updateData.category = category.toString();
    if (price) updateData.price = price.toString();
    if (slug) updateData.slug = slug.toString();
    if (features) updateData.features = parsedFeatures;
    if (isActive !== null) updateData.isActive = isActive === "true";
    if (imageUrl) updateData.image = imageUrl;

    // Preserve createdAt, update updatedAt will be handled in service
    updateData.createdAt = existingService.createdAt;

    const updatedService = await ServiceService.updateService(existingService.id, updateData);

    consoleManager.log("Service updated successfully:", existingService.id);

    return NextResponse.json(
      {
        statusCode: 200,
        message: "Service updated successfully",
        data: {
          ...updatedService,
          createdAt: updatedService.createdAt,
          updatedAt: updatedService.updatedAt,
        },
        errorCode: "NO",
        errorMessage: "",
      },
      { status: 200 }
    );
  } catch (error: any) {
    consoleManager.error("Error in PUT /api/services/[id]:", error);
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

// Delete a service (DELETE)
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate service exists
    const existingService = await getServiceByIdOrSlug(id);
    if (!existingService) {
      return NextResponse.json(
        {
          statusCode: 404,
          errorCode: "NOT_FOUND",
          errorMessage: "Service not found",
        },
        { status: 404 }
      );
    }

    await ServiceService.deleteService(existingService.id);

    consoleManager.log("Service deleted successfully:", existingService.id);

    return NextResponse.json(
      {
        statusCode: 200,
        message: "Service deleted successfully",
        errorCode: "NO",
        errorMessage: "",
      },
      { status: 200 }
    );
  } catch (error: any) {
    consoleManager.error("Error in DELETE /api/services/[id]:", error);
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
