"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PackageOpen, CheckCircle } from "lucide-react";
import api from "@/lib/api";
import type { OrderDto } from "@cammani/shared";
import toast from "react-hot-toast";
import styles from "./OrdersPage.module.css";

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [loading, setLoading] = useState(true);
  const params = useSearchParams();
  const sessionId = params.get("session_id");

  useEffect(() => {
    if (sessionId) {
      toast.success("Payment successful! Your order has been placed.");
      // optionally clean up url
      window.history.replaceState({}, document.title, "/orders");
    }
  }, [sessionId]);

  useEffect(() => {
    api.get("/orders/me")
      .then((r) => setOrders(r.data?.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-content container"><div className="skeleton" style={{ height: 200 }} /></div>;

  if (orders.length === 0) {
    return (
      <div className="page-content container">
        <div className={styles.empty}>
          <PackageOpen size={48} className={styles.emptyIcon} />
          <h2>You have no orders</h2>
          <p>Go find something you like!</p>
          <Link href="/search" className="btn btn-primary" style={{ marginTop: 16 }}>Start Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content container">
      <h1 className="section-title" style={{ marginBottom: 24 }}>Your Orders</h1>
      
      <div className={styles.list}>
        {orders.map((order) => (
          <div key={order._id} className="card">
            <div className={styles.orderHeader}>
              <div className={styles.headerCol}>
                <span className={styles.headerLabel}>Order Placed</span>
                <span className={styles.headerValue}>{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <div className={styles.headerCol}>
                <span className={styles.headerLabel}>Total</span>
                <span className={styles.headerValue}>${order.total.toFixed(2)}</span>
              </div>
              <div className={styles.headerCol}>
                <span className={styles.headerLabel}>Status</span>
                <span className={`${styles.headerValue} ${styles[`status-${order.status}`]}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              <div className={styles.headerRight}>
                <span className={styles.headerLabel}>Order # {order._id.slice(-8).toUpperCase()}</span>
              </div>
            </div>
            
            <div className={styles.items}>
              {order.items.map((item, i) => (
                <div key={i} className={styles.item}>
                  <div className={styles.itemImgWrap}>
                    <Image src={item.image} alt={item.title} fill className={styles.itemImg} />
                  </div>
                  <div className={styles.itemInfo}>
                    <Link href={`/product/${item.productId}`} className={styles.itemTitle}>{item.title}</Link>
                    <div className={styles.itemMeta}>Qty: {item.qty}</div>
                    <div className={styles.itemMeta}>${item.unitPrice.toFixed(2)} each</div>
                  </div>
                  <div className={styles.itemActions}>
                    <Link href={`/product/${item.productId}`} className="btn btn-outline btn-sm">Buy it again</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
