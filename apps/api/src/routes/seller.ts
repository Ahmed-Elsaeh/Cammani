import { Router } from "express";
import { authenticate, requireRole } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { supabase } from "../lib/supabase";
import { SellerApplySchema, CreateProductSchema } from "../types/shared";
import Stripe from "stripe";
import { config } from "../config";

const router = Router();
router.use(authenticate);

const stripe = new Stripe(config.stripe.secretKey, { apiVersion: "2024-06-20" });

// POST /seller/apply
router.post("/apply", validate(SellerApplySchema), async (req, res) => {
  const { storeName, description, returnPolicy, shippingPolicy } = req.body;
  const userId = req.user!.userId;

  const { data: existing } = await supabase
    .from("sellers")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (existing) {
    res.status(409).json({ success: false, error: "Seller profile already exists" });
    return;
  }

  const { data: seller, error: sellerError } = await supabase
    .from("sellers")
    .insert({
      user_id: userId,
      store_name: storeName,
      description,
      return_policy: returnPolicy,
      shipping_policy: shippingPolicy,
    })
    .select()
    .single();

  if (sellerError || !seller) {
    res.status(500).json({ success: false, error: sellerError?.message || "Error creating seller" });
    return;
  }

  // Add seller role to user
  const { data: user } = await supabase.from("users").select("roles").eq("id", userId).single();
  if (user && !user.roles.includes("seller")) {
    await supabase
      .from("users")
      .update({ roles: [...user.roles, "seller"] })
      .eq("id", userId);
  }

  res.status(201).json({ success: true, data: seller });
});

// GET /seller/me
router.get("/me", requireRole("seller", "admin"), async (req, res) => {
  const { data: seller, error: sellerError } = await supabase
    .from("sellers")
    .select("*")
    .eq("user_id", req.user!.userId)
    .single();

  if (sellerError || !seller) {
    res.status(404).json({ success: false, error: "Seller not found" });
    return;
  }

  const { data: stripeAccount } = await supabase
    .from("stripe_accounts")
    .select("*")
    .eq("seller_id", seller.id)
    .single();

  res.json({ success: true, data: { seller, stripeAccount } });
});

// POST /seller/stripe/onboard
router.post("/stripe/onboard", requireRole("seller", "admin"), async (req, res) => {
  const { data: seller } = await supabase
    .from("sellers")
    .select("id")
    .eq("user_id", req.user!.userId)
    .single();

  if (!seller) {
    res.status(404).json({ success: false, error: "Seller not found" });
    return;
  }

  let { data: stripeAccount } = await supabase
    .from("stripe_accounts")
    .select("*")
    .eq("seller_id", seller.id)
    .single();

  if (!stripeAccount) {
    const account = await stripe.accounts.create({
      type: "express",
      metadata: { sellerId: seller.id },
    });
    const { data: newAccount, error: insertError } = await supabase
      .from("stripe_accounts")
      .insert({
        seller_id: seller.id,
        stripe_id: account.id,
      })
      .select()
      .single();

    if (insertError) {
      res.status(500).json({ success: false, error: insertError.message });
      return;
    }
    stripeAccount = newAccount;
  }

  const accountLink = await stripe.accountLinks.create({
    account: stripeAccount!.stripe_id,
    refresh_url: `${config.frontendUrl}/seller/stripe/refresh`,
    return_url: `${config.frontendUrl}/seller/stripe/return`,
    type: "account_onboarding",
  });

  res.json({ success: true, data: { url: accountLink.url } });
});

// GET /seller/products
router.get("/products", requireRole("seller", "admin"), async (req, res) => {
  const { data: seller } = await supabase
    .from("sellers")
    .select("id")
    .eq("user_id", req.user!.userId)
    .single();

  if (!seller) {
    res.status(404).json({ success: false, error: "Seller not found" });
    return;
  }

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("seller_id", seller.id)
    .order("created_at", { ascending: false });

  const productsWithId = (products || []).map((p: any) => ({ ...p, _id: p.id }));
  res.json({ success: true, data: productsWithId });
});

// POST /seller/products
router.post("/products", requireRole("seller", "admin"), validate(CreateProductSchema), async (req, res) => {
  const { data: seller } = await supabase
    .from("sellers")
    .select("id")
    .eq("user_id", req.user!.userId)
    .single();

  if (!seller) {
    res.status(404).json({ success: false, error: "Seller not found" });
    return;
  }

  // Convert CamelCase from shared schema to snake_case if necessary
  const productData = {
    seller_id: seller.id,
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    currency: req.body.currency || "USD",
    category_id: req.body.categoryId,
    images: req.body.images || [],
    inventory: req.body.inventory || 0,
    attributes: req.body.attributes || {},
    status: req.body.status || "draft",
  };

  const { data: product, error } = await supabase
    .from("products")
    .insert(productData)
    .select()
    .single();

  if (error) {
    res.status(500).json({ success: false, error: error.message });
    return;
  }

  res.status(201).json({ success: true, data: { ...product, _id: product.id } });
});

// PATCH /seller/products/:id
router.patch("/products/:id", requireRole("seller", "admin"), async (req, res) => {
  const { data: seller } = await supabase
    .from("sellers")
    .select("id")
    .eq("user_id", req.user!.userId)
    .single();

  if (!seller) {
    res.status(404).json({ success: false, error: "Seller not found" });
    return;
  }

  // Map fields to snake_case
  const updateData: any = {};
  if (req.body.title) updateData.title = req.body.title;
  if (req.body.description) updateData.description = req.body.description;
  if (req.body.price !== undefined) updateData.price = req.body.price;
  if (req.body.inventory !== undefined) updateData.inventory = req.body.inventory;
  if (req.body.status) updateData.status = req.body.status;
  if (req.body.categoryId) updateData.category_id = req.body.categoryId;
  if (req.body.images) updateData.images = req.body.images;
  if (req.body.attributes) updateData.attributes = req.body.attributes;

  updateData.updated_at = new Date().toISOString();

  const { data: product, error } = await supabase
    .from("products")
    .update(updateData)
    .eq("id", req.params.id)
    .eq("seller_id", seller.id)
    .select()
    .single();

  if (error || !product) {
    res.status(404).json({ success: false, error: "Product not found or not yours" });
    return;
  }
  res.json({ success: true, data: { ...product, _id: product.id } });
});

// GET /seller/orders
router.get("/orders", requireRole("seller", "admin"), async (req, res) => {
  const { data: seller } = await supabase
    .from("sellers")
    .select("id")
    .eq("user_id", req.user!.userId)
    .single();

  if (!seller) {
    res.status(404).json({ success: false, error: "Seller not found" });
    return;
  }

  // Filter orders by items containing this seller's id
  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .eq("seller_id", seller.id)
    .order("created_at", { ascending: false });

  if (error) {
    res.status(500).json({ success: false, error: error.message });
    return;
  }
  const ordersWithId = (orders || []).map((o: any) => ({ ...o, _id: o.id }));
  res.json({ success: true, data: ordersWithId });
});

export default router;
