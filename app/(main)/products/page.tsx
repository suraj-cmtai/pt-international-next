import ProductService from "@/app/api/services/productServices"
import ProductsPageClient from "./ProductsPageClient"

export const metadata = {
  title: "Our Products",
  description: "Comprehensive life science products for research and diagnostics",
}

export default async function ProductsPage() {
  // Fetch active products on the server
  const activeProducts = await ProductService.getActiveProducts()

  return <ProductsPageClient initialProducts={activeProducts} />
}
