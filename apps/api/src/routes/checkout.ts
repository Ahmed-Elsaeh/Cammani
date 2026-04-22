import { Router, Request, Response } from "express";
import { authenticate } from "../middleware/auth";
import { supabase } from "../lib/supabase";
import { config } from "../config";
import Stripe from "stripe";

const router = Router();

const stripe = new Stripe(config.stripe.secretKey, { apiVersion: "2024-06-20" });

// POST /checkout/session
router.post("/session", authenticate, async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const { data: cart } = await supabase
    .from("carts")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (!cart || !cart.items || (cart.items as any[]).length === 0) {
    res.status(400).json({ success: false, error: "Cart is empty" });
    return;
  }

  const items = cart.items as any[];
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.titleSnapshot,
        images: item.imageSnapshot ? [item.imageSnapshot] : [],
      },
      unit_amount: Math.round(item.priceSnapshot * 100),
    },
    quantity: item.qty,
  }));

  const subtotal = items.reduce((sum, i) => sum + i.priceSnapshot * i.qty, 0);

  // Create a pending order
  // Note: we assume first item's sellerId is the main one for the order table for now
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      seller_id: items[0].sellerId, // Simplified
      items: items,
      total_amount: subtotal,
      status: "pending",
    })
    .select()
    .single();

  if (orderError || !order) {
    res.status(500).json({ success: false, error: orderError?.message || "Error creating order" });
    return;
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    success_url: `${config.frontendUrl}/orders?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config.frontendUrl}/cart`,
    metadata: {
      orderId: order.id,
      userId,
    },
  });

  // Attach session to order
  await supabase
    .from("orders")
    .update({ stripe_checkout_session_id: session.id })
    .eq("id", order.id);

  res.json({ success: true, data: { url: session.url, sessionId: session.id } });
});

export default router;
