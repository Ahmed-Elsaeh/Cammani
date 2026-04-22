import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.col}>
          <h3 className={styles.colTitle}>Get to Know Us</h3>
          <Link href="/about" className={styles.link}>About Cammani</Link>
          <Link href="/careers" className={styles.link}>Careers</Link>
          <Link href="/blog" className={styles.link}>Blog</Link>
        </div>
        <div className={styles.col}>
          <h3 className={styles.colTitle}>Make Money With Us</h3>
          <Link href="/seller/apply" className={styles.link}>Sell on Cammani</Link>
          <Link href="/seller" className={styles.link}>Seller Dashboard</Link>
          <Link href="/affiliate" className={styles.link}>Become an Affiliate</Link>
        </div>
        <div className={styles.col}>
          <h3 className={styles.colTitle}>Let Us Help You</h3>
          <Link href="/orders" className={styles.link}>Your Orders</Link>
          <Link href="/account" className={styles.link}>Your Account</Link>
          <Link href="/help" className={styles.link}>Help</Link>
          <Link href="/returns" className={styles.link}>Returns & Refunds</Link>
        </div>
        <div className={styles.col}>
          <h3 className={styles.colTitle}>Connect</h3>
          <a href="https://twitter.com" className={styles.link} target="_blank" rel="noopener">Twitter</a>
          <a href="https://facebook.com" className={styles.link} target="_blank" rel="noopener">Facebook</a>
          <a href="https://instagram.com" className={styles.link} target="_blank" rel="noopener">Instagram</a>
        </div>
      </div>
      <div className={styles.bottom}>
        <div className="container">
          <span>© {new Date().getFullYear()} Cammani, Inc. All rights reserved.</span>
          <div className={styles.bottomLinks}>
            <Link href="/privacy" className={styles.bottomLink}>Privacy Policy</Link>
            <Link href="/terms" className={styles.bottomLink}>Terms of Use</Link>
            <Link href="/cookies" className={styles.bottomLink}>Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
