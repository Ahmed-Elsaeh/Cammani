import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Header from "@/components/layout/Header";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: { default: "Cammani — Shop Everything", template: "%s | Cammani" },
  description: "Cammani is a modern marketplace connecting buyers and sellers with millions of products across every category.",
  keywords: ["marketplace", "shop", "buy", "sell", "deals"],
  openGraph: {
    type: "website",
    siteName: "Cammani",
    title: "Cammani — Shop Everything",
    description: "A modern marketplace with millions of products.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { fontFamily: "Inter, sans-serif", fontSize: 14 },
            success: { style: { borderLeft: "4px solid #22c55e" } },
            error: { style: { borderLeft: "4px solid #ef4444" } },
          }}
        />
        <Header />
        <NavBar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
