import CategoryPageClient from "./CategoryPageClient"

export default async function CategoryPage({ params }: any) {
  return <CategoryPageClient params={params} />
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
