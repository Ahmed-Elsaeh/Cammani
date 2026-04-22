import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  sellerId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  price: number;
  currency: string;
  categoryId: mongoose.Types.ObjectId;
  images: string[];
  inventory: number;
  attributes?: Record<string, string>;
  status: "draft" | "active" | "archived";
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    sellerId: { type: Schema.Types.ObjectId, ref: "Seller", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "USD" },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    images: [{ type: String }],
    inventory: { type: Number, default: 0, min: 0 },
    attributes: { type: Map, of: String },
    status: {
      type: String,
      enum: ["draft", "active", "archived"],
      default: "draft",
    },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ProductSchema.index({ title: "text", description: "text" });
ProductSchema.index({ categoryId: 1, status: 1 });
ProductSchema.index({ sellerId: 1, status: 1 });

export const Product = mongoose.model<IProduct>("Product", ProductSchema);
