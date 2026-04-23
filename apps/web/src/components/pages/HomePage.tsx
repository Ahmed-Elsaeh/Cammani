"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Zap, Shield, Truck, HeadphonesIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/products/ProductCard";
import api from "@/lib/api";
import styles from "./HomePage.module.css";

const HERO_SLIDES = [
  {
    title: "Summer Sale — Up to 70% Off",
    subtitle: "Shop the biggest deals of the season across electronics, fashion & more.",
    cta: "Shop Now",
    href: "/search",
    gradient: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #db2777 100%)",
  },
  {
    title: "New Arrivals in Electronics",
    subtitle: "Latest smartphones, laptops, and gadgets from top brands.",
    cta: "Explore Electronics",
    href: "/search?category=electronics",
    gradient: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #6366f1 100%)",
  },
  {
    title: "Sell on Cammani",
    subtitle: "Join thousands of sellers and reach millions of buyers.",
    cta: "Start Selling",
    href: "/seller/apply",
    gradient: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
  },
];

const CATEGORIES = [
  { name: "Electronics", slug: "electronics", emoji: "💻" },
  { name: "Fashion", slug: "fashion", emoji: "👗" },
  { name: "Home & Garden", slug: "home-garden", emoji: "🏡" },
  { name: "Sports", slug: "sports", emoji: "⚽" },
  { name: "Books", slug: "books", emoji: "📚" },
  { name: "Beauty", slug: "beauty", emoji: "💄" },
  { name: "Toys", slug: "toys", emoji: "🎮" },
  { name: "Automotive", slug: "automotive", emoji: "🚗" },
];

interface Product {
  _id: string; title: string; price: number; images: string[];
  rating?: number; reviewCount?: number; sellerId?: { storeName?: string }; inventory?: number;
}

export default function HomePage() {
  const [slide, setSlide] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/products?limit=12").then((r) => {
      setProducts(r.data?.data?.items || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setSlide((s) => (s + 1) % HERO_SLIDES.length), 8000);
    return () => clearInterval(timer);
  }, []);

  const hero = HERO_SLIDES[slide];

  return (
    <div className="page-content" style={{ padding: 0 }}>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <AnimatePresence mode="wait">
          <motion.div
            key={slide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className={styles.heroBg}
            style={{ background: hero.gradient }}
          />
        </AnimatePresence>
        
        <div className={`container ${styles.heroInner}`}>
          <motion.div 
            key={slide + "text"}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className={styles.heroText}
          >
            <h1 className={styles.heroTitle}>{hero.title}</h1>
            <p className={styles.heroSubtitle}>{hero.subtitle}</p>
            <Link href={hero.href} className="btn btn-primary-lg" style={{ background: "white", color: "var(--blue-900)", borderRadius: '99px' }}>
              {hero.cta} <ArrowRight size={16} />
            </Link>
          </motion.div>
          
          <div className={styles.heroDecorator}>
            <motion.div 
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, 0],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className={styles.decoratorCircle1} 
            />
            <div className={styles.decoratorCircle2} />
          </div>
        </div>
        
        <div className={styles.heroDots}>
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === slide ? styles.dotActive : ""}`}
              onClick={() => setSlide(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ── Trust bar ── */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={styles.trustBar}
      >
        <div className={`container ${styles.trustInner}`}>
          {[
            { icon: <Truck size={20} />, text: "Free Shipping on $35+" },
            { icon: <Shield size={20} />, text: "Buyer Protection" },
            { icon: <Zap size={20} />, text: "Fast Checkout" },
            { icon: <HeadphonesIcon size={20} />, text: "24/7 Support" },
          ].map((item) => (
            <div key={item.text} className={styles.trustItem}>
              <span className={styles.trustIcon}>{item.icon}</span>
              <span className={styles.trustText}>{item.text}</span>
            </div>
          ))}
        </div>
      </motion.section>

      <div className="container" style={{ paddingTop: 32, paddingBottom: 48 }}>

        {/* ── Categories ── */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className="section-title">Shop by Category</h2>
          </div>
          <div className={styles.categoryGrid}>
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/search?category=${cat.slug}`} className={styles.categoryCard}>
                  <span className={styles.categoryEmoji}>{cat.emoji}</span>
                  <span className={styles.categoryName}>{cat.name}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Featured Products ── */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className="section-title">Featured Products</h2>
              <p className="section-subtitle">Handpicked deals just for you</p>
            </div>
            <Link href="/search" className="btn btn-outline btn-sm" style={{ borderRadius: '99px' }}>
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className={styles.productGrid}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className={styles.skeletonCard}>
                  <div className={`skeleton ${styles.skeletonImg}`} />
                  <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                    <div className="skeleton" style={{ height: 14, width: "80%" }} />
                    <div className="skeleton" style={{ height: 12, width: "50%" }} />
                    <div className="skeleton" style={{ height: 18, width: "40%" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className={styles.productGrid}>
              {products.map((p, i) => (
                <motion.div
                  key={p._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 4) * 0.1 }}
                >
                  <ProductCard
                    _id={p._id}
                    title={p.title}
                    price={p.price}
                    images={p.images}
                    rating={p.rating}
                    reviewCount={p.reviewCount}
                    sellerName={p.sellerId?.storeName}
                    inventory={p.inventory}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>No products yet — check back soon!</p>
              <Link href="/seller/apply" className="btn btn-primary">Become a Seller</Link>
            </div>
          )}
        </section>

        {/* ── Sell CTA banner ── */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className={styles.sellBanner} 
          style={{ background: 'var(--grad-premium)', border: 'none' }}
        >
          <div className={styles.sellBannerContent}>
            <h2 className={styles.sellBannerTitle}>Start Selling Today</h2>
            <p className={styles.sellBannerText}>Reach millions of buyers. Set up your store in minutes.</p>
            <Link href="/seller/apply" className="btn btn-primary-lg" style={{ background: "white", color: "#4f46e5", borderRadius: '99px' }}>
              Open Your Store <ArrowRight size={16} />
            </Link>
          </div>
        </motion.section>

      </div>
    </div>
  );
}

