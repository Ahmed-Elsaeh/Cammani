import { Router, Request, Response } from "express";
import { authenticate } from "../middleware/auth";
import { Cart } from "../models/Cart";
import { Order } from "../models/Order";
import { config } from "../config";
import Stripe from "stripe";

const router = Router();

const stripe = new Stripe(config.stripe.secretKey, { apiVersion: "2025-03-31.basil" });

// POST /checkout/session
router.post("/session", authenticate, async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const cart = await Cart.findOne({ userId }).populate("items.sellerId", "storeName").lean();
  if (!cart || cart.items.length === 0) {
    res.status(400).json({ success: false, error: "Cart is empty" });
    return;
  }

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = cart.items.map((item) => ({
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

  const subtotal = cart.items.reduce((sum, i) => sum + i.priceSnapshot * i.qty, 0);

  // Create a pending order first
  const order = await Order.create({
    buyerId: userId,
    items: cart.items.map((i) => ({
      productId: i.productId,
      sellerId: i.sellerId,
      title: i.titleSnapshot,
      image: i.imageSnapshot,
      qty: i.qty,
      unitPrice: i.priceSnapshot,
    })),
    subtotal,
    total: subtotal,
    status: "pending",
  });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    success_url: `${config.frontendUrl}/orders?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config.frontendUrl}/cart`,
    metadata: {
      orderId: order._id.toString(),
      userId,
    },
  });

  // Attach session to order
  await Order.findByIdAndUpdate(order._id, { stripeCheckoutSessionId: session.id });

  res.json({ success: true, data: { url: session.url, sessionId: session.id } });
});

export default router;
