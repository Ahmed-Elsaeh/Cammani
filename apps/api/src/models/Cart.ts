import mongoose, { Schema, Document } from "mongoose";

export interface ICartItem {
  productId: mongoose.Types.ObjectId;
  qty: number;
  priceSnapshot: number;
  titleSnapshot: string;
  imageSnapshot: string;
  sellerId: mongoose.Types.ObjectId;
}

export interface ICart extends Document {
  userId: mongoose.Types.ObjectId;
  items: ICartItem[];
  updatedAt: Date;
}

const CartItemSchema = new Schema<ICartItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    qty: { type: Number, required: true, min: 1 },
    priceSnapshot: { type: Number, required: true },
    titleSnapshot: { type: String, required: true },
    imageSnapshot: { type: String, required: true },
    sellerId: { type: Schema.Types.ObjectId, ref: "Seller", required: true },
  },
  { _id: false }
);

const CartSchema = new Schema<ICart>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    items: [CartItemSchema],
  },
  { timestamps: true }
);

export const Cart = mongoose.model<ICart>("Cart", CartSchema);
