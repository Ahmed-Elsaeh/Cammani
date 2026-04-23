import { supabase } from "./lib/supabase";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

async function seed() {
  console.log("🌱 Starting seed...");

  // 1. Clear existing data (Optional, but good for clean seed)
  // Note: Order matters due to foreign keys
  await supabase.from("products").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("sellers").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("categories").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("users").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  console.log("✅ Cleared old data");

  // 2. Create Categories
  const categoriesData = [
    { name: "Electronics", slug: "electronics", icon: "💻", order: 1 },
    { name: "Fashion", slug: "fashion", icon: "👗", order: 2 },
    { name: "Home & Garden", slug: "home-garden", icon: "🏡", order: 3 },
    { name: "Sports", slug: "sports", icon: "⚽", order: 4 },
  ];

  const { data: categories, error: catError } = await supabase
    .from("categories")
    .insert(categoriesData)
    .select();

  if (catError) throw catError;
  console.log(`✅ Created ${categories.length} categories`);

  // 3. Create Sellers (and their Users)
  const passwordHash = await bcrypt.hash("password123", 10);
  
  const sellersData = [
    { name: "Tech Giant", email: "tech@example.com", store: "Tech Giant Official" },
    { name: "Urban Style", email: "style@example.com", store: "Urban Style" },
    { name: "Home Comforts", email: "home@example.com", store: "Home Comforts" },
  ];

  const createdSellers: any[] = [];

  for (const s of sellersData) {
    const { data: user, error: uError } = await supabase
      .from("users")
      .insert([{
        email: s.email,
        name: s.name,
        password_hash: passwordHash,
        roles: ["seller"]
      }])
      .select()
      .single();

    if (uError) throw uError;

    const { data: seller, error: sError } = await supabase
      .from("sellers")
      .insert([{
        user_id: user.id,
        store_name: s.store,
        description: `Best ${s.store} products in town.`,
        status: "active"
      }])
      .select()
      .single();

    if (sError) throw sError;
    createdSellers.push(seller);
  }

  console.log(`✅ Created ${createdSellers.length} sellers`);

  // 4. Create Products (15 products)
  const products = [
    // Electronics
    { title: "Quantum Pro Smartphone", price: 899.99, category: "electronics", sellerIdx: 0, img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800" },
    { title: "UltraBook Air 15", price: 1299.99, category: "electronics", sellerIdx: 0, img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800" },
    { title: "Noise Cancel Pro Headphones", price: 299.99, category: "electronics", sellerIdx: 0, img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800" },
    { title: "Smart Watch Series X", price: 399.99, category: "electronics", sellerIdx: 0, img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800" },
    
    // Fashion
    { title: "Classic Denim Jacket", price: 79.99, category: "fashion", sellerIdx: 1, img: "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=800" },
    { title: "Premium Cotton Tee", price: 29.99, category: "fashion", sellerIdx: 1, img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800" },
    { title: "Designer Sunglasses", price: 159.99, category: "fashion", sellerIdx: 1, img: "https://images.unsplash.com/photo-1511499767390-a7335958beba?w=800" },
    { title: "Leather Chelsea Boots", price: 189.99, category: "fashion", sellerIdx: 1, img: "https://images.unsplash.com/photo-1520639889410-1dfa42d50e8d?w=800" },

    // Home & Garden
    { title: "Ergonomic Office Chair", price: 249.99, category: "home-garden", sellerIdx: 2, img: "https://images.unsplash.com/photo-1505843490701-5be5d2b33250?w=800" },
    { title: "Modern Ceramic Vase", price: 45.00, category: "home-garden", sellerIdx: 2, img: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=800" },
    { title: "Smart LED Floor Lamp", price: 89.00, category: "home-garden", sellerIdx: 2, img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800" },
    { title: "Indoor Plant Set (3pcs)", price: 55.00, category: "home-garden", sellerIdx: 2, img: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800" },

    // Sports
    { title: "Pro Carbon Fiber Bike", price: 2499.00, category: "sports", sellerIdx: 0, img: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800" },
    { title: "Yoga Mat - Eco Friendly", price: 40.00, category: "sports", sellerIdx: 1, img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800" },
    { title: "Adjustable Dumbbell Set", price: 199.99, category: "sports", sellerIdx: 2, img: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800" },
  ];

  const productsToInsert = products.map(p => {
    const category = (categories as any[]).find(c => c.slug === p.category);
    const seller = (createdSellers as any[])[p.sellerIdx];
    return {
      title: p.title,
      description: `This is a premium ${p.title} that you will love. High quality and durable.`,
      price: p.price,
      currency: "USD",
      category_id: category.id,
      seller_id: seller.id,
      images: [p.img],
      inventory: Math.floor(Math.random() * 50) + 10,
      status: "active",
      rating: 4 + Math.random(),
      review_count: Math.floor(Math.random() * 200) + 20
    };
  });

  const { error: prodError } = await supabase
    .from("products")
    .insert(productsToInsert);

  if (prodError) throw prodError;
  console.log(`✅ Created ${productsToInsert.length} products`);

  console.log("🚀 Seed completed successfully!");
}

seed().catch(err => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
