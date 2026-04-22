import { Router } from "express";
import { authenticate, requireRole } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { Seller } from "../models/Seller";
import { StripeAccount } from "../models/StripeAccount";
import { User } from "../models/User";
import { Product } from "../models/Product";
import { SellerApplySchema, CreateProductSchema } from "@cammani/shared";
import Stripe from "stripe";
import { config } from "../config";

const router = Router();
router.use(authenticate);

const stripe = new Stripe(config.stripe.secretKey, { apiVersion: "2025-03-31.basil" });

// POST /seller/apply
router.post("/apply", validate(SellerApplySchema), async (req, res) => {
  const { storeName, description, returnPolicy, shippingPolicy } = req.body;
  const userId = req.user!.userId;

  const existing = await Seller.findOne({ userId });
  if (existing) {
    res.status(409).json({ success: false, error: "Seller profile already exists" });
    return;
  }

  const seller = await Seller.create({ userId, storeName, description, returnPolicy, shippingPolicy });

  // Add seller role to user
  await User.findByIdAndUpdate(userId, { $addToSet: { roles: "seller" } });

  res.status(201).json({ success: true, data: seller });
});

// GET /seller/me
router.get("/me", requireRole("seller", "admin"), async (req, res) => {
  const seller = await Seller.findOne({ userId: req.user!.userId }).lean();
  if (!seller) { res.status(404).json({ success: false, error: "Seller not found" }); return; }

  const stripeAccount = await StripeAccount.findOne({ sellerId: seller._id }).lean();
  res.json({ success: true, data: { seller, stripeAccount } });
});

// POST /seller/stripe/onboard — create or retrieve Connect account and return onboarding link
router.post("/stripe/onboard", requireRole("seller", "admin"), async (req, res) => {
  const seller = await Seller.findOne({ userId: req.user!.userId });
  if (!seller) { res.status(404).json({ success: false, error: "Seller not found" }); return; }

  let stripeAccount = await StripeAccount.findOne({ sellerId: seller._id });

  if (!stripeAccount) {
    const account = await stripe.accounts.create({
      type: "express",
      metadata: { sellerId: seller._id.toString() },
    });
    stripeAccount = await StripeAccount.create({
      sellerId: seller._id,
      connectAccountId: account.id,
      onboardingStatus: "pending",
    });
  }

  const accountLink = await stripe.accountLinks.create({
    account: stripeAccount.connectAccountId,
    refresh_url: `${config.frontendUrl}/seller/stripe/refresh`,
    return_url: `${config.frontendUrl}/seller/stripe/return`,
    type: "account_onboarding",
  });

  res.json({ success: true, data: { url: accountLink.url } });
});

// GET /seller/products
router.get("/products", requireRole("seller", "admin"), async (req, res) => {
  const seller = await Seller.findOne({ userId: req.user!.userId });
  if (!seller) { res.status(404).json({ success: false, error: "Seller not found" }); return; }

  const products = await Product.find({ sellerId: seller._id }).sort({ createdAt: -1 }).lean();
  res.json({ success: true, data: products });
});

// POST /seller/products
router.post("/products", requireRole("seller", "admin"), validate(CreateProductSchema), async (req, res) => {
  const seller = await Seller.findOne({ userId: req.user!.userId });
  if (!seller) { res.status(404).json({ success: false, error: "Seller not found" }); return; }

  const product = await Product.create({ ...req.body, sellerId: seller._id });
  res.status(201).json({ success: true, data: product });
});

// PATCH /seller/products/:id
router.patch("/products/:id", requireRole("seller", "admin"), async (req, res) => {
  const seller = await Seller.findOne({ userId: req.user!.userId });
  if (!seller) { res.status(404).json({ success: false, error: "Seller not found" }); return; }

  const product = await Product.findOneAndUpdate(
    { _id: req.params.id, sellerId: seller._id },
    { $set: req.body },
    { new: true, runValidators: true }
  );
  if (!product) { res.status(404).json({ success: false, error: "Product not found" }); return; }
  res.json({ success: true, data: product });
});

// GET /seller/orders
router.get("/orders", requireRole("seller", "admin"), async (req, res) => {
  const seller = await Seller.findOne({ userId: req.user!.userId });
  if (!seller) { res.status(404).json({ success: false, error: "Seller not found" }); return; }

  const { Order } = await import("../models/Order");
  const orders = await Order.find({ "items.sellerId": seller._id })
    .sort({ createdAt: -1 })
    .lean();
  res.json({ success: true, data: orders });
});

export default router;
