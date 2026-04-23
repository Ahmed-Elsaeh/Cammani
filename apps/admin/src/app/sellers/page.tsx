"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import { Check, X, User, Mail, Store, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Seller {
  id: string;
  store_name: string;
  description: string;
  status: string;
  created_at: string;
  users: {
    name: string;
    email: string;
  };
}

export default function SellersPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");

  useEffect(() => {
    fetchSellers();
  }, [filter]);

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/sellers?status=${filter}`);
      setSellers(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch sellers");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/admin/sellers/${id}/status`, { status });
      toast.success(`Seller ${status === 'active' ? 'approved' : 'suspended'}`);
      fetchSellers();
    } catch (err) {
      toast.error("Action failed");
    }
  };

  return (
    <div className="animate-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700 }}>Seller Management</h1>
          <p style={{ color: 'var(--text-muted)' }}>Review and manage seller applications</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {["pending", "active", "suspended"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`btn ${filter === f ? 'btn-primary' : 'btn-ghost'}`}
            style={{ textTransform: 'capitalize' }}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Seller Info</th>
                <th>Store Details</th>
                <th>Applied Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {sellers.map((seller) => (
                  <motion.tr
                    key={seller.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <User size={14} /> {seller.users.name}
                        </span>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Mail size={12} /> {seller.users.email}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Store size={14} /> {seller.store_name}
                        </span>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '200px' }} className="truncate">
                          {seller.description || "No description"}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={14} /> {new Date(seller.created_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${seller.status}`}>
                        {seller.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {seller.status !== 'active' && (
                          <button 
                            onClick={() => updateStatus(seller.id, 'active')}
                            className="btn btn-icon-sm" 
                            style={{ background: '#dcfce7', color: '#15803d' }}
                            title="Approve"
                          >
                            <Check size={16} />
                          </button>
                        )}
                        {seller.status !== 'suspended' && (
                          <button 
                            onClick={() => updateStatus(seller.id, 'suspended')}
                            className="btn btn-icon-sm" 
                            style={{ background: '#fee2e2', color: '#991b1b' }}
                            title="Suspend/Deny"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {!loading && sellers.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No sellers found in this category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
