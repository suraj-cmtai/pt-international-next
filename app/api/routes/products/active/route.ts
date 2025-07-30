import { NextResponse } from "next/server"
import ProductService from "../../../services/productServices"
import consoleManager from "../../../utils/consoleManager"

// Get active products (GET)
export async function GET() {
  try {
    const products = await ProductService.getActiveProducts()

    consoleManager.log("Fetched active products:", products.length)

    return NextResponse.json(
      {
        statusCode: 200,
        message: "Active products fetched successfully",
        data: products,
        errorCode: "NO",
        errorMessage: "",
      },
      { status: 200 },
    )
  } catch (error: any) {
    consoleManager.error("Error in GET /api/routes/products/active:", error)
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
