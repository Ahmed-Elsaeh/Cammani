import { Router } from "express";
import { supabase } from "../lib/supabase";

const router = Router();

// GET /products
router.get("/", async (req, res) => {
  const { q, category, page = "1", limit = "20", minPrice, maxPrice, sort } = req.query as Record<string, string>;
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
  const from = (pageNum - 1) * limitNum;
  const to = from + limitNum - 1;

  let query = supabase
    .from("products")
    .select("*, sellers(store_name)", { count: "exact" })
    .eq("status", "active");

  if (q) {
    query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`);
  }
  if (category) {
    query = query.eq("category_id", category);
  }
  if (minPrice) {
    query = query.gte("price", parseFloat(minPrice));
  }
  if (maxPrice) {
    query = query.lte("price", parseFloat(maxPrice));
  }

  // Sorting
  switch (sort) {
    case "price_asc":
      query = query.order("price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false });
      break;
    case "rating":
      query = query.order("rating", { ascending: false });
      break;
    case "newest":
    default:
      query = query.order("created_at", { ascending: false });
      break;
  }

  const { data: items, count, error } = await query.range(from, to);

  if (error) {
    res.status(500).json({ success: false, error: error.message });
    return;
  }

  const total = count || 0;
  const itemsWithId = (items || []).map(i => ({ ...i, _id: i.id }));

  res.json({
    success: true,
    data: {
      items: itemsWithId,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
  });
});

// GET /products/:id
router.get("/:id", async (req, res) => {
  const { data: product, error } = await supabase
    .from("products")
    .select("*, sellers(store_name, description), categories(name, slug)")
    .eq("id", req.params.id)
    .single();

  if (error || !product) {
    res.status(404).json({ success: false, error: "Product not found" });
    return;
  }
  res.json({ success: true, data: { ...product, _id: product.id } });
});

// GET /categories
router.get("/categories/all", async (_req, res) => {
  const { data: categories, error } = await supabase
    .from("categories")
    .select("*")
    .order("order", { ascending: true });

  if (error) {
    res.status(500).json({ success: false, error: error.message });
    return;
  }
  res.json({ success: true, data: categories });
});

export default router;
