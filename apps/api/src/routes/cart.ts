import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { supabase } from "../lib/supabase";
import { UpdateCartSchema } from "@cammani/shared";

const router = Router();
router.use(authenticate);

// GET /cart
router.get("/", async (req, res) => {
  const { data: cart, error } = await supabase
    .from("carts")
    .select("*")
    .eq("user_id", req.user!.userId)
    .single();

  if (error || !cart) {
    res.json({ success: true, data: { items: [], subtotal: 0 } });
    return;
  }
  const items = (cart.items as any[]) || [];
  const subtotal = items.reduce((sum, i) => sum + i.priceSnapshot * i.qty, 0);
  res.json({ success: true, data: { ...cart, _id: cart.id, subtotal } });
});

// PUT /cart
router.put("/", validate(UpdateCartSchema), async (req, res) => {
  const { items } = req.body as { items: { productId: string; qty: number }[] };
  const userId = req.user!.userId;

  const wanted = items.filter((i) => i.qty > 0);

  if (wanted.length === 0) {
    const { data: cart } = await supabase
      .from("carts")
      .upsert({ user_id: userId, items: [], updated_at: new Date().toISOString() })
      .select()
      .single();
    res.json({ success: true, data: { items: [], subtotal: 0 } });
    return;
  }

  const productIds = wanted.map((i) => i.productId);
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .in("id", productIds)
    .eq("status", "active");

  const productMap = new Map((products || []).map((p) => [p.id, p]));

  const cartItems = wanted
    .filter((i) => productMap.has(i.productId))
    .map((i) => {
      const p = productMap.get(i.productId)!;
      return {
        productId: p.id,
        _id: p.id, // For compatibility
        qty: Math.min(i.qty, p.inventory),
        priceSnapshot: p.price,
        titleSnapshot: p.title,
        imageSnapshot: p.images[0] || "",
        sellerId: p.seller_id,
      };
    });

  const { data: cart, error } = await supabase
    .from("carts")
    .upsert({ 
        user_id: userId, 
        items: cartItems, 
        updated_at: new Date().toISOString() 
    }, { onConflict: 'user_id' })
    .select()
    .single();

  if (error || !cart) {
    res.status(500).json({ success: false, error: error?.message || "Error updating cart" });
    return;
  }

  const subtotal = (cart.items as any[]).reduce((sum, i) => sum + i.priceSnapshot * i.qty, 0);
  res.json({ success: true, data: { ...cart, _id: cart.id, subtotal } });
});

export default router;
