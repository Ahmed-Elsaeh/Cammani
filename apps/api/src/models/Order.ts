import mongoose, { Schema, Document } from "mongoose";

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  sellerId: mongoose.Types.ObjectId;
  title: string;
  image: string;
  qty: number;
  unitPrice: number;
}

export interface IOrder extends Document {
  buyerId: mongoose.Types.ObjectId;
  items: IOrderItem[];
  subtotal: number;
  total: number;
  status: "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded" | "failed";
  stripeCheckoutSessionId?: string;
  stripePaymentIntentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    sellerId: { type: Schema.Types.ObjectId, ref: "Seller", required: true },
    title: { type: String, required: true },
    image: { type: String, required: true },
    qty: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    buyerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded", "failed"],
      default: "pending",
    },
    stripeCheckoutSessionId: { type: String },
    stripePaymentIntentId: { type: String },
  },
  { timestamps: true }
);

OrderSchema.index({ buyerId: 1, createdAt: -1 });
OrderSchema.index({ "items.sellerId": 1, createdAt: -1 });

export const Order = mongoose.model<IOrder>("Order", OrderSchema);
