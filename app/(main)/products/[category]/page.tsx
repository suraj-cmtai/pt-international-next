import CategoryPageClient from "./CategoryPageClient"
import ProductService from "@/app/api/services/productServices"

export const metadata = {
  title: "Product Category",
}

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
