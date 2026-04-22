"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit2 } from "lucide-react";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";
import type { ProductDto } from "@cammani/shared";

export default function SellerProducts() {
  const { user } = useAuthStore();
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<{_id: string, name: string}[]>([]);
  
  const [isAdding, setIsAdding] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: "", description: "", price: "", categoryId: "", image: "", inventory: "10"
  });

  useEffect(() => {
    Promise.all([
      api.get("/seller/products"),
      api.get("/categories")
    ])
      .then(([prodRes, catRes]) => {
        setProducts(prodRes.data.data);
        setCategories(catRes.data.data);
      })
      .catch(() => toast.error("Failed to load data"))
      .finally(() => setLoading(false));
  }, []);

  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();
    try {
      const payload = {
        ...newProduct,
        price: parseFloat(newProduct.price),
        inventory: parseInt(newProduct.inventory, 10),
        images: newProduct.image ? [newProduct.image] : [],
        status: "active"
      };
      const { data } = await api.post("/seller/products", payload);
      setProducts([data.data, ...products]);
      setIsAdding(false);
      setNewProduct({ title: "", description: "", price: "", categoryId: "", image: "", inventory: "10" });
      toast.success("Product created!");
    } catch {
      toast.error("Failed to create product");
    }
  }

  if (loading) return <div className="page-content container"><div className="skeleton" style={{ height: 400 }} /></div>;

  return (
    <div className="page-content container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 className="section-title">Manage Products</h1>
          <Link href="/seller" style={{ fontSize: 14, color: "var(--brand)" }}>← Back to Dashboard</Link>
        </div>
        <button className="btn btn-primary" onClick={() => setIsAdding(!isAdding)}>
          <Plus size={16} /> Add Product
        </button>
      </div>

      {isAdding && (
        <div className="card" style={{ padding: 24, marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>New Product</h2>
          <form onSubmit={handleAddProduct} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", gap: 16 }}>
              <div className="form-group" style={{ flex: 2 }}>
                <label className="form-label">Title</label>
                <input required className="input" value={newProduct.title} onChange={e => setNewProduct({...newProduct, title: e.target.value})} />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Price ($)</label>
                <input required type="number" step="0.01" min="0" className="input" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
              </div>
            </div>
            
            <div style={{ display: "flex", gap: 16 }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Category</label>
                <select required className="input" value={newProduct.categoryId} onChange={e => setNewProduct({...newProduct, categoryId: e.target.value})}>
                  <option value="">Select a category</option>
                  {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Inventory</label>
                <input required type="number" min="0" className="input" value={newProduct.inventory} onChange={e => setNewProduct({...newProduct, inventory: e.target.value})} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Image URL</label>
              <input required className="input" placeholder="https://example.com/image.jpg" value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea required className="input" rows={3} style={{ height: "auto", padding: 12 }} value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 8 }}>
              <button type="button" className="btn btn-ghost" onClick={() => setIsAdding(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save Product</button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--bg-tertiary)", borderBottom: "1px solid var(--border)", textAlign: "left" }}>
              <th style={{ padding: "12px 16px", fontSize: 13, color: "var(--text-secondary)", fontWeight: 600 }}>Product</th>
              <th style={{ padding: "12px 16px", fontSize: 13, color: "var(--text-secondary)", fontWeight: 600 }}>Price</th>
              <th style={{ padding: "12px 16px", fontSize: 13, color: "var(--text-secondary)", fontWeight: 600 }}>Inventory</th>
              <th style={{ padding: "12px 16px", fontSize: 13, color: "var(--text-secondary)", fontWeight: 600 }}>Status</th>
              <th style={{ padding: "12px 16px" }}></th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: 40, textAlign: "center", color: "var(--text-secondary)" }}>
                  No products found. Add your first product above.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p._id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "16px", display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 6, background: "var(--gray-100)", overflow: "hidden", position: "relative" }}>
                      <img src={p.images?.[0] || "https://placehold.co/40"} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>{p.title}</div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{p._id.slice(-6)}</div>
                    </div>
                  </td>
                  <td style={{ padding: "16px", fontSize: 14 }}>${p.price.toFixed(2)}</td>
                  <td style={{ padding: "16px", fontSize: 14 }}>{p.inventory}</td>
                  <td style={{ padding: "16px" }}>
                    <span className={`badge ${p.status === "active" ? "badge-green" : "badge-gray"}`}>{p.status}</span>
                  </td>
                  <td style={{ padding: "16px", textAlign: "right" }}>
                    <button className="btn btn-ghost btn-sm btn-icon-sm" aria-label="Edit"><Edit2 size={14} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
