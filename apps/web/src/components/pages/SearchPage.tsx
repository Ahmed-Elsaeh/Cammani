"use client";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import api from "@/lib/api";
import styles from "./SearchPage.module.css";

const SORT_OPTIONS = [
  { value: "newest",     label: "Newest" },
  { value: "price_asc",  label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating",     label: "Best Rated" },
];

interface Product {
  _id: string; title: string; price: number; images: string[];
  rating?: number; reviewCount?: number; sellerId?: { storeName?: string }; inventory?: number;
}
interface Meta { total: number; page: number; totalPages: number; }

export default function SearchPage() {
  const params = useSearchParams();
  const q        = params.get("q") || "";
  const category = params.get("category") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [meta, setMeta]         = useState<Meta>({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading]   = useState(true);
  const [sort, setSort]         = useState("newest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [page, setPage]         = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const qs = new URLSearchParams({
        ...(q && { q }),
        ...(category && { category }),
        sort,
        page: String(page),
        limit: "24",
        ...(minPrice && { minPrice }),
        ...(maxPrice && { maxPrice }),
      });
      const r = await api.get(`/products?${qs}`);
      setProducts(r.data?.data?.items || []);
      setMeta({ total: r.data?.data?.total, page: r.data?.data?.page, totalPages: r.data?.data?.totalPages });
    } catch { setProducts([]); }
    finally { setLoading(false); }
  }, [q, category, sort, page, minPrice, maxPrice]);

  useEffect(() => { setPage(1); }, [q, category, sort, minPrice, maxPrice]);
  useEffect(() => { fetch(); }, [fetch]);

  return (
    <div className="page-content container">
      {/* Header */}
      <div className={styles.topRow}>
        <div>
          <h1 className={styles.heading}>
            {q ? (
              `Results for "${q}"`
            ) : category ? (
              `Category: ${category
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')
                .replace('And', '&')}`
            ) : (
              "All Products"
            )}
          </h1>
          {!loading && <p className={styles.count}>{meta.total.toLocaleString()} results</p>}
        </div>
        <div className={styles.controls}>
          <button className={`btn btn-ghost btn-sm ${styles.filterToggle}`} onClick={() => setFiltersOpen(v => !v)}>
            <SlidersHorizontal size={15} /> Filters
          </button>
          <div className={styles.sortWrap}>
            <select
              className={`input ${styles.sortSelect}`}
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              id="sort-select"
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown size={14} className={styles.sortChevron} />
          </div>
        </div>
      </div>

      <div className={styles.layout}>
        {/* Filters sidebar */}
        <aside className={`${styles.sidebar} ${filtersOpen ? styles.sidebarOpen : ""}`}>
          <div className={styles.filterGroup}>
            <h3 className={styles.filterTitle}>Price Range</h3>
            <div className={styles.priceRow}>
              <input
                className="input"
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                id="filter-min-price"
                min={0}
              />
              <span>—</span>
              <input
                className="input"
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                id="filter-max-price"
                min={0}
              />
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className={styles.results}>
          {loading ? (
            <div className={styles.grid}>
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className={styles.skeletonCard}>
                  <div className={`skeleton ${styles.skeletonImg}`} />
                  <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                    <div className="skeleton" style={{ height: 14, width: "80%" }} />
                    <div className="skeleton" style={{ height: 18, width: "40%" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className={styles.empty}>
              <span style={{ fontSize: 48 }}>🔍</span>
              <h2>No results found</h2>
              <p>Try a different search term or remove filters.</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {products.map((p) => (
                <ProductCard key={p._id} _id={p._id} title={p.title} price={p.price}
                  images={p.images} rating={p.rating} reviewCount={p.reviewCount}
                  sellerName={p.sellerId?.storeName} inventory={p.inventory}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {meta.totalPages > 1 && (
            <div className={styles.pagination}>
              <button className="btn btn-outline btn-sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                Previous
              </button>
              <span className={styles.pageInfo}>Page {meta.page} of {meta.totalPages}</span>
              <button className="btn btn-outline btn-sm" disabled={page >= meta.totalPages} onClick={() => setPage(p => p + 1)}>
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
