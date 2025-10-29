import { Schema, model } from "mongoose";
import { TTask } from "./task.interface";

const taskProofSchema = new Schema(
  {
    actionType: {
      type: String,
      enum: ["FOLLOW", "LIKE", "COMMENT"],
    },
    quantity: {
      type: Number,
      default: 1, 
      min: 1,
    },
    screenshotUrls: {
      type: [String],
      required: true,
      validate: {
        validator: (arr: string[]) => arr.length > 0,
        message: "At least one screenshot URL is required",
      },
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    verifiedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    verifiedAt: {
      type: Date,
    },
  },
  { _id: false } 
);

const taskSchema = new Schema<TTask>(
  {
    workerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    proofs: {
      type: [taskProofSchema],
      required: true,
    },
    overallStatus: {
      type: String,
      enum: ["PENDING", "PARTIAL_APPROVED", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

export const TaskModel = model<TTask>("Task", taskSchema);
