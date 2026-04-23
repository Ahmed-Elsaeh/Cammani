"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import { Package, Store, Tag, Edit2, Trash2, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

interface Product {
  id: string;
  title: string;
  price: number;
  status: string;
  sellers: { store_name: string };
  categories: { name: string };
  images: string[];
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/admin/products");
      setProducts(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to archive this product?")) return;
    try {
      await api.patch(`/admin/products/${id}`, { status: 'archived' });
      toast.success("Product archived");
      fetchProducts();
    } catch (err) {
      toast.error("Failed to archive product");
    }
  };

  return (
    <div className="animate-in">
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700 }}>Product Catalog</h1>
        <p style={{ color: 'var(--text-muted)' }}>Monitor and manage all listings across the platform</p>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Seller</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '4px', overflow: 'hidden', background: '#f1f5f9' }}>
                        <img src={product.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <span style={{ fontWeight: 600 }}>{product.title}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}>
                      <Store size={14} /> {product.sellers?.store_name}
                    </span>
                  </td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}>
                      <Tag size={14} /> {product.categories?.name}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700 }}>${product.price}</span>
                  </td>
                  <td>
                    <span className={`badge badge-${product.status}`}>
                      {product.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn btn-icon-sm" style={{ background: '#f1f5f9', color: '#64748b' }}>
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={() => deleteProduct(product.id)}
                        className="btn btn-icon-sm" 
                        style={{ background: '#fee2e2', color: '#991b1b' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && products.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '40px' }}>No products found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
