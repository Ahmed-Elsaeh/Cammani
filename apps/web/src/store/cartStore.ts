import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/lib/api";
import type { CartItemDto } from "@/types/shared";

interface CartState {
  items: CartItemDto[];
  isLoading: boolean;
  addItem: (productId: string, qty?: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQty: (productId: string, qty: number) => Promise<void>;
  clearCart: () => void;
  fetchCart: () => Promise<void>;
  itemCount: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      fetchCart: async () => {
        try {
          const { data } = await api.get("/cart");
          const items: CartItemDto[] = (data.data.items || []).map((i: {
            productId: { _id?: string; toString(): string } | string;
            titleSnapshot?: string; title?: string;
            imageSnapshot?: string; image?: string;
            priceSnapshot?: number; price?: number;
            qty: number;
            sellerId: { _id?: string; storeName?: string; toString(): string } | string;
            maxQty?: number;
          }) => ({
            productId: typeof i.productId === "object" ? (i.productId._id || i.productId.toString()) : i.productId,
            title: i.titleSnapshot || i.title || "",
            image: i.imageSnapshot || i.image || "",
            price: i.priceSnapshot || i.price || 0,
            qty: i.qty,
            sellerId: typeof i.sellerId === "object" ? (i.sellerId._id || i.sellerId.toString()) : i.sellerId,
            sellerName: typeof i.sellerId === "object" ? (i.sellerId.storeName || "") : "",
            maxQty: i.maxQty || 999,
          }));
          set({ items });
        } catch {
          // Guest cart stays local
        }
      },

      addItem: async (productId, qty = 1) => {
        const current = get().items;
        const existing = current.find((i) => i.productId === productId);
        let updated: { productId: string; qty: number }[];
        if (existing) {
          updated = current.map((i) =>
            i.productId === productId ? { ...i, qty: i.qty + qty } : i
          );
        } else {
          // Fetch product info for snapshot
          const { data } = await api.get(`/products/${productId}`);
          const p = data.data;
          const newItem: CartItemDto = {
            productId,
            title: p.title,
            image: p.images?.[0] || "",
            price: p.price,
            qty,
            sellerId: p.sellerId?._id || p.sellerId,
            sellerName: p.sellerId?.storeName || "",
            maxQty: p.inventory,
          };
          const newItems = [...current, newItem];
          set({ items: newItems });
          updated = newItems.map((i) => ({ productId: i.productId, qty: i.qty }));
          try { await api.put("/cart", { items: updated }); } catch { /* offline */ }
          return;
        }
        set({ items: updated as CartItemDto[] });
        try { await api.put("/cart", { items: updated.map((i) => ({ productId: i.productId, qty: i.qty })) }); } catch { /* offline */ }
      },

      removeItem: async (productId) => {
        const updated = get().items.filter((i) => i.productId !== productId);
        set({ items: updated });
        try { await api.put("/cart", { items: updated.map((i) => ({ productId: i.productId, qty: i.qty })) }); } catch { /* offline */ }
      },

      updateQty: async (productId, qty) => {
        if (qty <= 0) { get().removeItem(productId); return; }
        const updated = get().items.map((i) => i.productId === productId ? { ...i, qty } : i);
        set({ items: updated });
        try { await api.put("/cart", { items: updated.map((i) => ({ productId: i.productId, qty: i.qty })) }); } catch { /* offline */ }
      },

      clearCart: () => set({ items: [] }),

      itemCount: () => get().items.reduce((n, i) => n + i.qty, 0),

      subtotal: () => get().items.reduce((s, i) => s + i.price * i.qty, 0),
    }),
    { name: "cammani-cart", partialize: (s) => ({ items: s.items }) }
  )
);
