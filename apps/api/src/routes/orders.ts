import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { Order } from "../models/Order";

const router = Router();
router.use(authenticate);

// GET /orders/me
router.get("/me", async (req, res) => {
  const orders = await Order.find({ buyerId: req.user!.userId })
    .sort({ createdAt: -1 })
    .lean();
  res.json({ success: true, data: orders });
});

// GET /orders/:id
router.get("/:id", async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    buyerId: req.user!.userId,
  }).lean();
  if (!order) { res.status(404).json({ success: false, error: "Order not found" }); return; }
  res.json({ success: true, data: order });
});

export default router;
