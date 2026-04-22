"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ShoppingCart, Search, User, Package, ChevronDown, LogOut, Store, Menu, X } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import styles from "./Header.module.css";

export default function Header() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const itemCount = useCartStore((s) => s.itemCount());
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>C</span>
          <span className={styles.logoText}>ammani</span>
        </Link>

        {/* Search bar */}
        <form className={styles.searchForm} onSubmit={handleSearch}>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search products, brands, categories…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search"
            id="global-search"
          />
          <button type="submit" className={styles.searchBtn} aria-label="Submit search">
            <Search size={18} />
          </button>
        </form>

        {/* Right actions */}
        <nav className={styles.actions}>
          {/* Cart */}
          <Link href="/cart" className={styles.iconBtn} aria-label="Cart">
            <ShoppingCart size={20} />
            {itemCount > 0 && <span className={styles.badge}>{itemCount}</span>}
          </Link>

          {/* Account */}
          {user ? (
            <div className={styles.accountMenu}>
              <button
                className={styles.accountBtn}
                onClick={() => setAccountOpen((v) => !v)}
                id="account-menu-btn"
              >
                <div className={styles.avatar}>{user.name[0].toUpperCase()}</div>
                <span className={styles.accountName}>{user.name.split(" ")[0]}</span>
                <ChevronDown size={14} />
              </button>
              {accountOpen && (
                <div className={styles.dropdown} onClick={() => setAccountOpen(false)}>
                  <Link href="/orders" className={styles.dropdownItem}>
                    <Package size={15} /> My Orders
                  </Link>
                  {user.roles?.includes("seller") && (
                    <Link href="/seller" className={styles.dropdownItem}>
                      <Store size={15} /> Seller Dashboard
                    </Link>
                  )}
                  <div className={styles.dropdownDivider} />
                  <button
                    className={styles.dropdownItem}
                    onClick={() => { logout(); router.push("/"); }}
                  >
                    <LogOut size={15} /> Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth/login" className={`btn btn-outline btn-sm ${styles.signInBtn}`}>
              <User size={15} /> Sign in
            </Link>
          )}

          {/* Mobile menu */}
          <button
            className={styles.mobileMenuBtn}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </div>

      {/* Mobile search */}
      <form className={styles.mobileSearch} onSubmit={handleSearch}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Search products…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          id="mobile-search"
        />
        <button type="submit" className={styles.searchBtn}>
          <Search size={18} />
        </button>
      </form>
    </header>
  );
}
