import CategoryPageClient from "./CategoryPageClient"
import ProductService from "@/app/api/services/productServices"

export const metadata = {
  title: "Product Category",
}

// Revalidate the page every 60 seconds (adjust as needed)
export const revalidate = 60

// Set to 'force-dynamic' to always render on the server for each request
// Other options: 'auto' (default), 'force-static', 'error'
export const dynamic = 'force-dynamic'

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const resolvedParams = await params

  // Fetch products by category using ProductService (server-side)
  const products = await ProductService.getProductsByCategory(resolvedParams.category)

  return <CategoryPageClient category={resolvedParams.category} initialProducts={products} />
}

export async function generateStaticParams() {
  return [
    { category: "research-products" },
    { category: "diagnostics-products" },
    { category: "instruments-consumables" },
    { category: "reagents-chemicals" },
    { category: "plasticwaresfiltrationunits" },
    { category: "food-testing-kits" },
    { category: "disinfectant-and-sanitizers" },
  ]
}
