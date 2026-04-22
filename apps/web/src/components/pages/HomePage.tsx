"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Zap, Shield, Truck, HeadphonesIcon } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import api from "@/lib/api";
import styles from "./HomePage.module.css";

const HERO_SLIDES = [
  {
    title: "Summer Sale — Up to 70% Off",
    subtitle: "Shop the biggest deals of the season across electronics, fashion & more.",
    cta: "Shop Now",
    href: "/search",
    gradient: "linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #06b6d4 100%)",
  },
  {
    title: "New Arrivals in Electronics",
    subtitle: "Latest smartphones, laptops, and gadgets from top brands.",
    cta: "Explore Electronics",
    href: "/search?category=electronics",
    gradient: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #7c3aed 100%)",
  },
  {
    title: "Sell on Cammani",
    subtitle: "Join thousands of sellers and reach millions of buyers.",
    cta: "Start Selling",
    href: "/seller/apply",
    gradient: "linear-gradient(135deg, #164e63 0%, #0284c7 50%, #0369a1 100%)",
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
    const timer = setInterval(() => setSlide((s) => (s + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const hero = HERO_SLIDES[slide];

  return (
    <div className="page-content" style={{ padding: 0 }}>

      {/* ── Hero ── */}
      <section className={styles.hero} style={{ background: hero.gradient }}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>{hero.title}</h1>
            <p className={styles.heroSubtitle}>{hero.subtitle}</p>
            <Link href={hero.href} className="btn btn-primary-lg" style={{ background: "#fbbf24", color: "#1e3a8a" }}>
              {hero.cta} <ArrowRight size={16} />
            </Link>
          </div>
          <div className={styles.heroDecorator}>
            <div className={styles.decoratorCircle1} />
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
      <section className={styles.trustBar}>
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
      </section>

      <div className="container" style={{ paddingTop: 32, paddingBottom: 48 }}>

        {/* ── Categories ── */}
        <section className={styles.section}>
          <h2 className="section-title">Shop by Category</h2>
          <div className={styles.categoryGrid}>
            {CATEGORIES.map((cat) => (
              <Link key={cat.slug} href={`/search?category=${cat.slug}`} className={styles.categoryCard}>
                <span className={styles.categoryEmoji}>{cat.emoji}</span>
                <span className={styles.categoryName}>{cat.name}</span>
              </Link>
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
            <Link href="/search" className="btn btn-outline btn-sm">
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
              {products.map((p) => (
                <ProductCard
                  key={p._id}
                  _id={p._id}
                  title={p.title}
                  price={p.price}
                  images={p.images}
                  rating={p.rating}
                  reviewCount={p.reviewCount}
                  sellerName={p.sellerId?.storeName}
                  inventory={p.inventory}
                />
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
        <section className={styles.sellBanner}>
          <div className={styles.sellBannerContent}>
            <h2 className={styles.sellBannerTitle}>Start Selling Today</h2>
            <p className={styles.sellBannerText}>Reach millions of buyers. Set up your store in minutes.</p>
            <Link href="/seller/apply" className="btn btn-primary-lg" style={{ background: "white", color: "var(--blue-800)" }}>
              Open Your Store <ArrowRight size={16} />
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
