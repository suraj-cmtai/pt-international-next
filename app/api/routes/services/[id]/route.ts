import { type NextRequest, NextResponse } from "next/server"
import { services } from "@/lib/data"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const service = services.find((s) => s.id === id)

    if (!service) {
      return NextResponse.json({ success: false, message: "Service not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: service,
      message: "Service retrieved successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to retrieve service" }, { status: 500 })
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
      message: "Service updated successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to update service" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    // In a real application, you would delete from database
    return NextResponse.json({
      success: true,
      message: "Service deleted successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to delete service" }, { status: 500 })
  }
}
