import { Router, Request, Response } from "express";
import Stripe from "stripe";
import { config } from "../config";
import { supabase } from "../lib/supabase";

const router = Router();

const stripe = new Stripe(config.stripe.secretKey, { apiVersion: "2024-06-20" });

// POST /webhooks/stripe
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
  const { data: existing } = await supabase
    .from("order_events")
    .select("id")
    .eq("data->>id", event.id) // Assuming event.id is stored in the data jsonb
    .single();

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
          await supabase
            .from("orders")
            .update({
              status: "paid",
              stripe_payment_intent_id: session.payment_intent as string,
            })
            .eq("id", orderId);
            
          // Clear the buyer's cart
          const userId = session.metadata?.userId;
          if (userId) {
            await supabase
              .from("carts")
              .update({ items: [] })
              .eq("user_id", userId);
          }
        }
        break;
      }

      case "payment_intent.succeeded": {
        const pi = event.data.object as Stripe.PaymentIntent;
        await supabase
          .from("orders")
          .update({ status: "paid" })
          .eq("stripe_payment_intent_id", pi.id);
        break;
      }

      case "payment_intent.payment_failed": {
        const pi = event.data.object as Stripe.PaymentIntent;
        await supabase
          .from("orders")
          .update({ status: "failed" })
          .eq("stripe_payment_intent_id", pi.id);
        console.log(`Payment failed for PI: ${pi.id}`);
        break;
      }

      case "account.updated": {
        const account = event.data.object as Stripe.Account;
        await supabase
          .from("stripe_accounts")
          .update({
            charges_enabled: account.charges_enabled,
            payouts_enabled: account.payouts_enabled,
            details_submitted: account.details_submitted,
          })
          .eq("stripe_id", account.id);
        break;
      }

      default:
        console.log(`Unhandled Stripe event: ${event.type}`);
    }

    // Persist audit trail
    await supabase.from("order_events").insert({
      type: event.type,
      data: event.data.object as any,
    });

    res.json({ received: true });
  } catch (err) {
    console.error("Webhook processing error:", err);
    res.status(500).json({ error: "Webhook processing failed" });
  }
});

export default router;
