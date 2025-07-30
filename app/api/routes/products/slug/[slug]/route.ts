import { NextResponse } from "next/server"
import ProductService from "../../../../services/productServices"
import consoleManager from "../../../../utils/consoleManager"

// Get product by slug (GET)
export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const product = await ProductService.getProductBySlug(slug)

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

    consoleManager.log("Product fetched by slug successfully:", product)

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
    consoleManager.error("Error in GET /api/routes/products/slug/[slug]:", error)
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
