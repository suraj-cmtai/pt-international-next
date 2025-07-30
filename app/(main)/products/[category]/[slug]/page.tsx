import ProductPageClient from "./ProductPageClient"

export const metadata = {
  title: "Product Details",
}

// Next.js 15: params is a Promise
export default async function ProductPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>
}) {
  const resolvedParams = await params
  return <ProductPageClient params={resolvedParams} />
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
