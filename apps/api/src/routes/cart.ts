import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { Cart } from "../models/Cart";
import { Product } from "../models/Product";
import { UpdateCartSchema } from "@cammani/shared";

const router = Router();
router.use(authenticate);

// GET /cart
router.get("/", async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user!.userId }).lean();
  if (!cart) {
    res.json({ success: true, data: { items: [], subtotal: 0 } });
    return;
  }
  const subtotal = cart.items.reduce((sum, i) => sum + i.priceSnapshot * i.qty, 0);
  res.json({ success: true, data: { ...cart, subtotal } });
});

// PUT /cart — full replace (merge is handled client-side)
router.put("/", validate(UpdateCartSchema), async (req, res) => {
  const { items } = req.body as { items: { productId: string; qty: number }[] };
  const userId = req.user!.userId;

  // Filter out qty=0 items
  const wanted = items.filter((i) => i.qty > 0);

  if (wanted.length === 0) {
    await Cart.findOneAndUpdate({ userId }, { $set: { items: [] } }, { upsert: true });
    res.json({ success: true, data: { items: [], subtotal: 0 } });
    return;
  }

  // Fetch products for snapshots
  const productIds = wanted.map((i) => i.productId);
  const products = await Product.find({ _id: { $in: productIds }, status: "active" }).lean();

  const productMap = new Map(products.map((p) => [p._id.toString(), p]));

  const cartItems = wanted
    .filter((i) => productMap.has(i.productId))
    .map((i) => {
      const p = productMap.get(i.productId)!;
      return {
        productId: p._id,
        qty: Math.min(i.qty, p.inventory),
        priceSnapshot: p.price,
        titleSnapshot: p.title,
        imageSnapshot: p.images[0] || "",
        sellerId: p.sellerId,
      };
    });

  const cart = await Cart.findOneAndUpdate(
    { userId },
    { $set: { items: cartItems } },
    { new: true, upsert: true }
  );

  const subtotal = cart.items.reduce((sum, i) => sum + i.priceSnapshot * i.qty, 0);
  res.json({ success: true, data: { ...cart.toObject(), subtotal } });
});

export default router;
