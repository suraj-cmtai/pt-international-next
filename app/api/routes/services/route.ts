import { type NextRequest, NextResponse } from "next/server"
import ServiceService from "../../services/serviceServices"
import consoleManager from "../../utils/consoleManager"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const category = searchParams.get("category")
    const isActive = searchParams.get("isActive")
    const searchTerm = searchParams.get("search")

    const filters: any = {}
    if (category) filters.category = category
    if (isActive !== null) filters.isActive = isActive === "true"
    if (searchTerm) filters.searchTerm = searchTerm

    const result = await ServiceService.getAllServices(limit, undefined, filters)

    consoleManager.log("Fetched services:", result.services.length)

    return NextResponse.json(
      {
        statusCode: 200,
        message: "Services fetched successfully",
        data: result.services,
        pagination: {
          hasMore: result.hasMore,
          page,
          limit,
          total: result.services.length,
        },
        errorCode: "NO",
        errorMessage: "",
      },
      { status: 200 },
    )
  } catch (error: any) {
    consoleManager.error("Error in GET /api/services:", error)
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

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const title = formData.get("title")
    const description = formData.get("description")
    const longDescription = formData.get("longDescription")
    const category = formData.get("category")
    const price = formData.get("price")
    const slug = formData.get("slug")
    const features = formData.get("features")
    const isActive = formData.get("isActive") === "true"

    // Validate required fields
    if (!title || !description || !longDescription || !category) {
      return NextResponse.json(
        {
          statusCode: 400,
          errorCode: "BAD_REQUEST",
          errorMessage: "Title, description, long description, and category are required",
        },
        { status: 400 },
      )
    }

    // Parse features
    const parsedFeatures = features ? JSON.parse(features.toString()) : []

    // Generate slug if not provided
    const serviceSlug =
      slug?.toString() ||
      title
        .toString()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")

    const serviceData = {
      title: title.toString(),
      slug: serviceSlug,
      description: description.toString(),
      longDescription: longDescription.toString(),
      category: category.toString(),
      price: price?.toString(),
      features: parsedFeatures,
      image: "/placeholder.svg?height=400&width=600", // Default image
      isActive,
    }

    const newService = await ServiceService.addService(serviceData)

    consoleManager.log("Service created successfully:", newService)

    return NextResponse.json(
      {
        statusCode: 201,
        message: "Service added successfully",
        data: newService,
        errorCode: "NO",
        errorMessage: "",
      },
      { status: 201 },
    )
  } catch (error: any) {
    consoleManager.error("Error in POST /api/services:", error)
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
