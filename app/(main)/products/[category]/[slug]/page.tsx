import { notFound } from "next/navigation"
import ProductPageClient from "./ProductPageClient"
import ProductService from "@/app/api/services/productServices"
import type { Product as ReduxProduct } from "@/lib/redux/features/productSlice"

// This page is statically generated for a set of known products, but also supports dynamic rendering.
// It fetches the product by slug on the server and shows 404 if not found.

export const metadata = {
  title: "Product Details",
}

// Helper to convert ProductService's Product to Redux Product type
function convertProductToReduxProduct(product: any): ReduxProduct {
  // Map all fields, and convert createdAt to a Timestamp-like object if needed
  // This is a minimal example; adjust as needed for your actual types
  return {
    ...product,
    createdAt: {
      seconds: Math.floor(new Date(product.createdAt).getTime() / 1000),
      nanoseconds: 0,
      toDate: () => new Date(product.createdAt),
      toMillis: () => new Date(product.createdAt).getTime(),
      isEqual: () => false,
    },
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>
}) {
  // In Next.js 15, params is a Promise, so we must await it
  const resolvedParams = await params

  // Fetch the product by slug using ProductService (server-side)
  const product = await ProductService.getProductBySlug(resolvedParams.slug)

  // If product not found, show 404
  if (!product) {
    notFound()
  }

  // Convert to Redux Product type for the client component
  const reduxProduct = convertProductToReduxProduct(product)

  return <ProductPageClient params={resolvedParams} product={reduxProduct} />
}

export async function generateStaticParams() {
  // This static list is a fallback; ideally, fetch all products and map to { category, slug }
  return [
    { category: "research-products", slug: "advanced-pcr-kit" },
    { category: "research-products", slug: "protein-extraction-kit" },
    { category: "diagnostics-products", slug: "covid-19-rapid-test" },
    { category: "instruments-consumables", slug: "laboratory-centrifuge" },
    { category: "reagents-chemicals", slug: "hplc-grade-acetonitrile" },
  ]
}
