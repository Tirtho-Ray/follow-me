import { Types } from "mongoose";

export type OrderType = "FOLLOW" | "LIKE" | "COMMENT";

export interface TOrder {
  influencerId: Types.ObjectId;
  platform: "Facebook" | "Instagram" | "TikTok" | "YouTube";
  type: OrderType; // FOLLOW, LIKE, COMMENT
  targetUrl: string; // link to post or profile
  quantity: number; // e.g., 1000 followers
  pricePerUnit: number; // e.g., 0.002
  totalAmount: number; // quantity * pricePerUnit

  completedCount?: number;
  status: "PENDING" | "RUNNING" | "COMPLETED" | "CANCELLED";

  createdAt?: Date;
  updatedAt?: Date;
}
