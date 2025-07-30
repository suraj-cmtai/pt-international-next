import ProductPageClient from "./ProductPageClient"

export const metadata = {
  title: "Product Details",
}

export default async function ProductPage({ params }: { params: { category: string; slug: string } }) {
  return <ProductPageClient params={params} />
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
