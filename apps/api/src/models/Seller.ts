import mongoose, { Schema, Document } from "mongoose";

export interface ISeller extends Document {
  userId: mongoose.Types.ObjectId;
  storeName: string;
  description?: string;
  returnPolicy?: string;
  shippingPolicy?: string;
  status: "pending" | "active" | "suspended";
  createdAt: Date;
  updatedAt: Date;
}

const SellerSchema = new Schema<ISeller>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    storeName: { type: String, required: true, trim: true },
    description: { type: String },
    returnPolicy: { type: String },
    shippingPolicy: { type: String },
    status: {
      type: String,
      enum: ["pending", "active", "suspended"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Seller = mongoose.model<ISeller>("Seller", SellerSchema);
