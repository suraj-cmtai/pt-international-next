import { NextResponse } from "next/server"
import ProductService from "../../../../services/productServices"
import consoleManager from "../../../../utils/consoleManager"

// Get products by category (GET)
export async function GET(req: Request, { params }: { params: Promise<{ category: string }> }) {
  try {
    const { category } = await params
    const products = await ProductService.getProductsByCategory(category)

    consoleManager.log(`Fetched products for category ${category}:`, products.length)

    return NextResponse.json(
      {
        statusCode: 200,
        message: "Products fetched successfully",
        data: products,
        errorCode: "NO",
        errorMessage: "",
      },
      { status: 200 },
    )
  } catch (error: any) {
    consoleManager.error("Error in GET /api/routes/products/category/[category]:", error)
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
