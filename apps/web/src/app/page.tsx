import type { Metadata } from "next";
import HomePage from "@/components/pages/HomePage";

export const metadata: Metadata = {
  title: "Cammani — Shop Everything",
  description: "Discover millions of products from trusted sellers. Free shipping on eligible orders.",
};

export default function Page() {
  return <HomePage />;
}
