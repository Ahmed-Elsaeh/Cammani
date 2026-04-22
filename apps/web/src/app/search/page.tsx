import type { Metadata } from "next";
import { Suspense } from "react";
import SearchPage from "@/components/pages/SearchPage";

export const metadata: Metadata = {
  title: "Search Results",
  description: "Browse and filter millions of products on Cammani.",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="page-content container">Searching...</div>}>
      <SearchPage />
    </Suspense>
  );
}
