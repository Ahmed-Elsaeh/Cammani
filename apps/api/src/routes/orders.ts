import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { supabase } from "../lib/supabase";

const router = Router();
router.use(authenticate);

// GET /orders/me
router.get("/me", async (req, res) => {
  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", req.user!.userId)
    .order("created_at", { ascending: false });

  if (error) {
    res.status(500).json({ success: false, error: error.message });
    return;
  }
  const ordersWithId = (orders || []).map((o: any) => ({ ...o, _id: o.id }));
  res.json({ success: true, data: ordersWithId });
});

// GET /orders/:id
router.get("/:id", async (req, res) => {
  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", req.params.id)
    .eq("user_id", req.user!.userId)
    .single();

  if (error || !order) {
    res.status(404).json({ success: false, error: "Order not found" });
    return;
  }
  res.json({ success: true, data: { ...order, _id: order.id } });
});

export default router;
