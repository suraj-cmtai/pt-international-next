import { NextResponse } from "next/server"
import ProductService from "../../../services/productServices"
import consoleManager from "../../../utils/consoleManager"
import { UploadImage, ReplaceImage } from "../../../controller/imageController"

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

    // --- Image Handling Logic ---
    // The dashboard sends images as an array of File and/or string (URL) under the "images" field.
    // For new images: File, for existing: string (URL)
    // We'll process all images, upload new ones, keep URLs for existing, and remove any images not present anymore.

    // Get the product's current images from DB
    const existingProduct = await ProductService.getProductById(id)
    const existingImages: string[] = existingProduct?.images || []

    // Get all images from formData (can be File or string)
    const imagesFromForm: (File | string)[] = []
    // formData.getAll returns File or string
    for (const img of formData.getAll("images")) {
      if (typeof img === "string") {
        if (img.trim() !== "") imagesFromForm.push(img)
      } else if (img && typeof img === "object" && "arrayBuffer" in img) {
        // File
        imagesFromForm.push(img)
      }
    }

    // Prepare new images array for DB
    const finalImageUrls: string[] = []

    // For each image in imagesFromForm:
    // - If it's a string and exists in existingImages, keep it.
    // - If it's a File, upload it and get the URL.
    // - If it's a string but not in existingImages, treat as new (shouldn't happen, but skip).
    // - Any image in existingImages not in imagesFromForm should be deleted (handled by not including in finalImageUrls).

    // For image upload, use a default size (e.g., 800x800)
    const IMAGE_WIDTH = 800
    const IMAGE_HEIGHT = 800

    // Track which existing images are still used
    const usedExistingImages = new Set<string>()

    for (const img of imagesFromForm) {
      if (typeof img === "string") {
        // If the string is an existing image URL, keep it
        if (existingImages.includes(img)) {
          finalImageUrls.push(img)
          usedExistingImages.add(img)
        }
        // else: skip (should not happen)
      } else if (img && typeof img === "object" && "arrayBuffer" in img) {
        // New file, upload
        try {
          const url = await UploadImage(img, IMAGE_WIDTH, IMAGE_HEIGHT)
          if (typeof url === "string") {
            finalImageUrls.push(url)
          }
        } catch (uploadErr: any) {
          consoleManager.error("Failed to upload image:", uploadErr)
        }
      }
    }

    // Optionally, delete images that are no longer used (not in usedExistingImages)
    // This is not strictly required if you want to keep old images in storage, but for cleanup:
    const imagesToDelete = existingImages.filter((img) => !usedExistingImages.has(img))
    // You could call ReplaceImage for each removed image with file = null, but imageController expects a file to replace.
    // Instead, you may want to delete directly via Firebase if needed.

    updateData.images = finalImageUrls

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
