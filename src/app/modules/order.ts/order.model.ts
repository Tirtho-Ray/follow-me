import { Schema, model } from "mongoose";
import { TOrder } from "./order.interface";


const orderSchema = new Schema<TOrder>({
  influencerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  platform: { type: String, required: true },
  type: { type: String, required: true },
  targetUrl: { type: String, required: true },
  quantity: { type: Number, required: true },
  pricePerUnit: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  completedCount: { type: Number, default: 0 },
  status: { type: String, default: "PENDING" },
}, { timestamps: true });

export const OrderModel = model<TOrder>("Order", orderSchema);
