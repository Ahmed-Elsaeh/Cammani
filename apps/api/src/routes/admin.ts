import { Router } from "express";
import { authenticate, requireRole } from "../middleware/auth";
import { supabase } from "../lib/supabase";
import { z } from "zod";

const router = Router();

// All routes here require admin role
router.use(authenticate, requireRole("admin"));

// ── Sellers Management ─────────────────────────────────────────────────────────

// List all sellers (optionally filter by status)
router.get("/sellers", async (req, res) => {
  const { status } = req.query;
  let query = supabase
    .from("sellers")
    .select(`
      *,
      users (
        name,
        email
      )
    `)
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) throw error;
  res.json({ success: true, data });
});

// Approve or Deny a seller
router.patch("/sellers/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // active or suspended or pending

  if (!["active", "suspended", "pending"].includes(status)) {
    return res.status(400).json({ success: false, error: "Invalid status" });
  }

  const { data, error } = await supabase
    .from("sellers")
    .update({ status, updated_at: new Date() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  // If approved, ensure user has 'seller' role
  if (status === "active") {
    const { data: seller } = await supabase.from("sellers").select("user_id").eq("id", id).single();
    if (seller) {
      const { data: user } = await supabase.from("users").select("roles").eq("id", seller.user_id).single();
      if (user && !user.roles.includes("seller")) {
        await supabase
          .from("users")
          .update({ roles: [...user.roles, "seller"] })
          .eq("id", seller.user_id);
      }
    }
  }

  res.json({ success: true, data });
});

// ── Products Management ────────────────────────────────────────────────────────

// List all products
router.get("/products", async (req, res) => {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      sellers (
        store_name
      ),
      categories (
        name
      )
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;
  res.json({ success: true, data });
});

// Update product (admin can edit any product)
router.patch("/products/:id", async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const { data, error } = await supabase
    .from("products")
    .update({ ...updates, updated_at: new Date() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  res.json({ success: true, data });
});

// ── Categories Management ──────────────────────────────────────────────────────

// Create category
router.post("/categories", async (req, res) => {
  const { name, slug, parent_id, icon, order } = req.body;

  const { data, error } = await supabase
    .from("categories")
    .insert([{ name, slug, parent_id, icon, order }])
    .select()
    .single();

  if (error) throw error;
  res.json({ success: true, data });
});

// Update category
router.patch("/categories/:id", async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const { data, error } = await supabase
    .from("categories")
    .update({ ...updates, updated_at: new Date() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  res.json({ success: true, data });
});

// Delete category
router.delete("/categories/:id", async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) throw error;
  res.json({ success: true });
});

export default router;
