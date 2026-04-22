import { Router, Request, Response } from "express";
import Stripe from "stripe";
import { config } from "../config";
import { Order } from "../models/Order";
import { OrderEvent } from "../models/OrderEvent";
import { Cart } from "../models/Cart";
import { StripeAccount } from "../models/StripeAccount";

const router = Router();

const stripe = new Stripe(config.stripe.secretKey, { apiVersion: "2024-06-20" });

// POST /webhooks/stripe — raw body required (set up in app.ts before JSON middleware)
router.post("/stripe", async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, config.stripe.webhookSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Webhook signature failed:", message);
    res.status(400).send(`Webhook Error: ${message}`);
    return;
  }

  // Idempotency: skip already-processed events
  const existing = await OrderEvent.findOne({ stripeEventId: event.id });
  if (existing) {
    res.json({ received: true });
    return;
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId;
        if (orderId) {
          await Order.findByIdAndUpdate(orderId, {
            status: "paid",
            stripePaymentIntentId: session.payment_intent as string,
          });
          // Clear the buyer's cart
          const userId = session.metadata?.userId;
          if (userId) await Cart.findOneAndUpdate({ userId }, { $set: { items: [] } });
        }
        break;
      }

      case "payment_intent.succeeded": {
        const pi = event.data.object as Stripe.PaymentIntent;
        await Order.findOneAndUpdate(
          { stripePaymentIntentId: pi.id },
          { status: "paid" }
        );
        break;
      }

      case "payment_intent.payment_failed": {
        const pi = event.data.object as Stripe.PaymentIntent;
        await Order.findOneAndUpdate(
          { stripePaymentIntentId: pi.id },
          { status: "failed" }
        );
        console.log(`Payment failed for PI: ${pi.id}`);
        break;
      }

      case "account.updated": {
        // Stripe Connect account status update
        const account = event.data.object as Stripe.Account;
        await StripeAccount.findOneAndUpdate(
          { connectAccountId: account.id },
          {
            chargesEnabled: account.charges_enabled,
            payoutsEnabled: account.payouts_enabled,
            onboardingStatus: account.details_submitted ? "complete" : "pending",
          }
        );
        break;
      }

      default:
        console.log(`Unhandled Stripe event: ${event.type}`);
    }

    // Persist audit trail
    await OrderEvent.create({
      stripeEventId: event.id,
      type: event.type,
      payload: event.data.object as unknown as Record<string, unknown>,
    });

    res.json({ received: true });
  } catch (err) {
    console.error("Webhook processing error:", err);
    res.status(500).json({ error: "Webhook processing failed" });
  }
});

export default router;
