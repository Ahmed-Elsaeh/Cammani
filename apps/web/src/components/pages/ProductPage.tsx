"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ShieldCheck, Truck, ShoppingCart, Info, Store } from "lucide-react";
import StarRating from "@/components/ui/StarRating";
import { useCartStore } from "@/store/cartStore";
import api from "@/lib/api";
import toast from "react-hot-toast";
import styles from "./ProductPage.module.css";

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  inventory: number;
  rating: number;
  reviewCount: number;
  sellerId?: { storeName?: string; description?: string };
}

export default function ProductPage({ id }: { id: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then((r) => setProduct(r.data.data))
      .catch(() => toast.error("Product not found"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="container page-content"><div className="skeleton" style={{ height: 400 }} /></div>;
  if (!product) return <div className="container page-content" style={{ textAlign: "center", padding: "100px 0" }}><h2>Product not found</h2></div>;

  async function handleAddToCart() {
    try {
      await addItem(product!._id, qty);
      toast.success("Added to cart");
    } catch {
      toast.error("Could not add to cart");
    }
  }

  const imageUrls = product.images?.length ? product.images : [`https://placehold.co/600x600/e2e8f0/64748b?text=${encodeURIComponent(product.title.slice(0, 10))}`];

  return (
    <div className="page-content container">
      <div className={styles.layout}>
        {/* Images */}
        <div className={styles.gallery}>
          <div className={styles.thumbnails}>
            {imageUrls.map((url, i) => (
              <button key={i} className={`${styles.thumbBtn} ${i === activeImage ? styles.thumbActive : ""}`} onClick={() => setActiveImage(i)}>
                <Image src={url} alt="" fill className={styles.thumbImg} sizes="80px" />
              </button>
            ))}
          </div>
          <div className={styles.mainImageWrap}>
            <Image src={imageUrls[activeImage]} alt={product.title} fill className={styles.mainImage} priority sizes="(max-width: 768px) 100vw, 50vw" />
          </div>
        </div>

        {/* Info */}
        <div className={styles.info}>
          <h1 className={styles.title}>{product.title}</h1>
          <div className={styles.metaRow}>
            {product.rating > 0 && (
              <div className={styles.ratingBox}>
                <span className={styles.ratingScore}>{product.rating.toFixed(1)}</span>
                <StarRating value={product.rating} size={15} />
                <span className={styles.reviewCount}>{product.reviewCount} reviews</span>
              </div>
            )}
            <div className={styles.sellerInfo}>
              <Store size={15} /> Sold by <strong>{product.sellerId?.storeName || "Unknown"}</strong>
            </div>
          </div>
          <div className="divider" style={{ margin: "20px 0" }} />
          
          <div className={styles.priceWrap}>
            <span className={styles.currency}>$</span>
            <span className={styles.priceBig}>{Math.floor(product.price)}</span>
            <span className={styles.cents}>{(product.price % 1).toFixed(2).substring(2)}</span>
          </div>

          <div className={styles.description}>
            {product.description}
          </div>
        </div>

        {/* Buy Box */}
        <div className={styles.buyBox}>
          <div className={styles.buyBoxInner}>
            <div className={styles.priceWrapBuyBox}>
              ${product.price.toFixed(2)}
            </div>
            
            {product.inventory > 0 ? (
              <div className={styles.inStock}>In Stock</div>
            ) : (
              <div className={styles.outOfStock}>Out of Stock</div>
            )}

            <div className={styles.features}>
              <div className={styles.feature}><Truck size={16} /> Free shipping over $35</div>
              <div className={styles.feature}><ShieldCheck size={16} /> Secure transaction</div>
              <div className={styles.feature}><Info size={16} /> Ships from Cammani</div>
            </div>

            {product.inventory > 0 && (
              <>
                <div className="form-group" style={{ marginBottom: 16 }}>
                  <label className="form-label">Quantity</label>
                  <select className={`input ${styles.qtySelect}`} value={qty} onChange={(e) => setQty(Number(e.target.value))}>
                    {Array.from({ length: Math.min(10, product.inventory) }).map((_, i) => (
                      <option key={i+1} value={i+1}>{i+1}</option>
                    ))}
                  </select>
                </div>
                <button className="btn btn-primary-lg" style={{ width: "100%", borderRadius: 100 }} onClick={handleAddToCart}>
                  <ShoppingCart size={18} /> Add to Cart
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
