import "express-async-errors";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { config } from "./config";

// Routes
import authRoutes from "./routes/auth";
import catalogRoutes from "./routes/catalog";
import sellerRoutes from "./routes/seller";
import cartRoutes from "./routes/cart";
import checkoutRoutes from "./routes/checkout";
import orderRoutes from "./routes/orders";
import webhookRoutes from "./routes/webhooks";
import { errorHandler } from "./middleware/errorHandler";
import { supabase } from "./lib/supabase";

export function createApp() {
  const app = express();

  // ── Raw body for Stripe webhooks (MUST come before json())
  app.use("/webhooks", express.raw({ type: "application/json" }));

  // ── Global middleware
  app.use(cors({ origin: config.frontendUrl, credentials: true }));
  app.use(express.json());
  app.use(morgan("dev"));

  // ── Rate limiting for auth
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    message: { success: false, error: "Too many requests, please try again later" },
  });

  // ── Routes
  app.use("/auth", authLimiter, authRoutes);
  app.use("/products", catalogRoutes);
  app.use("/categories", async (_req, res) => {
    const { data: cats } = await supabase
      .from("categories")
      .select("*")
      .order("order", { ascending: true });
    res.json({ success: true, data: cats || [] });
  });
  app.use("/seller", sellerRoutes);
  app.use("/cart", cartRoutes);
  app.use("/checkout", checkoutRoutes);
  app.use("/orders", orderRoutes);
  app.use("/webhooks", webhookRoutes);

  // ── Health check
  app.get("/health", (_req, res) => res.json({ status: "ok", env: config.nodeEnv }));

  // ── Error handler (must be last)
  app.use(errorHandler);

  return app;
}
