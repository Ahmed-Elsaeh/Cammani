import type { Metadata } from "next";
import SearchPage from "@/components/pages/SearchPage";

export const metadata: Metadata = {
  title: "Search Results",
  description: "Browse and filter millions of products on Cammani.",
};

export default function Page() { return <SearchPage />; }
