import type { Metadata } from "next";
import "./globals.css";
import AdminLayout from "@/components/AdminLayout";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Cammani Admin",
  description: "Management dashboard for Cammani marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AdminLayout>
          {children}
        </AdminLayout>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
