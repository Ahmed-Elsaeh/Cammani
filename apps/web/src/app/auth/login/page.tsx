import type { Metadata } from "next";
import LoginPage from "@/components/pages/LoginPage";

export const metadata: Metadata = { title: "Login - Cammani" };

export default function Page() { return <LoginPage />; }
