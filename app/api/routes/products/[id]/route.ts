import { NextResponse } from "next/server"
import ProductService from "../../../services/productServices"
import consoleManager from "../../../utils/consoleManager"

// Get product by ID (GET)
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const product = await ProductService.getProductById(id)

    if (!product) {
      return NextResponse.json(
        {
          statusCode: 404,
          errorCode: "NOT_FOUND",
          errorMessage: "Product not found",
        },
        { status: 404 },
      )
    }

    consoleManager.log("Product fetched successfully:", product)

    return NextResponse.json(
      {
        statusCode: 200,
        message: "Product fetched successfully",
        data: product,
        errorCode: "NO",
        errorMessage: "",
      },
      { status: 200 },
    )
  } catch (error: any) {
    consoleManager.error("Error in GET /api/routes/products/[id]:", error)
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

// Update product (PUT)
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
    const specifications = formData.get("specifications")
    const isActive = formData.get("isActive")

    if (title) updateData.title = title.toString()
    if (description) updateData.description = description.toString()
    if (longDescription) updateData.longDescription = longDescription.toString()
    if (category) updateData.category = category.toString()
    if (price) updateData.price = price.toString()
    if (slug) updateData.slug = slug.toString()
    if (features) updateData.features = JSON.parse(features.toString())
    if (specifications) updateData.specifications = JSON.parse(specifications.toString())
    if (isActive !== null) updateData.isActive = isActive === "true"

    const updatedProduct = await ProductService.updateProduct(id, updateData)

    consoleManager.log("Product updated successfully:", updatedProduct)

    return NextResponse.json(
      {
        statusCode: 200,
        message: "Product updated successfully",
        data: updatedProduct,
        errorCode: "NO",
        errorMessage: "",
      },
      { status: 200 },
    )
  } catch (error: any) {
    consoleManager.error("Error in PUT /api/routes/products/[id]:", error)
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

// Delete product (DELETE)
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await ProductService.deleteProduct(id)

    consoleManager.log("Product deleted successfully:", id)

    return NextResponse.json(
      {
        statusCode: 200,
        message: "Product deleted successfully",
        errorCode: "NO",
        errorMessage: "",
      },
      { status: 200 },
    )
  } catch (error: any) {
    consoleManager.error("Error in DELETE /api/routes/products/[id]:", error)
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
