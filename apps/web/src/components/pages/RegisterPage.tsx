"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuthStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await register(name, email, password);
      toast.success("Account created!");
      router.push("/");
    } catch (err: any) {
      console.error("Registration error:", err);
      const msg = err.response?.data?.error || err.message || "Could not create account. Please try again.";
      const details = err.response?.data?.details ? `: ${err.response.data.details}` : "";
      toast.error(`${msg}${details}`);
    }
  }

  return (
    <div className="page-content container" style={{ display: "flex", justifyContent: "center", paddingTop: 80 }}>
      <div className="card" style={{ width: "100%", maxWidth: 400, padding: 32 }}>
        <h1 className="section-title" style={{ textAlign: "center", marginBottom: 24 }}>Create Account</h1>
        
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Your Name</label>
            <input
              type="text"
              required
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
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
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={isLoading} style={{ marginTop: 8 }}>
            {isLoading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <div className="divider" />
        
        <p style={{ textAlign: "center", fontSize: 13, color: "var(--text-secondary)" }}>
          Already have an account?{" "}
          <Link href="/auth/login" style={{ color: "var(--brand)", fontWeight: 500 }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
