"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success("Welcome back!");
      router.push("/");
    } catch {
      toast.error("Invalid email or password");
    }
  }

  return (
    <div className="page-content container" style={{ display: "flex", justifyContent: "center", paddingTop: 80 }}>
      <div className="card" style={{ width: "100%", maxWidth: 400, padding: 32 }}>
        <h1 className="section-title" style={{ textAlign: "center", marginBottom: 24 }}>Sign In</h1>
        
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              required
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              required
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={isLoading} style={{ marginTop: 8 }}>
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="divider" />
        
        <p style={{ textAlign: "center", fontSize: 13, color: "var(--text-secondary)" }}>
          New to Cammani?{" "}
          <Link href="/auth/register" style={{ color: "var(--brand)", fontWeight: 500 }}>
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
