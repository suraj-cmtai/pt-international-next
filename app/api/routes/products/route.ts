import { NextResponse } from "next/server"
import ProductService from "../../services/productServices"
import consoleManager from "../../utils/consoleManager"
import { UploadImage, UploadPDF } from "../../controller/imageController"

// Get all products (GET)
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

    const result = await ProductService.getAllProducts(limit, undefined, filters)

    consoleManager.log("Fetched products:", result.products.length)

    return NextResponse.json(
      {
        statusCode: 200,
        message: "Products fetched successfully",
        data: result.products,
        pagination: {
          hasMore: result.hasMore,
          page,
          limit,
          total: result.products.length,
        },
        errorCode: "NO",
        errorMessage: "",
      },
      { status: 200 },
    )
  } catch (error: any) {
    consoleManager.error("Error in GET /api/routes/products:", error)
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

// Add a new product (POST)
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const title = formData.get("title");
    const description = formData.get("description");
    const longDescription = formData.get("longDescription");
    const category = formData.get("category");
    const price = formData.get("price");
    const slug = formData.get("slug");
    const features = formData.get("features");
    const specifications = formData.get("specifications");
    const isActive = formData.get("isActive") === "true";

    // Validate required fields
    if (!title || !description || !longDescription || !category) {
      return NextResponse.json(
        {
          statusCode: 400,
          errorCode: "BAD_REQUEST",
          errorMessage: "Title, description, long description, and category are required",
        },
        { status: 400 }
      );
    }

    // Parse features and specifications
    let parsedFeatures: string[] = [];
    let parsedSpecifications: any = undefined;
    try {
      parsedFeatures = features ? JSON.parse(features.toString()) : [];
    } catch (err) {
      parsedFeatures = [];
    }
    try {
      parsedSpecifications = specifications ? JSON.parse(specifications.toString()) : undefined;
    } catch (err) {
      parsedSpecifications = undefined;
    }

    // Generate slug if not provided
    const productSlug =
      slug?.toString() ||
      title
        .toString()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    // Handle images: dashboard sends images as FormData "images" (can be File or string URL)
    // We'll collect all images, upload new files, and keep URLs for existing
    const images: string[] = [];
    const imageFields = formData.getAll("images");
    for (const img of imageFields) {
      // If it's a File (Blob), upload it
      if (typeof img === "object" && "arrayBuffer" in img && "type" in img) {
        try {
          const url = await UploadImage(img, 300, 300);
          if (typeof url === "string") {
            images.push(url);
          }
        } catch (err: any) {
          consoleManager.error("Image upload failed:", err);
          // Optionally, you can return error here or skip this image
        }
      } else if (typeof img === "string" && img.trim() !== "") {
        // Already a URL (existing image)
        images.push(img);
      }
    }

    // If no images, use placeholder
    if (images.length === 0) {
      images.push("/placeholder.svg?height=300&width=300");
    }

    // Handle brochure: dashboard sends brochure as FormData "brochure" (can be File or string URL)
    let brochure: string | null = null;
    const brochureField = formData.get("brochure");
    if (brochureField) {
      if (typeof brochureField === "object" && "arrayBuffer" in brochureField && "type" in brochureField) {
        // Only upload if it's a File (Blob)
        try {
          const url = await UploadPDF(brochureField);
          if (typeof url === "string") {
            brochure = url;
          }
        } catch (err: any) {
          consoleManager.error("Brochure upload failed:", err);
          // Optionally, you can return error here or skip this brochure
        }
      } else if (typeof brochureField === "string" && brochureField.trim() !== "") {
        // Already a URL (existing brochure)
        brochure = brochureField;
      }
    }

    // Firestore does not allow undefined, so remove undefined fields
    // Also, Firestore does not allow null for fields that are not nullable, so only include brochure if it's a string
    const productData: Omit<
      import("../../services/productServices").Product,
      "id" | "createdAt" | "updatedAt"
    > = {
      title: title.toString(),
      slug: productSlug,
      description: description.toString(),
      longDescription: longDescription.toString(),
      category: category.toString(),
      price: price?.toString() ?? "",
      features: parsedFeatures,
      specifications: parsedSpecifications ?? {},
      images,
      isActive,
      ...(brochure && typeof brochure === "string" ? { brochure } : {}),
    };

    const newProduct = await ProductService.addProduct(productData);

    consoleManager.log("Product created successfully:", newProduct);

    return NextResponse.json(
      {
        statusCode: 201,
        message: "Product added successfully",
        data: newProduct,
        errorCode: "NO",
        errorMessage: "",
      },
      { status: 201 }
    );
  } catch (error: any) {
    consoleManager.error("Error in POST /api/routes/products:", error);
    return NextResponse.json(
      {
        statusCode: 500,
        errorCode: "INTERNAL_ERROR",
        errorMessage: error.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
