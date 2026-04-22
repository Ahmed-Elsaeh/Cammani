"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Package, DollarSign, ArrowRight, Activity, AlertCircle } from "lucide-react";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

interface SellerProfile {
  _id: string;
  storeName: string;
  status: string;
  stripeConnectStatus: string;
}

export default function SellerDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<SellerProfile | null>(null);
  const [stripeAccount, setStripeAccount] = useState<{ payoutsEnabled: boolean; onboardingStatus: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [onboarding, setOnboarding] = useState(false);

  useEffect(() => {
    if (!user) { router.push("/auth/login"); return; }
    if (!user.roles.includes("seller")) { router.push("/seller/apply"); return; }

    api.get("/seller/me")
      .then((r) => {
        setProfile(r.data.data.seller);
        setStripeAccount(r.data.data.stripeAccount);
      })
      .catch(() => router.push("/seller/apply"))
      .finally(() => setLoading(false));
  }, [user, router]);

  async function handleStripeOnboard() {
    setOnboarding(true);
    try {
      const { data } = await api.post("/seller/stripe/onboard");
      window.location.href = data.data.url;
    } catch {
      toast.error("Failed to start Stripe onboarding");
      setOnboarding(false);
    }
  }

  if (loading) return <div className="page-content container"><div className="skeleton" style={{ height: 300 }} /></div>;
  if (!profile) return null;

  return (
    <div className="page-content container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
        <div>
          <h1 className="section-title">Welcome back, {profile.storeName}</h1>
          <p className="section-subtitle">Manage your store, products, and orders.</p>
        </div>
        <Link href="/seller/products" className="btn btn-primary">
          Manage Products
        </Link>
      </div>

      {stripeAccount?.onboardingStatus !== "complete" && (
        <div style={{ background: "#fffbeb", border: "1px solid #fde68a", padding: 20, borderRadius: 12, marginBottom: 32, display: "flex", gap: 16, alignItems: "flex-start" }}>
          <AlertCircle color="#d97706" style={{ marginTop: 2 }} />
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#92400e", marginBottom: 8 }}>Complete Your Payments Setup</h3>
            <p style={{ fontSize: 14, color: "#b45309", marginBottom: 16 }}>
              To receive payouts from your sales, you must complete the Stripe onboarding process.
            </p>
            <button className="btn btn-primary" onClick={handleStripeOnboard} disabled={onboarding}>
              {onboarding ? "Redirecting..." : "Set up Payouts"} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 48, height: 48, background: "var(--blue-50)", color: "var(--brand)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Package size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: 14, color: "var(--text-secondary)" }}>Your Products</h3>
              <div style={{ fontSize: 24, fontWeight: 700 }}>Manage Catalog</div>
            </div>
          </div>
          <Link href="/seller/products" className="btn btn-outline" style={{ width: "100%" }}>View Products</Link>
        </div>

        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 48, height: 48, background: "#f0fdf4", color: "#16a34a", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <DollarSign size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: 14, color: "var(--text-secondary)" }}>Sales & Orders</h3>
              <div style={{ fontSize: 24, fontWeight: 700 }}>View Orders</div>
            </div>
          </div>
          <button className="btn btn-outline" style={{ width: "100%" }}>Go to Orders (Coming soon)</button>
        </div>

        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 48, height: 48, background: "#faf5ff", color: "#9333ea", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Activity size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: 14, color: "var(--text-secondary)" }}>Store Status</h3>
              <div style={{ fontSize: 24, fontWeight: 700 }}>{profile.status}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
