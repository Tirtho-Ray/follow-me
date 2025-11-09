import { Schema, model } from "mongoose";
import { TOrder } from "./order.interface";

const orderSchema = new Schema<TOrder>(
  {
    influencerId: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },

    platformId: { 
      type: Schema.Types.ObjectId, 
      ref: "SocialPlatform", 
      required: true 
    },

    targetUrl: { 
      type: String, 
      required: true 
    },

    actions: [
      {
        type: {
          type: String,
          enum: ["FOLLOW", "LIKE", "COMMENT"],
          required: true,
        },
        quantity: { type: Number, required: true },
        assignedCount: { type: Number, default: 0 },
        pendingCount: { type: Number, default: 0 },
        completedCount: { type: Number, default: 0 },
        unitPrice: { type: Number },
        totalPrice: { type: Number },
        _id: false, 
      },
    ],
    transaction:{
      type:String
    },

    totalAmount: { type: Number },

    allTasks: [
      { type: Schema.Types.ObjectId, ref: "Task" }
    ],

    status: { 
      type: String, 
      enum: ["PENDING", "RUNNING", "COMPLETED", "CANCELLED"],
      default: "PENDING" 
    },
     isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const OrderModel = model<TOrder>("Order", orderSchema);
