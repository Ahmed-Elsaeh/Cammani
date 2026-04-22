import mongoose, { Schema, Document } from "mongoose";

export interface IStripeAccount extends Document {
  sellerId: mongoose.Types.ObjectId;
  connectAccountId: string;
  onboardingStatus: "not_started" | "pending" | "complete";
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const StripeAccountSchema = new Schema<IStripeAccount>(
  {
    sellerId: { type: Schema.Types.ObjectId, ref: "Seller", required: true, unique: true },
    connectAccountId: { type: String, required: true },
    onboardingStatus: {
      type: String,
      enum: ["not_started", "pending", "complete"],
      default: "not_started",
    },
    chargesEnabled: { type: Boolean, default: false },
    payoutsEnabled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const StripeAccount = mongoose.model<IStripeAccount>("StripeAccount", StripeAccountSchema);
