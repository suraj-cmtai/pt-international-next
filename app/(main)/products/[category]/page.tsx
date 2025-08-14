import CategoryPageClient from "./CategoryPageClient";
import ProductService from "@/app/api/services/productServices";

export const metadata = {
  title: "Product Category",
};

// Dynamic in dev, ISR in prod
export const revalidate = process.env.NODE_ENV === "production" ? 60 : 0; // 60 sec in prod
export const dynamic = process.env.NODE_ENV === "production" ? "auto" : "force-dynamic";

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const products = await ProductService.getProductsByCategory(params.category);
  return <CategoryPageClient category={params.category} initialProducts={products} />;
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
  ];
}
