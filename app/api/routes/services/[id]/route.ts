import { NextResponse } from "next/server"
import ServiceService from "../../../services/serviceServices"
import consoleManager from "../../../utils/consoleManager"

// Get service by ID (GET)
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const service = await ServiceService.getServiceById(id)

    if (!service) {
      return NextResponse.json(
        {
          statusCode: 404,
          errorCode: "NOT_FOUND",
          errorMessage: "Service not found",
        },
        { status: 404 },
      )
    }

    consoleManager.log("Service fetched successfully:", service)

    return NextResponse.json(
      {
        statusCode: 200,
        message: "Service fetched successfully",
        data: service,
        errorCode: "NO",
        errorMessage: "",
      },
      { status: 200 },
    )
  } catch (error: any) {
    consoleManager.error("Error in GET /api/services/[id]:", error)
    return NextResponse.json(
      {
        statusCode: 500,
        errorCode: "INTERNAL_ERROR",
        errorMessage: error.message || "Internal Server Error",
      },
      { status: 500 },
    )
  }
}

// Update service (PUT)
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const formData = await req.formData()

    const updateData: any = {}

    // Extract form data
    const title = formData.get("title")
    const description = formData.get("description")
    const longDescription = formData.get("longDescription")
    const category = formData.get("category")
    const price = formData.get("price")
    const slug = formData.get("slug")
    const features = formData.get("features")
    const isActive = formData.get("isActive")

    if (title) updateData.title = title.toString()
    if (description) updateData.description = description.toString()
    if (longDescription) updateData.longDescription = longDescription.toString()
    if (category) updateData.category = category.toString()
    if (price) updateData.price = price.toString()
    if (slug) updateData.slug = slug.toString()
    if (features) updateData.features = JSON.parse(features.toString())
    if (isActive !== null) updateData.isActive = isActive === "true"

    const updatedService = await ServiceService.updateService(id, updateData)

    consoleManager.log("Service updated successfully:", updatedService)

    return NextResponse.json(
      {
        statusCode: 200,
        message: "Service updated successfully",
        data: updatedService,
        errorCode: "NO",
        errorMessage: "",
      },
      { status: 200 },
    )
  } catch (error: any) {
    consoleManager.error("Error in PUT /api/services/[id]:", error)
    return NextResponse.json(
      {
        statusCode: 500,
        errorCode: "INTERNAL_ERROR",
        errorMessage: error.message || "Internal Server Error",
      },
      { status: 500 },
    )
  }
}

// Delete service (DELETE)
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await ServiceService.deleteService(id)

    consoleManager.log("Service deleted successfully:", id)

    return NextResponse.json(
      {
        statusCode: 200,
        message: "Service deleted successfully",
        errorCode: "NO",
        errorMessage: "",
      },
      { status: 200 },
    )
  } catch (error: any) {
    consoleManager.error("Error in DELETE /api/services/[id]:", error)
    return NextResponse.json(
      {
        statusCode: 500,
        errorCode: "INTERNAL_ERROR",
        errorMessage: error.message || "Internal Server Error",
      },
      { status: 500 },
    )
  }
}
