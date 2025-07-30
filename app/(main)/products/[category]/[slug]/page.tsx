import { notFound } from "next/navigation"
import ProductPageClient from "./ProductPageClient"
import ProductService from "@/app/api/services/productServices"

export const metadata = {
  title: "Product Details",
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>
}) {
  const resolvedParams = await params

  // Fetch the product by slug using ProductService (server-side)
  const product = await ProductService.getProductBySlug(resolvedParams.slug)

  // If product not found, show 404
  if (!product) {
    notFound()
  }

  return <ProductPageClient category={resolvedParams.category} product={product} />
}

export async function generateStaticParams() {
  return [
    { category: "research-products", slug: "advanced-pcr-kit" },
    { category: "research-products", slug: "protein-extraction-kit" },
    { category: "diagnostics-products", slug: "covid-19-rapid-test" },
    { category: "instruments-consumables", slug: "laboratory-centrifuge" },
    { category: "reagents-chemicals", slug: "hplc-grade-acetonitrile" },
  ]
}
