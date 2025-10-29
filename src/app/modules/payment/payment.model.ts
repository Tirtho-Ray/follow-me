import { Types } from "mongoose";

export interface TPayment {
  workerId: Types.ObjectId;
  orderId: Types.ObjectId;
  taskId: Types.ObjectId;
  TotalAmount: number;
  status: "PENDING" | "APPROVED" | "PAID";
  createdAt?: Date;
  updatedAt?: Date;
}
