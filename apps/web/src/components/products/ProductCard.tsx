"use client";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import StarRating from "@/components/ui/StarRating";
import toast from "react-hot-toast";
import styles from "./ProductCard.module.css";

interface Props {
  _id: string;
  title: string;
  price: number;
  images: string[];
  rating?: number;
  reviewCount?: number;
  sellerName?: string;
  inventory?: number;
  badge?: string;
}

export default function ProductCard({ _id, title, price, images, rating = 0, reviewCount = 0, sellerName, inventory = 0, badge }: Props) {
  const addItem = useCartStore((s) => s.addItem);

  async function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    try {
      await addItem(_id);
      toast.success("Added to cart!");
    } catch {
      toast.error("Could not add to cart.");
    }
  }

  const imageUrl = images?.[0] || `https://placehold.co/400x400/e2e8f0/64748b?text=${encodeURIComponent(title.slice(0, 10))}`;

  return (
    <Link href={`/product/${_id}`} className={`${styles.card} card card-hover`}>
      <div className={styles.imageWrap}>
        <Image
          src={imageUrl}
          alt={title}
          width={280}
          height={280}
          className={styles.image}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />
        {badge && <span className={`badge badge-blue ${styles.badge}`}>{badge}</span>}
        {inventory === 0 && <div className={styles.outOfStock}>Out of Stock</div>}
      </div>

      <div className={styles.body}>
        <p className={`${styles.title} line-clamp-2`}>{title}</p>

        {sellerName && <p className={styles.seller}>by {sellerName}</p>}

        {rating > 0 && (
          <div className={styles.ratingRow}>
            <StarRating value={rating} size={13} />
            <span className={styles.reviewCount}>({reviewCount.toLocaleString()})</span>
          </div>
        )}

        <div className={styles.footer}>
          <span className={styles.price}>${price.toFixed(2)}</span>
          <button
            className={`btn btn-primary btn-sm ${styles.cartBtn}`}
            onClick={handleAddToCart}
            disabled={inventory === 0}
            aria-label={`Add ${title} to cart`}
          >
            <ShoppingCart size={13} />
            Add
          </button>
        </div>
      </div>
    </Link>
  );
}
