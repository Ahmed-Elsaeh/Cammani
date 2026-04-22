"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import api from "@/lib/api";
import toast from "react-hot-toast";
import styles from "./CartPage.module.css";

export default function CartPage() {
  const { items, fetchCart, updateQty, removeItem, subtotal, itemCount } = useCartStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  async function handleCheckout() {
    setLoading(true);
    try {
      const { data } = await api.post("/checkout/session");
      window.location.href = data.data.url;
    } catch {
      toast.error("Checkout failed. Please login first.");
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="page-content container">
        <div className={styles.empty}>
          <div className={styles.emptyIcon}><ShoppingBag size={48} /></div>
          <h2 className={styles.emptyTitle}>Your Cart is Empty</h2>
          <p className={styles.emptyText}>Looks like you haven't added anything to your cart yet.</p>
          <Link href="/search" className="btn btn-primary-lg">Start Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content container">
      <h1 className="section-title" style={{ marginBottom: 24, fontSize: 28 }}>Shopping Cart</h1>
      
      <div className={styles.layout}>
        <div className={styles.itemsList}>
          {items.map((item) => (
            <div key={item.productId} className={styles.itemCard}>
              <Link href={`/product/${item.productId}`} className={styles.itemImageWrap}>
                <Image src={item.image || "https://placehold.co/200x200"} alt={item.title} fill className={styles.itemImage} />
              </Link>
              <div className={styles.itemDetails}>
                <Link href={`/product/${item.productId}`} className={styles.itemTitle}>{item.title}</Link>
                <div className={styles.itemSeller}>Sold by {item.sellerName}</div>
                <div className={styles.priceRow}>
                  <div className={styles.itemPrice}>${item.price.toFixed(2)}</div>
                  <div className={styles.actions}>
                    <select
                      className={`input ${styles.qtySelect}`}
                      value={item.qty}
                      onChange={(e) => updateQty(item.productId, Number(e.target.value))}
                    >
                      {Array.from({ length: Math.min(10, item.maxQty) }).map((_, i) => (
                        <option key={i+1} value={i+1}>{i+1}</option>
                      ))}
                    </select>
                    <button className={styles.removeBtn} onClick={() => removeItem(item.productId)} aria-label="Remove item">
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.summary}>
          <div className={styles.summaryInner}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>
            <div className={styles.summaryRow}>
              <span>Items ({itemCount()}):</span>
              <span>${subtotal().toFixed(2)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Shipping:</span>
              <span className={styles.free}>Free</span>
            </div>
            <div className="divider" />
            <div className={`${styles.summaryRow} ${styles.totalRow}`}>
              <span>Order Total:</span>
              <span>${subtotal().toFixed(2)}</span>
            </div>
            <button
              className="btn btn-primary-lg"
              style={{ width: "100%", marginTop: 16, borderRadius: 100 }}
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? "Processing..." : "Proceed to Checkout"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
