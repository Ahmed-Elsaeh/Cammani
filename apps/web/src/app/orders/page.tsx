import type { Metadata } from "next";
import OrdersPage from "@/components/pages/OrdersPage";

export const metadata: Metadata = { title: "Your Orders - Cammani" };

export default function Page() { return <OrdersPage />; }
