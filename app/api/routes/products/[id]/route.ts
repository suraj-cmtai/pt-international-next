import { type NextRequest, NextResponse } from "next/server"
import { products } from "@/lib/data"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const product = products.find((p) => p.id === id)

    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: product,
      message: "Product retrieved successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to retrieve product" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const body = await request.json()

    // In a real application, you would update in database
    return NextResponse.json({
      success: true,
      data: { id, ...body },
      message: "Product updated successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    // In a real application, you would delete from database
    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to delete product" }, { status: 500 })
  }
}
