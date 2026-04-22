import type { Metadata } from "next";
import SellerProducts from "@/components/pages/SellerProducts";

export const metadata: Metadata = { title: "Manage Products - Seller Dashboard" };

export default function Page() { return <SellerProducts />; }
