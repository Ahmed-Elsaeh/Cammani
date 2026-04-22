import { Router } from "express";
import { Product } from "../models/Product";
import { Category } from "../models/Category";

const router = Router();

// GET /products
router.get("/", async (req, res) => {
  const { q, category, page = "1", limit = "20", minPrice, maxPrice, sort } = req.query as Record<string, string>;
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filter: Record<string, any> = { status: "active" };
  if (q) filter.$text = { $search: q };
  if (category) filter.categoryId = category;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = parseFloat(minPrice);
    if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
  }

  const sortMap: Record<string, object> = {
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    rating: { rating: -1 },
    newest: { createdAt: -1 },
  };
  const sortQuery = sortMap[sort] || (q ? { score: { $meta: "textScore" } } : { createdAt: -1 });

  const [items, total] = await Promise.all([
    Product.find(filter)
      .sort(sortQuery)
      .skip(skip)
      .limit(limitNum)
      .populate("sellerId", "storeName")
      .lean(),
    Product.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: {
      items,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
  });
});

// GET /products/:id
router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate("sellerId", "storeName description")
    .populate("categoryId", "name slug")
    .lean();
  if (!product) {
    res.status(404).json({ success: false, error: "Product not found" });
    return;
  }
  res.json({ success: true, data: product });
});

// GET /categories
router.get("/categories/all", async (_req, res) => {
  const categories = await Category.find().sort({ order: 1 }).lean();
  res.json({ success: true, data: categories });
});

export default router;
