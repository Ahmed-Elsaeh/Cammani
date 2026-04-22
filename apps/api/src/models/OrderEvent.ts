import mongoose, { Schema, Document } from "mongoose";

export interface IOrderEvent extends Document {
  orderId?: mongoose.Types.ObjectId;
  stripeEventId: string;
  type: string;
  payload: Record<string, unknown>;
  processedAt: Date;
  createdAt: Date;
}

const OrderEventSchema = new Schema<IOrderEvent>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order" },
    stripeEventId: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    payload: { type: Schema.Types.Mixed, required: true },
    processedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const OrderEvent = mongoose.model<IOrderEvent>("OrderEvent", OrderEventSchema);
