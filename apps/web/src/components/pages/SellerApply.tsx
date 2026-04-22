"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";
import toast from "react-hot-toast";

export default function SellerApply() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [storeName, setStoreName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      toast.error("Please log in to apply as a seller.");
      router.push("/auth/login?redirect=/seller/apply");
    } else if (user.roles.includes("seller")) {
      router.push("/seller");
    }
  }, [user, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/seller/apply", { storeName, description });
      toast.success("Welcome to Cammani Sellers!");
      // reload to pick up new role token if possible, or just push
      window.location.href = "/seller";
    } catch {
      toast.error("Failed to create seller account.");
      setLoading(false);
    }
  }

  if (!user) return null;

  return (
    <div className="page-content container" style={{ display: "flex", justifyContent: "center", paddingTop: 60 }}>
      <div className="card" style={{ width: "100%", maxWidth: 500, padding: 40 }}>
        <h1 className="section-title" style={{ textAlign: "center", marginBottom: 8 }}>Become a Seller</h1>
        <p style={{ textAlign: "center", color: "var(--text-secondary)", marginBottom: 32 }}>
          Reach millions of customers today.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="form-group">
            <label className="form-label">Store Name</label>
            <input
              type="text"
              required
              className="input input-lg"
              placeholder="e.g. Acme Electronics"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Store Description</label>
            <textarea
              className="input"
              rows={4}
              style={{ height: "auto", padding: 12 }}
              placeholder="Tell customers about your store..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <button type="submit" className="btn btn-primary-lg" disabled={loading} style={{ marginTop: 12 }}>
            {loading ? "Creating Store..." : "Create My Store"}
          </button>
        </form>
      </div>
    </div>
  );
}
