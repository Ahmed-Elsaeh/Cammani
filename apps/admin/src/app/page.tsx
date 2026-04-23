"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { 
  Users, 
  Package, 
  TrendingUp, 
  ShoppingBag,
  ArrowUpRight,
  Clock
} from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    sellers: 0,
    products: 0,
    orders: 0,
    revenue: 0
  });

  useEffect(() => {
    // In a real app, you'd have an endpoint for this. 
    // For now, let's fetch some data to make it look alive.
    const fetchStats = async () => {
      try {
        const [sellersRes, productsRes] = await Promise.all([
          api.get("/admin/sellers"),
          api.get("/admin/products")
        ]);
        setStats({
          sellers: sellersRes.data.data?.length || 0,
          products: productsRes.data.data?.length || 0,
          orders: 124, // Mock
          revenue: 12450 // Mock
        });
      } catch (err) {}
    };
    fetchStats();
  }, []);

  const cards = [
    { name: "Total Sellers", value: stats.sellers, icon: Users, color: "#6366f1", trend: "+12%" },
    { name: "Total Products", value: stats.products, icon: Package, color: "#10b981", trend: "+5%" },
    { name: "Total Orders", value: stats.orders, icon: ShoppingBag, color: "#f59e0b", trend: "+18%" },
    { name: "Total Revenue", value: `$${stats.revenue.toLocaleString()}`, icon: TrendingUp, color: "#ec4899", trend: "+24%" },
  ];

  return (
    <div className="animate-in">
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700 }}>Overview</h1>
        <p style={{ color: 'var(--text-muted)' }}>Welcome back, Administrator</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        {cards.map((card, i) => (
          <motion.div 
            key={card.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card" 
            style={{ position: 'relative', overflow: 'hidden' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '12px', 
                background: `${card.color}15`, 
                color: card.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <card.icon size={24} />
              </div>
              <span style={{ 
                fontSize: '12px', 
                fontWeight: 700, 
                color: '#10b981', 
                background: '#dcfce7', 
                padding: '4px 8px', 
                borderRadius: '99px',
                height: 'fit-content',
                display: 'flex',
                alignItems: 'center',
                gap: '2px'
              }}>
                {card.trend} <ArrowUpRight size={12} />
              </span>
            </div>
            <h3 style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 500 }}>{card.name}</h3>
            <p style={{ fontSize: '28px', fontWeight: 800, marginTop: '4px' }}>{card.value}</p>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontWeight: 700 }}>Recent Activities</h3>
            <button className="btn btn-ghost" style={{ fontSize: '12px' }}>View All</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center', paddingBottom: '16px', borderBottom: i === 4 ? 'none' : '1px solid var(--border)' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '14px', fontWeight: 500 }}>New seller application from "Gadget Haven"</p>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> 2 hours ago
                  </p>
                </div>
                <button className="btn btn-ghost btn-sm">Review</button>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ background: 'var(--bg-sidebar)', color: 'white' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '16px' }}>System Health</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
                <span>API Response Time</span>
                <span style={{ color: '#10b981' }}>42ms</span>
              </div>
              <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                <div style={{ height: '100%', width: '40%', background: '#10b981', borderRadius: '2px' }} />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
                <span>Database Load</span>
                <span style={{ color: '#f59e0b' }}>12%</span>
              </div>
              <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                <div style={{ height: '100%', width: '12%', background: '#f59e0b', borderRadius: '2px' }} />
              </div>
            </div>
            <div style={{ marginTop: '20px', padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', fontSize: '13px' }}>
              <p style={{ opacity: 0.7 }}>All systems are operational. No critical issues reported in the last 24 hours.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
