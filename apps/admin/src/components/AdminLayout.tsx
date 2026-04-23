"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Layers, 
  Settings, 
  LogOut,
  ChevronRight,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Sellers", href: "/sellers", icon: Users },
  { name: "Products", href: "/products", icon: Package },
  { name: "Categories", href: "/categories", icon: Layers },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin_token") || localStorage.getItem("accessToken");
    if (!token && pathname !== "/login") {
      router.push("/login");
    } else {
      setIsReady(true);
    }
  }, [pathname, router]);

  function handleLogout() {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("accessToken");
    router.push("/login");
  }

  if (!isReady && pathname !== "/login") {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
        <Loader2 className="animate-spin" style={{ color: 'var(--primary)' }} size={40} />
      </div>
    );
  }

  if (pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <div style={{ padding: '32px 24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-1px' }}>
            CAMMANI<span style={{ color: 'var(--primary)' }}>.</span>
          </h1>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Admin Panel</p>
        </div>

        <nav style={{ flex: 1, padding: '0 16px' }}>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  marginBottom: '4px',
                  background: isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                  color: isActive ? 'var(--primary)' : 'rgba(255,255,255,0.7)',
                  transition: 'all 0.2s',
                  position: 'relative'
                }}>
                  {isActive && (
                    <motion.div 
                      layoutId="activeNav"
                      style={{
                        position: 'absolute',
                        left: '-16px',
                        width: '4px',
                        height: '24px',
                        background: 'var(--primary)',
                        borderRadius: '0 4px 4px 0'
                      }}
                    />
                  )}
                  <item.icon size={20} />
                  <span style={{ fontWeight: 500, fontSize: '14px' }}>{item.name}</span>
                  {isActive && <ChevronRight size={14} style={{ marginLeft: 'auto' }} />}
                </div>
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: '24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button 
            onClick={handleLogout}
            className="btn btn-ghost" 
            style={{ width: '100%', justifyContent: 'flex-start', color: 'rgba(255,255,255,0.7)' }}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="main">
        {children}
      </main>
    </div>
  );
}
