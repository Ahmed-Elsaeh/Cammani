import { z } from "zod";

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
  role: z.enum(["buyer", "seller"]).default("buyer"),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type RegisterDto = z.infer<typeof RegisterSchema>;
export type LoginDto = z.infer<typeof LoginSchema>;

// ─── User ─────────────────────────────────────────────────────────────────────

export type UserRole = "buyer" | "seller" | "admin";

export interface UserDto {
  _id: string;
  email: string;
  name: string;
  roles: UserRole[];
  createdAt: string;
}

// ─── Seller ───────────────────────────────────────────────────────────────────

export const SellerApplySchema = z.object({
  storeName: z.string().min(2),
  description: z.string().optional(),
  returnPolicy: z.string().optional(),
  shippingPolicy: z.string().optional(),
});

export type SellerApplyDto = z.infer<typeof SellerApplySchema>;

export interface SellerDto {
  _id: string;
  userId: string;
  storeName: string;
  description?: string;
  status: "pending" | "active" | "suspended";
  stripeConnectStatus: "not_started" | "pending" | "complete";
}

// ─── Category ─────────────────────────────────────────────────────────────────

export interface CategoryDto {
  _id: string;
  name: string;
  slug: string;
  parentId?: string;
  icon?: string;
}

// ─── Product ──────────────────────────────────────────────────────────────────

export const CreateProductSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  price: z.number().positive(),
  currency: z.string().default("USD"),
  categoryId: z.string(),
  images: z.array(z.string().url()).min(1),
  inventory: z.number().int().min(0),
  attributes: z.record(z.string()).optional(),
});

export type CreateProductDto = z.infer<typeof CreateProductSchema>;

export interface ProductDto {
  _id: string;
  sellerId: string;
  sellerName: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  categoryId: string;
  images: string[];
  inventory: number;
  attributes?: Record<string, string>;
  status: "draft" | "active" | "archived";
  rating?: number;
  reviewCount?: number;
  createdAt: string;
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export interface CartItemDto {
  productId: string;
  title: string;
  image: string;
  price: number;
  qty: number;
  sellerId: string;
  sellerName: string;
  maxQty: number;
}

export interface CartDto {
  _id: string;
  userId: string;
  items: CartItemDto[];
  subtotal: number;
}

export const UpdateCartSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      qty: z.number().int().min(0),
    })
  ),
});

export type UpdateCartDto = z.infer<typeof UpdateCartSchema>;

// ─── Order ────────────────────────────────────────────────────────────────────

export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export interface OrderItemDto {
  productId: string;
  sellerId: string;
  title: string;
  image: string;
  qty: number;
  unitPrice: number;
}

export interface OrderDto {
  _id: string;
  buyerId: string;
  items: OrderItemDto[];
  subtotal: number;
  total: number;
  status: OrderStatus;
  stripeCheckoutSessionId?: string;
  createdAt: string;
}

// ─── Checkout ─────────────────────────────────────────────────────────────────

export interface CheckoutSessionResponseDto {
  url: string;
  sessionId: string;
}

// ─── API Response ─────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
