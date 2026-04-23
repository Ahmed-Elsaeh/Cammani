"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import styles from "./NavBar.module.css";

const FALLBACK_CATEGORIES = [
  { _id: "1", name: "Electronics", slug: "electronics" },
  { _id: "2", name: "Fashion", slug: "fashion" },
  { _id: "3", name: "Home & Garden", slug: "home-garden" },
  { _id: "4", name: "Sports", slug: "sports" },
  { _id: "5", name: "Books", slug: "books" },
  { _id: "6", name: "Toys", slug: "toys" },
  { _id: "7", name: "Beauty", slug: "beauty" },
  { _id: "8", name: "Automotive", slug: "automotive" },
];

interface Category { _id: string; name: string; slug: string; }

export default function NavBar() {
  const [categories, setCategories] = useState<Category[]>(FALLBACK_CATEGORIES);

  useEffect(() => {
    api.get("/categories").then((r) => {
      if (r.data?.data?.length) setCategories(r.data.data);
    }).catch(() => {});
  }, []);

  return (
    <nav className={styles.nav} aria-label="Category navigation">
      <div className={`container ${styles.inner}`}>
        <Link href="/search" className={`${styles.item} ${styles.allDepts}`}>
          ☰ All
        </Link>
        {categories.slice(0, 8).map((cat) => (
          <Link
            key={cat._id || cat.slug}
            href={`/search?category=${cat.slug}`}
            className={styles.item}
          >
            {cat.name}
          </Link>
        ))}
        <Link href="/seller/apply" className={`${styles.item} ${styles.sellItem}`}>
          Sell on Cammani
        </Link>
      </div>
    </nav>
  );
}
