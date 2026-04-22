import type { Metadata } from "next";
import { Suspense } from "react";
import OrdersPage from "@/components/pages/OrdersPage";

export const metadata: Metadata = { title: "Your Orders - Cammani" };

export default function Page() {
  return (
    <Suspense fallback={<div className="page-content container">Loading orders...</div>}>
      <OrdersPage />
    </Suspense>
  );
}
