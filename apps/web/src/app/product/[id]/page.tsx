import type { Metadata } from "next";
import ProductPage from "@/components/pages/ProductPage";

export const metadata: Metadata = {
  title: "Product Detail",
};

export default function Page({ params }: { params: { id: string } }) {
  return <ProductPage id={params.id} />;
}
