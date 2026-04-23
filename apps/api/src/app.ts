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
import adminRoutes from "./routes/admin";
import webhookRoutes from "./routes/webhooks";
import { errorHandler } from "./middleware/errorHandler";
import { supabase } from "./lib/supabase";

export function createApp() {
  const app = express();

  // ── Raw body for Stripe webhooks (MUST come before json())
  app.use("/webhooks", express.raw({ type: "application/json" }));

  // ── Global middleware
  // Allow requests from frontend URL and all Vercel preview deployments
  const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Allow localhost for development
      if (origin.startsWith('http://localhost:') || origin.startsWith('https://localhost:')) {
        return callback(null, true);
      }

      // Allow the configured frontend URL
      if (origin === config.frontendUrl || origin === 'https://cammani-web.vercel.app') {
        return callback(null, true);
      }

      // Allow all Vercel subdomains for this project
      if (origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }

      // Reject other origins
      return callback(null, false);
    },
    credentials: true
  };

  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(morgan("dev"));

  // ── Debug Logging
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });

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
    
    const mapped = (cats || []).map((c: any) => ({ ...c, _id: c.id }));
    res.json({ success: true, data: mapped });
  });
  app.use("/seller", sellerRoutes);
  app.use("/cart", cartRoutes);
  app.use("/checkout", checkoutRoutes);
  app.use("/orders", orderRoutes);
  app.use("/admin", adminRoutes);
  app.use("/webhooks", webhookRoutes);

  // ── Health check
  app.get("/health", (_req, res) => res.json({ status: "ok", env: config.nodeEnv }));

  // ── Error handler (must be last)
  app.use(errorHandler);

  return app;
}
