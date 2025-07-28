import { type NextRequest, NextResponse } from "next/server"
import { services } from "@/lib/data"

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: services,
      message: "Services retrieved successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to retrieve services" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // In a real application, you would save to database
    const newService = {
      id: Date.now().toString(),
      slug:
        body.slug ||
        body.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
      ...body,
    }

    return NextResponse.json(
      {
        success: true,
        data: newService,
        message: "Service created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to create service" }, { status: 500 })
  }
}
